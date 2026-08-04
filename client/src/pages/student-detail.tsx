import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  MapPin,
  Calendar,
  Dumbbell,
  Target,
  UserPlus,
  ArrowLeft,
  Scale,
  Ruler,
  Activity,
  CheckCircle,
} from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudentUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  userType: string;
}

interface StudentProfile {
  id: string;
  userId: string;
  personalId: string | null;
  age: number | null;
  phone: string | null;
  cpf: string | null;
  gender: string | null;
  birthDate: string | null;
  address: string | null;
  city: string | null;
  goals: string | null;
  notes: string | null;
  status: string | null;
  user: StudentUser;
}

interface Props {
  userId: string;
}

export default function StudentDetailPage({ userId }: Props) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const isPersonal = user?.userType === "personal";

  const { data: student, isLoading } = useQuery<StudentProfile>({
    queryKey: [`/api/users/${userId}/student-profile`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/users/${userId}/student-profile`);
      return res.json();
    },
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/students/connect/${userId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/student-profile`] });
      toast({ title: "Aluno conectado com sucesso!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const isMyStudent = student?.personalId != null;

  const initials = student?.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "A";

  const age = student?.birthDate
    ? differenceInYears(new Date(), new Date(student.birthDate))
    : student?.age;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!student) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-6 text-center py-16">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Perfil não encontrado.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/students")}>
            Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => navigate("/students")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>

        {/* Profile Header */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <Avatar className="w-20 h-20 border-4 border-card">
                <AvatarImage src={student.user.photoUrl || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isPersonal && (
                isMyStudent ? (
                  <Badge className="bg-primary/20 text-primary border border-primary/30 gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Meu Aluno
                  </Badge>
                ) : (
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    onClick={() => connectMutation.mutate()}
                    disabled={connectMutation.isPending}
                  >
                    <UserPlus className="w-4 h-4" />
                    Conectar como Meu Aluno
                  </Button>
                )
              )}
            </div>

            <h1 className="text-xl font-bold text-foreground">{student.user.name}</h1>
            <p className="text-sm text-muted-foreground mb-3">{student.user.email}</p>

            <div className="flex flex-wrap gap-2">
              {age && (
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="w-3 h-3" /> {age} anos
                </Badge>
              )}
              {student.city && (
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="w-3 h-3" /> {student.city}
                </Badge>
              )}
              {student.gender && (
                <Badge variant="secondary" className="gap-1">
                  <User className="w-3 h-3" /> {student.gender}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        {student.goals && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{student.goals}</p>
            </CardContent>
          </Card>
        )}

        {/* Physical Info */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Informações Físicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Scale className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Peso</p>
                <p className="font-semibold text-sm">—</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Ruler className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Altura</p>
                <p className="font-semibold text-sm">—</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes (only visible to personal) */}
        {isPersonal && isMyStudent && student.notes && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Observações do Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{student.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
