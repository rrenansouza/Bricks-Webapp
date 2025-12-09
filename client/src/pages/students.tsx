import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/layout/app-layout";
import { NewStudentModal } from "@/components/dashboard/NewStudentModal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Users,
  Search,
  ChevronRight,
  Dumbbell,
  Calendar,
  Plus,
  Loader2,
  Mail,
  UserPlus,
} from "lucide-react";

interface StudentWithUser {
  id: string;
  goals: string | null;
  notes: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
  };
  activeWorkoutsCount?: number;
  lastAppointment?: string;
}

interface Workout {
  id: string;
  name: string;
  objective: string | null;
}

export default function StudentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignWorkoutOpen, setIsAssignWorkoutOpen] = useState(false);
  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithUser | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");

  const { data: students, isLoading } = useQuery<StudentWithUser[]>({
    queryKey: ["/api/students"],
  });

  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const assignWorkoutMutation = useMutation({
    mutationFn: async ({ studentId, workoutId }: { studentId: string; workoutId: string }) => {
      return apiRequest("POST", "/api/student-workouts", {
        studentId,
        workoutId,
        startDate: new Date().toISOString(),
        status: "active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setIsAssignWorkoutOpen(false);
      setSelectedStudent(null);
      setSelectedWorkoutId("");
      toast({ title: "Treino atribuído com sucesso!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const filteredStudents = students?.filter((student) =>
    student.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignWorkout = (student: StudentWithUser) => {
    setSelectedStudent(student);
    setIsAssignWorkoutOpen(true);
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Meus Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie seus alunos e atribua treinos personalizados.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar aluno por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-student"
            />
          </div>
          <Button onClick={() => setIsNewStudentOpen(true)} data-testid="button-new-student">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Aluno
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <Card
                key={student.id}
                className="bg-card border-border/50 slide-up overflow-visible"
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`card-student-${student.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shrink-0">
                      {student.user.photoUrl ? (
                        <img
                          src={student.user.photoUrl}
                          alt={student.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-foreground font-bold text-xl">
                          {student.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{student.user.name}</h3>
                      <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {student.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Dumbbell className="w-4 h-4" />
                      <span>{student.activeWorkoutsCount || 0} treinos ativos</span>
                    </div>
                  </div>

                  {student.goals && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      Objetivo: {student.goals}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAssignWorkout(student)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Atribuir Treino
                    </Button>
                    <Link href={`/students/${student.id}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "Nenhum aluno encontrado" : "Nenhum aluno ainda"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Tente buscar por outro termo."
                : "Quando alunos se vincularem a você, eles aparecerão aqui."}
            </p>
          </div>
        )}

        <Dialog open={isAssignWorkoutOpen} onOpenChange={setIsAssignWorkoutOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Atribuir Treino</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {selectedStudent.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedStudent.user.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedStudent.user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Selecione o Treino</label>
                  <Select value={selectedWorkoutId} onValueChange={setSelectedWorkoutId}>
                    <SelectTrigger data-testid="select-workout">
                      <SelectValue placeholder="Escolha um treino" />
                    </SelectTrigger>
                    <SelectContent>
                      {workouts?.map((workout) => (
                        <SelectItem key={workout.id} value={workout.id}>
                          {workout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {workouts?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Você ainda não criou nenhum treino.{" "}
                    <Link href="/workouts">
                      <span className="text-primary cursor-pointer hover:underline">
                        Criar treino
                      </span>
                    </Link>
                  </p>
                )}

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAssignWorkoutOpen(false);
                      setSelectedStudent(null);
                      setSelectedWorkoutId("");
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() =>
                      assignWorkoutMutation.mutate({
                        studentId: selectedStudent.id,
                        workoutId: selectedWorkoutId,
                      })
                    }
                    disabled={!selectedWorkoutId || assignWorkoutMutation.isPending}
                    data-testid="button-confirm-assign"
                  >
                    {assignWorkoutMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Atribuir
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <NewStudentModal open={isNewStudentOpen} onOpenChange={setIsNewStudentOpen} />
      </div>
    </AppLayout>
  );
}
