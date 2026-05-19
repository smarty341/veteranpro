import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/ui/components/Button";
import { useStore } from "@/lib/store";

export function LoginScreen() {
  const nav = useNavigate();
  const { profile, markMockLoggedIn } = useStore();
  if (profile.didOnboard) return <Navigate to="/home" replace />;
  return (
    <div className="flex flex-col items-center justify-center h-screen px-8 text-center gap-4 bg-white">
      <img src="/assets/logo/veteran_logo.svg" alt="Ветеран PRO" className="h-20 mb-3" />
      <p className="text-muted">Державні послуги для ветеранів та ветеранок</p>
      <Button onClick={() => { markMockLoggedIn(); nav("/onboarding/status"); }}>Увійти через Дія</Button>
      <Link to="/onboarding/status" className="text-muted underline mt-1">Продовжити без входу</Link>
    </div>
  );
}
