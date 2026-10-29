import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";

// 后台必须运行时渲染（读 cookie 判登录），不能静态预渲染
export const instant = false;


type Msg = {
  id: number;
  session_id: string;
  locale: string | null;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

function fmt(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function ChatsPage() {
  await requireAdmin();

  const { data, error } = await adminClient()
    .from("chat_messages")
    .select("id, session_id, locale, role, content, created_at")
    .order("id", { ascending: false })
    .limit(400);

  const rows = (data ?? []) as Msg[];

  // 按会话归组，最近的会话排前面
  const groups = new Map<string, Msg[]>();
  for (const row of rows) {
    const list = groups.get(row.session_id) ?? [];
    list.push(row);
    groups.set(row.session_id, list);
  }

  const sessions = [...groups.entries()]
    .map(([id, list]) => ({
      id,
      messages: list.slice().reverse(),
      lastAt: list[0]?.created_at ?? "",
      locale: list[0]?.locale ?? "",
    }))
    .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1))
    .slice(0, 30);

  const userQuestions = rows.filter((r) => r.role === "user").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-[26px] text-pine">客服对话</h1>
        <p className="mt-1.5 text-[13px] text-ink-soft">
          最近 {sessions.length} 个会话，共 {rows.length} 条消息（其中学生提问 {userQuestions} 条）
        </p>
      </header>

      {error && (
        <p className="border-l-2 border-cinnabar bg-cinnabar/8 px-3 py-2 text-[12.5px] text-cinnabar">
          读取失败：{error.message}
        </p>
      )}

      {sessions.length === 0 ? (
        <p className="border border-dashed border-pine/20 bg-paper px-4 py-14 text-center text-[13px] text-ink-soft/70">
          还没有对话记录。学生使用右下角 AI 客服后，问答会出现在这里。
        </p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <section key={session.id} className="border border-pine/12 bg-paper p-4">
              <div className="flex items-center justify-between border-b border-pine/8 pb-2.5">
                <p className="font-mono text-[11px] text-ink-soft/60">
                  会话 {session.id.slice(0, 12)}
                </p>
                <p className="text-[11.5px] text-ink-soft/60">
                  {session.locale?.toUpperCase()} · {fmt(session.lastAt)}
                </p>
              </div>

              <div className="mt-3 space-y-2.5">
                {session.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[88%] px-3 py-2 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "ml-auto bg-pine text-paper"
                        : "bg-paper-2 text-ink"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
