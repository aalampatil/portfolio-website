export function MethodBadge({ method }) {
  const colors = {
    GET: "bg-[var(--chart-2)]",
    POST: "bg-[var(--chart-5)]",
    PATCH: "bg-[var(--chart-3)]",
  };

  return (
    <span className={`border-2 border-[var(--border)] px-2 py-1 font-mono text-xs font-bold text-[var(--foreground)] ${colors[method] || colors.GET}`}>
      {method}
    </span>
  );
}
