import { ArrowRight, BookOpen, Rocket } from "lucide-react";

export function OverviewSection({ onFetchBlogs }) {
  return (
    <section id="overview" className="pb-12 pt-6">
      <div className="mb-6 inline-flex items-center gap-2 border-2 border-[var(--border)] bg-[var(--chart-2)] px-3 py-1 text-sm font-extrabold text-[var(--foreground)] shadow-[2px_2px_0_0_var(--border)]">
        <Rocket size={15} />
        Portfolio rebuilt as developer API documentation
      </div>
      <h1 className="max-w-4xl text-4xl font-black tracking-tight text-[var(--foreground)] md:text-6xl">
        A backend developer profile, documented like a production API.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-800">
        Explore profile data, project endpoints, live preview slots, published notes, and stack details through a docs-style interface.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#projects"
          className="neo-button inline-flex items-center gap-2 px-4 py-3 text-sm font-extrabold"
        >
          View projects
          <ArrowRight size={16} />
        </a>
        <button
          type="button"
          onClick={() => onFetchBlogs()}
          className="neo-button-secondary inline-flex items-center gap-2 px-4 py-3 text-sm font-extrabold"
        >
          Fetch blogs
          <BookOpen size={16} />
        </button>
      </div>
    </section>
  );
}
