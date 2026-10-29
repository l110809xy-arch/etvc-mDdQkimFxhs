"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "./icons";
import { useLocale } from "./locale-provider";
import { gallery, ui } from "@/lib/content";

/**
 * 学生生活图片长廊
 * 依据文档第 3 节要求：3 列网格（桌面）/ 1 列（移动）+ Lightbox 弹窗放大 + 每图 Alt。
 */
export function Gallery() {
  const { t } = useLocale();
  const items = gallery.items;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setOpenIndex((cur) => {
        if (cur === null) return cur;
        return (cur + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, step]);

  const current = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.src + i}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`${t(ui.viewLarger)}：${t(item.label)}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden bg-pine-deep text-left"
            >
              <span className="relative block aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={t(item.alt)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-pine-deep/90 via-pine-deep/15 to-transparent transition-opacity duration-500 group-hover:from-pine-deep/95" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <span>
                  <span className="block text-[9px] tracking-[0.22em] text-gold/85">
                    {item.tag}
                  </span>
                  <span className="mt-1 block font-serif text-[15px] text-paper">
                    {t(item.label)}
                  </span>
                </span>
                <Icon
                  name="arrowUpRight"
                  className="h-4 w-4 translate-y-1 text-paper/0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-paper/60"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-pine-deep/94 p-4 backdrop-blur-sm transition-opacity duration-300 sm:p-8 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-label={current ? t(current.label) : undefined}
        onClick={close}
      >
        {current ? (
          <div
            className="relative flex w-full max-w-5xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/30 sm:aspect-[16/10]">
              <Image
                src={current.src}
                alt={t(current.alt)}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9.5px] tracking-[0.22em] text-gold/80">{current.tag}</p>
                <p className="mt-1 truncate font-serif text-[16px] text-paper">
                  {t(current.label)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="mr-1 font-serif text-[12px] text-paper/45">
                  {(openIndex ?? 0) + 1} / {items.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t(ui.prev)}
                  className="grid h-10 w-10 place-items-center border border-paper/25 text-paper/80 transition-colors hover:border-paper/60 hover:text-paper"
                >
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t(ui.next)}
                  className="grid h-10 w-10 place-items-center border border-paper/25 text-paper/80 transition-colors hover:border-paper/60 hover:text-paper"
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={close}
          aria-label={t(ui.closeLightbox)}
          className="absolute top-4 right-4 grid h-11 w-11 place-items-center border border-paper/25 text-paper/80 transition-colors hover:border-paper/60 hover:text-paper sm:top-8 sm:right-8"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
