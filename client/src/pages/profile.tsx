import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  User,
  Mail,
  MapPin,
  Dumbbell,
  Star,
  Users,
  Edit,
  Save,
  X,
  Loader2,
} from "lucide-react";

const personalProfileSchema = z.object({
  bio: z.string().optional(),
  specialties: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  averagePrice: z.coerce.number().min(0).optional(),
});

const studentProfileSchema = z.object({
  goals: z.string().optional(),
  notes: z.string().optional(),
});

type PersonalProfileFormData = z.infer<typeof personalProfileSchema>;
type StudentProfileFormData = z.infer<typeof studentProfileSchema>;

interface PersonalProfile {
  id: string;
  bio: string | null;
  specialties: string[] | null;
  city: string | null;
  neighborhood: string | null;
  averagePrice: string | null;
  averageRating: string | null;
  totalRatings: number | null;
}

interface StudentProfile {
  id: string;
  goals: string | null;
  notes: string | null;
  personal?: {
    id: string;
    user: {
      name: string;
    };
  };
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const isPersonal = user?.userType === "personal";

  const { data: personalProfile, isLoading: personalLoading } = useQuery<PersonalProfile>({
    queryKey: ["/api/personals/me"],
    enabled: isPersonal,
  });

  const { data: studentProfile, isLoading: studentLoading } = useQuery<StudentProfile>({
    queryKey: ["/api/students/me"],
    enabled: !isPersonal,
  });

  const { data: studentCount } = useQuery<{ count: number }>({
    queryKey: ["/api/personals/student-count"],
    enabled: isPersonal,
  });

  const updatePersonalMutation = useMutation({
    mutationFn: async (data: PersonalProfileFormData) => {
      const specialtiesArray = data.specialties
        ? data.specialties.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      return apiRequest("PATCH", "/api/personals/me", {
        ...data,
        specialties: specialtiesArray,
        averagePrice: data.averagePrice?.toString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personals/me"] });
      refreshUser();
      setIsEditing(false);
      toast({ title: "Perfil atualizado!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (data: StudentProfileFormData) => {
      return apiRequest("PATCH", "/api/students/me", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students/me"] });
      refreshUser();
      setIsEditing(false);
      toast({ title: "Perfil atualizado!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const personalForm = useForm<PersonalProfileFormData>({
    resolver: zodResolver(personalProfileSchema),
    defaultValues: {
      bio: personalProfile?.bio || "",
      specialties: personalProfile?.specialties?.join(", ") || "",
      city: personalProfile?.city || "",
      neighborhood: personalProfile?.neighborhood || "",
      averagePrice: personalProfile?.averagePrice ? parseFloat(personalProfile.averagePrice) : 0,
    },
  });

  const studentForm = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      goals: studentProfile?.goals || "",
      notes: studentProfile?.notes || "",
    },
  });

  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const isLoading = isPersonal ? personalLoading : studentLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <Card className="bg-card border-border/50 mb-6 fade-in overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
          <CardContent className="p-6 -mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <Avatar className="w-24 h-24 border-4 border-card">
                <AvatarImage src={user?.photoUrl || undefined} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <Badge className="mt-2" variant="secondary">
                  {isPersonal ? "Personal Trainer" : "Aluno"}
                </Badge>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  data-testid="button-edit-profile"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isPersonal && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "0ms" }}>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{studentCount?.count || 0}</p>
                <p className="text-sm text-muted-foreground">Alunos</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "50ms" }}>
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {parseFloat(personalProfile?.averageRating || "0").toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avaliação</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 slide-up" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-4 text-center">
                <Dumbbell className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{personalProfile?.totalRatings || 0}</p>
                <p className="text-sm text-muted-foreground">Feedbacks</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-card border-border/50 fade-in">
          <CardHeader>
            <CardTitle>
              {isPersonal ? "Perfil Profissional" : "Informações do Aluno"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              isPersonal ? (
                <Form {...personalForm}>
                  <form
                    onSubmit={personalForm.handleSubmit((data) => updatePersonalMutation.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={personalForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Fale um pouco sobre você e sua experiência..."
                              rows={4}
                              data-testid="input-bio"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidades</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Musculação, Crossfit, Funcional (separados por vírgula)"
                              data-testid="input-specialties"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={personalForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="São Paulo" data-testid="input-city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalForm.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input placeholder="Centro" data-testid="input-neighborhood" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={personalForm.control}
                      name="averagePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Médio (R$/mês)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="500"
                              data-testid="input-price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={updatePersonalMutation.isPending}
                        data-testid="button-save-profile"
                      >
                        {updatePersonalMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...studentForm}>
                  <form
                    onSubmit={studentForm.handleSubmit((data) => updateStudentMutation.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={studentForm.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seus Objetivos</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Quais são seus objetivos fitness?"
                              rows={3}
                              data-testid="input-goals"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={studentForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Alguma informação importante sobre você (lesões, restrições, etc.)"
                              rows={3}
                              data-testid="input-notes"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateStudentMutation.isPending}
                        data-testid="button-save-profile"
                      >
                        {updateStudentMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              )
            ) : (
              <div className="space-y-4">
                {isPersonal ? (
                  <>
                    {personalProfile?.bio ? (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
                        <p>{personalProfile.bio}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Adicione uma bio para que alunos conheçam você melhor.
                      </p>
                    )}

                    {personalProfile?.specialties && personalProfile.specialties.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Especialidades
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {personalProfile.specialties.map((spec) => (
                            <Badge key={spec} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(personalProfile?.city || personalProfile?.neighborhood) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {personalProfile?.city}
                          {personalProfile?.neighborhood && `, ${personalProfile.neighborhood}`}
                        </span>
                      </div>
                    )}

                    {personalProfile?.averagePrice && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Preço Médio
                        </h4>
                        <p className="text-xl font-bold text-primary">
                          R$ {parseFloat(personalProfile.averagePrice).toFixed(0)}/mês
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {studentProfile?.goals ? (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Objetivos
                        </h4>
                        <p>{studentProfile.goals}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Adicione seus objetivos para ajudar seu personal a criar treinos melhores.
                      </p>
                    )}

                    {studentProfile?.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Observações
                        </h4>
                        <p>{studentProfile.notes}</p>
                      </div>
                    )}

                    {studentProfile?.personal && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Seu Personal
                        </h4>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{studentProfile.personal.user.name}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
