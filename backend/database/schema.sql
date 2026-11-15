-- Orbe Supply: estrutura do banco (PostgreSQL / Supabase)
-- A tabela pai vem antes da filha.

-- Tabela pai: fornecedores
CREATE TABLE fornecedores (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(150) NOT NULL,
    cnpj      CHAR(14) NOT NULL UNIQUE,
    telefone  VARCHAR(20),
    email     VARCHAR(150)
);

-- Tabela filha: produtos (cada produto pertence a um fornecedor)
CREATE TABLE produtos (
    id                  SERIAL PRIMARY KEY,
    nome                VARCHAR(150) NOT NULL,
    quantidade_estoque  INTEGER NOT NULL CHECK (quantidade_estoque >= 0),
    preco               NUMERIC(10,2) CHECK (preco >= 0),
    data_fabricacao     DATE,
    data_vencimento     DATE,
    lote                VARCHAR(30),
    fornecedor_id       INTEGER NOT NULL
                        REFERENCES fornecedores(id) ON DELETE RESTRICT,
    CHECK (data_vencimento >= data_fabricacao)
);
