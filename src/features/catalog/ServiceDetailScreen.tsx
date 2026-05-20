import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { Card } from "@/ui/components/Card";
import { Chip } from "@/ui/components/Chip";
import { Button } from "@/ui/components/Button";
import { categories } from "@/content/categories";
import { articles } from "@/content/articles.generated";
import { useStore } from "@/lib/store";

export function ServiceDetailScreen() {
  const { articleId = "" } = useParams();
  const nav = useNavigate();
  const article = articles.find(a => a.id === articleId);
  const addApplication = useStore(s => s.addApplication);

  if (!article) return <><Header onBack={() => nav(-1)} /><ScreenContainer><p>Послугу не знайдено.</p></ScreenContainer></>;

  const catName = categories.find(c => c.id === article.category)?.nameUa ?? "";
  return (
    <>
      <Header onBack={() => nav(-1)} />
      <ScreenContainer>
        <div>{article.statuses.map(s => <Chip key={s}>{s}</Chip>)}<Chip>{catName}</Chip></div>
        <h1 className="text-xl font-semibold mt-2 mb-3">{article.title}</h1>
        <Card>
          <b className="block mb-1">Хто може отримати</b>
          <div className="text-sm text-muted prose prose-sm max-w-none">
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>
        </Card>
        {article.documents && <Card className="mt-3"><b className="block mb-1">Потрібні документи</b><ul className="text-sm text-muted list-disc ml-5">{article.documents.map(d => <li key={d}>{d}</li>)}</ul></Card>}
        {article.steps && <Card className="mt-3"><b className="block mb-1">Кроки</b><ol className="text-sm text-muted list-decimal ml-5">{article.steps.map(s => <li key={s}>{s}</li>)}</ol></Card>}
        {article.contacts && <Card className="mt-3"><b className="block mb-1">Контакти</b><div className="text-sm text-muted whitespace-pre-line">{article.contacts}</div></Card>}
        <div className="mt-4 flex flex-col gap-3">
          <Button onClick={() => { addApplication(article.id); nav("/applications"); }}>➕ Додати в «Мої послуги»</Button>
          <Button variant="outline" onClick={() => nav(`/ai?q=${encodeURIComponent(article.title)}`)}>Запитати в AI про цю послугу</Button>
        </div>
      </ScreenContainer>
    </>
  );
}
