-- Dados de teste (fictícios). Rode depois do schema.sql, um comando por vez.

INSERT INTO fornecedores (nome, cnpj, telefone, email) VALUES
('Distribuidora Boa Safra',   '11222333000144', '(85) 3222-1001',  'contato@boasafra.com.br'),
('Laticínios Serra Azul',     '22333444000155', '(85) 3222-1002',  'vendas@serraazul.com.br'),
('Bebidas Litoral Ltda',      '33444555000166', '(85) 98888-1003', 'pedidos@bebidaslitoral.com.br'),
('Higiene Total Atacado',     '44555666000177', '(85) 3222-1004',  NULL),
('Frigorífico Sertão Forte',  '55666777000188', '(85) 3222-1005',  'comercial@sertaoforte.com.br');

INSERT INTO produtos
(nome, quantidade_estoque, preco, data_fabricacao, data_vencimento, lote, fornecedor_id) VALUES
('Arroz branco 5kg',          40, 28.90, CURRENT_DATE - 60,  CURRENT_DATE + 300, 'L-AR-01', 1),
('Feijão carioca 1kg',        60,  8.50, CURRENT_DATE - 45,  CURRENT_DATE + 250, 'L-FJ-01', 1),
('Macarrão espaguete 500g',   75,  4.80, CURRENT_DATE - 30,  CURRENT_DATE + 200, 'L-MC-01', 1),
('Açúcar refinado 1kg',       50,  5.60, CURRENT_DATE - 90,  CURRENT_DATE + 365, 'L-AC-01', 1),
('Farinha de trigo 1kg',      35,  6.20, CURRENT_DATE - 20,  CURRENT_DATE + 15,  'L-FT-01', 1),
('Leite integral 1L',        120,  5.20, CURRENT_DATE - 10,  CURRENT_DATE + 4,   'L-LT-07', 2),
('Queijo coalho 500g',        15, 22.00, CURRENT_DATE - 20,  CURRENT_DATE + 2,   'L-QC-03', 2),
('Iogurte natural 170g',      30,  3.50, CURRENT_DATE - 25,  CURRENT_DATE - 3,   'L-IG-02', 2),
('Manteiga 200g',             25, 11.90, CURRENT_DATE - 40,  CURRENT_DATE + 20,  'L-MT-05', 2),
('Refrigerante cola 2L',      80,  9.90, CURRENT_DATE - 90,  CURRENT_DATE + 90,  'L-RF-11', 3),
('Suco de uva 1L',            45,  8.90, CURRENT_DATE - 120, CURRENT_DATE + 7,   'L-SU-04', 3),
('Água mineral 1,5L',        200,  3.00, NULL, NULL, NULL, 3),
('Cerveja lata 350ml',       150,  4.50, CURRENT_DATE - 60,  CURRENT_DATE + 120, 'L-CV-09', 3),
('Sabonete (unidade)',         0,  2.50, NULL, NULL, NULL, 4),
('Papel higiênico 12 rolos',  55, 19.90, NULL, NULL, NULL, 4),
('Detergente 500ml',          90,  2.90, CURRENT_DATE - 100, CURRENT_DATE + 500, 'L-DT-02', 4),
('Presunto fatiado 200g',     20,  9.50, CURRENT_DATE - 8,   CURRENT_DATE + 5,   'L-PR-12', 5),
('Linguiça toscana 1kg',      12, 24.90, CURRENT_DATE - 12,  CURRENT_DATE + 1,   'L-LG-06', 5),
('Frango congelado 1kg',      40, 13.50, CURRENT_DATE - 30,  CURRENT_DATE + 60,  'L-FR-08', 5),
('Mortadela 200g',            18,  6.80, CURRENT_DATE - 15,  CURRENT_DATE + 6,   'L-MD-03', 5);
