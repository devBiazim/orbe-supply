const repo = require('../repositories/produtos.repository');
const { calcularIndicadores } = require('../utils/estoque');

async function estoque() {
  return calcularIndicadores(await repo.listarTodos());
}

module.exports = { estoque };
