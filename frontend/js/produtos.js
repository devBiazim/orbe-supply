const fornecedorDaTela = lerParametro('fornecedor');
const listaProdutos = document.getElementById('lista-produtos');

if (!fornecedorDaTela) {
  window.location.replace('fornecedores.html');
}

function criarLinhaProduto(produto) {
  return `
    <tr>
      <td>${escaparHtml(produto.nome)}</td>
      <td>${escaparHtml(produto.lote || '—')}</td>
      <td class="numero">${formatarNumero(produto.quantidade_estoque)}</td>
      <td class="numero">${formatarPreco(produto.preco)}</td>
      <td>${formatarData(produto.data_fabricacao)}</td>
      <td>${celulaVencimento(produto)}</td>
      <td>${barraVidaUtil(produto)}</td>
      <td class="acoes">
        <a class="botao pequeno secundario" href="produto-form.html?id=${produto.id}">Editar</a>
        <button class="botao pequeno perigo" data-excluir="${produto.id}"
                data-nome="${escaparHtml(produto.nome)}">Excluir</button>
      </td>
    </tr>`;
}

function mostrarResumo(produtos) {
  const emRisco = produtos.filter(
    (p) => p.quantidade_estoque > 0 && (p.faixa === 'vencido' || p.faixa === 'critico')
  );
  const valor = produtos.reduce((soma, p) => soma + p.quantidade_estoque * Number(p.preco ?? 0), 0);
  document.getElementById('resumo').innerHTML = `
    <span><strong>${pluralizar(produtos.length, 'lote', 'lotes')}</strong></span>
    <span><strong>${formatarPreco(valor)}</strong> em estoque</span>
    <span><strong>${pluralizar(emRisco.length, 'lote em risco', 'lotes em risco')}</strong> (vencidos ou a até 7 dias)</span>`;
}

function mostrarProdutos(produtos) {
  mostrarResumo(produtos);
  if (produtos.length === 0) {
    listaProdutos.innerHTML = '<tr><td class="vazio" colspan="8">Este fornecedor ainda não tem produtos.</td></tr>';
    return;
  }
  listaProdutos.innerHTML = produtos.map(criarLinhaProduto).join('');
}

async function carregarProdutos() {
  try {
    const [fornecedor, produtos] = await Promise.all([
      api.buscarFornecedor(fornecedorDaTela),
      api.listarProdutos(fornecedorDaTela)
    ]);
    document.getElementById('titulo').textContent = `Produtos de ${fornecedor.nome}`;
    document.getElementById('subtitulo').textContent = `CNPJ ${formatarCnpj(fornecedor.cnpj)}`;
    mostrarProdutos(produtos);
  } catch (erro) {
    listaProdutos.innerHTML = '<tr><td class="vazio" colspan="8">Não foi possível carregar os produtos.</td></tr>';
    mostrarMensagem(erro.message);
  }
}

async function excluirProduto(id, nome) {
  if (!confirm(`Excluir o produto "${nome}"?`)) {
    return;
  }
  limparMensagem();
  try {
    await api.excluirProduto(id);
    mostrarMensagem('Produto excluído com sucesso.', 'sucesso');
    await carregarProdutos();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

listaProdutos.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-excluir]');
  if (botao) {
    excluirProduto(botao.dataset.excluir, botao.dataset.nome);
  }
});

document.getElementById('link-novo').href = `produto-form.html?fornecedor=${fornecedorDaTela}`;
carregarProdutos();
