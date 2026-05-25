// Mock data coerente com artesanato de Recife/PE
// Domínios IBGE para autodeclaração de cor/raça

export type CorRaca = "Branca" | "Preta" | "Parda" | "Amarela" | "Indígena";
export type Genero = "Feminino" | "Masculino" | "Não-binário" | "Prefiro não informar";
export type Status = "Pendente" | "Em Análise" | "Aprovado" | "Rejeitado";
export type Categoria =
  | "Cerâmica"
  | "Bordado"
  | "Madeira"
  | "Couro"
  | "Renda Renascença"
  | "Joalheria"
  | "Tecelagem"
  | "Papel Machê";

export interface Artesao {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  genero: Genero;
  corRaca: CorRaca;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
  marca: {
    nome: string;
    descricao: string;
    categoria: Categoria;
    instagram?: string;
  };
  formalizacao: {
    possuiMei: boolean;
    cnpj?: string;
    razaoSocial?: string;
  };
  anexos: { nome: string; tipo: string; tamanho: string }[];
  status: Status;
  dataInscricao: string;
  ultimaParticipacao: string | null; // ISO date - null = nunca participou
  historicoFeiras: { feira: string; data: string; local: string }[];
}

export const artesaos: Artesao[] = [
  {
    id: "ART-001",
    nome: "Maria das Graças Silva",
    cpf: "***.***.***-12",
    rg: "**.***.***",
    email: "maria.gracas@email.com",
    telefone: "(81) 98765-4321",
    dataNascimento: "1972-03-14",
    genero: "Feminino",
    corRaca: "Parda",
    endereco: { rua: "Rua do Bom Jesus", numero: "210", bairro: "Recife Antigo", cidade: "Recife", cep: "50030-170" },
    marca: { nome: "Bordados Mariá", descricao: "Bordado livre e ponto cruz inspirado em Frevo.", categoria: "Bordado", instagram: "@bordadosmaria" },
    formalizacao: { possuiMei: true, cnpj: "**.***.***/0001-**", razaoSocial: "M.G. Silva Bordados ME" },
    anexos: [
      { nome: "rg_frente.jpg", tipo: "JPG", tamanho: "1.2 MB" },
      { nome: "comprovante_residencia.pdf", tipo: "PDF", tamanho: "340 KB" },
      { nome: "portfolio.pdf", tipo: "PDF", tamanho: "3.1 MB" },
    ],
    status: "Pendente",
    dataInscricao: "2026-04-20",
    ultimaParticipacao: "2025-09-12",
    historicoFeiras: [
      { feira: "Feira do Artesanato de Olinda", data: "2025-09-12", local: "Alto da Sé" },
      { feira: "Mostra Junina PRODARTE", data: "2025-06-22", local: "Marco Zero" },
    ],
  },
  {
    id: "ART-002",
    nome: "João Pereira dos Santos",
    cpf: "***.***.***-45",
    rg: "**.***.***",
    email: "joao.santos@email.com",
    telefone: "(81) 99123-8877",
    dataNascimento: "1985-11-02",
    genero: "Masculino",
    corRaca: "Preta",
    endereco: { rua: "Av. Caxangá", numero: "1450", bairro: "Madalena", cidade: "Recife", cep: "50710-230" },
    marca: { nome: "Barro do João", descricao: "Cerâmica utilitária inspirada em Mestre Vitalino.", categoria: "Cerâmica" },
    formalizacao: { possuiMei: false },
    anexos: [
      { nome: "rg.jpg", tipo: "JPG", tamanho: "900 KB" },
      { nome: "fotos_pecas.png", tipo: "PNG", tamanho: "2.8 MB" },
    ],
    status: "Em Análise",
    dataInscricao: "2026-04-18",
    ultimaParticipacao: null,
    historicoFeiras: [],
  },
  {
    id: "ART-003",
    nome: "Ana Beatriz Lima",
    cpf: "***.***.***-78",
    rg: "**.***.***",
    email: "anabia.lima@email.com",
    telefone: "(81) 98800-1122",
    dataNascimento: "1990-07-19",
    genero: "Feminino",
    corRaca: "Branca",
    endereco: { rua: "Rua da Aurora", numero: "88", bairro: "Boa Vista", cidade: "Recife", cep: "50050-000" },
    marca: { nome: "Renascença Anabia", descricao: "Renda renascença contemporânea para moda autoral.", categoria: "Renda Renascença", instagram: "@renascenca.anabia" },
    formalizacao: { possuiMei: true, cnpj: "**.***.***/0001-**", razaoSocial: "Anabia Lima Renda ME" },
    anexos: [
      { nome: "rg.pdf", tipo: "PDF", tamanho: "500 KB" },
      { nome: "ccmei.pdf", tipo: "PDF", tamanho: "120 KB" },
    ],
    status: "Aprovado",
    dataInscricao: "2026-03-30",
    ultimaParticipacao: "2024-11-15",
    historicoFeiras: [
      { feira: "Natal Iluminado Recife", data: "2024-11-15", local: "Rua do Bom Jesus" },
    ],
  },
  {
    id: "ART-004",
    nome: "Severino Cavalcanti",
    cpf: "***.***.***-90",
    rg: "**.***.***",
    email: "sev.cavalcanti@email.com",
    telefone: "(81) 99654-3321",
    dataNascimento: "1968-01-08",
    genero: "Masculino",
    corRaca: "Parda",
    endereco: { rua: "Rua do Sol", numero: "555", bairro: "Casa Forte", cidade: "Recife", cep: "52061-100" },
    marca: { nome: "Madeira Nordestina", descricao: "Esculturas em madeira de demolição.", categoria: "Madeira" },
    formalizacao: { possuiMei: true, cnpj: "**.***.***/0001-**", razaoSocial: "S. Cavalcanti Artesanato" },
    anexos: [{ nome: "documentos.pdf", tipo: "PDF", tamanho: "1.8 MB" }],
    status: "Aprovado",
    dataInscricao: "2026-02-12",
    ultimaParticipacao: "2023-12-20",
    historicoFeiras: [
      { feira: "Feira de Natal PRODARTE", data: "2023-12-20", local: "Praça do Arsenal" },
    ],
  },
  {
    id: "ART-005",
    nome: "Carla Mendes de Souza",
    cpf: "***.***.***-33",
    rg: "**.***.***",
    email: "carla.mendes@email.com",
    telefone: "(81) 98321-7766",
    dataNascimento: "1995-05-25",
    genero: "Feminino",
    corRaca: "Preta",
    endereco: { rua: "Rua Imperial", numero: "1200", bairro: "São José", cidade: "Recife", cep: "50090-000" },
    marca: { nome: "Couro & Frevo", descricao: "Acessórios em couro com estampas pernambucanas.", categoria: "Couro", instagram: "@couroefrevo" },
    formalizacao: { possuiMei: false },
    anexos: [{ nome: "rg.jpg", tipo: "JPG", tamanho: "1.1 MB" }],
    status: "Rejeitado",
    dataInscricao: "2026-04-10",
    ultimaParticipacao: null,
    historicoFeiras: [],
  },
  {
    id: "ART-006",
    nome: "Antônio Vital de Lima",
    cpf: "***.***.***-21",
    rg: "**.***.***",
    email: "antonio.vital@email.com",
    telefone: "(81) 99988-7766",
    dataNascimento: "1960-08-30",
    genero: "Masculino",
    corRaca: "Parda",
    endereco: { rua: "Estrada do Encanamento", numero: "230", bairro: "Casa Amarela", cidade: "Recife", cep: "52051-380" },
    marca: { nome: "Vitalino Neto", descricao: "Bonecos de barro tradicionais do Alto do Moura.", categoria: "Cerâmica" },
    formalizacao: { possuiMei: true, cnpj: "**.***.***/0001-**", razaoSocial: "A.V. Lima Cerâmica ME" },
    anexos: [
      { nome: "rg.pdf", tipo: "PDF", tamanho: "600 KB" },
      { nome: "ccmei.pdf", tipo: "PDF", tamanho: "150 KB" },
    ],
    status: "Aprovado",
    dataInscricao: "2025-11-08",
    ultimaParticipacao: "2022-07-10", // muito antigo - prioridade no rodízio
    historicoFeiras: [
      { feira: "São João do PRODARTE", data: "2022-07-10", local: "Pátio de São Pedro" },
    ],
  },
  {
    id: "ART-007",
    nome: "Luciana Albuquerque",
    cpf: "***.***.***-55",
    rg: "**.***.***",
    email: "lu.albu@email.com",
    telefone: "(81) 98112-4455",
    dataNascimento: "1988-12-03",
    genero: "Feminino",
    corRaca: "Branca",
    endereco: { rua: "Rua Setúbal", numero: "777", bairro: "Boa Viagem", cidade: "Recife", cep: "51030-010" },
    marca: { nome: "Prata da Lu", descricao: "Joias em prata com pedras brasileiras.", categoria: "Joalheria", instagram: "@pratadalu" },
    formalizacao: { possuiMei: true, cnpj: "**.***.***/0001-**", razaoSocial: "Luciana Joias ME" },
    anexos: [{ nome: "documentos.pdf", tipo: "PDF", tamanho: "2.0 MB" }],
    status: "Aprovado",
    dataInscricao: "2026-01-15",
    ultimaParticipacao: null, // nunca participou - prioridade máxima
    historicoFeiras: [],
  },
  {
    id: "ART-008",
    nome: "Janaína dos Santos",
    cpf: "***.***.***-66",
    rg: "**.***.***",
    email: "jana.santos@email.com",
    telefone: "(81) 99445-3322",
    dataNascimento: "1992-04-17",
    genero: "Feminino",
    corRaca: "Indígena",
    endereco: { rua: "Av. Conde da Boa Vista", numero: "150", bairro: "Boa Vista", cidade: "Recife", cep: "50060-000" },
    marca: { nome: "Tear Xukuru", descricao: "Tecelagem manual em algodão cru.", categoria: "Tecelagem" },
    formalizacao: { possuiMei: false },
    anexos: [{ nome: "rg.jpg", tipo: "JPG", tamanho: "1.4 MB" }],
    status: "Pendente",
    dataInscricao: "2026-04-25",
    ultimaParticipacao: null,
    historicoFeiras: [],
  },
];

