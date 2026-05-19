import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { Chip } from "@/ui/components/Chip";
import { IconTile } from "@/ui/components/IconTile";
import { categories } from "@/content/categories";
import { articles } from "@/content/articles.generated";
import { stepsLabel } from "@/lib/plurals";

export function CategoryScreen() {
  const { categoryId = "" } = useParams();
  const nav = useNavigate();
  const cat = categories.find(c => c.id === categoryId);
  const list = articles.filter(a => a.category === categoryId);
  return (
    <>
      <Header title={cat?.nameUa ?? "Категорія"} onBack={() => nav(-1)} />
      <ScreenContainer>
        {list.length === 0 && <p className="text-muted">У цій категорії поки що немає послуг.</p>}
        {list.map(a => (
          <Link key={a.id} to={`/catalog/service/${a.id}`} className="flex items-center gap-3 bg-white border border-beige rounded-card p-4 mb-3 shadow-[var(--vp-elevation)]">
            <IconTile icon={cat?.icon ?? "ri:bookmark-line"} />
            <div className="flex-1">
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="text-xs text-muted">{a.statuses.map(s => <Chip key={s}>{s}</Chip>)}{a.steps ? ` · ${stepsLabel(a.steps.length)}` : ""}</div>
            </div>
            <span className="text-border text-lg">›</span>
          </Link>
        ))}
      </ScreenContainer>
    </>
  );
}
