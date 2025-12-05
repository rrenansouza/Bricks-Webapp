import { type ReactNode } from "react";
import { DesktopSidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
