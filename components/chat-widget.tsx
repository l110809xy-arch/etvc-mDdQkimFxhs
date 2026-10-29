"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { chat } from "@/lib/content";
import { Icon } from "./icons";
import { useLocale } from "./locale-provider";

type Msg = { role: "user" | "assistant"; content: string };

/**
 * AI 智能客服悬浮窗
 * - 右下角悬浮按钮，移动端展开为全屏
 * - 流式输出（逐块追加，打字机效果）
 * - 界面文案跟随站点语言，回答语言由模型按用户输入自动判断
 */
export function ChatWidget() {
  const { locale, t } = useLocale();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  /** 服务端返回的具体原因（未配置 Key / 配额用尽等），便于线上排查 */
  const [failReason, setFailReason] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 会话 ID：同一浏览器会话内固定，用于后台把一问一答归组
  const sessionIdRef = useRef("");
  if (!sessionIdRef.current) {
    if (typeof window === "undefined") {
      sessionIdRef.current = "ssr";
    } else {
      let id = window.sessionStorage.getItem("etvc-chat-session");
      if (!id) {
        id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        window.sessionStorage.setItem("etvc-chat-session", id);
      }
      sessionIdRef.current = id;
    }
  }

  // 新消息 / 流式增量时贴底
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending, open]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // 桌面端打开后聚焦输入框；移动端不聚焦，避免键盘顶起面板
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 240);
    return () => window.clearTimeout(id);
  }, [open]);

  // 移动端全屏时锁背景滚动
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // 组件卸载时中断进行中的请求
  useEffect(() => () => abortRef.current?.abort(), []);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;

      const history: Msg[] = [...messages, { role: "user", content: text }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setFailed(false);
      setFailReason("");
      setPending(true);

      const controller = new AbortController();
      abortRef.current = controller;
      let acc = "";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            locale,
            sessionId: sessionIdRef.current,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const detail = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          console.error("[chat] 接口返回错误：", detail?.error ?? response.status);
          setMessages(history);
          setFailReason(detail?.error ?? "");
          setFailed(true);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages([...history, { role: "assistant", content: acc }]);
        }

        if (!acc.trim()) {
          setMessages(history);
          setFailed(true);
        }
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") {
          console.error("[chat] 请求失败：", error);
          setFailed(true);
        }
        // 保留已经流式生成的部分
        setMessages(
          acc ? [...history, { role: "assistant", content: acc }] : history,
        );
      } finally {
        setPending(false);
        abortRef.current = null;
      }
    },
    [locale, messages, pending],
  );

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 输入法组合中（中文/老挝语/韩文）不发送
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(input);
    }
  };

  const idle = messages.length === 0;

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t(chat.launcher)}
          title={t(chat.launcher)}
          className="fixed right-5 bottom-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-pine text-paper shadow-[0_14px_34px_-10px_rgba(13,59,53,0.7)] transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-95 sm:right-6 sm:bottom-6"
        >
          <Icon name="chat" className="h-[26px] w-[26px]" />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-paper bg-cinnabar" />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(chat.title)}
          className="fixed inset-0 z-[95] flex flex-col bg-paper sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[620px] sm:max-h-[calc(100dvh_-_6rem)] sm:w-[400px] sm:overflow-hidden sm:rounded-2xl sm:border sm:border-pine/12 sm:shadow-[0_28px_70px_-24px_rgba(13,59,53,0.5)]"
        >
          {/* 头部 */}
          <header className="flex shrink-0 items-start gap-3 bg-pine px-4 py-3.5 text-paper sm:rounded-t-2xl">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper/10">
              <Icon name="spark" className="h-4 w-4 text-gold" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium">{t(chat.title)}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-paper/60">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-jade-light" />
                <span className="truncate">{t(chat.subtitle)}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t(chat.close)}
              className="-mr-1 shrink-0 rounded p-1.5 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </header>

          {/* 消息区 */}
          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {idle && (
              <>
                <Bubble role="assistant">{t(chat.greeting)}</Bubble>
                <div className="pt-1">
                  <p className="text-[10px] tracking-[0.18em] text-ink-soft/65">
                    {t(chat.quickLabel)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {chat.quick.map((item) => (
                      <button
                        key={item.label.zh}
                        type="button"
                        onClick={() => void send(t(item.question))}
                        className="rounded-full border border-pine/20 bg-paper px-3 py-1.5 text-[12px] text-pine transition-colors hover:border-pine/45 hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      >
                        {t(item.label)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {messages.map((message, index) => {
              const isStreaming = pending && index === messages.length - 1;

              if (message.role === "assistant" && !message.content && isStreaming) {
                return <Typing key={index} label={t(chat.thinking)} />;
              }

              return (
                <Bubble key={index} role={message.role}>
                  {message.content}
                </Bubble>
              );
            })}

            {failed && (
              <p className="rounded-lg bg-cinnabar/10 px-3 py-2.5 text-[12.5px] leading-relaxed text-cinnabar">
                {t(chat.error)}
                {failReason && (
                  <span className="mt-1 block text-[11px] text-cinnabar/75">
                    {failReason}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* 输入区 */}
          <div className="shrink-0 border-t border-pine/10 bg-paper px-3 pt-3 pb-[max(10px,env(safe-area-inset-bottom))] sm:rounded-b-2xl sm:pb-2.5">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onInputKeyDown}
                rows={1}
                maxLength={500}
                placeholder={t(chat.placeholder)}
                aria-label={t(chat.placeholder)}
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-pine/15 bg-paper-2/60 px-3 py-2.5 text-[13.5px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-ink-soft/55 focus:border-pine/40"
              />
              <button
                type="button"
                onClick={() => void send(input)}
                disabled={!input.trim() || pending}
                aria-label={t(chat.send)}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-pine text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Icon name="send" className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] leading-relaxed text-ink-soft/60">
              {t(chat.disclaimer)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.75] break-words whitespace-pre-wrap ${
          isUser
            ? "rounded-br-md bg-pine text-paper"
            : "rounded-bl-md bg-paper-2 text-ink"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Typing({ label }: { label: string }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-paper-2 px-3.5 py-3">
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/50 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/50 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/50" />
        </span>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
