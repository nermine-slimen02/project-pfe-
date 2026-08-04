function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white shadow-sm">
      {initials}
    </div>
  );
}

export default Avatar;
