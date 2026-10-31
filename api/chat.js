import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_TURNS = 20;

// Everything a visitor might read. Plain, calm, no technical detail.
const FRIENDLY = {
  tooLong: "That message is a little long. Could you shorten it and try again?",
  badRequest:
    "I didn't quite catch that. Please try sending your message again.",
  upstream: "Something went wrong on my side. Please try again in a moment.",
  empty: "I didn't get an answer that time. Try asking again?",
};

function reply(payload, status = 200) {
  return Response.json(payload, { status });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ message: FRIENDLY.badRequest }, 400);
  }

  if (!Array.isArray(body?.messages)) {
    return reply({ message: FRIENDLY.badRequest }, 400);
  }

  // Keep only well-formed turns: a known role and a plain string of text.
  const turns = body.messages.filter(
    (message) =>
      message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string",
  );

  if (turns.some((message) => message.content.length > MAX_MESSAGE_LENGTH)) {
    return reply({ message: FRIENDLY.tooLong }, 400);
  }

  const messages = turns
    .slice(-MAX_TURNS)
    .map((message) => ({ role: message.role, content: message.content }));

  if (messages.length === 0) {
    return reply({ message: FRIENDLY.badRequest }, 400);
  }

  try {
    const systemPrompt = readFileSync(
      new URL("./system-prompt.txt", import.meta.url),
      "utf8",
    );

    const client = new Anthropic();

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: systemPrompt,
      messages,
    });

    // The first block is not guaranteed to be text, so collect them all.
    const text = (response?.content ?? [])
      .filter((block) => block?.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!text) {
      return reply({ message: FRIENDLY.empty }, 502);
    }

    return reply({ reply: text });
  } catch (error) {
    // The real error stays in the Vercel log. The visitor gets one calm line.
    console.error("chat function failed:", error);
    return reply({ message: FRIENDLY.upstream }, 500);
  }
}
