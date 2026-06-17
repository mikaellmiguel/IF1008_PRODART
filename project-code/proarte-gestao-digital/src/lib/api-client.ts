/**
 * Cliente HTTP centralizado para comunicação com a API Spring Boot.
 *
 * Gerencia:
 * - URL base da API (http://localhost:8080)
 * - Interceptor de JWT (Authorization: Bearer) em chamadas autenticadas
 * - Funções tipadas por recurso (artesão, feira, curadoria, rodízio)
 */

// ─── Configuração ────────────────────────────────────────────────────────────

const API_BASE_URL = "http://localhost:8080";

// ─── Tipos de resposta da API ────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  email: string;
  nome: string;
}

export interface DocumentoApi {
  id: string;
  tipo: "RG" | "CPF" | "COMPROVANTE_RESIDENCIA" | "PORTFOLIO" | "MEI" | "OUTRO";
  url: string;
  mimeType: string;
  tamanhoBytes: number;
  status: "PENDENTE" | "APROVADO" | "REJEITADO";
  criadoEm: string;
}

export interface CursoApi {
  id: number;
  nome: string;
  dataConclusao: string;
}

export interface MensagemApi {
  id: string;
  assunto: string;
  gestor: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
  } | null;
  tipo: "REJEICAO" | "CONVOCACAO" | "APROVACAO" | "INDIVIDUAL" | "MASSA" | "COMUNICADO";
  conteudo: string;
  enviadaEm: string;
}

export interface ArtesaoApi {
  id: number;
  nome: string;
  cpf: string;
  rg: string | null;
  dataNascimento: string | null;
  telefone: string;
  email: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  nomeMarca: string | null;
  segmento: "ARTESANATO" | "GASTRONOMIA";
  descricaoProduto: string | null;
  instagram: string | null;
  categoriaProduto: string | null;
  possuiMEI: boolean;
  cnpj: string | null;
  razaoSocial: string | null;
  statusCuradoria: "EM_ANALISE" | "APROVADO" | "REPROVADO";
  dataInscricao: string;
  atualizadoEm: string;
  documentos?: DocumentoApi[];
  mensagens?: MensagemApi[];
  alocacoes?: AlocacaoApi[];
  cursos?: CursoApi[];
}

export interface FeiraApi {
  id: string;
  nome: string;
  data: string;
  local: string;
  limiteVagas: number;
  vagasRestantes: number;
  criadaEm: string;
  atualizadaEm: string;
  alocacoes?: AlocacaoApi[];
}

export interface AlocacaoApi {
  id: string;
  artesao: {
    id: number;
    nome: string;
    nomeMarca: string | null;
    segmento: string;
    categoria: string | null;
    telefone: string;
    email: string | null;
    categoriaProduto: string | null;
  };
  feira: {
    id: string;
    nome: string;
    data: string;
    local: string;
  };
  status: "ALOCADO" | "CANCELADO";
  criadaEm: string;
}

export interface RodizioRankingItem {
  id: number;
  nome: string;
  nomeMarca: string | null;
  segmento: string | null;
  categoriaProduto: string | null;
  telefone: string;
  email: string | null;
  ultimaAlocacao: string | null;
  diasInativo: number;
  scoreJustica: number;
  posicao: number;
  jaAlocadoNaFeira: boolean;
  dataAlocacao: string | null;
  dataFeiraFutura: string | null;
  dataUltimoCurso: string | null;
}

export interface FiltrosArtesao {
  nome?: string;
  email?: string;
  segmento?: string;
  telefone?: string;
  bairro?: string;
  possuiMei?: boolean;
  statusCuradoria?: string;
  estado?: string;
  categoria?: string;
}

// ─── Token Management ────────────────────────────────────────────────────────

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

// ─── Fetch wrapper ───────────────────────────────────────────────────────────

async function apiFetch<T>(
  caminho: string,
  opcoes?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const { skipAuth, ...fetchOpts } = opcoes ?? {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOpts.headers as Record<string, string>),
  };

  if (!skipAuth && _accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${caminho}`, {
    ...fetchOpts,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}`;
    try {
      const body = await response.json();
      if (body.message) errorMsg = body.message;
      if (body.erro) errorMsg = body.erro;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg);
  }

  // Algumas respostas são 200 sem corpo (ex: alocação)
  const text = await response.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

// ─── Autenticação ────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  _accessToken = data.accessToken;
  return data;
}

// ─── Artesãos ────────────────────────────────────────────────────────────────

export async function listarArtesaos(
  filtros?: FiltrosArtesao
): Promise<ArtesaoApi[]> {
  const params = new URLSearchParams();
  if (filtros) {
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
  }
  const query = params.toString();
  const url = `/artesao${query ? `?${query}` : ""}`;
  return apiFetch<ArtesaoApi[]>(url);
}

export async function getArtesao(id: number): Promise<ArtesaoApi> {
  return apiFetch<ArtesaoApi>(`/artesao/${id}`);
}

export async function atualizarArtesao(
  id: number,
  dados: Partial<ArtesaoApi>
): Promise<ArtesaoApi> {
  return apiFetch<ArtesaoApi>(`/artesao/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

// ─── Curadoria ───────────────────────────────────────────────────────────────

export async function aprovarArtesao(id: number): Promise<void> {
  await apiFetch<void>(`/curadoria/aprovar/${id}`, { method: "POST" });
}

export async function rejeitarArtesao(
  id: number,
  justificativa: string
): Promise<void> {
  await apiFetch<void>(`/curadoria/rejeitar/${id}`, {
    method: "POST",
    body: JSON.stringify({ justificativa }),
  });
}

export async function listarTiposMensagem(): Promise<string[]> {
  return apiFetch<string[]>("/mensagens/tipos");
}

// ─── Feiras ──────────────────────────────────────────────────────────────────

export async function listarFeiras(): Promise<FeiraApi[]> {
  return apiFetch<FeiraApi[]>("/feira");
}

export async function criarFeira(dados: {
  nome: string;
  data: string;
  local: string;
  limiteVagas: number;
}): Promise<FeiraApi> {
  return apiFetch<FeiraApi>("/feira", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export async function atualizarFeira(
  id: string,
  dados: Partial<{ nome: string; data: string; local: string; limiteVagas: number }>
): Promise<FeiraApi> {
  return apiFetch<FeiraApi>(`/feira/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  });
}

export async function alocarArtesaoNaFeira(
  feiraId: string,
  artesaoId: number
): Promise<void> {
  await apiFetch<void>(`/feira/${feiraId}/alocar/${artesaoId}`, {
    method: "POST",
  });
}

// ─── Rodízio ─────────────────────────────────────────────────────────────────

export async function getRankingRodizio(
  feiraId: string
): Promise<RodizioRankingItem[]> {
  return apiFetch<RodizioRankingItem[]>(
    `/rodizio/ranking?feiraId=${feiraId}`
  );
}

// ─── Cursos ──────────────────────────────────────────────────────────────────

export async function adicionarCurso(
  artesaoId: number,
  nome: string,
  dataConclusao: string
): Promise<CursoApi> {
  return apiFetch<CursoApi>("/curso", {
    method: "POST",
    body: JSON.stringify({ artesaoId, nome, dataConclusao }),
  });
}

export async function deletarCurso(cursoId: number): Promise<void> {
  await apiFetch<void>(`/curso/${cursoId}`, {
    method: "DELETE",
  });
}
