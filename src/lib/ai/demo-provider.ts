import type { Article } from "@/content/types";
import type { AiProvider, AskContext, AiAnswer } from "./provider";
import { retrieve } from "./retrieve";

export class DemoAiProvider implements AiProvider {
  constructor(private corpus: Article[]) {}
  ask(question: string, ctx: AskContext): AiAnswer {
    const sources = retrieve(this.corpus, question, ctx);
    const text = sources.length === 0
      ? `Я не знайшов відповідь у наявних матеріалах. Спробуйте інше формулювання або відкрийте каталог послуг.`
      : `За матеріалами «${sources[0].title}»:\n\n${sources[0].body.split("\n").slice(0, 3).join("\n")}\n\nДжерело: «${sources[0].title}».`;

    async function* gen() {
      for (const word of text.split(/(\s+)/)) {
        yield word;
        await new Promise(r => setTimeout(r, 15));
      }
    }
    return { tokens: gen(), sources };
  }
}
