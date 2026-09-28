const themes = {
  gym: "from-lime-400/80 to-cyan-400/40",
  cafe: "from-amber-200/80 to-orange-400/30",
  salon: "from-rose-200/70 to-fuchsia-400/20",
};

export default function ProjectMock({ id }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-elevated">
      <div className={`absolute inset-0 bg-gradient-to-br ${themes[id] || "from-accent/30 to-transparent"} opacity-80`} />
      <div className="relative aspect-[16/10] p-5">
        <div className="h-full rounded-xl border border-white/15 bg-black/35 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-white/30" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/10" />
          </div>
          <div className="mt-6 h-3 w-1/3 rounded bg-white/50" />
          <div className="mt-3 h-2 w-2/3 rounded bg-white/20" />
          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="h-16 rounded bg-white/10" />
            <div className="h-16 rounded bg-white/15" />
            <div className="h-16 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
