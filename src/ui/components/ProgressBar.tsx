export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}
         className="h-[7px] bg-beige rounded-full overflow-hidden">
      <div className="h-full bg-olive" style={{ width: `${pct}%` }} />
    </div>
  );
}
