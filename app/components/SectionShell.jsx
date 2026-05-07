import { MethodBadge } from "./MethodBadge";

export function SectionShell({ id, method = "GET", endpoint, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t-2 border-[var(--border)] py-12">
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={method} />
          <code className="border-2 border-[var(--border)] bg-[var(--secondary-background)] px-3 py-1 text-sm font-bold text-[var(--foreground)] shadow-[2px_2px_0_0_var(--border)]">
            {endpoint}
          </code>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--foreground)] md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-800 md:text-base">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
