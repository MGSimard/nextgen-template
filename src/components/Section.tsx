interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  children: React.ReactNode;
}

export function Section({ children, ...props }: SectionProps) {
  return (
    <section {...props}>
      <div className="section-content">{children}</div>
    </section>
  );
}
