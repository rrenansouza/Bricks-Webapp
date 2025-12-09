import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { aiWorkoutService, trendingWorkoutsService, mockTrendingWorkouts } from "@/lib/mockServices";
import type { AIWorkoutSuggestion } from "@shared/schema";
import {
  Plus,
  Dumbbell,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Clock,
  Video,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  Target,
  Zap,
  Copy,
  Check,
  Flame,
  UserCheck,
  Download,
} from "lucide-react";

interface Workout {
  id: string;
  name: string;
  objective: string | null;
  level?: string | null;
  description: string | null;
  frequency?: string | null;
  duration?: number | null;
  tags?: string[] | null;
  isTrending?: boolean;
  usageCount?: number;
  studentCount?: number;
  rating?: string | null;
  personalName?: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  exerciseName: string;
  muscleGroup?: string | null;
  equipment?: string | null;
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
  exerciseName: z.string().min(2, "Nome do exercicio e obrigatorio"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  sets: z.coerce.number().min(1).optional(),
  reps: z.coerce.number().min(1).optional(),
  weight: z.coerce.number().min(0).optional(),
  timeInSeconds: z.coerce.number().min(0).optional(),
  restTimeSeconds: z.coerce.number().min(0).optional(),
  observations: z.string().optional(),
});

const aiWorkoutSchema = z.object({
  objective: z.string().min(1, "Selecione um objetivo"),
  level: z.string().min(1, "Selecione um nivel"),
  frequency: z.string().min(1, "Selecione a frequencia"),
  sessionTime: z.coerce.number().min(15, "Minimo 15 minutos"),
  restrictions: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  includeMealPlan: z.boolean().optional(),
  includeSupplements: z.boolean().optional(),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;
type ExerciseFormData = z.infer<typeof exerciseSchema>;
type AIWorkoutFormData = z.infer<typeof aiWorkoutSchema>;

const equipmentOptions = [
  { id: "halteres", label: "Halteres" },
  { id: "barras", label: "Barras" },
  { id: "maquinas", label: "Maquinas" },
  { id: "cabos", label: "Cabos" },
  { id: "kettlebell", label: "Kettlebell" },
  { id: "elasticos", label: "Elasticos" },
  { id: "peso_corporal", label: "Peso corporal" },
];

const objectiveLabels: Record<string, string> = {
  weight_loss: "Emagrecimento",
  hypertrophy: "Hipertrofia",
  conditioning: "Condicionamento",
  strength: "Forca",
  flexibility: "Flexibilidade",
  rehabilitation: "Reabilitacao",
};

const levelLabels: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediario",
  advanced: "Avancado",
};

function MyWorkoutsTab() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Meus Treinos</h2>
          <p className="text-sm text-muted-foreground">Gerencie seus treinos personalizados</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-workout">
              <Plus className="w-4 h-4 mr-2" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Criar Novo Treino</DialogTitle>
              <DialogDescription>Preencha as informacoes para criar um novo treino</DialogDescription>
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
                        <Input placeholder="Ex: Treino A - Peito e Triceps" data-testid="input-workout-name" {...field} />
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
                      <FormLabel>Descricao</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descricao opcional do treino..." data-testid="input-workout-description" {...field} />
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
                      {workout.exercises?.length || 0} exercicios
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
  );
}

