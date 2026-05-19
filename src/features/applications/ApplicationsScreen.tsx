import { Link } from "react-router-dom";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { Card } from "@/ui/components/Card";
import { ProgressBar } from "@/ui/components/ProgressBar";
import { Checkbox } from "@/ui/components/Checkbox";
import { articles } from "@/content/articles.generated";
import { useStore } from "@/lib/store";

export function ApplicationsScreen() {
  const { applications, toggleStep } = useStore();
  const entries = Object.entries(applications)
    .map(([id, entry]) => ({ entry, article: articles.find(a => a.id === id) }))
    .filter((x): x is { entry: typeof applications[string]; article: NonNullable<typeof x.article> } => !!x.article);

  return (
    <>
      <Header title="Мої послуги" />
      <ScreenContainer>
        {entries.length === 0 ? (
          <>
            <p className="text-muted">У вас ще немає заяв. Додайте першу з каталогу.</p>
            <Link to="/catalog" className="inline-block mt-4 underline text-brand">До каталогу →</Link>
          </>
        ) : (
          entries.map(({ article, entry }) => {
            const steps = article.steps ?? [];
            const done = entry.stepsCompleted.length;
            const hasSteps = steps.length > 0;
            return (
              <Card key={article.id} className="mb-3">
                <b className="block mb-1">{article.title}</b>
                {hasSteps && (
                  <>
                    <ProgressBar value={done} max={steps.length} />
                    <div className="text-xs text-muted mt-1 mb-2">Виконано {done} з {steps.length}</div>
                  </>
                )}
                {steps.map((label, idx) => (
                  <Checkbox key={label} label={label} checked={entry.stepsCompleted.includes(idx)} onChange={() => toggleStep(article.id, idx)} />
                ))}
              </Card>
            );
          })
        )}
      </ScreenContainer>
    </>
  );
}
