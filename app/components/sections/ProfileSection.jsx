import { CodePanel } from "../CodePanel";
import { SectionShell } from "../SectionShell";

export function ProfileSection({ profileJson }) {
  return (
    <SectionShell
      id="profile"
      endpoint="/profile"
      title="Profile Resource"
      description="The compact identity endpoint: who I am, what I am currently focused on, and the kind of engineering work this portfolio should represent."
    >
      <CodePanel title="response.json">{profileJson}</CodePanel>
    </SectionShell>
  );
}
