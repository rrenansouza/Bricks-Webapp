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
  Users,
  Filter,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

interface PersonalProfile {
  id: string;
  bio: string | null;
  specialties: string[] | null;
  city: string | null;
  neighborhood: string | null;
  averagePrice: string | null;
  averageRating: string | null;
  totalRatings: number | null;
  user: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
  studentCount: number;
}

const SPECIALTIES = [
  "Musculação",
  "Crossfit",
  "Funcional",
  "Pilates",
  "Yoga",
  "Cardio",
  "HIIT",
  "Emagrecimento",
  "Hipertrofia",
  "Reabilitação",
];

export default function MarketplacePage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const { data: personals, isLoading } = useQuery<PersonalProfile[]>({
    queryKey: ["/api/personals", { city: selectedCity, specialty: selectedSpecialty }],
  });

  const filteredPersonals = personals?.filter((personal) => {
    const matchesSearch =
      !searchQuery ||
      personal.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      personal.specialties?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const cities = [...new Set(personals?.map((p) => p.city).filter(Boolean) || [])];

  const handleViewPersonal = (personalId: string) => {
    setLocation(`/personals/${personalId}`);
  };

  const MainContent = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Encontre seu <span className="text-primary">Personal</span>
        </h1>
        <p className="text-muted-foreground">
          Explore profissionais qualificados e encontre o ideal para você.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 fade-in">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou especialidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-40" data-testid="select-city">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city || ""}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-44" data-testid="select-specialty">
              <Filter className="w-4 h-4 mr-2" />
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
            <Card key={i} className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPersonals && filteredPersonals.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonals.map((personal, index) => (
            <Card
              key={personal.id}
              className="bg-card border-border/50 hover-elevate cursor-pointer slide-up overflow-visible"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleViewPersonal(personal.id)}
              data-testid={`card-personal-${personal.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shrink-0">
                    {personal.user.photoUrl ? (
                      <img
                        src={personal.user.photoUrl}
                        alt={personal.user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-foreground font-bold text-xl">
                        {personal.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{personal.user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span>{parseFloat(personal.averageRating || "0").toFixed(1)}</span>
                      </div>
                      <span className="text-muted-foreground/50">•</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{personal.studentCount} alunos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {personal.city && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {personal.city}
                      {personal.neighborhood && `, ${personal.neighborhood}`}
                    </span>
                  </div>
                )}

                {personal.specialties && personal.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {personal.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {personal.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{personal.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {personal.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {personal.bio}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {personal.averagePrice && (
                    <span className="text-lg font-semibold text-primary">
                      R$ {parseFloat(personal.averagePrice).toFixed(0)}/mês
                    </span>
                  )}
                  <Button size="sm" variant="ghost" className="ml-auto">
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
          <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum personal encontrado</h3>
          <p className="text-muted-foreground mb-6">
            Tente ajustar os filtros ou buscar por outro termo.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("");
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
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="link-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Bricks</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" data-testid="link-login">
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
