export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <h1>Dashboard</h1>
      </header>
      {children}
    </>
  );
}
