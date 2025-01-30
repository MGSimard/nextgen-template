import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        console.error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
      }
    },
  },
  plugins: [
    adminClient(), // Administration docs: https://www.better-auth.com/docs/plugins/admin
    organizationClient(), // Organization docs: https://www.better-auth.com/docs/plugins/organization
  ],
});
