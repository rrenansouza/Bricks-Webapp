import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PersonalWithUser, AvailabilitySlot } from "@shared/schema";
import {
  ArrowLeft,
  Star,
  MapPin,
  Dumbbell,
  Calendar as CalendarIcon,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PersonalDetailPageProps {
  id: string;
}

interface AvailableSlot extends AvailabilitySlot {
  isBooked?: boolean;
}

export default function PersonalDetailPage({ id }: PersonalDetailPageProps) {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const { data: personal, isLoading } = useQuery<PersonalWithUser>({
    queryKey: ["/api/personals", id],
  });

  const { data: slots, isLoading: slotsLoading } = useQuery<AvailableSlot[]>({
    queryKey: ["/api/personals", id, "slots"],
    enabled: !!personal,
  });

  const bookMutation = useMutation({
    mutationFn: async (slotId: string) => {
      const response = await apiRequest("POST", "/api/appointments", {
        personalId: personal?.id,
        slotId,
        startTime: selectedSlot?.startTime,
        endTime: selectedSlot?.endTime,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Agendamento realizado!",
        description: "Seu horário foi reservado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/personals", id, "slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsBookingDialogOpen(false);
      setSelectedSlot(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao agendar",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    },
  });

  const filteredSlots = slots?.filter((slot) => {
    if (!selectedDate) return true;
    const slotDate = parseISO(slot.startTime as unknown as string);
    return isSameDay(slotDate, selectedDate);
  });

  const handleSlotSelect = (slot: AvailableSlot) => {
    if (!isAuthenticated) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para agendar.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    if (user?.userType !== "student") {
      toast({
        title: "Apenas alunos",
        description: "Apenas alunos podem agendar horários.",
        variant: "destructive",
      });
      return;
    }
    setSelectedSlot(slot);
    setIsBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (selectedSlot) {
      bookMutation.mutate(selectedSlot.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Skeleton className="w-24 h-24 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-7 w-48" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Skeleton className="h-80" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!personal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Personal não encontrado</h1>
          <Link href="/personals">
            <Button>Voltar ao Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 fade-in">
          <Link href="/personals">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border/50 fade-in">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-24 h-24 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    {personal.user.photoUrl ? (
                      <img
                        src={personal.user.photoUrl}
                        alt={personal.user.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-primary font-bold text-3xl">
                        {personal.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2" data-testid="text-personal-name">
                      {personal.user.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-3">
                      {personal.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {personal.neighborhood ? `${personal.neighborhood}, ` : ""}
                            {personal.city}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-medium">
                          {Number(personal.averageRating || 0).toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({personal.totalRatings || 0} avaliações)
                        </span>
                      </div>
                    </div>
                    {personal.averagePrice && (
                      <p className="text-lg font-semibold text-primary">
                        R$ {Number(personal.averagePrice).toFixed(2)}
                        <span className="text-sm text-muted-foreground font-normal"> / aula</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {personal.bio && (
              <Card className="bg-card border-border/50 fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{personal.bio}</p>
                </CardContent>
              </Card>
            )}

            {personal.specialties && personal.specialties.length > 0 && (
              <Card className="bg-card border-border/50 fade-in">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-primary" />
                    Especialidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {personal.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card border-border/50 fade-in">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horários Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slotsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-14" />
                    ))}
                  </div>
                ) : filteredSlots && filteredSlots.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {filteredSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={slot.isBooked ? "secondary" : "outline"}
                        className="justify-start h-auto py-3 px-4"
                        disabled={slot.isBooked}
                        onClick={() => handleSlotSelect(slot)}
                        data-testid={`button-slot-${slot.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-primary" />
                          <div className="text-left">
                            <p className="font-medium">
                              {format(parseISO(slot.startTime as unknown as string), "HH:mm")} -{" "}
                              {format(parseISO(slot.endTime as unknown as string), "HH:mm")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(slot.startTime as unknown as string), "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                        </div>
                        {slot.isBooked && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Ocupado
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {selectedDate
                        ? `Nenhum horário disponível em ${format(selectedDate, "dd/MM/yyyy")}`
                        : "Selecione uma data para ver os horários"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border/50 fade-in sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Selecionar Data
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  className="rounded-md"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Agendamento</DialogTitle>
            <DialogDescription>
              Você está prestes a agendar uma aula com {personal?.user.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedSlot && (
            <div className="py-4">
              <Card className="bg-muted/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {format(parseISO(selectedSlot.startTime as unknown as string), "EEEE, dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                      <p className="text-muted-foreground">
                        {format(parseISO(selectedSlot.startTime as unknown as string), "HH:mm")} -{" "}
                        {format(parseISO(selectedSlot.endTime as unknown as string), "HH:mm")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {personal?.averagePrice && (
                <div className="mt-4 flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <span className="text-muted-foreground">Valor da aula</span>
                  <span className="text-xl font-bold text-primary">
                    R$ {Number(personal.averagePrice).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsBookingDialogOpen(false)}
              disabled={bookMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={bookMutation.isPending}
              className="neon-glow-hover"
              data-testid="button-confirm-booking"
            >
              {bookMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Agendamento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
