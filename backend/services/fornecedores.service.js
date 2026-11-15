const repo = require('../repositories/fornecedores.repository');
const produtoRepo = require('../repositories/produtos.repository');
const { criarErro } = require('../utils/erros');
const { apenasDigitos, textoOuNulo, emailValido } = require('../utils/validacao');

function normalizar(dados) {
  return {
    nome: String(dados.nome ?? '').trim(),
    cnpj: apenasDigitos(dados.cnpj),
    telefone: textoOuNulo(dados.telefone),
    email: textoOuNulo(dados.email)
  };
}

function validar(f) {
  if (f.nome === '') {
    throw criarErro('O nome é obrigatório.', 400);
  }
  if (f.nome.length > 150) {
    throw criarErro('O nome pode ter no máximo 150 caracteres.', 400);
  }
  if (f.cnpj.length !== 14) {
    throw criarErro('O CNPJ deve ter 14 dígitos.', 400);
  }
  if (f.telefone && f.telefone.length > 20) {
    throw criarErro('O telefone pode ter no máximo 20 caracteres.', 400);
  }
  if (f.email && (f.email.length > 150 || !emailValido(f.email))) {
    throw criarErro('O e-mail informado é inválido.', 400);
  }
}

async function listar() {
  return repo.listar();
}

async function buscarPorId(id) {
  const fornecedor = await repo.buscarPorId(id);
  if (!fornecedor) {
    throw criarErro('Fornecedor não encontrado.', 404);
  }
  return fornecedor;
}

async function criar(dados) {
  const f = normalizar(dados);
  validar(f);

  if (await repo.buscarPorCnpj(f.cnpj)) {
    throw criarErro('Já existe um fornecedor com esse CNPJ.', 409);
  }
  return repo.criar(f);
}

async function atualizar(id, dados) {
  await buscarPorId(id);
  const f = normalizar(dados);
  validar(f);

  const mesmoCnpj = await repo.buscarPorCnpj(f.cnpj);
  if (mesmoCnpj && mesmoCnpj.id !== Number(id)) {
    throw criarErro('Esse CNPJ pertence a outro fornecedor.', 409);
  }

  const atualizado = await repo.atualizar(id, f);
  if (!atualizado) {
    throw criarErro('Fornecedor não encontrado.', 404);
  }
  return atualizado;
}

async function excluir(id) {
  await buscarPorId(id);

  if ((await produtoRepo.contarPorFornecedor(id)) > 0) {
    throw criarErro('Não é possível excluir: o fornecedor ainda tem produtos cadastrados.', 409);
  }
  await repo.excluir(id);
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
