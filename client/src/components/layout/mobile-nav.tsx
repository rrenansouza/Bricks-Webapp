import { Link, useLocation } from "wouter";
import { Home, Dumbbell, Calendar, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
}

export function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  const isPersonal = user?.userType === "personal";

  const navItems: NavItem[] = isPersonal
    ? [
        { href: "/dashboard", icon: Home, label: "Home" },
        { href: "/workouts", icon: Dumbbell, label: "Treinos" },
        { href: "/schedule", icon: Calendar, label: "Agenda" },
        { href: "/profile", icon: User, label: "Perfil" },
      ]
    : [
        { href: "/dashboard", icon: Home, label: "Home" },
        { href: "/my-workouts", icon: Dumbbell, label: "Treinos" },
        { href: "/schedule", icon: Calendar, label: "Agenda" },
        { href: "/personals", icon: Search, label: "Buscar" },
        { href: "/profile", icon: User, label: "Perfil" },
      ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur-lg"
      data-testid="mobile-nav"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors duration-200 min-w-[60px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "text-neon-glow"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
