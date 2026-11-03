import Link from "next/link";
import { adminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

// 后台必须运行时渲染（读 cookie 判登录），不能静态预渲染
export const instant = false;


type Stats = {
  total: number;
  pending: number;
  reviewing: number;
  accepted: number;
  rejected: number;
  enrolled: number;
  scholarship_applied: number;
  last_7_days: number;
  last_30_days: number;
};

type RecentRow = {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
  status: string;
  scholarship: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "待审核",
  reviewing: "审核中",
  accepted: "已录取",
  rejected: "未录取",
  enrolled: "已入学",
};

function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function AdminHome() {
  await requireAdmin();
  const db = adminClient();

  const [
    { data: statsRow },
    { data: recent },
    { data: quotaRow },
    { count: chatMessages },
    { count: leadOpen },
  ] = await Promise.all([
    db.from("application_stats").select("*").single(),
    db
      .from("applications")
      .select("id, full_name, phone, created_at, status, scholarship")
      .order("created_at", { ascending: false })
      .limit(6),
    db.from("settings").select("value").eq("key", "admission.quota").maybeSingle(),
    // 原来是把最多 2000 行 session_id 拉到服务端再去重算会话数，
    // 数据一多就会拖慢整页。改成 head 计数，只回一个数字。
    db.from("chat_messages").select("id", { count: "exact", head: true }),
    db.from("leads").select("id", { count: "exact", head: true }).eq("handled", false),
  ]);

  const stats = (statsRow ?? {
    total: 0,
    pending: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
    enrolled: 0,
    scholarship_applied: 0,
    last_7_days: 0,
    last_30_days: 0,
  }) as Stats;

  const quota = typeof quotaRow?.value === "number" ? quotaRow.value : 120;
  const pct = Math.min(100, Math.round((stats.total / Math.max(1, quota)) * 100));

  const cards = [
    { label: "报名总数", value: stats.total, hint: `近 7 天 ${stats.last_7_days} 条` },
    { label: "待审核", value: stats.pending, hint: "需要尽快处理", accent: true },
    { label: "已录取", value: stats.accepted + stats.enrolled, hint: `已入学 ${stats.enrolled}` },
    { label: "奖学金申请", value: stats.scholarship_applied, hint: "每年 50 个名额" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-[26px] text-pine">概览</h1>
        <p className="mt-1.5 text-[13px] text-ink-soft">
          数据实时来自数据库，刷新即最新。
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`border p-4 ${
              card.accent ? "border-cinnabar/30 bg-cinnabar/5" : "border-pine/12 bg-paper"
            }`}
          >
            <p className="text-[11.5px] text-ink-soft">{card.label}</p>
            <p
              className={`mt-2 font-serif text-[30px] leading-none ${
                card.accent ? "text-cinnabar" : "text-pine"
              }`}
            >
              {card.value}
            </p>
            <p className="mt-2 text-[11px] text-ink-soft/60">{card.hint}</p>
          </div>
        ))}
      </div>

      {/* 名额进度 */}
      <section className="border border-pine/12 bg-paper p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] text-ink-soft">招生名额使用情况</p>
            <p className="mt-1 font-serif text-[19px] text-pine">
              {stats.total} / {quota}
            </p>
          </div>
          <p className="text-[12px] text-ink-soft/70">剩余 {Math.max(0, quota - stats.total)}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-pine/10">
          <div
            className="h-full rounded-full bg-pine transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-ink-soft/60">
          名额上限可在 Supabase 的 settings 表里改（key: admission.quota）
        </p>
      </section>

      {/* 最近报名 */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[17px] text-pine">最近报名</h2>
          <Link
            href="/admin/applications"
            className="text-[12.5px] text-cinnabar hover:underline"
          >
            查看全部 →
          </Link>
        </div>

        {recent && recent.length > 0 ? (
          <div className="mt-3 overflow-x-auto border border-pine/12 bg-paper">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-pine/12 text-[11px] text-ink-soft">
                  <th className="px-4 py-3 font-medium">姓名</th>
                  <th className="px-4 py-3 font-medium">电话</th>
                  <th className="px-4 py-3 font-medium">时间</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {(recent as RecentRow[]).map((row) => (
                  <tr key={row.id} className="border-b border-pine/8 last:border-0">
                    <td className="px-4 py-3 text-[13.5px] text-ink">
                      {row.full_name}
                      {row.scholarship && (
                        <span className="ml-2 rounded bg-gold/20 px-1.5 py-0.5 text-[10px] text-pine">
                          奖
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ink-soft">{row.phone}</td>
                    <td className="px-4 py-3 text-[12.5px] text-ink-soft/70">
                      {fmt(row.created_at)}
                    </td>
                    <td className="px-4 py-3 text-[12.5px]">
                      <span
                        className={
                          row.status === "pending"
                            ? "text-cinnabar"
                            : row.status === "accepted" || row.status === "enrolled"
                              ? "text-pine"
                              : "text-ink-soft"
                        }
                      >
                        {STATUS_LABEL[row.status] ?? row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 border border-dashed border-pine/20 bg-paper px-4 py-10 text-center text-[13px] text-ink-soft/70">
            还没有报名记录。学生通过首页「在线报名」提交后会出现在这里。
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/applications"
          className="border border-pine/12 bg-paper p-4 transition-colors hover:border-pine/35"
        >
          <p className="text-[13.5px] text-pine">报名管理</p>
          <p className="mt-1 text-[11.5px] text-ink-soft">筛选、改状态、导出 CSV</p>
        </Link>
        <Link
          href="/admin/leads"
          className="border border-pine/12 bg-paper p-4 transition-colors hover:border-pine/35"
        >
          <p className="text-[13.5px] text-pine">留言咨询</p>
          <p className="mt-1 text-[11.5px] text-ink-soft">
            {(leadOpen ?? 0) > 0 ? `${leadOpen} 条待处理` : "暂无待处理留言"}
          </p>
        </Link>
        <Link
          href="/admin/content"
          className="border border-pine/12 bg-paper p-4 transition-colors hover:border-pine/35"
        >
          <p className="text-[13.5px] text-pine">内容编辑</p>
          <p className="mt-1 text-[11.5px] text-ink-soft">改公告、学费、联系方式</p>
        </Link>
        <Link
          href="/admin/chats"
          className="border border-pine/12 bg-paper p-4 transition-colors hover:border-pine/35"
        >
          <p className="text-[13.5px] text-pine">客服对话</p>
          <p className="mt-1 text-[11.5px] text-ink-soft">{chatMessages ?? 0} 条消息记录</p>
        </Link>
      </section>
    </div>
  );
}
