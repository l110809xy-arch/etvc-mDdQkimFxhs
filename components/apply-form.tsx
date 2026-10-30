"use client";

/**
 * 在线报名表单
 *
 * 字段刻意精简：姓名、电话必填，其余选填。
 * 提交到 /api/applications，成功后整块替换成确认卡片。
 */

import { useState } from "react";
import { apply } from "@/lib/content";
import { useLocale } from "./locale-provider";
import { Icon } from "./icons";

type Status = "idle" | "submitting" | "done";

const inputClass =
  "w-full border border-pine/18 bg-paper px-3.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-pine/55 focus:bg-white";

const labelClass = "mb-1.5 block text-[12px] font-medium text-ink-soft";

export function ApplyForm() {
  const { locale, t } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (!fullName || !phone) {
      setError(t(apply.errors.required));
      return;
    }
    if (!/^\+?[\d\s()\-.]{7,20}$/.test(phone)) {
      setError(t(apply.errors.phone));
      return;
    }

    setError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          gender: String(data.get("gender") ?? ""),
          birthDate: String(data.get("birthDate") ?? ""),
          address: String(data.get("address") ?? ""),
          highSchool: String(data.get("highSchool") ?? ""),
          gradYear: String(data.get("gradYear") ?? ""),
          gpa: String(data.get("gpa") ?? ""),
          scholarship: data.get("scholarship") === "on",
          note: String(data.get("note") ?? ""),
          locale,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error || t(apply.errors.network));
        setStatus("idle");
        return;
      }

      form.reset();
      setStatus("done");
    } catch {
      setError(t(apply.errors.network));
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-pine/15 bg-paper-2 p-8 text-center sm:p-12">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pine text-paper">
          <Icon name="spark" className="h-6 w-6" />
        </span>
        <h3 className="mt-5 font-serif text-[21px] text-pine">{t(apply.successTitle)}</h3>
        <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-ink-soft">
          {t(apply.successBody)}
        </p>
        {/* 提交完是最想立刻得到确认的时刻，给一条直达 WhatsApp 的路 */}
        <a
          href="https://wa.me/8562058258055"
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-6 inline-flex items-center gap-2 bg-pine px-5 py-2.5 text-[13px] text-paper transition-colors hover:bg-pine/90"
        >
          {t(apply.successWhatsapp)}
          <Icon name="arrowUpRight" className="h-3.5 w-3.5 opacity-80" />
        </a>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mx-auto mt-3 block border border-pine/25 px-5 py-2.5 text-[13px] text-pine transition-colors hover:bg-pine hover:text-paper"
        >
          {t(apply.successAgain)}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-pine/12 bg-paper-2/60 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="ap-name">
            {t(apply.fields.fullName)} <span className="text-cinnabar">*</span>
          </label>
          <input
            id="ap-name"
            name="fullName"
            required
            maxLength={80}
            autoComplete="name"
            className={inputClass}
            placeholder={t(apply.fields.fullName)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-phone">
            {t(apply.fields.phone)} <span className="text-cinnabar">*</span>
          </label>
          <input
            id="ap-phone"
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

        <div>
          <label className={labelClass} htmlFor="ap-gender">
            {t(apply.fields.gender)}
          </label>
          <select id="ap-gender" name="gender" className={inputClass} defaultValue="">
            <option value="" />
            <option value="male">{t(apply.genderOptions.male)}</option>
            <option value="female">{t(apply.genderOptions.female)}</option>
            <option value="other">{t(apply.genderOptions.other)}</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-birth">
            {t(apply.fields.birthDate)}
          </label>
          <input
            id="ap-birth"
            name="birthDate"
            type="date"
            className={inputClass}
            min="1950-01-01"
            max="2015-12-31"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="ap-address">
            {t(apply.fields.address)}
          </label>
          <input
            id="ap-address"
            name="address"
            maxLength={200}
            className={inputClass}
            placeholder="Vientiane / Xaythany / Ban Viengkham"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-school">
            {t(apply.fields.highSchool)}
          </label>
          <input
            id="ap-school"
            name="highSchool"
            maxLength={120}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="ap-year">
              {t(apply.fields.gradYear)}
            </label>
            <input
              id="ap-year"
              name="gradYear"
              type="number"
              inputMode="numeric"
              min={1970}
              max={2030}
              className={inputClass}
              placeholder="2026"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="ap-gpa">
              {t(apply.fields.gpa)}
            </label>
            <input
              id="ap-gpa"
              name="gpa"
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              max={100}
              className={inputClass}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="ap-note">
            {t(apply.fields.note)}
          </label>
          <textarea
            id="ap-note"
            name="note"
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-y`}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
          <input
            type="checkbox"
            name="scholarship"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#0d3b35]"
          />
          <span className="text-[13px] leading-relaxed text-ink">{t(apply.scholarship)}</span>
        </label>
      </div>

      {error && (
        <p className="mt-5 border-l-2 border-cinnabar bg-cinnabar/8 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-cinnabar">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 bg-pine px-6 py-3.5 text-[14px] font-medium text-paper transition-colors hover:bg-pine/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t(apply.submitting) : t(apply.submit)}
        <Icon name="arrow" className="h-4 w-4" />
      </button>
    </form>
  );
}
