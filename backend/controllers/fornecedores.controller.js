const service = require('../services/fornecedores.service');
const { tratar } = require('../utils/erros');

const listar = tratar(async (req, res) => {
  res.json(await service.listar());
});

const buscarPorId = tratar(async (req, res) => {
  res.json(await service.buscarPorId(req.params.id));
});

const criar = tratar(async (req, res) => {
  res.status(201).json(await service.criar(req.body));
});

const atualizar = tratar(async (req, res) => {
  res.json(await service.atualizar(req.params.id, req.body));
});

const excluir = tratar(async (req, res) => {
  await service.excluir(req.params.id);
  res.status(204).send();
});

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
