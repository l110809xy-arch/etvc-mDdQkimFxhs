/**
 * 在线报名接口
 *
 * POST /api/applications
 * body: { fullName, phone, gender?, birthDate?, address?, highSchool?,
 *         gradYear?, gpa?, scholarship?, note?, locale? }
 *
 * 返回: { ok: true } | { error: string }
 *
 * 所有写入都走 service_role，浏览器拿不到数据库密钥。
 */

import { isLocale } from "@/lib/i18n";
import { clientIp, createLimiter } from "@/lib/rate-limit";
import { adminClient, hasSupabase, hashIp } from "@/lib/supabase/admin";

/** 每 IP 每小时最多 5 次提交 */
const limit = createLimiter(5, 60 * 60_000);

type Payload = {
  fullName?: unknown;
  phone?: unknown;
  gender?: unknown;
  birthDate?: unknown;
  address?: unknown;
  highSchool?: unknown;
  gradYear?: unknown;
  gpa?: unknown;
  scholarship?: unknown;
  note?: unknown;
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
      { error: "报名系统尚未配置，请致电 +856 20 5825 8055" },
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

  const fullName = str(raw.fullName, 80);
  const phoneRaw = str(raw.phone, 30);
  const phone = normalizePhone(phoneRaw);

  if (!fullName) return Response.json({ error: "请填写姓名" }, { status: 400 });
  if (!phone) return Response.json({ error: "请填写有效的电话号码" }, { status: 400 });

  const genderRaw = str(raw.gender, 10);
  const gender = ["male", "female", "other"].includes(genderRaw) ? genderRaw : null;

  const birthDateRaw = str(raw.birthDate, 10);
  const birthDate = /^\d{4}-\d{2}-\d{2}$/.test(birthDateRaw) ? birthDateRaw : null;

  const gradYearNum = Number(raw.gradYear);
  const gradYear =
    Number.isInteger(gradYearNum) && gradYearNum >= 1970 && gradYearNum <= 2100
      ? gradYearNum
      : null;

  const gpaNum = Number(raw.gpa);
  const gpa = Number.isFinite(gpaNum) && gpaNum >= 0 && gpaNum <= 100 ? gpaNum : null;

  const db = adminClient();
  const ipHash = hashIp(ip);

  // 同一号码 24 小时内只收一次，避免重复提交和误触
  const since = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  const { data: existing, error: checkError } = await db
    .from("applications")
    .select("id")
    .eq("phone", phone)
    .gte("created_at", since)
    .limit(1);

  if (checkError) {
    console.error("[applications] 查重失败", checkError.message);
    return Response.json({ error: "系统繁忙，请稍后重试" }, { status: 500 });
  }
  if (existing && existing.length > 0) {
    return Response.json({ error: "这个号码刚刚已经提交过，请勿重复报名" }, { status: 409 });
  }

  const { error: insertError } = await db.from("applications").insert({
    full_name: fullName,
    phone,
    gender,
    birth_date: birthDate,
    province: str(raw.address, 200) || null,
    high_school: str(raw.highSchool, 120) || null,
    grad_year: gradYear,
    gpa,
    scholarship: raw.scholarship === true,
    note: str(raw.note, 500) || null,
    locale: isLocale(raw.locale) ? raw.locale : "lo",
    ip_hash: ipHash,
  });

  if (insertError) {
    console.error("[applications] 写入失败", insertError.message);
    return Response.json({ error: "提交失败，请稍后重试或直接致电" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
