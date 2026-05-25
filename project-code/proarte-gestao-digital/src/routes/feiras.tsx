import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, MapPin, CalendarDays, Users, ArrowDownAZ, UserCheck, Scale } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/feiras")({
  head: () => ({ meta: [{ title: "Feiras & Rodízio Justo — PRODARTE" }] }),
  component: FeirasPage,
});

function diasInativo(ultima: string | null): number {
  if (!ultima) return 99999; // nunca participou — máxima prioridade
  return Math.floor((Date.now() - new Date(ultima).getTime()) / 86400000);
}

function FeirasPage() {
  const { feiras, artesaos, addFeira, alocar } = useAppStore();
  const [feiraId, setFeiraId] = useState(feiras[0]?.id ?? "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", data: "", local: "", totalVagas: 20 });

  const feiraAtual = feiras.find((f) => f.id === feiraId) ?? feiras[0];

  const fila = useMemo(() => {
    return artesaos
      .filter((a) => a.status === "Aprovado")
      .map((a) => ({ ...a, inativo: diasInativo(a.ultimaParticipacao) }))
      .sort((a, b) => b.inativo - a.inativo); // mais inativo primeiro
  }, [artesaos]);

  const handleCriar = () => {
    if (!form.nome || !form.data || !form.local || form.totalVagas <= 0) {
      toast.error("Preencha todos os campos da feira.");
      return;
    }
    addFeira(form);
    toast.success(`Feira "${form.nome}" cadastrada com sucesso.`);
    setDialogOpen(false);
    setForm({ nome: "", data: "", local: "", totalVagas: 20 });
  };

  const handleAlocar = (artesaoId: string, nome: string) => {
    if (!feiraAtual) return;
    if (feiraAtual.vagasOcupadas >= feiraAtual.totalVagas) {
      toast.error("Não há vagas disponíveis nesta feira.");
      return;
    }
    if (feiraAtual.alocados.includes(artesaoId)) {
      toast.warning(`${nome} já está alocado(a) nesta feira.`);
      return;
    }
    alocar(feiraAtual.id, artesaoId, nome);
    toast.success("Artesão alocado. WhatsApp de convocação enviado com sucesso!");
  };

  const vagasRestantes = feiraAtual ? feiraAtual.totalVagas - feiraAtual.vagasOcupadas : 0;
  const pctOcupacao = feiraAtual ? (feiraAtual.vagasOcupadas / feiraAtual.totalVagas) * 100 : 0;

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
              <SelectTrigger id="feira-select" className="w-[320px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {feiras.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                ))}
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
                    <Input id="vagas" type="number" min={1} value={form.totalVagas} onChange={(e) => setForm({ ...form, totalVagas: parseInt(e.target.value || "0") })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="local">Local</Label>
                  <Input id="local" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} placeholder="Ex: Pátio de São Pedro, Recife" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCriar}>Cadastrar Feira</Button>
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
                <Badge variant="outline" className={vagasRestantes === 0 ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-success/40 bg-success/10 text-success"}>
                  {vagasRestantes === 0 ? "Esgotada" : "Aberta"}
                </Badge>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {vagasRestantes} <span className="text-base font-normal text-muted-foreground">/ {feiraAtual.totalVagas}</span>
              </p>
              <Progress value={pctOcupacao} className="mt-3 h-2" />
              <p className="mt-1.5 text-xs text-muted-foreground">{feiraAtual.vagasOcupadas} alocados · {Math.round(pctOcupacao)}% ocupação</p>
            </div>

            <div className="rounded-lg border border-secondary bg-secondary/40 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                <Scale className="h-4 w-4" /> Política de Rodízio Justo
              </div>
              <p className="mt-2 text-sm text-secondary-foreground/90">
                A fila é ordenada automaticamente pela <strong>data mais antiga de participação</strong>. Artesãos
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
            <span className="text-xs text-muted-foreground">Ordenado por inatividade (decrescente)</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Artesão / Marca</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Última participação</TableHead>
                <TableHead>Tempo de inatividade</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fila.map((a, idx) => {
                const jaAlocado = feiraAtual?.alocados.includes(a.id);
                const semVaga = feiraAtual ? feiraAtual.vagasOcupadas >= feiraAtual.totalVagas : true;
                const prioridade = idx < 3;
                return (
                  <TableRow key={a.id} className={prioridade ? "bg-success/[0.04]" : ""}>
                    <TableCell>
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${prioridade ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                        {idx + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{a.nome}</div>
                      <div className="text-xs text-muted-foreground">{a.marca.nome}</div>
                    </TableCell>
                    <TableCell className="text-sm">{a.marca.categoria}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {a.ultimaParticipacao
                        ? new Date(a.ultimaParticipacao).toLocaleDateString("pt-BR")
                        : <span className="text-success font-medium">Nunca participou</span>}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${prioridade ? "text-success" : "text-foreground"}`}>
                        {a.inativo === 99999 ? "—" : `${a.inativo} dias`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleAlocar(a.id, a.nome)}
                        disabled={jaAlocado || semVaga}
                        variant={jaAlocado ? "outline" : "default"}
                      >
                        <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                        {jaAlocado ? "Alocado" : "Alocar na Feira"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
