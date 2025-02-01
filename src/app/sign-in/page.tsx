import { SignInButtons } from "@/components/SignInButtons";

export default function PageSignIn() {
  return (
    <main id="sign-in">
      <div className="authcard">
        <div className="authcard-header">
          <h1>Sign In</h1>
          <p className="detail">Authenticate with your preferred option below.</p>
        </div>
        <div className="authcard-content">
          <SignInButtons />
        </div>
      </div>
    </main>
  );
}
