import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { Chip } from "@/ui/components/Chip";
import { IconTile } from "@/ui/components/IconTile";
import { categories } from "@/content/categories";
import { statuses } from "@/content/statuses";
import { interests as INTERESTS } from "@/content/interests";
import { articles } from "@/content/articles.generated";
import { useStore } from "@/lib/store";
import { stepsLabel } from "@/lib/plurals";

export function HomeScreen() {
  const nav = useNavigate();
  const { profile } = useStore();
  const statusLabel = statuses.find(s => s.id === profile.status)?.short;
  // Recommendation filter: status AND (if interests chosen) categories from those interests.
  const interestCategories = new Set(
    (profile.interests ?? []).flatMap(id => INTERESTS.find(it => it.id === id)?.categories ?? [])
  );
  const recommended = articles
    .filter(a => !profile.status || a.statuses.includes(profile.status))
    .filter(a => interestCategories.size === 0 || interestCategories.has(a.category))
    .slice(0, 5);

  return (
    <>
      <Header onGear={() => nav("/settings")} />
      <ScreenContainer>
        <p className="text-muted text-sm">Доброго дня 👋</p>
        <h1 className="text-2xl font-semibold mb-2">Ваші послуги</h1>
        <div>{statusLabel && <Chip>{statusLabel}</Chip>}{profile.region && <Chip>{profile.region}</Chip>}</div>

        <Link to="/ai" className="flex items-center gap-3 bg-brand text-white rounded-card px-4 py-4 mt-3">
          <Icon icon="ri:sparkling-2-line" width={20} height={20} aria-hidden />
          <span className="text-sm font-medium">Запитати в AI — напишіть питання…</span>
        </Link>

        <h2 className="text-sm font-semibold text-muted mt-5 mb-2">Рекомендовано вам</h2>
        {recommended.length === 0 && (
          <p className="text-sm text-muted">Ми ще додаємо послуги для вашого статусу.</p>
        )}
        {recommended.map(a => {
          const cat = categories.find(c => c.id === a.category);
          return (
            <Link key={a.id} to={`/catalog/service/${a.id}`} className="flex items-center gap-3 bg-white border border-beige rounded-card p-4 mb-3 shadow-[var(--vp-elevation)]">
              <IconTile icon={cat?.icon ?? "ri:bookmark-line"} />
              <div className="flex-1">
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-xs text-muted">{cat?.nameUa}{a.steps ? ` · ${stepsLabel(a.steps.length)}` : ""}</div>
              </div>
              <span className="text-border text-lg">›</span>
            </Link>
          );
        })}
      </ScreenContainer>
    </>
  );
}
