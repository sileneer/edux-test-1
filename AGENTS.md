# Project rules

You are helping a beginner build a personal website. After each step, explain what you did in plain English.

## Stack

- Plain HTML, CSS and JavaScript. No framework and no build step.
- The site must work when deployed to Vercel from the repository root.
- Keep the page in `index.html`. Do not add a dependency unless these rules ask for it.

## Working style

- Before changing code, share a short plan and wait for approval.
- Make small changes and tell me how to check each one.
- Use the words in `content.md`. Do not invent facts about me.

## Preview

- In a Codespace, the site is already served on port 3000. Do not start another server.
- After a change, tell me to refresh the "Your website" preview.
- The chat box only works on the deployed Vercel site, not in the preview.

## AI feature

- The server code goes in `api/chat.js`, a Vercel Function using `export async function POST(request)`.
- Return JSON from the function using `Response.json(...)`.
- Use the official `@anthropic-ai/sdk` package. It is already in `package.json`, so do not change its version.
- Create the client with `new Anthropic()`, inside the function. It reads `ANTHROPIC_API_KEY` and `ANTHROPIC_BASE_URL` from the environment by itself, so do not pass them in or hard-code them.
- Set the model with exactly `process.env.ANTHROPIC_MODEL || "claude-haiku-5-5"`. Do not hard-code any other model ID.
- Set `max_tokens` to 1024 and `output_config` to `{ effort: "low" }`.
- Do not send `temperature`, `top_p`, `top_k` or `thinking`.
- Join the text blocks from `response.content`, because the first block may not be text.
- Keep the system prompt in `api/system-prompt.txt` so I can edit it.
- Load it with `readFileSync(new URL("./system-prompt.txt", import.meta.url), "utf8")`.
- The chat must remember the conversation. The browser sends `{ messages: [...] }` with every `user` and `assistant` turn, and the function passes the latest 20 to Claude.
- Reject any message longer than 2000 characters.
- Show visitors a friendly message when something goes wrong.

## Safety

- Never put an API key in HTML, JavaScript, Markdown or any committed file.
- If I paste a key into chat, tell me not to and do not use it.
- This site is public. Never add personal contact details that are not in `content.md`.
