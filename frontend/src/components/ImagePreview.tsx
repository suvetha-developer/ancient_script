import type { SelectedFile } from "../types";

interface ImagePreviewProps {
  selected: SelectedFile;
  onRemove: () => void;
  onReplace: () => void;
  onAnalyze: () => void;
  analyzing?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sourceLabel(source: SelectedFile["source"]): string {
  switch (source) {
    case "camera":
      return "Camera capture";
    case "gallery":
      return "Gallery image";
    case "document":
      return "Document upload";
  }
}

export function ImagePreview({
  selected,
  onRemove,
  onReplace,
  onAnalyze,
  analyzing,
}: ImagePreviewProps) {
  const { file, previewUrl, source } = selected;
  const isPdf = file.type === "application/pdf";

  return (
    <section className="animate-fade-up rounded-2xl border border-stone-700/60 bg-stone-900/40 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-stone-50">Image Preview</h2>
      <p className="mt-1 text-sm text-stone-400">
        Review your selection before starting analysis
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-xl border border-stone-700 bg-stone-950">
          {isPdf ? (
            <div className="flex aspect-square flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="text-4xl">📄</span>
              <p className="text-sm text-stone-300">PDF document selected</p>
              <p className="text-xs text-stone-500">Preview not available</p>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Inscription preview"
              className="aspect-square w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col justify-between gap-5">
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-stone-800 pb-2">
              <dt className="text-stone-400">File name</dt>
              <dd className="truncate font-medium text-stone-100">{file.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-800 pb-2">
              <dt className="text-stone-400">File type</dt>
              <dd className="font-medium text-stone-100">
                {file.type || "Unknown"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-stone-800 pb-2">
              <dt className="text-stone-400">File size</dt>
              <dd className="font-medium text-stone-100">
                {formatFileSize(file.size)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-400">Source</dt>
              <dd className="font-medium text-stone-100">{sourceLabel(source)}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRemove}
              disabled={analyzing}
              className="rounded-lg border border-stone-600 px-4 py-2 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-50"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={onReplace}
              disabled={analyzing}
              className="rounded-lg border border-stone-600 px-4 py-2 text-sm text-stone-300 transition hover:bg-stone-800 disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onAnalyze}
              disabled={analyzing}
              className="ml-auto rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {analyzing ? "Analyzing..." : "Analyze Inscription"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
