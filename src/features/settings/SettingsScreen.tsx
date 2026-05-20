import { useEffect } from "react";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { useStore } from "@/lib/store";

export function SettingsScreen() {
  const { settings, setSettings, resetDemo } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("text-base", settings.fontLevel === 1);
    root.classList.toggle("text-[17px]", settings.fontLevel === 2);
    root.classList.toggle("text-[19px]", settings.fontLevel === 3);
    root.style.letterSpacing = ({ 1: "normal", 2: "0.02em", 3: "0.05em" })[settings.spacingLevel];
    root.classList.toggle("contrast-high", settings.contrastMode === "high");
  }, [settings]);

  return (
    <>
      <Header title="Налаштування" />
      <ScreenContainer>
        <Card className="mb-3">
          <b className="block mb-2">Розмір тексту</b>
          <div className="flex gap-2">
            {[1,2,3].map(n => <button key={n} aria-label={`A${n>1?"+".repeat(n-1):""}`} onClick={() => setSettings({ fontLevel: n as 1|2|3 })}
              className={`px-3 py-2 rounded-card border ${settings.fontLevel===n?"bg-brand text-white border-brand":"border-border bg-white"}`}>A{n>1?"+".repeat(n-1):""}</button>)}
          </div>
        </Card>
        <Card className="mb-3">
          <b className="block mb-2">Міжлітерний інтервал</b>
          <div className="flex gap-2">
            {[1,2,3].map(n => <button key={n} aria-label={`Інтервал ${n}`} onClick={() => setSettings({ spacingLevel: n as 1|2|3 })}
              className={`px-3 py-2 rounded-card border ${settings.spacingLevel===n?"bg-brand text-white border-brand":"border-border bg-white"}`}>—{"·".repeat(n)}—</button>)}
          </div>
        </Card>
        <Card className="mb-3">
          <b className="block mb-2">Контраст</b>
          <div className="flex gap-2">
            <button aria-label="Стандартний контраст" onClick={() => setSettings({ contrastMode: "standard" })}
              className={`px-3 py-2 rounded-card border ${settings.contrastMode==="standard"?"bg-brand text-white border-brand":"border-border bg-white"}`}>Стандарт</button>
            <button aria-label="Високий контраст" onClick={() => setSettings({ contrastMode: "high" })}
              className={`px-3 py-2 rounded-card border ${settings.contrastMode==="high"?"bg-brand text-white border-brand":"border-border bg-white"}`}>Високий</button>
          </div>
        </Card>
        <Card className="mb-3">
          <b className="block mb-2">Демо</b>
          <Button variant="outline" onClick={() => resetDemo()}>Скинути демо</Button>
        </Card>
        <p className="text-xs text-muted mt-4">v0.1 · <a href="https://veteranpro.gov.ua" className="underline">veteranpro.gov.ua</a></p>
      </ScreenContainer>
    </>
  );
}
