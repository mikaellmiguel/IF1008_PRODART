import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, X, AlertTriangle, MapPin, IdCard, Briefcase, Sparkles, MessageCircle } from "lucide-react";
import type { ArtesaoApi } from "@/lib/api-client";
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

/** Converte o enum da API para texto legível em português. */
export function statusLabel(status: string) {
  switch (status) {
    case "APROVADO": return "Aprovado";
    case "REPROVADO": return "Rejeitado";
    case "EM_ANALISE": return "Em Análise";
    default: return status;
  }
}

interface Props {
  artesao: ArtesaoApi | null;
  open: boolean;
  onClose: () => void;
}

export function ArtesaoDetailPanel({ artesao, open, onClose }: Props) {
  const { aprovarArtesao, rejeitarArtesao } = useAppStore();
  const [showRejection, setShowRejection] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleClose = () => {
    setShowRejection(false);
    setJustificativa("");
    onClose();
  };

  if (!artesao) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="space-y-2 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-xl">{artesao.nome}</SheetTitle>
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

        <Tabs defaultValue="dados" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados">Dados Cadastrais</TabsTrigger>
            <TabsTrigger value="negocio">Marca / Negócio</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-5 pt-4">
            <Section icon={IdCard} title="Dados Pessoais">
              <Field label="Nome completo" value={artesao.nome} />
              <Field label="CPF" value={artesao.cpf} sensitive />
              {artesao.rg && <Field label="RG" value={artesao.rg} sensitive />}
              {artesao.dataNascimento && (
                <Field label="Data de Nasc." value={new Date(artesao.dataNascimento).toLocaleDateString("pt-BR")} />
              )}
              {artesao.email && <Field label="E-mail" value={artesao.email} />}
              <Field label="Telefone" value={artesao.telefone} />
            </Section>

            <Section icon={MapPin} title="Endereço">
              {artesao.logradouro && (
                <Field label="Logradouro" value={`${artesao.logradouro}${artesao.numero ? `, ${artesao.numero}` : ""}`} />
              )}
              {artesao.bairro && <Field label="Bairro" value={artesao.bairro} />}
              {artesao.cidade && <Field label="Cidade" value={`${artesao.cidade}${artesao.uf ? ` - ${artesao.uf}` : ""}`} />}
              {artesao.cep && <Field label="CEP" value={artesao.cep} />}
              {!artesao.logradouro && !artesao.bairro && !artesao.cidade && (
                <p className="col-span-2 text-xs text-muted-foreground">Endereço não informado.</p>
              )}
            </Section>
          </TabsContent>

          <TabsContent value="negocio" className="space-y-5 pt-4">
            <Section icon={Sparkles} title="Marca / Produto">
              {artesao.nomeMarca && <Field label="Nome da marca" value={artesao.nomeMarca} />}
              <Field label="Segmento" value={artesao.segmento} />
              {artesao.categoriaProduto && <Field label="Categoria" value={artesao.categoriaProduto} />}
              {artesao.instagram && <Field label="Instagram" value={artesao.instagram} />}
              {artesao.descricaoProduto && <Field label="Descrição" value={artesao.descricaoProduto} full />}
            </Section>

            <Section icon={Briefcase} title="Formalização">
              <Field label="Possui MEI" value={artesao.possuiMEI ? "Sim" : "Não"} />
              {artesao.possuiMEI && (
                <>
                  {artesao.cnpj && <Field label="CNPJ" value={artesao.cnpj} sensitive />}
                  {artesao.razaoSocial && <Field label="Razão Social" value={artesao.razaoSocial} />}
                </>
              )}
            </Section>

            <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 opacity-40" />
              Documentos e anexos disponíveis no sistema EMPREL (integração pendente).
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {!showRejection ? (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Ações de Curadoria</Label>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleApprove} disabled={actionLoading} className="bg-success text-success-foreground hover:bg-success/90">
                <Check className="mr-1.5 h-4 w-4" /> Aprovar
              </Button>
              <Button onClick={() => setShowRejection(true)} disabled={actionLoading} variant="destructive">
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
      </SheetContent>
    </Sheet>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border bg-muted/30 p-3">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, sensitive, full }: { label: string; value: string; sensitive?: boolean; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-sm ${sensitive ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
