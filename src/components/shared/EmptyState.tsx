export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="py-16 text-center"><div className="eyebrow mb-3">Nothing here</div><h3 className="text-2xl font-semibold tracking-tight">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm muted">{body}</p></div>;
}
