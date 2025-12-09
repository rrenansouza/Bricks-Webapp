import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { queryClient } from "@/lib/queryClient";
import { notificationService } from "@/lib/mockServices";
import type { BricksNotification } from "@shared/schema";
import {
  Bell,
  Send,
  Clock,
  Repeat,
  Loader2,
  Users,
  User,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  Trash2,
  Pause,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const notificationSchema = z.object({
  title: z.string().min(2, "Titulo obrigatorio"),
  message: z.string().min(5, "Mensagem obrigatoria"),
  recipientType: z.enum(["student", "group"]),
  recipientId: z.string().optional(),
  recipientGroup: z.string().optional(),
  channel: z.enum(["in_app", "email", "whatsapp"]),
});

const scheduledNotificationSchema = notificationSchema.extend({
  scheduledAt: z.string().min(1, "Data/hora obrigatoria"),
});

const recurringNotificationSchema = notificationSchema.extend({
  recurringFrequency: z.enum(["daily", "weekly", "monthly"]),
  recurringTime: z.string().min(1, "Horario obrigatorio"),
  recurringDays: z.array(z.number()).optional(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;
type ScheduledNotificationFormData = z.infer<typeof scheduledNotificationSchema>;
type RecurringNotificationFormData = z.infer<typeof recurringNotificationSchema>;

const channelIcons: Record<string, typeof Bell> = {
  in_app: Smartphone,
  email: Mail,
  whatsapp: MessageSquare,
};

const channelLabels: Record<string, string> = {
  in_app: "No App",
  email: "E-mail",
  whatsapp: "WhatsApp",
};

const statusIcons: Record<string, typeof Bell> = {
  pending: Clock,
  sent: CheckCircle,
  failed: XCircle,
  cancelled: AlertCircle,
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  sent: "Enviado",
  failed: "Falhou",
  cancelled: "Cancelado",
};

const frequencyLabels: Record<string, string> = {
  daily: "Diariamente",
  weekly: "Semanalmente",
  monthly: "Mensalmente",
};

const weekDays = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sab" },
];

function SendNowTab() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      recipientType: "group",
      recipientGroup: "all_active",
      channel: "in_app",
    },
  });

  const handleSend = async (data: NotificationFormData) => {
    setIsSending(true);
    try {
      await notificationService.sendNow({
        title: data.title,
        message: data.message,
        recipientType: data.recipientType,
        recipientId: data.recipientId,
        recipientGroup: data.recipientGroup,
        channel: data.channel,
      });
      toast({ title: "Notificacao enviada com sucesso!" });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/notifications"] });
    } catch (error) {
      toast({ title: "Erro ao enviar notificacao", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Enviar Agora
          </CardTitle>
          <CardDescription>Envie uma notificacao imediata para seus alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSend)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Lembrete de treino" data-testid="input-notif-title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite sua mensagem..." 
                        rows={4}
                        data-testid="input-notif-message" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recipientType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destinatario</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-recipient-type">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="group">
                            <span className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Grupo
                            </span>
                          </SelectItem>
                          <SelectItem value="student">
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Aluno especifico
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("recipientType") === "group" && (
                  <FormField
                    control={form.control}
                    name="recipientGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grupo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-recipient-group">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all_active">Todos ativos</SelectItem>
                            <SelectItem value="inactive_30d">Inativos 30+ dias</SelectItem>
                            <SelectItem value="new_students">Novos alunos</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canal de envio</FormLabel>
                    <div className="flex gap-2">
                      {(["in_app", "email", "whatsapp"] as const).map((ch) => {
                        const Icon = channelIcons[ch];
                        return (
                          <Button
                            key={ch}
                            type="button"
                            variant={field.value === ch ? "default" : "outline"}
                            size="sm"
                            onClick={() => field.onChange(ch)}
                            className="flex-1"
                            data-testid={`button-channel-${ch}`}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {channelLabels[ch]}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSending} data-testid="button-send-now">
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Agora
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Historico Recente</CardTitle>
          <CardDescription>Ultimas notificacoes enviadas</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationHistory />
        </CardContent>
      </Card>
    </div>
  );
}

function ScheduledTab() {
  const { toast } = useToast();
  const [isScheduling, setIsScheduling] = useState(false);

  const form = useForm<ScheduledNotificationFormData>({
    resolver: zodResolver(scheduledNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      recipientType: "group",
      recipientGroup: "all_active",
      channel: "in_app",
      scheduledAt: "",
    },
  });

  const handleSchedule = async (data: ScheduledNotificationFormData) => {
    setIsScheduling(true);
    try {
      await notificationService.schedule({
        title: data.title,
        message: data.message,
        recipientType: data.recipientType,
        recipientId: data.recipientId,
        recipientGroup: data.recipientGroup,
        channel: data.channel,
        scheduledAt: new Date(data.scheduledAt),
      });
      toast({ title: "Notificacao agendada com sucesso!" });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/notifications/scheduled"] });
    } catch (error) {
      toast({ title: "Erro ao agendar notificacao", variant: "destructive" });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Agendar Notificacao
          </CardTitle>
          <CardDescription>Programe uma notificacao para envio futuro</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSchedule)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Avaliacao fisica" data-testid="input-sched-title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite sua mensagem..." 
                        rows={3}
                        data-testid="input-sched-message" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        data-testid="input-sched-datetime" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recipientType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destinatario</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="group">Grupo</SelectItem>
                          <SelectItem value="student">Aluno especifico</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in_app">No App</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isScheduling} data-testid="button-schedule">
                {isScheduling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Notificacao
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Notificacoes Agendadas</CardTitle>
          <CardDescription>Proximas notificacoes programadas</CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduledNotificationsList />
        </CardContent>
      </Card>
    </div>
  );
}

function RecurringTab() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]);

  const form = useForm<RecurringNotificationFormData>({
    resolver: zodResolver(recurringNotificationSchema),
    defaultValues: {
      title: "",
      message: "",
      recipientType: "group",
      recipientGroup: "all_active",
      channel: "in_app",
      recurringFrequency: "weekly",
      recurringTime: "08:00",
      recurringDays: [1, 3, 5],
    },
  });

  const handleCreate = async (data: RecurringNotificationFormData) => {
    setIsCreating(true);
    try {
      await notificationService.createRecurring({
        title: data.title,
        message: data.message,
        recipientType: data.recipientType,
        recipientId: data.recipientId,
        recipientGroup: data.recipientGroup,
        channel: data.channel,
        recurringFrequency: data.recurringFrequency,
        recurringTime: data.recurringTime,
        recurringDays: selectedDays,
      });
      toast({ title: "Notificacao recorrente criada!" });
      form.reset();
      setSelectedDays([1, 3, 5]);
      queryClient.invalidateQueries({ queryKey: ["/notifications/recurring"] });
    } catch (error) {
      toast({ title: "Erro ao criar notificacao recorrente", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Repeat className="w-5 h-5 text-primary" />
            Criar Notificacao Recorrente
          </CardTitle>
          <CardDescription>Configure envios automaticos periodicos</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Motivacao diaria" data-testid="input-recur-title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite sua mensagem..." 
                        rows={3}
                        data-testid="input-recur-message" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recurringFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequencia</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-recur-frequency">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Diariamente</SelectItem>
                          <SelectItem value="weekly">Semanalmente</SelectItem>
                          <SelectItem value="monthly">Mensalmente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurringTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horario</FormLabel>
                      <FormControl>
                        <Input type="time" data-testid="input-recur-time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("recurringFrequency") === "weekly" && (
                <FormItem>
                  <FormLabel>Dias da semana</FormLabel>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {weekDays.map((day) => (
                      <Badge
                        key={day.value}
                        variant={selectedDays.includes(day.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedDays((prev) =>
                            prev.includes(day.value) 
                              ? prev.filter((d) => d !== day.value) 
                              : [...prev, day.value]
                          );
                        }}
                        data-testid={`badge-day-${day.value}`}
                      >
                        {day.label}
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recipientGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all_active">Todos ativos</SelectItem>
                          <SelectItem value="inactive_30d">Inativos 30+ dias</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in_app">No App</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isCreating} data-testid="button-create-recurring">
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Repeat className="w-4 h-4 mr-2" />
                    Criar Notificacao Recorrente
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Notificacoes Recorrentes</CardTitle>
          <CardDescription>Configuracoes de envio automatico ativas</CardDescription>
        </CardHeader>
        <CardContent>
          <RecurringNotificationsList />
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationHistory() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/notifications"],
    queryFn: () => notificationService.getAll(),
  });

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Nenhuma notificacao enviada ainda</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-3">
        {notifications.slice(0, 10).map((notif) => {
          const StatusIcon = statusIcons[notif.status] || Bell;
          const ChannelIcon = channelIcons[notif.channel] || Bell;
          return (
            <div key={notif.id} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-sm">{notif.title}</h4>
                <Badge variant="outline" className="text-xs shrink-0">
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusLabels[notif.status]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{notif.message}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ChannelIcon className="w-3 h-3" />
                  {channelLabels[notif.channel]}
                </span>
                {notif.sentAt && (
                  <span>{format(new Date(notif.sentAt), "dd/MM HH:mm", { locale: ptBR })}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function ScheduledNotificationsList() {
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/notifications/scheduled"],
    queryFn: () => notificationService.getScheduled(),
  });

  const handleCancel = async (id: string) => {
    await notificationService.cancel(id);
    queryClient.invalidateQueries({ queryKey: ["/notifications/scheduled"] });
    toast({ title: "Notificacao cancelada" });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  const pendingNotifs = notifications?.filter((n) => n.status === "pending") || [];

  if (pendingNotifs.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Nenhuma notificacao agendada</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-3">
        {pendingNotifs.map((notif) => {
          const ChannelIcon = channelIcons[notif.channel] || Bell;
          return (
            <div key={notif.id} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-sm">{notif.title}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => handleCancel(notif.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{notif.message}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ChannelIcon className="w-3 h-3" />
                  {channelLabels[notif.channel]}
                </span>
                {notif.scheduledAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(notif.scheduledAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function RecurringNotificationsList() {
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/notifications/recurring"],
    queryFn: () => notificationService.getRecurring(),
  });

  const handlePause = async (id: string) => {
    await notificationService.pauseRecurring(id);
    queryClient.invalidateQueries({ queryKey: ["/notifications/recurring"] });
    toast({ title: "Notificacao pausada" });
  };

  const handleDelete = async (id: string) => {
    await notificationService.deleteRecurring(id);
    queryClient.invalidateQueries({ queryKey: ["/notifications/recurring"] });
    toast({ title: "Notificacao excluida" });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Repeat className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Nenhuma notificacao recorrente</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-3">
        {notifications.map((notif) => {
          const ChannelIcon = channelIcons[notif.channel] || Bell;
          const isActive = notif.status === "sent";
          return (
            <div key={notif.id} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-sm">{notif.title}</h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => handlePause(notif.id)}
                  >
                    {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(notif.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                  {isActive ? "Ativo" : "Pausado"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {frequencyLabels[notif.recurringFrequency || "weekly"]}
                </Badge>
                {notif.recurringTime && (
                  <Badge variant="outline" className="text-xs">
                    {notif.recurringTime}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ChannelIcon className="w-3 h-3" />
                  {channelLabels[notif.channel]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default function NotificationsPage() {
  const stats = notificationService.getStats();

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Notificacoes</h1>
          <p className="text-muted-foreground">
            Comunique-se com seus alunos de forma eficiente.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.sentToday}</p>
                <p className="text-sm text-muted-foreground">Enviadas hoje</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-sm text-muted-foreground">Agendadas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="send-now" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="send-now" className="gap-2" data-testid="tab-send-now">
              <Send className="w-4 h-4" />
              Enviar Agora
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2" data-testid="tab-scheduled">
              <Clock className="w-4 h-4" />
              Agendadas
            </TabsTrigger>
            <TabsTrigger value="recurring" className="gap-2" data-testid="tab-recurring">
              <Repeat className="w-4 h-4" />
              Recorrentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send-now" className="fade-in">
            <SendNowTab />
          </TabsContent>
          <TabsContent value="scheduled" className="fade-in">
            <ScheduledTab />
          </TabsContent>
          <TabsContent value="recurring" className="fade-in">
            <RecurringTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
