const express = require('express');
const indicadores = require('../controllers/indicadores.controller');

const router = express.Router();

router.get('/estoque', indicadores.estoque);

module.exports = router;
