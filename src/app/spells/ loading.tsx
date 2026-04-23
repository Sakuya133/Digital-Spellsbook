export default function LoadingSpellsPage() {
  return (
    <section className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-white/10" />
      <div className="h-14 w-full animate-pulse rounded-2xl bg-white/10" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </section>
  )
}