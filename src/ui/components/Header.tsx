import { asset } from "@/lib/asset";

type Props = { title?: string; onBack?: () => void; onGear?: () => void };
export function Header({ title, onBack, onGear }: Props) {
  return (
    <header className="flex items-center justify-between px-5 pt-5 pb-2 bg-white border-b border-beige">
      <div className="flex items-center gap-3">
        {onBack && <button aria-label="Назад" onClick={onBack} className="text-2xl leading-none">‹</button>}
        {title ? <h1 className="text-xl font-semibold">{title}</h1>
               : <img src={asset("assets/logo/veteran_logo.svg")} alt="Ветеран PRO" className="h-[34px]" />}
      </div>
      {onGear && <button aria-label="Налаштування" onClick={onGear} className="text-muted">⚙</button>}
    </header>
  );
}
