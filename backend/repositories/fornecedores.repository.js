const pool = require('../database/conexao');

async function listar() {
  const { rows } = await pool.query('SELECT * FROM fornecedores ORDER BY nome');
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT * FROM fornecedores WHERE id = $1', [id]);
  return rows[0];
}

async function buscarPorCnpj(cnpj) {
  const { rows } = await pool.query('SELECT * FROM fornecedores WHERE cnpj = $1', [cnpj]);
  return rows[0];
}

async function criar(f) {
  const { rows } = await pool.query(
    'INSERT INTO fornecedores (nome, cnpj, telefone, email) VALUES ($1, $2, $3, $4) RETURNING *',
    [f.nome, f.cnpj, f.telefone, f.email]
  );
  return rows[0];
}

async function atualizar(id, f) {
  const { rows } = await pool.query(
    'UPDATE fornecedores SET nome = $1, cnpj = $2, telefone = $3, email = $4 WHERE id = $5 RETURNING *',
    [f.nome, f.cnpj, f.telefone, f.email, id]
  );
  return rows[0];
}

async function excluir(id) {
  const { rowCount } = await pool.query('DELETE FROM fornecedores WHERE id = $1', [id]);
  return rowCount;
}

module.exports = { listar, buscarPorId, buscarPorCnpj, criar, atualizar, excluir };
