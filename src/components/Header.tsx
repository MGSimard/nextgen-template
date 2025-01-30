interface SectionProps extends React.ComponentPropsWithoutRef<"header"> {
  children: React.ReactNode;
}

export function Header({ children, ...props }: SectionProps) {
  return (
    <header {...props}>
      <div id="header-content">{children}</div>
    </header>
  );
}
