import { Link } from "react-router-dom";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { IconTile } from "@/ui/components/IconTile";
import { categories } from "@/content/categories";

export function CatalogScreen() {
  return (
    <>
      <Header title="Каталог послуг" />
      <ScreenContainer>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(c => (
            <Link key={c.id} to={`/catalog/${c.id}`} className="bg-white border border-beige rounded-card p-4 min-h-[112px] flex flex-col justify-between shadow-[var(--vp-elevation)]">
              <IconTile icon={c.icon} size={38} />
              <span className="text-sm font-semibold leading-snug mt-2">{c.nameUa}</span>
            </Link>
          ))}
        </div>
      </ScreenContainer>
    </>
  );
}
