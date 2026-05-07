import { CheckCircle2 } from "lucide-react";
import { SectionShell } from "../SectionShell";

export function StackSection({ stack }) {
  return (
    <SectionShell
      id="stack"
      endpoint="/stack"
      title="Tech Stack"
      description="A quick dependency list for the type of work this portfolio is optimized to communicate."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((item) => (
          <div key={item} className="neo-card flex items-center gap-3 p-4">
            <CheckCircle2 className="text-[var(--chart-5)]" size={18} />
            <span className="font-bold text-[var(--foreground)]">{item}</span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
