import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteLead, setLeadHandled } from "./actions";

// 后台必须运行时渲染（读 cookie 判登录），不能静态预渲染
export const instant = false;

type Row = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  locale: string | null;
  handled: boolean;
  handled_at: string | null;
};

const SOURCE_LABEL: Record<string, string> = {
  "contact-form": "留言表单",
  chat: "AI 客服",
  application: "报名表",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; msg?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const filter = params.filter === "all" ? "all" : "open";

  const MSG: Record<string, { text: string; tone: "ok" | "err" }> = {
    handled: { text: "已标记为已处理。", tone: "ok" },
    reopened: { text: "已恢复为未处理。", tone: "ok" },
    deleted: { text: "已删除这条留言。", tone: "ok" },
    failed: { text: "操作失败，请稍后重试。", tone: "err" },
    denied: { text: "当前账号没有删除权限。", tone: "err" },
    invalid: { text: "操作参数不完整，请刷新页面重试。", tone: "err" },
  };
  const msg = params.msg ? MSG[params.msg] : null;

  const db = adminClient();

  let query = db
    .from("leads")
    .select("id, created_at, name, phone, email, message, source, locale, handled, handled_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filter === "open") query = query.eq("handled", false);

  const [{ data, error }, { count: openCount }, { count: totalCount }] = await Promise.all([
    query,
    db.from("leads").select("id", { count: "exact", head: true }).eq("handled", false),
    db.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-pine">留言咨询</h1>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            未处理 {openCount ?? 0} 条 · 累计 {totalCount ?? 0} 条
            {filter === "all" ? "（显示全部）" : "（只显示未处理）"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "open", label: "未处理" },
            { key: "all", label: "全部" },
          ].map((tab) => {
            const active = filter === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/admin/leads?filter=${tab.key}`}
                className={`border px-3.5 py-2 text-[12.5px] transition-colors ${
                  active
                    ? "border-pine bg-pine text-paper"
                    : "border-pine/25 text-pine hover:bg-pine/5"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </header>

      {msg && (
        <p
          className={`border-l-2 px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
            msg.tone === "ok"
              ? "border-pine bg-pine/8 text-pine"
              : "border-cinnabar bg-cinnabar/8 text-cinnabar"
          }`}
        >
          {msg.text}
        </p>
      )}

      {error && (
        <p className="border-l-2 border-cinnabar bg-cinnabar/8 px-3 py-2 text-[12.5px] text-cinnabar">
          读取失败：{error.message}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="border border-dashed border-pine/20 bg-paper px-4 py-14 text-center text-[13px] text-ink-soft/70">
          {filter === "open"
            ? "没有待处理的留言。学生通过首页「留言咨询」提交后会出现在这里。"
            : "还没有任何留言记录。"}
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article
              key={row.id}
              className={`border p-4 ${
                row.handled ? "border-pine/10 bg-paper/60" : "border-pine/15 bg-paper"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[14px] text-ink">{row.name || "未留姓名"}</span>
                  <a
                    href={`tel:${row.phone}`}
                    className="font-mono text-[12.5px] text-jade hover:underline"
                  >
                    {row.phone}
                  </a>
                  {row.email && (
                    <a
                      href={`mailto:${row.email}`}
                      className="text-[12px] text-ink-soft hover:text-jade"
                    >
                      {row.email}
                    </a>
                  )}
                  <span className="rounded bg-pine/8 px-1.5 py-0.5 text-[10.5px] text-ink-soft">
                    {SOURCE_LABEL[row.source] ?? row.source}
                  </span>
                  <span className="text-[10.5px] uppercase text-ink-soft/50">
                    {row.locale ?? ""}
                  </span>
                </div>

                <span className="text-[11.5px] text-ink-soft/60">{fmtDate(row.created_at)}</span>
              </div>

              {row.message && (
                <p className="mt-3 whitespace-pre-wrap break-words border-l-2 border-pine/15 pl-3 text-[13.5px] leading-relaxed text-ink">
                  {row.message}
                </p>
              )}

              <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-pine/8 pt-3">
                <form action={setLeadHandled}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="handled" value={row.handled ? "0" : "1"} />
                  <input type="hidden" name="back" value={filter} />
                  <button
                    type="submit"
                    className={`border px-3 py-1.5 text-[12px] transition-colors ${
                      row.handled
                        ? "border-pine/20 text-ink-soft hover:bg-paper-2"
                        : "border-pine bg-pine text-paper hover:bg-pine/90"
                    }`}
                  >
                    {row.handled ? "恢复为未处理" : "标记已处理"}
                  </button>
                </form>

                {row.handled && row.handled_at && (
                  <span className="text-[11px] text-ink-soft/55">
                    已于 {fmtDate(row.handled_at)} 处理
                  </span>
                )}

                {admin.role === "admin" && (
                  <form action={deleteLead} className="ml-auto">
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="back" value={filter} />
                    <ConfirmButton
                      message={`确定删除 ${row.name || row.phone} 的这条留言？删除后无法恢复。`}
                      className="px-2 py-1.5 text-[12px] text-ink-soft/60 transition-colors hover:text-cinnabar"
                    >
                      删除
                    </ConfirmButton>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
