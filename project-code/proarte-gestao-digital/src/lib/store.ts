/**
 * Estado global via Zustand — integrado com a API Spring Boot.
 *
 * Cada ação chama o api-client e atualiza o estado com a resposta da API.
 * A leitura de dados é feita via fetch na montagem dos componentes,
 * e o estado local é atualizado otimisticamente quando possível.
 */
import { create } from "zustand";
import {
  login as apiLogin,
  listarArtesaos,
  listarFeiras,
  getRankingRodizio,
  aprovarArtesao as apiAprovarArtesao,
  rejeitarArtesao as apiRejeitarArtesao,
  criarFeira as apiCriarFeira,
  alocarArtesaoNaFeira,
  atualizarArtesao as apiAtualizarArtesao,
  setAccessToken,
  adicionarCurso as apiAdicionarCurso,
  deletarCurso as apiDeletarCurso,
  listarMensagens,
  enviarMensagemMassa,
  type ArtesaoApi,
  type FeiraApi,
  type RodizioRankingItem,
  type LoginResponse,
  type CursoApi,
  type MensagemResumidaApi,
} from "./api-client";

// Tipos para compatibilidade com os componentes existentes
export type Status = "EM_ANALISE" | "APROVADO" | "REPROVADO";

export interface MensagemLog {
  id: string;
  tipo: "Convocação" | "Rejeição" | "Aprovação" | "Comunicado";
  destinatario: string;
  resumo: string;
  data: string;
  status: "Enviado" | "Entregue" | "Lido";
}

interface AppState {
  // Auth
  authenticated: boolean;
  userName: string;
  accessToken: string | null;

  // Data (vem da API)
  artesaos: ArtesaoApi[];
  feiras: FeiraApi[];
  ranking: RodizioRankingItem[];
  logs: MensagemLog[];

  // Loading states
  loading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;

  // Data fetching
  fetchArtesaos: (filtros?: Record<string, string>) => Promise<void>;
  fetchFeiras: () => Promise<void>;
  fetchRanking: (feiraId: string) => Promise<void>;
  fetchLogs: () => Promise<void>;

  // Mutations
  aprovarArtesao: (id: number) => Promise<void>;
  rejeitarArtesao: (id: number, justificativa: string) => Promise<void>;
  addFeira: (f: {
    nome: string;
    data: string;
    local: string;
    limiteVagas: number;
  }) => Promise<void>;
  alocar: (feiraId: string, artesaoId: number) => Promise<void>;
  editarArtesao: (id: number, dados: Partial<ArtesaoApi>) => Promise<ArtesaoApi>;
  adicionarCurso: (artesaoId: number, nome: string, dataConclusao: string) => Promise<void>;
  deletarCurso: (artesaoId: number, cursoId: number) => Promise<void>;
  dispararMensagemMassa: (dados: {
    artesaoIds: number[];
    assunto: string;
    conteudo: string;
    tipo: string;
  }) => Promise<void>;

  // Local log (mensageria page — UI-only)
  addLog: (log: Omit<MensagemLog, "id" | "data" | "status">) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ─── Initial State ──────────────────────────────────────────────────────
  authenticated: false,
  userName: "",
  accessToken: null,
  artesaos: [],
  feiras: [],
  ranking: [],
  logs: [],
  loading: false,
  error: null,

