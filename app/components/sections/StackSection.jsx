import { SectionShell } from "../SectionShell";

const groups = [
  { title: "Backend & APIs", description: "Server logic and identity", items: ["Node.js", "Express", "REST APIs", "JWT", "OAuth"] },
  { title: "Data", description: "Storage and data access", items: ["MongoDB+Mongoose", "PostgreSQL+Drizzle"] },
  { title: "Web & mobile", description: "Interfaces across screens", items: ["TypeScript", "React", "Next.js", "React-Native", "Expo Go", "Tailwind CSS"] },
  { title: "Workflow", description: "Version control", items: ["Git"] },
];

export function StackSection({ stack }) {
  return (
    <SectionShell id="stack" title="Tools I work with" description="My focus is on the backend, with web and mobile tools to bring projects together.">
      <div className="toolkit-grid">
        {groups.map((group, index) => (
          <div className="toolkit-group" key={group.title}>
            <span className="eyebrow">0{index + 1}</span><h3>{group.title}</h3><p>{group.description}</p>
            <ul>{group.items.filter(item => stack.includes(item)).map(item => <li key={item}>{item.replaceAll("+", " / ").replace("React-Native", "React Native")}</li>)}</ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
