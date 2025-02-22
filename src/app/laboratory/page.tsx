import Link from "next/link";
import { TestFletchAPI } from "./_components/TestFetchAPI";

export default async function PageLaboratory() {
  const LabLinks = [
    {
      name: "Nexus",
      href: "/laboratory/nexus",
    },
  ];

  return (
    <>
      <header>
        <h1>Laboratory</h1>
      </header>
      <main>
        <section>
          <ul>
            {LabLinks.map((link) => (
              <li key={link.name} className="link">
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <TestFletchAPI />
        </section>
      </main>
    </>
  );
}
