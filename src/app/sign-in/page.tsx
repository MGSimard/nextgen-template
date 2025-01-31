import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { Section } from "@/components/Section";
import { SignInButtons } from "@/components/SignInButtons";

export default async function PageSignIn() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/dashboard");

  return (
    <main id="sign-in">
      <Section>
        <div className="authcard">
          <div className="authcard-header">
            <h1>Sign In</h1>
            <p className="detail">Authenticate with your preferred option below.</p>
          </div>
          <div className="authcard-content">
            <SignInButtons />
          </div>
        </div>
      </Section>
    </main>
  );
}
