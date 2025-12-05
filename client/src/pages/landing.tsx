import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Dumbbell, Users, Calendar, Star, ChevronRight, MapPin, Search, MessageCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import heroVideo from "@assets/herovideo_1764955332418.mp4";
import trainingVideo from "@assets/trainingvideo_1764955332419.mp4";

const WHATSAPP_NUMBER = "5511945296363";

export default function LandingPage() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `*Contato via Site*\n\nNome: ${supportForm.name}\nEmail: ${supportForm.email}\nAssunto: ${supportForm.subject}\n\nMensagem:\n${supportForm.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, "_blank");
    setSupportOpen(false);
    setSupportForm({ name: "", email: "", subject: "", message: "" });
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre o Bricks.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <span 
              className="text-2xl font-black tracking-tighter text-[#f7f7f7] hover:text-[#b6ff00] transition-colors" 
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.05em" }}
              data-testid="link-home"
            >
              BRICKS
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/personals">
              <Button variant="ghost" size="sm" data-testid="link-marketplace">
                Encontrar Personal
              </Button>
            </Link>
            <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="button-support">
                  Suporte
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-background border-[#b6ff00]/20">
                <DialogHeader>
                  <DialogTitle className="text-[#f7f7f7]">Fale com o Suporte</DialogTitle>
                  <DialogDescription className="text-[#f7f7f7]/60">
                    Preencha o formulário abaixo e entraremos em contato.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="support-name" className="text-[#f7f7f7]">Nome</Label>
                    <Input
                      id="support-name"
                      value={supportForm.name}
                      onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                      placeholder="Seu nome completo"
                      required
                      className="bg-[#002c2b]/50 border-[#b6ff00]/20 text-[#f7f7f7]"
                      data-testid="input-support-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email" className="text-[#f7f7f7]">Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                      placeholder="seu@email.com"
                      required
                      className="bg-[#002c2b]/50 border-[#b6ff00]/20 text-[#f7f7f7]"
                      data-testid="input-support-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-subject" className="text-[#f7f7f7]">Assunto</Label>
                    <Input
                      id="support-subject"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                      placeholder="Ex: Dúvida sobre cadastro"
                      required
                      className="bg-[#002c2b]/50 border-[#b6ff00]/20 text-[#f7f7f7]"
                      data-testid="input-support-subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-message" className="text-[#f7f7f7]">Mensagem</Label>
                    <Textarea
                      id="support-message"
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                      placeholder="Descreva sua dúvida ou problema..."
                      required
                      rows={4}
                      className="bg-[#002c2b]/50 border-[#b6ff00]/20 text-[#f7f7f7] resize-none"
                      data-testid="input-support-message"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1 neon-glow-hover" data-testid="button-submit-support">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar via WhatsApp
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openWhatsApp}
              className="text-[#25D366] hover:text-[#25D366]/80"
              data-testid="button-whatsapp"
            >
              <SiWhatsapp className="w-4 h-4" />
            </Button>
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

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#002c2b]/80 via-[#002c2b]/70 to-[#002c2b]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-16">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-[#f7f7f7]">Conecte-se.</span>{" "}
              <span className="text-[#b6ff00] text-neon-glow">Treine.</span>{" "}
              <span className="text-[#f7f7f7]">Transforme.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#f7f7f7]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
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
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="button-hero-marketplace">
                  <Search className="mr-2 w-5 h-5" />
                  Explorar Personais
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#f7f7f7]">
            Como <span className="text-[#b6ff00]">Funciona</span>
          </h2>
          <p className="text-[#f7f7f7]/60 text-center mb-14 max-w-xl mx-auto">
            Três passos simples para transformar sua jornada fitness
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="slide-up bg-[#002c2b]/50 border-[#b6ff00]/10 hover-elevate" style={{ animationDelay: "0ms" }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#b6ff00]/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-[#b6ff00]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#f7f7f7]">1. Encontre seu Personal</h3>
                <p className="text-[#f7f7f7]/60">
                  Explore nosso marketplace e encontre o profissional ideal para seus objetivos.
                </p>
              </CardContent>
            </Card>

            <Card className="slide-up bg-[#002c2b]/50 border-[#b6ff00]/10 hover-elevate" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#b6ff00]/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-[#b6ff00]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#f7f7f7]">2. Agende suas Aulas</h3>
                <p className="text-[#f7f7f7]/60">
                  Veja a disponibilidade do personal e agende seus treinos em poucos cliques.
                </p>
              </CardContent>
            </Card>

            <Card className="slide-up bg-[#002c2b]/50 border-[#b6ff00]/10 hover-elevate" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#b6ff00]/10 flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="w-8 h-8 text-[#b6ff00]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#f7f7f7]">3. Treine e Evolua</h3>
                <p className="text-[#f7f7f7]/60">
                  Receba treinos personalizados e acompanhe seu progresso em tempo real.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#001a1a]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in">
                <span className="text-[#b6ff00] text-sm font-semibold uppercase tracking-wider">
                  Para Personal Trainers
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-[#f7f7f7]">
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
                    <li key={index} className="flex items-center gap-3 text-[#f7f7f7]/70">
                      <ChevronRight className="w-5 h-5 text-[#b6ff00] flex-shrink-0" />
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
                <Card className="bg-[#002c2b]/80 border-[#b6ff00]/10 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#b6ff00]/20 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-[#b6ff00]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#f7f7f7]">Dashboard Completo</h4>
                      <p className="text-sm text-[#f7f7f7]/50">Tudo em um só lugar</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-[#002c2b] rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-[#b6ff00] rounded-full" />
                    </div>
                    <div className="h-3 bg-[#002c2b] rounded-full overflow-hidden">
                      <div className="h-full w-3/5 bg-[#b6ff00]/70 rounded-full" />
                    </div>
                    <div className="h-3 bg-[#002c2b] rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-[#b6ff00]/50 rounded-full" />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-[#b6ff00]">24</p>
                      <p className="text-xs text-[#f7f7f7]/50">Alunos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#f7f7f7]">48</p>
                      <p className="text-xs text-[#f7f7f7]/50">Treinos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#f7f7f7]">4.9</p>
                      <p className="text-xs text-[#f7f7f7]/50">Avaliação</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 fade-in">
                <Card className="bg-[#002c2b]/80 border-[#b6ff00]/10 p-6">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b6ff00] to-[#b6ff00]/50 flex items-center justify-center">
                        <span className="text-[#002c2b] font-bold text-sm">MC</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#f7f7f7]">Treino A - Peito</p>
                        <p className="text-xs text-[#f7f7f7]/50">Personal: Maria Costa</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#b6ff00]/20 text-[#b6ff00] text-xs font-medium rounded-md">
                      Ativo
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Supino Reto", sets: "4x12", weight: "30kg" },
                      { name: "Supino Inclinado", sets: "3x10", weight: "25kg" },
                      { name: "Crucifixo", sets: "3x15", weight: "12kg" },
                    ].map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between gap-2 p-3 bg-[#001a1a]/50 rounded-lg">
                        <span className="text-sm font-medium text-[#f7f7f7]">{exercise.name}</span>
                        <div className="flex gap-3 text-xs text-[#f7f7f7]/60">
                          <span>{exercise.sets}</span>
                          <span className="text-[#b6ff00]">{exercise.weight}</span>
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
                <span className="text-[#b6ff00] text-sm font-semibold uppercase tracking-wider">
                  Para Alunos
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-[#f7f7f7]">
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
                    <li key={index} className="flex items-center gap-3 text-[#f7f7f7]/70">
                      <ChevronRight className="w-5 h-5 text-[#b6ff00] flex-shrink-0" />
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

      <section className="relative py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={trainingVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#002c2b] via-[#002c2b]/70 to-[#002c2b]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#f7f7f7]">
            Pronto para <span className="text-[#b6ff00] text-neon-glow">começar</span>?
          </h2>
          <p className="text-[#f7f7f7]/70 mb-8 max-w-lg mx-auto text-lg">
            Junte-se a milhares de personal trainers e alunos que já estão transformando seus resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-12 neon-glow neon-glow-hover" data-testid="button-final-cta">
                Criar Conta Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/personals">
              <Button variant="outline" size="lg" className="px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="button-explore-personals">
                <MapPin className="mr-2 w-5 h-5" />
                Ver Personais na sua Região
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#b6ff00]/10 py-10 bg-[#001a1a]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span 
              className="text-xl font-black tracking-tighter text-[#f7f7f7]" 
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.05em" }}
            >
              BRICKS
            </span>
            <div className="flex items-center gap-6 text-sm text-[#f7f7f7]/50 flex-wrap justify-center">
              <Link href="/personals">
                <span className="hover:text-[#b6ff00] transition-colors cursor-pointer">Encontrar Personal</span>
              </Link>
              <Link href="/login">
                <span className="hover:text-[#b6ff00] transition-colors cursor-pointer">Entrar</span>
              </Link>
              <Link href="/register">
                <span className="hover:text-[#b6ff00] transition-colors cursor-pointer">Cadastrar</span>
              </Link>
              <button 
                onClick={openWhatsApp}
                className="hover:text-[#25D366] transition-colors cursor-pointer flex items-center gap-1"
              >
                <SiWhatsapp className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
            <p className="text-sm text-[#f7f7f7]/40">
              © 2024 Bricks. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
