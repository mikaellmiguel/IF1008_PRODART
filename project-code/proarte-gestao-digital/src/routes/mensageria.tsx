import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MessageSquare, Users, History, CheckCheck, Check, Clock, Filter as FilterIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { statusList } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/mensageria")({
  head: () => ({ meta: [{ title: "Mensageria WhatsApp — PRODARTE" }] }),
  component: MensageriaPage,
});

function MensageriaPage() {
  const { artesaos, feiras, logs, addLog } = useAppStore();
  const [feiraFilter, setFeiraFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("Aprovado");
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const destinatarios = useMemo(() => {
    let list = artesaos;
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (feiraFilter !== "all") {
      const feira = feiras.find((f) => f.id === feiraFilter);
      if (feira) list = list.filter((a) => feira.alocados.includes(a.id));
    }
    return list;
  }, [artesaos, feiras, feiraFilter, statusFilter]);

  const handleSend = () => {
    if (!titulo.trim() || !mensagem.trim()) {
      toast.error("Preencha o título e a mensagem.");
      return;
    }
    if (destinatarios.length === 0) {
      toast.error("Nenhum destinatário corresponde aos filtros.");
      return;
    }
    addLog({
      tipo: "Comunicado",
      destinatario: `${destinatarios.length} artesão(s)`,
      resumo: `${titulo} — ${mensagem.slice(0, 50)}${mensagem.length > 50 ? "..." : ""}`,
    });
    toast.success(`Mensagem enviada via WhatsApp para ${destinatarios.length} destinatário(s).`);
    setTitulo(""); setMensagem("");
  };

  return (
    <AppLayout title="Mensageria em Massa — Integração WhatsApp API">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Composer */}
        <div className="space-y-5 lg:col-span-2">
          {/* Filtros */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FilterIcon className="h-4 w-4 text-primary" />
              Lista de Transmissão
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Filtrar por Feira</Label>
                <Select value={feiraFilter} onValueChange={setFeiraFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as feiras</SelectItem>
                    {feiras.map((f) => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Filtrar por Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {statusList.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-success">
                <Users className="h-4 w-4" />
                <strong>{destinatarios.length}</strong> destinatário(s) selecionados
              </span>
              <div className="flex flex-wrap gap-1.5">
                {destinatarios.slice(0, 3).map((d) => (
                  <Badge key={d.id} variant="outline" className="border-success/30 bg-card text-xs">{d.nome.split(" ")[0]}</Badge>
                ))}
                {destinatarios.length > 3 && (
                  <Badge variant="outline" className="border-success/30 bg-card text-xs">+{destinatarios.length - 3}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Composição */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-primary" />
              Composição da Mensagem
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="tit">Título / Assunto</Label>
                <Input id="tit" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Convocação Feira de São João 2026" maxLength={80} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg">Mensagem</Label>
                <Textarea id="msg" rows={6} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Digite o texto que será enviado via WhatsApp..." maxLength={1000} />
                <p className="text-right text-xs text-muted-foreground">{mensagem.length}/1000</p>
              </div>

              {/* Preview */}
              {(titulo || mensagem) && (
                <div className="rounded-lg border border-success/30 bg-[oklch(0.97_0.04_140)] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-success">Preview WhatsApp</p>
                  <div className="mt-2 max-w-sm rounded-lg rounded-tl-none bg-card p-3 shadow-sm">
                    {titulo && <p className="text-sm font-semibold">{titulo}</p>}
                    {mensagem && <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{mensagem}</p>}
                    <p className="mt-1.5 text-right text-[10px] text-muted-foreground">PRODARTE · agora</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSend} className="bg-success text-success-foreground hover:bg-success/90">
                  <Send className="mr-1.5 h-4 w-4" /> Disparar para {destinatarios.length}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b p-4">
            <History className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Histórico Recente</h3>
          </div>
          <ul className="max-h-[700px] divide-y overflow-y-auto">
            {logs.map((log) => (
              <li key={log.id} className="p-3 transition-colors hover:bg-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className={tipoColor(log.tipo)}>{log.tipo}</Badge>
                  <StatusIcon status={log.status} />
                </div>
                <p className="mt-1.5 text-sm font-medium">{log.destinatario}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{log.resumo}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{log.data}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}

function tipoColor(tipo: string) {
  switch (tipo) {
    case "Convocação": return "border-success/40 bg-success/10 text-success";
    case "Rejeição": return "border-destructive/40 bg-destructive/10 text-destructive";
    case "Aprovação": return "border-info/40 bg-info/10 text-info";
    default: return "border-warning/40 bg-warning/10 text-warning-foreground";
  }
}

function StatusIcon({ status }: { status: string }) {
  if (status === "Lido") return <CheckCheck className="h-3.5 w-3.5 text-info" />;
  if (status === "Entregue") return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
  if (status === "Enviado") return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
  return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
}
