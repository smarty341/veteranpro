import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { regions } from "@/content/regions";
import { useStore } from "@/lib/store";

export function RegionScreen() {
  const nav = useNavigate();
  const setProfile = useStore(s => s.setProfile);
  const [q, setQ] = useState("");
  const filtered = regions.filter(r => r.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="min-h-screen px-5 py-8 bg-beige-soft">
      <h1 className="text-2xl font-semibold mb-1">Ваш регіон</h1>
      <p className="text-muted mb-4">Допоможе показати регіональні програми та послуги.</p>
      <input value={q} onChange={e => setQ(e.target.value)} aria-label="Пошук регіону" placeholder="Пошук області" className="w-full rounded-card border border-border bg-white px-4 py-3 text-sm mb-3" />
      <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto pr-1">
        {filtered.map(r => (
          <button key={r} type="button" onClick={() => { setProfile({ region: r }); nav("/home"); }}
                  className="bg-white border border-beige rounded-card px-4 py-3 text-left">{r}</button>
        ))}
      </div>
      <button type="button" onClick={() => { setProfile({}); nav("/home"); }} className="block mt-4 text-muted underline">Пропустити</button>
    </div>
  );
}
