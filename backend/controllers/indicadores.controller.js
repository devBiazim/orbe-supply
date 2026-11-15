const service = require('../services/indicadores.service');
const { tratar } = require('../utils/erros');

const estoque = tratar(async (req, res) => {
  res.json(await service.estoque());
});

module.exports = { estoque };
