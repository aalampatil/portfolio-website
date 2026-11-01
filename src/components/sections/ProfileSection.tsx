import { SectionShell } from "@/components/SectionShell";
import { profile } from "@/data/portfolio";

export function ProfileSection() {
  return (
    <SectionShell id="profile" title="A little about me" description="The person behind the projects.">
      <div className="about-grid">
        <div className="about-copy"><p className="about-lead">I’m {profile.name}. I like understanding what happens after you click.</p><p>That curiosity takes me into API design, login flows, session handling, and databases. I learn by building complete applications, tracing how the pieces connect, and working through the details myself.</p><p>I use React and Next.js to give those systems an interface, and write on Hashnode to turn what I learn into notes I can return to and share.</p></div>
        <dl className="about-facts"><div><dt>BASED IN</dt><dd>{profile.location}</dd></div><div><dt>CURRENT FOCUS</dt><dd>APIs, authentication & system design fundamentals</dd></div><div><dt>RIGHT NOW</dt><dd>{profile.status}</dd></div></dl>
      </div>
    </SectionShell>
  );
}
