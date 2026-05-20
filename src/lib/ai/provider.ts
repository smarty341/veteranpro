import type { Article, Status } from "@/content/types";

export type AiToken = string;
export interface AskContext { status?: Status; region?: string }
export interface AiAnswer { tokens: AsyncIterable<AiToken>; sources: Article[] }
export interface AiProvider { ask(question: string, ctx: AskContext): AiAnswer }
