# NextGen

NextGen is a Next.js template by @MGSimard partly based on [T3 Stack](https://github.com/t3-oss/create-t3-app) recommendations.

Its main purpose is for quickstarting my own personal projects with a bleeding edge stack. It does not include payment-related utilites, testing libraries, UI libraries or Tailwind CSS — which may or may not change in the future according to my own necessities. Updates will probably be done sparingly as I clone the repo prior to new projects, you can do the same.

---

<table>
<thead>
<tr><th><h2>Tech Stack</h2></th></tr>
</thead>

<tr><td>

| Tech        | Version         | Info                  | Documentation                                                                    |
| ----------- | --------------- | --------------------- | -------------------------------------------------------------------------------- |
| Next.js     | 15.3.1-canary.6 | FullStack Environment | [nextjs.org](https://nextjs.org/docs)                                            |
| React       | 19.1.0          | Compiler Enabled      | [react.dev](https://react.dev/)                                                  |
| TypeScript  | 5.8.3           | Type Safety           | [typescriptlang.org](https://www.typescriptlang.org/docs/)                       |
| Neon        | 1.0.0           | Database              | [neon.tech](https://neon.tech/docs/introduction)                                 |
| PostgreSQL  | 3.4.5           | Database Management   | [postgresql.org](https://www.postgresql.org/docs/)                               |
| Drizzle     | 0.42.0          | ORM                   | [orm.drizzle.team](https://orm.drizzle.team/docs/overview)                       |
| Drizzle Kit | 0.31.0          | Database Migration    | [orm.drizzle.team](https://orm.drizzle.team/docs/kit-overview)                   |
| Better Auth | 1.2.7           | Authentication        | [better-auth.com](https://www.better-auth.com/docs/introduction)                 |
| Zod         | 3.24.2          | Validation            | [zod.dev](https://zod.dev/)                                                      |
| ESLint      | 9.24.0          | Flat Config           | [eslint.org](https://eslint.org/docs/latest/)                                    |
| t3-oss/env  | 0.12.0          | .env Type Safety      | [create.t3.gg](https://create.t3.gg/en/usage/env-variables)                      |
| Node        | 23.8.0          | Runtime Environment   | [nodejs.org](https://nodejs.org)                                                 |
| pnpm        | 10.6.4          | Package Manager       | [pnpm.io](https://pnpm.io/motivation)                                            |
| Vercel      | -               | Hosting               | [vercel.com](https://vercel.com/docs)                                            |
| next-themes | 0.4.6           | Theme Toggling        | [github.com/pacocoursey/next-themes](https://github.com/pacocoursey/next-themes) |
| Sonner      | 2.0.3           | UI Notifications      | [sonner.emilkowal.ski](https://sonner.emilkowal.ski/getting-started)             |
| React Scan  | 0.3.3           | Performance Debugging | [react-scan.com](https://react-scan.com)                                         |

</td></tr> </table>

## Additional Information

<details><summary><b>Future Considerations</b></summary>

- Build a CLI tool + npm package
- Zustand
- tRPC
- Hono
- Bun
- TanStack Query (Client-side Fetching)
- Superjson

---

</details>

<details><summary><b>Database Recommendations</b></summary>

Neon is best suited for its free tier due to slow performance and poor cold-start times. For serious applications, consider using dedicated database solutions for better performance, storage, and rate limiting:

**General Use:**

- Supabase (PostgreSQL)
- PlanetScale (MySQL)

**High-Throughput _(Rate limiting, Session Management, Caching, etc)_:**

- Upstash (Redis)

**Edge & Local First:**

- Turso (SQLite & libSQL)
- Dexie.js (NoSQL/IndexedDB Wrapper)

---

</details>

<details><summary><b>Avoid the multi-project schema pattern</b></summary>

- Vercel's migration to Neon allows free tier users to have multiple Postgres databases.
- Recent Drizzle Kit versions have issues with multi-project schemas, including <a href="https://github.com/drizzle-team/drizzle-orm/issues/3320#issuecomment-2461087002">a bug where migrations may attempt to drop sequences</a>.

---

</details>

<details><summary><b>Better Auth: Disabling user registration</b></summary>

~~Note: There is currently a [PR open](https://github.com/better-auth/better-auth/pull/1428) to introduce a signupsDisabled flag. You would still be able to create users as an admin using authClient.admin -- and role granularity for admin actions could be achieved with [this additional PR](https://github.com/better-auth/better-auth/pull/1424).~~

**Update:** Our [PR](https://github.com/better-auth/better-auth/pull/1428) to add a `disableSignUp` flag has been merged. You can now cleanly disable sign ups for enabled social providers and the `emailAndPassword` options.

If you enable `enableAndPassword`, the `/api/sign-up/email` endpoint becomes publicly accessible. This allows anyone to create an account via a `POST` request even if your application doesn't offer an accessible, programmatic way to do so. The new `disableSignUp` allows you to disable sign ups for any enabled social provider and `emailAndPassword`.

**New Method (BetterAuth &gt;=1.2):**

```
// /server/auth/index.js
// NEW METHOD - disableSignUp flag (not necessary if provider isn't enabled)
emailAndPassword: {
  enabled: true,
  disableSignUp: true,
},
socialProviders: {
  google: {
    disableSignUp: true,
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
},
```

**Obsolete Method (BetterAuth &lt;1.2):**

Intercept the API request with an auth middleware and reject their request.

```
// /server/auth/index.js
// OLD METHOD - Obsolete for Better Auth >=1.2
//
hooks: {
  before: createAuthMiddleware(async (ctx) => {
    if (ctx.path.startsWith("/sign-up")) {
      return NextResponse.json({ error: "ERROR: Registration disabled." }, { status: 401 });
    }
  }),
},

```

**Extra:** Even when `emailAndPassword` is disabled, the `/sign-up/email` endpoint is still created. Though it responds with an error stating that registration is disabled, I don't feel it makes sense to include an endpoint if the feature is disabled entirely. Small amounts of bloat eventually adds up.

---

</details>

<details>
<summary><b>Better Auth/Next.js issue: Clearing cache for protected routes after Sign In/Out</b></summary>

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

// /server/actions.ts
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
        onSuccess: () => {
        toast.success("Signed out successfully.");
        router.refresh();
      },
    },
  })
}>
```

### 3. Avoid authClient usage entirely

Your third option is to avoid authClient. You can instead opt to set & delete cookies manually from within a server action, which invalidates the cache to avoid stale cookies. As stated the Better Auth docs regarding this specific process are incomplete, so I personally haven't checked on how to ensure everything stays synced.

</details>

<details>
<summary><b>Better Auth issue: No callbackURL for Sign Out method.</b></summary>

You could argue this is more of a nitpick, but the entire cache clearing setup could really just be run through a built-in callbackURL or redirectURL method on signOut. I can't really think of a situation where you wouldn't want to clear cache of a protected route to prevent backrouting.

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
- [ ] Figure out visual loading state to middleware protected routes (might devolve into layout/route auth instead of middleware tbh) - UPDATE: Look into useLinkStatus for this, new thing with next 15.3
- [ ] App-wide cleanup
