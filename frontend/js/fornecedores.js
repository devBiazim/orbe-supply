const listaFornecedores = document.getElementById('lista-fornecedores');

function criarLinhaFornecedor(fornecedor) {
  return `
    <tr>
      <td>${escaparHtml(fornecedor.nome)}</td>
      <td>${escaparHtml(formatarCnpj(fornecedor.cnpj))}</td>
      <td>${escaparHtml(fornecedor.telefone || '—')}</td>
      <td>${escaparHtml(fornecedor.email || '—')}</td>
      <td class="acoes">
        <a class="botao pequeno secundario" href="produtos.html?fornecedor=${fornecedor.id}">Produtos</a>
        <a class="botao pequeno secundario" href="fornecedor-form.html?id=${fornecedor.id}">Editar</a>
        <button class="botao pequeno perigo" data-excluir="${fornecedor.id}"
                data-nome="${escaparHtml(fornecedor.nome)}">Excluir</button>
      </td>
    </tr>`;
}

function mostrarFornecedores(fornecedores) {
  if (fornecedores.length === 0) {
    listaFornecedores.innerHTML = '<tr><td class="vazio" colspan="5">Nenhum fornecedor cadastrado.</td></tr>';
    return;
  }
  listaFornecedores.innerHTML = fornecedores.map(criarLinhaFornecedor).join('');
}

async function carregarFornecedores() {
  try {
    mostrarFornecedores(await api.listarFornecedores());
  } catch (erro) {
    listaFornecedores.innerHTML = '<tr><td class="vazio" colspan="5">Não foi possível carregar a lista.</td></tr>';
    mostrarMensagem(erro.message);
  }
}

async function excluirFornecedor(id, nome) {
  if (!confirm(`Excluir o fornecedor "${nome}"?`)) {
    return;
  }
  limparMensagem();
  try {
    await api.excluirFornecedor(id);
    mostrarMensagem('Fornecedor excluído com sucesso.', 'sucesso');
    await carregarFornecedores();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

listaFornecedores.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-excluir]');
  if (botao) {
    excluirFornecedor(botao.dataset.excluir, botao.dataset.nome);
  }
});

carregarFornecedores();
