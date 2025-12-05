import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/lib/auth";
import {
  Search,
  MapPin,
  Star,
  Filter,
  ArrowLeft,
  ChevronRight,
  Award,
  Clock,
} from "lucide-react";
import logoUrl from "@assets/Brickslogo_1764955332419.png";

interface PersonalProfile {
  id: string;
  bio: string | null;
  specialty: string | null;
  location: string | null;
  hourlyRate: number | null;
  experience: number | null;
  averageRating: string | null;
  totalRatings: number | null;
  isVerified: boolean | null;
  workModality: string | null;
  user: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
  studentCount?: number;
}

const SPECIALTIES = [
  "Musculação",
  "Crossfit",
  "Funcional",
  "Pilates",
  "Yoga",
  "Natação",
];

export default function MarketplacePage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const { data: personals, isLoading } = useQuery<PersonalProfile[]>({
    queryKey: ["/api/personals"],
  });

  const filteredPersonals = personals?.filter((personal) => {
    const matchesSearch =
      !searchQuery ||
      personal.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      personal.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      personal.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation =
      !selectedLocation ||
      selectedLocation === "all" ||
      personal.location?.toLowerCase().includes(selectedLocation.toLowerCase());
    
    const matchesSpecialty =
      !selectedSpecialty ||
      selectedSpecialty === "all" ||
      personal.specialty?.toLowerCase() === selectedSpecialty.toLowerCase();
    
    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  const locations = [...new Set(personals?.map((p) => p.location).filter(Boolean) || [])];

  const handleViewPersonal = (personalId: string) => {
    setLocation(`/personals/${personalId}`);
  };

  const getModalityLabel = (modality: string | null) => {
    switch (modality) {
      case "online":
        return "Online";
      case "presencial":
        return "Presencial";
      case "both":
        return "Presencial/Online";
      default:
        return null;
    }
  };

  const MainContent = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#f7f7f7]">
          Encontre seu <span className="text-[#b6ff00]">Personal</span>
        </h1>
        <p className="text-[#f7f7f7]/60">
          Explore profissionais qualificados e encontre o ideal para você.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f7f7f7]/40" />
          <Input
            placeholder="Buscar por nome, especialidade ou cidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#002c2b]/50 border-[#b6ff00]/20 text-[#f7f7f7] placeholder:text-[#f7f7f7]/40"
            data-testid="input-search"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48 bg-[#002c2b]/50 border-[#b6ff00]/20" data-testid="select-location">
              <MapPin className="w-4 h-4 mr-2 text-[#b6ff00]" />
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc || ""}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-44 bg-[#002c2b]/50 border-[#b6ff00]/20" data-testid="select-specialty">
              <Filter className="w-4 h-4 mr-2 text-[#b6ff00]" />
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {SPECIALTIES.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-[#002c2b]/50 border-[#b6ff00]/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full bg-[#002c2b]" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2 bg-[#002c2b]" />
                    <Skeleton className="h-4 w-24 bg-[#002c2b]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2 bg-[#002c2b]" />
                <Skeleton className="h-4 w-3/4 bg-[#002c2b]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPersonals && filteredPersonals.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonals.map((personal, index) => (
            <Card
              key={personal.id}
              className="bg-[#002c2b]/50 border-[#b6ff00]/10 hover-elevate cursor-pointer slide-up overflow-visible"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleViewPersonal(personal.id)}
              data-testid={`card-personal-${personal.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b6ff00] to-[#b6ff00]/50 flex items-center justify-center shrink-0 overflow-hidden">
                      {personal.user.photoUrl ? (
                        <img
                          src={personal.user.photoUrl}
                          alt={personal.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[#002c2b] font-bold text-xl">
                          {personal.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                    {personal.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#b6ff00] rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-[#002c2b]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate text-[#f7f7f7]">{personal.user.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#b6ff00] fill-[#b6ff00]" />
                        <span className="text-[#f7f7f7]">{parseFloat(personal.averageRating || "0").toFixed(1)}</span>
                      </div>
                      <span className="text-[#f7f7f7]/30">|</span>
                      <span className="text-[#f7f7f7]/60">{personal.totalRatings || 0} avaliações</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {personal.specialty && (
                    <Badge className="bg-[#b6ff00]/10 text-[#b6ff00] border-[#b6ff00]/20">
                      {personal.specialty}
                    </Badge>
                  )}
                  {personal.workModality && (
                    <Badge variant="outline" className="text-[#f7f7f7]/60 border-[#f7f7f7]/20">
                      {getModalityLabel(personal.workModality)}
                    </Badge>
                  )}
                </div>

                {personal.location && (
                  <div className="flex items-center gap-2 text-sm text-[#f7f7f7]/60 mb-3">
                    <MapPin className="w-4 h-4 text-[#b6ff00]/50" />
                    <span>{personal.location}</span>
                  </div>
                )}

                {personal.experience && (
                  <div className="flex items-center gap-2 text-sm text-[#f7f7f7]/60 mb-3">
                    <Clock className="w-4 h-4 text-[#b6ff00]/50" />
                    <span>{personal.experience} anos de experiência</span>
                  </div>
                )}

                {personal.bio && (
                  <p className="text-sm text-[#f7f7f7]/50 line-clamp-2 mb-4">
                    {personal.bio}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#b6ff00]/10">
                  {personal.hourlyRate && (
                    <span className="text-lg font-semibold text-[#b6ff00]">
                      R$ {personal.hourlyRate}/hora
                    </span>
                  )}
                  <Button size="sm" variant="ghost" className="ml-auto text-[#f7f7f7]/70 hover:text-[#b6ff00]">
                    Ver perfil
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-[#f7f7f7]/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-[#f7f7f7]">Nenhum personal encontrado</h3>
          <p className="text-[#f7f7f7]/60 mb-6">
            Tente ajustar os filtros ou buscar por outro termo.
          </p>
          <Button
            variant="outline"
            className="border-[#b6ff00]/20 text-[#f7f7f7]"
            onClick={() => {
              setSearchQuery("");
              setSelectedLocation("");
              setSelectedSpecialty("");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );

  if (isAuthenticated) {
    return (
      <AppLayout>
        <MainContent />
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-[#b6ff00]/10 bg-[#002c2b]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]/70" data-testid="link-back">
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
              <Button variant="ghost" size="sm" className="text-[#f7f7f7]" data-testid="link-login">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="neon-glow-hover" data-testid="link-register">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <MainContent />
    </div>
  );
}
