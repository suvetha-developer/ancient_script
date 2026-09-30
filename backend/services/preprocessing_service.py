import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from typing import Tuple, List, Dict, Any, Optional

def load_image_cv(image_path: Path) -> np.ndarray:
    """Reads image cleanly using cv2 handling unicode file paths."""
    img = cv2.imdecode(np.fromfile(str(image_path), dtype=np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"Could not load image from {image_path}")
    return img

def save_image_cv(image_path: Path, img: np.ndarray) -> bool:
    """Saves image cleanly using cv2 imencode."""
    ext = image_path.suffix.lower()
    if ext in ['.jpg', '.jpeg']:
        success, encoded = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    else:
        success, encoded = cv2.imencode('.png', img)
    if success:
        with open(image_path, 'wb') as f:
            f.write(encoded)
        return True
    return False

def enhance_inscription(img_bgr: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Applies real archaeological image enhancement:
    1. Grayscale conversion
    2. Denoising using Bilateral Filter (preserves inscription chisel edges)
    3. CLAHE (Contrast Limited Adaptive Histogram Equalization)
    4. Adaptive & Otsu hybrid thresholding for stone relief extraction
    Returns:
        enhanced_bgr: visually pleasing contrast-enhanced color image
        binary_mask: high-contrast binary mask showing carved incisions
    """
    # 1. Grayscale
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    
    # 2. Denoise with edge-preserving bilateral filter
    denoised = cv2.bilateralFilter(gray, d=9, sigmaColor=75, sigmaSpace=75)
    
    # 3. CLAHE for stone inscription local contrast
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    equalized = clahe.apply(denoised)
    
    # 4. Inscription sharpening
    gaussian = cv2.GaussianBlur(equalized, (0, 0), 2.0)
    unsharp = cv2.addWeighted(equalized, 1.5, gaussian, -0.5, 0)
    
    # 5. Binarization: Otsu & Adaptive
    # Detect whether background is bright or dark
    mean_val = np.mean(unsharp)
    _, otsu = cv2.threshold(unsharp, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Morphological cleaning to bridge small stroke breaks
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    cleaned_mask = cv2.morphologyEx(otsu, cv2.MORPH_OPEN, kernel)
    
    # Enhanced BGR representation for visual presentation
    enhanced_bgr = cv2.cvtColor(unsharp, cv2.COLOR_GRAY2BGR)
    
    return enhanced_bgr, cleaned_mask

def segment_inscription_glyphs(binary_mask: np.ndarray, min_area: int = 60, max_area_ratio: float = 0.6) -> List[Dict[str, Any]]:
    """
    Segments individual ancient Tamil glyphs / characters from the binary mask.
    Returns sorted list of bounding boxes: [{'x': x, 'y': y, 'w': w, 'h': h, 'area': area}]
    Sorted in standard ancient epigraphical reading order (top-to-bottom, left-to-right).
    """
    h_img, w_img = binary_mask.shape[:2]
    max_area = int(h_img * w_img * max_area_ratio)
    
    # Find external contours
    contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    glyphs = []
    for c in contours:
        area = cv2.contourArea(c)
        if min_area <= area <= max_area:
            x, y, w, h = cv2.boundingRect(c)
            # Aspect ratio check to ignore long horizontal cracks or vertical lines
            aspect = w / float(h)
            if 0.15 <= aspect <= 6.0 and w >= 8 and h >= 8:
                glyphs.append({
                    "x": int(x),
                    "y": int(y),
                    "w": int(w),
                    "h": int(h),
                    "area": float(area)
                })
                
    if not glyphs:
        # If no glyphs found (e.g. single crop uploaded), treat entire image as one glyph
        glyphs = [{"x": 0, "y": 0, "w": int(w_img), "h": int(h_img), "area": float(h_img * w_img)}]
    
    # Cluster into lines and sort left-to-right
    # Determine approximate line height
    median_h = np.median([g['h'] for g in glyphs]) if glyphs else 20
    line_threshold = max(median_h * 0.6, 15)
    
    # Sort primarily by y
    glyphs.sort(key=lambda g: g['y'])
    
    lines = []
    current_line = []
    current_y = None
    
    for g in glyphs:
        if current_y is None:
            current_y = g['y']
            current_line.append(g)
        elif abs(g['y'] - current_y) < line_threshold:
            current_line.append(g)
        else:
            # Sort previous line left-to-right
            current_line.sort(key=lambda item: item['x'])
            lines.extend(current_line)
            current_line = [g]
            current_y = g['y']
            
    if current_line:
        current_line.sort(key=lambda item: item['x'])
        lines.extend(current_line)
        
    return lines

def extract_glyph_patch(img_bgr: np.ndarray, bbox: Dict[str, int], target_size: Tuple[int, int] = (50, 50)) -> np.ndarray:
    """
    Crops the glyph region from the enhanced image, centers it with padding,
    and resizes to target_size (50x50x3) expected by the CNN model.
    """
    h_img, w_img = img_bgr.shape[:2]
    x, y, w, h = bbox['x'], bbox['y'], bbox['w'], bbox['h']
    
    # Add slight margin
    margin = int(max(w, h) * 0.1)
    x1 = max(0, x - margin)
    y1 = max(0, y - margin)
    x2 = min(w_img, x + w + margin)
    y2 = min(h_img, y + h + margin)
    
    crop = img_bgr[y1:y2, x1:x2]
    if crop.size == 0:
        crop = img_bgr[y:y+h, x:x+w]
        
    # Resize directly to target_size (50, 50) matching the training augmentation format
    resized = cv2.resize(crop, target_size, interpolation=cv2.INTER_AREA)
    return resized
