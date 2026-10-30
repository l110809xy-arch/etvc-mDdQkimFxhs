import { requireAdmin } from "@/lib/admin-auth";
import { changePassword } from "./actions";

// 后台必须运行时渲染（读 cookie 判登录），不能静态预渲染
export const instant = false;

const MESSAGES: Record<string, { text: string; tone: "ok" | "err" }> = {
  ok: { text: "密码已更新，下次登录请用新密码。", tone: "ok" },
  short: { text: "新密码至少 10 位。", tone: "err" },
  mismatch: { text: "两次输入的密码不一致。", tone: "err" },
  offline: { text: "数据库未配置，无法修改密码。", tone: "err" },
  failed: { text: "修改失败，请稍后重试。", tone: "err" },
};

const inputClass =
  "w-full border border-pine/20 bg-paper px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-pine/60";

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const msg = params.err ? MESSAGES[params.err] : params.ok ? MESSAGES.ok : null;

  return (
    <div className="max-w-xl space-y-6">
      <header>
        <h1 className="font-serif text-[26px] text-pine">账号安全</h1>
        <p className="mt-1.5 text-[13px] text-ink-soft">
          当前登录：{admin.email ?? "管理员"}
        </p>
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

      <form action={changePassword} className="space-y-4 border border-pine/12 bg-paper p-6">
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-ink-soft" htmlFor="password">
            新密码（至少 10 位）
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-ink-soft" htmlFor="confirm">
            再输一次
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="bg-pine px-5 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-pine/90"
        >
          更新密码
        </button>

        <p className="text-[11.5px] leading-relaxed text-ink-soft/70">
          建议用「字母 + 数字 + 符号」的组合，不要用学校名、电话或年份。改完请自己记牢——系统没有找回密码的入口，
          忘了只能在 Supabase 后台重置。
        </p>
      </form>
    </div>
  );
}
