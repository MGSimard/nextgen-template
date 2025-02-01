import { Header } from "@/components/Header";
import { Section } from "@/components/Section";

export default function PageHome() {
  return (
    <>
      <Header>
        <h1>NextGen Template</h1>
      </Header>
      <main>
        <Section>
          <h2>About</h2>
          <p>
            NextGen is a Next.js template by @MGSimard partly based on{" "}
            <a className="link" href="https://github.com/t3-oss/create-t3-app" target="_blank">
              T3 Stack
            </a>{" "}
            recommendations. Its main purpose is for quickstarting my own personal projects with a bleeding edge stack.
            It does not include payment-related utilites, testing libraries, UI libraries or Tailwind CSS — which may or
            may not change in the future according to my own necessities. Updates will probably be done sparingly as I
            clone the repo prior to new projects, you can do the same.
          </p>
        </Section>
        <Section>
          <h2>Tech Stack</h2>
          <div className="table-wrapper">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Tech</th>
                  <th>Version</th>
                  <th>Info</th>
                  <th>Documentation</th>
                </tr>
              </thead>
              <tbody>
                {techStack.map((tech) => (
                  <tr key={tech[0]}>
                    <td>{tech[0]}</td>
                    <td>{tech[1]}</td>
                    <td>{tech[2]}</td>
                    <td>
                      <a className="link" href={tech[3]} target="_blank">
                        {tech[4]}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        <Section>
          <h2>Additional Information</h2>
          <details>
            <summary>Multi-project schema pattern from T3 has been disabled.</summary>
            <ol>
              <li>
                Now that Vercel has fully migrated the Vercel Postgres option to Neon, free tier users can have more
                than one Postgres database.
              </li>
              <li>
                Newer versions of Drizzle Kit have been bugged with multi-project schema setups for a while now. Though
                it fails to,{" "}
                <a
                  className="link"
                  href="https://github.com/drizzle-team/drizzle-orm/issues/3320#issuecomment-2461087002">
                  migration actively attempts to drop your sequences.
                </a>
              </li>
            </ol>
          </details>
        </Section>
        <Section>
          <h2>Setting Up</h2>
          <p>
            <a
              className="link"
              href="https://github.com/MGSimard/nextgen-template?tab=readme-ov-file#setting-up"
              target="_blank">
              View &quot;Setting Up&quot; section on GitHub
            </a>
          </p>
        </Section>
        <Section>
          <h2>Contact</h2>
          <ul>
            <li>MGSimard</li>
            <li>
              X:{" "}
              <a className="link" href="https://x.com/MGSimard" target="_blank">
                @MGSimard
              </a>
            </li>
            <li>
              Mail:{" "}
              <a className="link" href="mailto:mgsimard.dev@gmail.com">
                mgsimard.dev@gmail.com
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a className="link" href="https://github.com/MGSimard">
                @MGSimard
              </a>
            </li>
          </ul>
          <p>
            For more info, view my portfolio at{" "}
            <a className="link" href="https://mgsimard.dev" target="_blank">
              mgsimard.dev
            </a>
            .
          </p>
        </Section>
      </main>
    </>
  );
}

const techStack = [
  ["Next.js", "15.1.6", "FullStack Environment", "https://nextjs.org/docs", "nextjs.org"],
  ["React", "19.0.0", "Compiler Enabled", "https://react.dev", "react.dev"],
  ["TypeScript", "5.7.3", "Type Safety", "https://www.typescriptlang.org/docs", "typescriptlang.org"],
  ["Neon", "0.10.4", "Database", "https://neon.tech/docs/introduction", "neon.tech"],
  ["PostgreSQL", "3.4.5", "Database Management", "https://www.postgresql.org/docs", "postgresql.org"],
  ["Drizzle", "0.38.4", "ORM", "https://orm.drizzle.team/docs/overview", "orm.drizzle.team"],
  ["Drizzle Kit", "0.30.2", "Database Migration", "https://orm.drizzle.team/docs/kit-overview", "orm.drizzle.team"],
  ["Better Auth", "1.1.14", "Authentication", "https://www.better-auth.com/docs/introduction", "better-auth.com"],
  ["Zod", "3.24.1", "Validation", "https://zod.dev", "zod.dev"],
  ["ESLint", "9.18.0", "Flat Config", "https://eslint.org/docs/latest", "eslint.org"],
  ["t3-oss/env", "0.10.1", ".env Type Safety", "https://create.t3.gg/en/usage/env-variables", "create.t3.gg"],
  ["pnpm", "9.15.4", "Package Manager", "https://pnpm.io/motivation", "pnpm.io"],
  ["Vercel", "-", "Hosting", "https://vercel.com/docs", "vercel.com"],
];
