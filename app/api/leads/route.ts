/**
 * 留言 / 咨询接口
 *
 * POST /api/leads
 * body: { name?, phone, email?, message, locale? }
 * 返回: { ok: true } | { error: string }
 *
 * 与报名接口的区别：不要求姓名、不占招生名额，只是「想问一句」的入口，
 * 所以门槛压到最低——一个电话 + 一句话即可。
 */

import { isLocale } from "@/lib/i18n";
import { clientIp, createLimiter } from "@/lib/rate-limit";
import { adminClient, hasSupabase, hashIp } from "@/lib/supabase/admin";

/** 每 IP 每小时最多 5 条留言 */
const limit = createLimiter(5, 60 * 60_000);

/** 同一号码 10 分钟内只收一条，挡住连点与误触 */
const DUPLICATE_WINDOW_MS = 10 * 60_000;

type Payload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  locale?: unknown;
};

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** 只保留数字与开头的 +，长度 7—15 位 */
function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s()\-.]/g, "");
  if (!/^\+?\d{7,15}$/.test(cleaned)) return null;
  return cleaned;
}

export async function POST(req: Request) {
  if (!hasSupabase) {
    return Response.json(
      { error: "留言功能尚未配置，请致电 +856 20 5825 8055" },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  const gate = limit(ip);
  if (!gate.ok) {
    return Response.json(
      { error: "提交过于频繁，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(gate.retryAfter) } },
    );
  }

  let raw: Payload;
  try {
    raw = (await req.json()) as Payload;
  } catch {
    return Response.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const phone = normalizePhone(str(raw.phone, 30));
  const message = str(raw.message, 800);
  const emailRaw = str(raw.email, 120);

  if (!phone) return Response.json({ error: "请填写有效的电话号码" }, { status: 400 });
  if (message.length < 2) return Response.json({ error: "请写下想问的问题" }, { status: 400 });
  if (emailRaw && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailRaw)) {
    return Response.json({ error: "邮箱格式不正确" }, { status: 400 });
  }

  const db = adminClient();
  const ipHash = hashIp(ip);

  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { data: existing, error: checkError } = await db
    .from("leads")
    .select("id")
    .eq("phone", phone)
    .gte("created_at", since)
    .limit(1);

  if (checkError) {
    console.error("[leads] 查重失败", checkError.message);
    return Response.json({ error: "系统繁忙，请稍后重试" }, { status: 500 });
  }
  if (existing && existing.length > 0) {
    return Response.json({ error: "刚刚已经留过言了，我们会尽快回复" }, { status: 409 });
  }

  const { error: insertError } = await db.from("leads").insert({
    name: str(raw.name, 80) || null,
    phone,
    email: emailRaw || null,
    message,
    source: "contact-form",
    locale: isLocale(raw.locale) ? raw.locale : "lo",
    ip_hash: ipHash,
  });

  if (insertError) {
    console.error("[leads] 写入失败", insertError.message);
    return Response.json({ error: "提交失败，请稍后重试或直接致电" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
