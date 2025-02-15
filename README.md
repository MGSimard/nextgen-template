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
| Next.js     | 15.1.7  | FullStack Environment | [nextjs.org](https://nextjs.org/docs)                                            |
| React       | 19.0.0  | Compiler Enabled      | [react.dev](https://react.dev/)                                                  |
| TypeScript  | 5.7.3   | Type Safety           | [typescriptlang.org](https://www.typescriptlang.org/docs/)                       |
| Neon        | 0.10.4  | Database              | [neon.tech](https://neon.tech/docs/introduction)                                 |
| PostgreSQL  | 3.4.5   | Database Management   | [postgresql.org](https://www.postgresql.org/docs/)                               |
| Drizzle     | 0.39.3  | ORM                   | [orm.drizzle.team](https://orm.drizzle.team/docs/overview)                       |
| Drizzle Kit | 0.30.4  | Database Migration    | [orm.drizzle.team](https://orm.drizzle.team/docs/kit-overview)                   |
| Better Auth | 1.1.18  | Authentication        | [better-auth.com](https://www.better-auth.com/docs/introduction)                 |
| Zod         | 3.24.2  | Validation            | [zod.dev](https://zod.dev/)                                                      |
| ESLint      | 9.20.1  | Flat Config           | [eslint.org](https://eslint.org/docs/latest/)                                    |
| t3-oss/env  | 0.12.0  | .env Type Safety      | [create.t3.gg](https://create.t3.gg/en/usage/env-variables)                      |
| pnpm        | 9.15.4  | Package Manager       | [pnpm.io](https://pnpm.io/motivation)                                            |
| Vercel      | -       | Hosting               | [vercel.com](https://vercel.com/docs)                                            |
| next-themes | 0.4.4   | Theme Toggling        | [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) |
| Sonner      | 1.7.4   | UI Notifications      | [sonner.emilkowal.ski](https://sonner.emilkowal.ski/getting-started)             |

</td></tr> </table>

## Additional Information

<details><summary>Considerations.</summary>

- Zustand
- tRPC
- Hono
- Bun
- TanStack Query (Client-side)
- Superjson

</details>

<details><summary>Database choices.</summary>

Neon should only be used for its free tier offering _(it's slower, and has horrible cold-start performance)_. Anything serious should be running on better, for-purpose DB solutions (separate your general storage, rate limiting, etc). If you're looking to get serious performance for live production applications I would recommend the following options instead:

General

- Supabase (PostgreSQL)
- PlanetScale (MySQL)

High-Throughput (Rate limiting, Session Management, Caching, etc)

- Upstash (Redis)

Edge & Local First

- Turso (SQLite/libSQL)

</details>

<details><summary>Multi-project schema pattern from T3 has been disabled.</summary>
<ol>
<li>Now that Vercel has fully migrated the Vercel Postgres option to Neon, free tier users can have more than one Postgres database.</li>
<li>Newer versions of Drizzle Kit have been bugged with multi-project schema setups for a while now. Though it fails to, <a href="https://github.com/drizzle-team/drizzle-orm/issues/3320#issuecomment-2461087002">migration actively attempts to drop your sequences.</a></li>
</ol>
</details>

<details><summary>Better Auth issue: Disabling user registration.</summary>

_Note: There is currently a [PR open](https://github.com/better-auth/better-auth/pull/1428) to introduce a signupsDisabled flag. You would still be able to create users as an admin using authClient.admin -- and role granularity for admin actions could be achieved with [this additional PR](https://github.com/better-auth/better-auth/pull/1424)._

If you decide to use Email & Password you should know that your sign-up endpoint becomes publicly accessible by default, meaning anyone can create an account regardless of whether or not you give them an accessible, programmatic way to do so from within the application.

- While emailAndPassword is enabled in your auth config, the `/api/sign-up/email` endpoint becomes accessible by default.
- This means even if you offer no way for users to sign up in say, a private application, they can still create an account by hitting up your sign-up endpoint with a POST request to http://example.com/api/auth/sign-up/email with email/password/name in the request body.

In order to prevent this, should you choose to lock down registration, Better Auth does not currently have a betterAuth() flag to do this easily. Instead you have to intercept the API request with an auth middleware and reject their request. You can add the code below to your betterAuth config alongside database: {}, session: {}, etc:

```
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        return NextResponse.json({ error: "ERROR: Registration disabled." }, { status: 401 });
      }
    }),
  },
```

Extra:

- Currently, when emailAndPassword aren't enabled, the /sign-up/email endpoint is still created. Though it does respond with an error stating that registration is disabled, I don't feel like it makes sense to include the endpoint to begin with if the feature itself is disabled entirely. A little bloat here and there stacks up to a lot of bloat down the line.

</details>

<details>
<summary>Better Auth/Next.js issue: Clearing cache for protected routes after Sign In/Out.</summary>

Usually this is fairly simple when running these methods purely on-server with libraries like Lucia which have better server-sided method documentation. However, Better Auth docs only recommends Sign In/Out methods using the client-side authClient function.

This is partly a Better Auth issue, and partly a Next.js issue. I'm of the opinion that Sign In/Out should be restricted to server function uses _(which I assume they've abstracted away through authClient)_, where there's less concern over fragmentation of the process and having direct shared access with server-side cache invalidation. Though if Next.js had better client-side cache invalidation methods like a revalidatePath("/path") equivalent, Better Auth's design choice would be slightly less of an issue. Think something along the lines of router.clearCache("/path"), instead of being forced to use a blank router.refresh().

When using authClient.signIn/Out(), you have two clear methods of handling clearing cache, in order to prevent a user from backrouting into a cached version of an auth-protected page, leaking potentially secret information. _(Or just preventing them from returning to a cached sign-in page after logging in.)_

### 1. router.push() + separate revalidatePath() from a server action.

With this method, backrouting will flash the old URL in the bar prior to your middleware/route redirection logic, but you won't actually return to a cached page. You also retain control of redirect target, independent of the middleware or route redirection logic.

```
<button
  type="button"
  aria-label="Sign Out"
  title="Sign out"
  onClick={async () =>
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
        toast.success("Signed out successfully.");
        await revalidateCache("/dashboard", "layout");
        router.push("/");
      },
    },
  })
}>

// server/actions.ts
export async function revalidateCache(route: string, mode?: "layout" | "page") {
  revalidatePath(route, mode ?? undefined);
}
```

### 2. router.refresh(), less code but lose agency over granular redirect.

This version will not have a URL flash on backrouting attempts, but you lose control of the redirect path - therefore limited to what you had set within middleware or route redirection logic.

```
<button
  type="button"
  aria-label="Sign Out"
  title="Sign out"
  onClick={async () =>
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
        toast.success("Signed out successfully.");
        await revalidateCache("/dashboard", "layout");
        router.push("/");
      },
    },
  })
}>

// server/actions.ts
export async function revalidateCache(route: string, mode?: "layout" | "page") {
  revalidatePath(route, mode ?? undefined);
}
```

### 3. Avoid authClient usage entirely

Your third option is to avoid authClient. You can instead opt to set & delete cookies manually from within a server action, which invalidates the cache to avoid stale cookies. As stated the Better Auth docs regarding this specific process are incomplete, so I personally haven't checked on how to ensure everything stays synced.

</details>

<details>
<summary>Better Auth issue: No callbackURL for Sign Out method.</summary>

You could argue this is more of a nitpick, but the entire cache clearing setup could really just be run through a built-in callbackURL or redirectURL method on signOut. I can't really think of a situation where you wouldn't want to clear cache of a protected route to prevent backrouting, quite frankly it's something the developer shouldn't even have to think about with an auth library.

</details>

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

**7.** Generate new schema: `npx @better-auth/cli generate --config /src/server/auth`.

**8.** Copy newly generated auth-schema.ts contents, overwrite server/db/schema.ts contents with it, delete auth-schema.ts.

**8.** Apply schema to database: `pnpm db:push` -> Refresh https://local.drizzle.studio to view changes.

**9.** Commit & Redeploy the application to refresh newly added environment variables.

**10.** If you wish add more authentication options or plugins view the "Authentication" and "Plugins" sections respectively: https://www.better-auth.com/docs.

---

## Contact

MGSimard  
X: [@MGSimard](https://x.com/MGSimard)  
GitHub: [@MGSimard](https://github.com/MGSimard)  
Mail: [mgsimard.dev@gmail.com](mailto:mgsimard.dev@gmail.com)

For more info, view my portfolio at [mgsimard.dev](https://mgsimard.dev).

## TASK LIST

- [ ] Deal with signout redirection not working if signing out when on a 404-type page
- [ ] User settings page
- [ ] Account/User deletion
- [ ] Figure out visual loading state to middleware protected routes (might devolve into layout/route auth instead of middleware tbh)
- [ ] App-wide cleanup
