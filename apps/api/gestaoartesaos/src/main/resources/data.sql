-- ===================================================================================
-- 1. CARGA DE ROLES (Regra de negócio para o Spring Security)
-- ===================================================================================
INSERT INTO tb_roles (role_id, name)
SELECT 1, 'admin' WHERE NOT EXISTS (SELECT 1 FROM tb_roles WHERE role_id = 1);

INSERT INTO tb_roles (role_id, name)
SELECT 2, 'basic' WHERE NOT EXISTS (SELECT 1 FROM tb_roles WHERE role_id = 2);

-- ===================================================================================
-- 2. CARGA DE USUÁRIOS (Gestores base para associar às curadorias e mensagens)
-- ===================================================================================
INSERT INTO tb_usuarios (id, nome, email, senha, telefone)
SELECT 1, 'Gestor Prodarte Principal', 'gestor@prodarte.com', '$2a$10$TMxK9prKz/wqkGhByYdn0u9dxAC638g4dZlNApPNHaZDHpfRKiIDy', '5581900000001'
WHERE NOT EXISTS (SELECT 1 FROM tb_usuarios WHERE id = 1);

INSERT INTO tb_usuarios (id, nome, email, senha, telefone)
SELECT 2, 'Gestor Prodarte - Curadoria', 'curadoria@prodarte.com', '$2a$10$TMxK9prKz/wqkGhByYdn0u9dxAC638g4dZlNApPNHaZDHpfRKiIDy', '5581900000002'
WHERE NOT EXISTS (SELECT 1 FROM tb_usuarios WHERE id = 2);

INSERT INTO tb_usuarios (id, nome, email, senha, telefone)
SELECT 3, 'Gestor Prodarte - Administrador', 'administrador@prodarte.com', '$2a$10$TMxK9prKz/wqkGhByYdn0u9dxAC638g4dZlNApPNHaZDHpfRKiIDy', '5581900000003'
WHERE NOT EXISTS (SELECT 1 FROM tb_usuarios WHERE id = 3);

-- Associação dos Gestores com a Role ADMIN
INSERT INTO tb_usuario_roles (usuario_id, role_id)
SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM tb_usuario_roles WHERE usuario_id = 1 AND role_id = 1);

INSERT INTO tb_usuario_roles (usuario_id, role_id)
SELECT 2, 1 WHERE NOT EXISTS (SELECT 1 FROM tb_usuario_roles WHERE usuario_id = 2 AND role_id = 1);

INSERT INTO tb_usuario_roles (usuario_id, role_id)
SELECT 3, 1 WHERE NOT EXISTS (SELECT 1 FROM tb_usuario_roles WHERE usuario_id = 3 AND role_id = 1);


