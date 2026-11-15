function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function responderErro(res, erro) {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'O corpo da requisição não é um JSON válido.' });
  }
  if (erro.status) {
    return res.status(erro.status).json({ mensagem: erro.message });
  }

  // Erros do Postgres que escapam das validações (ex.: duas requisições simultâneas)
  switch (erro.code) {
    case '23505':
      return res.status(409).json({ mensagem: 'Já existe um registro com esses dados.' });
    case '23503':
      return res.status(409).json({ mensagem: 'A operação foi bloqueada por registros relacionados.' });
    case '22001':
    case '22003':
    case '22007':
    case '22008':
      return res.status(400).json({ mensagem: 'Algum dos valores informados é inválido.' });
  }

  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno do servidor. Tente novamente.' });
}

// O Express 4 não captura rejeições de funções async, então cada handler passa por aqui.
function tratar(handler) {
  return (req, res) => handler(req, res).catch((erro) => responderErro(res, erro));
}

// Para router.param('id', validarId)
function validarId(req, res, next, id) {
  if (!/^\d+$/.test(id)) {
    return responderErro(res, criarErro('O identificador informado é inválido.', 400));
  }
  next();
}

module.exports = { criarErro, responderErro, tratar, validarId };
