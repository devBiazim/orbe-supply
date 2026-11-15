// Regras de validade e indicadores de estoque (FEFO: primeiro que vence, primeiro que sai).
// Sem acesso a banco: recebe linhas de produtos e devolve números, o que facilita testar.

const LIMITE_CRITICO = 7;
const LIMITE_ATENCAO = 30;
const LIMITE_REGULAR = 90;
const TAMANHO_FILA = 10;

const FAIXAS = ['vencido', 'critico', 'atencao', 'regular', 'folgado', 'sem_validade'];

function faixaDe(dias) {
  if (dias === null || dias === undefined) return 'sem_validade';
  if (dias < 0) return 'vencido';
  if (dias <= LIMITE_CRITICO) return 'critico';
  if (dias <= LIMITE_ATENCAO) return 'atencao';
  if (dias <= LIMITE_REGULAR) return 'regular';
  return 'folgado';
}

function diasEntre(inicio, fim) {
  return Math.round((Date.parse(fim) - Date.parse(inicio)) / 86400000);
}

function valorDe(produto) {
  return produto.quantidade_estoque * Number(produto.preco ?? 0);
}

function arredondar(numero) {
  return Math.round(numero * 100) / 100;
}

// Acrescenta faixa de validade, vida útil restante (%) e a marca "primeiro a sair".
// A marca só vale quando o mesmo produto tem mais de um lote em estoque.
function enriquecer(produtos) {
  const lotesPorNome = new Map();
  for (const p of produtos) {
    if (p.quantidade_estoque > 0 && p.dias_para_vencer !== null) {
      const chave = p.nome.trim().toLowerCase();
      if (!lotesPorNome.has(chave)) lotesPorNome.set(chave, []);
      lotesPorNome.get(chave).push(p);
    }
  }

  const primeiros = new Set();
  for (const lotes of lotesPorNome.values()) {
    if (lotes.length < 2) continue;
    const primeiro = lotes.reduce((a, b) => (b.dias_para_vencer < a.dias_para_vencer ? b : a));
    primeiros.add(primeiro.id);
  }

  return produtos.map((p) => {
    let vidaUtil = null;
    if (p.data_fabricacao && p.data_vencimento && p.dias_para_vencer !== null) {
      const total = diasEntre(p.data_fabricacao, p.data_vencimento);
      if (total > 0) {
        vidaUtil = Math.round(Math.min(Math.max(p.dias_para_vencer / total, 0), 1) * 100);
      }
    }
    return {
      ...p,
      faixa: faixaDe(p.dias_para_vencer),
      vida_util_restante: vidaUtil,
      primeiro_a_sair: primeiros.has(p.id)
    };
  });
}

function calcularIndicadores(produtos) {
  const lista = enriquecer(produtos);
  const comEstoque = lista.filter((p) => p.quantidade_estoque > 0);

  const porFaixa = new Map(FAIXAS.map((chave) => [chave, { chave, lotes: 0, unidades: 0, valor: 0 }]));
  let unidades = 0;
  let valorEstoque = 0;

  for (const p of comEstoque) {
    const faixa = porFaixa.get(p.faixa);
    faixa.lotes += 1;
    faixa.unidades += p.quantidade_estoque;
    faixa.valor += valorDe(p);
    unidades += p.quantidade_estoque;
    valorEstoque += valorDe(p);
  }

  const vencido = porFaixa.get('vencido');
  const critico = porFaixa.get('critico');
  const atencao = porFaixa.get('atencao');
  const valorEmRisco = vencido.valor + critico.valor;

  const fila = comEstoque
    .filter((p) => p.dias_para_vencer !== null)
    .sort((a, b) => a.dias_para_vencer - b.dias_para_vencer || a.nome.localeCompare(b.nome, 'pt-BR'))
    .slice(0, TAMANHO_FILA);

  const porFornecedor = new Map();
  for (const p of comEstoque) {
    if (p.faixa !== 'vencido' && p.faixa !== 'critico') continue;
    const atual = porFornecedor.get(p.fornecedor_id) || {
      fornecedor_id: p.fornecedor_id,
      nome: p.fornecedor_nome,
      lotes: 0,
      unidades: 0,
      valor: 0
    };
    atual.lotes += 1;
    atual.unidades += p.quantidade_estoque;
    atual.valor += valorDe(p);
    porFornecedor.set(p.fornecedor_id, atual);
  }

  return {
    resumo: {
      lotes: lista.length,
      unidades,
      valor_estoque: arredondar(valorEstoque),
      sem_estoque: lista.length - comEstoque.length,
      sem_validade: porFaixa.get('sem_validade').lotes
    },
    risco: {
      valor: arredondar(valorEmRisco),
      percentual: valorEstoque > 0 ? Math.round((valorEmRisco / valorEstoque) * 100) : 0,
      vencidos: { lotes: vencido.lotes, unidades: vencido.unidades },
      criticos: { lotes: critico.lotes, unidades: critico.unidades },
      atencao: { lotes: atencao.lotes, unidades: atencao.unidades }
    },
    faixas: [...porFaixa.values()].map((f) => ({ ...f, valor: arredondar(f.valor) })),
    fila_fefo: fila,
    fornecedores_em_risco: [...porFornecedor.values()]
      .map((f) => ({ ...f, valor: arredondar(f.valor) }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)
  };
}

module.exports = { LIMITE_CRITICO, LIMITE_ATENCAO, faixaDe, enriquecer, calcularIndicadores };
