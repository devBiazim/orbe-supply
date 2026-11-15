const repo = require('../repositories/produtos.repository');
const fornecedorRepo = require('../repositories/fornecedores.repository');
const { criarErro } = require('../utils/erros');
const { enriquecer } = require('../utils/estoque');
const { textoOuNulo, numeroOuNulo, dataValida } = require('../utils/validacao');

const MAX_ESTOQUE = 2147483647; // limite do INTEGER do Postgres
const MAX_PRECO = 99999999.99; // NUMERIC(10,2)

function normalizar(dados) {
  return {
    nome: String(dados.nome ?? '').trim(),
    quantidadeEstoque: numeroOuNulo(dados.quantidade_estoque),
    preco: numeroOuNulo(dados.preco),
    dataFabricacao: textoOuNulo(dados.data_fabricacao),
    dataVencimento: textoOuNulo(dados.data_vencimento),
    lote: textoOuNulo(dados.lote)
  };
}

function validarDatas({ dataFabricacao, dataVencimento }) {
  if (dataFabricacao && !dataValida(dataFabricacao)) {
    throw criarErro('A data de fabricação é inválida.', 400);
  }
  if (dataVencimento && !dataValida(dataVencimento)) {
    throw criarErro('A data de vencimento é inválida.', 400);
  }
  if (dataFabricacao && dataVencimento && dataVencimento < dataFabricacao) {
    throw criarErro('A data de vencimento não pode ser anterior à data de fabricação.', 400);
  }
}

function validar(p) {
  if (p.nome === '') {
    throw criarErro('O nome do produto é obrigatório.', 400);
  }
  if (p.nome.length > 150) {
    throw criarErro('O nome pode ter no máximo 150 caracteres.', 400);
  }
  if (!Number.isInteger(p.quantidadeEstoque) || p.quantidadeEstoque < 0 || p.quantidadeEstoque > MAX_ESTOQUE) {
    throw criarErro('A quantidade em estoque deve ser um número inteiro maior ou igual a zero.', 400);
  }
  if (p.preco !== null && !(p.preco >= 0 && p.preco <= MAX_PRECO)) {
    throw criarErro('O preço deve ser um número maior ou igual a zero.', 400);
  }
  if (p.lote && p.lote.length > 30) {
    throw criarErro('O lote pode ter no máximo 30 caracteres.', 400);
  }
  validarDatas(p);
}

async function garantirFornecedor(fornecedorId) {
  if (!(await fornecedorRepo.buscarPorId(fornecedorId))) {
    throw criarErro('Fornecedor não encontrado.', 404);
  }
}

async function listar() {
  return enriquecer(await repo.listarTodos());
}

async function listarPorFornecedor(fornecedorId) {
  await garantirFornecedor(fornecedorId);
  return enriquecer(await repo.listarPorFornecedor(fornecedorId));
}

async function buscarPorId(id) {
  const produto = await repo.buscarPorId(id);
  if (!produto) {
    throw criarErro('Produto não encontrado.', 404);
  }
  return produto;
}

async function criar(fornecedorId, dados) {
  await garantirFornecedor(fornecedorId);
  const p = normalizar(dados);
  validar(p);
  return repo.criar({ ...p, fornecedorId });
}

async function atualizar(id, dados) {
  await buscarPorId(id);
  const p = normalizar(dados);
  validar(p);

  const atualizado = await repo.atualizar(id, p);
  if (!atualizado) {
    throw criarErro('Produto não encontrado.', 404);
  }
  return atualizado;
}

async function excluir(id) {
  await buscarPorId(id);
  await repo.excluir(id);
}

module.exports = { listar, listarPorFornecedor, buscarPorId, criar, atualizar, excluir };
