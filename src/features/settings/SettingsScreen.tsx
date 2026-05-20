import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { Card } from "@/ui/components/Card";
import { Button } from "@/ui/components/Button";
import { useStore } from "@/lib/store";

export function SettingsScreen() {
  const { settings, setSettings, resetDemo } = useStore();

  return (
    <>
      <Header title="Налаштування" />
      <ScreenContainer>
        <Card className="mb-3">
          <b className="block mb-2">Розмір тексту</b>
          <div className="flex gap-2">
            {[1,2,3].map(n => <button key={n} type="button"
              aria-label={`A${n>1?"+".repeat(n-1):""}`}
              aria-pressed={settings.fontLevel===n}
              onClick={() => setSettings({ fontLevel: n as 1|2|3 })}
              className={`px-3 py-2 rounded-card border ${settings.fontLevel===n?"bg-brand text-white border-brand":"border-border bg-white"}`}>
              A{n>1?"+".repeat(n-1):""}
            </button>)}
          </div>
        </Card>
        <Card className="mb-3">
          <b className="block mb-2">Міжлітерний інтервал</b>
          <div className="flex gap-2">
            {[1,2,3].map(n => <button key={n} type="button"
              aria-label={`Інтервал ${n}`}
              aria-pressed={settings.spacingLevel===n}
              onClick={() => setSettings({ spacingLevel: n as 1|2|3 })}
              className={`px-3 py-2 rounded-card border ${settings.spacingLevel===n?"bg-brand text-white border-brand":"border-border bg-white"}`}>
              —{"·".repeat(n)}—
            </button>)}
          </div>
        </Card>
        <Card className="mb-3">
          <b className="block mb-2">Контраст</b>
          <div className="flex gap-2">
            <button type="button"
              aria-label="Стандартний контраст"
              aria-pressed={settings.contrastMode==="standard"}
              onClick={() => setSettings({ contrastMode: "standard" })}
              className={`px-3 py-2 rounded-card border ${settings.contrastMode==="standard"?"bg-brand text-white border-brand":"border-border bg-white"}`}>
              Стандарт
            </button>
            <button type="button"
              aria-label="Високий контраст"
              aria-pressed={settings.contrastMode==="high"}
              onClick={() => setSettings({ contrastMode: "high" })}
              className={`px-3 py-2 rounded-card border ${settings.contrastMode==="high"?"bg-brand text-white border-brand":"border-border bg-white"}`}>
              Високий
            </button>
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
