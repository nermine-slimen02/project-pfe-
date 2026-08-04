function StatsCard({ title, value, delta, icon, colorClass }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${colorClass}`}>
          {icon}
        </div>
      </div>
      {delta && <p className="mt-3 text-sm text-slate-500">{delta}</p>}
    </div>
  );
}

export default StatsCard;
