import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, X, Clock, FileText, Image as ImageIcon, AlertTriangle, MapPin, IdCard, Briefcase, Sparkles, CalendarDays, MessageCircle } from "lucide-react";
import type { Artesao } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function statusVariant(status: string) {
  switch (status) {
    case "Aprovado": return "bg-success/15 text-success border-success/30";
    case "Rejeitado": return "bg-destructive/10 text-destructive border-destructive/30";
    case "Em Análise": return "bg-info/10 text-info border-info/30";
    default: return "bg-warning/15 text-warning-foreground border-warning/40";
  }
}

interface Props {
  artesao: Artesao | null;
  open: boolean;
  onClose: () => void;
}

export function ArtesaoDetailPanel({ artesao, open, onClose }: Props) {
  const updateStatus = useAppStore((s) => s.updateStatus);
  const [showRejection, setShowRejection] = useState(false);
  const [justificativa, setJustificativa] = useState("");

  const handleApprove = () => {
    if (!artesao) return;
    updateStatus(artesao.id, "Aprovado");
    toast.success(`${artesao.nome} aprovado(a). WhatsApp de confirmação enviado.`);
    onClose();
  };
  const handleAnalise = () => {
    if (!artesao) return;
    updateStatus(artesao.id, "Em Análise");
    toast.info(`${artesao.nome} movido(a) para Em Análise.`);
    onClose();
  };
  const handleReject = () => {
    if (!artesao) return;
    if (justificativa.trim().length < 10) {
      toast.error("A justificativa deve ter ao menos 10 caracteres.");
      return;
    }
    updateStatus(artesao.id, "Rejeitado", justificativa.trim());
    toast.success(`Inscrição rejeitada. WhatsApp enviado a ${artesao.nome}.`);
    setShowRejection(false);
    setJustificativa("");
    onClose();
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
                <span className="font-mono text-xs">{artesao.id}</span>
                <span>·</span>
                <span>{artesao.marca.nome}</span>
              </SheetDescription>
            </div>
            <Badge variant="outline" className={statusVariant(artesao.status)}>{artesao.status}</Badge>
          </div>
        </SheetHeader>

        <Tabs defaultValue="dados" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dados">Dados Cadastrais</TabsTrigger>
            <TabsTrigger value="anexos">Anexos</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Feiras</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-5 pt-4">
            <Section icon={IdCard} title="Dados Pessoais">
              <Field label="Nome completo" value={artesao.nome} />
              <Field label="CPF" value={artesao.cpf} sensitive />
              <Field label="RG" value={artesao.rg} sensitive />
              <Field label="Data de Nasc." value={new Date(artesao.dataNascimento).toLocaleDateString("pt-BR")} />
              <Field label="Gênero" value={artesao.genero} />
              <Field label="Cor/Raça (IBGE)" value={artesao.corRaca} />
              <Field label="E-mail" value={artesao.email} />
              <Field label="Telefone" value={artesao.telefone} />
            </Section>

            <Section icon={MapPin} title="Endereço">
              <Field label="Logradouro" value={`${artesao.endereco.rua}, ${artesao.endereco.numero}`} />
              <Field label="Bairro" value={artesao.endereco.bairro} />
              <Field label="Cidade" value={artesao.endereco.cidade} />
              <Field label="CEP" value={artesao.endereco.cep} />
            </Section>

            <Section icon={Sparkles} title="Marca / Produto">
              <Field label="Nome da marca" value={artesao.marca.nome} />
              <Field label="Categoria" value={artesao.marca.categoria} />
              {artesao.marca.instagram && <Field label="Instagram" value={artesao.marca.instagram} />}
              <Field label="Descrição" value={artesao.marca.descricao} full />
            </Section>

            <Section icon={Briefcase} title="Formalização">
              <Field label="Possui MEI" value={artesao.formalizacao.possuiMei ? "Sim" : "Não"} />
              {artesao.formalizacao.possuiMei && (
                <>
                  <Field label="CNPJ" value={artesao.formalizacao.cnpj ?? "—"} sensitive />
                  <Field label="Razão Social" value={artesao.formalizacao.razaoSocial ?? "—"} />
                </>
              )}
            </Section>
          </TabsContent>

          <TabsContent value="anexos" className="space-y-3 pt-4">
            <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-foreground">
              <AlertTriangle className="h-4 w-4 shrink-0 text-warning-foreground" />
              <p>Uploads restritos a <strong>PDF, JPG e PNG (Máx 5MB)</strong>. Arquivos fora do padrão são automaticamente bloqueados.</p>
            </div>
            <ul className="divide-y rounded-md border bg-card">
              {artesao.anexos.map((a) => (
                <li key={a.nome} className="flex items-center gap-3 p-3">
                  {a.tipo === "PDF" ? (
                    <FileText className="h-5 w-5 text-destructive" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-info" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{a.nome}</p>
                    <p className="text-xs text-muted-foreground">{a.tipo} · {a.tamanho}</p>
                  </div>
                  <Button variant="outline" size="sm">Visualizar</Button>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="historico" className="space-y-3 pt-4">
            {artesao.historicoFeiras.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                <CalendarDays className="mx-auto mb-2 h-8 w-8 opacity-50" />
                Nenhuma participação registrada. Artesão tem prioridade no rodízio.
              </div>
            ) : (
              <ul className="space-y-2">
                {artesao.historicoFeiras.map((f, i) => (
                  <li key={i} className="rounded-md border bg-card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{f.feira}</p>
                      <span className="text-xs text-muted-foreground">{new Date(f.data).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{f.local}</p>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {!showRejection ? (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Ações de Curadoria</Label>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleApprove} className="bg-success text-success-foreground hover:bg-success/90">
                <Check className="mr-1.5 h-4 w-4" /> Aprovar
              </Button>
              <Button onClick={handleAnalise} variant="outline" className="border-info/40 text-info hover:bg-info/10 hover:text-info">
                <Clock className="mr-1.5 h-4 w-4" /> Mover para Em Análise
              </Button>
              <Button onClick={() => setShowRejection(true)} variant="destructive">
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
              <Button variant="destructive" onClick={handleReject}>
                Confirmar Rejeição e Enviar
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
