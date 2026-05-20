import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/ui/components/Header";
import { ScreenContainer } from "@/ui/components/ScreenContainer";
import { selectProvider } from "@/lib/ai";
import { useStore } from "@/lib/store";
import type { Article } from "@/content/types";

interface Msg { role: "user" | "assistant"; text: string; sources?: Article[] }

export function AiScreen() {
  const provider = useMemo(() => selectProvider(), []);
  const [params] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [input, setInput] = useState(initialQ);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const { profile } = useStore();
  const askedRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  async function send(q: string) {
    if (!q.trim() || busy) return;
    setBusy(true);
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    const { tokens, sources } = provider.ask(q, { status: profile.status ?? undefined, region: profile.region });
    let acc = "";
    setMessages(m => [...m, { role: "assistant", text: "", sources }]);
    for await (const t of tokens) {
      if (!mountedRef.current) return;
      acc += t;
      setMessages(m => { const next = [...m]; next[next.length - 1] = { role: "assistant", text: acc, sources }; return next; });
    }
    if (mountedRef.current) setBusy(false);
  }

  useEffect(() => { if (initialQ && !askedRef.current) { askedRef.current = true; void send(initialQ); } /* eslint-disable-line */ }, []);

  return (
    <>
      <Header title="AI-помічник" />
      <ScreenContainer>
        {messages.length === 0 && <p className="text-muted text-sm">Поставте запитання — наприклад, «Як отримати грошову допомогу УБД?»</p>}
        {messages.map((m, i) => m.role === "user"
          ? <div key={i} className="ml-9 bg-brand text-white rounded-card px-3 py-2 my-2 text-sm">{m.text}</div>
          : <div key={i} className="bg-white border border-beige rounded-card px-3 py-2 my-2 text-sm whitespace-pre-line">
              {m.text}
              {m.sources && m.sources.length > 0 && <div className="text-xs text-muted mt-2">Джерело: «{m.sources[0].title}»</div>}
            </div>
        )}
      </ScreenContainer>
      <div className="p-3 bg-white border-t border-beige">
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); void send(input); }}>
          <input aria-label="Запитання до AI-помічника" value={input} onChange={e => setInput(e.target.value)} placeholder="Напишіть запитання…" className="flex-1 rounded-card border border-border px-4 py-3 text-sm" />
          <button aria-label="Надіслати" type="submit" disabled={busy} className="rounded-card bg-brand text-white px-4 disabled:opacity-50">›</button>
        </form>
      </div>
    </>
  );
}
