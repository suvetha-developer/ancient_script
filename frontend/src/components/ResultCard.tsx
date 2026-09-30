interface ResultCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function ResultCard({
  title,
  icon,
  children,
  className = "",
}: ResultCardProps) {
  return (
    <article
      className={`animate-fade-up rounded-2xl border border-stone-700/60 bg-stone-900/40 p-5 backdrop-blur-sm ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon ? <span className="text-xl">{icon}</span> : null}
        <h3 className="font-semibold text-stone-50">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-stone-300">{children}</div>
    </article>
  );
}
