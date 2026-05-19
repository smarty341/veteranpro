export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 py-3 text-sm cursor-pointer">
      <input type="checkbox" role="checkbox" aria-label={label} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span aria-hidden className={`h-[22px] w-[22px] rounded-md border-2 flex-none flex items-center justify-center ${checked ? "bg-olive border-olive text-white" : "border-brand bg-white"}`}>
        {checked ? "✓" : null}
      </span>
      <span>{label}</span>
    </label>
  );
}
