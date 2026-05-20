import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { statusCode: 500, body: "ANTHROPIC_API_KEY is not configured" };
  let parsed: { question?: string; sources?: Array<{ title: string; body: string }>; ctx?: { status?: string } };
  try { parsed = JSON.parse(event.body ?? "{}"); }
  catch { return { statusCode: 400, body: "Invalid JSON" }; }
  const { question, sources, ctx } = parsed;
  const corpus = (sources ?? []).map((a: { title: string; body: string }) => `### ${a.title}\n${a.body}`).join("\n\n");
  const system = `Ти — помічник Ветеран PRO. Відповідай лаконічно українською мовою, спираючись виключно на наведені статті. Якщо інформації немає — так і скажи. Статус користувача: ${ctx?.status ?? "невідомий"}.`;
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: [
      { type: "text", text: system, cache_control: { type: "ephemeral" } },
      { type: "text", text: corpus,  cache_control: { type: "ephemeral" } }
    ],
    messages: [{ role: "user", content: question }]
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Enables `cache_control: { type: "ephemeral" }` on the system + corpus blocks
      // for older API versions; harmless when prompt caching is GA.
      "anthropic-beta": "prompt-caching-2024-07-31",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) return { statusCode: res.status, body: await res.text() };
  const data = await res.json();
  const text = Array.isArray(data.content) ? data.content.map((c: { text?: string }) => c.text ?? "").join("") : "";
  return { statusCode: 200, body: text, headers: { "Content-Type": "text/plain; charset=utf-8" } };
};
