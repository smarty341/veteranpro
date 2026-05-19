import { useNavigate } from "react-router-dom";
import { Card } from "@/ui/components/Card";
import { statuses } from "@/content/statuses";
import { useStore } from "@/lib/store";

export function StatusScreen() {
  const nav = useNavigate();
  const setProfile = useStore(s => s.setProfile);
  return (
    <div className="min-h-screen px-5 py-8 bg-beige-soft">
      <h1 className="text-2xl font-semibold mb-1">Оберіть свій статус</h1>
      <p className="text-muted mb-5">Послуги та програми різняться залежно від статусу.</p>
      <div className="flex flex-col gap-3">
        {statuses.map(s => (
          <button key={s.id} onClick={() => { setProfile({ status: s.id }); nav("/onboarding/region"); }} aria-label={s.short}>
            <Card className="text-left">
              <div className="text-lg font-semibold">{s.short} — {s.full}</div>
              <div className="text-sm text-muted mt-1">{s.description}</div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
