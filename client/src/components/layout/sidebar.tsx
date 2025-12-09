import { Link, useLocation } from "wouter";
import { Home, Dumbbell, Calendar, User, Search, Users, LogOut, Settings, Bell, CalendarDays, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
}

export function DesktopSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isPersonal = user?.userType === "personal";

  const mainNavItems: NavItem[] = isPersonal
    ? [
        { href: "/dashboard", icon: Home, label: "Dashboard" },
        { href: "/workouts", icon: Dumbbell, label: "Treinos" },
        { href: "/students", icon: Users, label: "Alunos" },
        { href: "/schedule", icon: Calendar, label: "Agenda" },
        { href: "/notifications", icon: Bell, label: "Notificações" },
        { href: "/events", icon: CalendarDays, label: "Eventos" },
        { href: "/store", icon: ShoppingCart, label: "Loja" },
      ]
    : [
        { href: "/dashboard", icon: Home, label: "Dashboard" },
        { href: "/my-workouts", icon: Dumbbell, label: "Meus Treinos" },
        { href: "/schedule", icon: Calendar, label: "Agenda" },
        { href: "/personals", icon: Search, label: "Buscar Personais" },
      ];

  const secondaryNavItems: NavItem[] = [
    { href: "/profile", icon: User, label: "Meu Perfil" },
    { href: "/settings", icon: Settings, label: "Configurações" },
  ];

  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <aside
      className="hidden md:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0"
      data-testid="desktop-sidebar"
    >
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">B</span>
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">Bricks</span>
      </div>

      <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-dark">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                  data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon
                    className={cn("w-5 h-5", isActive && "text-primary")}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>

        <Separator className="my-6 bg-sidebar-border" />

        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                  data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon
                    className={cn("w-5 h-5", isActive && "text-primary")}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="w-10 h-10 border-2 border-primary/30">
            <AvatarImage src={user?.photoUrl || undefined} alt={user?.name} />
            <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {isPersonal ? "Personal Trainer" : "Aluno"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
