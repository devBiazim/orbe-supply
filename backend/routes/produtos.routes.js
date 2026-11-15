const express = require('express');
const produtos = require('../controllers/produtos.controller');
const { validarId } = require('../utils/erros');

const router = express.Router();
router.param('id', validarId);

router.get('/', produtos.listar);
router.get('/:id', produtos.buscarPorId);
router.put('/:id', produtos.atualizar);
router.delete('/:id', produtos.excluir);

module.exports = router;
