import { Terminal } from "lucide-react";
import type { ReactNode } from "react";

export function CodePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="neo-card overflow-hidden">
      <div className="flex items-center justify-between border-b-2 border-[var(--border)] bg-[var(--chart-5)] px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
          <Terminal size={16} />
          {title}
        </div>
        <div className="flex gap-1">
          <span className="h-3 w-3 border-2 border-[var(--border)] bg-[var(--chart-4)]" />
          <span className="h-3 w-3 border-2 border-[var(--border)] bg-[var(--chart-2)]" />
          <span className="h-3 w-3 border-2 border-[var(--border)] bg-[var(--main)]" />
        </div>
      </div>
      <pre className="overflow-x-auto bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
        {children}
      </pre>
    </div>
  );
}
