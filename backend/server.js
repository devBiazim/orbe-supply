require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const pool = require('./database/conexao');
const fornecedoresRoutes = require('./routes/fornecedores.routes');
const produtosRoutes = require('./routes/produtos.routes');
const indicadoresRoutes = require('./routes/indicadores.routes');
const { responderErro } = require('./utils/erros');

const app = express();
app.use(cors());
app.use(express.json());

// As páginas do frontend saem do mesmo servidor da API.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/ping', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ status: 'erro' });
  }
});

app.use('/fornecedores', fornecedoresRoutes);
app.use('/produtos', produtosRoutes);
app.use('/indicadores', indicadoresRoutes);

// JSON malformado e afins chegam aqui antes de qualquer rota
app.use((erro, req, res, next) => responderErro(res, erro));

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log('Servidor rodando na porta ' + porta);
});