-- ===================================================================================
-- 3. CARGA DE ARTESÃOS (Inscrições movidas para o passado - 2025)
-- ===================================================================================
INSERT INTO tb_artesaos (id, nome, cpf, rg, data_nascimento, telefone, email, logradouro, numero, bairro, cidade, uf, cep, nome_marca, segmento, descricao_produto, instagram, categoria_produto, possui_mei, cnpj, razao_social, status_curadoria, data_inscricao, atualizado_em)
SELECT 1, 'Maria Aparecida da Silva', '11122233344', '1234567', '1980-05-12 00:00:00', '5581999991111', 'maria@email.com', 'Rua das Flores', '10', 'Boa Viagem', 'Recife', 'PE', '51000000', 'Maria das Artes', 'ARTESANATO', 'Bolsas e necessaires bordadas à mão.', '@mariadasartes', 'Costura Criativa', true, '11222333000144', 'Maria Aparecida MEI', 'APROVADO', '2025-03-10 09:15:00', '2025-03-12 11:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 1);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 2, 'João de Barro Santos', '22233344455', '1975-08-22 00:00:00', '5581988882222', 'joao@email.com', 'Piedade', 'Jaboatão dos Guararapes', 'PE', 'ARTESANATO', 'Madeira e Entalhe', false, 'EM_ANALISE', '2025-05-14 14:20:00', '2025-05-14 14:20:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 2);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 3, 'Ana Beatriz Oliveira', '33344455566', '1995-12-05 00:00:00', '5581977773333', 'ana.bia@email.com', 'Casa Amarela', 'Recife', 'PE', 'Bia Biscuit', 'ARTESANATO', 'Biscuit e Modelagem', true, 'APROVADO', '2025-06-20 10:00:00', '2025-06-22 16:45:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 3);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 4, 'Carlos Eduardo Gomes', '44455566677', '1988-02-14 00:00:00', '5581966664444', 'carlos@email.com', 'Olinda', 'Olinda', 'PE', 'GASTRONOMIA', 'Gastronomia Artesanal', false, 'REPROVADO', '2025-02-11 11:30:00', '2025-02-12 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 4);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 5, 'Fernanda Costa Lima', '55566677788', '1990-10-30 00:00:00', '5581955555555', 'nanda@email.com', 'Boa Vista', 'Recife', 'PE', 'Fios e Tramas', 'ARTESANATO', 'Crochê e Tricô', true, 'APROVADO', '2025-04-05 15:00:00', '2025-04-07 10:30:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 5);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 6, 'Severino Ramos', '66677788899', '1965-03-10 00:00:00', '5581944444444', 'severino.couro@email.com', 'Várzea', 'Recife', 'PE', 'Couro Nordestino', 'ARTESANATO', 'Arte em Couro', true, 'APROVADO', '2025-01-15 08:00:00', '2025-01-18 14:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 6);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 7, 'Juliana Mendes', '77788899900', '1998-07-15 00:00:00', '5581933333333', 'juli.macrame@email.com', 'Pina', 'Recife', 'PE', 'Nós e Fios', 'ARTESANATO', 'Macramê', false, 'EM_ANALISE', '2025-08-12 13:10:00', '2025-08-12 13:10:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 7);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 8, 'Roberto Cavalcanti', '88899900011', '1982-11-20 00:00:00', '5581922222222', 'beto.ceramica@email.com', 'Santo Amaro', 'Recife', 'PE', 'Barro Vivo', 'ARTESANATO', 'Cerâmica', true, 'APROVADO', '2025-07-22 09:40:00', '2025-07-25 11:20:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 8);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 9, 'Cláudia Albuquerque', '99900011122', '1979-01-25 00:00:00', '5581911111111', 'claudia.doces@email.com', 'Encruzilhada', 'Recife', 'PE', 'Doce Sabor de PE', 'GASTRONOMIA', 'Doces Regionais', true, 'APROVADO', '2025-09-01 10:15:00', '2025-09-03 15:30:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 9);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 10, 'Marcos Vinícius Dias', '00011122233', '2000-09-08 00:00:00', '5581900009999', 'marcos.art@email.com', 'Derby', 'Recife', 'PE', 'ARTESANATO', 'Pintura em Tela', false, 'REPROVADO', '2025-10-05 16:00:00', '2025-10-06 11:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 10);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 11, 'Luciana Tavares', '12312312345', '1985-04-12 00:00:00', '5581988887777', 'lu.saboaria@email.com', 'Ibura', 'Recife', 'PE', 'Banho de Cheiro', 'ARTESANATO', 'Saboaria Artesanal', true, 'APROVADO', '2025-03-22 14:00:00', '2025-03-25 09:30:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 11);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 12, 'Thiago Henrique Paz', '23423423456', '1992-06-18 00:00:00', '5581977776666', 'thiago.recicla@email.com', 'Cordeiro', 'Recife', 'PE', 'EcoArtes', 'ARTESANATO', 'Material Reciclado', false, 'EM_ANALISE', '2025-11-02 11:15:00', '2025-11-02 11:15:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 12);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 13, 'Renata Vasconcelos', '34534534567', '1970-12-30 00:00:00', '5581966665555', 'renata.rendas@email.com', 'Candeias', 'Jaboatão dos Guararapes', 'PE', 'ARTESANATO', 'Renda Renascença', true, 'APROVADO', '2025-04-18 10:20:00', '2025-04-20 16:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 13);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 14, 'Gabriel Martins', '45645645678', '1989-08-05 00:00:00', '5581955554444', 'gabriel.prata@email.com', 'Bairro do Recife', 'Recife', 'PE', 'Prata da Casa', 'ARTESANATO', 'Joias em Prata', true, 'APROVADO', '2025-06-05 09:00:00', '2025-06-08 14:10:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 14);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 15, 'Vanessa Lins', '56756756789', '1994-02-28 00:00:00', '5581944443333', 'vanessa.velas@email.com', 'Graças', 'Recife', 'PE', 'ARTESANATO', 'Velas Aromáticas', false, 'EM_ANALISE', '2025-11-15 13:45:00', '2025-11-15 13:45:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 15);


