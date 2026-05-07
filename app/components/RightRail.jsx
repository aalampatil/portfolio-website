import { Code2, Layers3, MonitorPlay, Network, Server } from "lucide-react";

export function RightRail() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-4">
        <div className="neo-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <Server className="text-[var(--chart-5)]" size={20} />
            <h2 className="font-extrabold text-[var(--foreground)]">Status</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800">Docs</span>
              <span className="border-2 border-[var(--border)] bg-[var(--chart-2)] px-2 py-0.5 font-extrabold text-[var(--foreground)]">online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800">Blog API</span>
              <span className="border-2 border-[var(--border)] bg-[var(--main)] px-2 py-0.5 font-extrabold text-[var(--foreground)]">live</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800">Projects</span>
              <span className="border-2 border-[var(--border)] bg-[var(--chart-3)] px-2 py-0.5 font-extrabold text-[var(--foreground)]">updating</span>
            </div>
          </div>
        </div>

        <div className="neo-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <Network className="text-[var(--chart-5)]" size={20} />
            <h2 className="font-extrabold text-[var(--foreground)]">Quick Links</h2>
          </div>
          <div className="space-y-2">
            <a href="#projects" className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)] underline decoration-[var(--main)] decoration-4 underline-offset-4">
              <Layers3 size={15} />
              Project registry
            </a>
            <a href="#live-preview" className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)] underline decoration-[var(--main)] decoration-4 underline-offset-4">
              <MonitorPlay size={15} />
              Preview slots
            </a>
            <a href="#blogs" className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)] underline decoration-[var(--main)] decoration-4 underline-offset-4">
              <Code2 size={15} />
              Hashnode feed
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
