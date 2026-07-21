import type { Metadata } from "next";
import { dictionaries } from "@/i18n/dictionaries";
import { educationMeta, experience, metrics, profile, techCategories } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Alexey Shuganov | Resume",
  description:
    "Printable English resume for Alexey Shuganov, Senior AI-Driven Fullstack Developer.",
};

const dict = dictionaries.en;

const topProjects = [
  {
    title: "FastTable Dashboard v2",
    impact: "−60% time-to-market",
    summary:
      "Led a Svelte to React 19 modernization for a realtime restaurant operations dashboard.",
  },
  {
    title: "Axioma Workbench",
    impact: "+40% query performance",
    summary:
      "Built enterprise work-order and asset flows on a TypeScript and PostgreSQL stack.",
  },
  {
    title: "FORMA Furniture Shop",
    impact: "99/100 Core Web Vitals",
    summary:
      "Shipped an e-commerce storefront with a live sofa configurator and SEO-first UX.",
  },
] as const;

function skillsForResume() {
  return techCategories.flatMap((category) => category.skills);
}

export default function ResumePage() {
  const skills = skillsForResume();

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-white px-6 py-10 text-slate-900 print:max-w-none print:px-0 print:py-0">
      <div className="mx-auto max-w-4xl print:max-w-none">
        <header className="border-b border-slate-300 pb-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-700">
                Resume
              </p>
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950">
                  {profile.name}
                </h1>
                <p className="mt-2 text-lg text-slate-700">{dict.hero.role}</p>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                5+ years building fullstack products across enterprise ops, EdTech,
                e-commerce, and Web3. I ship polished React interfaces, typed APIs,
                and AI-assisted workflows with measurable product impact.
              </p>
            </div>

            <div className="space-y-2 text-sm leading-6 text-slate-700 md:text-right">
              <p>{profile.location}</p>
              <p>
                <a href={profile.socials.email} className="underline decoration-slate-300 underline-offset-2">
                  {profile.email}
                </a>
              </p>
              <p>
                <a
                  href={profile.socials.telegram}
                  className="underline decoration-slate-300 underline-offset-2"
                >
                  {profile.telegram}
                </a>
              </p>
              <p>
                <a
                  href={profile.socials.github}
                  className="underline decoration-slate-300 underline-offset-2"
                >
                  github.com/thunder-splash
                </a>
              </p>
              <p>Portfolio: portfolio-website-coral-beta-70.vercel.app</p>
              <p>{dict.hero.availability}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 border-b border-slate-200 py-6 md:grid-cols-[1.4fr_0.9fr]">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Summary
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Senior fullstack developer focused on shipping fast, reliable products
              from UI to API. Strong with React, TypeScript, Next.js, Hono, Node.js,
              PostgreSQL, and product-minded frontend architecture. Daily user of AI
              tooling for faster delivery without losing code quality.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Highlights
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {metrics.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-lg font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {dict.metrics.items[item.id].label}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {dict.metrics.items[item.id].hint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-b border-slate-200 py-6 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Experience
            </h2>
            <div className="mt-4 space-y-5">
              {experience.map((job) => {
                const copy = dict.work.jobs[job.id];
                return (
                  <article key={job.id} className="break-inside-avoid">
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                      <h3 className="text-base font-semibold text-slate-950">
                        {copy.role} · {job.company}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                        {copy.period}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{copy.blurb}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {job.projects.slice(0, 2).map((project) => {
                        const projectCopy = copy.projects[project.id];
                        return (
                          <li key={project.id}>
                            <span className="font-medium text-slate-900">
                              {projectCopy.title}
                            </span>
                            {" - "}
                            {projectCopy.summary}
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-2 text-xs text-slate-500">
                      Stack: {job.stack.join(" · ")}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Core Stack
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {skills.join(" · ")}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Selected Wins
              </h2>
              <div className="mt-3 space-y-3">
                {topProjects.map((project) => (
                  <div key={project.title} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-950">
                        {project.title}
                      </h3>
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-cyan-700">
                        {project.impact}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {project.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Education
              </h2>
              <p className="mt-3 text-sm text-slate-900">{educationMeta.school}</p>
              <p className="mt-1 text-sm text-slate-700">{dict.education.degree}</p>
              <p className="mt-1 text-sm text-slate-600">{dict.education.graduation}</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Languages
              </h2>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                {dict.education.langs.map((lang) => (
                  <li key={lang.name}>
                    {lang.name} - {lang.level}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Quick Links
          </h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700 md:flex-row md:flex-wrap md:gap-4">
            <a href="https://portfolio-website-coral-beta-70.vercel.app/" className="underline decoration-slate-300 underline-offset-2">
              Portfolio
            </a>
            <a href={profile.socials.github} className="underline decoration-slate-300 underline-offset-2">
              GitHub
            </a>
            <a href={profile.socials.telegram} className="underline decoration-slate-300 underline-offset-2">
              Telegram
            </a>
            <a href={profile.socials.email} className="underline decoration-slate-300 underline-offset-2">
              Email
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
