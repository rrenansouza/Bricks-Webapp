import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { AppLayout } from "@/components/layout/app-layout";
import { eventsService } from "@/lib/mockServices";
import type { BricksEvent } from "@shared/schema";
import {
  Calendar,
  MapPin,
  Ticket,
  Tag,
  ChevronRight,
  Trophy,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const eventTypeIcons: Record<string, typeof Trophy> = {
  "Corrida de rua": Trophy,
  "Trail Run": Trophy,
  "Workshop": Users,
  "Triathlon": Trophy,
  "Night Run": Trophy,
};

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<BricksEvent | null>(null);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events", cityFilter, typeFilter],
    queryFn: () => eventsService.getAll({
      city: cityFilter !== "all" ? cityFilter : undefined,
      type: typeFilter !== "all" ? typeFilter : undefined,
    }),
  });

  const cities = ["Sao Paulo", "Florianopolis", "Belo Horizonte", "Rio de Janeiro", "Curitiba"];
  const eventTypes = ["Corrida de rua", "Trail Run", "Workshop", "Triathlon", "Night Run"];

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Eventos</h1>
          <p className="text-muted-foreground">
            Descubra eventos esportivos com descontos exclusivos Bricks.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-event-city">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-event-type">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card border-border/50 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const Icon = eventTypeIcons[event.eventType] || Trophy;
              return (
                <Card
                  key={event.id}
                  className="bg-card border-border/50 hover-elevate cursor-pointer slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedEvent(event)}
                  data-testid={`card-event-${event.id}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {event.hasBricksDiscount && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        Desconto Bricks
                      </Badge>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-lg text-white line-clamp-2">{event.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {event.eventType}
                      </Badge>
                      {event.distance && (
                        <Badge variant="secondary" className="text-xs">
                          {event.distance}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.date), "dd 'de' MMMM", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.city}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between gap-4">
                    <div>
                      {event.hasBricksDiscount && event.bricksPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            R$ {event.bricksPrice}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {event.normalPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">R$ {event.normalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" variant="ghost">
                      Ver mais
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros para ver mais eventos.
            </p>
          </div>
        )}

        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            {selectedEvent && (
              <>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedEvent.eventType}</Badge>
                      {selectedEvent.distance && (
                        <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                          {selectedEvent.distance}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <p className="text-muted-foreground">{selectedEvent.description}</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Data</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedEvent.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Local</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.location}, {selectedEvent.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedEvent.categories && selectedEvent.categories.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Categorias</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.categories.map((cat) => (
                          <Badge key={cat} variant="outline">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEvent.benefits && selectedEvent.benefits.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Beneficios Bricks</h4>
                      <div className="space-y-2">
                        {selectedEvent.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div>
                      {selectedEvent.hasBricksDiscount && selectedEvent.bricksPrice ? (
                        <>
                          <p className="text-sm text-muted-foreground">Preco Bricks</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              R$ {selectedEvent.bricksPrice}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {selectedEvent.normalPrice}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">Preco</p>
                          <span className="text-2xl font-bold">R$ {selectedEvent.normalPrice}</span>
                        </>
                      )}
                    </div>
                    <Button data-testid="button-register-event">
                      <Ticket className="w-4 h-4 mr-2" />
                      Inscrever-se
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
