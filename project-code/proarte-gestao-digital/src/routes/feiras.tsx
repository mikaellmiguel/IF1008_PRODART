import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, MapPin, CalendarDays, Users, ArrowDownAZ, UserCheck, Scale, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "Nunca participou";
  const date = new Date(dateStr);
  const now = new Date();
  
  const d1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return "Hoje";
    if (absDays === 1) return "Amanhã";
    if (absDays < 30) return `Em ${absDays} dias`;
    const absMonths = Math.round(absDays / 30.4375);
    if (absMonths <= 1) return "Em 1 mês";
    return `Em ${absMonths} meses`;
  }
  
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 30) return `Há ${diffDays} dias`;
  
  const diffMonths = Math.floor(diffDays / 30.4375);
  if (diffMonths < 12) {
    if (diffMonths <= 1) return "Há 1 mês";
    return `Há ${diffMonths} meses`;
  }
  
  const diffYears = Math.floor(diffMonths / 12);
  if (diffYears <= 1) return "Há 1 ano";
  return `Há ${diffYears} anos`;
}

export const Route = createFileRoute("/feiras")({
  head: () => ({ meta: [{ title: "Feiras & Rodízio Justo — PRODARTE" }] }),
  component: FeirasPage,
});

function FeirasPage() {
  const { feiras, ranking, fetchFeiras, fetchRanking, addFeira, alocar, loading } = useAppStore();
  const [feiraId, setFeiraId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", data: "", local: "", limiteVagas: 20 });
  const [actionLoading, setActionLoading] = useState(false);

  // Carregar feiras na montagem
  useEffect(() => {
    fetchFeiras();
  }, [fetchFeiras]);

  // Selecionar primeira feira ativa quando lista carrega
  useEffect(() => {
    if (feiras.length > 0 && !feiraId) {
      const now = new Date();
      const active = feiras.filter((f) => new Date(f.data) >= now);
      if (active.length > 0) {
        setFeiraId(active[0].id);
      } else {
        setFeiraId(feiras[0].id);
      }
    }
  }, [feiras, feiraId]);

  // Carregar ranking quando feira selecionada muda
  useEffect(() => {
    if (feiraId) {
      fetchRanking(feiraId);
    }
  }, [feiraId, fetchRanking]);

  const now = new Date();
  const feirasAtivas = feiras.filter((f) => new Date(f.data) >= now);
  const feirasPassadas = feiras.filter((f) => new Date(f.data) < now);

  const feiraAtual = feiras.find((f) => f.id === feiraId);

  const handleCriar = async () => {
    if (!form.nome || !form.data || !form.local || form.limiteVagas <= 0) {
      toast.error("Preencha todos os campos da feira.");
      return;
    }
    setActionLoading(true);
    try {
      // Converter data para ISO datetime (a API espera LocalDateTime)
      const dataISO = `${form.data}T08:00:00`;
      await addFeira({ ...form, data: dataISO, limiteVagas: form.limiteVagas });
      toast.success(`Feira "${form.nome}" cadastrada com sucesso.`);
      setDialogOpen(false);
      setForm({ nome: "", data: "", local: "", limiteVagas: 20 });
    } catch (err) {
      toast.error((err as Error).message || "Erro ao criar feira.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAlocar = async (artesaoId: number, nome: string) => {
    if (!feiraAtual) return;
    if (feiraAtual.vagasRestantes <= 0) {
      toast.error("Não há vagas disponíveis nesta feira.");
      return;
    }
    setActionLoading(true);
    try {
      await alocar(feiraAtual.id, artesaoId);
      toast.success(`${nome} alocado(a). WhatsApp de convocação enviado!`);
      // Recarregar ranking
      fetchRanking(feiraAtual.id);
    } catch (err) {
      toast.error((err as Error).message || "Erro ao alocar artesão.");
    } finally {
      setActionLoading(false);
    }
  };

  const vagasRestantes = feiraAtual?.vagasRestantes ?? 0;
  const totalVagas = feiraAtual?.limiteVagas ?? 0;
  const vagasOcupadas = totalVagas - vagasRestantes;
  const pctOcupacao = totalVagas > 0 ? (vagasOcupadas / totalVagas) * 100 : 0;

  return (
    <AppLayout title="Gestão de Feiras & Rodízio Justo">
      <div className="space-y-5">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Label htmlFor="feira-select" className="text-xs uppercase tracking-wide text-muted-foreground">
              Feira ativa
            </Label>
            <Select value={feiraId} onValueChange={setFeiraId}>
              <SelectTrigger id="feira-select" className="w-[400px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {feirasAtivas.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 bg-muted/20">Feiras Ativas</SelectLabel>
                    {feirasAtivas.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome} - {new Date(f.data).toLocaleDateString("pt-BR")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {feirasPassadas.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1 bg-muted/20 mt-1">Feiras Antigas</SelectLabel>
                    {feirasPassadas.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome} - {new Date(f.data).toLocaleDateString("pt-BR")}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><CalendarPlus className="mr-1.5 h-4 w-4" /> Cadastrar Nova Feira</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Feira</DialogTitle>
                <DialogDescription>Dados básicos para abertura da feira no calendário PRODARTE.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nome">Nome da Feira</Label>
                  <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Feira de Natal PRODARTE 2026" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vagas">Limite de Vagas</Label>
                    <Input id="vagas" type="number" min={1} value={form.limiteVagas} onChange={(e) => setForm({ ...form, limiteVagas: parseInt(e.target.value || "0") })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="local">Local</Label>
                  <Input id="local" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} placeholder="Ex: Pátio de São Pedro, Recife" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCriar} disabled={actionLoading}>
                  {actionLoading ? "Criando..." : "Cadastrar Feira"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Painel feira ativa */}
        {feiraAtual && (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <CalendarDays className="h-4 w-4" /> Feira Ativa
              </div>
              <h2 className="mt-2 text-lg font-bold leading-snug">{feiraAtual.nome}</h2>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{new Date(feiraAtual.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{feiraAtual.local}</div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Users className="h-4 w-4" /> Vagas Disponíveis
                </span>
                <Badge variant="outline" className={
                  new Date(feiraAtual.data) < now
                    ? "border-muted/40 bg-muted/20 text-muted-foreground"
                    : vagasRestantes === 0
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-success/40 bg-success/10 text-success"
                }>
                  {new Date(feiraAtual.data) < now
                    ? "Encerrada"
                    : vagasRestantes === 0
                      ? "Esgotada"
                      : "Aberta"}
                </Badge>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {vagasRestantes} <span className="text-base font-normal text-muted-foreground">/ {totalVagas}</span>
              </p>
              <Progress value={pctOcupacao} className="mt-3 h-2" />
              <p className="mt-1.5 text-xs text-muted-foreground">{vagasOcupadas} alocados · {Math.round(pctOcupacao)}% ocupação</p>
            </div>

            <div className="rounded-lg border border-secondary bg-secondary/40 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                <Scale className="h-4 w-4" /> Política de Rodízio Justo
              </div>
              <p className="mt-2 text-sm text-secondary-foreground/90">
                A fila é ordenada automaticamente pelo <strong>Score de Justiça Proporcional</strong>. Artesãos
                que <strong>nunca participaram</strong> aparecem no topo, garantindo imparcialidade.
              </p>
            </div>
          </div>
        )}

        {/* Fila de rodízio */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <ArrowDownAZ className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Fila de Rodízio — Artesãos Aprovados</h3>
            </div>
            <span className="text-xs text-muted-foreground">Ordenado por Score de Justiça (decrescente)</span>
          </div>
          {loading ? (
            <div className="flex h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando ranking...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Artesão / Marca</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Última alocação</TableHead>
                  <TableHead>Tempo de inatividade</TableHead>
                  <TableHead>Último Curso</TableHead>
                  <TableHead>Score de Rodízio</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                      {feiras.length === 0 ? "Nenhuma feira cadastrada." : "Nenhum artesão aprovado encontrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  ranking.map((r) => {
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold bg-muted text-muted-foreground">
                            {r.posicao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{r.nome}</div>
                          {r.nomeMarca && <div className="text-xs text-muted-foreground">{r.nomeMarca}</div>}
                        </TableCell>
                        <TableCell className="text-sm">{r.categoriaProduto ?? r.segmento ?? "—"}</TableCell>
                        <TableCell className="text-sm">
                          {r.dataFeiraFutura ? (
                            <span className="font-semibold text-primary">
                              Participará em {new Date(r.dataFeiraFutura).toLocaleDateString("pt-BR")}
                            </span>
                          ) : r.dataAlocacao ? (
                            <span className="font-medium text-foreground text-sm">
                              {new Date(r.dataAlocacao).toLocaleDateString("pt-BR")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60 italic">Nunca participou</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-semibold text-foreground">
                            {r.dataAlocacao ? (
                              `${r.diasInativo} dias`
                            ) : r.dataFeiraFutura ? (
                              "0 dias"
                            ) : (
                              "—"
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          {r.dataUltimoCurso ? (
                            <span className="text-sm font-semibold text-foreground">
                              {formatRelativeDate(r.dataUltimoCurso)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60 italic">Nenhum curso concluído</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono font-bold text-primary">
                            {r.scoreJustica.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleAlocar(r.id, r.nome)}
                            disabled={r.jaAlocadoNaFeira || vagasRestantes <= 0 || actionLoading || !feiraAtual || new Date(feiraAtual.data) < now}
                            variant={r.jaAlocadoNaFeira ? "outline" : "default"}
                          >
                            <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                            {!feiraAtual || new Date(feiraAtual.data) < now
                              ? "Encerrada"
                              : r.jaAlocadoNaFeira
                                ? "Alocado"
                                : "Alocar na Feira"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
