import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dumbbell,
  ChevronRight,
  ArrowLeft,
  Play,
  Clock,
  Video,
  CheckCircle2,
  MessageSquare,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudentWorkout {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  feedback: string | null;
  completedAt: string | null;
  workout: {
    id: string;
    name: string;
    objective: string | null;
    description: string | null;
    exercises: Array<{
      id: string;
      exerciseName: string;
      videoUrl: string | null;
      sets: number | null;
      reps: number | null;
      weight: string | null;
      timeInSeconds: number | null;
      restTimeSeconds: number | null;
      observations: string | null;
    }>;
    personal: {
      user: {
        name: string;
      };
    };
  };
}

export function MyWorkoutsListPage() {
  const { data: workouts, isLoading } = useQuery<StudentWorkout[]>({
    queryKey: ["/api/student-workouts"],
  });

  const activeWorkouts = workouts?.filter((w) => w.status === "active") || [];
  const completedWorkouts = workouts?.filter((w) => w.status === "completed") || [];

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Meus Treinos</h1>
          <p className="text-muted-foreground">
            Visualize e acompanhe seus treinos atribuídos.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-card border-border/50">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-3" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : workouts && workouts.length > 0 ? (
          <div className="space-y-8">
            {activeWorkouts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Treinos Ativos
                </h2>
                <div className="space-y-4">
                  {activeWorkouts.map((item, index) => (
                    <Link key={item.id} href={`/my-workouts/${item.id}`}>
                      <Card
                        className="bg-card border-border/50 hover-elevate cursor-pointer slide-up overflow-visible"
                        style={{ animationDelay: `${index * 50}ms` }}
                        data-testid={`card-workout-${item.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Dumbbell className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-lg">{item.workout.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.workout.objective || "Sem objetivo definido"}
                                  </p>
                                </div>
                                <Badge className="shrink-0">Ativo</Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Dumbbell className="w-4 h-4" />
                                  {item.workout.exercises?.length || 0} exercícios
                                </span>
                                <span>Personal: {item.workout.personal?.user?.name}</span>
                                <span>
                                  Início: {format(new Date(item.startDate), "dd MMM", { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {completedWorkouts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                  Treinos Concluídos
                </h2>
                <div className="space-y-4">
                  {completedWorkouts.map((item, index) => (
                    <Link key={item.id} href={`/my-workouts/${item.id}`}>
                      <Card
                        className="bg-card border-border/50 hover-elevate cursor-pointer opacity-80"
                        data-testid={`card-workout-completed-${item.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium">{item.workout.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Concluído em {item.completedAt && format(new Date(item.completedAt), "dd MMM yyyy", { locale: ptBR })}
                              </p>
                            </div>
                            <Badge variant="secondary" className="shrink-0">Concluído</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <Dumbbell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum treino atribuído</h3>
            <p className="text-muted-foreground mb-6">
              Seu personal irá atribuir treinos para você em breve.
            </p>
            <Link href="/personals">
              <Button variant="outline">
                Encontrar Personal
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

interface MyWorkoutDetailPageProps {
  id?: string;
}

export function MyWorkoutDetailPage({ id: propId }: MyWorkoutDetailPageProps = {}) {
  const params = useParams<{ id: string }>();
  const workoutId = propId || params.id;
  const { toast } = useToast();
  const [feedbackText, setFeedbackText] = useState("");
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  const { data: studentWorkout, isLoading } = useQuery<StudentWorkout>({
    queryKey: ["/api/student-workouts", workoutId],
    enabled: !!workoutId,
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/student-workouts/${workoutId}/complete`, {
        feedback: feedbackText,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student-workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/student-workouts", workoutId] });
      setIsCompleteDialogOpen(false);
      toast({ title: "Treino concluído!", description: "Parabéns pelo treino!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!studentWorkout) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 text-center">
          <p>Treino não encontrado</p>
          <Link href="/my-workouts">
            <Button variant="outline" className="mt-4">Voltar</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { workout } = studentWorkout;
  const isCompleted = studentWorkout.status === "completed";
  const exerciseCount = workout.exercises?.length || 0;

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6 fade-in">
          <Link href="/my-workouts">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">{workout.name}</h1>
              <Badge variant={isCompleted ? "secondary" : "default"}>
                {isCompleted ? "Concluído" : "Ativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{workout.objective || "Sem objetivo"}</p>
          </div>
        </div>

        <Card className="bg-card border-border/50 mb-6 fade-in">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" />
                {exerciseCount} exercícios
              </span>
              <span>Personal: {workout.personal?.user?.name}</span>
              <span>
                Início: {format(new Date(studentWorkout.startDate), "dd MMM yyyy", { locale: ptBR })}
              </span>
            </div>
          </CardContent>
        </Card>

        {workout.description && (
          <Card className="bg-card border-border/50 mb-6 fade-in">
            <CardContent className="p-4">
              <p className="text-muted-foreground">{workout.description}</p>
            </CardContent>
          </Card>
        )}

        <h2 className="text-xl font-semibold mb-4 fade-in">Exercícios</h2>

        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-4 mb-8">
            {workout.exercises.map((exercise, index) => (
              <Card
                key={exercise.id}
                className="bg-card border-border/50 slide-up overflow-visible"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {exercise.videoUrl ? (
                        <Video className="w-6 h-6 text-primary" />
                      ) : (
                        <span className="text-xl font-bold text-muted-foreground">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-lg">{exercise.exerciseName}</h4>
                        {exercise.videoUrl && (
                          <a
                            href={exercise.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                          >
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Vídeo
                            </Button>
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {exercise.sets && (
                          <div className="bg-muted/50 px-3 py-2 rounded-lg text-center min-w-[70px]">
                            <p className="text-xl font-bold">{exercise.sets}</p>
                            <p className="text-xs text-muted-foreground">séries</p>
                          </div>
                        )}
                        {exercise.reps && (
                          <div className="bg-muted/50 px-3 py-2 rounded-lg text-center min-w-[70px]">
                            <p className="text-xl font-bold">{exercise.reps}</p>
                            <p className="text-xs text-muted-foreground">reps</p>
                          </div>
                        )}
                        {exercise.weight && parseFloat(exercise.weight) > 0 && (
                          <div className="bg-primary/10 px-3 py-2 rounded-lg text-center min-w-[70px]">
                            <p className="text-xl font-bold text-primary">{exercise.weight}</p>
                            <p className="text-xs text-muted-foreground">kg</p>
                          </div>
                        )}
                        {exercise.restTimeSeconds && (
                          <div className="bg-muted/50 px-3 py-2 rounded-lg text-center min-w-[70px]">
                            <p className="text-xl font-bold flex items-center justify-center gap-1">
                              <Clock className="w-4 h-4" />
                              {exercise.restTimeSeconds}
                            </p>
                            <p className="text-xs text-muted-foreground">seg descanso</p>
                          </div>
                        )}
                      </div>
                      {exercise.observations && (
                        <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/30 rounded-lg">
                          {exercise.observations}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/50 rounded-lg border border-dashed border-border mb-8">
            <Dumbbell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum exercício definido</p>
          </div>
        )}

        {studentWorkout.feedback && (
          <Card className="bg-card border-border/50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-medium">Seu feedback</span>
              </div>
              <p className="text-muted-foreground">{studentWorkout.feedback}</p>
            </CardContent>
          </Card>
        )}

        {!isCompleted && (
          <div className="fixed bottom-20 md:bottom-8 left-0 right-0 md:left-64 p-4 bg-gradient-to-t from-background to-transparent">
            <div className="max-w-4xl mx-auto">
              <Button
                size="lg"
                className="w-full neon-glow neon-glow-hover"
                onClick={() => setIsCompleteDialogOpen(true)}
                data-testid="button-complete-workout"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Marcar Treino como Concluído
              </Button>
            </div>
          </div>
        )}

        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Concluir Treino</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Parabéns por completar o treino! Deixe um feedback para seu personal (opcional):
              </p>
              <Textarea
                placeholder="Como foi o treino? Alguma dificuldade?"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                data-testid="input-feedback"
              />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => completeMutation.mutate()}
                  disabled={completeMutation.isPending}
                  data-testid="button-confirm-complete"
                >
                  {completeMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirmar Conclusão
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
