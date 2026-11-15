const produtoId = lerParametro('id');
let fornecedorDoProduto = lerParametro('fornecedor');
const veioDoEstoque = lerParametro('origem') === 'estoque';
const formProduto = document.getElementById('form-produto');

// Sem produto nem fornecedor na URL não há o que cadastrar ou editar.
if (!produtoId && !fornecedorDoProduto) {
  window.location.replace('fornecedores.html');
}

function lerFormularioProduto() {
  return {
    nome: document.getElementById('nome').value.trim(),
    quantidade_estoque: document.getElementById('quantidade_estoque').value,
    preco: document.getElementById('preco').value,
    lote: document.getElementById('lote').value.trim(),
    data_fabricacao: document.getElementById('data_fabricacao').value,
    data_vencimento: document.getElementById('data_vencimento').value
  };
}

function validarProduto(dados) {
  const estoque = Number(dados.quantidade_estoque);
  if (dados.nome === '') {
    return 'O nome do produto é obrigatório.';
  }
  if (dados.quantidade_estoque === '' || !Number.isInteger(estoque) || estoque < 0) {
    return 'A quantidade em estoque deve ser um número inteiro maior ou igual a zero.';
  }
  if (dados.preco !== '' && Number(dados.preco) < 0) {
    return 'O preço não pode ser negativo.';
  }
  if (dados.data_fabricacao && dados.data_vencimento && dados.data_vencimento < dados.data_fabricacao) {
    return 'A data de vencimento não pode ser anterior à data de fabricação.';
  }
  return null;
}

function preencherFormularioProduto(produto) {
  document.getElementById('nome').value = produto.nome;
  document.getElementById('quantidade_estoque').value = produto.quantidade_estoque;
  document.getElementById('preco').value = produto.preco ?? '';
  document.getElementById('lote').value = produto.lote || '';
  document.getElementById('data_fabricacao').value = String(produto.data_fabricacao || '').slice(0, 10);
  document.getElementById('data_vencimento').value = String(produto.data_vencimento || '').slice(0, 10);
}

function destinoDeVolta() {
  if (veioDoEstoque) {
    return 'estoque.html';
  }
  return fornecedorDoProduto ? `produtos.html?fornecedor=${fornecedorDoProduto}` : 'fornecedores.html';
}

function atualizarLinkVoltar() {
  document.getElementById('link-voltar').href = destinoDeVolta();
}

async function carregarProdutoParaEdicao() {
  document.getElementById('titulo').textContent = 'Editar produto';
  try {
    const produto = await api.buscarProduto(produtoId);
    fornecedorDoProduto = produto.fornecedor_id;
    preencherFormularioProduto(produto);
    atualizarLinkVoltar();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

async function salvarProduto(evento) {
  evento.preventDefault();
  limparMensagem();

  const dados = lerFormularioProduto();
  const problema = validarProduto(dados);
  if (problema) {
    mostrarMensagem(problema);
    return;
  }

  try {
    if (produtoId) {
      await api.atualizarProduto(produtoId, dados);
    } else {
      await api.criarProduto(fornecedorDoProduto, dados);
    }
    window.location.href = destinoDeVolta();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

formProduto.addEventListener('submit', salvarProduto);
atualizarLinkVoltar();
if (produtoId) {
  carregarProdutoParaEdicao();
}
