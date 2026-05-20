import type { Article } from "@/content/types";
import type { AiProvider, AskContext, AiAnswer } from "./provider";
import { retrieve } from "./retrieve";

export class ClaudeAiProvider implements AiProvider {
  constructor(private corpus: Article[], private endpoint: string) {}
  ask(question: string, ctx: AskContext): AiAnswer {
    const sources = retrieve(this.corpus, question, ctx);
    const endpoint = this.endpoint;
    async function* gen() {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, sources, ctx })
      });
      if (!res.ok || !res.body) { yield "Сервіс AI недоступний. Спробуйте пізніше."; return; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        yield decoder.decode(value, { stream: true });
      }
    }
    return { tokens: gen(), sources };
  }
}
