import { useRef, useState } from "react";
import {
  UploadCloud,
  Camera,
  FolderOpen,
  X,
  FileImage,
  RefreshCw,
} from "lucide-react";
import type { SelectedFile, UploadSource } from "../types";

interface UploadSectionProps {
  selected: SelectedFile | null;
  onSelect: (file: File, source: UploadSource) => void;
  onRemove: () => void;
  disabled?: boolean;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export function UploadSection({
  selected,
  onSelect,
  onRemove,
  disabled,
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const takeFile = (file: File | undefined, source: UploadSource) => {
    if (!file || !isImageFile(file)) return;
    onSelect(file, source);
  };

  const startWebcam = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      // Fallback to camera file input if getUserMedia is not permitted
      cameraInputRef.current?.click();
      setCameraActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera_capture_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        takeFile(file, "camera");
        stopWebcam();
      }
    }, "image/jpeg");
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          takeFile(e.target.files?.[0], "gallery");
          e.target.value = "";
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          takeFile(e.target.files?.[0], "camera");
          e.target.value = "";
        }}
      />

      {/* Live Camera View Modal */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/40 bg-[#1c1410] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-playfair text-base font-bold text-amber-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                Capture Ancient Inscription
              </h3>
              <button
                onClick={stopWebcam}
                className="text-stone-400 hover:text-stone-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-6 border-2 border-dashed border-amber-400/60 rounded-lg pointer-events-none" />
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 font-bold text-stone-950 transition hover:bg-amber-400 shadow-lg"
              >
                <Camera className="w-4 h-4" />
                Capture Frame
              </button>
              <button
                type="button"
                onClick={stopWebcam}
                className="rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (disabled) return;
          takeFile(e.dataTransfer.files[0], "gallery");
        }}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 backdrop-blur-md ${
          dragging
            ? "border-amber-400 bg-amber-500/15 scale-[1.01]"
            : "border-gold-500/35 bg-[#1e1511]/92 hover:border-gold-500/60 hover:bg-[#231914]/95 shadow-2xl"
        }`}
      >
        {selected && isImageFile(selected.file) ? (
          <div className="mx-auto max-w-lg">
            {/* Selected Inscription Preview */}
            <div className="relative group mx-auto max-h-72 overflow-hidden rounded-xl border border-gold-500/40 bg-stone-950/80 p-2 shadow-xl">
              <img
                src={selected.previewUrl}
                alt="Selected Inscription"
                className="mx-auto max-h-64 w-full rounded-lg object-contain"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={onRemove}
                title="Remove image"
                className="absolute top-4 right-4 rounded-full bg-stone-950/80 p-2 text-stone-300 hover:bg-rose-500 hover:text-white transition shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-stone-300 font-mono">
              <FileImage className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-xs">{selected.file.name}</span>
              <span className="text-stone-500">
                ({(selected.file.size / 1024).toFixed(0)} KB)
              </span>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900/90 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800 transition disabled:opacity-50"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                Change Image
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={onRemove}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Camera / Upload Icon (as seen in screenshots) */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 via-stone-900 to-amber-900/30 border border-amber-500/40 text-amber-400 shadow-lg mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  fill="#c9a227"
                  fillOpacity="0.18"
                />
                <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>

            {/* Title & Prompt */}
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-stone-100">
              Upload Inscription Image
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-400 max-w-md">
              Drag & Drop your image here or choose from your device
            </p>

            {/* Three Action Buttons: Choose Image, Use Camera, Browse */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-stone-900 border border-gold-500/50 px-5 py-2.5 text-xs sm:text-sm font-semibold text-amber-300 shadow-md transition-all hover:bg-amber-500 hover:text-stone-950 disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Choose Image</span>
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={startWebcam}
                className="flex items-center gap-2 rounded-xl bg-stone-900/90 border border-stone-700/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-200 transition hover:bg-stone-800 hover:border-amber-500/40 disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Use Camera</span>
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-stone-900/90 border border-stone-700/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-200 transition hover:bg-stone-800 hover:border-amber-500/40 disabled:opacity-50"
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>Browse</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
