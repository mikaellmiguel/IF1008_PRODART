import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Shield,
  Palette,
  Lock,
  FileText,
  Globe,
  Users,
  AlertTriangle,
  Info,
  Building2,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Phone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Sistema PRODARTE" },
      { name: "description", content: "Diretrizes de proteção de dados e privacidade do Sistema PRODARTE - Prefeitura do Recife." },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  { id: "introducao", title: "1. Introdução e Contexto" },
  { id: "agentes", title: "2. Agentes de Tratamento" },
  { id: "base-legal", title: "3. Base Legal" },
  { id: "origem-dados", title: "4. Origem e Finalidade" },
  { id: "finalidades", title: "5. Finalidades do Tratamento" },
  { id: "retencao", title: "6. Retenção e Descarte" },
  { id: "seguranca", title: "7. Segurança da Informação" },
  { id: "incidentes", title: "8. Incidentes de Segurança" },
  { id: "direitos", title: "9. Direitos dos Titulares" },
  { id: "atualizacoes", title: "10. Atualizações da Política" },
  { id: "contato", title: "11. Contato" },
];

function PrivacyPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* PE Flag colored border top */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[var(--pe-blue)]" />
        <div className="flex-1 bg-[var(--pe-white)] border-y border-border" />
        <div className="flex-1 bg-[var(--pe-red)]" />
        <div className="flex-1 bg-[var(--pe-yellow)]" />
        <div className="flex-1 bg-[var(--pe-green)]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Palette className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-foreground">PRODARTE</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-muted-foreground uppercase tracking-wider">
                · Prefeitura do Recife
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Login</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Page Hero Header */}
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Shield className="h-3.5 w-3.5" />
            <span>Conformidade com a LGPD</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-lg text-muted-foreground font-semibold">
            Sistema PRODARTE · Programa de Desenvolvimento do Artesanato do Recife
          </p>
          <p className="text-xs text-muted-foreground">
            Prefeitura do Recife · Secretaria de Trabalho e Qualificação Profissional
          </p>
          <div className="mt-4 flex justify-center lg:justify-start">
            <div className="h-1 w-20 rounded bg-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Sticky Table of Contents (Desktop only) */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sumário do Documento
              </h2>
              <Separator className="my-3" />
              <nav className="space-y-1.5 flex flex-col">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="flex w-full items-center text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1 cursor-pointer"
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>
              <Separator className="my-4" />
              <div className="rounded-lg bg-muted/55 p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Última atualização</p>
                <p>Junho de 2026</p>
                <p className="mt-2">Esta política está em conformidade com a Lei Federal nº 13.709/2018 (LGPD).</p>
              </div>
            </div>
          </aside>

          {/* Right Column: Policy Content */}
          <div className="lg:col-span-9 space-y-12">
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="text-base text-foreground/90">
                Esta Política de Privacidade estabelece as diretrizes para o tratamento de dados pessoais no âmbito do
                Sistema PRODARTE (Programa de Desenvolvimento do Artesanato do Recife), em conformidade com a{" "}
                <strong>Lei Geral de Proteção de Dados Pessoais (LGPD) — Lei nº 13.709/2018</strong>, observando ainda
                os princípios da administração pública e as normas aplicáveis ao tratamento de dados por órgãos públicos.
              </p>

              <Separator className="my-8" />

              {/* SECTION 1 */}
              <section id="introducao" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  1. Introdução e Contexto
                </h2>
                <p>
                  O PRODARTE é um programa oficial da Prefeitura do Recife que visa valorizar, capacitar e incentivar os
                  artesãos locais, oferecendo oportunidades de participação em feiras, exposições e eventos promovidos ou
                  apoiados pelo município.
                </p>
                <p>
                  O Sistema PRODARTE foi desenvolvido para apoiar a gestão do programa, automatizando processos como a
                  curadoria técnica dos artesãos, o gerenciamento documental, o acompanhamento das capacitações e a
                  execução do rodízio justo para distribuição de vagas em eventos.
                </p>
              </section>

              <Separator className="my-8" />

              {/* SECTION 2 */}
              <section id="agentes" className="scroll-mt-24 space-y-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  2. Agentes de Tratamento (Art. 5º, LGPD)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card">
                    <CardContent className="pt-6 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Controlador (Art. 5º, VI)</span>
                      <h3 className="text-base font-semibold text-foreground">Prefeitura do Recife</h3>
                      <p className="text-sm">
                        Através da <strong>Secretaria de Trabalho e Qualificação Profissional</strong>, é a responsável
                        pelas decisões referentes ao tratamento dos dados pessoais realizados no Sistema PRODARTE.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card">
                    <CardContent className="pt-6 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Operador (Art. 5º, VII)</span>
                      <h3 className="text-base font-semibold text-foreground">EMPREL</h3>
                      <p className="text-sm">
                        A <strong>EMPREL – Empresa Municipal de Informática</strong> atua como operadora dos dados
                        pessoais, sendo responsável pela hospedagem, manutenção e operação técnica da plataforma.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3 rounded-lg border border-border bg-card p-5">
                  <h3 className="text-base font-semibold text-foreground">Terceiros</h3>
                  <p className="text-sm">
                    O compartilhamento de dados ocorre apenas quando estritamente necessário para execução das
                    funcionalidades do sistema.
                  </p>
                  <p className="text-sm">
                    Atualmente, o Sistema PRODARTE utiliza a <strong>Twilio API (WhatsApp)</strong> exclusivamente para
                    envio de notificações oficiais aos artesãos. Nesse caso, apenas as informações estritamente
                    necessárias para o envio da mensagem (como número de telefone e conteúdo da comunicação) são
                    transmitidas ao provedor do serviço.
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    Não há comercialização ou compartilhamento de dados pessoais com terceiros para fins publicitários ou
                    comerciais.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">Encarregado pelo Tratamento de Dados (DPO)</h3>
                  <p className="text-sm">
                    As solicitações relacionadas aos direitos previstos na LGPD deverão ser realizadas pelos canais oficiais
                    disponibilizados pela Prefeitura do Recife, que encaminhará a demanda ao Encarregado pelo Tratamento
                    de Dados, conforme previsto no Art. 41 da LGPD.
                  </p>
                </div>
              </section>

              <Separator className="my-8" />

              {/* SECTION 3 */}
              <section id="base-legal" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  3. Base Legal para o Tratamento
                </h2>
                <p>
                  O tratamento de dados pessoais realizado pelo Sistema PRODARTE fundamenta-se principalmente nas seguintes
                  bases legais da LGPD:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    <strong>Art. 7º, III</strong> — Execução de políticas públicas previstas em leis, regulamentos ou
                    respaldadas em contratos, convênios ou instrumentos congêneres.
                  </li>
                  <li>
                    <strong>Art. 23</strong> — Tratamento de dados pessoais realizado pela Administração Pública para
                    execução de competências legais e políticas públicas.
                  </li>
                  <li>
                    <strong>Art. 11, II, &quot;b&quot;</strong> — Tratamento de dados pessoais sensíveis quando
                    indispensável à execução de políticas públicas previstas em lei.
                  </li>
                </ul>
                <p className="text-sm font-medium text-foreground">
                  O tratamento é realizado exclusivamente para atender às finalidades institucionais do Programa PRODARTE.
                </p>
              </section>

              <Separator className="my-8" />

              {/* SECTION 4 */}
              <section id="origem-dados" className="scroll-mt-24 space-y-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  4. Origem e Finalidade dos Dados
                </h2>
                <p>
                  O Sistema PRODARTE não realiza o cadastro inicial dos artesãos. As informações cadastrais são
                  provenientes do processo oficial de inscrição conduzido pela Prefeitura do Recife e operacionalizado
                  pela EMPREL.
                </p>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">4.1 Dados Processados</h3>
                  <p>O sistema processa apenas os dados necessários para execução das atividades do programa.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Private Data */}
                    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-semibold text-sm">
                        <Lock className="h-4.5 w-4.5" />
                        <span>Dados Privados</span>
                      </div>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Cadastro de Pessoa Física (CPF)</li>
                        <li>Registro Geral (RG)</li>
                        <li>Data de nascimento</li>
                        <li>Telefone celular</li>
                        <li>Endereço de e-mail</li>
                        <li>Endereço residencial completo</li>
                      </ul>
                    </div>

                    {/* Documents */}
                    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-semibold text-sm">
                        <FileText className="h-4.5 w-4.5" />
                        <span>Documentos</span>
                      </div>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Documento de identidade</li>
                        <li>CPF</li>
                        <li>Comprovante de residência</li>
                        <li>Cartão MEI (quando aplicável)</li>
                        <li>Portfólio dos produtos</li>
                      </ul>
                    </div>

                    {/* Public or Commercial */}
                    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-semibold text-sm">
                        <Globe className="h-4.5 w-4.5" />
                        <span>Dados Públicos ou Comerciais</span>
                      </div>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Nome da marca</li>
                        <li>Nome artístico do artesão</li>
                        <li>Segmento de atuação</li>
                        <li>Categoria dos produtos</li>
                        <li>Descrição dos produtos</li>
                        <li>Link para Instagram profissional</li>
                      </ul>
                    </div>

                    {/* Semi-Public */}
                    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-500 font-semibold text-sm">
                        <Users className="h-4.5 w-4.5" />
                        <span>Dados Semi-Públicos</span>
                      </div>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Nome completo</li>
                        <li>Histórico de participação em feiras</li>
                        <li>Capacitações realizadas</li>
                        <li>Histórico de convocações</li>
                      </ul>
                    </div>
                  </div>

                  {/* Sensitive Data Card */}
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                      <AlertTriangle className="h-4.5 w-4.5" />
                      <span>Dados Sensíveis</span>
                    </div>
                    <p className="text-xs">
                      Quando necessários para execução de políticas públicas específicas, poderão ser tratados dados referentes a:
                    </p>
                    <ul className="list-disc pl-5 text-xs space-y-1">
                      <li>raça/cor;</li>
                      <li>gênero;</li>
                      <li>autodeclarações de vulnerabilidade socioeconômica.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground">
                      Esses dados são utilizados exclusivamente para aplicação de políticas públicas de inclusão social,
                      ações afirmativas e elaboração de indicadores institucionais, observando os princípios da necessidade
                      e da minimização previstos na LGPD.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="my-8" />

              {/* SECTION 5 */}
              <section id="finalidades" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  5. Finalidades do Tratamento
                </h2>
                <p>Os dados pessoais são utilizados exclusivamente para:</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Realizar a curadoria técnica dos artesãos inscritos;</li>
                  <li>Validar documentos obrigatórios;</li>
                  <li>Gerenciar o cadastro dos participantes;</li>
                  <li>Calcular automaticamente o rodízio justo para distribuição das vagas;</li>
                  <li>Registrar histórico de participações;</li>
                  <li>Gerenciar capacitações;</li>
                  <li>Emitir relatórios administrativos;</li>
                  <li>Enviar notificações oficiais via WhatsApp;</li>
                  <li>Atender às obrigações legais da Administração Pública.</li>
                </ol>
                <p className="text-sm font-medium text-foreground">
                  Os dados não são utilizados para publicidade, marketing ou qualquer finalidade comercial.
                </p>
              </section>

              <Separator className="my-8" />

              {/* SECTION 6 */}
              <section id="retencao" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  6. Retenção e Descarte de Dados
                </h2>
                <p>
                  Os dados pessoais são armazenados durante o período necessário para cumprimento das finalidades do
                  programa e das obrigações legais aplicáveis.
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Dados cadastrais</h4>
                    <p className="text-sm">
                      São mantidos enquanto o cadastro permanecer ativo ou enquanto forem necessários para execução das
                      políticas públicas relacionadas ao programa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Documentos</h4>
                    <p className="text-sm">
                      Poderão ser removidos do ambiente operacional quando deixarem de ser necessários para a finalidade
                      que justificou sua coleta, ressalvadas as hipóteses legais de guarda obrigatória pela Administração Pública.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Histórico de Participações e Logs</h4>
                    <p className="text-sm">
                      Poderão ser mantidos por prazo superior, de forma restrita ou anonimizada, para fins de auditoria,
                      transparência, controle interno, prestação de contas e atendimento aos órgãos fiscalizadores.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="my-8" />

              {/* SECTION 7 */}
              <section id="seguranca" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  7. Segurança da Informação
                </h2>
                <p>
                  O Sistema PRODARTE adota medidas técnicas e administrativas destinadas à proteção dos dados pessoais.
                  Entre elas destacam-se:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm">
                  <li>comunicação protegida por HTTPS/TLS;</li>
                  <li>armazenamento seguro das senhas utilizando algoritmos de hash criptográfico;</li>
                  <li>controle de acesso baseado em perfis de usuários (RBAC);</li>
                  <li>autenticação obrigatória para acesso ao sistema;</li>
                  <li>registro de logs para auditoria das operações realizadas;</li>
                  <li>armazenamento dos documentos em ambientes privados.</li>
                </ul>
                <p className="text-sm bg-muted/40 p-4 rounded-lg border border-border">
                  Além disso, o sistema aceita exclusivamente arquivos <strong>PDF, JPG e PNG</strong> com limite máximo de{" "}
                  <strong>5 MB</strong> por documento, reduzindo riscos relacionados ao envio de arquivos maliciosos.
                </p>
              </section>

              <Separator className="my-8" />

              {/* SECTION 8 */}
              <section id="incidentes" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  8. Incidentes de Segurança
                </h2>
                <p>
                  Caso ocorra incidente de segurança que possa acarretar risco ou dano relevante aos titulares dos dados
                  pessoais, serão adotadas as medidas previstas na LGPD, incluindo, quando aplicável:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm">
                  <li>comunicação à Autoridade Nacional de Proteção de Dados (ANPD);</li>
                  <li>comunicação aos titulares dos dados;</li>
                  <li>adoção de medidas corretivas para mitigação dos impactos.</li>
                </ul>
              </section>

              <Separator className="my-8" />

              {/* SECTION 9 */}
              <section id="direitos" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  9. Direitos dos Titulares dos Dados
                </h2>
                <p>
                  Nos termos do Art. 18 da LGPD, os titulares poderão exercer, sempre que aplicável, os seguintes direitos:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-sm">
                  <li>confirmação da existência de tratamento;</li>
                  <li>acesso aos dados pessoais;</li>
                  <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                  <li>informação sobre o compartilhamento realizado pelo Controlador;</li>
                  <li>anonimização, bloqueio ou eliminação dos dados quando cabível;</li>
                  <li>revisão das decisões automatizadas, quando aplicável;</li>
                  <li>obtenção de informações sobre a base legal utilizada para o tratamento.</li>
                </ol>
                <p className="text-sm">
                  Alguns direitos poderão sofrer limitações quando o tratamento decorrer do cumprimento de obrigação legal,
                  execução de políticas públicas ou demais hipóteses previstas na LGPD.
                </p>
                <p className="text-sm">
                  As solicitações poderão ser realizadas pelos canais oficiais da Prefeitura do Recife.
                </p>
              </section>

              <Separator className="my-8" />

              {/* SECTION 10 */}
              <section id="atualizacoes" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  10. Atualizações desta Política
                </h2>
                <p>
                  Esta Política de Privacidade poderá ser updated sempre que houver alterações legislativas,
                  regulamentares, técnicas ou operacionais relacionadas ao Sistema PRODARTE.
                </p>
                <p className="text-sm">
                  A versão vigente permanecerá disponível aos usuários para consulta permanente.
                </p>
              </section>

              <Separator className="my-8" />

              {/* SECTION 11 */}
              <section id="contato" className="scroll-mt-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  11. Contato
                </h2>
                <p>
                  Para dúvidas, solicitações ou exercício dos direitos previstos na Lei Geral de Proteção de Dados, os
                  titulares poderão utilizar os canais oficiais disponibilizados pela Prefeitura do Recife e pela Ouvidoria
                  Municipal.
                </p>
                <p className="text-sm">
                  As demandas serão encaminhadas ao setor responsável pelo tratamento dos dados pessoais, conforme a
                  estrutura administrativa vigente.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p className="mb-2">PRODARTE © {new Date().getFullYear()} · Prefeitura do Recife</p>
          <p>Secretaria do Trabalho e Qualificação Profissional · EMPREL</p>
        </div>
      </footer>
    </div>
  );
}
