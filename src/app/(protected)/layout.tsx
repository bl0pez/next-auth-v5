import { NavBar } from "./_components/NavBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-y-10">
      <NavBar />
      {children}
    </div>
  );
}
