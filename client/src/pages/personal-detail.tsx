import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PersonalWithDetails, Review, PersonalService, PersonalExperienceItem } from "@shared/schema";
import {
  ArrowLeft,
  Star,
  MapPin,
  Dumbbell,
  Clock,
  Award,
  Briefcase,
  MessageSquare,
  Phone,
  Mail,
  Check,
  Loader2,
  Quote,
  Calendar,
  User,
} from "lucide-react";
import logoUrl from "@assets/Brickslogo_1764955332419.png";

interface PersonalDetailPageProps {
  id: string;
}

export default function PersonalDetailPage({ id }: PersonalDetailPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: "",
    contactPreference: "whatsapp",
  });

  const { data: personal, isLoading } = useQuery<PersonalWithDetails>({
    queryKey: ["/api/personals", id, "details"],
  });

  const quoteMutation = useMutation({
    mutationFn: async (data: typeof quoteForm) => {
      const response = await apiRequest("POST", "/api/quotes", {
        personalId: id,
        ...data,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Solicitação enviada!",
        description: "O personal entrará em contato em breve.",
      });
      setIsQuoteDialogOpen(false);
      setQuoteForm({
        name: "",
        email: "",
        whatsapp: "",
        message: "",
        contactPreference: "whatsapp",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.email || !quoteForm.whatsapp || !quoteForm.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    quoteMutation.mutate(quoteForm);
  };

  const getModalityLabel = (modality: string | null) => {
    switch (modality) {
      case "online": return "Online";
      case "presencial": return "Presencial";
      case "both": return "Presencial e Online";
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-[#b6ff00]/10 bg-[#002c2b]/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-16 flex items-center gap-4">
            <Link href="/personals">
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]/70">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Link href="/">
              <img src={logoUrl} alt="Bricks" className="h-7 w-auto" />
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Skeleton className="w-28 h-28 rounded-xl bg-[#002c2b]" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-7 w-48 bg-[#002c2b]" />
                      <Skeleton className="h-5 w-32 bg-[#002c2b]" />
                      <Skeleton className="h-4 w-40 bg-[#002c2b]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Skeleton className="h-64 bg-[#002c2b]" />
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
          <h1 className="text-2xl font-bold mb-4 text-[#f7f7f7]">Personal não encontrado</h1>
          <Link href="/personals">
            <Button>Voltar ao Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-[#b6ff00]/10 bg-[#002c2b]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/personals">
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]/70" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Link href="/">
              <img src={logoUrl} alt="Bricks" className="h-7 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="neon-glow-hover">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10 fade-in overflow-visible">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-[#b6ff00] to-[#b6ff00]/50 flex items-center justify-center shrink-0 overflow-hidden">
                      {personal.user.photoUrl ? (
                        <img
                          src={personal.user.photoUrl}
                          alt={personal.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#002c2b] font-bold text-3xl">
                          {personal.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      )}
                    </div>
                    {personal.isVerified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#b6ff00] rounded-full flex items-center justify-center shadow-lg">
                        <Award className="w-4 h-4 text-[#002c2b]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h1 className="text-2xl font-bold mb-1 text-[#f7f7f7]" data-testid="text-personal-name">
                          {personal.user.name}
                        </h1>
                        {personal.specialty && (
                          <Badge className="bg-[#b6ff00]/10 text-[#b6ff00] border-[#b6ff00]/20 mb-2">
                            {personal.specialty}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-[#001a1a] px-3 py-2 rounded-lg">
                        <Star className="w-5 h-5 text-[#b6ff00] fill-[#b6ff00]" />
                        <span className="text-xl font-bold text-[#f7f7f7]">
                          {Number(personal.averageRating || 0).toFixed(1)}
                        </span>
                        <span className="text-sm text-[#f7f7f7]/50 ml-1">
                          ({personal.totalRatings || 0})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[#f7f7f7]/60 mt-3">
                      {personal.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-[#b6ff00]/50" />
                          <span className="text-sm">{personal.location}</span>
                        </div>
                      )}
                      {personal.experience && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#b6ff00]/50" />
                          <span className="text-sm">{personal.experience} anos</span>
                        </div>
                      )}
                      {personal.workModality && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-[#b6ff00]/50" />
                          <span className="text-sm">{getModalityLabel(personal.workModality)}</span>
                        </div>
                      )}
                    </div>

                    {personal.hourlyRate && (
                      <p className="text-2xl font-bold text-[#b6ff00] mt-4">
                        R$ {personal.hourlyRate}
                        <span className="text-sm text-[#f7f7f7]/40 font-normal">/hora</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {personal.bio && (
              <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10 fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#f7f7f7] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#b6ff00]" />
                    Sobre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#f7f7f7]/70 whitespace-pre-line leading-relaxed">{personal.bio}</p>
                </CardContent>
              </Card>
            )}

            {personal.certifications && personal.certifications.length > 0 && (
              <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10 fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#f7f7f7] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#b6ff00]" />
                    Certificações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {personal.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-sm border-[#b6ff00]/20 text-[#f7f7f7]/70">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {personal.services && personal.services.length > 0 && (
              <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10 fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#f7f7f7] flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-[#b6ff00]" />
                    Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {personal.services.map((service: PersonalService) => (
                      <div key={service.id} className="flex items-start justify-between gap-4 p-4 bg-[#001a1a]/50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-[#f7f7f7]">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-[#f7f7f7]/50 mt-1">{service.description}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-[#b6ff00]">R$ {service.price}</p>
                          <p className="text-xs text-[#f7f7f7]/40">
                            {service.priceType === "monthly" && "/mês"}
                            {service.priceType === "per_session" && "/sessão"}
                            {service.priceType === "package" && "/pacote"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {personal.experience && personal.experience.length > 0 && (
              <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10 fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#f7f7f7] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#b6ff00]" />
                    Experiência Profissional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(personal.experience as PersonalExperienceItem[]).map((exp) => (
                      <div key={exp.id} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#b6ff00] mt-2 shrink-0" />
                        <div>
                          <h4 className="font-medium text-[#f7f7f7]">{exp.title}</h4>
                          <p className="text-sm text-[#b6ff00]/70">{exp.company}</p>
                          <p className="text-xs text-[#f7f7f7]/40 mt-1">
                            {exp.startYear} - {exp.current ? "Atual" : exp.endYear}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-[#f7f7f7]/50 mt-2">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {personal.reviews && personal.reviews.length > 0 && (
              <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10 fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#f7f7f7] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#b6ff00]" />
                    Avaliações ({personal.reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personal.reviews.slice(0, 5).map((review: Review) => (
                      <div key={review.id} className="p-4 bg-[#001a1a]/50 rounded-lg">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#b6ff00]/10 flex items-center justify-center">
                              <span className="text-[#b6ff00] font-medium text-sm">
                                {review.studentName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AN"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-[#f7f7f7]">{review.studentName || "Anônimo"}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating ? "text-[#b6ff00] fill-[#b6ff00]" : "text-[#f7f7f7]/20"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-[#f7f7f7]/60 text-sm pl-13">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#b6ff00]/10 to-[#002c2b] border-[#b6ff00]/20 fade-in sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[#f7f7f7] flex items-center gap-2">
                  <Quote className="w-5 h-5 text-[#b6ff00]" />
                  Solicitar Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#f7f7f7]/60 mb-4">
                  Entre em contato para saber mais sobre os serviços e valores personalizados.
                </p>
                <Button
                  className="w-full neon-glow neon-glow-hover"
                  size="lg"
                  onClick={() => setIsQuoteDialogOpen(true)}
                  data-testid="button-request-quote"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Pedir Orçamento
                </Button>

                <div className="mt-6 pt-4 border-t border-[#b6ff00]/10">
                  <h4 className="text-sm font-medium text-[#f7f7f7]/70 mb-3">Informações</h4>
                  <div className="space-y-3 text-sm">
                    {personal.location && (
                      <div className="flex items-center gap-2 text-[#f7f7f7]/60">
                        <MapPin className="w-4 h-4 text-[#b6ff00]/50" />
                        <span>{personal.location}</span>
                      </div>
                    )}
                    {personal.workModality && (
                      <div className="flex items-center gap-2 text-[#f7f7f7]/60">
                        <Calendar className="w-4 h-4 text-[#b6ff00]/50" />
                        <span>{getModalityLabel(personal.workModality)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#002c2b] border-[#b6ff00]/20">
          <DialogHeader>
            <DialogTitle className="text-[#f7f7f7]">Solicitar Orçamento</DialogTitle>
            <DialogDescription className="text-[#f7f7f7]/60">
              Preencha seus dados para que {personal?.user.name} entre em contato.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-[#f7f7f7]/80">Nome completo</Label>
              <Input
                placeholder="Seu nome"
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                className="bg-[#001a1a] border-[#b6ff00]/20 text-[#f7f7f7]"
                data-testid="input-quote-name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#f7f7f7]/80">E-mail</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={quoteForm.email}
                onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                className="bg-[#001a1a] border-[#b6ff00]/20 text-[#f7f7f7]"
                data-testid="input-quote-email"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#f7f7f7]/80">WhatsApp</Label>
              <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={quoteForm.whatsapp}
                onChange={(e) => setQuoteForm({ ...quoteForm, whatsapp: e.target.value })}
                className="bg-[#001a1a] border-[#b6ff00]/20 text-[#f7f7f7]"
                data-testid="input-quote-whatsapp"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#f7f7f7]/80">Mensagem</Label>
              <Textarea
                placeholder="Conte um pouco sobre seus objetivos e interesses..."
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                className="bg-[#001a1a] border-[#b6ff00]/20 text-[#f7f7f7] min-h-24"
                data-testid="input-quote-message"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#f7f7f7]/80">Prefiro ser contatado por</Label>
              <Select
                value={quoteForm.contactPreference}
                onValueChange={(value) => setQuoteForm({ ...quoteForm, contactPreference: value })}
              >
                <SelectTrigger className="bg-[#001a1a] border-[#b6ff00]/20" data-testid="select-contact-preference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full neon-glow-hover"
              disabled={quoteMutation.isPending}
              data-testid="button-submit-quote"
            >
              {quoteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Enviar Solicitação
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
