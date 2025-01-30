import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFound() {
  return (
    <main id="not-found">
      <h1>
        <span className="nf1">404</span>
        <span className="nf2">
          NOT FOUND<span className="blink">.</span>
        </span>
      </h1>

      <Link href="/" className="link">
        RETURN HOME
      </Link>
    </main>
  );
}
