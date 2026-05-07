export function SideNav({ items }) {
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-24 space-y-1">
        <p className="mb-3 px-3 text-xs font-extrabold uppercase tracking-wider text-zinc-700">
          API Reference
        </p>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex items-center justify-between border-2 border-transparent px-3 py-2 text-sm font-bold text-[var(--foreground)] hover:border-[var(--border)] hover:bg-[var(--secondary-background)] hover:shadow-[2px_2px_0_0_var(--border)]"
          >
            <span>{item.label}</span>
            <span className="font-mono text-[10px] text-zinc-700">{item.method}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
