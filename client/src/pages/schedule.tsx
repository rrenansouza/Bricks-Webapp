import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Check,
  X,
  Loader2,
  User,
} from "lucide-react";
import { format, addHours, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  student?: {
    id: string;
    user: {
      name: string;
      photoUrl: string | null;
    };
  };
  personal?: {
    id: string;
    user: {
      name: string;
      photoUrl: string | null;
    };
  };
}

const slotSchema = z.object({
  date: z.date({ required_error: "Selecione uma data" }),
  startHour: z.string().min(1, "Selecione o horário inicial"),
  endHour: z.string().min(1, "Selecione o horário final"),
});

type SlotFormData = z.infer<typeof slotSchema>;

export default function SchedulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);

  const isPersonal = user?.userType === "personal";

  const { data: slots, isLoading: slotsLoading } = useQuery<AvailabilitySlot[]>({
    queryKey: ["/api/availability-slots"],
    enabled: isPersonal,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const createSlotMutation = useMutation({
    mutationFn: async (data: { startTime: Date; endTime: Date }) => {
      return apiRequest("POST", "/api/availability-slots", {
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        isRecurring: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability-slots"] });
      setIsAddSlotOpen(false);
      toast({ title: "Horário adicionado!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: string) => {
      return apiRequest("DELETE", `/api/availability-slots/${slotId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability-slots"] });
      toast({ title: "Horário removido!" });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Agendamento atualizado!" });
    },
  });

  const slotForm = useForm<SlotFormData>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      date: new Date(),
      startHour: "08:00",
      endHour: "09:00",
    },
  });

  const handleCreateSlot = (data: SlotFormData) => {
    const [startHour, startMinute] = data.startHour.split(":").map(Number);
    const [endHour, endMinute] = data.endHour.split(":").map(Number);

    const startTime = new Date(data.date);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(data.date);
    endTime.setHours(endHour, endMinute, 0, 0);

    if (endTime <= startTime) {
      toast({ title: "Erro", description: "Horário final deve ser após o inicial", variant: "destructive" });
      return;
    }

    createSlotMutation.mutate({ startTime, endTime });
  };

  const hours = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const slotsForSelectedDate = slots?.filter((slot) =>
    isSameDay(new Date(slot.startTime), selectedDate)
  ) || [];

  const appointmentsForSelectedDate = appointments?.filter((apt) =>
    isSameDay(new Date(apt.startTime), selectedDate)
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge>Confirmado</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      case "completed":
        return <Badge variant="outline">Concluído</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {isPersonal ? "Minha Agenda" : "Agendamentos"}
            </h1>
            <p className="text-muted-foreground">
              {isPersonal
                ? "Gerencie sua disponibilidade e agendamentos."
                : "Veja seus agendamentos e agende novas aulas."}
            </p>
          </div>
          {isPersonal && (
            <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
              <DialogTrigger asChild>
                <Button className="neon-glow-hover" data-testid="button-add-slot">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Horário
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Adicionar Disponibilidade</DialogTitle>
                </DialogHeader>
                <Form {...slotForm}>
                  <form onSubmit={slotForm.handleSubmit(handleCreateSlot)} className="space-y-4">
                    <FormField
                      control={slotForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < startOfDay(new Date())}
                              className="rounded-md border"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={slotForm.control}
                        name="startHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Início</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-start-hour">
                                  <SelectValue placeholder="Horário" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {hours.map((hour) => (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={slotForm.control}
                        name="endHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fim</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-end-hour">
                                  <SelectValue placeholder="Horário" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {hours.map((hour) => (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button type="button" variant="outline" onClick={() => setIsAddSlotOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createSlotMutation.isPending} data-testid="button-save-slot">
                        {createSlotMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Salvar
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          <Card className="bg-card border-border/50 fade-in h-fit">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                locale={ptBR}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card border-border/50 fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPersonal && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Horários Disponíveis
                    </h3>
                    {slotsLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : slotsForSelectedDate.length > 0 ? (
                      <div className="space-y-2">
                        {slotsForSelectedDate.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20"
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="font-medium">
                                {format(new Date(slot.startTime), "HH:mm")} -{" "}
                                {format(new Date(slot.endTime), "HH:mm")}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSlotMutation.mutate(slot.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum horário disponível neste dia
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Agendamentos
                  </h3>
                  {appointmentsLoading ? (
                    <div className="space-y-2">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : appointmentsForSelectedDate.length > 0 ? (
                    <div className="space-y-3">
                      {appointmentsForSelectedDate.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-4 rounded-lg bg-muted/50 border border-border/50"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {isPersonal
                                    ? appointment.student?.user?.name
                                    : appointment.personal?.user?.name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {format(new Date(appointment.startTime), "HH:mm")} -{" "}
                                    {format(new Date(appointment.endTime), "HH:mm")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(appointment.status)}
                              {isPersonal && appointment.status === "pending" && (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      updateAppointmentMutation.mutate({
                                        id: appointment.id,
                                        status: "confirmed",
                                      })
                                    }
                                    className="text-green-500 hover:text-green-600"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      updateAppointmentMutation.mutate({
                                        id: appointment.id,
                                        status: "cancelled",
                                      })
                                    }
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum agendamento neste dia
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
