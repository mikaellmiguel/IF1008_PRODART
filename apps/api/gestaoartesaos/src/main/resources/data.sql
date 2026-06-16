-- ===================================================================================
-- 1. CARGA DE ROLES (Regra de negócio para o Spring Security)
-- ===================================================================================
INSERT INTO tb_roles (role_id, name)
SELECT 1, 'admin' WHERE NOT EXISTS (SELECT 1 FROM tb_roles WHERE role_id = 1);

INSERT INTO tb_roles (role_id, name)
SELECT 2, 'basic' WHERE NOT EXISTS (SELECT 1 FROM tb_roles WHERE role_id = 2);

-- ===================================================================================
-- 2. CARGA DE USUÁRIO (Gestor base para associar às curadorias e mensagens)
-- ===================================================================================
-- (Nota: O Usuario.java não possui campos de data, então não enviamos timestamps aqui)
INSERT INTO tb_usuarios (id, nome, email, senha, telefone)
SELECT 1, 'Gestor Prodarte', 'gestor@prodarte.com', '$2a$10$xyz...', '5581900000000'
WHERE NOT EXISTS (SELECT 1 FROM tb_usuarios WHERE id = 1);

-- Associação do Gestor com a Role ADMIN
INSERT INTO tb_usuario_roles (usuario_id, role_id)
SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM tb_usuario_roles WHERE usuario_id = 1 AND role_id = 1);


-- ===================================================================================
-- 3. CARGA DE ARTESÃOS (Usando IDs Longos (1, 2, 3...))
-- ===================================================================================
INSERT INTO tb_artesaos (id, nome, cpf, rg, data_nascimento, telefone, email, logradouro, numero, bairro, cidade, uf, cep, nome_marca, segmento, descricao_produto, instagram, categoria_produto, possui_mei, cnpj, razao_social, status_curadoria, data_inscricao, atualizado_em)
SELECT 1, 'Maria Aparecida da Silva', '11122233344', '1234567', '1980-05-12 00:00:00', '5581999991111', 'maria@email.com', 'Rua das Flores', '10', 'Boa Viagem', 'Recife', 'PE', '51000000', 'Maria das Artes', 'ARTESANATO', 'Bolsas e necessaires bordadas à mão.', '@mariadasartes', 'Costura Criativa', true, '11222333000144', 'Maria Aparecida MEI', 'APROVADO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 1);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 2, 'João de Barro Santos', '22233344455', '1975-08-22 00:00:00', '5581988882222', 'joao@email.com', 'Piedade', 'Jaboatão dos Guararapes', 'PE', 'ARTESANATO', 'Madeira e Entalhe', false, 'EM_ANALISE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 2);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 3, 'Ana Beatriz Oliveira', '33344455566', '1995-12-05 00:00:00', '5581977773333', 'ana.bia@email.com', 'Casa Amarela', 'Recife', 'PE', 'Bia Biscuit', 'ARTESANATO', 'Biscuit e Modelagem', true, 'APROVADO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 3);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 4, 'Carlos Eduardo Gomes', '44455566677', '1988-02-14 00:00:00', '5581966664444', 'carlos@email.com', 'Olinda', 'Olinda', 'PE', 'GASTRONOMIA', 'Gastronomia Artesanal', false, 'REPROVADO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 4);

INSERT INTO tb_artesaos (id, nome, cpf, data_nascimento, telefone, email, bairro, cidade, uf, nome_marca, segmento, categoria_produto, possui_mei, status_curadoria, data_inscricao, atualizado_em)
SELECT 5, 'Fernanda Costa Lima', '55566677788', '1990-10-30 00:00:00', '5581955555555', 'nanda@email.com', 'Boa Vista', 'Recife', 'PE', 'Fios e Tramas', 'ARTESANATO', 'Crochê e Tricô', true, 'APROVADO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_artesaos WHERE id = 5);


-- ===================================================================================
-- 4. CARGA DE FEIRAS (Usando UUIDs Fixos de teste)
-- ===================================================================================
INSERT INTO tb_feiras (id, nome, data, local, limite_vagas, vagas_restantes, criada_em, atualizada_em)
SELECT '123e4567-e89b-12d3-a456-426614174001', 'Feira Nacional do Artesanato (FENEART)', '2026-07-01 08:00:00', 'Centro de Convenções PE', 50, 48, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_feiras WHERE id = '123e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_feiras (id, nome, data, local, limite_vagas, vagas_restantes, criada_em, atualizada_em)
SELECT '123e4567-e89b-12d3-a456-426614174002', 'Feira do Bom Jesus', '2026-08-15 14:00:00', 'Bairro do Recife Antigo', 20, 19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_feiras WHERE id = '123e4567-e89b-12d3-a456-426614174002');


