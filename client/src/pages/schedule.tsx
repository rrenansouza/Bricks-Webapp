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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronLeft,
  ChevronRight,
  MapPin,
  Car,
} from "lucide-react";
import { 
  format, 
  addHours, 
  startOfDay, 
  isSameDay, 
  startOfWeek, 
  addDays, 
  addWeeks, 
  subWeeks,
  setHours,
  setMinutes,
  isWithinInterval,
  differenceInMinutes,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Student, StudentWithUser } from "@shared/schema";

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
  location: string | null;
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

interface PersonalEvent {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string | null;
  location: string | null;
  travelTime: number | null;
  notes: string | null;
}

const slotSchema = z.object({
  date: z.date({ required_error: "Selecione uma data" }),
  startHour: z.string().min(1, "Selecione o horário inicial"),
  endHour: z.string().min(1, "Selecione o horário final"),
});

const appointmentSchema = z.object({
  studentId: z.string().min(1, "Selecione um aluno"),
  date: z.date({ required_error: "Selecione uma data" }),
  startHour: z.string().min(1, "Selecione o horário inicial"),
  endHour: z.string().min(1, "Selecione o horário final"),
  location: z.string().optional(),
  travelTime: z.string().optional(),
  notes: z.string().optional(),
});

const eventSchema = z.object({
  name: z.string().min(1, "Nome do evento é obrigatório"),
  date: z.date({ required_error: "Selecione uma data" }),
  startHour: z.string().min(1, "Selecione o horário inicial"),
  endHour: z.string().min(1, "Selecione o horário final"),
  color: z.string().optional(),
  location: z.string().optional(),
  travelTime: z.string().optional(),
  notes: z.string().optional(),
});

type SlotFormData = z.infer<typeof slotSchema>;
type AppointmentFormData = z.infer<typeof appointmentSchema>;
type EventFormData = z.infer<typeof eventSchema>;

const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minutes = (i % 2) * 30;
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
});

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const COLORS = [
  { value: "#b6ff00", label: "Neon (Padrão)" },
  { value: "#00b8d4", label: "Azul" },
  { value: "#ff5722", label: "Laranja" },
  { value: "#9c27b0", label: "Roxo" },
  { value: "#4caf50", label: "Verde" },
  { value: "#f44336", label: "Vermelho" },
];

