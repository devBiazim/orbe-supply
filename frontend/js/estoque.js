const listaEstoque = document.getElementById('lista-estoque');
const campoBusca = document.getElementById('busca');
const areaFiltros = document.getElementById('filtros');

const FILTROS = [
  { chave: 'todos', rotulo: 'Todos', serve: () => true },
  { chave: 'vencido', rotulo: 'Vencidos', serve: (p) => p.quantidade_estoque > 0 && p.faixa === 'vencido' },
  { chave: 'critico', rotulo: 'Até 7 dias', serve: (p) => p.quantidade_estoque > 0 && p.faixa === 'critico' },
  { chave: 'atencao', rotulo: '8 a 30 dias', serve: (p) => p.quantidade_estoque > 0 && p.faixa === 'atencao' },
  {
    chave: 'em_dia',
    rotulo: 'Em dia',
    serve: (p) => p.quantidade_estoque > 0 && (p.faixa === 'regular' || p.faixa === 'folgado')
  },
  { chave: 'sem_validade', rotulo: 'Sem validade', serve: (p) => p.quantidade_estoque > 0 && p.faixa === 'sem_validade' },
  { chave: 'sem_estoque', rotulo: 'Sem estoque', serve: (p) => p.quantidade_estoque === 0 }
];

let produtos = [];
let filtroAtivo = FILTROS.some((f) => f.chave === lerParametro('filtro')) ? lerParametro('filtro') : 'todos';

function criarLinhaEstoque(produto) {
  const marcaFila = produto.primeiro_a_sair ? '<span class="selo fila">Sai primeiro</span>' : '';
  return `
    <tr>
      <td>
        ${escaparHtml(produto.nome)}
        <span class="secundario">Lote ${escaparHtml(produto.lote || '—')}${marcaFila}</span>
      </td>
      <td class="nowrap"><a href="produtos.html?fornecedor=${produto.fornecedor_id}">${escaparHtml(produto.fornecedor_nome)}</a></td>
      <td class="numero">${formatarNumero(produto.quantidade_estoque)}</td>
      <td class="numero">${formatarPreco(produto.preco)}</td>
      <td>${celulaVencimento(produto)}</td>
      <td>${barraVidaUtil(produto)}</td>
      <td class="nowrap">${produto.quantidade_estoque > 0 ? acaoSugerida(produto) : '—'}</td>
      <td class="acoes">
        <a class="botao pequeno secundario" href="produto-form.html?id=${produto.id}&origem=estoque">Editar</a>
      </td>
    </tr>`;
}

function normalizarBusca(texto) {
  return String(texto ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function produtosVisiveis() {
  const filtro = FILTROS.find((f) => f.chave === filtroAtivo);
  const termo = normalizarBusca(campoBusca.value.trim());
  return produtos.filter((p) => {
    if (!filtro.serve(p)) return false;
    if (termo === '') return true;
    return normalizarBusca(`${p.nome} ${p.lote || ''} ${p.fornecedor_nome}`).includes(termo);
  });
}

function mostrarFiltros() {
  areaFiltros.innerHTML = FILTROS.map((filtro) => {
    const total = produtos.filter(filtro.serve).length;
    return `<button type="button" class="filtro" data-filtro="${filtro.chave}"
              aria-pressed="${filtro.chave === filtroAtivo}">${filtro.rotulo}<b>${total}</b></button>`;
  }).join('');
}

function mostrarResumo(visiveis) {
  const unidades = visiveis.reduce((soma, p) => soma + p.quantidade_estoque, 0);
  const valor = visiveis.reduce((soma, p) => soma + p.quantidade_estoque * Number(p.preco ?? 0), 0);
  document.getElementById('resumo').innerHTML = `
    <span><strong>${pluralizar(visiveis.length, 'lote', 'lotes')}</strong></span>
    <span><strong>${formatarNumero(unidades)}</strong> unidades</span>
    <span><strong>${formatarPreco(valor)}</strong> em estoque</span>`;
}

function mostrarEstoque() {
  const visiveis = produtosVisiveis();
  mostrarFiltros();
  mostrarResumo(visiveis);

  if (visiveis.length === 0) {
    const vazio = produtos.length === 0 ? 'Nenhum produto cadastrado.' : 'Nenhum lote encontrado com esses filtros.';
    listaEstoque.innerHTML = `<tr><td class="vazio" colspan="8">${vazio}</td></tr>`;
    return;
  }
  listaEstoque.innerHTML = visiveis.map(criarLinhaEstoque).join('');
}

async function carregarEstoque() {
  try {
    produtos = await api.listarEstoque();
    mostrarEstoque();
  } catch (erro) {
    listaEstoque.innerHTML = '<tr><td class="vazio" colspan="8">Não foi possível carregar o estoque.</td></tr>';
    mostrarMensagem(erro.message);
  }
}

areaFiltros.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-filtro]');
  if (botao) {
    filtroAtivo = botao.dataset.filtro;
    mostrarEstoque();
  }
});
campoBusca.addEventListener('input', mostrarEstoque);

carregarEstoque();
