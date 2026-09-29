export function DemoBanner() {
  return (
    <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gold-300">
            Prototype / Demo Mode
          </p>
          <p className="mt-0.5 text-xs text-stone-300">
            Uses the public 8th Century Tamil Inscriptions dataset as the
            initial character-recognition resource.
          </p>
        </div>
        <span className="rounded-full border border-gold-500/40 bg-stone-900/60 px-3 py-1 text-xs font-medium text-gold-400">
          Recognition Model: Initial Public Dataset/Model
        </span>
      </div>
    </div>
  );
}
