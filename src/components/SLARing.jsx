function SLARing({ remainingHours }) {
  const percentage = Math.max(0, Math.min(100, Math.round(((48 - remainingHours) / 48) * 100)));
  const strokeDasharray = `${percentage} 100`;
  let ringColor = 'text-emerald-500';

  if (remainingHours <= 4) ringColor = 'text-red-500';
  else if (remainingHours <= 8) ringColor = 'text-amber-500';

  return (
    <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/5 p-1">
      <svg viewBox="0 0 36 36" className="h-16 w-16">
        <path
          d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="2.5"
        />
        <path
          d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="25"
          strokeLinecap="round"
          className={ringColor}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-slate-900">{Math.max(0, Math.round(remainingHours))}h</span>
    </div>
  );
}

export default SLARing;
