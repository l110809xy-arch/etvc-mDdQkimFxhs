"use client";

/**
 * 留言 / 咨询表单
 *
 * 放在「联系我们」区块里，给还没决定报名、但想问一句的人一个低门槛入口。
 * 只有电话和留言必填，提交到 /api/leads。
 */

import { useState } from "react";
import { lead } from "@/lib/content";
import { useLocale } from "./locale-provider";
import { Icon } from "./icons";

type Status = "idle" | "submitting" | "done";

const inputClass =
  "w-full border border-pine/18 bg-paper px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-pine/55 focus:bg-white";

const labelClass = "mb-1.5 block text-[12px] font-medium text-ink-soft";

export function LeadForm() {
  const { locale, t } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!/^\+?[\d\s()\-.]{7,20}$/.test(phone)) {
      setError(t(lead.errors.phone));
      return;
    }
    if (message.length < 2) {
      setError(t(lead.errors.message));
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError(t(lead.errors.email));
      return;
    }

    setError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          phone,
          email,
          message,
          locale,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error || t(lead.errors.network));
        setStatus("idle");
        return;
      }

      form.reset();
      setStatus("done");
    } catch {
      setError(t(lead.errors.network));
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="flex h-full flex-col justify-center border border-pine/15 bg-paper p-8 text-center sm:p-10">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-pine text-paper">
          <Icon name="spark" className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-serif text-[19px] text-pine">{t(lead.successTitle)}</h3>
        <p className="mx-auto mt-2.5 max-w-sm text-[13px] leading-relaxed text-ink-soft">
          {t(lead.successBody)}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mx-auto mt-5 border border-pine/25 px-4 py-2 text-[12.5px] text-pine transition-colors hover:bg-pine hover:text-paper"
        >
          {t(lead.successAgain)}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-pine/12 bg-paper p-6 sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="ld-name">
            {t(lead.fields.name)}
          </label>
          <input
            id="ld-name"
            name="name"
            maxLength={80}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ld-phone">
            {t(lead.fields.phone)} <span className="text-cinnabar">*</span>
          </label>
          <input
            id="ld-phone"
            name="phone"
            required
            type="tel"
            inputMode="tel"
            maxLength={30}
            autoComplete="tel"
            className={inputClass}
            placeholder="020 5825 8055"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="ld-email">
            {t(lead.fields.email)}
          </label>
          <input
            id="ld-email"
            name="email"
            type="email"
            maxLength={120}
            autoComplete="email"
            className={inputClass}
            placeholder="name@example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="ld-message">
            {t(lead.fields.message)} <span className="text-cinnabar">*</span>
          </label>
          <textarea
            id="ld-message"
            name="message"
            required
            rows={3}
            maxLength={800}
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 border-l-2 border-cinnabar bg-cinnabar/8 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-cinnabar">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 flex w-full items-center justify-center gap-2 bg-pine px-6 py-3 text-[13.5px] font-medium text-paper transition-colors hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t(lead.submitting) : t(lead.submit)}
        <Icon name="arrow" className="h-4 w-4" />
      </button>
    </form>
  );
}
