# NextGen

NextGen is a Next.js template by @MGSimard partly based on [T3 Stack](https://github.com/t3-oss/create-t3-app) recommendations.

Its main purpose is for quickstarting my own personal projects with a bleeding edge stack. It does not include payment-related utilites, testing libraries, UI libraries or Tailwind CSS — which may or may not change in the future according to my own necessities. Updates will probably be done sparingly as I clone the repo prior to new projects, you can do the same.

---

<table>
<thead>
<tr><th><h2>Tech Stack</h2></th></tr>
</thead>

<tr><td>

| Tech        | Version | Info                  | Documentation                                                                    |
| ----------- | ------- | --------------------- | -------------------------------------------------------------------------------- |
| Next.js     | 15.1.6  | FullStack Environment | [nextjs.org](https://nextjs.org/docs)                                            |
| React       | 19.0.0  | Compiler Enabled      | [react.dev](https://react.dev/)                                                  |
| TypeScript  | 5.7.3   | Type Safety           | [typescriptlang.org](https://www.typescriptlang.org/docs/)                       |
| Neon        | 0.10.4  | Database              | [neon.tech](https://neon.tech/docs/introduction)                                 |
| PostgreSQL  | 3.4.5   | Database Management   | [postgresql.org](https://www.postgresql.org/docs/)                               |
| Drizzle     | 0.39.2  | ORM                   | [orm.drizzle.team](https://orm.drizzle.team/docs/overview)                       |
| Drizzle Kit | 0.30.4  | Database Migration    | [orm.drizzle.team](https://orm.drizzle.team/docs/kit-overview)                   |
| Better Auth | 1.1.16  | Authentication        | [better-auth.com](https://www.better-auth.com/docs/introduction)                 |
| Zod         | 3.24.1  | Validation            | [zod.dev](https://zod.dev/)                                                      |
| ESLint      | 9.19.0  | Flat Config           | [eslint.org](https://eslint.org/docs/latest/)                                    |
| t3-oss/env  | 0.12.0  | .env Type Safety      | [create.t3.gg](https://create.t3.gg/en/usage/env-variables)                      |
| pnpm        | 9.15.4  | Package Manager       | [pnpm.io](https://pnpm.io/motivation)                                            |
| Vercel      | -       | Hosting               | [vercel.com](https://vercel.com/docs)                                            |
| next-themes | 0.4.4   | Themes                | [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) |
| Sonner      | 1.7.4   | UI Notifications      | [sonner.emilkowal.ski](https://sonner.emilkowal.ski/getting-started)             |

</td></tr> </table>

## Additional Information

<details><summary>Multi-project schema pattern from T3 has been disabled.</summary>
<ol>
<li>Now that Vercel has fully migrated the Vercel Postgres option to Neon, free tier users can have more than one Postgres database.</li>
<li>Newer versions of Drizzle Kit have been bugged with multi-project schema setups for a while now. Though it fails to, <a href="https://github.com/drizzle-team/drizzle-orm/issues/3320#issuecomment-2461087002">migration actively attempts to drop your sequences.</a></li>
</ol>
</details>
<br/>

## Setting Up

**1. Set up the repository:**

- Create a new repository from this template _(https://github.com/MGSimard/nextgen-template)_ by clicking **"Use this template"** on the top right.
- Clone your new repository locally: `git clone https://github.com/YOURNAME/YOURREPO`.
- Navigate to your project directory: `cd YOURREPO`.
- Install necessary packages: `pnpm install`.
- Rename the **.env.example** file to **.env**.
- You can preview the app by running `pnpm run dev`, then navigating to http://localhost:3000 - core functionalities will not function until you complete the rest of the steps.

**2. Deploy the application to Vercel _(https://vercel.com)_:**

- Navigate to **Team Page -> Overview -> Add New -> Project**.
- Import your GitHub repository.
- DO NOT add environment variables, the process is less straightforward otherwise.
- Deploy, it will fail intentionally.

**3. Set up & link database:**

- In the **Storage** section of Vercel, create a **Neon** database <ins>within the same region as your deployment</ins>.
- If you created the database from outside the project, click **Connect Project**.
- Enter the database, copy the contents within **Quickstart -> .env.local**.
- Replace the _DATABASE_, _PG_ & _POSTGRES_ placeholders in your **.env** file by pasting the copied variables.

**4. Finish setting up environment variables:**

- Generate BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET values (see links in **.env**).
- Add the generated variables to your `.env` and to Vercel `(App -> Settings -> Environment Variables)`.
- Also add BETTER_AUTH_URL to Vercel, but instead of localhost:3000 make it your full app URL (ex: https://example.vercel.app).

**5.** Uncomment the Better Auth & Google environment variables in both spots within src/env.js.

**6.** Test Database connection: `pnpm db:studio` -> Navigate to https://local.drizzle.studio.

**7.** Apply schema to database: `pnpm db:push` -> Refresh https://local.drizzle.studio to view changes.

**8.** Commit & Redeploy the application to refresh newly added environment variables.

**9.** If you wish add more authentication options or plugins view the "Authentication" and "Plugins" sections respectively: https://www.better-auth.com/docs.

---

## Contact

MGSimard  
X: [@MGSimard](https://x.com/MGSimard)  
GitHub: [@MGSimard](https://github.com/MGSimard)  
Mail: [mgsimard.dev@gmail.com](mailto:mgsimard.dev@gmail.com)

For more info, view my portfolio at [mgsimard.dev](https://mgsimard.dev).

## Issues with Better Auth

- No server-side Sign In/Sign Out methods - Why? Can't use authClient in server to also match with revalidatePath() on logout, this makes things messy.
- No callbackURL for Sign Out method - Why? We need the hard refresh in situations where you want to prevent backrouting to a dashboard etc.
- Full-on API fetches on every useSession call - Why? Why not just check for cookies and only fetch when not valid? This creates bad performance.

## Solutions to Better Auth

- PREVENTING BACKROUTING TO MIDDLEWARE-PROTECTED ROUTES:
  - Create a server action `export async function revalidateCache(route:string , mode?: "layout" | "page"){ revalidatePath(route, mode ?? undefined) }`
  - For signIn button/method, import the server action and within signIn's onSuccess run `await revalidateCache("/sign-in")`
  - For signOut button/method, import the server action and within signOut's onSuccess run `await revalidateCache("/dashboard", "layout")`
  - This should force cache clearing of those routes which prevents backrouting after logging in/out
  - You should still keep middleware auth protect (already set in this template) for direct access authchecks

## TASK LIST

- [ ] User settings page
- [ ] Account/User deletion
- [ ] Figure out visual loading state to middleware protected routes (might devolve into layout/route auth instead of middleware tbh)
- [ ] App-wide cleanup
