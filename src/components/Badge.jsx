function Badge({ label, variant }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variant}`}>
      {label}
    </span>
  );
}

export default Badge;