-- ===================================================================================
-- 4. CARGA DE FEIRAS (Datas das feiras alteradas para o ano de 2025)
-- ===================================================================================
INSERT INTO tb_feiras (id, nome, data, local, limite_vagas, vagas_restantes, criada_em, atualizada_em)
SELECT '123e4567-e89b-12d3-a456-426614174001', 'Feira Nacional do Artesanato (FENEART)', '2025-07-04 10:00:00', 'Centro de Convenções PE', 50, 42, '2025-01-05 08:00:00', '2025-01-05 08:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_feiras WHERE id = '123e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_feiras (id, nome, data, local, limite_vagas, vagas_restantes, criada_em, atualizada_em)
SELECT '123e4567-e89b-12d3-a456-426614174002', 'Domingão no Recife Antigo', '2025-09-14 10:00:00', 'Bairro do Recife Antigo', 20, 16, '2025-08-01 09:00:00', '2025-08-01 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_feiras WHERE id = '123e4567-e89b-12d3-a456-426614174002');

INSERT INTO tb_feiras (id, nome, data, local, limite_vagas, vagas_restantes, criada_em, atualizada_em)
SELECT '123e4567-e89b-12d3-a456-426614174003', 'Feirinha de Boa Viagem', '2025-10-12 16:00:00', 'Praça de Boa Viagem', 30, 25, '2025-09-10 10:00:00', '2025-09-10 10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_feiras WHERE id = '123e4567-e89b-12d3-a456-426614174003');

INSERT INTO tb_feiras (id, nome, data, local, limite_vagas, vagas_restantes, criada_em, atualizada_em)
SELECT '123e4567-e89b-12d3-a456-426614174004', 'Feira de Casa Amarela', '2025-11-08 08:00:00', 'Mercado de Casa Amarela', 15, 15, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_feiras WHERE id = '123e4567-e89b-12d3-a456-426614174004');

INSERT INTO tb_feiras (id, nome, data, local, limite_vagas, vagas_restantes, criada_em, atualizada_em)
SELECT '123e4567-e89b-12d3-a456-426614174005', 'Expo Várzea Criativa', '2025-12-13 09:00:00', 'Praça da Várzea', 25, 24, '2025-11-01 09:00:00', '2025-11-01 09:00:00'
WHERE NOT EXISTS (SELECT 1 FROM tb_feiras WHERE id = '123e4567-e89b-12d3-a456-426614174005');


-- ===================================================================================
-- 5. ALOCAÇÕES (Criação retroativa simulando o período de inscrição da feira)
-- ===================================================================================
-- FENEART (Ocorreu em Julho/2025)
INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174001', 1, '123e4567-e89b-12d3-a456-426614174001', 'ALOCADO', '2025-04-10 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174002', 3, '123e4567-e89b-12d3-a456-426614174001', 'ALOCADO', '2025-06-25 11:30:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174002');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174003', 6, '123e4567-e89b-12d3-a456-426614174001', 'ALOCADO', '2025-03-01 09:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174003');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174004', 8, '123e4567-e89b-12d3-a456-426614174001', 'ALOCADO', '2025-05-15 14:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174004');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174013', 13, '123e4567-e89b-12d3-a456-426614174001', 'CANCELADO', '2025-05-02 10:30:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174013');

-- Domingão no Recife Antigo (Ocorreu em Setembro/2025)
INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174005', 5, '123e4567-e89b-12d3-a456-426614174002', 'ALOCADO', '2025-08-10 15:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174005');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174006', 9, '123e4567-e89b-12d3-a456-426614174002', 'ALOCADO', '2025-09-04 11:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174006');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174007', 14, '123e4567-e89b-12d3-a456-426614174002', 'ALOCADO', '2025-08-20 16:15:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174007');

-- Feirinha de Boa Viagem (Ocorreu em Outubro/2025)
INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174008', 1, '123e4567-e89b-12d3-a456-426614174003', 'ALOCADO', '2025-09-25 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174008');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174009', 11, '123e4567-e89b-12d3-a456-426614174003', 'ALOCADO', '2025-10-01 09:30:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174009');

