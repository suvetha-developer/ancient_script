import { CheckCircle2, Loader2, Circle } from "lucide-react";
import type { PipelineStage } from "../types";

interface ProgressTrackerProps {
  stages: PipelineStage[];
  complete: boolean;
  currentStepIndex?: number;
}

export function ProgressTracker({ stages, complete, currentStepIndex }: ProgressTrackerProps) {
  const activeIdx =
    currentStepIndex !== undefined
      ? currentStepIndex
      : stages.findIndex((s) => s.status === "active");

  const displayStep = activeIdx >= 0 ? activeIdx + 1 : complete ? 8 : 1;

  return (
    <div className="rounded-2xl border border-gold-500/30 bg-stone-900/80 p-5 shadow-2xl backdrop-blur-md animate-fade-up">
      <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide text-amber-300 uppercase">
            AI Epigraphical Pipeline Execution
          </h3>
        </div>
        <span className="text-xs font-mono text-stone-400">
          {complete ? "Complete (8/8)" : `Step ${displayStep} of 8`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const isDone = stage.status === "done";
          const isActive = stage.status === "active";

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "bg-amber-500/10 border-amber-400/60 shadow-[0_0_15px_rgba(201,162,39,0.15)]"
                  : isDone
                  ? "bg-stone-950/60 border-emerald-500/30 text-stone-300"
                  : "bg-stone-950/30 border-stone-800/60 text-stone-500"
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-stone-700" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isActive ? "text-amber-400" : isDone ? "text-emerald-400/80" : "text-stone-600"
                    }`}
                  >
                    {stage.step}
                  </span>
                  <p
                    className={`text-xs font-medium truncate ${
                      isActive ? "text-stone-100 font-semibold" : isDone ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {stage.label}
                  </p>
                </div>
                {isActive && (
                  <p className="text-[10px] text-amber-400/90 mt-0.5 animate-pulse">
                    Processing epigraphic layer...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
