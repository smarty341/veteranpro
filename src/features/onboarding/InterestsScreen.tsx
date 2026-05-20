import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/components/Button";
import { interests } from "@/content/interests";
import { useStore } from "@/lib/store";

// Word-cloud-style varied sizes for visual interest. Index aligns with interests[].
const SIZES = ["text-3xl", "text-2xl", "text-4xl", "text-2xl"] as const;

export function InterestsScreen() {
  const nav = useNavigate();
  const setProfile = useStore(s => s.setProfile);
  const existing = useStore(s => s.profile.interests ?? []);
  const [selected, setSelected] = useState<string[]>(existing);

  const toggle = (id: string) =>
    setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const done = () => { setProfile({ interests: selected }); nav("/home"); };
  const skip = () => { setProfile({}); nav("/home"); };

  return (
    <div className="min-h-screen px-5 pt-[calc(env(safe-area-inset-top)+2rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] bg-beige-soft flex flex-col">
      <h1 className="text-2xl font-semibold mb-1">Що вас найбільше цікавить?</h1>
      <p className="text-muted mb-6">Можна обрати декілька. Це допоможе підібрати релевантні послуги.</p>

      <div className="flex flex-wrap items-center justify-center gap-3 my-auto py-6">
        {interests.map((it, i) => {
          const on = selected.includes(it.id);
          return (
            <button
              key={it.id}
              type="button"
              aria-pressed={on}
              aria-label={it.nameUa}
              onClick={() => toggle(it.id)}
              className={`${SIZES[i]} font-semibold rounded-full px-6 py-3 transition-shadow active:scale-[0.97] ${
                on
                  ? "bg-olive-soft text-white shadow-[var(--vp-elevation)]"
                  : "bg-white border border-border text-brand"
              }`}
            >
              {it.nameUa}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <Button onClick={done}>Готово</Button>
        <button type="button" onClick={skip} className="text-muted underline text-sm self-center">
          Пропустити
        </button>
      </div>
    </div>
  );
}
