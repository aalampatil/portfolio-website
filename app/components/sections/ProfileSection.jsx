import { SectionShell } from "../SectionShell";
import { profile } from "../../data/portfolio";

export function ProfileSection() {
  return (
    <SectionShell id="profile" title="A little about me" description="The person behind the projects.">
      <div className="about-grid">
        <div className="about-copy"><p className="about-lead">I’m {profile.name}, a backend-focused developer based in {profile.location}.</p><p>I’m learning by building: exploring how authentication works, how APIs fit together, and how to turn an idea into a deployed application.</p><p>I write technical notes to document what I figure out along the way. This portfolio brings those projects and lessons into one place.</p></div>
        <dl className="about-facts"><div><dt>BASED IN</dt><dd>{profile.location}</dd></div><div><dt>CURRENT FOCUS</dt><dd>APIs, authentication & system design fundamentals</dd></div><div><dt>RIGHT NOW</dt><dd>{profile.status}</dd></div></dl>
      </div>
    </SectionShell>
  );
}
