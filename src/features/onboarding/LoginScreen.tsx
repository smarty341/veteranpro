import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/ui/components/Button";
import { useStore } from "@/lib/store";
import { asset } from "@/lib/asset";

export function LoginScreen() {
  const nav = useNavigate();
  const { profile, markMockLoggedIn } = useStore();
  if (profile.didOnboard) return <Navigate to="/home" replace />;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-center gap-4 bg-white">
      <img src={asset("assets/logo/veteran_logo.svg")} alt="Ветеран PRO" className="h-20 mb-3" />
      <p className="text-muted">Державні послуги для ветеранів та ветеранок</p>
      <Button onClick={() => { markMockLoggedIn(); nav("/onboarding/status"); }}>Увійти через Дія</Button>
      <Link to="/onboarding/status" className="text-muted underline mt-1">Продовжити без входу</Link>
    </div>
  );
}
