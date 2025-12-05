import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/lib/auth";
import {
  Dumbbell,
  Calendar,
  Trophy,
  ChevronRight,
  Clock,
  Play,
  CheckCircle2,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudentStats {
  activeWorkouts: number;
  completedWorkouts: number;
  upcomingAppointments: number;
  weeklyProgress: number;
}

interface AssignedWorkout {
  id: string;
  status: string;
  startDate: string;
  workout: {
    id: string;
    name: string;
    objective: string;
    personal: {
      user: {
        name: string;
      };
    };
    exercises: Array<{ id: string }>;
  };
}

interface UpcomingAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  personal: {
    user: {
      name: string;
      photoUrl?: string;
    };
    specialties: string[];
  };
}

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<StudentStats>({
    queryKey: ["/api/students/stats"],
  });

  const { data: workouts, isLoading: workoutsLoading } = useQuery<AssignedWorkout[]>({
    queryKey: ["/api/student-workouts"],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<UpcomingAppointment[]>({
    queryKey: ["/api/appointments", "my"],
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const activeWorkouts = workouts?.filter((w) => w.status === "active") || [];
  const completedCount = workouts?.filter((w) => w.status === "completed").length || 0;
  const totalCount = workouts?.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {greeting()}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Veja seus treinos e acompanhe seu progresso.
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
                      <p className="text-sm text-muted-foreground mb-1">Treinos Ativos</p>
                      <p className="text-3xl font-bold">{stats?.activeWorkouts || activeWorkouts.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "50ms" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Concluídos</p>
                      <p className="text-3xl font-bold">{stats?.completedWorkouts || completedCount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "100ms" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Agendamentos</p>
                      <p className="text-3xl font-bold">{stats?.upcomingAppointments || appointments?.length || 0}</p>
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
                      <p className="text-sm text-muted-foreground mb-1">Progresso</p>
                      <p className="text-3xl font-bold">{Math.round(stats?.weeklyProgress || progressPercentage)}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {progressPercentage > 0 && (
          <Card className="bg-card border-border/50 mb-8 fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Seu Progresso Semanal</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} de {totalCount} treinos concluídos
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-3 mb-8 fade-in">
          <Link href="/my-workouts">
            <Button className="neon-glow-hover" data-testid="button-view-workouts">
              <Dumbbell className="w-4 h-4 mr-2" />
              Meus Treinos
            </Button>
          </Link>
          <Link href="/schedule">
            <Button variant="outline" data-testid="button-schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Aula
            </Button>
          </Link>
          <Link href="/personals">
            <Button variant="outline" data-testid="button-find-personal">
              <Search className="w-4 h-4 mr-2" />
              Buscar Personal
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border/50 fade-in">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Treinos Ativos</CardTitle>
              <Link href="/my-workouts">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {workoutsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/30">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : activeWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {activeWorkouts.slice(0, 3).map((item) => (
                    <Link key={item.id} href={`/my-workouts/${item.id}`}>
                      <div className="p-4 rounded-lg bg-muted/30 hover-elevate cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{item.workout.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {item.workout.objective || "Sem objetivo definido"}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Dumbbell className="w-3 h-3" />
                                {item.workout.exercises?.length || 0} exercícios
                              </span>
                              <span>Personal: {item.workout.personal?.user?.name}</span>
                            </div>
                          </div>
                          <Button size="sm" className="shrink-0">
                            <Play className="w-4 h-4 mr-1" />
                            Iniciar
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Nenhum treino ativo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seu personal irá atribuir treinos para você
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 fade-in">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Próximas Aulas</CardTitle>
              <Link href="/schedule">
                <Button variant="ghost" size="sm">
                  Ver agenda
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
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {appointment.personal.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{appointment.personal.user.name}</p>
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
                  <p className="text-muted-foreground">Nenhuma aula agendada</p>
                  <Link href="/personals">
                    <Button variant="outline" size="sm" className="mt-4">
                      Encontrar Personal
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
