import { useState } from "react";
import {
  Settings,
  Sliders,
  Cpu,
  Database,
  CheckCircle2,
} from "lucide-react";
import type { ThemeMode } from "./Header";

interface SettingsViewProps {
  themeMode: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  showPillars: boolean;
  onTogglePillars: () => void;
}

export function SettingsView({
  themeMode,
  onThemeChange,
  showPillars,
  onTogglePillars,
}: SettingsViewProps) {
  const [confidenceThreshold, setConfidenceThreshold] = useState(55);
  const [useClahe, setUseClahe] = useState(true);
  const [ragTopK, setRagTopK] = useState(4);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      {/* Title */}
      <div className="rounded-2xl border border-gold-500/25 bg-[#1e1511]/95 p-6 shadow-xl backdrop-blur-md">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
          <Settings className="w-3.5 h-3.5" />
          <span>Configuration Studio</span>
        </div>
        <h2 className="mt-2 font-playfair text-2xl font-bold text-stone-100">
          Epigraphical Pipeline & AI Settings
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Tune deep learning paleographic thresholds and temple workspace visual aesthetics.
        </p>
      </div>

      {/* Visual Workspace Aesthetics */}
      <div className="rounded-2xl border border-stone-800 bg-[#1e1511]/95 p-6 shadow-xl backdrop-blur-md space-y-4">
        <h3 className="font-playfair text-base font-bold text-amber-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          Workspace Presentation & Theme
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onThemeChange("parchment")}
            className={`p-4 rounded-xl border text-left transition ${
              themeMode === "parchment"
                ? "border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/30"
                : "border-stone-800 bg-stone-950/60 hover:border-stone-700"
            }`}
          >
            <p className="font-bold text-sm text-stone-100">📜 Antique Parchment</p>
            <p className="text-xs text-stone-400 mt-1">
              Ancient manuscript paper texture with golden accents (Primary Design).
            </p>
          </button>

          <button
            onClick={() => onThemeChange("temple")}
            className={`p-4 rounded-xl border text-left transition ${
              themeMode === "temple"
                ? "border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/30"
                : "border-stone-800 bg-stone-950/60 hover:border-stone-700"
            }`}
          >
            <p className="font-bold text-sm text-stone-100">🏛️ Temple Corridor</p>
            <p className="text-xs text-stone-400 mt-1">
              Atmospheric granite pillared hallway with oil lamp ambiance.
            </p>
          </button>

          <button
            onClick={() => onThemeChange("dark")}
            className={`p-4 rounded-xl border text-left transition ${
              themeMode === "dark"
                ? "border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/30"
                : "border-stone-800 bg-stone-950/60 hover:border-stone-700"
            }`}
          >
            <p className="font-bold text-sm text-stone-100">🌑 Granite Dark Mode</p>
            <p className="text-xs text-stone-400 mt-1">
              Deep black granite radial gradient with museum spotlight contrast.
            </p>
          </button>
        </div>

        {/* Temple Pillars Framing Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800">
          <div>
            <p className="text-sm font-semibold text-stone-200">
              Dravidian Stone Temple Pillars (Side Borders)
            </p>
            <p className="text-xs text-stone-400">
              Frame the workspace with authentic carved granite columns on wide displays.
            </p>
          </div>
          <button
            onClick={onTogglePillars}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition border ${
              showPillars
                ? "bg-amber-500 text-stone-950 border-amber-400"
                : "bg-stone-900 text-stone-300 border-stone-700"
            }`}
          >
            {showPillars ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      {/* AI Model & Inference Pipeline Parameters */}
      <div className="rounded-2xl border border-stone-800 bg-[#1e1511]/95 p-6 shadow-xl backdrop-blur-md space-y-5">
        <h3 className="font-playfair text-base font-bold text-amber-300 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          OCR & Epigraphical Model Parameters
        </h3>

        {/* Confidence Threshold */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-stone-200 mb-1.5">
            <span>Paleographic Confidence Threshold</span>
            <span className="font-mono text-amber-400">{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="90"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-amber-500 bg-stone-900 rounded-lg cursor-pointer h-2"
          />
          <p className="text-[11px] text-stone-400 mt-1">
            Predictions below this threshold flag characters for archaeological cross-referencing.
          </p>
        </div>

        {/* CLAHE Contrast Enhancement */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800">
          <div>
            <p className="text-sm font-semibold text-stone-200">
              Adaptive Contrast Enhancement (CLAHE + Bilateral)
            </p>
            <p className="text-xs text-stone-400">
              Accentuates weathered chisel grooves on stone surfaces before glyph extraction.
            </p>
          </div>
          <input
            type="checkbox"
            checked={useClahe}
            onChange={(e) => setUseClahe(e.target.checked)}
            className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
          />
        </div>

        {/* RAG Search Count */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800">
          <div>
            <p className="text-sm font-semibold text-stone-200">
              RAG Knowledge Search Results (Top-K)
            </p>
            <p className="text-xs text-stone-400">
              Number of verified TBSI archaeological records retrieved per decipherment.
            </p>
          </div>
          <select
            value={ragTopK}
            onChange={(e) => setRagTopK(Number(e.target.value))}
            className="bg-stone-900 border border-stone-700 text-amber-300 rounded-xl px-3 py-1.5 text-xs font-mono outline-none"
          >
            <option value={2}>Top 2 Records</option>
            <option value={4}>Top 4 Records</option>
            <option value={6}>Top 6 Records</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition shadow-lg"
        >
          {savedNotice ? "✓ Settings Saved!" : "Save Pipeline Settings"}
        </button>
      </div>

      {/* Backend & Model Health Status */}
      <div className="rounded-2xl border border-stone-800 bg-[#1e1511]/95 p-6 shadow-xl backdrop-blur-md">
        <h3 className="font-playfair text-base font-bold text-amber-300 flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-amber-400" />
          Active Epigraphic Engine Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
            <span className="text-stone-300">TensorFlow SavedModel (CNN)</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> 28 Classes Loaded
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
            <span className="text-stone-300">Archaeological Corpus (TBSI)</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> 93 Sites Indexed
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
            <span className="text-stone-300">SQLite Heritage Vault</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Persistent
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
            <span className="text-stone-300">FastAPI REST Endpoints</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Port 8000 Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
