import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/lib/auth";
import {
  Users,
  Dumbbell,
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardStats {
  totalStudents: number;
  activeWorkouts: number;
  upcomingAppointments: number;
  averageRating: number;
}

interface RecentAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  student: {
    user: {
      name: string;
      photoUrl?: string;
    };
  };
}

interface RecentStudent {
  id: string;
  user: {
    name: string;
    photoUrl?: string;
    email: string;
  };
}

export default function PersonalDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/personals/stats"],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<RecentAppointment[]>({
    queryKey: ["/api/appointments", "upcoming"],
  });

  const { data: students, isLoading: studentsLoading } = useQuery<RecentStudent[]>({
    queryKey: ["/api/students"],
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {greeting()}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Confira o resumo da sua atividade como personal trainer.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-card border-border/50">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "0ms" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Alunos</p>
                      <p className="text-3xl font-bold">{stats?.totalStudents || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "50ms" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Treinos Ativos</p>
                      <p className="text-3xl font-bold">{stats?.activeWorkouts || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "100ms" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Agendamentos</p>
                      <p className="text-3xl font-bold">{stats?.upcomingAppointments || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "150ms" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Avaliação</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold">{stats?.averageRating?.toFixed(1) || "0.0"}</p>
                        <Star className="w-5 h-5 text-primary fill-primary" />
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-8 fade-in">
          <Link href="/workouts/new">
            <Button className="neon-glow-hover" data-testid="button-new-workout">
              <Plus className="w-4 h-4 mr-2" />
              Novo Treino
            </Button>
          </Link>
          <Link href="/schedule">
            <Button variant="outline" data-testid="button-manage-schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Gerenciar Agenda
            </Button>
          </Link>
          <Link href="/students">
            <Button variant="outline" data-testid="button-manage-students">
              <Users className="w-4 h-4 mr-2" />
              Ver Alunos
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border/50 fade-in">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
              <Link href="/schedule">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover-elevate"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {appointment.student.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{appointment.student.user.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {format(new Date(appointment.startTime), "dd MMM, HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={appointment.status === "confirmed" ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum agendamento próximo</p>
                  <Link href="/schedule">
                    <Button variant="outline" size="sm" className="mt-4">
                      Configurar Disponibilidade
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 fade-in">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Seus Alunos</CardTitle>
              <Link href="/students">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : students && students.length > 0 ? (
                <div className="space-y-4">
                  {students.slice(0, 5).map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover-elevate"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {student.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{student.user.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum aluno ainda</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Convide alunos para começar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
