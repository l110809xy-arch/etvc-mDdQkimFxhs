/**
 * 后台加载骨架
 *
 * 后台每个页面都要先验登录、再查库，天然有几百毫秒到 1 秒的空窗。
 * 有了这个 loading.tsx，点击菜单的瞬间就会渲染骨架，
 * 而不是停在旧页面上等服务器返回——感知延迟从「卡住」变成「立刻响应」。
 *
 * 骨架刻意只画内容区，侧栏由 layout 渲染且不会卸载，切页时保持静止。
 */
export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">加载中…</span>

      {/* 标题 */}
      <div className="space-y-3">
        <div className="h-7 w-28 rounded-sm bg-pine/10" />
        <div className="h-3.5 w-56 rounded-sm bg-pine/6" />
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-pine/12 bg-paper p-4">
            <div className="h-3 w-16 rounded-sm bg-pine/8" />
            <div className="mt-3 h-7 w-12 rounded-sm bg-pine/12" />
            <div className="mt-3 h-2.5 w-20 rounded-sm bg-pine/6" />
          </div>
        ))}
      </div>

      {/* 表格 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded-sm bg-pine/10" />
          <div className="h-3 w-16 rounded-sm bg-pine/6" />
        </div>
        <div className="border border-pine/12 bg-paper">
          <div className="border-b border-pine/12 px-4 py-3">
            <div className="h-3 w-full max-w-md rounded-sm bg-pine/8" />
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-pine/8 px-4 py-4 last:border-0">
              <div className="h-3.5 w-full max-w-lg rounded-sm bg-pine/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
