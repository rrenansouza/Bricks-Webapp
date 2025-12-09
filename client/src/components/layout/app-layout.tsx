import { type ReactNode, useState, useEffect } from "react";
import { DesktopSidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { FirstAccessModal } from "@/components/dashboard/FirstAccessModal";
import { useAuth } from "@/lib/auth";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(false);

  useEffect(() => {
    if (user?.mustChangePasswordOnFirstLogin) {
      setShowFirstAccessModal(true);
    }
  }, [user?.mustChangePasswordOnFirstLogin]);

  const handlePasswordChanged = () => {
    setShowFirstAccessModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <MobileNav />
      <FirstAccessModal
        open={showFirstAccessModal}
        onPasswordChanged={handlePasswordChanged}
      />
    </div>
  );
}
