import { articles } from "@/content/articles.generated";
import { DemoAiProvider } from "./demo-provider";
import { ClaudeAiProvider } from "./claude-provider";
import type { AiProvider } from "./provider";

export function selectProvider(): AiProvider {
  const ep = import.meta.env.VITE_AI_ENDPOINT;
  return ep ? new ClaudeAiProvider(articles, ep) : new DemoAiProvider(articles);
}
