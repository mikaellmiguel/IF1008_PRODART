import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Check,
  X,
  AlertTriangle,
  MapPin,
  IdCard,
  Briefcase,
  Sparkles,
  MessageCircle,
  Eye,
  EyeOff,
  Download,
  Search,
  Calendar,
  ArrowUpDown,
  Edit2,
  FileText,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap
} from "lucide-react";
import type { ArtesaoApi, DocumentoApi, MensagemApi } from "@/lib/api-client";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function statusVariant(status: string) {
  switch (status) {
    case "APROVADO": return "bg-success/15 text-success border-success/30";
    case "REPROVADO": return "bg-destructive/10 text-destructive border-destructive/30";
    case "EM_ANALISE": return "bg-info/10 text-info border-info/30";
    default: return "bg-warning/15 text-warning-foreground border-warning/40";
  }
}

export function statusLabel(status: string) {
  switch (status) {
    case "APROVADO": return "Aprovado";
    case "REPROVADO": return "Rejeitado";
    case "EM_ANALISE": return "Pendente";
    default: return status;
  }
}

// Helpers para mascaramento de campos sensíveis
function formatCPF(cpf: string, masked: boolean) {
  if (!cpf) return "—";
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return cpf;
  if (masked) {
    return `${clean.substring(0, 3)}.***.***-${clean.substring(9)}`;
  }
  return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9)}`;
}

function formatRG(rg: string, masked: boolean) {
  if (!rg) return "—";
  if (masked) {
    return "**.***.***";
  }
  return rg;
}

function formatCNPJ(cnpj: string, masked: boolean) {
  if (!cnpj) return "—";
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return cnpj;
  if (masked) {
    return `${clean.substring(0, 2)}.***.***/****-${clean.substring(12)}`;
  }
  return `${clean.substring(0, 2)}.${clean.substring(2, 5)}.${clean.substring(5, 8)}/${clean.substring(8, 12)}-${clean.substring(12)}`;
}

function formatSize(bytes: number) {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatInstagramUrl(handle: string): string {
  if (!handle) return "";
  const clean = handle.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }
  const username = clean.startsWith("@") ? clean.substring(1) : clean;
  return `https://instagram.com/${username}`;
}

interface Props {
  artesao: ArtesaoApi | null;
  open: boolean;
  onClose: () => void;
}

export function ArtesaoDetailPanel({ artesao, open, onClose }: Props) {
  const { aprovarArtesao, rejeitarArtesao, editarArtesao, adicionarCurso, deletarCurso } = useAppStore();
  const [showRejection, setShowRejection] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // States for courses/trainings
  const [showAddCurso, setShowAddCurso] = useState(false);
  const [novoCursoNome, setNovoCursoNome] = useState("");
  const [novoCursoData, setNovoCursoData] = useState("");
  const [cursoLoading, setCursoLoading] = useState(false);

  const handleSaveCurso = async () => {
    if (!artesao || !novoCursoNome || !novoCursoData) return;
    setCursoLoading(true);
    try {
      const formattedDate = `${novoCursoData}T00:00:00`;
      await adicionarCurso(artesao.id, novoCursoNome, formattedDate);
      
      const updatedArtesao = useAppStore.getState().artesaos.find(a => a.id === artesao.id);
      if (updatedArtesao && updatedArtesao.cursos) {
        artesao.cursos = [...updatedArtesao.cursos];
      }
      
      toast.success("Curso adicionado com sucesso!");
      setShowAddCurso(false);
      setNovoCursoNome("");
      setNovoCursoData("");
    } catch (err) {
      toast.error((err as Error).message || "Erro ao salvar curso.");
    } finally {
      setCursoLoading(false);
    }
  };

  const handleDeleteCurso = async (cursoId: number) => {
    if (!artesao) return;
    setCursoLoading(true);
    try {
      await deletarCurso(artesao.id, cursoId);
      artesao.cursos = (artesao.cursos ?? []).filter((c) => c.id !== cursoId);
      toast.success("Curso removido com sucesso!");
    } catch (err) {
      toast.error((err as Error).message || "Erro ao deletar curso.");
    } finally {
      setCursoLoading(false);
    }
  };

  // Controle de exibição de dados mascarados
  const [unmaskedFields, setUnmaskedFields] = useState<Record<string, boolean>>({});

  // Estados dos novos Modais/Dialogs
  const [previewDoc, setPreviewDoc] = useState<DocumentoApi | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<(MensagemApi & { canal: string; statusEnvio: string }) | null>(null);

  // Estados de listagem e filtragem do Histórico de Feiras
  const [feiraBusca, setFeiraBusca] = useState("");
  const [feiraSortField, setFeiraSortField] = useState<"nome" | "data">("data");
  const [feiraSortOrder, setFeiraSortOrder] = useState<"asc" | "desc">("desc");

  // Estados de listagem, filtragem e paginação das Mensagens
  const [msgBusca, setMsgBusca] = useState("");
  const [msgCanalFilter, setMsgCanalFilter] = useState("all");
  const [msgStatusFilter, setMsgStatusFilter] = useState("all");
  const [msgPage, setMsgPage] = useState(1);
  const msgPageSize = 5;

  // Estado do formulário de edição
  const [editForm, setEditForm] = useState<Partial<ArtesaoApi>>({});

  const toggleUnmask = (field: string) => {
    setUnmaskedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleApprove = async () => {
    if (!artesao) return;
    setActionLoading(true);
    try {
      await aprovarArtesao(artesao.id);
      toast.success(`${artesao.nome} aprovado(a). WhatsApp de confirmação enviado.`);
      onClose();
    } catch (err) {
      toast.error((err as Error).message || "Erro ao aprovar artesão.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!artesao) return;
    if (justificativa.trim().length < 10) {
      toast.error("A justificativa deve ter ao menos 10 caracteres.");
      return;
    }
    setActionLoading(true);
    try {
      await rejeitarArtesao(artesao.id, justificativa.trim());
      toast.success(`Inscrição rejeitada. WhatsApp enviado a ${artesao.nome}.`);
      setShowRejection(false);
      setJustificativa("");
      onClose();
    } catch (err) {
      toast.error((err as Error).message || "Erro ao rejeitar artesão.");
    } finally {
      setActionLoading(false);
    }
  };

  // Abrir formulário preenchido para edição
  const openEditDialog = () => {
    if (!artesao) return;
    setEditForm({ ...artesao });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artesao) return;

    if (!editForm.nome?.trim()) {
      toast.error("O Nome é obrigatório.");
      return;
    }
    if (!editForm.cpf?.trim() || editForm.cpf.replace(/\D/g, "").length !== 11) {
      toast.error("Insira um CPF válido.");
      return;
    }
    if (!editForm.telefone?.trim()) {
      toast.error("O Telefone é obrigatório.");
      return;
    }

    setActionLoading(true);
    try {
      await editarArtesao(artesao.id, editForm);
      toast.success("Dados do artesão atualizados com sucesso!");
      setShowEditModal(false);
      // Atualizar dados na tela reabrindo ou apenas deixando o store propagar
      if (artesao) {
        Object.assign(artesao, editForm);
      }
    } catch (err) {
      toast.error((err as Error).message || "Erro ao atualizar artesão.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = () => {
    setShowRejection(false);
    setJustificativa("");
    setUnmaskedFields({});
    onClose();
  };

  // ─── Processamento do Histórico de Feiras ─────────────────────────────────
  const alocacoesList = artesao?.alocacoes || [];
  const feirasFiltradas = useMemo(() => {
    return alocacoesList
      .filter((a) => {
        if (!a.feira) return false;
        if (feiraBusca && !a.feira.nome.toLowerCase().includes(feiraBusca.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (!a.feira || !b.feira) return 0;
        let comparison = 0;
        if (feiraSortField === "nome") {
          comparison = a.feira.nome.localeCompare(b.feira.nome);
        } else {
          comparison = new Date(a.feira.data).getTime() - new Date(b.feira.data).getTime();
        }
        return feiraSortOrder === "asc" ? comparison : -comparison;
      });
  }, [alocacoesList, feiraBusca, feiraSortField, feiraSortOrder]);

  const toggleFeiraSort = (field: "nome" | "data") => {
    if (feiraSortField === field) {
      setFeiraSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setFeiraSortField(field);
      setFeiraSortOrder("desc");
    }
  };

  // ─── Processamento do Histórico de Mensagens Mapeado Dinamicamente ─────────
  const mensagensList = useMemo(() => {
    const rawMsgs = artesao?.mensagens || [];
    return rawMsgs.map((m) => {
      // Mapeamento dinâmico sem depender de colunas inexistentes na tabela do banco
      let canal: string = "WHATSAPP";
      let statusEnvio: string = "ENTREGUE";

      if (m.tipo === "COMUNICADO") {
        canal = "EMAIL";
        statusEnvio = "ENTREGUE";
      } else if (m.tipo === "APROVACAO" || m.tipo === "REJEICAO") {
        canal = "WHATSAPP";
        statusEnvio = "LIDO";
      } else if (m.tipo === "CONVOCACAO") {
        canal = "WHATSAPP";
        statusEnvio = "ENTREGUE";
      } else {
        canal = "SISTEMA";
        statusEnvio = "ENVIADO";
      }

      return {
        ...m,
        canal,
        statusEnvio,
      };
    });
  }, [artesao?.mensagens]);

  const mensagensFiltradas = useMemo(() => {
    return mensagensList
      .filter((m) => {
        if (msgBusca && !m.assunto.toLowerCase().includes(msgBusca.toLowerCase()) && !m.conteudo.toLowerCase().includes(msgBusca.toLowerCase())) {
          return false;
        }
        if (msgCanalFilter !== "all" && m.canal !== msgCanalFilter) return false;
        if (msgStatusFilter !== "all" && m.statusEnvio !== msgStatusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.enviadaEm).getTime() - new Date(a.enviadaEm).getTime());
  }, [mensagensList, msgBusca, msgCanalFilter, msgStatusFilter]);

  const totalMsgPages = Math.ceil(mensagensFiltradas.length / msgPageSize) || 1;
  const mensagensPaginadas = useMemo(() => {
    const start = (msgPage - 1) * msgPageSize;
    return mensagensFiltradas.slice(start, start + msgPageSize);
  }, [mensagensFiltradas, msgPage]);

  if (!artesao) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl bg-card border-l">
        <SheetHeader className="space-y-2 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-xl flex items-center gap-2">
                <span>{artesao.nome}</span>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={openEditDialog}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <span className="font-mono text-xs">ID: {artesao.id}</span>
                {artesao.nomeMarca && (
                  <>
                    <span>·</span>
                    <span>{artesao.nomeMarca}</span>
                  </>
                )}
              </SheetDescription>
            </div>
            <Badge variant="outline" className={statusVariant(artesao.statusCuradoria)}>
              {statusLabel(artesao.statusCuradoria)}
            </Badge>
          </div>
        </SheetHeader>

        <Tabs defaultValue="perfil" className="mt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="perfil" className="text-xs">Perfil</TabsTrigger>
            <TabsTrigger value="anexos" className="text-xs">Anexos</TabsTrigger>
            <TabsTrigger value="feiras" className="text-xs">Feiras</TabsTrigger>
            <TabsTrigger value="mensagens" className="text-xs">Mensagens</TabsTrigger>
          </TabsList>

          {/* ────────────────── 1. ABA PERFIL ────────────────── */}
          <TabsContent value="perfil" className="space-y-5 pt-4">
            <Section icon={IdCard} title="Dados Pessoais">
              <Field label="Nome completo" value={artesao.nome} />
              <div className="relative">
                <Field label="CPF" value={formatCPF(artesao.cpf, !unmaskedFields["cpf"])} sensitive />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-4 h-6 w-6 text-muted-foreground"
                  onClick={() => toggleUnmask("cpf")}
                >
                  {unmaskedFields["cpf"] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="relative">
                <Field label="RG" value={formatRG(artesao.rg || "", !unmaskedFields["rg"])} sensitive />
                {artesao.rg && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-4 h-6 w-6 text-muted-foreground"
                    onClick={() => toggleUnmask("rg")}
                  >
                    {unmaskedFields["rg"] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                )}
              </div>
              {artesao.dataNascimento && (
                <Field label="Data de Nasc." value={new Date(artesao.dataNascimento).toLocaleDateString("pt-BR")} />
              )}
              {artesao.email && <Field label="E-mail" value={artesao.email} />}
              <Field label="Telefone" value={artesao.telefone} />
            </Section>

            <Section icon={MapPin} title="Endereço">
              {artesao.logradouro && (
                <Field
                  label="Logradouro"
                  value={`${artesao.logradouro}${artesao.numero ? `, ${artesao.numero}` : ""}${artesao.complemento ? ` (${artesao.complemento})` : ""}`}
                />
              )}
              {artesao.bairro && <Field label="Bairro" value={artesao.bairro} />}
              {artesao.cidade && <Field label="Cidade" value={`${artesao.cidade}${artesao.uf ? ` - ${artesao.uf}` : ""}`} />}
              {artesao.cep && <Field label="CEP" value={artesao.cep} />}
              {!artesao.logradouro && !artesao.bairro && !artesao.cidade && (
                <p className="col-span-2 text-xs text-muted-foreground">Endereço não informado.</p>
              )}
            </Section>

            <Section icon={Sparkles} title="Marca / Produto">
              {artesao.nomeMarca && <Field label="Nome da marca" value={artesao.nomeMarca} />}
              <Field label="Segmento" value={artesao.segmento} />
              {artesao.categoriaProduto && <Field label="Categoria" value={artesao.categoriaProduto} />}
              {artesao.instagram && (
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Instagram / Redes Sociais</p>
                  <a
                    href={formatInstagramUrl(artesao.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 group/insta"
                  >
                    {artesao.instagram}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover/insta:opacity-100 transition shrink-0" />
                  </a>
                </div>
              )}
              {artesao.descricaoProduto && <Field label="Descrição dos Produtos ou Serviços" value={artesao.descricaoProduto} full />}
            </Section>

            <Section icon={Briefcase} title="Formalização">
              <Field label="Possui MEI" value={artesao.possuiMEI ? "Sim" : "Não"} />
              {artesao.possuiMEI && (
                <>
                  <div className="relative">
                    <Field label="CNPJ" value={formatCNPJ(artesao.cnpj || "", !unmaskedFields["cnpj"])} sensitive />
                    {artesao.cnpj && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-4 h-6 w-6 text-muted-foreground"
                        onClick={() => toggleUnmask("cnpj")}
                      >
                        {unmaskedFields["cnpj"] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                    )}
                  </div>
                  {artesao.razaoSocial && <Field label="Razão Social" value={artesao.razaoSocial} />}
                </>
              )}
            </Section>

            <Section icon={GraduationCap} title="Capacitações / Cursos">
              <div className="col-span-2 space-y-3">
                {(!artesao.cursos || artesao.cursos.length === 0) ? (
                  <p className="text-xs text-muted-foreground py-1">Nenhum curso ou capacitação cadastrado.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {artesao.cursos.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/60 shadow-sm group/item hover:border-primary/40 transition">
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{c.nome}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            Conclusão: {new Date(c.dataConclusao).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition shrink-0"
                          onClick={() => handleDeleteCurso(c.id)}
                          disabled={cursoLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form to add course */}
                {showAddCurso ? (
                  <div className="border rounded-lg p-3 bg-muted/30 space-y-3 mt-2">
                    <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Nova Capacitação</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="curso-nome" className="text-xs">Nome do Curso</Label>
                        <Input
                          id="curso-nome"
                          value={novoCursoNome}
                          onChange={(e) => setNovoCursoNome(e.target.value)}
                          placeholder="Ex: Empreendedorismo no Artesanato"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="curso-data" className="text-xs">Data de Conclusão</Label>
                        <Input
                          id="curso-data"
                          type="date"
                          value={novoCursoData}
                          onChange={(e) => setNovoCursoData(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowAddCurso(false)}>
                        Cancelar
                      </Button>
                      <Button size="sm" className="h-7 text-xs" onClick={handleSaveCurso} disabled={cursoLoading || !novoCursoNome || !novoCursoData}>
                        Salvar Curso
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1 border-dashed hover:border-primary hover:text-primary transition w-full sm:w-auto"
                    onClick={() => setShowAddCurso(true)}
                  >
                    + Adicionar Capacitação
                  </Button>
                )}
              </div>
            </Section>
          </TabsContent>

          {/* ────────────────── 2. ABA ANEXOS ────────────────── */}
          <TabsContent value="anexos" className="space-y-4 pt-4">
            {!artesao.documentos || artesao.documentos.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8 opacity-45 text-warning" />
                Nenhum documento ou anexo foi enviado por este artesão.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {artesao.documentos.map((doc) => (
                  <div key={doc.id} className="flex flex-col justify-between rounded-lg border bg-muted/20 p-3 shadow-sm hover:bg-muted/40 transition">
                    <div className="flex items-start gap-2.5">
                      <FileText className="h-9 w-9 text-primary shrink-0 opacity-80" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{doc.tipo}</p>
                        <p className="text-[10px] text-muted-foreground">{formatSize(doc.tamanhoBytes)}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Envio: {new Date(doc.criadoEm).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] py-0.5 px-2">
                        {doc.status || "PENDENTE"}
                      </Badge>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setPreviewDoc(doc)}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> Ver
                        </Button>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Download className="mr-1 h-3.5 w-3.5" /> Baixar
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ────────────────── 3. ABA HISTÓRICO DE FEIRAS ────────────────── */}
          <TabsContent value="feiras" className="space-y-4 pt-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={feiraBusca}
                onChange={(e) => setFeiraBusca(e.target.value)}
                placeholder="Buscar pelo nome da feira..."
                className="pl-9"
              />
            </div>

            {feirasFiltradas.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                Não há registro de participação em feiras com os critérios de busca.
              </div>
            ) : (
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => toggleFeiraSort("nome")} className="cursor-pointer hover:bg-muted/30">
                        Feira / Evento <ArrowUpDown className="inline-block ml-1 h-3 w-3" />
                      </TableHead>
                      <TableHead onClick={() => toggleFeiraSort("data")} className="cursor-pointer hover:bg-muted/30 w-[110px]">
                        Data <ArrowUpDown className="inline-block ml-1 h-3 w-3" />
                      </TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead className="w-[100px] text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feirasFiltradas.map((aloc) => (
                      <TableRow key={aloc.id}>
                        <TableCell className="font-medium">{aloc.feira?.nome || "Sem nome"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {aloc.feira?.data ? new Date(aloc.feira.data).toLocaleDateString("pt-BR") : "—"}
                        </TableCell>
                        <TableCell className="text-xs">{aloc.feira?.local || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={aloc.status === "ALOCADO" ? "border-success text-success bg-success/5" : "border-destructive text-destructive bg-destructive/5"}>
                            {aloc.status === "ALOCADO" ? "Confirmado" : "Cancelado"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ────────────────── 4. ABA HISTÓRICO DE MENSAGENS ────────────────── */}
          <TabsContent value="mensagens" className="space-y-4 pt-4">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="relative sm:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={msgBusca}
                  onChange={(e) => { setMsgBusca(e.target.value); setMsgPage(1); }}
                  placeholder="Buscar na mensagem..."
                  className="pl-9"
                />
              </div>
              <Select value={msgCanalFilter} onValueChange={(val) => { setMsgCanalFilter(val); setMsgPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Canal" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os canais</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="EMAIL">E-mail</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="SISTEMA">Notificação Sistema</SelectItem>
                </SelectContent>
              </Select>
              <Select value={msgStatusFilter} onValueChange={(val) => { setMsgStatusFilter(val); setMsgPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Status Envio" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ENVIADO">Enviado</SelectItem>
                  <SelectItem value="ENTREGUE">Entregue</SelectItem>
                  <SelectItem value="LIDO">Lido</SelectItem>
                  <SelectItem value="FALHOU">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mensagensPaginadas.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-45" />
                Nenhuma mensagem encontrada para o artesão.
              </div>
            ) : (
              <div className="space-y-2.5">
                {mensagensPaginadas.map((msg) => (
                  <div
                    key={msg.id}
                    className="group relative rounded-lg border bg-card p-3 shadow-sm hover:border-primary/50 transition cursor-pointer"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary transition">{msg.assunto}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{msg.conteudo}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {new Date(msg.enviadaEm).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>Canal: <strong className="text-foreground">{msg.canal}</strong></span>
                        <span>Remetente: <strong className="text-foreground">{msg.gestor?.nome || "Sistema"}</strong></span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${
                        msg.statusEnvio === "LIDO" ? "border-success text-success" : 
                        msg.statusEnvio === "ENTREGUE" ? "border-info text-info" :
                        msg.statusEnvio === "FALHOU" ? "border-destructive text-destructive" :
                        "border-muted text-muted-foreground"
                      }`}>
                        {msg.statusEnvio}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Paginação */}
                {totalMsgPages > 1 && (
                  <div className="flex items-center justify-between border-t pt-3.5 text-xs text-muted-foreground">
                    <span>Exibindo página <strong>{msgPage}</strong> de {totalMsgPages}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8" onClick={() => setMsgPage((p) => Math.max(1, p - 1))} disabled={msgPage === 1}>
                        Anterior
                      </Button>
                      <Button size="sm" variant="outline" className="h-8" onClick={() => setMsgPage((p) => Math.min(totalMsgPages, p + 1))} disabled={msgPage === totalMsgPages}>
                        Próximo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* ────────────────── AÇÕES DE CURADORIA ────────────────── */}
        {!showRejection ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Ações de Curadoria</Label>
              <Button onClick={openEditDialog} variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Edit2 className="h-3.5 w-3.5" /> Editar Perfil
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleApprove} disabled={actionLoading} className="bg-success text-success-foreground hover:bg-success/90 h-9">
                <Check className="mr-1.5 h-4 w-4" /> Aprovar
              </Button>
              <Button onClick={() => setShowRejection(true)} disabled={actionLoading} variant="destructive" className="h-9">
                <X className="mr-1.5 h-4 w-4" /> Rejeitar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 rounded-md border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-2 text-xs text-destructive">
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>O motivo será enviado via <strong>WhatsApp</strong> ao artesão.</span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="just" className="text-sm">Justificativa da Pendência <span className="text-destructive">*</span></Label>
              <Textarea
                id="just"
                rows={4}
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Descreva claramente o motivo (ex: documentação incompleta, fotos fora do padrão, etc.)..."
                maxLength={500}
              />
              <p className="text-right text-xs text-muted-foreground">{justificativa.length}/500</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setShowRejection(false); setJustificativa(""); }}>Cancelar</Button>
              <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
                {actionLoading ? "Enviando..." : "Confirmar Rejeição e Enviar"}
              </Button>
            </div>
          </div>
        )}

        {/* ─── MODAL 1: PREVIEW DO DOCUMENTO ─── */}
        <Dialog open={!!previewDoc} onOpenChange={(o) => !o && setPreviewDoc(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center mr-6">
                <span>Visualizar Documento: {previewDoc?.tipo}</span>
                <span className="text-xs text-muted-foreground font-normal">{previewDoc?.mimeType}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center border rounded-md bg-muted/10 p-2 min-h-[450px]">
              {previewDoc?.mimeType.startsWith("image/") ? (
                <img src={previewDoc.url} alt={previewDoc.tipo} className="max-w-full max-h-[550px] object-contain rounded-sm" />
              ) : previewDoc?.mimeType === "application/pdf" ? (
                <iframe src={previewDoc.url} title={previewDoc.tipo} className="w-full h-[500px] rounded-sm border-0" />
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <FileText className="mx-auto mb-4 h-16 w-16 opacity-40 text-primary" />
                  <p className="text-sm font-semibold">Pré-visualização indisponível para este formato.</p>
                  <p className="text-xs mt-1">Faça o download do arquivo para abrir localmente.</p>
                  <a href={previewDoc?.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                    <Button variant="outline"><Download className="mr-1.5 h-4 w-4" /> Download Anexo</Button>
                  </a>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setPreviewDoc(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── MODAL 2: DETALHES DA MENSAGEM ─── */}
        <Dialog open={!!selectedMessage} onOpenChange={(o) => !o && setSelectedMessage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-primary border-b pb-2">{selectedMessage?.assunto}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 text-xs border bg-muted/10 p-2.5 rounded-md">
                <div>
                  <p className="text-muted-foreground uppercase text-[9px]">Canal</p>
                  <p className="font-semibold">{selectedMessage?.canal}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-[9px]">Status</p>
                  <p className="font-semibold">{selectedMessage?.statusEnvio}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-[9px]">Remetente</p>
                  <p className="font-semibold">{selectedMessage?.gestor?.nome || "Sistema"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-[9px]">Data Envio</p>
                  <p className="font-semibold">
                    {selectedMessage?.enviadaEm ? new Date(selectedMessage.enviadaEm).toLocaleString("pt-BR") : "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-[10px] uppercase">Conteúdo</p>
                <div className="bg-muted/30 p-3 rounded-md text-sm whitespace-pre-wrap border font-sans leading-relaxed">
                  {selectedMessage?.conteudo}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedMessage(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── MODAL 3: EDIÇÃO DE DADOS ─── */}
        <Dialog open={showEditModal} onOpenChange={(o) => !o && setShowEditModal(false)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Informações do Artesão</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit} className="space-y-5 py-2">
              {/* Seção 1: Pessoais */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">Dados Pessoais</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="edit-nome">Nome Completo <span className="text-destructive">*</span></Label>
                    <Input id="edit-nome" value={editForm.nome || ""} onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-cpf">CPF <span className="text-destructive">*</span></Label>
                    <Input id="edit-cpf" value={editForm.cpf || ""} onChange={(e) => setEditForm(prev => ({ ...prev, cpf: e.target.value }))} required maxLength={11} placeholder="Apenas números" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-rg">RG</Label>
                    <Input id="edit-rg" value={editForm.rg || ""} onChange={(e) => setEditForm(prev => ({ ...prev, rg: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-nascimento">Data de Nascimento</Label>
                    <Input
                      id="edit-nascimento"
                      type="date"
                      value={editForm.dataNascimento ? editForm.dataNascimento.split("T")[0] : ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, dataNascimento: e.target.value ? `${e.target.value}T00:00:00` : null }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-email">E-mail</Label>
                    <Input id="edit-email" type="email" value={editForm.email || ""} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-telefone">Telefone <span className="text-destructive">*</span></Label>
                    <Input id="edit-telefone" value={editForm.telefone || ""} onChange={(e) => setEditForm(prev => ({ ...prev, telefone: e.target.value }))} required />
                  </div>
                </div>
              </div>

              {/* Seção 2: Endereço */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">Endereço</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor="edit-logradouro">Logradouro / Rua</Label>
                    <Input id="edit-logradouro" value={editForm.logradouro || ""} onChange={(e) => setEditForm(prev => ({ ...prev, logradouro: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-numero">Número</Label>
                    <Input id="edit-numero" value={editForm.numero || ""} onChange={(e) => setEditForm(prev => ({ ...prev, numero: e.target.value }))} />
                  </div>
                  <div className="space-y-1 col-span-3 sm:col-span-1">
                    <Label htmlFor="edit-complemento">Complemento</Label>
                    <Input id="edit-complemento" value={editForm.complemento || ""} onChange={(e) => setEditForm(prev => ({ ...prev, complemento: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-bairro">Bairro</Label>
                    <Input id="edit-bairro" value={editForm.bairro || ""} onChange={(e) => setEditForm(prev => ({ ...prev, bairro: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-cidade">Cidade</Label>
                    <Input id="edit-cidade" value={editForm.cidade || ""} onChange={(e) => setEditForm(prev => ({ ...prev, cidade: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-uf">UF</Label>
                    <Input id="edit-uf" value={editForm.uf || ""} onChange={(e) => setEditForm(prev => ({ ...prev, uf: e.target.value }))} maxLength={2} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-cep">CEP</Label>
                    <Input id="edit-cep" value={editForm.cep || ""} onChange={(e) => setEditForm(prev => ({ ...prev, cep: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Seção 3: Marca */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">Marca / Produto</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="edit-marca">Nome da Marca</Label>
                    <Input id="edit-marca" value={editForm.nomeMarca || ""} onChange={(e) => setEditForm(prev => ({ ...prev, nomeMarca: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-segmento">Segmento <span className="text-destructive">*</span></Label>
                    <Select value={editForm.segmento} onValueChange={(val: "ARTESANATO" | "GASTRONOMIA") => setEditForm(prev => ({ ...prev, segmento: val }))}>
                      <SelectTrigger><SelectValue placeholder="Escolha o segmento" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARTESANATO">ARTESANATO</SelectItem>
                        <SelectItem value="GASTRONOMIA">GASTRONOMIA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-categoria">Categoria do Produto</Label>
                    <Input id="edit-categoria" value={editForm.categoriaProduto || ""} onChange={(e) => setEditForm(prev => ({ ...prev, categoriaProduto: e.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-instagram">Instagram</Label>
                    <Input id="edit-instagram" value={editForm.instagram || ""} onChange={(e) => setEditForm(prev => ({ ...prev, instagram: e.target.value }))} placeholder="@username" />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor="edit-desc">Descrição dos Produtos ou Serviços</Label>
                    <Textarea id="edit-desc" value={editForm.descricaoProduto || ""} onChange={(e) => setEditForm(prev => ({ ...prev, descricaoProduto: e.target.value }))} rows={3} />
                  </div>
                </div>
              </div>

              {/* Seção 4: Formalização */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b pb-1">Formalização</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      id="edit-mei"
                      type="checkbox"
                      checked={!!editForm.possuiMEI}
                      onChange={(e) => setEditForm(prev => ({ ...prev, possuiMEI: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="edit-mei" className="text-sm font-medium cursor-pointer">Possui MEI (Formalizado)</Label>
                  </div>
                  {editForm.possuiMEI && (
                    <div className="grid gap-3 sm:grid-cols-2 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="space-y-1">
                        <Label htmlFor="edit-cnpj">CNPJ</Label>
                        <Input id="edit-cnpj" value={editForm.cnpj || ""} onChange={(e) => setEditForm(prev => ({ ...prev, cnpj: e.target.value }))} placeholder="Apenas números" maxLength={14} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="edit-razao">Razão Social</Label>
                        <Input id="edit-razao" value={editForm.razaoSocial || ""} onChange={(e) => setEditForm(prev => ({ ...prev, razaoSocial: e.target.value }))} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
        <Icon className="h-4 w-4 text-primary opacity-80" />
        {title}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border bg-muted/10 p-4 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, sensitive, full }: { label: string; value: string; sensitive?: boolean; full?: boolean }) {
  return (
    <div className={full ? "col-span-2 space-y-0.5" : "space-y-0.5"}>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</p>
      <p className={`text-sm ${sensitive ? "font-mono font-medium" : "text-foreground font-sans"}`}>{value || "—"}</p>
    </div>
  );
}
