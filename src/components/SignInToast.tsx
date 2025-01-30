"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function SignInToast() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Signed in successfully.");
    router.replace("/dashboard"); // Clear params used to trigger success toast on OAuth sign-in redirection
  }, []);

  return null;
}