function AIWorkoutTab() {
  const { toast } = useToast();
  const [aiResult, setAiResult] = useState<AIWorkoutSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AIWorkoutFormData>({
    resolver: zodResolver(aiWorkoutSchema),
    defaultValues: {
      objective: "",
      level: "",
      frequency: "3x por semana",
      sessionTime: 45,
      restrictions: "",
      equipment: [],
      includeMealPlan: false,
      includeSupplements: false,
    },
  });

  const handleGenerate = async (data: AIWorkoutFormData) => {
    setIsGenerating(true);
    setAiResult(null);
    try {
      const result = await aiWorkoutService.suggest({
        objective: data.objective,
        level: data.level,
        frequency: data.frequency,
        sessionTime: data.sessionTime,
        restrictions: data.restrictions,
        equipment: selectedEquipment,
        includeMealPlan: data.includeMealPlan,
        includeSupplements: data.includeSupplements,
      });
      setAiResult(result);
      toast({ title: "Treino gerado com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao gerar treino", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!aiResult?.workout) return;
    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/workouts", {
        name: aiResult.workout.name,
        objective: aiResult.workout.objective,
        level: aiResult.workout.level,
        frequency: aiResult.workout.frequency,
        duration: aiResult.workout.duration,
        description: `Treino gerado por IA - ${aiResult.workout.objective}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Treino salvo com sucesso!" });
      setAiResult(null);
      form.reset();
    } catch (error) {
      toast({ title: "Erro ao salvar treino", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Criar Treino com IA</h2>
          <p className="text-sm text-muted-foreground">Deixe a IA montar um treino personalizado</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Configurar Treino</CardTitle>
            <CardDescription>Preencha as informacoes para a IA gerar seu treino</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-ai-objective">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weight_loss">Emagrecimento</SelectItem>
                            <SelectItem value="hypertrophy">Hipertrofia</SelectItem>
                            <SelectItem value="conditioning">Condicionamento</SelectItem>
                            <SelectItem value="strength">Forca</SelectItem>
                            <SelectItem value="flexibility">Flexibilidade</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-ai-level">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediario</SelectItem>
                            <SelectItem value="advanced">Avancado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequencia</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-ai-frequency">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2x por semana">2x por semana</SelectItem>
                            <SelectItem value="3x por semana">3x por semana</SelectItem>
                            <SelectItem value="4x por semana">4x por semana</SelectItem>
                            <SelectItem value="5x por semana">5x por semana</SelectItem>
                            <SelectItem value="6x por semana">6x por semana</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sessionTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duracao (min)</FormLabel>
                        <FormControl>
                          <Input type="number" min={15} max={120} data-testid="input-ai-duration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormItem>
                  <FormLabel>Equipamentos disponiveis</FormLabel>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {equipmentOptions.map((eq) => (
                      <Badge
                        key={eq.id}
                        variant={selectedEquipment.includes(eq.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedEquipment((prev) =>
                            prev.includes(eq.id) ? prev.filter((e) => e !== eq.id) : [...prev, eq.id]
                          );
                        }}
                        data-testid={`badge-equipment-${eq.id}`}
                      >
                        {selectedEquipment.includes(eq.id) && <Check className="w-3 h-3 mr-1" />}
                        {eq.label}
                      </Badge>
                    ))}
                  </div>
                </FormItem>

                <FormField
                  control={form.control}
                  name="restrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restricoes ou lesoes (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Lesao no ombro, evitar exercicios de impacto..." 
                          data-testid="input-ai-restrictions" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3 pt-2">
                  <FormField
                    control={form.control}
                    name="includeMealPlan"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Incluir plano alimentar</FormLabel>
                          <FormDescription className="text-xs">
                            Sugestao de dieta para o objetivo
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-meal-plan" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="includeSupplements"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Incluir suplementacao</FormLabel>
                          <FormDescription className="text-xs">
                            Sugestao de suplementos
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-supplements" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isGenerating} data-testid="button-generate-ai">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando treino...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Treino com IA
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Resultado</CardTitle>
            <CardDescription>Treino gerado pela inteligencia artificial</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Analisando e gerando treino...</p>
              </div>
            ) : aiResult ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">{aiResult.workout.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">
                        <Target className="w-3 h-3 mr-1" />
                        {objectiveLabels[aiResult.workout.objective || ""] || aiResult.workout.objective}
                      </Badge>
                      <Badge variant="outline">
                        <Zap className="w-3 h-3 mr-1" />
                        {levelLabels[aiResult.workout.level || ""] || aiResult.workout.level}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {aiResult.workout.duration}min
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiResult.workout.frequency}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">Exercicios</h5>
                    <div className="space-y-2">
                      {aiResult.workout.exercises.map((ex, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/50">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Dumbbell className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{ex.exerciseName}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {ex.muscleGroup && <span>{ex.muscleGroup}</span>}
                              {ex.sets && ex.reps && <span>{ex.sets}x{ex.reps}</span>}
                              {ex.timeInSeconds && <span>{ex.timeInSeconds}s</span>}
                              {ex.restTimeSeconds && <span>Desc: {ex.restTimeSeconds}s</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {aiResult.mealPlan && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">Plano Alimentar</h5>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {aiResult.mealPlan}
                      </div>
                    </div>
                  )}

                  {aiResult.supplements && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium mb-2">Suplementacao</h5>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {aiResult.supplements}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  Configure os parametros ao lado e clique em "Gerar Treino com IA"
                </p>
              </div>
            )}
          </CardContent>
          {aiResult && (
            <CardFooter className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setAiResult(null)}>
                Descartar
              </Button>
              <Button className="flex-1" onClick={handleSaveWorkout} disabled={isSaving} data-testid="button-save-ai-workout">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Salvar Treino
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

function TrendingWorkoutsTab() {
  const { toast } = useToast();
  const [selectedWorkout, setSelectedWorkout] = useState<typeof mockTrendingWorkouts[0] | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [objectiveFilter, setObjectiveFilter] = useState<string>("all");
  const [isCopying, setIsCopying] = useState(false);

  const { data: trendingWorkouts, isLoading } = useQuery({
    queryKey: ["/api/trending-workouts", levelFilter, objectiveFilter],
    queryFn: async () => {
      return trendingWorkoutsService.getAll({
        level: levelFilter !== "all" ? levelFilter : undefined,
        objective: objectiveFilter !== "all" ? objectiveFilter : undefined,
      });
    },
  });

  const handleCopyWorkout = async (workout: typeof mockTrendingWorkouts[0]) => {
    setIsCopying(true);
    try {
      await apiRequest("POST", "/api/workouts", {
        name: `${workout.name} (Copia)`,
        objective: workout.objective,
        level: workout.level,
        frequency: workout.frequency,
        duration: workout.duration,
        description: workout.description,
        tags: workout.tags,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Treino copiado com sucesso!", description: "O treino foi adicionado aos seus treinos." });
      setSelectedWorkout(null);
    } catch (error) {
      toast({ title: "Erro ao copiar treino", variant: "destructive" });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Treinos em Alta</h2>
          <p className="text-sm text-muted-foreground">Treinos populares da comunidade Bricks</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-trending-level">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os niveis</SelectItem>
            <SelectItem value="beginner">Iniciante</SelectItem>
            <SelectItem value="intermediate">Intermediario</SelectItem>
            <SelectItem value="advanced">Avancado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={objectiveFilter} onValueChange={setObjectiveFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-trending-objective">
            <SelectValue placeholder="Objetivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os objetivos</SelectItem>
            <SelectItem value="weight_loss">Emagrecimento</SelectItem>
            <SelectItem value="hypertrophy">Hipertrofia</SelectItem>
            <SelectItem value="conditioning">Condicionamento</SelectItem>
            <SelectItem value="strength">Forca</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-3" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : trendingWorkouts && trendingWorkouts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingWorkouts.map((workout, index) => (
            <Card
              key={workout.id}
              className="bg-card border-border/50 hover-elevate cursor-pointer slide-up overflow-visible"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedWorkout(workout)}
              data-testid={`card-trending-${workout.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{workout.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{workout.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{workout.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {levelLabels[workout.level || ""] || workout.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {objectiveLabels[workout.objective || ""] || workout.objective}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{workout.studentCount} alunos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration}min</span>
                  </div>
                </div>

                {workout.personalName && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      <UserCheck className="w-3 h-3 inline mr-1" />
                      Por {workout.personalName}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <TrendingUp className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum treino encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros para ver mais treinos.
          </p>
        </div>
      )}

      <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedWorkout && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  {selectedWorkout.name}
                </DialogTitle>
                <DialogDescription>{selectedWorkout.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {levelLabels[selectedWorkout.level || ""] || selectedWorkout.level}
                  </Badge>
                  <Badge variant="outline">
                    {objectiveLabels[selectedWorkout.objective || ""] || selectedWorkout.objective}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedWorkout.duration}min
                  </Badge>
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {selectedWorkout.studentCount} alunos
                  </Badge>
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    {selectedWorkout.rating}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Exercicios ({selectedWorkout.exercises.length})</h4>
                  <div className="space-y-2">
                    {selectedWorkout.exercises.map((ex) => (
                      <div key={ex.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Dumbbell className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{ex.exerciseName}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {ex.muscleGroup && <span>{ex.muscleGroup}</span>}
                            {ex.equipment && <span>- {ex.equipment}</span>}
                            {ex.sets && ex.reps && <span>| {ex.sets}x{ex.reps}</span>}
                            {ex.restTimeSeconds && <span>| Desc: {ex.restTimeSeconds}s</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedWorkout.tags && selectedWorkout.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkout.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedWorkout(null)}>
                  Fechar
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => handleCopyWorkout(selectedWorkout)} 
                  disabled={isCopying}
                  data-testid="button-copy-trending"
                >
                  {isCopying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Copy className="w-4 h-4 mr-2" />}
                  Copiar para Meus Treinos
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function WorkoutsListPage() {
  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Treinos</h1>
          <p className="text-muted-foreground">
            Crie, gerencie e descubra treinos personalizados.
          </p>
        </div>

        <Tabs defaultValue="my-workouts" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="my-workouts" className="gap-2" data-testid="tab-my-workouts">
              <Dumbbell className="w-4 h-4" />
              Meus Treinos
            </TabsTrigger>
            <TabsTrigger value="ai-workout" className="gap-2" data-testid="tab-ai-workout">
              <Sparkles className="w-4 h-4" />
              Criar com IA
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2" data-testid="tab-trending">
              <TrendingUp className="w-4 h-4" />
              Em Alta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-workouts" className="fade-in">
            <MyWorkoutsTab />
          </TabsContent>
          <TabsContent value="ai-workout" className="fade-in">
            <AIWorkoutTab />
          </TabsContent>
          <TabsContent value="trending" className="fade-in">
            <TrendingWorkoutsTab />
          </TabsContent>
        </Tabs>
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
      toast({ title: "Treino excluido com sucesso!" });
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
      toast({ title: "Exercicio adicionado!" });
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      return apiRequest("DELETE", `/api/workouts/${workoutId}/exercises/${exerciseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts", workoutId] });
      toast({ title: "Exercicio removido!" });
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
          <p>Treino nao encontrado</p>
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
          <h2 className="text-xl font-semibold">Exercicios</h2>
          <Dialog open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-add-exercise">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Exercicio
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Exercicio</DialogTitle>
              </DialogHeader>
              <Form {...exerciseForm}>
                <form onSubmit={exerciseForm.handleSubmit((data) => addExerciseMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={exerciseForm.control}
                    name="exerciseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Exercicio</FormLabel>
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
                        <FormLabel>URL do Video (opcional)</FormLabel>
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
                          <FormLabel>Series</FormLabel>
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
                          <FormLabel>Repeticoes</FormLabel>
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
                        <FormLabel>Observacoes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Instrucoes adicionais..." data-testid="input-observations" {...field} />
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
                        {exercise.sets && <span>{exercise.sets} series</span>}
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
            <p className="text-muted-foreground">Nenhum exercicio adicionado</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsAddExerciseOpen(true)}>
              Adicionar primeiro exercicio
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
