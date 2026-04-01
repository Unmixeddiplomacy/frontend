export function LoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-panel) p-5">
      <div className="mb-3 h-5 w-32 rounded bg-(--color-panel-soft)" />
      <div className="mb-2 h-8 w-44 rounded bg-(--color-panel-soft)" />
      <div className="h-4 w-24 rounded bg-(--color-panel-soft)" />
    </div>
  )
}
