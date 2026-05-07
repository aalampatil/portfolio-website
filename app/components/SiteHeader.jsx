import { Braces, Github, Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-[var(--border)] bg-[var(--secondary-background)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#overview" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border)] bg-[var(--main)] text-[var(--main-foreground)] shadow-[2px_2px_0_0_var(--border)]">
            <Braces size={20} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[var(--foreground)]">Aalam API</p>
            <p className="font-mono text-xs font-bold text-zinc-700">docs/v2</p>
          </div>
        </a>
        <div className="hidden items-center gap-2 border-2 border-[var(--border)] bg-[var(--chart-2)] px-3 py-2 text-sm font-bold text-[var(--foreground)] shadow-[2px_2px_0_0_var(--border)] md:flex">
          <Search size={15} />
          Search docs coming soon
          <kbd className="ml-2 border-2 border-[var(--border)] bg-[var(--secondary-background)] px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd>
        </div>
        <a
          href="https://github.com/aalampatil"
          target="_blank"
          rel="noreferrer"
          className="neo-button-secondary inline-flex items-center gap-2 px-3 py-2 text-sm font-extrabold"
        >
          <Github size={16} />
          GitHub
        </a>
      </div>
    </header>
  );
}
