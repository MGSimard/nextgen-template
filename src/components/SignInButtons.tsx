"use client";
import { authClient } from "@/server/auth/auth-client";
import { IconGoogle } from "@/components/Icons";

export function SignInButtons() {
  const signInOptions = [
    {
      text: "Sign in with Google",
      icon: <IconGoogle />,
      onClick: async () => {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard?auth-success=true",
        });
      },
    },
  ];

  return (
    <>
      {signInOptions.map((option) => (
        <button key={option.text} className="btn" onClick={option.onClick}>
          {option.icon}
          {option.text}
        </button>
      ))}
    </>
  );
}
