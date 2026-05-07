import { MonitorPlay } from "lucide-react";
import Script from "next/script";
import { SectionShell } from "../SectionShell";

export function LivePreviewSection({ previews, tweets }) {
  return (
    <SectionShell
      id="live-preview"
      endpoint="/previews"
      title="Live Preview"
      description="A dedicated section for demos, embeds, screenshots, and technical updates from active projects."
    >
      <div className="space-y-5">
        <div className="space-y-5">
          {tweets.map((tweet) => (
            <article
              key={tweet.url}
              className="neo-card w-full overflow-hidden bg-[var(--secondary-background)]"
            >
              <div className="flex flex-col gap-2 border-b-2 border-[var(--border)] bg-[var(--main)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <h3 className="font-extrabold text-[var(--foreground)]">{tweet.title}</h3>
                <a
                  href={tweet.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-extrabold text-[var(--foreground)] underline decoration-[var(--foreground)] decoration-4 underline-offset-4"
                >
                  Open post
                </a>
              </div>
              <div className="x-embed-shell min-h-[18rem] overflow-x-auto bg-white p-3 sm:min-h-[24rem] sm:p-5">
                <blockquote className="twitter-tweet mx-auto" data-dnt="true" data-width="550">
                  <a href={tweet.url}>View this post on X</a>
                </blockquote>
              </div>
            </article>
          ))}
          <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
        </div>

        <div className="space-y-4">
          {previews.map((preview) => (
            <article key={preview.title} className="neo-card w-full p-5">
              <MonitorPlay className="mb-4 text-[var(--chart-5)]" size={24} />
              <h3 className="font-extrabold text-[var(--foreground)]">{preview.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-800">{preview.body}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
