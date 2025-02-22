"use server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * To verify if user is authenticated:
 *
 * SERVER SIDE:
 * const session = await auth.api.getSession({ headers: await headers() })
 * if (!session) throw new Error("AUTH ERROR: Unauthorized.");
 *
 * CLIENT SIDE: (aka not here)
 * const { data: session, isPending, error } = authClient.useSession()
 * if (!session) do stuff;
 */

export async function revalidateCache(route: string, mode?: "layout" | "page") {
  revalidatePath(route, mode);
}

// Threat advice by profile
// https://api.fletch.ai/v1/advice/profile

// // Threat advice by IoC (expanded intel)
// // Single: https://api.fletch.ai/v1/iocs_lookup?indicators=CVE-2025-0108
// // Multiple: https://api.fletch.ai/v1/iocs_lookup?indicators=CVE-2025-0108,CVE-2025-0109,CVE... etc

// // THIS SHOULD BE A GET REQUEST - LOVABLE OR US SHOULD TRANSCRIBE THIS INTO A VERSION TAKEN BY WHATEVER SERVICE
// // WE END UP USING. THE CURRENT ENDPOINT FORMATTING IS FOR NEXT.JS SERVER ACTIONS. THE INSIDE CODE IS THE SAME THOUGH.
// // (ASSUMING OUR BACKEND USES TS/JS LOL)

// // FLETCH TEST UTILIZING OUR PROFILE DATA. REPLACE WITH DYNAMIC WHEN TAG-BASED ENDPOINT RELEASES.
// // MOST IMPORTANT PART IS -- RUN THIS ON A **PROTECTED** SERVER ENDPOINT, NOT CLIENT.
// // LATER DOWN THE LINE, WE CAN REPLACE THIS WITH A DYNAMIC TAG-BASED ENDPOINT PROTECTED BY USER AUTH.
// // (CHECK IF CALLING USER IS AUTHENTICATED, CHECK PERMISSIONS, SUBSCRIPTION STATUS ETC.)
// export async function testGetThreats() {
//   // First step would be verifying if the user has authorization to call this endpoint.
//   // If not authorized, return a 403 error. (Next.js I'd do return {success: false, message: "..."})
//   // But I assume Lovable doesn't use Next.js, so likely you just do a regular JSON.stringified response with status code 403.
//   // This one can be protected with a randomly generated env variable for development passed to the request headers.
//   // Then we can just check if the header (say, x-forecast-dev-key) is equal to process.env.FORECAST_DEV_KEY)
//   // Once Fletch implements the actual tag-based endpoint, we can replace the x-forecast-dev-key header with typical
//   // auth checks (session, perms, subscription status etc.).

//   // After auth check, you would run ratelimiting (NEVER trust your users, period.)
//   // Preferably a redis-based ratelimit solution, like upstash. Supabase should have this.

//   // After ratelimiting, you would validate your inputs. In this case though this wouldn't be necessary,
//   // since the user calling doesn't actually pass anything other than their (verified) identity.
//   // We'd then query the database for the matching customer's tags, and pass them to the Fletch API (when they add that endpoint).
//   // (yes, we do have to store the customer's tags in a database)

//   const BASE_URL = "https://api.fletch.ai";
//   const ENDPOINT_PROFILE = "/v1/advice/profile"; // DOCS: https://api.fletch.ai/specs/#/default/get_v1_advice_profile
//   const API_KEY = process.env.FLETCH_API_KEY;

//   try {
//     const bundledData: FAPR_ResultTypes[] = [];
//     let fetchURL = BASE_URL + ENDPOINT_PROFILE;

//     while (true) {
//       const res = await fetch(fetchURL, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${API_KEY}`,
//         } as HeadersInit,
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP ERROR: ${res.status}`);
//       }

//       const data = await res.json();
//       if (!data?.results?.length) break;
//       bundledData.push(...data.results);

//       // Fletch hasn't implemented pagination yet, so next_page_url is always null. This future-proofs when it does release.
//       // When next_page_url is null, we exit the loop. If it's not null, we update the URL for next iteration.
//       if (!data?.next_page_url) break;
//       fetchURL = data.next_page_url;
//     }

//     const cveList = bundledData.reduce<string[]>((acc, { threat_name }) => {
//       if (threat_name.startsWith("CVE-")) {
//         acc.push(threat_name);
//       }
//       return acc;
//     }, []);

//     console.log(cveList);

//     // Now since the data returned by that endpoint is incomplete, we need to query the IoC endpoint for each threat_name that's a CVE.
//     // So first we have to extract all valid CVEs from the data.
//     // Then we have to query the IoC endpoint with all CVEs in params
//     // Once we receive THAT data, we merge it with bundledData by CVE === threat_name
//     // Once merged, we return the final data.
//     // Alternatively, we get a better endpoint DX.
//     // Again Next.js format, in a regular API endpoint just do the usual JSON response with status code.
//     return { success: true, data: bundledData, message: "SUCCESS: Threats fetched." };
//   } catch (err: unknown) {
//     // Again Next.js format, in a regular API endpoint just do the usual JSON response with status code.
//     return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
//   }
// }

// interface FletchAdviceProfileResponseTypes {
//   next_page_url: string | null; // CURRENTLY UNUSED, ALWAYS NULL. FOR PAGINATION IN THE FUTURE.
//   results: FAPR_ResultTypes[];
// }
// type FAPR_ResultTypes = {
//   correlations: CorrelationsTypes[];
//   emerged_at: string; // Date ISO 8601
//   maturity: string;
//   reemerged: boolean;
//   severity: "low" | "medium" | "high" | "critical" | string; // Enum suggestion, include string just in case.
//   sources: string[] | null; // They return null when empty - preferably they would just give an empty array.;
//   summary: string;
//   tactical_advice: string[] | null; // They return null when empty - preferably they would just give an empty array.
//   threat_id: string;
//   threat_name: string;
//   title: string;
// };
// type CorrelationsTypes = {
//   cause: string;
//   count: number; // Int
//   list: string[]; // CVEs
//   priority: number; // Int
// };