-- Expo Várzea Criativa (Ocorreu em Dezembro/2025)
INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174010', 6, '123e4567-e89b-12d3-a456-426614174005', 'ALOCADO', '2025-11-15 14:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174010');


-- ===================================================================================
-- 6. HISTÓRICO DE CURADORIAS (Registros movidos em conformidade com as inscrições)
-- ===================================================================================
INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174001', 1, 1, 'APROVADO', 'Trabalho de excelente qualidade e formalização OK.', '2025-03-12 10:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174002', 4, 2, 'REPROVADO', 'Faltam documentos sanitários para a venda de alimentos.', '2025-02-12 08:30:00' WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174002');

INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174003', 5, 1, 'APROVADO', 'Produto com alto apelo comercial e bom acabamento.', '2025-04-07 09:45:00' WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174003');

INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174004', 6, 1, 'APROVADO', 'Trabalho manual em couro muito autêntico e de valor cultural.', '2025-01-18 11:20:00' WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174004');

INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174005', 10, 2, 'REPROVADO', 'Peças enviadas não configuram artesanato local segundo o edital.', '2025-10-06 10:15:00' WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174005');

INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174006', 11, 3, 'APROVADO', 'Certificação da Anvisa anexada e aprovada.', '2025-03-25 09:00:00' WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174006');


