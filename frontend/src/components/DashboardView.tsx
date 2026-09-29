import {
  Scan,
  History,
  Sparkles,
  Zap,
  Target,
  Database,
  Crown,
} from "lucide-react";
import { BenchmarkSection, type BenchmarkItem } from "./BenchmarkSection";

interface DashboardViewProps {
  userName: string;
  onStartAnalysis: () => void;
  onViewArchives: () => void;
  onSelectBenchmark: (file: File, item: BenchmarkItem) => void;
}

export function DashboardView({
  userName,
  onStartAnalysis,
  onViewArchives,
  onSelectBenchmark,
}: DashboardViewProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-up">
      {/* Hero Workspace Banner (Image 2) */}
      <div className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-[#1e1511]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        {/* Subtle Decorative Tamil Watermark Script "தமிழ்" */}
        <div
          className="absolute -right-6 -bottom-10 select-none pointer-events-none text-stone-700/15 font-tamil-serif font-black text-[140px] sm:text-[200px] leading-none z-0"
          aria-hidden="true"
        >
          தமிழ்
        </div>

        <div className="relative z-10 max-w-3xl">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Welcome back, {userName}</span>
          </div>

          {/* Main H1 Title */}
          <h1 className="mt-4 font-playfair text-2xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-stone-100 leading-tight">
            Ancient Tamil Epigraphical AI Workspace
          </h1>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-300/90 max-w-2xl">
            Deciphering Tamil-Brahmi, Vatteluttu, and Early Grantha stone inscriptions
            through deep convolutional neural networks and archaeological context retrieval.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onStartAnalysis}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-xs sm:text-sm font-bold text-stone-950 shadow-lg shadow-amber-900/40 transition-all hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02]"
            >
              <Scan className="w-4 h-4 text-stone-950 stroke-[2.4]" />
              <span>Start New Inscription Analysis</span>
            </button>

            <button
              onClick={onViewArchives}
              className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/80 px-5 py-3 text-xs sm:text-sm font-semibold text-stone-200 transition-all hover:bg-stone-800 hover:border-amber-500/40"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>View Decoded Archives</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards Grid (Image 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Accuracy */}
        <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-[#1e1511]/95 p-4 sm:p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Model Accuracy
            </span>
            <Target className="w-4 h-4 text-amber-400/70" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-100 font-mono">
            94.2%
          </p>
          <p className="mt-1 text-xs text-stone-400 truncate">
            28 Tamil character classes
          </p>
        </div>

        {/* Metric 2: Corpus Records */}
        <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-[#1e1511]/95 p-4 sm:p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Corpus Records
            </span>
            <Database className="w-4 h-4 text-amber-400/70" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-100 font-mono">
            93+
          </p>
          <p className="mt-1 text-xs text-stone-400 truncate">
            Mangulam, Keeladi & Sittanavasal
          </p>
        </div>

        {/* Metric 3: Dynasties */}
        <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-[#1e1511]/95 p-4 sm:p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Historical Dynasties
            </span>
            <Crown className="w-4 h-4 text-amber-400/70" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-100 font-mono">
            4 Eras
          </p>
          <p className="mt-1 text-xs text-stone-400 truncate">
            Pandya, Chera, Chola, Pallava
          </p>
        </div>

        {/* Metric 4: Inference Speed */}
        <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-[#1e1511]/95 p-4 sm:p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Inference Speed
            </span>
            <Zap className="w-4 h-4 text-amber-400/70" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            &lt; 300ms
          </p>
          <p className="mt-1 text-xs text-stone-400 truncate">
            TensorFlow CNN Pipeline
          </p>
        </div>
      </div>

      {/* Curated Benchmark Inscriptions Section (Image 2) */}
      <BenchmarkSection
        onSelectBenchmark={onSelectBenchmark}
        mode="dashboard"
      />
    </div>
  );
}
