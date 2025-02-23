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
