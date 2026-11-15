const FAIXAS = [
  { chave: 'vencido', rotulo: 'Vencido' },
  { chave: 'critico', rotulo: 'Vence em até 7 dias' },
  { chave: 'atencao', rotulo: 'De 8 a 30 dias' },
  { chave: 'regular', rotulo: 'De 31 a 90 dias' },
  { chave: 'folgado', rotulo: 'Mais de 90 dias' },
  { chave: 'sem_validade', rotulo: 'Sem validade' }
];

function criarIndicador({ rotulo, valor, nota, tom = '' }) {
  return `
    <article class="indicador ${tom}">
      <span class="indicador-rotulo">${rotulo}</span>
      <strong class="indicador-valor">${valor}</strong>
      <span class="indicador-nota">${nota}</span>
    </article>`;
}

function mostrarIndicadores({ resumo, risco }) {
  document.getElementById('indicadores').innerHTML = [
    criarIndicador({
      rotulo: 'Valor em estoque',
      valor: formatarPreco(resumo.valor_estoque),
      nota: `${formatarNumero(resumo.unidades)} unidades em ${pluralizar(resumo.lotes, 'lote', 'lotes')}`
    }),
    criarIndicador({
      rotulo: 'Valor em risco',
      valor: formatarPreco(risco.valor),
      nota: `${risco.percentual}% do estoque (vencido ou a até 7 dias)`,
      tom: risco.valor > 0 ? 'vencido' : ''
    }),
    criarIndicador({
      rotulo: 'Lotes vencidos',
      valor: formatarNumero(risco.vencidos.lotes),
      nota: `${formatarNumero(risco.vencidos.unidades)} unidades para retirar`,
      tom: risco.vencidos.lotes > 0 ? 'vencido' : ''
    }),
    criarIndicador({
      rotulo: 'Vencem em até 7 dias',
      valor: formatarNumero(risco.criticos.lotes),
      nota: `${formatarNumero(risco.criticos.unidades)} unidades`,
      tom: risco.criticos.lotes > 0 ? 'critico' : ''
    }),
    criarIndicador({
      rotulo: 'Vencem de 8 a 30 dias',
      valor: formatarNumero(risco.atencao.lotes),
      nota: `${formatarNumero(risco.atencao.unidades)} unidades`,
      tom: risco.atencao.lotes > 0 ? 'atencao' : ''
    }),
    criarIndicador({
      rotulo: 'Sem estoque',
      valor: formatarNumero(resumo.sem_estoque),
      nota: resumo.sem_estoque === 1 ? 'lote zerado' : 'lotes zerados',
      tom: 'neutro'
    })
  ].join('');
}

function mostrarAviso({ vencidos }) {
  const aviso = document.getElementById('aviso');
  if (vencidos.lotes === 0) {
    aviso.hidden = true;
    return;
  }
  aviso.innerHTML = `
    <span><strong>${pluralizar(vencidos.lotes, 'lote vencido', 'lotes vencidos')}</strong>
    (${formatarNumero(vencidos.unidades)} unidades) ainda ${vencidos.lotes === 1 ? 'consta' : 'constam'} no estoque.</span>
    <a href="estoque.html?filtro=vencido">Ver lotes</a>`;
  aviso.hidden = false;
}

function criarLinhaFila(produto, posicao) {
  return `
    <tr>
      <td class="posicao">${posicao}</td>
      <td>
        ${escaparHtml(produto.nome)}
        <span class="secundario">Lote ${escaparHtml(produto.lote || '—')}</span>
      </td>
      <td class="nowrap">${escaparHtml(produto.fornecedor_nome)}</td>
      <td class="numero">${formatarNumero(produto.quantidade_estoque)}</td>
      <td>${celulaVencimento(produto)}</td>
      <td>${barraVidaUtil(produto)}</td>
      <td class="nowrap">${acaoSugerida(produto)}</td>
    </tr>`;
}

function mostrarFila(fila) {
  const corpo = document.getElementById('fila-fefo');
  if (fila.length === 0) {
    corpo.innerHTML = '<tr><td class="vazio" colspan="7">Nenhum lote com validade cadastrada e estoque.</td></tr>';
    return;
  }
  corpo.innerHTML = fila.map((produto, indice) => criarLinhaFila(produto, indice + 1)).join('');
}

function mostrarFaixas(faixas) {
  const alvo = document.getElementById('faixas');
  const total = faixas.reduce((soma, faixa) => soma + faixa.valor, 0);
  if (total === 0) {
    alvo.innerHTML = '<p class="vazio-cartao">Sem estoque valorizado para mostrar.</p>';
    return;
  }

  const porChave = Object.fromEntries(faixas.map((faixa) => [faixa.chave, faixa]));
  const segmentos = FAIXAS.map(({ chave, rotulo }) =>
    `<span class="cor-${chave}" style="flex: ${porChave[chave].valor}" title="${rotulo}"></span>`
  ).join('');

  const legenda = FAIXAS.map(({ chave, rotulo }) => {
    const faixa = porChave[chave];
    return `
      <li>
        <i class="ponto cor-${chave}"></i>
        <span>${rotulo}</span>
        <span class="lotes">${pluralizar(faixa.lotes, 'lote', 'lotes')}</span>
        <span class="valor">${formatarPreco(faixa.valor)}</span>
      </li>`;
  }).join('');

  alvo.innerHTML = `
    <div class="barra-empilhada" role="img" aria-label="Distribuição do valor em estoque por faixa de validade">${segmentos}</div>
    <ul class="legenda">${legenda}</ul>`;
}

function mostrarFornecedoresEmRisco(fornecedores) {
  const alvo = document.getElementById('fornecedores-risco');
  if (fornecedores.length === 0) {
    alvo.innerHTML = '<p class="vazio-cartao">Nenhum fornecedor com lotes vencidos ou perto de vencer.</p>';
    return;
  }
  const maior = fornecedores[0].valor || 1;
  alvo.innerHTML = `<ul class="ranking">${fornecedores.map((f) => `
    <li>
      <div class="ranking-linha">
        <a href="produtos.html?fornecedor=${f.fornecedor_id}">${escaparHtml(f.nome)}</a>
        <span>${formatarPreco(f.valor)} · ${pluralizar(f.lotes, 'lote', 'lotes')}</span>
      </div>
      <div class="vida-trilho"><span class="cor-critico" style="width: ${Math.max((f.valor / maior) * 100, 3)}%"></span></div>
    </li>`).join('')}</ul>`;
}

async function carregarPainel() {
  limparMensagem();
  try {
    const dados = await api.indicadoresEstoque();
    mostrarAviso(dados.risco);
    mostrarIndicadores(dados);
    mostrarFila(dados.fila_fefo);
    mostrarFaixas(dados.faixas);
    mostrarFornecedoresEmRisco(dados.fornecedores_em_risco);
    document.getElementById('atualizado').textContent =
      'Atualizado às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (erro) {
    document.getElementById('fila-fefo').innerHTML =
      '<tr><td class="vazio" colspan="7">Não foi possível carregar os indicadores.</td></tr>';
    mostrarMensagem(erro.message);
  }
}

document.getElementById('botao-atualizar').addEventListener('click', carregarPainel);
carregarPainel();
