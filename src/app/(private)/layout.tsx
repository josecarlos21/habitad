
import { AppHeader } from "@/components/app/app-header";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