export const bairros = [
  "Recife Antigo", "Boa Vista", "Santo Amaro", "São José", "Madalena",
  "Casa Forte", "Casa Amarela", "Boa Viagem", "Espinheiro", "Graças",
];

export const categorias: Categoria[] = [
  "Cerâmica", "Bordado", "Madeira", "Couro", "Renda Renascença", "Joalheria", "Tecelagem", "Papel Machê",
];

export const statusList: Status[] = ["Pendente", "Em Análise", "Aprovado", "Rejeitado"];

// Feiras
export interface Feira {
  id: string;
  nome: string;
  data: string;
  local: string;
  totalVagas: number;
  vagasOcupadas: number;
  alocados: string[]; // ids dos artesãos
}

export const feirasIniciais: Feira[] = [
  {
    id: "FEIRA-001",
    nome: "Feira de São João PRODARTE 2026",
    data: "2026-06-22",
    local: "Pátio de São Pedro, Recife",
    totalVagas: 30,
    vagasOcupadas: 12,
    alocados: [],
  },
  {
    id: "FEIRA-002",
    nome: "Mostra de Inverno do Artesanato",
    data: "2026-07-15",
    local: "Marco Zero, Recife Antigo",
    totalVagas: 20,
    vagasOcupadas: 5,
    alocados: [],
  },
];

export interface MensagemLog {
  id: string;
  tipo: "Convocação" | "Rejeição" | "Aprovação" | "Comunicado";
  destinatario: string;
  resumo: string;
  data: string;
  status: "Enviado" | "Entregue" | "Lido";
}

export const logsIniciais: MensagemLog[] = [
  { id: "MSG-001", tipo: "Convocação", destinatario: "Luciana Albuquerque", resumo: "Convocação para Feira de São João PRODARTE 2026", data: "2026-04-26 14:32", status: "Lido" },
  { id: "MSG-002", tipo: "Rejeição", destinatario: "Carla Mendes de Souza", resumo: "Inscrição rejeitada - documentação incompleta", data: "2026-04-25 10:15", status: "Entregue" },
  { id: "MSG-003", tipo: "Aprovação", destinatario: "Ana Beatriz Lima", resumo: "Cadastro aprovado no PRODARTE", data: "2026-04-22 16:48", status: "Lido" },
  { id: "MSG-004", tipo: "Comunicado", destinatario: "23 artesãos (Bordado)", resumo: "Reunião informativa - novas diretrizes", data: "2026-04-20 09:00", status: "Enviado" },
];
