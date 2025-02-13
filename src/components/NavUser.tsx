"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/server/auth/auth-client";
import { revalidateCache } from "@/server/actions";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IconCog, IconSignIn, IconSignOut, IconUser } from "@/components/Icons";

export function NavUser({ hideNav }: { hideNav: () => void }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  return (
    <div id="auth-control" className="nav-preview">
      {session?.user.image ? (
        <img className={`ac-avatar${isPending ? " ac-pending" : ""}`} src={session.user.image} alt="" />
      ) : (
        <div className={`ac-avatar${isPending ? " ac-pending" : ""}`}>
          <IconUser />
        </div>
      )}
      <div className="nav-reveal">
        <span
          className={`ac-name${!session ? " detail" : ""}`}
          title={isPending ? "Loading..." : session ? session.user.name || session.user.email : "Guest"}>
          {isPending ? "Loading..." : session ? session.user.name || session.user.email : "Guest"}
        </span>
        <div className="ac-buttons">
          <ThemeToggle />
          {session ? (
            <>
              <button type="button" aria-label="Settings" title="Settings" disabled>
                {/* TODO Make this a link later */}
                <IconCog />
              </button>
              <button
                type="button"
                aria-label="Sign Out"
                title="Sign out"
                onClick={async () =>
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: async () => {
                        toast.success("Signed out successfully.");
                        revalidateCache("/dashboard", "layout");
                        router.push("/");
                      },
                    },
                  })
                }>
                <IconSignOut />
              </button>
            </>
          ) : (
            <Link href="/sign-in" aria-label="Sign in" title="Sign In" onClick={hideNav}>
              <IconSignIn />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