-- ===================================================================================
-- 5. ALOCAÇÕES (Artesão 1 e 3 na Feira 1; Artesão 5 na Feira 2)
-- ===================================================================================
INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174001', 1, '123e4567-e89b-12d3-a456-426614174001', 'ALOCADO', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174002', 3, '123e4567-e89b-12d3-a456-426614174001', 'ALOCADO', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174002');

INSERT INTO tb_alocacoes (id, artesao_id, feira_id, status, criada_em)
SELECT '223e4567-e89b-12d3-a456-426614174003', 5, '123e4567-e89b-12d3-a456-426614174002', 'ALOCADO', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_alocacoes WHERE id = '223e4567-e89b-12d3-a456-426614174003');


-- ===================================================================================
-- 6. HISTÓRICO DE CURADORIAS (Vinculando os artesãos ao gestor ID 1)
-- ===================================================================================
INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174001', 1, 1, 'APROVADO', 'Trabalho de excelente qualidade e formalização OK.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174002', 4, 1, 'REPROVADO', 'Faltam documentos sanitários para a venda de alimentos.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174002');

INSERT INTO tb_curadorias (id, artesao_id, gestor_id, status, justificativa, criada_em)
SELECT '323e4567-e89b-12d3-a456-426614174003', 5, 1, 'APROVADO', 'Produto com alto apelo comercial e bom acabamento.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_curadorias WHERE id = '323e4567-e89b-12d3-a456-426614174003');


-- ===================================================================================
-- 7. MENSAGENS (Mapeando assunto, conteudo e tipo)
-- ===================================================================================
INSERT INTO tb_mensagens (id, artesao_id, gestor_id, assunto, tipo, conteudo, enviada_em)
SELECT '423e4567-e89b-12d3-a456-426614174001', 1, 1, 'Aprovação PRODARTE', 'APROVACAO', 'Olá Maria! 🎉 Parabéns, seu cadastro foi APROVADO!', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_mensagens WHERE id = '423e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_mensagens (id, artesao_id, gestor_id, assunto, tipo, conteudo, enviada_em)
SELECT '423e4567-e89b-12d3-a456-426614174002', 4, 1, 'Pendência no Cadastro', 'REJEICAO', 'Olá Carlos. Infelizmente, seu cadastro não pôde ser aprovado. Faltam docs sanitários.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_mensagens WHERE id = '423e4567-e89b-12d3-a456-426614174002');


-- ===================================================================================
-- 8. DOCUMENTOS
-- ===================================================================================
-- Supondo que seus TipoDocumento Enums possuam RG_FRENTE e COMPROVANTE_RESIDENCIA
INSERT INTO tb_documentos (id, artesao_id, tipo, url, mime_type, tamanho_bytes, status, criado_em)
SELECT '523e4567-e89b-12d3-a456-426614174001', 1, 'RG', 'https://s3.aws.com/bucket/docs/rg_maria.png', 'image/png', 1024500, 'APROVADO', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_documentos WHERE id = '523e4567-e89b-12d3-a456-426614174001');

INSERT INTO tb_documentos (id, artesao_id, tipo, url, mime_type, tamanho_bytes, status, criado_em)
SELECT '523e4567-e89b-12d3-a456-426614174002', 1, 'COMPROVANTE_RESIDENCIA', 'https://s3.aws.com/bucket/docs/comp_maria.pdf', 'application/pdf', 2048000, 'APROVADO', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tb_documentos WHERE id = '523e4567-e89b-12d3-a456-426614174002');

-- ===================================================================================
-- 9. SINCRONIZAÇÃO DOS CONTADORES (SEQUENCES)
-- ===================================================================================
-- Avisa ao banco de dados para atualizar o contador para o maior ID que já foi inserido
-- Isso evita o erro de "chave duplicada" ao criar novos registros pela API

SELECT setval('tb_usuarios_id_seq', (SELECT MAX(id) FROM tb_usuarios));
SELECT setval('tb_artesaos_id_seq', (SELECT MAX(id) FROM tb_artesaos));
SELECT setval('tb_roles_role_id_seq', (SELECT MAX(role_id) FROM tb_roles));