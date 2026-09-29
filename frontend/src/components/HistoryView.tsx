import { useEffect, useState } from "react";
import {
  History,
  Trash2,
  ExternalLink,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { getAnalysisHistory, deleteAnalysis } from "../services/api";
import type { AnalysisResult } from "../types";

interface HistoryViewProps {
  onSelectRecord: (record: AnalysisResult) => void;
  onNewAnalysis: () => void;
}

export function HistoryView({ onSelectRecord, onNewAnalysis }: HistoryViewProps) {
  const [records, setRecords] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalysisHistory();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this deciphered inscription record?")) return;
    try {
      await deleteAnalysis(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete record");
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3 rounded-2xl border border-gold-500/25 bg-[#1e1511]/95 p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
            <History className="w-3.5 h-3.5" />
            <span>Epigraphic Archives</span>
          </div>
          <h2 className="mt-2 font-playfair text-2xl font-bold text-stone-100">
            Decoded Inscription History
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Persisted archaeological analyses saved in your SQLite epigraphic vault.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-stone-800 bg-[#1e1511]/80">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-sm text-stone-300 font-medium">
            Fetching decoded inscriptions archive...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-300">
          ⚠️ {error}
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-2xl border border-stone-800 bg-[#1e1511]/90 p-12 text-center">
          <History className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="font-playfair text-lg font-bold text-stone-200">
            No deciphered records yet
          </h3>
          <p className="mt-1 text-xs text-stone-400 max-w-sm mx-auto">
            Upload an inscription image or select one of the curated benchmarks to begin AI recognition.
          </p>
          <button
            onClick={onNewAnalysis}
            className="mt-5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map((r) => {
            const confPct = Math.round(r.confidence * 100);
            return (
              <div
                key={r.id}
                onClick={() => onSelectRecord(r)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold-500/20 bg-[#1e1511]/95 p-4 shadow-xl backdrop-blur-md hover:border-amber-500/50 hover:bg-[#241a14] cursor-pointer transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl border border-stone-800 bg-stone-950">
                    <img
                      src={r.originalImageUrl || "/parchment.jpg"}
                      alt={r.filename}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/parchment.jpg";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-amber-400 font-mono truncate">
                        {r.scriptType}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-400">
                        {confPct}% conf
                      </span>
                    </div>

                    <p className="mt-1 font-bold text-stone-100 text-sm truncate font-tamil">
                      {r.recognizedText || r.filename}
                    </p>

                    <p className="mt-1 text-xs text-stone-400 line-clamp-2">
                      {r.translationEnglish || r.meaning}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between border-t border-stone-800/80 pt-2.5 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Saved"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(r.id, e)}
                      title="Delete record"
                      className="p-1 rounded text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold text-xs group-hover:underline">
                      View Report <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
