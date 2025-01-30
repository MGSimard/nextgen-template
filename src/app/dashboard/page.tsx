import { Section } from "@/components/Section";
import { SignInToast } from "@/components/SignInToast";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PageDashboard({ searchParams }: { searchParams: SearchParams }) {
  const resolved = await searchParams;
  const authSuccess = resolved["auth-success"];

  return (
    <main>
      {authSuccess === "true" && <SignInToast />}
      <Section>
        <h2>Section</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in lacinia ligula, sit amet dictum urna. Nullam
          vitae fringilla elit. Quisque iaculis vulputate dui, quis congue nibh consectetur sit amet. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut enim risus, accumsan a
          ligula at, dignissim cursus erat. Mauris in ullamcorper nisi. Nunc nisi nunc, varius vitae nunc ut, eleifend
          imperdiet lectus. Vestibulum venenatis porttitor lectus, eget lacinia arcu sagittis eget. Duis fermentum
          luctus nunc nec rutrum. Phasellus nec efficitur leo.
        </p>
      </Section>
    </main>
  );
}
