import { IconChevron } from "@/components/Icons";

export default function PageHome() {
  return (
    <>
      <header className="hero noselect">
        <h1 data-text="NextGen">
          <span id="hero1">Next</span>
          <span id="hero2" className="clr-primary">
            Gen
          </span>
          <span id="hero3" className="blink">
            .
          </span>
        </h1>
        <a href="#about" className="chevron-anchor" aria-label="Scroll down">
          <IconChevron />
        </a>
      </header>
      <main>
        <section id="about">
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
        </section>
        <section>
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
        </section>
        <section>
          <h2>Setting Up</h2>
          <p>
            <a
              className="link"
              href="https://github.com/MGSimard/nextgen-template?tab=readme-ov-file#setting-up"
              target="_blank">
              View &quot;Setting Up&quot; section on GitHub
            </a>
          </p>
        </section>
        <section>
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
        </section>
      </main>
    </>
  );
}

const techStack = [
  ["Next.js", "15.3.1-canary.6", "FullStack Environment", "https://nextjs.org/docs", "nextjs.org"],
  ["React", "19.1.0", "Compiler Enabled", "https://react.dev", "react.dev"],
  ["TypeScript", "5.8.3", "Type Safety", "https://www.typescriptlang.org/docs", "typescriptlang.org"],
  ["Neon", "1.0.0", "Database", "https://neon.tech/docs/introduction", "neon.tech"],
  ["PostgreSQL", "3.4.5", "Database Management", "https://www.postgresql.org/docs", "postgresql.org"],
  ["Drizzle", "0.42.0", "ORM", "https://orm.drizzle.team/docs/overview", "orm.drizzle.team"],
  ["Drizzle Kit", "0.31.0", "Database Migration", "https://orm.drizzle.team/docs/kit-overview", "orm.drizzle.team"],
  ["Better Auth", "1.2.7", "Authentication", "https://www.better-auth.com/docs/introduction", "better-auth.com"],
  ["Zod", "3.24.2", "Validation", "https://zod.dev", "zod.dev"],
  ["ESLint", "9.24.0", "Flat Config", "https://eslint.org/docs/latest", "eslint.org"],
  ["t3-oss/env", "0.12.0", ".env Type Safety", "https://create.t3.gg/en/usage/env-variables", "create.t3.gg"],
  ["Node", "23.8.0", "Runtime Environment", "https://nodejs.org", "nodejs.org"],
  ["pnpm", "10.6.4", "Package Manager", "https://pnpm.io/motivation", "pnpm.io"],
  ["Vercel", "-", "Hosting", "https://vercel.com/docs", "vercel.com"],
  [
    "next-themes",
    "0.4.6",
    "Theme Toggling",
    "https://github.com/pacocoursey/next-themes",
    "github.com/pacocoursey/next-themes",
  ],
  ["Sonner", "2.0.3", "UI Notifications", "https://sonner.emilkowal.ski/getting-started", "sonner.emilkowal.ski"],
  ["React Scan", "0.3.3", "Performance Debugging", "https://react-scan.com", "react-scan.com"],
];
