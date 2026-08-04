import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type {
  PersonalWithDetails,
  Review,
  PersonalService,
  PersonalExperienceItem,
  PersonalGalleryItem,
} from "@shared/schema";
import {
  ArrowLeft,
  Star,
  MapPin,
  Dumbbell,
  Clock,
  Award,
  Briefcase,
  MessageSquare,
  Check,
  Loader2,
  Calendar,
  User,
  Image,
  Play,
  Users,
  ChevronRight,
} from "lucide-react";
import logoUrl from "@assets/Brickslogo_1764955332419.png";

interface PersonalDetailPageProps {
  id: string;
}

export default function PersonalDetailPage({ id }: PersonalDetailPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"sobre" | "galeria" | "avaliacoes" | "servicos">("sobre");
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: "",
    contactPreference: "whatsapp",
  });

  const { data: personal, isLoading } = useQuery<PersonalWithDetails>({
    queryKey: [`/api/personals/${id}/details`],
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
      setQuoteForm({ name: "", email: "", whatsapp: "", message: "", contactPreference: "whatsapp" });
    },
    onError: () => {
      toast({ title: "Erro ao enviar", description: "Tente novamente.", variant: "destructive" });
    },
  });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.email || !quoteForm.whatsapp || !quoteForm.message) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }
    quoteMutation.mutate(quoteForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-[#b6ff00]/10 bg-[#002c2b]/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-16 flex items-center gap-4">
            <Link href="/personals">
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]/70">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            </Link>
            <Link href="/"><img src={logoUrl} alt="Bricks" className="h-7 w-auto" /></Link>
          </div>
        </header>
        <div className="h-40 bg-gradient-to-r from-[#001a1a] to-[#003030] animate-pulse" />
        <div className="container mx-auto px-4 max-w-5xl -mt-12">
          <Skeleton className="w-24 h-24 rounded-full bg-[#002c2b] border-4 border-background" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-8 w-64 bg-[#002c2b]" />
            <Skeleton className="h-5 w-40 bg-[#002c2b]" />
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
          <Link href="/personals"><Button>Voltar ao Marketplace</Button></Link>
        </div>
      </div>
    );
  }

  // Computed values from correct schema fields
  const location = [personal.city, personal.neighborhood].filter(Boolean).join(", ");
  const primarySpecialty = personal.specialties?.[0];
  const currentYear = new Date().getFullYear();
  const experienceItems = personal.experience as PersonalExperienceItem[] | undefined;
  const experienceYears = experienceItems && experienceItems.length > 0
    ? currentYear - Math.min(...experienceItems.map((e) => e.startYear))
    : null;
  const galleryItems = personal.gallery as PersonalGalleryItem[] | undefined;
  const averageRating = Number(personal.averageRating || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#b6ff00]/10 bg-[#002c2b]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/personals">
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]/70" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            </Link>
            <Link href="/"><img src={logoUrl} alt="Bricks" className="h-7 w-auto" /></Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="neon-glow-hover">Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Cover Banner */}
      <div
        className="h-44 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001a1a 0%, #002c2b 40%, #003d3c 70%, #001a1a 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 50%, #b6ff00 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00b8d4 0%, transparent 40%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile identity section */}
        <div className="relative -mt-14 mb-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full border-4 border-background bg-gradient-to-br from-[#b6ff00] to-[#b6ff00]/50 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
            {personal.user.photoUrl ? (
              <img src={personal.user.photoUrl} alt={personal.user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#002c2b] font-bold text-3xl">
                {personal.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            )}
          </div>

          {/* Name + specialty + action */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1">
            <div>
              <h1 className="text-2xl font-bold text-[#f7f7f7]" data-testid="text-personal-name">
                {personal.user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {primarySpecialty && (
                  <Badge className="bg-[#b6ff00]/10 text-[#b6ff00] border-[#b6ff00]/20">
                    <Dumbbell className="w-3 h-3 mr-1" />
                    {primarySpecialty}
                  </Badge>
                )}
                {personal.cref && (
                  <Badge variant="outline" className="border-[#b6ff00]/20 text-[#f7f7f7]/60 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    CREF {personal.cref}
                  </Badge>
                )}
              </div>
              {location && (
                <div className="flex items-center gap-1 mt-2 text-[#f7f7f7]/50 text-sm">
                  <MapPin className="w-4 h-4 text-[#b6ff00]/50" />
                  {location}
                </div>
              )}
            </div>

            <Button
              className="neon-glow-hover sm:self-start"
              onClick={() => setIsQuoteDialogOpen(true)}
              data-testid="button-quote"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Solicitar Contato
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 bg-[#002c2b]/40 border border-[#b6ff00]/10 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-[#b6ff00] fill-[#b6ff00]" />
              <span className="text-xl font-bold text-[#f7f7f7]">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-[#f7f7f7]/40">{personal.totalRatings || 0} avaliações</p>
          </div>
          <div className="p-4 bg-[#002c2b]/40 border border-[#b6ff00]/10 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-[#b6ff00]" />
              <span className="text-xl font-bold text-[#f7f7f7]">{personal.studentCount || 0}</span>
            </div>
            <p className="text-xs text-[#f7f7f7]/40">alunos</p>
          </div>
          <div className="p-4 bg-[#002c2b]/40 border border-[#b6ff00]/10 rounded-xl text-center">
            {personal.averagePrice ? (
              <>
                <div className="text-xl font-bold text-[#b6ff00]">R$ {personal.averagePrice}</div>
                <p className="text-xs text-[#f7f7f7]/40">/mês médio</p>
              </>
            ) : experienceYears ? (
              <>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-[#b6ff00]" />
                  <span className="text-xl font-bold text-[#f7f7f7]">{experienceYears}</span>
                </div>
                <p className="text-xs text-[#f7f7f7]/40">anos exp.</p>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-[#f7f7f7]">—</div>
                <p className="text-xs text-[#f7f7f7]/40">preço</p>
              </>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#b6ff00]/10 mb-6 overflow-x-auto">
          {[
            { key: "sobre", label: "Sobre" },
            { key: "galeria", label: "Galeria", count: galleryItems?.length },
            { key: "avaliacoes", label: "Avaliações", count: personal.reviews?.length },
            { key: "servicos", label: "Serviços", count: personal.services?.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors shrink-0 ${
                activeTab === tab.key
                  ? "border-[#b6ff00] text-[#b6ff00]"
                  : "border-transparent text-[#f7f7f7]/50 hover:text-[#f7f7f7]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 text-xs bg-[#b6ff00]/10 text-[#b6ff00] px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pb-12">
          {/* Main content */}
          <div className="lg:col-span-2">

            {/* SOBRE tab */}
            {activeTab === "sobre" && (
              <div className="space-y-6 fade-in">
                {personal.bio && (
                  <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10">
                    <CardContent className="p-6">
                      <h2 className="text-base font-semibold text-[#f7f7f7] mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#b6ff00]" />
                        Sobre mim
                      </h2>
                      <p className="text-[#f7f7f7]/70 whitespace-pre-line leading-relaxed">{personal.bio}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Specialties */}
                {personal.specialties && personal.specialties.length > 0 && (
                  <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10">
                    <CardContent className="p-6">
                      <h2 className="text-base font-semibold text-[#f7f7f7] mb-3 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-[#b6ff00]" />
                        Especialidades
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {personal.specialties.map((spec, i) => (
                          <Badge
                            key={i}
                            className="bg-[#b6ff00]/10 text-[#b6ff00] border-[#b6ff00]/20"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Experience timeline */}
                {experienceItems && experienceItems.length > 0 && (
                  <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10">
                    <CardContent className="p-6">
                      <h2 className="text-base font-semibold text-[#f7f7f7] mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#b6ff00]" />
                        Experiência
                      </h2>
                      <div className="space-y-4">
                        {experienceItems.map((exp, idx) => (
                          <div key={exp.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-[#b6ff00] mt-1.5 shrink-0" />
                              {idx < experienceItems.length - 1 && (
                                <div className="w-px flex-1 bg-[#b6ff00]/20 mt-1" />
                              )}
                            </div>
                            <div className="pb-4">
                              <h3 className="font-medium text-[#f7f7f7]">{exp.title}</h3>
                              <p className="text-sm text-[#b6ff00]/70">{exp.company}</p>
                              <p className="text-xs text-[#f7f7f7]/40 mt-0.5">
                                {exp.startYear} – {exp.current ? "Atual" : exp.endYear}
                              </p>
                              {exp.description && (
                                <p className="text-sm text-[#f7f7f7]/50 mt-1 leading-relaxed">{exp.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* GALERIA tab */}
            {activeTab === "galeria" && (
              <div className="fade-in">
                {galleryItems && galleryItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square bg-[#002c2b]/50 border border-[#b6ff00]/10 rounded-sm overflow-hidden relative group cursor-pointer"
                      >
                        {item.mediaType === "video" ? (
                          <>
                            <div className="w-full h-full bg-[#001a1a] flex items-center justify-center">
                              <Play className="w-8 h-8 text-[#b6ff00]/60" />
                            </div>
                            <div className="absolute bottom-1 left-1">
                              <Play className="w-3 h-3 text-white" />
                            </div>
                          </>
                        ) : (
                          <img
                            src={item.mediaUrl}
                            alt={item.caption || "Galeria"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23002c2b'/%3E%3C/svg%3E";
                            }}
                          />
                        )}
                        {item.caption && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <p className="text-white text-xs line-clamp-2">{item.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <Image className="w-12 h-12 text-[#f7f7f7]/20 mx-auto mb-3" />
                    <p className="text-[#f7f7f7]/40">Nenhuma foto ou vídeo na galeria</p>
                  </div>
                )}
              </div>
            )}

            {/* AVALIAÇÕES tab */}
            {activeTab === "avaliacoes" && (
              <div className="fade-in space-y-4">
                {/* Rating summary */}
                {personal.reviews && personal.reviews.length > 0 && (
                  <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-[#f7f7f7]">{averageRating.toFixed(1)}</div>
                          <div className="flex justify-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-[#b6ff00] fill-[#b6ff00]" : "text-[#f7f7f7]/20"}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-[#f7f7f7]/40 mt-1">{personal.totalRatings || 0} avaliações</p>
                        </div>
                        {/* Rating bars */}
                        <div className="flex-1 space-y-1">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = personal.reviews?.filter((r: Review) => r.rating === star).length || 0;
                            const pct = personal.reviews?.length ? (count / personal.reviews.length) * 100 : 0;
                            return (
                              <div key={star} className="flex items-center gap-2 text-xs">
                                <span className="w-3 text-[#f7f7f7]/40">{star}</span>
                                <div className="flex-1 h-1.5 bg-[#f7f7f7]/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#b6ff00] rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-4 text-[#f7f7f7]/40">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {personal.reviews && personal.reviews.length > 0 ? (
                  personal.reviews.map((review: Review) => (
                    <Card key={review.id} className="bg-[#002c2b]/50 border-[#b6ff00]/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#b6ff00]/10 flex items-center justify-center shrink-0">
                            <span className="text-[#b6ff00] font-medium text-sm">
                              {review.studentName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AN"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-[#f7f7f7]">{review.studentName || "Anônimo"}</p>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-[#b6ff00] fill-[#b6ff00]" : "text-[#f7f7f7]/20"}`} />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-[#f7f7f7]/60 text-sm mt-1 leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <MessageSquare className="w-12 h-12 text-[#f7f7f7]/20 mx-auto mb-3" />
                    <p className="text-[#f7f7f7]/40">Sem avaliações ainda</p>
                  </div>
                )}
              </div>
            )}

            {/* SERVIÇOS tab */}
            {activeTab === "servicos" && (
              <div className="fade-in space-y-3">
                {personal.services && personal.services.length > 0 ? (
                  personal.services.map((service: PersonalService) => (
                    <Card key={service.id} className="bg-[#002c2b]/50 border-[#b6ff00]/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-[#f7f7f7]">{service.name}</h3>
                            {service.description && (
                              <p className="text-sm text-[#f7f7f7]/50 mt-1">{service.description}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-[#b6ff00]">R$ {service.price}</p>
                            <p className="text-xs text-[#f7f7f7]/40">
                              {service.priceType === "monthly" && "/mês"}
                              {service.priceType === "per_session" && "/sessão"}
                              {service.priceType === "package" && "/pacote"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <Dumbbell className="w-12 h-12 text-[#f7f7f7]/20 mx-auto mb-3" />
                    <p className="text-[#f7f7f7]/40">Nenhum serviço cadastrado</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick stats card */}
            <Card className="bg-[#002c2b]/50 border-[#b6ff00]/10 sticky top-20">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-[#f7f7f7]">Interessado?</h3>
                <p className="text-sm text-[#f7f7f7]/50 leading-relaxed">
                  Entre em contato com {personal.user.name.split(" ")[0]} e saiba mais sobre seus serviços.
                </p>

                <Button
                  className="w-full neon-glow-hover"
                  onClick={() => setIsQuoteDialogOpen(true)}
                  data-testid="button-quote-sidebar"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Solicitar Contato
                </Button>

                <Link href="/register">
                  <Button variant="outline" className="w-full border-[#b6ff00]/20 text-[#f7f7f7]/70 hover:text-[#f7f7f7]">
                    Criar conta grátis
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                {/* Divider */}
                <div className="border-t border-[#b6ff00]/10 pt-4 space-y-2">
                  {location && (
                    <div className="flex items-center gap-2 text-sm text-[#f7f7f7]/50">
                      <MapPin className="w-4 h-4 text-[#b6ff00]/40 shrink-0" />
                      {location}
                    </div>
                  )}
                  {personal.cref && (
                    <div className="flex items-center gap-2 text-sm text-[#f7f7f7]/50">
                      <Award className="w-4 h-4 text-[#b6ff00]/40 shrink-0" />
                      CREF {personal.cref}
                    </div>
                  )}
                  {experienceYears && (
                    <div className="flex items-center gap-2 text-sm text-[#f7f7f7]/50">
                      <Clock className="w-4 h-4 text-[#b6ff00]/40 shrink-0" />
                      {experienceYears} anos de experiência
                    </div>
                  )}
                  {personal.specialties && personal.specialties.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#f7f7f7]/50">
                      <Dumbbell className="w-4 h-4 text-[#b6ff00]/40 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quote Request Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solicitar Contato</DialogTitle>
            <DialogDescription>
              Envie seus dados para {personal.user.name} entrar em contato.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="q-name">Nome completo</Label>
              <Input
                id="q-name"
                placeholder="Seu nome"
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                data-testid="input-quote-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-email">E-mail</Label>
              <Input
                id="q-email"
                type="email"
                placeholder="seu@email.com"
                value={quoteForm.email}
                onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                data-testid="input-quote-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-whatsapp">WhatsApp</Label>
              <Input
                id="q-whatsapp"
                placeholder="(11) 99999-9999"
                value={quoteForm.whatsapp}
                onChange={(e) => setQuoteForm({ ...quoteForm, whatsapp: e.target.value })}
                data-testid="input-quote-whatsapp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-message">Mensagem</Label>
              <Textarea
                id="q-message"
                placeholder="Conte um pouco sobre seus objetivos..."
                rows={3}
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                data-testid="input-quote-message"
              />
            </div>
            <div className="space-y-2">
              <Label>Preferência de contato</Label>
              <Select
                value={quoteForm.contactPreference}
                onValueChange={(v) => setQuoteForm({ ...quoteForm, contactPreference: v })}
              >
                <SelectTrigger data-testid="select-contact-pref">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={quoteMutation.isPending} data-testid="button-submit-quote">
                {quoteMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                ) : (
                  <><Check className="w-4 h-4 mr-2" /> Enviar</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
