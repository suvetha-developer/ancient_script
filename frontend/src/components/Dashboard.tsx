import { useCallback, useState } from "react";
import { Header, type NavTab, type ThemeMode } from "./Header";
import { DashboardView } from "./DashboardView";
import { BenchmarkSection, type BenchmarkItem } from "./BenchmarkSection";
import { UploadSection } from "./UploadSection";
import { ProgressTracker } from "./ProgressTracker";
import { ResultsGrid } from "./ResultsGrid";
import { HistoryView } from "./HistoryView";
import { SettingsView } from "./SettingsView";
import { ProfileView } from "./ProfileView";
import { TemplePillar } from "./TempleBorders";
import { analyzeInscription } from "../services/api";
import {
  PIPELINE_STAGES,
  type AnalysisResult,
  type PipelineStage,
  type SelectedFile,
  type UploadSource,
} from "../types";
import { Sparkles, Scan, AlertTriangle } from "lucide-react";

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

function initialStages(): PipelineStage[] {
  return PIPELINE_STAGES.map((stage) => ({
    ...stage,
    status: "pending" as const,
  }));
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [themeMode, setThemeMode] = useState<ThemeMode>("parchment");
  const [showPillars, setShowPillars] = useState(true);

  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userName = userEmail.split("@")[0] || "swethac164";

  const handleSelect = useCallback((file: File, source: UploadSource) => {
    const previewUrl = URL.createObjectURL(file);
    setSelected((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return { file, previewUrl, source };
    });
    setComplete(false);
    setResult(null);
    setError(null);
    setStages(initialStages());
  }, []);

  const handleRemove = useCallback(() => {
    setSelected((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setActiveBenchmarkId(null);
    setComplete(false);
    setResult(null);
    setError(null);
    setStages(initialStages());
  }, []);

  const runAnalysisWithFile = useCallback(
    async (fileToAnalyze: File, previewUrl: string) => {
      if (analyzing) return;

      setAnalyzing(true);
      setComplete(false);
      setResult(null);
      setError(null);

      // Animate pipeline stages
      const stageList = initialStages();
      let stageIdx = 0;

      const advanceStage = () => {
        if (stageIdx < stageList.length) {
          if (stageIdx > 0) stageList[stageIdx - 1]!.status = "done";
          stageList[stageIdx]!.status = "active";
          setStages([...stageList]);
          stageIdx++;
        }
      };

      advanceStage(); // First stage immediately
      const interval = setInterval(advanceStage, 100);

      try {
        const apiResult = await analyzeInscription(fileToAnalyze);
        clearInterval(interval);

        // Mark all stages done immediately
        stageList.forEach((s) => (s.status = "done"));
        setStages([...stageList]);

        const enriched: AnalysisResult = {
          ...apiResult,
          originalImageUrl: apiResult.originalImageUrl || previewUrl,
        };

        setResult(enriched);
        setComplete(true);
      } catch (err) {
        clearInterval(interval);
        stageList.forEach((s) => {
          if (s.status === "active") s.status = "pending";
        });
        setStages([...stageList]);
        setError(
          err instanceof Error ? err.message : "Analysis failed. Please try again."
        );
      } finally {
        setAnalyzing(false);
      }
    },
    [analyzing]
  );

  const runAnalysis = useCallback(() => {
    if (!selected) return;
    runAnalysisWithFile(selected.file, selected.previewUrl);
  }, [selected, runAnalysisWithFile]);

  const handleSelectBenchmark = useCallback(
    (file: File, item: BenchmarkItem) => {
      setActiveBenchmarkId(item.id);
      const previewUrl = URL.createObjectURL(file);
      setSelected({ file, previewUrl, source: "gallery" });
      setComplete(false);
      setResult(null);
      setError(null);
      setStages(initialStages());
      setActiveTab("analyze");

      // Auto-trigger analysis for seamless 1-click test
      runAnalysisWithFile(file, previewUrl);
    },
    [runAnalysisWithFile]
  );

  const handleSelectHistoryRecord = useCallback((record: AnalysisResult) => {
    setResult(record);
    setComplete(true);
    setActiveTab("analyze");
  }, []);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === "parchment") return "temple";
      if (prev === "temple") return "dark";
      return "parchment";
    });
  };

  const getThemeClass = () => {
    if (themeMode === "parchment") return "theme-parchment";
    if (themeMode === "temple") return "theme-temple";
    return "theme-dark";
  };

  return (
    <div className={`min-h-screen w-full bg-[#160e09] text-stone-100 transition-colors duration-500 ${getThemeClass()}`}>
      {/* Top Navbar */}
      <Header
        userName={userName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        themeMode={themeMode}
        onThemeToggle={toggleTheme}
        showPillars={showPillars}
        onTogglePillars={() => setShowPillars(!showPillars)}
      />

      {/* Main Body with Optional Temple Stone Pillar Borders (Image 3) */}
      <div className="relative flex justify-between min-h-[calc(100vh-64px)] w-full">
        {showPillars && <TemplePillar side="left" />}

        <main className="flex-1 min-w-0 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* TAB 1: DASHBOARD VIEW (Image 2) */}
          {activeTab === "dashboard" && (
            <DashboardView
              userName={userName}
              onStartAnalysis={() => setActiveTab("analyze")}
              onViewArchives={() => setActiveTab("history")}
              onSelectBenchmark={handleSelectBenchmark}
            />
          )}

          {/* TAB 2: ANALYZE INSCRIPTION VIEW (Image 4 & Image 5) */}
          {activeTab === "analyze" && (
            <div className="space-y-6 sm:space-y-8 animate-fade-up">
              {/* Studio Header (Image 4 & 5) */}
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tamil Epigraphy Recognition Studio</span>
                </div>

                <h1 className="mt-3 font-playfair text-3xl sm:text-5xl font-extrabold text-stone-100 tracking-tight leading-tight">
                  Decipher Ancient Tamil Inscriptions
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-stone-300/90 leading-relaxed max-w-2xl mx-auto">
                  Upload stone carvings, cave Brahmi, or hero stones to detect characters,
                  transliterate to modern Tamil, retrieve archaeological context, and translate to English.
                </p>
              </div>

              {/* Benchmark 1-Click Instant Test Row (Image 4 & 5) */}
              <BenchmarkSection
                onSelectBenchmark={handleSelectBenchmark}
                activeBenchmarkId={activeBenchmarkId}
                mode="analyze"
              />

              {/* Upload Drop Zone (Image 3, 4, 5) */}
              <UploadSection
                selected={selected}
                onSelect={handleSelect}
                onRemove={handleRemove}
                disabled={analyzing}
              />

              {/* Action Button: Analyze Inscription */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={runAnalysis}
                  disabled={!selected || analyzing}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 px-8 py-3.5 text-sm sm:text-base font-bold text-stone-950 shadow-xl shadow-amber-950/40 transition-all hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Scan className="w-5 h-5 text-stone-950 stroke-[2.4]" />
                  <span>{analyzing ? "Decoding Ancient Inscription..." : "Analyze Inscription"}</span>
                </button>

                {error && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-rose-300 bg-rose-500/15 border border-rose-500/40 rounded-xl px-4 py-2.5 max-w-lg text-center shadow-lg">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Pipeline Progress Tracker (8 Stages) */}
              {(analyzing || complete) && (
                <div className="rounded-2xl border border-gold-500/25 bg-[#1e1511]/95 p-5 shadow-2xl backdrop-blur-md">
                  <ProgressTracker stages={stages} complete={complete} />
                </div>
              )}

              {/* Decipherment Results Grid */}
              {result && complete && (
                <div className="mt-8">
                  <ResultsGrid result={result} />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORY ARCHIVE */}
          {activeTab === "history" && (
            <HistoryView
              onSelectRecord={handleSelectHistoryRecord}
              onNewAnalysis={() => setActiveTab("analyze")}
            />
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <SettingsView
              themeMode={themeMode}
              onThemeChange={setThemeMode}
              showPillars={showPillars}
              onTogglePillars={() => setShowPillars(!showPillars)}
            />
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === "profile" && (
            <ProfileView
              userName={userName}
              userEmail={userEmail}
              onLogout={onLogout}
            />
          )}
        </main>

        {showPillars && <TemplePillar side="right" />}
      </div>
    </div>
  );
}
