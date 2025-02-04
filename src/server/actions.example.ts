/* eslint-disable */
// @ts-nocheck
/**
 * This example file demonstrates my server action conventions.
 * - MGSimard
 */
"use server";
import { db } from "./db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { z } from "zod";

// 1. Set up input & output types (if applicable). Preferably separate file, then imported.
// 2. If the action takes in input arguments, set up a Zod Schema for them for validation.
// 3. Create the export async function.
// 4. Check if user is authorized (if applicable).
// 5. Check if user is ratelimited, bump action count (if applicable).
// 6. Validate input arguments against created Zod Schema.
// 7. Execute your fetches or DB queries in a try{}catch(){} -
// Remember that Fetch API doesn't throw HTTP errors, so check !res.ok manually.
// When in try block, throw Errors instead of returns, catch block will take the error for its own return.
// Catch block error should be typed as "unknown", then used like: err instanceof Error ? err.message : "UNKNOWN ERROR."
// 8. If including data in return, return inside try block. Otherwise return outside.
// 9. If necessary, revalidatePath() to clear route cache after mutations which affect the FE.
// Successful returns (with data):  return { success: true, data: yourData, message: "SUCCESS: Action description." };
// Successful returns (without): return { success: true, message: "SUCCESS: Action description." };
// Errors returns (in try/catch): return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
// Error returns (before, outside try/catch): if (!condition) return { success: false, message: yourMessage };

// EXAMPLE OF AN ACTION THAT PURELY QUERIES FOR DATA
interface BlogInfoTypes {
  blogId: number;
  blogAuthor: string;
  blogTitle: string;
  active: boolean;
  creationDate: Date;
  updateDate: Date | null;
}
type GetBlogsResponseTypes = { success: boolean; data?: BlogInfoTypes[]; message: string };
/*export*/ async function getBlogs(): Promise<GetBlogsResponseTypes> {
  const session = await auth.api.getSession({
    headers: await headers(),
  }); // For ratelimit identity options, auth not mandatory in this case

  // Use your own ratelimit solution, this one called a janky self-rolled one I wrote for VertexBlog
  const { success: rlOK, message: rlMessage } = await ratelimit("fetch", await getClientIP(), session?.user.id);
  if (!rlOK) return { success: false, message: rlMessage };

  try {
    const blogList = await db
      .select({
        blogId: blogs.id,
        blogAuthor: blogs.author,
        blogTitle: blogs.title,
        active: blogs.active,
        creationDate: blogs.createdAt,
        updateDate: blogs.updatedAt,
      })
      .from(blogs)
      .where(isNull(blogs.deletedAt));
    return { success: true, data: blogList, message: "SUCCESS: Blog list indexed." };
  } catch (err: unknown) {
    return {
      success: false,
      message: `DATABASE ERROR: Failed retrieving blogs. (${err instanceof Error ? err.message : "UNKNOWN ERROR."})`,
    };
  }
}

// EXAMPLE OF AN ACTION WHICH MUTATES AND DOES NOT RETURN DATA
interface FormResponseTypes {
  success: boolean;
  message: string;
  errors?: string[];
}
type FormStatusTypes = FormResponseTypes | null;
const CreatePostSchema = z.object({
  targetBlog: z.string().trim().max(40),
  postTitle: z
    .string()
    .trim()
    .min(1, "Post title cannot be empty.")
    .max(60, "Post title cannot exceed 60 characters.")
    .regex(/^[^\\/:*?"<>|]+$/, 'Post title cannot contain any of the following characters: \\/:*?"<>|'),
});
/*export*/ async function createPost(currentState: FormStatusTypes, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, message: "AUTH ERROR: Unauthorized." };

  const { success: rlOK, message: rlMessage } = await ratelimit("mutate", await getClientIP(), session?.user.id);
  if (!rlOK) return { success: false, message: rlMessage };

  const validated = CreatePostSchema.safeParse({
    postTitle: formData.get("postTitle"),
    targetBlog: formData.get("currentBlog"),
  });
  if (!validated.success) {
    return {
      success: false,
      message: "VALIDATION ERROR: Invalid fields.",
      errors: validated.error.issues.map((issue) => issue.message),
    };
  }
  const { postTitle, targetBlog } = validated.data;

  const author = session.user.id;

  try {
    await db.transaction(async (tx) => {
      const [blogInfo] = await tx
        .update(blogs)
        .set({ active: true })
        .where(and(eq(blogs.title, targetBlog), eq(blogs.author, author), isNull(blogs.deletedAt)))
        .returning({ blogId: blogs.id, blogTitle: blogs.title });
      if (!blogInfo) throw new Error("AUTH ERROR: User is not authorized, or blog no longer exists.");

      await db.insert(posts).values({ parentBlog: blogInfo.blogId, title: postTitle, content: "" });
      revalidatePath(`/documents/${encodeURIComponent(blogInfo.blogTitle)}`);
    });
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
  return { success: true, message: "SUCCESS: Post added." };
}
