# Documentação da API - Gestão de Artesãos

Esta é uma API construída com **Spring Boot** para gerenciar artesãos, curadorias (aprovação/rejeição), feiras e alocação de artesãos em feiras. O sistema conta com segurança baseada em **JWT (JSON Web Token)** e integração com a API do WhatsApp.

## 🛠️ Tecnologias Utilizadas

* **Java** (JDK 17+)
* **Spring Boot** (Web, Data JPA, Security, OAuth2 Resource Server)
* **PostgreSQL** (Banco de dados relacional)
* **Lombok** (Redução de boilerplate)

---

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos

* Ter o **Java (JDK 17 ou superior)** instalado.
* Ter o **Maven** instalado (ou utilizar o *wrapper* `mvnw` do projeto).
* Ter o **PostgreSQL** instalado e rodando na porta padrão (`5432`).

### 2. Configuração das variáveis de ambiente

Acesses o arquivo `application.properties.example` realize uma cópia e configure de arcordo com o ambiente no qual você está executando:

* **URL:** `jdbc:postgresql:{URL_BANCO_POSTGRESQL}`
* **Usuário:** `usuario-do-banco(padrão: postgres)`
* **Senha:** `sua-senha`



### 3. Executando a Aplicação

O projeto está configurado para inicializar o banco e popular dados automaticamente a partir do arquivo `data.sql` (`spring.sql.init.mode=always`).

Para rodar a aplicação, abra o terminal na raiz do projeto e execute:

```bash
mvn spring-boot:run

```

Ou, se estiver usando uma IDE (como IntelliJ, Eclipse ou VS Code), basta rodar a classe principal `GestaoartesaosApplication.java`.

A aplicação estará disponível em: `http://localhost:8080`.

---

## 🔐 Autenticação e Autorização

A API utiliza **Tokens JWT**.

1. Crie um usuário ou use o gestor padrão (injetado via `data.sql`: `gestor@prodarte.com` / senha do hash no banco).
2. Faça login em `/auth/login` para obter o `accessToken`.
3. Nas requisições protegidas, envie o token no cabeçalho HTTP:
`Authorization: Bearer <seu_token_aqui>`

> **Nota:** Apenas os endpoints de Criação de Usuário e Login são públicos. Todos os outros exigem autenticação.

---

## 📡 Endpoints da API

### 👤 Autenticação e Usuários

#### 1. Criar Usuário (Público)

* **POST** `/usuario`
* **Descrição:** Cria um novo usuário com a permissão (Role) básica (`BASIC`).
* **Corpo da Requisição (JSON):**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha123",
  "telefone": "5581999999999"
}

```



#### 2. Login (Público)

* **POST** `/auth/login`
* **Descrição:** Autentica um usuário e retorna o Token JWT.
* **Corpo da Requisição (JSON):**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}

```


* **Resposta de Sucesso:**
```json
{
  "accessToken": "eyJhbGciOi...",
  "expiresIn": 3600,
  "email": "usuario@email.com",
  "nome": "Nome do Usuário"
}

```



---

### 🎨 Artesãos

#### 3. Listar Artesãos (Protegido)

* **GET** `/artesao`
* **Descrição:** Retorna a lista de artesãos cadastrados. Suporta filtros via Query Parameters e ordenação.
* **Parâmetros de Busca (Opcionais):** `nome`, `email`, `segmento`, `telefone`, `bairro`, `possuiMei`, `statusCuradoria`, `estado`, `categoria`.
* **Exemplo de Uso:** `/artesao?statusCuradoria=APROVADO&segmento=ARTESANATO`

#### 4. Buscar Artesão por ID (Protegido)

* **GET** `/artesao/{id}`
* **Descrição:** Retorna os detalhes de um artesão específico.

#### 5. Atualizar Artesão (Protegido)

* **PATCH** `/artesao/{id}`
* **Descrição:** Atualiza dados parciais de um artesão existente.
* **Corpo da Requisição (Apenas os campos que deseja alterar):**
```json
{
  "telefone": "5581988887777",
  "bairro": "Novo Bairro",
  "descricaoProduto": "Nova descrição..."
}

```



---

### 🔍 Curadoria

A curadoria muda o status do artesão e dispara automaticamente mensagens via WhatsApp.

#### 6. Aprovar Artesão (Protegido)

* **POST** `/curadoria/aprovar/{id}`
* **Descrição:** Aprova o cadastro de um artesão (Muda o status para `APROVADO`) e envia mensagem de boas-vindas. O Gestor logado no momento é registrado como responsável pela curadoria.

#### 7. Rejeitar Artesão (Protegido)

* **POST** `/curadoria/rejeitar/{id}`
* **Descrição:** Rejeita o cadastro de um artesão (Muda o status para `REPROVADO`) com uma justificativa.
* **Corpo da Requisição (JSON):**
```json
{
  "justificativa": "Faltam documentos sanitários obrigatórios."
}

```



---

### 🎪 Feiras e Alocações

#### 8. Criar Feira (Protegido)

* **POST** `/feira`
* **Descrição:** Cadastra uma nova feira no sistema.
* **Corpo da Requisição (JSON):**
```json
{
  "nome": "Feira de Domingo",
  "data": "2026-10-12T08:00:00",
  "local": "Praça Central",
  "limiteVagas": 20
}

```



#### 9. Listar Feiras (Protegido)

* **GET** `/feira`
* **Descrição:** Retorna todas as feiras cadastradas.

#### 10. Atualizar Feira (Protegido)

* **PATCH** `/feira/{id}`
* **Descrição:** Atualiza dados de uma feira. Se o limite de vagas for alterado, o sistema recalcula proporcionalmente as vagas restantes.
* **Corpo da Requisição (Exemplo):**
```json
{
  "local": "Novo Endereço da Feira",
  "limiteVagas": 25
}

```

#### 11. Alocar Artesão em uma Feira (Protegido)

* **POST** `/feira/{feiraId}/alocar/{artesaoId}`
* **Descrição:** Aloca um artesão aprovado em uma feira. Reduz o número de `vagasRestantes` na feira.
* **Regras:**
* A feira deve ter vagas disponíveis.
* O artesão **deve** estar com o status `APROVADO` na curadoria.
* O artesão não pode ser alocado duas vezes na mesma feira.


