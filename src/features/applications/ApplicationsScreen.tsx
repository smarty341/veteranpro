import { Link } from "react-router-dom";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { Card } from "@/ui/components/Card";
import { articles } from "@/content/articles.generated";
import { categories } from "@/content/categories";
import { useStore } from "@/lib/store";

export function ApplicationsScreen() {
  const { applications, toggleReceived } = useStore();
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
          <>
            <p className="text-muted text-sm mb-4">Позначте послуги, які ви вже отримали.</p>
            {entries.map(({ article, entry }) => {
              const catName = categories.find(c => c.id === article.category)?.nameUa ?? "";
              return (
                <Card key={article.id} className="mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={entry.received}
                      aria-label={article.title}
                      onClick={() => toggleReceived(article.id)}
                      className={`h-[26px] w-[26px] rounded-md border-2 flex-none flex items-center justify-center transition ${
                        entry.received ? "bg-olive border-olive text-white" : "border-brand bg-white"
                      }`}
                    >
                      {entry.received ? "✓" : null}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-base font-semibold leading-tight ${entry.received ? "line-through opacity-60" : ""}`}>
                        {article.title}
                      </div>
                      {catName && <div className="text-xs text-muted mt-1">{catName}</div>}
                    </div>
                    <Link
                      to={`/catalog/service/${article.id}`}
                      className="text-border text-2xl px-1"
                      aria-label={`Деталі: ${article.title}`}
                    >
                      ›
                    </Link>
                  </div>
                </Card>
              );
            })}
          </>
        )}
      </ScreenContainer>
    </>
  );
}
