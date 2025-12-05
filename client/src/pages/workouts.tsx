import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Plus,
  Dumbbell,
  ChevronRight,
  Edit,
  Trash2,
  ArrowLeft,
  Play,
  Clock,
  Video,
  Loader2,
} from "lucide-react";

interface Workout {
  id: string;
  name: string;
  objective: string | null;
  description: string | null;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  exerciseName: string;
  videoUrl: string | null;
  sets: number | null;
  reps: number | null;
  weight: string | null;
  timeInSeconds: number | null;
  restTimeSeconds: number | null;
  observations: string | null;
  orderIndex: number | null;
}

const workoutSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  objective: z.string().optional(),
  description: z.string().optional(),
});

const exerciseSchema = z.object({
  exerciseName: z.string().min(2, "Nome do exercício é obrigatório"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  sets: z.coerce.number().min(1).optional(),
  reps: z.coerce.number().min(1).optional(),
  weight: z.coerce.number().min(0).optional(),
  timeInSeconds: z.coerce.number().min(0).optional(),
  restTimeSeconds: z.coerce.number().min(0).optional(),
  observations: z.string().optional(),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;
type ExerciseFormData = z.infer<typeof exerciseSchema>;

export function WorkoutsListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: WorkoutFormData) => {
      return apiRequest("POST", "/api/workouts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      setIsCreateOpen(false);
      toast({ title: "Treino criado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao criar treino", description: error.message, variant: "destructive" });
    },
  });

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: { name: "", objective: "", description: "" },
  });

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Treinos</h1>
            <p className="text-muted-foreground">
              Crie e gerencie seus treinos personalizados.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow-hover" data-testid="button-new-workout">
                <Plus className="w-4 h-4 mr-2" />
                Novo Treino
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Criar Novo Treino</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Treino</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Treino A - Peito e Tríceps" data-testid="input-workout-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Hipertrofia" data-testid="input-workout-objective" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descrição opcional do treino..." data-testid="input-workout-description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending} data-testid="button-create-workout">
                      {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Criar Treino
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card border-border/50">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-40 mb-3" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : workouts && workouts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout, index) => (
              <Link key={workout.id} href={`/workouts/${workout.id}`}>
                <Card
                  className="bg-card border-border/50 hover-elevate cursor-pointer slide-up overflow-visible h-full"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`card-workout-${workout.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Dumbbell className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">
                        {workout.exercises?.length || 0} exercícios
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {workout.objective || "Sem objetivo definido"}
                    </p>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Ver detalhes
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Dumbbell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum treino criado</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu primeiro treino personalizado.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Treino
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

interface WorkoutDetailPageProps {
  id?: string;
}

export function WorkoutDetailPage({ id: propId }: WorkoutDetailPageProps = {}) {
  const params = useParams<{ id: string }>();
  const workoutId = propId || params.id;
  const [, setLocation] = useLocation();
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const { toast } = useToast();

  const { data: workout, isLoading } = useQuery<Workout>({
    queryKey: ["/api/workouts", workoutId],
    enabled: !!workoutId,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/workouts/${workoutId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      setLocation("/workouts");
      toast({ title: "Treino excluído com sucesso!" });
    },
  });

  const addExerciseMutation = useMutation({
    mutationFn: async (data: ExerciseFormData) => {
      return apiRequest("POST", `/api/workouts/${workoutId}/exercises`, {
        ...data,
        weight: data.weight?.toString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts", workoutId] });
      setIsAddExerciseOpen(false);
      toast({ title: "Exercício adicionado!" });
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      return apiRequest("DELETE", `/api/workouts/${workoutId}/exercises/${exerciseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts", workoutId] });
      toast({ title: "Exercício removido!" });
    },
  });

  const exerciseForm = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      exerciseName: "",
      videoUrl: "",
      sets: 3,
      reps: 12,
      weight: 0,
      timeInSeconds: 0,
      restTimeSeconds: 60,
      observations: "",
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

  if (!workout) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 text-center">
          <p>Treino não encontrado</p>
          <Link href="/workouts">
            <Button variant="outline" className="mt-4">Voltar</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6 fade-in">
          <Link href="/workouts">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{workout.name}</h1>
            <p className="text-muted-foreground">{workout.objective || "Sem objetivo"}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => deleteMutation.mutate()}
            className="text-destructive hover:text-destructive"
            data-testid="button-delete-workout"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {workout.description && (
          <Card className="bg-card border-border/50 mb-6 fade-in">
            <CardContent className="p-4">
              <p className="text-muted-foreground">{workout.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6 fade-in">
          <h2 className="text-xl font-semibold">Exercícios</h2>
          <Dialog open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-add-exercise">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Exercício
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Exercício</DialogTitle>
              </DialogHeader>
              <Form {...exerciseForm}>
                <form onSubmit={exerciseForm.handleSubmit((data) => addExerciseMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={exerciseForm.control}
                    name="exerciseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Exercício</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Supino Reto" data-testid="input-exercise-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={exerciseForm.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Vídeo (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/..." data-testid="input-video-url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={exerciseForm.control}
                      name="sets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Séries</FormLabel>
                          <FormControl>
                            <Input type="number" data-testid="input-sets" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={exerciseForm.control}
                      name="reps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Repetições</FormLabel>
                          <FormControl>
                            <Input type="number" data-testid="input-reps" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={exerciseForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carga (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" data-testid="input-weight" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={exerciseForm.control}
                      name="restTimeSeconds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descanso (seg)</FormLabel>
                          <FormControl>
                            <Input type="number" data-testid="input-rest" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={exerciseForm.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Instruções adicionais..." data-testid="input-observations" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsAddExerciseOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={addExerciseMutation.isPending} data-testid="button-save-exercise">
                      {addExerciseMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Adicionar
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <Card key={exercise.id} className="bg-card border-border/50 slide-up overflow-visible" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {exercise.videoUrl ? (
                        <Video className="w-5 h-5 text-primary" />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{exercise.exerciseName}</h4>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        {exercise.sets && <span>{exercise.sets} séries</span>}
                        {exercise.reps && <span>{exercise.reps} reps</span>}
                        {exercise.weight && parseFloat(exercise.weight) > 0 && (
                          <span className="text-primary font-medium">{exercise.weight}kg</span>
                        )}
                        {exercise.restTimeSeconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exercise.restTimeSeconds}s
                          </span>
                        )}
                      </div>
                      {exercise.observations && (
                        <p className="text-sm text-muted-foreground mt-2">{exercise.observations}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExerciseMutation.mutate(exercise.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/50 rounded-lg border border-dashed border-border">
            <Dumbbell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum exercício adicionado</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsAddExerciseOpen(true)}>
              Adicionar primeiro exercício
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