  // ─── Auth ───────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiLogin(email, password);
      set({
        authenticated: true,
        userName: data.nome,
        accessToken: data.accessToken,
        loading: false,
      });
      return data;
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
      throw err;
    }
  },

  logout: () => {
    setAccessToken(null);
    set({
      authenticated: false,
      userName: "",
      accessToken: null,
      artesaos: [],
      feiras: [],
      ranking: [],
    });
  },

  // ─── Data Fetching ──────────────────────────────────────────────────────
  fetchArtesaos: async (filtros) => {
    set({ loading: true, error: null });
    try {
      const artesaos = await listarArtesaos(filtros);
      set({ artesaos, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  fetchFeiras: async () => {
    set({ loading: true, error: null });
    try {
      const feiras = await listarFeiras();
      set({ feiras, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  fetchRanking: async (feiraId) => {
    set({ loading: true, error: null });
    try {
      const ranking = await getRankingRodizio(feiraId);
      set({ ranking, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      const msgs = await listarMensagens();
      const logsMapped: MensagemLog[] = msgs.map((m) => {
        let tipoLabel: MensagemLog["tipo"] = "Comunicado";
        if (m.tipo === "CONVOCACAO") tipoLabel = "Convocação";
        else if (m.tipo === "REJEICAO") tipoLabel = "Rejeição";
        else if (m.tipo === "APROVACAO") tipoLabel = "Aprovação";

        return {
          id: m.id,
          tipo: tipoLabel,
          destinatario: m.nomeArtesao,
          resumo: `${m.assunto} — ${m.conteudo}`,
          data: new Date(m.enviadaEm).toLocaleString("pt-BR"),
          status: "Enviado" as const,
        };
      });
      set({ logs: logsMapped, loading: false });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  // ─── Mutations ──────────────────────────────────────────────────────────
  aprovarArtesao: async (id) => {
    await apiAprovarArtesao(id);
    // Atualizar otimisticamente
    set((s) => ({
      artesaos: s.artesaos.map((a) =>
        a.id === id ? { ...a, statusCuradoria: "APROVADO" as const } : a
      ),
      logs: [
        {
          id: `MSG-${Date.now()}`,
          tipo: "Aprovação" as const,
          destinatario:
            s.artesaos.find((a) => a.id === id)?.nome ?? "Artesão",
          resumo: "Cadastro aprovado no PRODARTE",
          data: new Date().toLocaleString("pt-BR"),
          status: "Enviado" as const,
        },
        ...s.logs,
      ],
    }));
  },

  rejeitarArtesao: async (id, justificativa) => {
    await apiRejeitarArtesao(id, justificativa);
    set((s) => ({
      artesaos: s.artesaos.map((a) =>
        a.id === id ? { ...a, statusCuradoria: "REPROVADO" as const } : a
      ),
      logs: [
        {
          id: `MSG-${Date.now()}`,
          tipo: "Rejeição" as const,
          destinatario:
            s.artesaos.find((a) => a.id === id)?.nome ?? "Artesão",
          resumo: `Inscrição rejeitada: ${justificativa.slice(0, 60)}${justificativa.length > 60 ? "..." : ""}`,
          data: new Date().toLocaleString("pt-BR"),
          status: "Enviado" as const,
        },
        ...s.logs,
      ],
    }));
  },

  addFeira: async (f) => {
    const novaFeira = await apiCriarFeira(f);
    set((s) => ({ feiras: [...s.feiras, novaFeira] }));
  },

  alocar: async (feiraId, artesaoId) => {
    await alocarArtesaoNaFeira(feiraId, artesaoId);
    // Atualizar otimisticamente: decrementar vagasRestantes
    const state = get();
    set({
      feiras: state.feiras.map((f) =>
        f.id === feiraId
          ? { ...f, vagasRestantes: f.vagasRestantes - 1 }
          : f
      ),
      ranking: state.ranking.map((r) =>
        r.id === artesaoId ? { ...r, jaAlocadoNaFeira: true } : r
      ),
      logs: [
        {
          id: `MSG-${Date.now()}`,
          tipo: "Convocação" as const,
          destinatario:
            state.ranking.find((r) => r.id === artesaoId)?.nome ?? "Artesão",
          resumo: `Convocação para ${state.feiras.find((f) => f.id === feiraId)?.nome ?? "feira"}`,
          data: new Date().toLocaleString("pt-BR"),
          status: "Enviado" as const,
        },
        ...state.logs,
      ],
    });
  },

  editarArtesao: async (id, dados) => {
    const atualizado = await apiAtualizarArtesao(id, dados);
    set((s) => ({
      artesaos: s.artesaos.map((a) => (a.id === id ? { ...a, ...atualizado } : a)),
    }));
    return atualizado;
  },

  adicionarCurso: async (artesaoId, nome, dataConclusao) => {
    const novoCurso = await apiAdicionarCurso(artesaoId, nome, dataConclusao);
    set((s) => ({
      artesaos: s.artesaos.map((a) =>
        a.id === artesaoId
          ? { ...a, cursos: [...(a.cursos ?? []), novoCurso] }
          : a
      ),
    }));
  },

  deletarCurso: async (artesaoId, cursoId) => {
    await apiDeletarCurso(cursoId);
    set((s) => ({
      artesaos: s.artesaos.map((a) =>
        a.id === artesaoId
          ? { ...a, cursos: (a.cursos ?? []).filter((c) => c.id !== cursoId) }
          : a
      ),
    }));
  },

  dispararMensagemMassa: async (dados) => {
    set({ loading: true, error: null });
    try {
      await enviarMensagemMassa(dados);
      set({ loading: false });
      await get().fetchLogs();
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
      throw err;
    }
  },

  // ─── Logs (UI-only para mensageria) ─────────────────────────────────────
  addLog: (log) =>
    set((s) => ({
      logs: [
        {
          ...log,
          id: `MSG-${Date.now()}`,
          data: new Date().toLocaleString("pt-BR"),
          status: "Enviado" as const,
        },
        ...s.logs,
      ],
    })),
}));
