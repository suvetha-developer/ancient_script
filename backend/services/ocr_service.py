import os
import cv2
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
import tensorflow as tf
from backend.config import MODELS_DIR, TAMIL_CLASSES, TAMIL_CLASS_NAMES, CONFIDENCE_THRESHOLD
from backend.services.preprocessing_service import extract_glyph_patch

class OCRService:
    def __init__(self, model_path: Optional[Path] = None):
        self.model_path = model_path or MODELS_DIR
        self.model = None
        self.infer_fn = None
        self._load_model()
        
    def _load_model(self):
        try:
            print(f"[OCRService] Loading SavedModel from: {self.model_path}")
            self.model = tf.saved_model.load(str(self.model_path))
            self.infer_fn = self.model.signatures['serving_default']
            print("[OCRService] Model loaded successfully.")
        except Exception as e:
            print(f"[OCRService] Error loading model: {e}")
            self.infer_fn = None
            
    def predict_patches(self, patches: List[np.ndarray]) -> List[Tuple[int, float, List[float]]]:
        """
        Runs batch inference on a list of (50, 50, 3) BGR patches.
        Returns [(pred_class, confidence, probabilities)]
        """
        if not patches:
            return []
            
        if self.infer_fn is None:
            # Fallback if model not loaded
            return [(0, 0.5, [1.0/28]*28) for _ in patches]
            
        # Convert BGR to RGB and float32 normalized [0, 1]
        batch = []
        for p in patches:
            rgb = cv2.cvtColor(p, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
            batch.append(rgb)
            
        tensor_in = tf.constant(np.array(batch, dtype=np.float32))
        res = self.infer_fn(tensor_in)
        # Output tensor key is 'dense_14'
        dense_out = res['dense_14'].numpy()
        
        results = []
        for row in dense_out:
            pred_idx = int(np.argmax(row))
            conf = float(row[pred_idx])
            probs = [float(x) for x in row]
            results.append((pred_idx, conf, probs))
            
        return results

    def recognize_inscription(self, img_bgr: np.ndarray, glyph_bboxes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Recognizes all glyphs in an inscription image using the CNN model.
        Returns:
            {
                'recognized_characters': ['க', 'ர', ...],
                'recognized_text': 'கர...',
                'average_confidence': float,
                'glyphs_data': [
                    {'bbox': {...}, 'character': 'க', 'class_name': 'Ka (க)', 'confidence': 0.99, 'uncertain': False}
                ],
                'detected_script': 'Tamil-Brahmi' | 'Vatteluttu' | 'Early Grantha',
                'is_single_glyph': bool
            }
        """
        h_img, w_img = img_bgr.shape[:2]
        is_single = (len(glyph_bboxes) == 1 and (glyph_bboxes[0]['w'] > w_img * 0.7 or glyph_bboxes[0]['h'] > h_img * 0.7))
        
        # Extract patches
        patches = [extract_glyph_patch(img_bgr, bbox) for bbox in glyph_bboxes]
        
        # Run model inference
        predictions = self.predict_patches(patches)
        
        glyphs_data = []
        char_list = []
        confs = []
        has_grantha = False
        
        for bbox, (pred_idx, conf, probs) in zip(glyph_bboxes, predictions):
            char_symbol = TAMIL_CLASSES[pred_idx]
            class_name = TAMIL_CLASS_NAMES[pred_idx]
            uncertain = conf < CONFIDENCE_THRESHOLD
            
            if char_symbol == "ஸ்ரீ":
                has_grantha = True
                
            glyphs_data.append({
                "bbox": bbox,
                "class_index": pred_idx,
                "character": char_symbol,
                "class_name": class_name,
                "confidence": round(conf, 4),
                "uncertain": uncertain
            })
            char_list.append(char_symbol)
            confs.append(conf)
            
        avg_conf = float(np.mean(confs)) if confs else 0.0
        recognized_text = "".join(char_list)
        
        # Determine script classification
        if has_grantha:
            detected_script = "Early Grantha / Transitional Tamil"
        elif is_single:
            detected_script = "Tamil-Brahmi / Vatteluttu Glyph"
        elif len(char_list) > 10:
            detected_script = "Tamil-Brahmi Stone Inscription"
        else:
            detected_script = "Tamil-Brahmi"
            
        return {
            "recognized_characters": char_list,
            "recognized_text": recognized_text,
            "average_confidence": round(avg_conf, 4),
            "glyphs_data": glyphs_data,
            "detected_script": detected_script,
            "is_single_glyph": is_single,
            "total_glyphs": len(glyph_bboxes)
        }

# Global singleton
ocr_service = OCRService()