-- ===================================================================================
-- 7. MENSAGENS (Alinhadas temporalmente com as curadorias)
-- ===================================================================================
INSERT INTO tb_mensagens (id, artesao_id, gestor_id, assunto, tipo, conteudo, enviada_em)
SELECT '423e4567-e89b-12d3-a456-426614174001', 1, 1, 'Aprovação PRODARTE', 'APROVACAO', 'Olá Maria! 🎉 Parabéns, seu cadastro foi APROVADO!', '2025-03-12 11:05:00' WHERE NOT EXISTS (SELECT 1 FROM tb_mensagens WHERE id = '423e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_mensagens (id, artesao_id, gestor_id, assunto, tipo, conteudo, enviada_em)
SELECT '423e4567-e89b-12d3-a456-426614174002', 4, 2, 'Pendência no Cadastro', 'REJEICAO', 'Olá Carlos. Infelizmente, seu cadastro não pôde ser aprovado. Faltam docs sanitários.', '2025-02-12 09:15:00' WHERE NOT EXISTS (SELECT 1 FROM tb_mensagens WHERE id = '423e4567-e89b-12d3-a456-426614174002');

INSERT INTO tb_mensagens (id, artesao_id, gestor_id, assunto, tipo, conteudo, enviada_em)
SELECT '423e4567-e89b-12d3-a456-426614174003', 10, 2, 'Curadoria PRODARTE - Feedback', 'REJEICAO', 'Olá Marcos. Suas peças são lindas, mas no momento fogem do escopo do artesanato tradicional focado no edital.', '2025-10-06 11:30:00' WHERE NOT EXISTS (SELECT 1 FROM tb_mensagens WHERE id = '423e4567-e89b-12d3-a456-426614174003');

INSERT INTO tb_mensagens (id, artesao_id, gestor_id, assunto, tipo, conteudo, enviada_em)
SELECT '423e4567-e89b-12d3-a456-426614174004', 11, 3, 'Aprovação PRODARTE', 'APROVACAO', 'Olá Luciana, seus laudos foram validados. Seja bem-vinda!', '2025-03-25 09:45:00' WHERE NOT EXISTS (SELECT 1 FROM tb_mensagens WHERE id = '423e4567-e89b-12d3-a456-426614174004');


-- ===================================================================================
-- 8. DOCUMENTOS
-- ===================================================================================
INSERT INTO tb_documentos (id, artesao_id, tipo, url, mime_type, tamanho_bytes, status, criado_em)
SELECT '523e4567-e89b-12d3-a456-426614174001', 1, 'RG', 'https://drive.google.com/file/d/1lyUJ03CCqI69647ZMbSa3U-jx9J_pA4x/view?usp=sharing', 'application/pdf', 1024500, 'APROVADO', '2025-03-10 09:15:00' WHERE NOT EXISTS (SELECT 1 FROM tb_documentos WHERE id = '523e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_documentos (id, artesao_id, tipo, url, mime_type, tamanho_bytes, status, criado_em)
SELECT '523e4567-e89b-12d3-a456-426614174002', 1, 'COMPROVANTE_RESIDENCIA', 'https://drive.google.com/file/d/1lyUJ03CCqI69647ZMbSa3U-jx9J_pA4x/view?usp=sharing', 'application/pdf', 2048000, 'APROVADO', '2025-03-10 09:20:00' WHERE NOT EXISTS (SELECT 1 FROM tb_documentos WHERE id = '523e4567-e89b-12d3-a456-426614174002');

INSERT INTO tb_documentos (id, artesao_id, tipo, url, mime_type, tamanho_bytes, status, criado_em)
SELECT '523e4567-e89b-12d3-a456-426614174003', 6, 'MEI', 'https://drive.google.com/file/d/1lyUJ03CCqI69647ZMbSa3U-jx9J_pA4x/view?usp=sharing', 'application/pdf', 1548000, 'APROVADO', '2025-01-15 08:05:00' WHERE NOT EXISTS (SELECT 1 FROM tb_documentos WHERE id = '523e4567-e89b-12d3-a456-426614174003');

INSERT INTO tb_documentos (id, artesao_id, tipo, url, mime_type, tamanho_bytes, status, criado_em)
SELECT '523e4567-e89b-12d3-a456-426614174004', 11, 'OUTRO', 'https://drive.google.com/file/d/1lyUJ03CCqI69647ZMbSa3U-jx9J_pA4x/view?usp=sharing', 'application/pdf', 3048000, 'APROVADO', '2025-03-22 14:10:00' WHERE NOT EXISTS (SELECT 1 FROM tb_documentos WHERE id = '523e4567-e89b-12d3-a456-426614174004');


-- ===================================================================================
-- 9. CURSOS
-- ===================================================================================
INSERT INTO tb_cursos (id, nome, data_conclusao, artesao_id)
SELECT 1, 'Técnicas Avançadas de Bordado', '2024-04-16 08:00:00', 1 WHERE NOT EXISTS (SELECT 1 FROM tb_cursos WHERE id = 1);

INSERT INTO tb_cursos (id, nome, data_conclusao, artesao_id)
SELECT 2, 'Modelagem Básica em Biscuit', '2024-10-16 08:00:00', 3 WHERE NOT EXISTS (SELECT 1 FROM tb_cursos WHERE id = 2);

INSERT INTO tb_cursos (id, nome, data_conclusao, artesao_id)
SELECT 3, 'Tricô e Crochê Tradicional', '2024-04-16 08:00:00', 5 WHERE NOT EXISTS (SELECT 1 FROM tb_cursos WHERE id = 3);

INSERT INTO tb_cursos (id, nome, data_conclusao, artesao_id)
SELECT 4, 'Tratamento de Couro Cru', '2022-02-10 08:00:00', 6 WHERE NOT EXISTS (SELECT 1 FROM tb_cursos WHERE id = 4);

INSERT INTO tb_cursos (id, nome, data_conclusao, artesao_id)
SELECT 5, 'Esmaltação de Cerâmica Alta Temperatura', '2024-08-20 08:00:00', 8 WHERE NOT EXISTS (SELECT 1 FROM tb_cursos WHERE id = 5);

INSERT INTO tb_cursos (id, nome, data_conclusao, artesao_id)
SELECT 6, 'Boas Práticas de Fabricação (Vigilância Sanitária)', '2024-11-05 08:00:00', 9 WHERE NOT EXISTS (SELECT 1 FROM tb_cursos WHERE id = 6);

INSERT INTO tb_cursos (id, nome, data_conclusao, artesao_id)
SELECT 7, 'Precificação para Artesãos', '2024-01-15 08:00:00', 14 WHERE NOT EXISTS (SELECT 1 FROM tb_cursos WHERE id = 7);


-- ===================================================================================
-- 10. SINCRONIZAÇÃO DOS CONTADORES (SEQUENCES)
-- ===================================================================================
SELECT setval('tb_usuarios_id_seq', (SELECT MAX(id) FROM tb_usuarios));
SELECT setval('tb_artesaos_id_seq', (SELECT MAX(id) FROM tb_artesaos));
SELECT setval('tb_roles_role_id_seq', (SELECT MAX(role_id) FROM tb_roles));
SELECT setval('tb_cursos_id_seq', (SELECT MAX(id) FROM tb_cursos));