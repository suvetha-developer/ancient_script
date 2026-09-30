import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

export interface BenchmarkItem {
  id: string;
  name: string;
  tag: string;
  district: string;
  period: string;
  image: string;
}

export const BENCHMARKS: BenchmarkItem[] = [
  {
    id: "TBSI_001",
    name: "Aiyarmalai",
    tag: "Karur • TBSI_001",
    district: "Karur",
    period: "3rd–2nd c. BCE",
    image: "/benchmarks/TBSI_001.jpg",
  },
  {
    id: "TBSI_002",
    name: "Alagarmalai",
    tag: "Madurai • TBSI_002",
    district: "Madurai",
    period: "2nd–1st c. BCE",
    image: "/benchmarks/TBSI_002.jpg",
  },
  {
    id: "TBSI_018",
    name: "Arachalur",
    tag: "Erode • TBSI_018",
    district: "Erode",
    period: "2nd–3rd c. CE",
    image: "/benchmarks/TBSI_018.jpg",
  },
  {
    id: "TBSI_024",
    name: "Edakal",
    tag: "Wayanad • TBSI_024",
    district: "Wayanad",
    period: "3rd c. BCE",
    image: "/benchmarks/TBSI_024.jpg",
  },
  {
    id: "TBSI_025",
    name: "Jambai",
    tag: "Kallakurichi • TBSI_025",
    district: "Kallakurichi",
    period: "1st c. CE",
    image: "/benchmarks/TBSI_025.jpg",
  },
];

interface BenchmarkSectionProps {
  onSelectBenchmark: (file: File, item: BenchmarkItem) => void;
  activeBenchmarkId?: string | null;
  mode?: "dashboard" | "analyze";
}

export function BenchmarkSection({
  onSelectBenchmark,
  activeBenchmarkId,
  mode = "dashboard",
}: BenchmarkSectionProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleClick = async (item: BenchmarkItem) => {
    try {
      setLoadingId(item.id);
      const res = await fetch(item.image);
      const blob = await res.blob();
      const file = new File([blob], `${item.id}_${item.name}.jpg`, {
        type: "image/jpeg",
      });
      onSelectBenchmark(file, item);
    } catch (err) {
      console.error("Failed to load benchmark image:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gold-500/20 bg-[#1e1511]/95 p-5 shadow-2xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        {mode === "dashboard" ? (
          <div>
            <h2 className="font-playfair text-xl font-bold text-stone-100">
              Curated Benchmark Inscriptions
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Authentic Tamil-Brahmi cave engravings from 3rd c. BCE to 1st c. CE. Select to analyze.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              TRY BENCHMARK CAVE & STONE INSCRIPTIONS
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>1-click instant test</span>
        </div>
      </div>

      {/* Benchmark Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {BENCHMARKS.map((item) => {
          const isSelected = activeBenchmarkId === item.id;
          const isLoading = loadingId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              disabled={isLoading}
              className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isSelected
                  ? "border-amber-400 bg-amber-950/40 ring-2 ring-amber-400/50 shadow-amber-900/30"
                  : "border-stone-800 bg-stone-950/80 hover:border-amber-500/50 hover:bg-stone-900"
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-950/80 backdrop-blur-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  </div>
                )}

                {/* Instant Test Hover Badge */}
                <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-stone-950">
                    Analyze <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-2.5">
                <p className="font-semibold text-sm text-stone-100 group-hover:text-amber-300 transition-colors truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                  {item.tag}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
