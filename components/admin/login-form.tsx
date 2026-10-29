"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setPending(true);

    try {
      const supabase = browserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "邮箱或密码不正确"
            : authError.message,
        );
        setPending(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "登录失败，请重试");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-ink-soft">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-pine/20 bg-paper px-3.5 py-3 text-[14px] outline-none focus:border-pine/60"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[12px] font-medium text-ink-soft">
          密码
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-pine/20 bg-paper px-3.5 py-3 text-[14px] outline-none focus:border-pine/60"
        />
      </div>

      {error && (
        <p className="border-l-2 border-cinnabar bg-cinnabar/8 px-3 py-2 text-[12.5px] text-cinnabar">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-pine px-6 py-3.5 text-[14px] font-medium text-paper transition-colors hover:bg-pine/90 disabled:opacity-60"
      >
        {pending ? "登录中…" : "登录"}
      </button>
    </form>
  );
}
