import type { ReactNode, SVGProps } from "react";

type IconName =
  | "admission"
  | "system"
  | "campus"
  | "book"
  | "public"
  | "mail"
  | "arrow"
  | "arrowUpRight"
  | "search"
  | "menu"
  | "close"
  | "phone"
  | "location"
  | "chevronDown"
  | "play"
  | "award"
  | "heart"
  | "mountain"
  | "chat"
  | "send"
  | "spark";

const paths: Record<IconName, ReactNode> = {
  admission: (
    <>
      <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" />
      <path d="M7 10.8V16c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8v-5.2" />
      <path d="M20 8.5V14" />
    </>
  ),
  system: (
    <>
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
      <path d="M9 20h6M12 16.5V20" />
      <path d="M7.5 9h4M7.5 12h7" />
    </>
  ),
  campus: (
    <>
      <path d="M3.5 20h17" />
      <path d="M5.5 20V9.5L12 5l6.5 4.5V20" />
      <path d="M10 20v-4.5h4V20" />
      <path d="M9.5 11.5h1.5M13 11.5h1.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2 2 0 0 1 6 3.5h5v17H6a2 2 0 0 0-2 2Z" />
      <path d="M20 5.5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2Z" />
    </>
  ),
  public: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </>
  ),
  arrow: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H8.5M17 7v8.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  ),
  location: (
    <>
      <path d="M12 21s6.5-6.1 6.5-11a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  play: <path d="M9 6.5 18 12l-9 5.5v-11Z" />,
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.7 13.4-1.3 7.2 4.6-2.4 4.6 2.4-1.3-7.2" />
    </>
  ),
  heart: (
    <path d="M12 20.2s-7.6-4.6-7.6-9.7A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 2.9c0 5.1-7.6 9.7-7.6 9.7Z" />
  ),
  mountain: (
    <>
      <path d="M3 19.5h18" />
      <path d="m4.5 19.5 5.4-9.6 3.1 5.4 2.2-3.4 4.3 7.6" />
      <path d="m8.4 12.6 1.5-2.7 1.5 2.7" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 11.6c0 3.9-3.8 7-8.5 7-1 0-2-.1-2.9-.4L4 20l1.4-3.7c-1.2-1.3-1.9-2.9-1.9-4.7 0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" />
      <path d="M8.8 11.6h.01M12 11.6h.01M15.2 11.6h.01" />
    </>
  ),
  send: (
    <>
      <path d="M20.5 3.5 10.6 13.4" />
      <path d="M20.5 3.5 14.2 20.5l-3.6-7.1-7.1-3.6 17-6.3Z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M18.5 15.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
  ...rest
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
