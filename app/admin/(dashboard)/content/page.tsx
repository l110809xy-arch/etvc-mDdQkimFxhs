import { requireAdmin } from "@/lib/admin-auth";
import { editableFields } from "@/lib/editable";
import { localeMeta, locales } from "@/lib/i18n";
import { adminClient } from "@/lib/supabase/admin";
import { resetContent, saveContent } from "./actions";

export const instant = false;

export default async function ContentPage() {
  await requireAdmin();

  const { data } = await adminClient().from("content_overrides").select("key, locale, value");
  const overrides = new Map<string, string>();
  for (const row of (data ?? []) as { key: string; locale: string; value: string }[]) {
    overrides.set(`${row.key}|${row.locale}`, row.value);
  }

  const groups = [...new Set(editableFields.map((f) => f.group))];
  const customCount = overrides.size;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-[26px] text-pine">内容编辑</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
          改完点保存，网站首页立即更新，不用重新部署。
          把内容改回默认值即等于取消自定义。
          {customCount > 0 && (
            <span className="ml-1 text-cinnabar">当前有 {customCount} 处自定义。</span>
          )}
        </p>
      </header>

      {groups.map((group) => (
        <section key={group} className="space-y-3">
          <h2 className="border-b border-pine/12 pb-2 text-[11px] tracking-[0.2em] text-ink-soft">
            {group.toUpperCase()}
          </h2>

          {editableFields
            .filter((f) => f.group === group)
            .map((field) => {
              const isCustom = locales.some((l) => overrides.has(`${field.key}|${l}`));

              return (
                <div key={field.key} className="border border-pine/12 bg-paper p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="text-[14px] text-ink">
                        {field.label}
                        {isCustom && (
                          <span className="ml-2 rounded bg-cinnabar/12 px-1.5 py-0.5 text-[10px] text-cinnabar">
                            已自定义
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-ink-soft/50">
                        {field.key}
                        {field.hint ? ` · ${field.hint}` : ""}
                      </p>
                    </div>

                    {isCustom && (
                      <form action={resetContent}>
                        <input type="hidden" name="key" value={field.key} />
                        <button
                          type="submit"
                          className="text-[11.5px] text-ink-soft/60 hover:text-cinnabar"
                        >
                          恢复默认
                        </button>
                      </form>
                    )}
                  </div>

                  <form action={saveContent} className="mt-3 space-y-2.5">
                    <input type="hidden" name="key" value={field.key} />

                    <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                      {locales.map((locale) => {
                        const custom = overrides.get(`${field.key}|${locale}`);
                        const value = custom ?? field.value[locale];

                        return (
                          <label key={locale} className="block">
                            <span className="mb-1 flex items-center gap-1.5 text-[11px] text-ink-soft/70">
                              <span lang={localeMeta[locale].htmlLang}>
                                {localeMeta[locale].native}
                              </span>
                              <span className="text-ink-soft/40">
                                {localeMeta[locale].short}
                              </span>
                              {custom && <span className="text-cinnabar/70">●</span>}
                            </span>
                            {field.multiline ? (
                              <textarea
                                name={`v_${locale}`}
                                defaultValue={value}
                                rows={3}
                                className="w-full resize-y border border-pine/18 bg-paper px-3 py-2 text-[12.5px] leading-relaxed outline-none focus:border-pine/50"
                              />
                            ) : (
                              <input
                                name={`v_${locale}`}
                                defaultValue={value}
                                className="w-full border border-pine/18 bg-paper px-3 py-2 text-[12.5px] outline-none focus:border-pine/50"
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>

                    <button
                      type="submit"
                      className="bg-pine px-4 py-2 text-[12.5px] text-paper transition-colors hover:bg-pine/90"
                    >
                      保存「{field.label}」
                    </button>
                  </form>
                </div>
              );
            })}
        </section>
      ))}

      <p className="border border-pine/12 bg-paper p-4 text-[12px] leading-relaxed text-ink-soft/70">
        学费数字、课程表、联系电话、地址这类结构化内容不在这个页面改 ——
        它们在 <code className="font-mono text-[11px]">lib/content.ts</code> 里，
        改动需要重新部署。这样可以避免后台误操作把表格结构改坏。
      </p>
    </div>
  );
}
