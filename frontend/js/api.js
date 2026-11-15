// Todo fetch do frontend passa por aqui. Páginas e API saem do mesmo servidor, então os caminhos são relativos.

async function requisicao(caminho, metodo = 'GET', corpo = null) {
  const opcoes = { method: metodo, headers: {} };
  if (corpo) {
    opcoes.headers['Content-Type'] = 'application/json';
    opcoes.body = JSON.stringify(corpo);
  }

  let resposta;
  try {
    resposta = await fetch(caminho, opcoes);
  } catch (erro) {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  if (resposta.status === 204) {
    return null;
  }
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Ocorreu um erro inesperado.');
  }
  return dados;
}

const api = {
  listarFornecedores: () => requisicao('/fornecedores'),
  buscarFornecedor: (id) => requisicao(`/fornecedores/${id}`),
  criarFornecedor: (dados) => requisicao('/fornecedores', 'POST', dados),
  atualizarFornecedor: (id, dados) => requisicao(`/fornecedores/${id}`, 'PUT', dados),
  excluirFornecedor: (id) => requisicao(`/fornecedores/${id}`, 'DELETE'),

  listarEstoque: () => requisicao('/produtos'),
  indicadoresEstoque: () => requisicao('/indicadores/estoque'),
  listarProdutos: (fornecedorId) => requisicao(`/fornecedores/${fornecedorId}/produtos`),
  buscarProduto: (id) => requisicao(`/produtos/${id}`),
  criarProduto: (fornecedorId, dados) => requisicao(`/fornecedores/${fornecedorId}/produtos`, 'POST', dados),
  atualizarProduto: (id, dados) => requisicao(`/produtos/${id}`, 'PUT', dados),
  excluirProduto: (id) => requisicao(`/produtos/${id}`, 'DELETE')
};
