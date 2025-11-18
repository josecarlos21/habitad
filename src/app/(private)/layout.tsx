
import { AppHeader } from "@/components/app/app-header";
import { BottomNavBar } from "@/components/app/bottom-nav-bar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      <BottomNavBar />
    </div>
  );
}
