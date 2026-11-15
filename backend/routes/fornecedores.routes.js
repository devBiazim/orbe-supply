const express = require('express');
const fornecedores = require('../controllers/fornecedores.controller');
const produtos = require('../controllers/produtos.controller');
const { validarId } = require('../utils/erros');

const router = express.Router();
router.param('id', validarId);

router.get('/', fornecedores.listar);
router.get('/:id', fornecedores.buscarPorId);
router.post('/', fornecedores.criar);
router.put('/:id', fornecedores.atualizar);
router.delete('/:id', fornecedores.excluir);

// Produtos de um fornecedor
router.get('/:id/produtos', produtos.listarPorFornecedor);
router.post('/:id/produtos', produtos.criar);

module.exports = router;
