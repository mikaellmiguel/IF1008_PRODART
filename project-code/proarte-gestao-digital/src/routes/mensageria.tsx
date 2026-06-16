import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Send,
  MessageSquare,
  Users,
  History,
  CheckCheck,
  Check,
  Clock,
  Filter as FilterIcon,
  Search,
  LayoutGrid,
  MapPin
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { listarTiposMensagem } from "@/lib/api-client";

export const Route = createFileRoute("/mensageria")({
  head: () => ({ meta: [{ title: "Mensageria WhatsApp — PRODARTE" }] }),
  component: MensageriaPage,
});

const statusList = [
  { value: "EM_ANALISE", label: "Pendente" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "REPROVADO", label: "Rejeitado" }
];

function MensageriaPage() {
  const { artesaos, feiras, logs, fetchArtesaos, fetchFeiras, addLog } = useAppStore();

  const [selectedFairs, setSelectedFairs] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["APROVADO"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [buscaDestinatario, setBuscaDestinatario] = useState("");
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<number[]>([]);
  const [mensagemTipos, setMensagemTipos] = useState<string[]>([]);
  const [tipoMensagem, setTipoMensagem] = useState<string>("");
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchArtesaos();
    fetchFeiras();
    
    listarTiposMensagem()
      .then((tipos) => {
        setMensagemTipos(tipos);
        if (tipos.length > 0) {
          setTipoMensagem(tipos[0]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar tipos de mensagem:", err);
        toast.error("Erro ao carregar tipos de mensagem do servidor.");
      });
  }, [fetchArtesaos, fetchFeiras]);

  const categoriasDisponiveis = useMemo(() => {
    const set = new Set(artesaos.map((a) => a.categoriaProduto).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [artesaos]);

  const artesaoCandidates = useMemo(() => {
    return artesaos.filter((a) => {
      if (selectedFairs.length > 0) {
        const alocadoNaFeira = (a.alocacoes || []).some(
          (al) => al.status === "ALOCADO" && al.feira && selectedFairs.includes(al.feira.id)
        ) || feiras.some(
          (f) => selectedFairs.includes(f.id) && (f.alocacoes || []).some(
            (al) => al.status === "ALOCADO" && al.artesao && al.artesao.id === a.id
          )
        );
        if (!alocadoNaFeira) return false;
      }
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(a.statusCuradoria)) {
        return false;
      }
      if (selectedCategories.length > 0 && (!a.categoriaProduto || !selectedCategories.includes(a.categoriaProduto))) {
        return false;
      }
      return true;
    });
  }, [artesaos, feiras, selectedFairs, selectedStatuses, selectedCategories]);

  const artesaoResults = useMemo(() => {
    return artesaoCandidates.filter((a) => {
      if (!buscaDestinatario.trim()) return true;
      const term = buscaDestinatario.toLowerCase();
      return (
        a.nome.toLowerCase().includes(term) ||
        (a.categoriaProduto ?? "").toLowerCase().includes(term) ||
        (a.nomeMarca ?? "").toLowerCase().includes(term) ||
        (a.cidade ?? "").toLowerCase().includes(term)
      );
    });
  }, [artesaoCandidates, buscaDestinatario]);

  useEffect(() => {
    const visiveisIds = new Set(artesaoCandidates.map((c) => c.id));
    setSelectedRecipientIds((prev) => prev.filter((id) => visiveisIds.has(id)));
  }, [artesaoCandidates]);

  const handleSelectAll = () => {
    setSelectedRecipientIds(artesaoCandidates.map((c) => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedRecipientIds([]);
  };

  const handleToggleRecipient = (id: number) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const finalDestinatarios = useMemo(() => {
    return artesaos.filter((a) => selectedRecipientIds.includes(a.id));
  }, [artesaos, selectedRecipientIds]);

  const handleSend = () => {
    if (!titulo.trim() || !mensagem.trim()) {
      toast.error("Preencha o título e a mensagem.");
      return;
    }
    if (finalDestinatarios.length === 0) {
      toast.error("Nenhum destinatário selecionado.");
      return;
    }
    if (!tipoMensagem) {
      toast.error("Selecione o tipo de mensagem.");
      return;
    }

    setSending(true);
    setTimeout(() => {
      addLog({
        tipo: formatTipoLabel(tipoMensagem) as any,
        destinatario: `${finalDestinatarios.length} artesão(s)`,
        resumo: `${titulo} — ${mensagem.slice(0, 50)}${mensagem.length > 50 ? "..." : ""}`,
      });
      toast.success(`Mensagem enviada com sucesso para ${finalDestinatarios.length} destinatários!`);
      setTitulo("");
      setMensagem("");
      setSending(false);
    }, 800);
  };

  const toggleFilterItem = (list: string[], setList: (arr: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  return (
    <AppLayout title="Mensageria em Massa — Construtor de Lista de Transmissão">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <FilterIcon className="h-4 w-4 text-primary" />
                Construtor de Público (Filtros de Transmissão)
              </span>
              {(selectedFairs.length > 0 || selectedStatuses.length > 0 || selectedCategories.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={() => {
                    setSelectedFairs([]);
                    setSelectedStatuses([]);
                    setSelectedCategories([]);
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Por Feira / Evento</Label>
                <div className="max-h-[160px] overflow-y-auto border rounded-md p-2.5 space-y-2 bg-muted/10">
                  {feiras.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma feira cadastrada.</p>
                  ) : (
                    feiras.map((f) => (
                      <label key={f.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-primary transition">
                        <input
                          type="checkbox"
                          checked={selectedFairs.includes(f.id)}
                          onChange={() => toggleFilterItem(selectedFairs, setSelectedFairs, f.id)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="truncate">{f.nome}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Por Status Curadoria</Label>
                <div className="max-h-[160px] overflow-y-auto border rounded-md p-2.5 space-y-2 bg-muted/10">
                  {statusList.map((s) => (
                    <label key={s.value} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-primary transition">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(s.value)}
                        onChange={() => toggleFilterItem(selectedStatuses, setSelectedStatuses, s.value)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Por Categoria de Produto</Label>
                <div className="max-h-[160px] overflow-y-auto border rounded-md p-2.5 space-y-2 bg-muted/10">
                  {categoriasDisponiveis.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma categoria encontrada.</p>
                  ) : (
                    categoriasDisponiveis.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-primary transition">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleFilterItem(selectedCategories, setSelectedCategories, cat)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="truncate">{cat}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
              <div className="space-y-0.5">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4 text-primary" />
                  Destinatários Elegíveis ({artesaoCandidates.length})
                </span>
                <p className="text-xs text-muted-foreground">
                  Filtros aplicados encontraram <strong>{artesaoCandidates.length}</strong> artesão(s).
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleSelectAll} disabled={artesaoCandidates.length === 0}>
                  Selecionar Todos os {artesaoCandidates.length}
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={handleDeselectAll} disabled={selectedRecipientIds.length === 0}>
                  Limpar Seleção
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={buscaDestinatario}
                onChange={(e) => setBuscaDestinatario(e.target.value)}
                placeholder="Pesquisar por nome, categoria ou cidade nos resultados filtrados..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto border rounded-md divide-y bg-muted/5">
              {artesaoResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  Nenhum artesão visível corresponde aos filtros ou à pesquisa.
                </div>
              ) : (
                artesaoResults.map((art) => {
                  const isChecked = selectedRecipientIds.includes(art.id);
                  return (
                    <div
                      key={art.id}
                      className={`flex items-start justify-between p-3 hover:bg-muted/30 transition cursor-pointer select-none ${
                        isChecked ? "bg-primary/5" : ""
                      }`}
                      onClick={() => handleToggleRecipient(art.id)}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleRecipient(art.id)}
                          className="mt-0.5"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-semibold truncate text-foreground">{art.nome}</p>
                          {art.nomeMarca && <p className="text-[10px] text-muted-foreground font-medium truncate">{art.nomeMarca}</p>}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <Badge variant="secondary" className="text-[9px] py-0 px-1 font-semibold flex items-center gap-1 bg-muted/60">
                              <LayoutGrid className="h-2.5 w-2.5" />
                              {art.categoriaProduto || "Sem categoria"}
                            </Badge>
                            {art.cidade && (
                              <Badge variant="secondary" className="text-[9px] py-0 px-1 font-semibold flex items-center gap-1 bg-muted/60">
                                <MapPin className="h-2.5 w-2.5" />
                                {art.cidade}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Badge variant="outline" className={`text-[9px] py-0 px-1.5 shrink-0 ${
                        art.statusCuradoria === "APROVADO" ? "border-success/40 bg-success/5 text-success" :
                        art.statusCuradoria === "EM_ANALISE" ? "border-info/40 bg-info/5 text-info" :
                        "border-destructive/40 bg-destructive/5 text-destructive"
                      }`}>
                        {art.statusCuradoria === "APROVADO" ? "Aprovado" :
                         art.statusCuradoria === "EM_ANALISE" ? "Pendente" : "Rejeitado"}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/5 px-3 py-2.5 text-xs">
              <span className="flex items-center gap-2 text-success font-semibold">
                <Users className="h-4 w-4" />
                Destinatários Selecionados: {finalDestinatarios.length} de {artesaoCandidates.length}
              </span>
              <div className="flex flex-wrap gap-1 max-w-[50%] justify-end">
                {finalDestinatarios.slice(0, 3).map((d) => (
                  <Badge key={d.id} variant="outline" className="border-success/20 bg-card text-[9px] py-0 px-1 truncate max-w-[80px]">
                    {d.nome.split(" ")[0]}
                  </Badge>
                ))}
                {finalDestinatarios.length > 3 && (
                  <Badge variant="outline" className="border-success/20 bg-card text-[9px] py-0 px-1">
                    +{finalDestinatarios.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-primary" />
              Composição da Mensagem
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="msg-type">Tipo de Mensagem <span className="text-destructive">*</span></Label>
                <Select value={tipoMensagem} onValueChange={setTipoMensagem}>
                  <SelectTrigger id="msg-type" className="h-9 text-xs">
                    <SelectValue placeholder="Selecione o tipo de mensagem carregado pelo servidor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mensagemTipos.map((tipo) => (
                      <SelectItem key={tipo} value={tipo} className="text-xs">
                        {formatTipoLabel(tipo)} ({tipo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">Tipo de comunicação carregado dinamicamente via API.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tit">Título / Assunto</Label>
                <Input id="tit" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Convocação Feira de São João 2026" maxLength={80} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg">Mensagem</Label>
                <Textarea id="msg" rows={5} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Digite o texto que será enviado..." maxLength={1000} className="text-xs" />
                <p className="text-right text-[10px] text-muted-foreground">{mensagem.length}/1000</p>
              </div>

              {(titulo || mensagem) && (
                <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-success font-semibold">Preview WhatsApp</p>
                  <div className="mt-2 max-w-sm rounded-lg rounded-tl-none bg-card p-3 shadow-sm border border-success/10">
                    {titulo && <p className="text-xs font-semibold">{titulo}</p>}
                    {mensagem && <p className="mt-1 whitespace-pre-wrap text-[11px] text-foreground/90 leading-relaxed">{mensagem}</p>}
                    <p className="mt-1.5 text-right text-[9px] text-muted-foreground">PRODARTE · agora</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t">
                <Button onClick={handleSend} disabled={sending || finalDestinatarios.length === 0} className="bg-success text-success-foreground hover:bg-success/90 h-9 px-4 text-xs font-medium gap-1.5">
                  <Send className="h-4 w-4" /> Disparar para {finalDestinatarios.length} Selecionados
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm h-fit">
          <div className="flex items-center gap-2 border-b p-4">
            <History className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Histórico Recente</h3>
          </div>
          <ul className="max-h-[700px] divide-y overflow-y-auto">
            {logs.length === 0 ? (
              <li className="p-6 text-center text-xs text-muted-foreground">Nenhuma mensagem enviada ainda.</li>
            ) : (
              logs.map((log) => (
                <li key={log.id} className="p-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className={tipoColor(log.tipo)}>{log.tipo}</Badge>
                    <StatusIcon status={log.status} />
                  </div>
                  <p className="mt-1.5 text-xs font-medium">{log.destinatario}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{log.resumo}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-wide text-muted-foreground">{log.data}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}

function formatTipoLabel(tipo: string) {
  switch (tipo) {
    case "APROVACAO": return "Aprovação";
    case "REJEICAO": return "Rejeição";
    case "CONVOCACAO": return "Convocação";
    case "INDIVIDUAL": return "Individual";
    case "MASSA": return "Massa";
    case "COMUNICADO": return "Comunicado";
    default: return tipo;
  }
}

function tipoColor(tipo: string) {
  switch (tipo) {
    case "Convocação": return "border-success/40 bg-success/10 text-success text-[10px]";
    case "Rejeição": return "border-destructive/40 bg-destructive/10 text-destructive text-[10px]";
    case "Aprovação": return "border-info/40 bg-info/10 text-info text-[10px]";
    default: return "border-warning/40 bg-warning/10 text-warning-foreground text-[10px]";
  }
}

function StatusIcon({ status }: { status: string }) {
  if (status === "Lido") return <CheckCheck className="h-3.5 w-3.5 text-info" />;
  if (status === "Entregue") return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
  if (status === "Enviado") return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
  return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
}
