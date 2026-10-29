/**
 * AI 智能客服接口 —— Google Gemini
 *
 * POST /api/chat
 * body: { messages: { role: "user" | "assistant"; content: string }[], locale: "lo" | "zh" | "en" | "ko" }
 * 返回: text/plain 流（SSE 已在服务端解析成纯文本，前端逐块追加即可）
 *
 * 环境变量（.env.local）：
 *   GEMINI_API_KEY=   必填，Google AI Studio 申请
 *   GEMINI_MODEL=     选填，默认 gemini-2.5-flash
 */

import { isLocale } from "@/lib/i18n";
import { buildSystemPrompt } from "@/lib/knowledge";

const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
const API_KEY =
  process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim() || "";

/**
 * 默认直连 Google。可用 GEMINI_ENDPOINT 覆盖，
 * 便于走代理网关，或在本机接一个 mock 服务做流式联调。
 */
const ENDPOINT =
  process.env.GEMINI_ENDPOINT?.trim() ||
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

/** 单次请求限制：最多 12 轮、单条最多 800 字 */
const MAX_MESSAGES = 12;
const MAX_CHARS = 800;

/** 简单内存限流：每 IP 每分钟 12 次（多实例部署下各自计数，够用即可） */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimit(key: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();

  // 顺带清理过期桶，避免 Map 无限增长
  if (buckets.size > 500) {
    for (const [k, v] of buckets) {
      if (now > v.resetAt) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "anonymous";
}

type IncomingMessage = { role: "user" | "assistant"; content: string };

function parseMessages(input: unknown): IncomingMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const cleaned: IncomingMessage[] = [];
  for (const raw of input.slice(-MAX_MESSAGES)) {
    if (!raw || typeof raw !== "object") return null;
    const { role, content } = raw as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (!text) continue;
    cleaned.push({ role, content: text });
  }

  // 最后一条必须是用户提问
  if (cleaned.length === 0 || cleaned.at(-1)!.role !== "user") return null;
  return cleaned;
}

/** 从一行 SSE 里取出文本增量 */
function extractText(line: string): string {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return "";

  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") return "";

  try {
    const json = JSON.parse(payload) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const parts = json.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return "";
    return parts.map((p) => p.text ?? "").join("");
  } catch {
    // 分片不完整，丢弃
    return "";
  }
}

/** 把 Gemini 的 SSE 流转成纯文本流 */
function toTextStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();

      if (done) {
        const tail = buffer.trim() ? extractText(buffer) : "";
        if (tail) controller.enqueue(encoder.encode(tail));
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      let chunk = "";
      for (const line of lines) chunk += extractText(line);
      if (chunk) controller.enqueue(encoder.encode(chunk));
    },
    cancel() {
      void reader.cancel();
    },
  });
}

function upstreamErrorMessage(status: number, detail: string): string {
  const lower = detail.toLowerCase();

  // Google 对无效 Key 返回的是 400 而不是 401，需要看内容判断
  if (lower.includes("api key not valid") || lower.includes("api_key_invalid")) {
    return "Gemini API Key 无效，请检查 .env.local 里的 GEMINI_API_KEY";
  }
  if (status === 400) return `请求被模型拒绝（${detail}）`;
  if (status === 401 || status === 403) return "Gemini API Key 无权限，请检查 GEMINI_API_KEY";
  if (status === 404) return `模型 ${MODEL} 不存在，请检查 GEMINI_MODEL`;
  if (status === 429) return "Gemini 配额已用尽，请稍后再试";
  if (status >= 500) return "Gemini 服务暂时不可用，请稍后再试";
  return `Gemini 返回 ${status}${detail ? `：${detail}` : ""}`;
}

export async function POST(req: Request) {
  if (!API_KEY) {
    console.warn("[chat] 未配置 GEMINI_API_KEY，客服接口不可用");
    return Response.json(
      { error: "客服尚未配置：缺少 GEMINI_API_KEY" },
      { status: 503 },
    );
  }

  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return Response.json(
      { error: "请求过于频繁，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const body = payload as { messages?: unknown; locale?: unknown };
  const messages = parseMessages(body.messages);
  if (!messages) {
    return Response.json(
      { error: "messages 格式不正确：需要非空数组，最后一条为 user" },
      { status: 400 },
    );
  }

  const locale = isLocale(body.locale) ? body.locale : "zh";

  const generationConfig: Record<string, unknown> = {
    temperature: 0.35,
    topP: 0.9,
    maxOutputTokens: 1024,
  };
  // 2.5 flash 默认开启思考，客服场景会明显增加首字延迟，这里关掉
  if (/flash/i.test(MODEL)) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  let upstream: Response;
  try {
    upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(locale) }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig,
      }),
      signal: req.signal,
    });
  } catch (error) {
    console.error("[chat] 请求 Gemini 失败", error);
    return Response.json({ error: "无法连接 Gemini 服务" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const raw = await upstream.text().catch(() => "");
    let detail = "";
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string } };
      detail = parsed.error?.message?.slice(0, 200) ?? "";
    } catch {
      detail = raw.slice(0, 200);
    }
    console.error(`[chat] Gemini ${upstream.status}`, detail);
    return Response.json(
      { error: upstreamErrorMessage(upstream.status, detail) },
      { status: upstream.status >= 500 ? 502 : upstream.status },
    );
  }

  return new Response(toTextStream(upstream.body), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      // 防止反向代理缓冲，保证流式效果
      "X-Accel-Buffering": "no",
    },
  });
}
