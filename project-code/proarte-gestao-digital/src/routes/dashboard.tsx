import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Eye, ListChecks, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { bairros, categorias, statusList, type Artesao } from "@/lib/mock-data";
import { ArtesaoDetailPanel, statusVariant } from "@/components/artesao-detail-panel";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Triagem & Curadoria — PRODARTE" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const artesaos = useAppStore((s) => s.artesaos);
  const [busca, setBusca] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [bairroFilter, setBairroFilter] = useState<string>("all");
  const [meiFilter, setMeiFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Artesao | null>(null);

  const filtered = useMemo(() => {
    return artesaos.filter((a) => {
      if (busca && !a.nome.toLowerCase().includes(busca.toLowerCase()) && !a.marca.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      if (catFilter !== "all" && a.marca.categoria !== catFilter) return false;
      if (bairroFilter !== "all" && a.endereco.bairro !== bairroFilter) return false;
      if (meiFilter !== "all" && a.formalizacao.possuiMei !== (meiFilter === "sim")) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    });
  }, [artesaos, busca, catFilter, bairroFilter, meiFilter, statusFilter]);

  const counters = useMemo(() => ({
    total: artesaos.length,
    pendente: artesaos.filter((a) => a.status === "Pendente").length,
    analise: artesaos.filter((a) => a.status === "Em Análise").length,
    aprovado: artesaos.filter((a) => a.status === "Aprovado").length,
    rejeitado: artesaos.filter((a) => a.status === "Rejeitado").length,
  }), [artesaos]);

  const limparFiltros = () => {
    setBusca(""); setCatFilter("all"); setBairroFilter("all"); setMeiFilter("all"); setStatusFilter("all");
  };

  return (
    <AppLayout title="Triagem & Curadoria Técnica">
      <div className="space-y-5">
        {/* KPIs */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Kpi icon={ListChecks} label="Inscrições Totais" value={counters.total} tone="muted" />
          <Kpi icon={Clock} label="Pendentes" value={counters.pendente} tone="warning" />
          <Kpi icon={Filter} label="Em Análise" value={counters.analise} tone="info" />
          <Kpi icon={CheckCircle2} label="Aprovados" value={counters.aprovado} tone="success" />
          <Kpi icon={XCircle} label="Rejeitados" value={counters.rejeitado} tone="destructive" />
        </div>

        {/* Filtros */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4 text-primary" />
            Filtros Avançados
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou marca..." className="pl-9" />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger><SelectValue placeholder="Categoria de Produto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={bairroFilter} onValueChange={setBairroFilter}>
              <SelectTrigger><SelectValue placeholder="Bairro" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {bairros.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={meiFilter} onValueChange={setMeiFilter}>
              <SelectTrigger><SelectValue placeholder="Possui MEI" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">MEI: Todos</SelectItem>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusList.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Exibindo <strong className="text-foreground">{filtered.length}</strong> de {artesaos.length} inscrições</span>
            <Button variant="ghost" size="sm" onClick={limparFiltros}>Limpar filtros</Button>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[110px]">ID</TableHead>
                <TableHead>Artesão / Marca</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead className="text-center">MEI</TableHead>
                <TableHead>Inscrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                    Nenhuma inscrição encontrada com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{a.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{a.nome}</div>
                      <div className="text-xs text-muted-foreground">{a.marca.nome}</div>
                    </TableCell>
                    <TableCell><span className="text-sm">{a.marca.categoria}</span></TableCell>
                    <TableCell><span className="text-sm">{a.endereco.bairro}</span></TableCell>
                    <TableCell className="text-center">
                      {a.formalizacao.possuiMei ? (
                        <Badge variant="outline" className="border-success/40 bg-success/10 text-success">Sim</Badge>
                      ) : (
                        <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(a.dataInscricao).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusVariant(a.status)}>{a.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelected(a)}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Ver Perfil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ArtesaoDetailPanel artesao={selected} open={!!selected} onClose={() => setSelected(null)} />
    </AppLayout>
  );
}

const toneMap = {
  muted: "bg-muted text-muted-foreground",
  warning: "bg-warning/15 text-warning-foreground",
  info: "bg-info/10 text-info",
  success: "bg-success/15 text-success",
  destructive: "bg-destructive/10 text-destructive",
} as const;

function Kpi({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone: keyof typeof toneMap }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
