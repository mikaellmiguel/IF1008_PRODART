// Estado global simples via Zustand-like pattern usando React Context
import { create } from "zustand";
import { artesaos as initialArtesaos, feirasIniciais, logsIniciais, type Artesao, type Feira, type MensagemLog, type Status } from "./mock-data";

interface AppState {
  authenticated: boolean;
  userName: string;
  artesaos: Artesao[];
  feiras: Feira[];
  logs: MensagemLog[];
  login: (name: string) => void;
  logout: () => void;
  updateStatus: (id: string, status: Status, justificativa?: string) => void;
  addFeira: (f: Omit<Feira, "id" | "vagasOcupadas" | "alocados">) => void;
  alocar: (feiraId: string, artesaoId: string, artesaoNome: string) => void;
  addLog: (log: Omit<MensagemLog, "id" | "data" | "status">) => void;
}

export const useAppStore = create<AppState>((set) => ({
  authenticated: false,
  userName: "",
  artesaos: initialArtesaos,
  feiras: feirasIniciais,
  logs: logsIniciais,
  login: (name) => set({ authenticated: true, userName: name }),
  logout: () => set({ authenticated: false, userName: "" }),
  updateStatus: (id, status, justificativa) =>
    set((s) => {
      const artesao = s.artesaos.find((a) => a.id === id);
      const newLogs = [...s.logs];
      if (artesao) {
        if (status === "Rejeitado" && justificativa) {
          newLogs.unshift({
            id: `MSG-${Date.now()}`,
            tipo: "Rejeição",
            destinatario: artesao.nome,
            resumo: `Inscrição rejeitada: ${justificativa.slice(0, 60)}${justificativa.length > 60 ? "..." : ""}`,
            data: new Date().toLocaleString("pt-BR"),
            status: "Enviado",
          });
        } else if (status === "Aprovado") {
          newLogs.unshift({
            id: `MSG-${Date.now()}`,
            tipo: "Aprovação",
            destinatario: artesao.nome,
            resumo: "Cadastro aprovado no PRODARTE",
            data: new Date().toLocaleString("pt-BR"),
            status: "Enviado",
          });
        }
      }
      return {
        artesaos: s.artesaos.map((a) => (a.id === id ? { ...a, status } : a)),
        logs: newLogs,
      };
    }),
  addFeira: (f) =>
    set((s) => ({
      feiras: [
        ...s.feiras,
        { ...f, id: `FEIRA-${Date.now()}`, vagasOcupadas: 0, alocados: [] },
      ],
    })),
  alocar: (feiraId, artesaoId, artesaoNome) =>
    set((s) => ({
      feiras: s.feiras.map((f) =>
        f.id === feiraId && !f.alocados.includes(artesaoId) && f.vagasOcupadas < f.totalVagas
          ? { ...f, vagasOcupadas: f.vagasOcupadas + 1, alocados: [...f.alocados, artesaoId] }
          : f
      ),
      artesaos: s.artesaos.map((a) =>
        a.id === artesaoId ? { ...a, ultimaParticipacao: new Date().toISOString().slice(0, 10) } : a
      ),
      logs: [
        {
          id: `MSG-${Date.now()}`,
          tipo: "Convocação",
          destinatario: artesaoNome,
          resumo: `Convocação para ${s.feiras.find((f) => f.id === feiraId)?.nome ?? "feira"}`,
          data: new Date().toLocaleString("pt-BR"),
          status: "Enviado",
        },
        ...s.logs,
      ],
    })),
  addLog: (log) =>
    set((s) => ({
      logs: [
        { ...log, id: `MSG-${Date.now()}`, data: new Date().toLocaleString("pt-BR"), status: "Enviado" },
        ...s.logs,
      ],
    })),
}));
