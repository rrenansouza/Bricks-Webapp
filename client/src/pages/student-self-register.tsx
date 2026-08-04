import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, ArrowLeft, Dumbbell } from "lucide-react";
import logoUrl from "@assets/Brickslogo_1764955332419.png";

interface StudentSelfRegisterPageProps {
  token: string;
}

export default function StudentSelfRegisterPage({ token }: StudentSelfRegisterPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tokenStatus, setTokenStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [personalName, setPersonalName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await fetch(`/api/students/validate-token/${token}`);
        const data = await res.json();
        if (data.valid) {
          setTokenStatus("valid");
          setPersonalName(data.personalName || "Seu personal");
        } else {
          setTokenStatus("invalid");
        }
      } catch {
        setTokenStatus("invalid");
      }
    };
    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome, e-mail e senha.", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Senhas diferentes", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Senha fraca", description: "A senha deve ter ao menos 6 caracteres.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/students/self-register/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          city: form.city || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao registrar");
      }

      const data = await res.json();

      // Save token if returned
      if (data.token) {
        localStorage.setItem("bricks_token", data.token);
      }

      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada. Faça login para continuar.",
      });

      setLocation("/login");
    } catch (error: any) {
      toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validando convite...</p>
        </div>
      </div>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="p-8 text-center">
            <XCircle className="w-14 h-14 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Convite inválido</h2>
            <p className="text-muted-foreground mb-6">
              Este link de convite é inválido ou já foi utilizado.
            </p>
            <Link href="/login">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir para o login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-[#b6ff00]/10 bg-[#002c2b]/80">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/"><img src={logoUrl} alt="Bricks" className="h-7 w-auto" /></Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Welcome banner */}
          <div className="mb-6 p-4 rounded-xl bg-[#b6ff00]/10 border border-[#b6ff00]/20 text-center fade-in">
            <CheckCircle className="w-8 h-8 text-[#b6ff00] mx-auto mb-2" />
            <p className="text-[#f7f7f7] font-medium">
              Convite de <span className="text-[#b6ff00]">{personalName}</span>
            </p>
            <p className="text-sm text-[#f7f7f7]/60 mt-1">
              Complete seu cadastro para acessar a plataforma.
            </p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                Criar conta de aluno
              </CardTitle>
              <CardDescription>
                Preencha seus dados para ativar seu acesso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="r-name">Nome completo *</Label>
                  <Input
                    id="r-name"
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-email">E-mail *</Label>
                  <Input
                    id="r-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-phone">Telefone (opcional)</Label>
                  <Input
                    id="r-phone"
                    placeholder="(11) 99999-9999"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-city">Cidade (opcional)</Label>
                  <Input
                    id="r-city"
                    placeholder="São Paulo"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-password">Senha *</Label>
                  <Input
                    id="r-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-confirm">Confirmar senha *</Label>
                  <Input
                    id="r-confirm"
                    type="password"
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full neon-glow-hover" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando conta...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4 mr-2" /> Criar conta</>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Já tem conta?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Fazer login
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
