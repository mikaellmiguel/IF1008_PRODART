import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock, Mail, Palette, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PRODARTE — Acesso Restrito a Gestores" },
      { name: "description", content: "Portal PRODARTE: Backoffice de gestão do artesanato pernambucano." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("gestor@prodarte.com");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      toast.success("Acesso liberado. Bem-vindo, Gestor!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-primary p-4">
      {/* decorative pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_40%)]" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-2xl md:grid-cols-2">
        {/* Faixa cores da bandeira de PE */}
        <div className="absolute inset-x-0 top-0 z-10 flex h-1.5">
          <div className="flex-1 bg-[var(--pe-blue)]" />
          <div className="flex-1 bg-[var(--pe-white)]" />
          <div className="flex-1 bg-[var(--pe-red)]" />
          <div className="flex-1 bg-[var(--pe-yellow)]" />
          <div className="flex-1 bg-[var(--pe-green)]" />
        </div>
        {/* Left brand panel */}
        <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground md:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">PRODARTE</p>
              <p className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">
                Prefeitura do Recife
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold leading-tight">
              Triagem, curadoria e rodízio justo do artesanato recifense.
            </h2>
            <p className="text-sm text-sidebar-foreground/70">
              Plataforma oficial para gestão de inscrições, alocação em feiras e comunicação com artesãos
              cadastrados.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/80">
            <ShieldCheck className="h-4 w-4 shrink-0 text-sidebar-primary" />
            <span>
              Dados pessoais protegidos pela LGPD. Acesso registrado e auditado.
            </span>
          </div>
        </div>

        {/* Right form */}
        <div className="flex flex-col justify-center p-8 md:p-10">
          <div className="mb-6 space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              PRODARTE — Acesso Restrito a Gestores
            </h1>
            <p className="text-sm text-muted-foreground">
              Informe suas credenciais institucionais para acessar o painel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@prodarte.pe.gov.br"
                  className="pl-9"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-input" />
                Lembrar neste dispositivo
              </label>
            </div>

            <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={loading}>
              {loading ? "Validando credenciais..." : "Acessar Painel"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            v1.0 · PRODARTE © {new Date().getFullYear()} · Secretaria do Trabalho e Qualificação Profissional · Prefeitura do Recife
          </p>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}
