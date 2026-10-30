import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteApplication, updateStatus } from "./actions";

// 后台必须运行时渲染（读 cookie 判登录），不能静态预渲染
export const instant = false;


type Row = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  gender: string | null;
  birth_date: string | null;
  province: string | null;
  high_school: string | null;
  grad_year: number | null;
  gpa: number | null;
  scholarship: boolean;
  note: string | null;
  locale: string | null;
  status: string;
  status_note: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "待审核",
  reviewing: "审核中",
  accepted: "已录取",
  rejected: "未录取",
  enrolled: "已入学",
};

const FILTERS = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待审核" },
  { key: "reviewing", label: "审核中" },
  { key: "accepted", label: "已录取" },
  { key: "rejected", label: "未录取" },
  { key: "enrolled", label: "已入学" },
];

function fmtDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; msg?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const status = params.status && params.status !== "all" ? params.status : null;
  const q = (params.q ?? "").trim();

  // 操作后回到同一筛选条件
  const backParams = new URLSearchParams();
  if (status) backParams.set("status", status);
  if (q) backParams.set("q", q);
  const back = backParams.toString();

  const MSG: Record<string, { text: string; tone: "ok" | "err" }> = {
    saved: { text: "已保存，学生状态已更新。", tone: "ok" },
    deleted: { text: "已删除这条报名记录。", tone: "ok" },
    failed: { text: "删除失败，请稍后重试。", tone: "err" },
    denied: { text: "当前账号没有删除权限。", tone: "err" },
    invalid: { text: "操作参数不完整，请刷新页面重试。", tone: "err" },
  };
  const msg = params.msg ? MSG[params.msg] : null;

  let query = adminClient()
    .from("applications")
    .select(
      "id, created_at, full_name, phone, gender, birth_date, province, high_school, grad_year, gpa, scholarship, note, locale, status, status_note",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) query = query.eq("status", status);
  if (q) query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,high_school.ilike.%${q}%`);

  const { data, error } = await query;
  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-pine">报名管理</h1>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            共 {rows.length} 条记录{status ? `（筛选：${STATUS_LABEL[status] ?? status}）` : ""}
          </p>
        </div>
        {/* 下载文件必须用原生 <a>，Link 会走客户端路由拿不到文件流 */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/admin/applications/export"
          className="border border-pine/25 px-4 py-2.5 text-[12.5px] text-pine transition-colors hover:bg-pine hover:text-paper"
        >
          导出 CSV
        </a>
      </header>

      {/* 筛选 */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = (params.status ?? "all") === f.key;
          return (
            <Link
              key={f.key}
              href={`/admin/applications?status=${f.key}`}
              className={`border px-3 py-1.5 text-[12.5px] transition-colors ${
                active
                  ? "border-pine bg-pine text-paper"
                  : "border-pine/18 text-ink/70 hover:border-pine/40"
              }`}
            >
              {f.label}
            </Link>
          );
        })}

        <form action="/admin/applications" className="ml-auto flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="搜姓名 / 电话 / 学校"
            className="w-48 border border-pine/18 bg-paper px-3 py-1.5 text-[12.5px] outline-none focus:border-pine/50"
          />
          <button
            type="submit"
            className="border border-pine/25 px-3 py-1.5 text-[12.5px] text-pine hover:bg-pine hover:text-paper"
          >
            搜索
          </button>
        </form>
      </div>

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
          没有符合条件的报名记录。
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="border border-pine/12 bg-paper p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-[15px] text-ink">
                    <span className="font-medium">{row.full_name}</span>
                    {row.scholarship && (
                      <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] text-pine">
                        申请奖学金
                      </span>
                    )}
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        row.status === "pending"
                          ? "bg-cinnabar/12 text-cinnabar"
                          : row.status === "accepted" || row.status === "enrolled"
                            ? "bg-pine/12 text-pine"
                            : "bg-ink/8 text-ink-soft"
                      }`}
                    >
                      {STATUS_LABEL[row.status] ?? row.status}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[13px] text-ink-soft">
                    <a href={`tel:${row.phone}`} className="hover:text-pine">
                      {row.phone}
                    </a>
                    <span className="mx-2 text-ink-soft/30">·</span>
                    {fmtDate(row.created_at)}
                  </p>
                </div>

                <div className="text-right text-[11.5px] text-ink-soft/60">
                  <p>{row.locale?.toUpperCase() ?? "—"} 提交</p>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-pine/8 pt-3 text-[12.5px] sm:grid-cols-4">
                <div>
                  <dt className="text-ink-soft/60">性别</dt>
                  <dd className="text-ink">
                    {row.gender === "male" ? "男" : row.gender === "female" ? "女" : row.gender === "other" ? "未说明" : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-soft/60">出生日期</dt>
                  <dd className="text-ink">{row.birth_date ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft/60">毕业年份</dt>
                  <dd className="text-ink">{row.grad_year ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-ink-soft/60">毕业成绩</dt>
                  <dd className="text-ink">{row.gpa ?? "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-ink-soft/60">毕业学校</dt>
                  <dd className="text-ink">{row.high_school ?? "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-ink-soft/60">住址</dt>
                  <dd className="text-ink">{row.province ?? "—"}</dd>
                </div>
                {row.note && (
                  <div className="col-span-2 sm:col-span-4">
                    <dt className="text-ink-soft/60">备注</dt>
                    <dd className="whitespace-pre-wrap break-words text-ink">{row.note}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-pine/8 pt-3">
                <form action={updateStatus} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="back" value={back} />
                  <select
                    name="status"
                    defaultValue={row.status}
                    className="border border-pine/20 bg-paper px-2.5 py-1.5 text-[12.5px] outline-none focus:border-pine/50"
                  >
                    {Object.entries(STATUS_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <input
                    name="note"
                    defaultValue={row.status_note ?? ""}
                    placeholder="审核备注（选填）"
                    className="w-44 border border-pine/20 bg-paper px-2.5 py-1.5 text-[12.5px] outline-none focus:border-pine/50"
                  />
                  <button
                    type="submit"
                    className="bg-pine px-3 py-1.5 text-[12.5px] text-paper hover:bg-pine/90"
                  >
                    保存
                  </button>
                </form>

                {admin.role === "admin" && (
                  <form action={deleteApplication} className="ml-auto">
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="back" value={back} />
                    <ConfirmButton
                      message={`确定删除 ${row.full_name} 的报名记录？删除后无法恢复。`}
                      className="text-[12px] text-ink-soft/50 transition-colors hover:text-cinnabar"
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
