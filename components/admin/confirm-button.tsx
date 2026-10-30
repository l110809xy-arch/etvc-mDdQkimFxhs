"use client";

import type { ReactNode } from "react";

/**
 * 危险操作按钮：点击先弹确认框，取消就不提交表单。
 * 用在服务端渲染的 <form action={serverAction}> 里，所以只需要拦一次 click。
 */
export function ConfirmButton({
  children,
  message,
  className,
}: {
  children: ReactNode;
  message: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
