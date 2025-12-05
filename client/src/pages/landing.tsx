import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Dumbbell, Users, Calendar, Star, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Bricks</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" data-testid="link-login">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="neon-glow-hover" data-testid="link-register">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-gradient pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">Conecte-se.</span>{" "}
              <span className="text-primary text-neon-glow">Treine.</span>{" "}
              <span className="text-foreground">Transforme.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A plataforma que conecta personal trainers e alunos. 
              Gerencie treinos, agende aulas e acompanhe seu progresso em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 neon-glow neon-glow-hover" data-testid="button-hero-start">
                  Comece Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/personals">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8" data-testid="button-hero-marketplace">
                  Explorar Personais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Como Funciona
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Três passos simples para transformar sua jornada fitness
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="slide-up bg-card border-border/50 hover-elevate" style={{ animationDelay: "0ms" }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Encontre seu Personal</h3>
                <p className="text-muted-foreground">
                  Explore nosso marketplace e encontre o profissional ideal para seus objetivos.
                </p>
              </CardContent>
            </Card>

            <Card className="slide-up bg-card border-border/50 hover-elevate" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Agende suas Aulas</h3>
                <p className="text-muted-foreground">
                  Veja a disponibilidade do personal e agende seus treinos em poucos cliques.
                </p>
              </CardContent>
            </Card>

            <Card className="slide-up bg-card border-border/50 hover-elevate" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Treine e Evolua</h3>
                <p className="text-muted-foreground">
                  Receba treinos personalizados e acompanhe seu progresso em tempo real.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in">
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                  Para Personal Trainers
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
                  Gerencie seus alunos com eficiência
                </h2>
                <ul className="space-y-4">
                  {[
                    "Crie e organize treinos personalizados",
                    "Controle sua agenda e disponibilidade",
                    "Acompanhe o progresso de cada aluno",
                    "Receba feedbacks e melhore seus serviços",
                    "Gerencie planos e pagamentos",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="mt-8" data-testid="button-personal-cta">
                    Cadastrar como Personal
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="fade-in">
                <Card className="bg-card border-border/50 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Dashboard Completo</h4>
                      <p className="text-sm text-muted-foreground">Tudo em um só lugar</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-primary rounded-full" />
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-primary/70 rounded-full" />
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary/50 rounded-full" />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">24</p>
                      <p className="text-xs text-muted-foreground">Alunos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">48</p>
                      <p className="text-xs text-muted-foreground">Treinos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">4.9</p>
                      <p className="text-xs text-muted-foreground">Avaliação</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 fade-in">
                <Card className="bg-card border-border/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">MC</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Treino A - Peito</p>
                        <p className="text-xs text-muted-foreground">Personal: Maria Costa</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-md">
                      Ativo
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Supino Reto", sets: "4x12", weight: "30kg" },
                      { name: "Supino Inclinado", sets: "3x10", weight: "25kg" },
                      { name: "Crucifixo", sets: "3x15", weight: "12kg" },
                    ].map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">{exercise.name}</span>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span>{exercise.sets}</span>
                          <span className="text-primary">{exercise.weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="secondary">
                    <Star className="w-4 h-4 mr-2" />
                    Marcar como Concluído
                  </Button>
                </Card>
              </div>

              <div className="order-1 md:order-2 fade-in">
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                  Para Alunos
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
                  Seu treino na palma da mão
                </h2>
                <ul className="space-y-4">
                  {[
                    "Acesse seus treinos de qualquer lugar",
                    "Veja vídeos demonstrativos dos exercícios",
                    "Registre seu progresso e evolução",
                    "Agende aulas diretamente pelo app",
                    "Comunique-se facilmente com seu personal",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="mt-8" data-testid="button-student-cta">
                    Cadastrar como Aluno
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Junte-se a milhares de personal trainers e alunos que já estão transformando seus resultados.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-12 neon-glow neon-glow-hover" data-testid="button-final-cta">
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">B</span>
              </div>
              <span className="text-sm font-medium">Bricks</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Bricks. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
