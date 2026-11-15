const service = require('../services/produtos.service');
const { tratar } = require('../utils/erros');

const listar = tratar(async (req, res) => {
  res.json(await service.listar());
});

const listarPorFornecedor = tratar(async (req, res) => {
  res.json(await service.listarPorFornecedor(req.params.id));
});

const buscarPorId = tratar(async (req, res) => {
  res.json(await service.buscarPorId(req.params.id));
});

const criar = tratar(async (req, res) => {
  res.status(201).json(await service.criar(req.params.id, req.body));
});

const atualizar = tratar(async (req, res) => {
  res.json(await service.atualizar(req.params.id, req.body));
});

const excluir = tratar(async (req, res) => {
  await service.excluir(req.params.id);
  res.status(204).send();
});

module.exports = { listar, listarPorFornecedor, buscarPorId, criar, atualizar, excluir };
