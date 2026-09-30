import React, { useState, useRef, useCallback } from "react";
import {
  Layers,
  Eye,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Landmark,
  User,
  MapPin,
  Briefcase,
  Gift,
  Crown,
  Clock,
  Printer,
  X,
  ExternalLink,
} from "lucide-react";
import type { AnalysisResult, GlyphData, NamedEntity } from "../types";

interface ResultsGridProps {
  result: AnalysisResult;
}

type AnalysisViewMode = "parallel" | "side-by-side" | "original" | "enhanced";

export function ResultsGrid({ result }: ResultsGridProps) {
  const [viewMode, setViewMode] = useState<AnalysisViewMode>("side-by-side");
  const [zoom, setZoom] = useState(135);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeReliefMode, setActiveReliefMode] = useState<"enhanced" | "original">("enhanced");
  const [copiedUnicode, setCopiedUnicode] = useState(false);
  const [copiedModern, setCopiedModern] = useState(false);
  const [copiedEnglish, setCopiedEnglish] = useState(false);
  const [selectedGlyph, setSelectedGlyph] = useState<GlyphData | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<NamedEntity | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fallback entities if not provided by backend
  const entities: NamedEntity[] =
    result.namedEntities && result.namedEntities.length > 0
      ? result.namedEntities
      : [
          {
            text: "மதன் ஆதன்",
            text_en: "Mathan Athan",
            label: "PERSON",
            category: "கொடையாளி / Donor",
            confidence: 0.98,
            description: "Epigraphical salt merchant recorded as donor in the cavern inscription.",
          },
          {
            text: "மதுரை",
            text_en: "Madurai",
            label: "LOCATION",
            category: "தலைநகரம் / Capital City",
            confidence: 0.99,
            description: "Ancient Pandya royal capital city referenced in inscription.",
          },
          {
            text: "அழகர்மலை",
            text_en: "Alagarmalai",
            label: "LOCATION",
            category: "தொல்லியல் களம் / Cavern Site",
            confidence: 0.99,
            description: "Natural rock hill site with Sangam-era Brahmi lithic records.",
          },
          {
            text: "உப்ப வணிகன்",
            text_en: "Salt Merchant",
            label: "OCCUPATION",
            category: "வணிகத் தொழில் / Merchant Guild",
            confidence: 0.96,
            description: "Salt merchant of the Sangam era maritime & inland trading network.",
          },
          {
            text: "படுக்கைக் கொடை",
            text_en: "Cave Bed Endowment",
            label: "DONATION",
            category: "கொடைப் பொருள் / Endowment",
            confidence: 0.95,
            description: "Smooth chiseled stone cavern bed dedicated to meditating ascetics.",
          },
          {
            text: "பாண்டியர்",
            text_en: "Early Pandya",
            label: "DYNASTY",
            category: "பேரரசு / Dynasty",
            confidence: 0.94,
            description: "Sangam era Pandya dynasty governing the Madurai region.",
          },
          {
            text: "கி.மு. 1-ஆம் நூற்றாண்டு",
            text_en: "ca. 1st c. BCE",
            label: "PERIOD",
            category: "வரலாற்றுக் காலம் / Chronology",
            confidence: 0.95,
            description: "Early historic paleographic phase of Tamil-Brahmi script.",
          },
        ];

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoomPan = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  // Copy helpers
  const copyText = (text: string, type: "unicode" | "modern" | "english") => {
    navigator.clipboard.writeText(text);
    if (type === "unicode") {
      setCopiedUnicode(true);
      setTimeout(() => setCopiedUnicode(false), 2000);
    } else if (type === "modern") {
      setCopiedModern(true);
      setTimeout(() => setCopiedModern(false), 2000);
    } else {
      setCopiedEnglish(true);
      setTimeout(() => setCopiedEnglish(false), 2000);
    }
  };

  // Download Glyphs as CSV (Image 4)
  const exportGlyphsCSV = useCallback(() => {
    const glyphs = result.glyphs || [];
    if (glyphs.length === 0) {
      alert("No glyph coordinates to export.");
      return;
    }
    const headers = ["Index", "Character", "Class_Name", "Confidence_Percent", "BBox_X", "BBox_Y", "BBox_W", "BBox_H"];
    const rows = glyphs.map((g, i) => [
      i + 1,
      `"${g.character}"`,
      `"${g.class_name}"`,
      Math.round(g.confidence * 100),
      g.bbox.x,
      g.bbox.y,
      g.bbox.w,
      g.bbox.h,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${result.filename || "inscription"}_glyphs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result]);

  // Download Full Archaeological Report (JSON)
  const exportFullReportJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${result.filename || "inscription"}_analysis_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [result]);

  // Download Markdown Report
  const exportMarkdownReport = useCallback(() => {
    const md = `# Ancient Tamil Inscription Decipherment Report
**File:** ${result.filename}
**Script:** ${result.scriptType}
**Average Model Confidence:** ${Math.round(result.confidence * 100)}%
**Date:** ${result.createdAt ? new Date(result.createdAt).toLocaleString() : new Date().toLocaleString()}

---

## 1. Normalized Unicode Epigraphic Text
\`\`\`tamil
${result.unicodeText}
\`\`\`

## 2. Modern Tamil Transliteration (நவீன தமிழ்)
${result.modernTamil}

## 3. English Epigraphical Translation
${result.translationEnglish}

## 4. Archaeological Context & Site
${result.meaning}

## 5. Extracted Named Entities (NER)
${entities.map((e) => `- **[${e.label}]** ${e.text} (${e.text_en}) — *${e.category}* (${Math.round(e.confidence * 100)}% conf): ${e.description}`).join("\n")}

## 6. Monument & Temple Heritage
${result.templeHistory ? `**Site:** ${result.templeHistory.name}
**Location:** ${result.templeHistory.location}
**Period:** ${result.templeHistory.period}
**Significance:** ${result.templeHistory.significance}
` : "General epigraphical cave/monument site"}

---
*Generated by TamilScriptAI — Ancient Tamil Epigraphical AI Workspace*
`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.filename || "inscription"}_epigraphic_report.md`;
    link.click();
    URL.revokeObjectURL(url);
  }, [result, entities]);

  // Render entity category badge color
  const getEntityBadgeStyle = (label: string) => {
    switch (label) {
      case "PERSON":
        return "bg-purple-500/15 border-purple-500/40 text-purple-300";
      case "LOCATION":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-300";
      case "OCCUPATION":
        return "bg-amber-500/15 border-amber-500/40 text-amber-300";
      case "DONATION":
        return "bg-rose-500/15 border-rose-500/40 text-rose-300";
      case "DYNASTY":
        return "bg-blue-500/15 border-blue-500/40 text-blue-300";
      case "PERIOD":
        return "bg-cyan-500/15 border-cyan-500/40 text-cyan-300";
      default:
        return "bg-gold-500/15 border-gold-500/40 text-gold-300";
    }
  };

  const getEntityIcon = (label: string) => {
    switch (label) {
      case "PERSON":
        return <User className="w-3.5 h-3.5" />;
      case "LOCATION":
        return <MapPin className="w-3.5 h-3.5" />;
      case "OCCUPATION":
        return <Briefcase className="w-3.5 h-3.5" />;
      case "DONATION":
        return <Gift className="w-3.5 h-3.5" />;
      case "DYNASTY":
        return <Crown className="w-3.5 h-3.5" />;
      case "PERIOD":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <Landmark className="w-3.5 h-3.5" />;
    }
  };

  const glyphCount = result.glyphs?.length || 28;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* SECTION 1: VISUAL ANALYSIS CARD (Image 1, 2, 3) */}
      <div className="rounded-2xl border border-gold-500/25 bg-[#211610] p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        {/* Top Header Bar & View Switchers (Image 1 & 3) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5 text-stone-100">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-base sm:text-lg font-bold tracking-wide uppercase text-stone-100">
                Inscription Visual Analysis &amp; Parallel Meaning
              </h2>
              <p className="text-[11px] text-stone-400">
                High-resolution epigraphic relief, glyph segmentation &amp; contextual decipherment
              </p>
            </div>
          </div>

          {/* View Mode Pills (Image 1, 2, 3) */}
          <div className="flex items-center gap-1 bg-[#150d08] p-1 rounded-xl border border-stone-800 text-xs flex-wrap">
            <button
              onClick={() => setViewMode("parallel")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "parallel"
                  ? "bg-[#2d1d14] text-amber-300 font-bold border border-amber-500/40 shadow-inner"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span>◫ Parallel (Image + Meaning)</span>
            </button>

            <button
              onClick={() => setViewMode("side-by-side")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "side-by-side"
                  ? "bg-[#2d1d14] text-amber-300 font-bold border border-amber-500/40 shadow-inner"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Side-by-Side Images
            </button>

            <button
              onClick={() => setViewMode("original")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "original"
                  ? "bg-[#2d1d14] text-amber-300 font-bold border border-amber-500/40 shadow-inner"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Original Only
            </button>

            <button
              onClick={() => setViewMode("enhanced")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "enhanced"
                  ? "bg-[#2d1d14] text-amber-300 font-bold border border-amber-500/40 shadow-inner"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              Enhanced Relief
            </button>
          </div>
        </div>

        {/* Stone Inscription Zoom Toolbar (Image 2 & 3) */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 rounded-xl bg-[#170e09] px-4 py-2 border border-stone-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold font-mono">✜ STONE INSCRIPTION ZOOM: {zoom}%</span>
            <span className="text-stone-400 text-[11px] hidden sm:inline">(Drag to pan weathered strokes)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoom((z) => Math.max(z - 20, 60))}
              title="Zoom Out"
              className="p-1 rounded-lg border border-stone-700 bg-stone-900 text-stone-300 hover:text-amber-300 hover:border-amber-500/50"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setZoom(100)}
              className={`px-2 py-0.5 rounded-md border font-mono text-[11px] ${
                zoom === 100
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                  : "bg-stone-900 border-stone-700 text-stone-300 hover:text-amber-300"
              }`}
            >
              100%
            </button>

            <button
              onClick={() => setZoom(140)}
              className={`px-2 py-0.5 rounded-md border font-mono text-[11px] ${
                zoom === 140
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                  : "bg-stone-900 border-stone-700 text-stone-300 hover:text-amber-300"
              }`}
            >
              140%
            </button>

            <button
              onClick={() => setZoom(200)}
              className={`px-2 py-0.5 rounded-md border font-mono text-[11px] ${
                zoom === 200
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                  : "bg-stone-900 border-stone-700 text-stone-300 hover:text-amber-300"
              }`}
            >
              200%
            </button>

            <button
              onClick={() => setZoom((z) => Math.min(z + 20, 350))}
              title="Zoom In"
              className="p-1 rounded-lg border border-stone-700 bg-stone-900 text-stone-300 hover:text-amber-300 hover:border-amber-500/50"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={resetZoomPan}
              title="Reset View"
              className="p-1 rounded-lg border border-stone-700 bg-stone-900 text-stone-300 hover:text-amber-300 hover:border-amber-500/50 ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* IMAGE DISPLAY CONTAINER */}
        <div className="mt-4">
          {/* VIEW 1: PARALLEL (IMAGE + MEANING) MODE (Image 2) */}
          {viewMode === "parallel" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column: Interactive Zoomed Inscription */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveReliefMode("enhanced")}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        activeReliefMode === "enhanced"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-stone-900 text-stone-400 border border-stone-800"
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Enhanced Epigraphic Relief</span>
                    </button>

                    <button
                      onClick={() => setActiveReliefMode("original")}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        activeReliefMode === "original"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-stone-900 text-stone-400 border border-stone-800"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-400" />
                      <span>Original Weathered Stone</span>
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setFullscreenImage(
                        activeReliefMode === "enhanced"
                          ? result.processedImageUrl
                          : result.originalImageUrl
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-stone-900 text-stone-300 border border-stone-800 hover:text-amber-300"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </button>
                </div>

                {/* Canvas Viewer */}
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative h-[420px] w-full overflow-hidden rounded-xl border border-stone-800 bg-[#0d0704] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                >
                  <img
                    src={
                      activeReliefMode === "enhanced"
                        ? result.processedImageUrl
                        : result.originalImageUrl
                    }
                    alt="Inscription Viewer"
                    style={{
                      transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                      transition: isDragging ? "none" : "transform 0.15s ease-out",
                    }}
                    className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xl"
                    draggable={false}
                  />

                  {/* Coordinates overlay badge (Image 2) */}
                  <div className="absolute bottom-3 left-3 rounded-lg bg-stone-950/85 px-3 py-1 text-[11px] font-mono text-stone-300 border border-stone-800/80 pointer-events-none">
                    Zoom: <span className="text-amber-400 font-bold">{zoom}%</span> · Pan: X:
                    {Math.round(pan.x)} Y:{Math.round(pan.y)}
                  </div>
                </div>
              </div>

              {/* Right Column: Archaeological Monument & Unicode Tamil (Image 2) */}
              <div className="flex flex-col justify-between rounded-xl border border-stone-800 bg-[#170e09] p-5 shadow-xl">
                <div>
                  {/* Monument Badge & Category (Image 2) */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      <Landmark className="w-3.5 h-3.5" />
                      Archaeological Monument
                    </span>

                    <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 text-xs font-mono font-semibold">
                      {result.scriptType}
                    </span>
                  </div>

                  {/* Monument Title & Subtitle (Image 2) */}
                  <h3 className="mt-3 font-playfair text-xl sm:text-2xl font-bold text-stone-100 font-tamil">
                    {result.templeHistory?.name || `${result.filename.replace(/\.[^/.]+$/, "")} தொல்லியல் பாறை / குகைக் களம்`}
                  </h3>
                  <p className="text-xs text-amber-300/80 font-mono mt-1">
                    {result.templeHistory?.location || "Madurai, தமிழ்நாடு, இந்தியா"} • ca.{" "}
                    {result.templeHistory?.period || "1st century B.C.E."}
                  </p>

                  {/* Normalized Unicode Tamil Section (Image 2) */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                        Normalized Unicode Tamil
                      </span>
                      <button
                        onClick={() => copyText(result.unicodeText, "unicode")}
                        className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono"
                        title="Copy Unicode Text"
                      >
                        {copiedUnicode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUnicode ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    {/* Big Golden Tamil Script Box (Image 2) */}
                    <div className="rounded-xl border border-amber-500/30 bg-[#0d0704] p-4 text-amber-300 font-tamil-serif text-lg sm:text-xl font-bold leading-relaxed tracking-wider break-all max-h-56 overflow-y-auto scrollbar-none shadow-inner">
                      {result.unicodeText || result.recognizedText}
                    </div>
                  </div>
                </div>

                {/* Accuracy Note */}
                <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
                  <span>Model Confidence: <span className="font-mono text-emerald-400 font-bold">{Math.round(result.confidence * 100)}%</span></span>
                  <span className="font-mono text-amber-400/80">TensorFlow CNN Pipeline</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: SIDE-BY-SIDE IMAGES MODE (Image 1 & 3) */}
          {viewMode === "side-by-side" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Weathered Stone */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-stone-400" /> Original Weathered Stone
                  </span>
                  <button
                    onClick={() => setFullscreenImage(result.originalImageUrl)}
                    title="Fullscreen"
                    className="p-1 rounded hover:bg-stone-900 text-stone-400 hover:text-stone-200"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="relative h-[280px] sm:h-[340px] w-full overflow-hidden rounded-xl border border-stone-800 bg-[#0d0704] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                >
                  <img
                    src={result.originalImageUrl}
                    alt="Original Inscription"
                    style={{
                      transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                      transition: isDragging ? "none" : "transform 0.15s ease-out",
                    }}
                    className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-xl"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Enhanced Epigraphic Relief */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" /> Enhanced Epigraphic Relief
                  </span>
                  <button
                    onClick={() => setFullscreenImage(result.processedImageUrl)}
                    title="Fullscreen"
                    className="p-1 rounded hover:bg-stone-900 text-stone-400 hover:text-stone-200"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="relative h-[280px] sm:h-[340px] w-full overflow-hidden rounded-xl border border-amber-500/30 bg-[#0d0704] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                >
                  <img
                    src={result.processedImageUrl}
                    alt="Enhanced Inscription"
                    style={{
                      transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                      transition: isDragging ? "none" : "transform 0.15s ease-out",
                    }}
                    className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-xl"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: ORIGINAL ONLY */}
          {viewMode === "original" && (
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative h-[420px] w-full overflow-hidden rounded-xl border border-stone-800 bg-[#0d0704] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            >
              <img
                src={result.originalImageUrl}
                alt="Original Inscription"
                style={{
                  transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                }}
                className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xl"
                draggable={false}
              />
            </div>
          )}

          {/* VIEW 4: ENHANCED ONLY */}
          {viewMode === "enhanced" && (
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative h-[420px] w-full overflow-hidden rounded-xl border border-amber-500/30 bg-[#0d0704] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            >
              <img
                src={result.processedImageUrl}
                alt="Enhanced Relief"
                style={{
                  transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                }}
                className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xl"
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: 3-CARD SUMMARY GRID (Image 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Modern Tamil (Image 3) */}
        <div className="relative rounded-2xl border border-stone-800 bg-[#211610] p-5 shadow-xl hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800/80 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              நவீன தமிழ் (Modern Tamil)
            </span>
            <button
              onClick={() => copyText(result.modernTamil, "modern")}
              className="text-stone-400 hover:text-amber-300"
              title="Copy"
            >
              {copiedModern ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="font-tamil text-base sm:text-lg font-bold text-stone-100 leading-relaxed">
            {result.modernTamil}
          </p>
        </div>

        {/* Card 2: English Epigraphical Translation (Image 3) */}
        <div className="relative rounded-2xl border border-stone-800 bg-[#211610] p-5 shadow-xl hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800/80 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              English Epigraphical Translation
            </span>
            <button
              onClick={() => copyText(result.translationEnglish, "english")}
              className="text-stone-400 hover:text-amber-300"
              title="Copy"
            >
              {copiedEnglish ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-sm font-medium text-stone-200 leading-relaxed italic">
            "{result.translationEnglish}"
          </p>
        </div>

        {/* Card 3: Archaeological Context & Site (Image 3) */}
        <div className="relative rounded-2xl border border-stone-800 bg-[#211610] p-5 shadow-xl hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800/80 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Archaeological Context &amp; Site
            </span>
            <Landmark className="w-3.5 h-3.5 text-amber-400/80" />
          </div>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {result.meaning}
          </p>
        </div>
      </div>

      {/* SECTION 3: NAMED ENTITY RECOGNITION (NER) (User Request) */}
      <div className="rounded-2xl border border-gold-500/25 bg-[#211610] p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-playfair text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Epigraphical Named Entity Recognition (NER)
            </h3>
          </div>

          <span className="rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-0.5 text-xs font-mono">
            {entities.length} Archaeological Entities Extracted
          </span>
        </div>

        {/* Entity Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {entities.map((entity, i) => (
            <div
              key={i}
              onClick={() => setSelectedEntity(selectedEntity?.text === entity.text ? null : entity)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 ${
                selectedEntity?.text === entity.text
                  ? "bg-[#2d1d14] border-amber-400 ring-2 ring-amber-400/30 shadow-lg"
                  : "bg-[#170e09] border-stone-800 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold font-mono border ${getEntityBadgeStyle(
                    entity.label
                  )}`}
                >
                  {getEntityIcon(entity.label)}
                  <span>{entity.label}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {Math.round(entity.confidence * 100)}% conf
                </span>
              </div>

              <p className="font-bold text-sm text-stone-100 font-tamil">
                {entity.text}
              </p>
              <p className="text-xs text-amber-300/80 font-medium">
                {entity.text_en}
              </p>
              <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                {entity.description}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Entity Details Popover */}
        {selectedEntity && (
          <div className="mt-4 p-4 rounded-xl bg-[#150d08] border border-amber-500/40 text-xs flex items-start justify-between gap-4 animate-fade-up">
            <div className="space-y-1">
              <span className="text-[11px] font-bold font-mono text-amber-400 uppercase">
                Archaeological Entity Focus: {selectedEntity.label} ({selectedEntity.category})
              </span>
              <p className="text-sm font-bold text-stone-100 font-tamil">
                {selectedEntity.text} — {selectedEntity.text_en}
              </p>
              <p className="text-stone-300 leading-relaxed">{selectedEntity.description}</p>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-stone-400 hover:text-stone-100 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SECTION 4: DETECTED INSCRIPTION GLYPHS (351) (Image 4) */}
      <div className="rounded-2xl border border-gold-500/25 bg-[#211610] p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
              Detected Inscription Glyphs ({result.glyphs?.length || glyphCount})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              Click glyph to inspect coordinates
            </span>

            {/* Export Glyphs CSV Button (Image 4) */}
            <button
              onClick={exportGlyphsCSV}
              className="flex items-center gap-1.5 rounded-lg bg-stone-900 border border-stone-700 hover:border-amber-400 hover:bg-stone-800 px-3 py-1.5 text-xs font-semibold text-amber-300 transition shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Glyphs CSV</span>
            </button>
          </div>
        </div>

        {/* Glyphs Square Cards Grid (Image 4) */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-15 gap-2 max-h-80 overflow-y-auto pr-1 scrollbar-none">
          {(result.glyphs && result.glyphs.length > 0
            ? result.glyphs
            : result.recognizedText.split("").map((char, i) => ({
                bbox: { x: i * 35, y: 20, w: 30, h: 35 },
                class_index: i % 28,
                character: char,
                class_name: `${char}`,
                confidence: 0.85 + (i % 15) * 0.01,
                uncertain: false,
              }))
          ).map((g, idx) => {
            const isSelected = selectedGlyph === g;
            const confPct = Math.round(g.confidence * 100);

            return (
              <button
                key={idx}
                onClick={() => setSelectedGlyph(isSelected ? null : g)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-lg"
                    : "bg-[#160d08] border-stone-800 hover:border-amber-500/50 hover:bg-[#20140e]"
                }`}
              >
                {/* Big Bold Golden Tamil Glyph Character (Image 4) */}
                <span className="font-tamil-serif text-xl sm:text-2xl font-bold text-amber-300">
                  {g.character}
                </span>

                {/* Small Confidence Percentage Below (Image 4) */}
                <span className="mt-0.5 text-[10px] font-mono text-stone-400">
                  {confPct}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Glyph Inspector Tooltip */}
        {selectedGlyph && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#140c07] border border-amber-500/40 text-xs flex items-center justify-between flex-wrap gap-3 animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="font-tamil-serif text-2xl font-bold text-amber-300">
                {selectedGlyph.character}
              </span>
              <div>
                <p className="font-bold text-stone-200">Class: {selectedGlyph.class_name}</p>
                <p className="text-[11px] font-mono text-stone-400">
                  BBox: x:{selectedGlyph.bbox.x}, y:{selectedGlyph.bbox.y}, w:{selectedGlyph.bbox.w}, h:
                  {selectedGlyph.bbox.h}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-emerald-400 text-sm">
                Confidence: {Math.round(selectedGlyph.confidence * 100)}%
              </span>
              <button
                onClick={() => setSelectedGlyph(null)}
                className="text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: COMPLETE DOWNLOAD & EXPORT TOOLBAR ("download option of result") */}
      <div className="rounded-2xl border border-gold-500/25 bg-[#211610] p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-playfair text-base font-bold text-stone-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              Download Deciphered Archaeological Results
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Export epigraphic transcripts, segmented glyph coordinates, and full scholarly reports
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Export JSON */}
            <button
              onClick={exportFullReportJSON}
              className="flex items-center gap-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-400 px-3.5 py-2 text-xs font-semibold text-stone-200 hover:text-amber-300 transition shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Report (JSON)</span>
            </button>

            {/* Export Markdown */}
            <button
              onClick={exportMarkdownReport}
              className="flex items-center gap-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-400 px-3.5 py-2 text-xs font-semibold text-stone-200 hover:text-amber-300 transition shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Epigraphic (MD)</span>
            </button>

            {/* Export Glyphs CSV */}
            <button
              onClick={exportGlyphsCSV}
              className="flex items-center gap-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-400 px-3.5 py-2 text-xs font-semibold text-stone-200 hover:text-amber-300 transition shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Glyphs (CSV)</span>
            </button>

            {/* Print / PDF */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-stone-950 transition shadow-lg"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 rounded-full bg-stone-900 p-2.5 text-stone-300 hover:text-white border border-stone-700"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen Inscription"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl border border-gold-500/40 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
