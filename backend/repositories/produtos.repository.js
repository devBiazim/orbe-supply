const pool = require('../database/conexao');

// dias_para_vencer é calculado no banco, no fuso do mercadinho, para não depender
// do relógio (nem do fuso) de quem abre a página.
const SELECT_PRODUTOS = `
  SELECT p.*,
         f.nome AS fornecedor_nome,
         p.data_vencimento - (now() AT TIME ZONE 'America/Fortaleza')::date AS dias_para_vencer
    FROM produtos p
    JOIN fornecedores f ON f.id = p.fornecedor_id`;

async function listarTodos() {
  const { rows } = await pool.query(`${SELECT_PRODUTOS} ORDER BY p.data_vencimento NULLS LAST, p.nome`);
  return rows;
}

async function listarPorFornecedor(fornecedorId) {
  const { rows } = await pool.query(
    `${SELECT_PRODUTOS} WHERE p.fornecedor_id = $1 ORDER BY p.data_vencimento NULLS LAST, p.nome`,
    [fornecedorId]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT_PRODUTOS} WHERE p.id = $1`, [id]);
  return rows[0];
}

async function criar(p) {
  const { rows } = await pool.query(
    `INSERT INTO produtos
       (nome, quantidade_estoque, preco, data_fabricacao, data_vencimento, lote, fornecedor_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [p.nome, p.quantidadeEstoque, p.preco, p.dataFabricacao, p.dataVencimento, p.lote, p.fornecedorId]
  );
  return rows[0];
}

async function atualizar(id, p) {
  const { rows } = await pool.query(
    `UPDATE produtos
        SET nome = $1, quantidade_estoque = $2, preco = $3,
            data_fabricacao = $4, data_vencimento = $5, lote = $6
      WHERE id = $7
      RETURNING *`,
    [p.nome, p.quantidadeEstoque, p.preco, p.dataFabricacao, p.dataVencimento, p.lote, id]
  );
  return rows[0];
}

async function excluir(id) {
  const { rowCount } = await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
  return rowCount;
}

async function contarPorFornecedor(fornecedorId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM produtos WHERE fornecedor_id = $1',
    [fornecedorId]
  );
  return rows[0].total;
}

module.exports = {
  listarTodos,
  listarPorFornecedor,
  buscarPorId,
  criar,
  atualizar,
  excluir,
  contarPorFornecedor
};
