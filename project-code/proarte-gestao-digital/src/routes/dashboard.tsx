import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { Search, Filter, Eye, ListChecks, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { ArtesaoApi } from "@/lib/api-client";
import { ArtesaoDetailPanel, statusVariant, statusLabel } from "@/components/artesao-detail-panel";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Triagem & Curadoria — PRODARTE" }] }),
  component: DashboardPage,
});

// Valores de filtro disponíveis
const segmentos = ["ARTESANATO", "GASTRONOMIA"];
const statusList = ["EM_ANALISE", "APROVADO", "REPROVADO"];
const statusLabels: Record<string, string> = {
  EM_ANALISE: "Em Análise",
  APROVADO: "Aprovado",
  REPROVADO: "Rejeitado",
};

function DashboardPage() {
  const { artesaos, fetchArtesaos, loading } = useAppStore();
  const [busca, setBusca] = useState("");
  const [segmentoFilter, setSegmentoFilter] = useState<string>("all");
  const [bairroFilter, setBairroFilter] = useState<string>("all");
  const [meiFilter, setMeiFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ArtesaoApi | null>(null);

  // Carregar artesãos da API na montagem
  useEffect(() => {
    fetchArtesaos();
  }, [fetchArtesaos]);

  // Filtros locais (busca textual é local, filtros estruturados também)
  const filtered = useMemo(() => {
    return artesaos.filter((a) => {
      if (
        busca &&
        !a.nome.toLowerCase().includes(busca.toLowerCase()) &&
        !(a.nomeMarca ?? "").toLowerCase().includes(busca.toLowerCase())
      )
        return false;
      if (segmentoFilter !== "all" && a.segmento !== segmentoFilter) return false;
      if (bairroFilter !== "all" && a.bairro !== bairroFilter) return false;
      if (meiFilter !== "all" && a.possuiMEI !== (meiFilter === "sim")) return false;
      if (statusFilter !== "all" && a.statusCuradoria !== statusFilter) return false;
      return true;
    });
  }, [artesaos, busca, segmentoFilter, bairroFilter, meiFilter, statusFilter]);

  // Bairros extraídos dinamicamente dos dados
  const bairros = useMemo(() => {
    const set = new Set(artesaos.map((a) => a.bairro).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [artesaos]);

  const counters = useMemo(
    () => ({
      total: artesaos.length,
      emAnalise: artesaos.filter((a) => a.statusCuradoria === "EM_ANALISE").length,
      aprovado: artesaos.filter((a) => a.statusCuradoria === "APROVADO").length,
      reprovado: artesaos.filter((a) => a.statusCuradoria === "REPROVADO").length,
    }),
    [artesaos]
  );

  const limparFiltros = () => {
    setBusca("");
    setSegmentoFilter("all");
    setBairroFilter("all");
    setMeiFilter("all");
    setStatusFilter("all");
  };

  return (
    <AppLayout title="Triagem & Curadoria Técnica">
      <div className="space-y-5">
        {/* KPIs */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={ListChecks} label="Inscrições Totais" value={counters.total} tone="muted" />
          <Kpi icon={Clock} label="Em Análise" value={counters.emAnalise} tone="info" />
          <Kpi icon={CheckCircle2} label="Aprovados" value={counters.aprovado} tone="success" />
          <Kpi icon={XCircle} label="Rejeitados" value={counters.reprovado} tone="destructive" />
        </div>

        {/* Filtros */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4 text-primary" />
            Filtros Avançados
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou marca..." className="pl-9" />
            </div>
            <Select value={segmentoFilter} onValueChange={setSegmentoFilter}>
              <SelectTrigger><SelectValue placeholder="Segmento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os segmentos</SelectItem>
                {segmentos.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={bairroFilter} onValueChange={setBairroFilter}>
              <SelectTrigger><SelectValue placeholder="Bairro" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {bairros.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusList.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
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
          {loading ? (
            <div className="flex h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando artesãos...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Artesão / Marca</TableHead>
                  <TableHead>Segmento</TableHead>
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
                        {a.nomeMarca && <div className="text-xs text-muted-foreground">{a.nomeMarca}</div>}
                      </TableCell>
                      <TableCell><span className="text-sm">{a.segmento}</span></TableCell>
                      <TableCell><span className="text-sm">{a.bairro ?? "—"}</span></TableCell>
                      <TableCell className="text-center">
                        {a.possuiMEI ? (
                          <Badge variant="outline" className="border-success/40 bg-success/10 text-success">Sim</Badge>
                        ) : (
                          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">Não</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(a.dataInscricao).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusVariant(a.statusCuradoria)}>
                          {statusLabel(a.statusCuradoria)}
                        </Badge>
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
          )}
        </div>
      </div>

      <ArtesaoDetailPanel artesao={selected} open={!!selected} onClose={() => setSelected(null)} />
    </AppLayout>
  );
}

const toneMap = {
  muted: "bg-muted text-muted-foreground",
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