export default function SchedulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [activeView, setActiveView] = useState<"week" | "day">("week");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: Date; hour: string } | null>(null);

  const isPersonal = user?.userType === "personal";

  const { data: slots, isLoading: slotsLoading } = useQuery<AvailabilitySlot[]>({
    queryKey: ["/api/availability-slots"],
    enabled: isPersonal,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: personalEvents, isLoading: eventsLoading } = useQuery<PersonalEvent[]>({
    queryKey: ["/api/personal-events"],
    enabled: isPersonal,
  });

  const { data: students } = useQuery<StudentWithUser[]>({
    queryKey: ["/api/students"],
    enabled: isPersonal,
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
      return apiRequest("PATCH", `/api/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ title: "Agendamento atualizado!" });
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: { studentId: string; startTime: Date; endTime: Date; location?: string; travelTime?: number; notes?: string }) => {
      return apiRequest("POST", "/api/appointments", {
        studentId: data.studentId,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        location: data.location,
        travelTime: data.travelTime,
        notes: data.notes,
        status: "confirmed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setIsAddAppointmentOpen(false);
      appointmentForm.reset();
      toast({ title: "Agendamento criado!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: { name: string; startTime: Date; endTime: Date; color?: string; location?: string; travelTime?: number; notes?: string }) => {
      return apiRequest("POST", "/api/personal-events", {
        name: data.name,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        color: data.color || "#b6ff00",
        location: data.location,
        travelTime: data.travelTime,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-events"] });
      setIsAddEventOpen(false);
      eventForm.reset();
      toast({ title: "Evento criado!" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return apiRequest("DELETE", `/api/personal-events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-events"] });
      toast({ title: "Evento removido!" });
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

  const appointmentForm = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      studentId: "",
      date: new Date(),
      startHour: "08:00",
      endHour: "09:00",
      location: "",
      travelTime: "",
      notes: "",
    },
  });

  const eventForm = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      startHour: "08:00",
      endHour: "09:00",
      color: "#b6ff00",
      location: "",
      travelTime: "",
      notes: "",
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

  const handleCreateAppointment = (data: AppointmentFormData) => {
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

    createAppointmentMutation.mutate({ 
      studentId: data.studentId,
      startTime, 
      endTime,
      location: data.location || undefined,
      travelTime: data.travelTime ? parseInt(data.travelTime) : undefined,
      notes: data.notes || undefined,
    });
  };

  const handleCreateEvent = (data: EventFormData) => {
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

    createEventMutation.mutate({ 
      name: data.name,
      startTime, 
      endTime,
      color: data.color || "#b6ff00",
      location: data.location || undefined,
      travelTime: data.travelTime ? parseInt(data.travelTime) : undefined,
      notes: data.notes || undefined,
    });
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: "prev" | "next") => {
    setWeekStart(direction === "prev" ? subWeeks(weekStart, 1) : addWeeks(weekStart, 1));
  };

  const goToToday = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
    setSelectedDate(new Date());
  };

  const getEventsForTimeSlot = (day: Date, hour: string) => {
    const [h, m] = hour.split(":").map(Number);
    const slotStart = setMinutes(setHours(day, h), m);
    const slotEnd = setMinutes(setHours(day, h), m + 30);

    const matchingAppointments = (appointments || []).filter(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      return isSameDay(aptStart, day) && (
        (aptStart >= slotStart && aptStart < slotEnd) ||
        (isWithinInterval(slotStart, { start: aptStart, end: aptEnd }) && aptStart < slotStart)
      );
    });

    const matchingEvents = (personalEvents || []).filter(evt => {
      const evtStart = new Date(evt.startTime);
      const evtEnd = new Date(evt.endTime);
      return isSameDay(evtStart, day) && (
        (evtStart >= slotStart && evtStart < slotEnd) ||
        (isWithinInterval(slotStart, { start: evtStart, end: evtEnd }) && evtStart < slotStart)
      );
    });

    return { appointments: matchingAppointments, events: matchingEvents };
  };

  const calculateEventHeight = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const minutes = differenceInMinutes(end, start);
    return Math.max(28, (minutes / 30) * 28);
  };

  const slotsForSelectedDate = slots?.filter((slot) =>
    isSameDay(new Date(slot.startTime), selectedDate)
  ) || [];

  const appointmentsForSelectedDate = appointments?.filter((apt) =>
    isSameDay(new Date(apt.startTime), selectedDate)
  ) || [];

  const eventsForSelectedDate = personalEvents?.filter((evt) =>
    isSameDay(new Date(evt.startTime), selectedDate)
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
        return <Badge variant="outline">Concluido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const openAppointmentDialog = (date?: Date, hour?: string) => {
    if (date && hour) {
      appointmentForm.setValue("date", date);
      appointmentForm.setValue("startHour", hour);
      const [h] = hour.split(":").map(Number);
      appointmentForm.setValue("endHour", `${(h + 1).toString().padStart(2, "0")}:00`);
    }
    setIsAddAppointmentOpen(true);
  };

  const openEventDialog = (date?: Date, hour?: string) => {
    if (date && hour) {
      eventForm.setValue("date", date);
      eventForm.setValue("startHour", hour);
      const [h] = hour.split(":").map(Number);
      eventForm.setValue("endHour", `${(h + 1).toString().padStart(2, "0")}:00`);
    }
    setIsAddEventOpen(true);
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-full mx-auto h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {isPersonal ? "Minha Agenda" : "Agendamentos"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isPersonal
                ? "Gerencie sua disponibilidade, agendamentos e eventos."
                : "Veja seus agendamentos e agende novas aulas."}
            </p>
          </div>
          {isPersonal && (
            <div className="flex gap-2 flex-wrap">
              <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-add-appointment">
                    <User className="w-4 h-4 mr-2" />
                    Agendar Aula
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agendar Aula com Aluno</DialogTitle>
                  </DialogHeader>
                  <Form {...appointmentForm}>
                    <form onSubmit={appointmentForm.handleSubmit(handleCreateAppointment)} className="space-y-4">
                      <FormField
                        control={appointmentForm.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aluno</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-student">
                                  <SelectValue placeholder="Selecione um aluno" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {students?.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.user.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={appointmentForm.control}
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
                          control={appointmentForm.control}
                          name="startHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inicio</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-apt-start-hour">
                                    <SelectValue placeholder="Horario" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TIME_SLOTS.map((hour) => (
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
                          control={appointmentForm.control}
                          name="endHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fim</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-apt-end-hour">
                                    <SelectValue placeholder="Horario" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TIME_SLOTS.map((hour) => (
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
                      <FormField
                        control={appointmentForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Local (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Academia X, Parque Y" {...field} data-testid="input-apt-location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={appointmentForm.control}
                        name="travelTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempo de deslocamento (minutos)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Ex: 30" {...field} data-testid="input-apt-travel" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={appointmentForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observacoes (opcional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Notas sobre a aula..." {...field} data-testid="input-apt-notes" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-3 justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsAddAppointmentOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createAppointmentMutation.isPending} data-testid="button-save-appointment">
                          {createAppointmentMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Agendar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-add-event">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Evento Pessoal</DialogTitle>
                  </DialogHeader>
                  <Form {...eventForm}>
                    <form onSubmit={eventForm.handleSubmit(handleCreateEvent)} className="space-y-4">
                      <FormField
                        control={eventForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Evento</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Reuniao, Consulta, Compromisso" {...field} data-testid="input-event-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={eventForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                className="rounded-md border"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={eventForm.control}
                          name="startHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inicio</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-evt-start-hour">
                                    <SelectValue placeholder="Horario" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TIME_SLOTS.map((hour) => (
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
                          control={eventForm.control}
                          name="endHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fim</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-evt-end-hour">
                                    <SelectValue placeholder="Horario" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TIME_SLOTS.map((hour) => (
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
                      <FormField
                        control={eventForm.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-evt-color">
                                  <SelectValue placeholder="Selecione uma cor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COLORS.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                                      {color.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={eventForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Local (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Escritorio, Clinica" {...field} data-testid="input-event-location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={eventForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observacoes (opcional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Detalhes do evento..." {...field} data-testid="input-event-notes" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-3 justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createEventMutation.isPending} data-testid="button-save-event">
                          {createEventMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Criar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
                <DialogTrigger asChild>
                  <Button className="neon-glow-hover" data-testid="button-add-slot">
                    <Plus className="w-4 h-4 mr-2" />
                    Horario Disponivel
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
                              <FormLabel>Inicio</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-start-hour">
                                    <SelectValue placeholder="Horario" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {HOURS.map((hour) => (
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
                                    <SelectValue placeholder="Horario" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {HOURS.map((hour) => (
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
            </div>
          )}
        </div>

        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "week" | "day")} className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <TabsList>
              <TabsTrigger value="week" data-testid="tab-week">Semana</TabsTrigger>
              <TabsTrigger value="day" data-testid="tab-day">Dia</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")} data-testid="button-prev-week">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday} data-testid="button-today">
                Hoje
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")} data-testid="button-next-week">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium ml-2">
                {format(weekStart, "d MMM", { locale: ptBR })} - {format(addDays(weekStart, 6), "d MMM yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>

          <TabsContent value="week" className="flex-1 m-0">
            <Card className="bg-card border-border/50 h-full">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-8 border-b border-border/50 sticky top-0 bg-card z-10">
                    <div className="p-2 text-center text-xs text-muted-foreground border-r border-border/30">
                      Horario
                    </div>
                    {weekDays.map((day, index) => {
                      const isToday = isSameDay(day, new Date());
                      return (
                        <div 
                          key={index} 
                          className={`p-2 text-center border-r border-border/30 last:border-r-0 ${isToday ? "bg-primary/10" : ""}`}
                        >
                          <p className="text-xs text-muted-foreground uppercase">
                            {format(day, "EEE", { locale: ptBR })}
                          </p>
                          <p className={`text-lg font-semibold ${isToday ? "text-primary" : ""}`}>
                            {format(day, "d")}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="divide-y divide-border/30">
                    {HOURS.map((hour) => {
                      return (
                        <div key={hour} className="grid grid-cols-8">
                          <div className="p-2 text-xs text-muted-foreground text-right pr-4 border-r border-border/30">
                            {hour}
                          </div>
                          {weekDays.map((day, dayIndex) => {
                            const { appointments: dayAppointments, events: dayEvents } = getEventsForTimeSlot(day, hour);
                            const hasItems = dayAppointments.length > 0 || dayEvents.length > 0;
                            const isToday = isSameDay(day, new Date());

                            return (
                              <div 
                                key={dayIndex} 
                                className={`p-1 min-h-[56px] border-r border-border/30 last:border-r-0 relative ${isToday ? "bg-primary/5" : ""} hover:bg-muted/30 cursor-pointer transition-colors`}
                                onClick={() => {
                                  if (!hasItems && isPersonal) {
                                    openAppointmentDialog(day, hour);
                                  }
                                }}
                                data-testid={`timeslot-${format(day, 'yyyy-MM-dd')}-${hour}`}
                              >
                                {dayAppointments.map((apt) => {
                                  const aptStart = new Date(apt.startTime);
                                  const isStart = format(aptStart, "HH:mm") === hour;
                                  if (!isStart) return null;
                                  
                                  return (
                                    <div
                                      key={apt.id}
                                      className="absolute left-1 right-1 rounded-md px-2 py-1 text-xs overflow-hidden z-[1]"
                                      style={{
                                        backgroundColor: "hsl(75, 100%, 50%)",
                                        color: "hsl(173, 100%, 8%)",
                                        height: `${calculateEventHeight(apt.startTime, apt.endTime)}px`,
                                      }}
                                      data-testid={`appointment-${apt.id}`}
                                    >
                                      <div className="font-medium truncate flex items-center gap-1">
                                        <User className="w-3 h-3 flex-shrink-0" />
                                        {apt.student?.user?.name || "Aluno"}
                                      </div>
                                      <div className="text-[10px] opacity-80">
                                        {format(new Date(apt.startTime), "HH:mm")} - {format(new Date(apt.endTime), "HH:mm")}
                                      </div>
                                    </div>
                                  );
                                })}

                                {dayEvents.map((evt) => {
                                  const evtStart = new Date(evt.startTime);
                                  const isStart = format(evtStart, "HH:mm") === hour;
                                  if (!isStart) return null;

                                  return (
                                    <div
                                      key={evt.id}
                                      className="absolute left-1 right-1 rounded-md px-2 py-1 text-xs overflow-hidden z-[1] group"
                                      style={{
                                        backgroundColor: evt.color || "#00b8d4",
                                        color: "white",
                                        height: `${calculateEventHeight(evt.startTime, evt.endTime)}px`,
                                      }}
                                      data-testid={`event-${evt.id}`}
                                    >
                                      <div className="font-medium truncate flex items-center justify-between gap-1">
                                        <span className="flex items-center gap-1">
                                          <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                                          {evt.name}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteEventMutation.mutate(evt.id);
                                          }}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <div className="text-[10px] opacity-80">
                                        {format(new Date(evt.startTime), "HH:mm")} - {format(new Date(evt.endTime), "HH:mm")}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="day" className="flex-1 m-0">
            <div className="grid lg:grid-cols-[350px_1fr] gap-6 h-full">
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
                          Horarios Disponiveis
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
                            Nenhum horario disponivel neste dia
                          </p>
                        )}
                      </div>
                    )}

                    {isPersonal && eventsForSelectedDate.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Eventos Pessoais
                        </h3>
                        <div className="space-y-2">
                          {eventsForSelectedDate.map((evt) => (
                            <div
                              key={evt.id}
                              className="flex items-center justify-between p-3 rounded-lg border"
                              style={{ 
                                backgroundColor: `${evt.color}20`,
                                borderColor: `${evt.color}40`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: evt.color || "#b6ff00" }}
                                />
                                <div>
                                  <p className="font-medium">{evt.name}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {format(new Date(evt.startTime), "HH:mm")} -{" "}
                                      {format(new Date(evt.endTime), "HH:mm")}
                                    </span>
                                    {evt.location && (
                                      <>
                                        <MapPin className="w-3 h-3 ml-2" />
                                        <span>{evt.location}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteEventMutation.mutate(evt.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
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
                                    {appointment.location && (
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{appointment.location}</span>
                                      </div>
                                    )}
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
