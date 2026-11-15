function escaparHtml(texto) {
  const trocas = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto ?? '').replace(/[&<>"']/g, (caractere) => trocas[caractere]);
}

function lerParametro(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}

function mostrarMensagem(texto, tipo = 'erro') {
  const caixa = document.getElementById('mensagem');
  caixa.textContent = texto;
  caixa.className = 'mensagem ' + tipo;
  caixa.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
  caixa.hidden = false;
}

function limparMensagem() {
  document.getElementById('mensagem').hidden = true;
}

function formatarCnpj(cnpj) {
  const digitos = String(cnpj || '').replace(/\D/g, '');
  if (digitos.length !== 14) {
    return cnpj;
  }
  return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function formatarData(data) {
  if (!data) {
    return '—';
  }
  const [ano, mes, dia] = String(data).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarPreco(valor) {
  if (valor === null || valor === undefined) {
    return '—';
  }
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarNumero(valor) {
  return Number(valor).toLocaleString('pt-BR');
}

function pluralizar(quantidade, singular, plural) {
  return `${quantidade} ${Math.abs(quantidade) === 1 ? singular : plural}`;
}

// A faixa e os dias vêm da API (calculados no banco, no fuso de Fortaleza).
function descreverValidade(produto) {
  if (produto.quantidade_estoque === 0) {
    return { texto: 'Sem estoque', classe: 'neutro' };
  }
  const dias = produto.dias_para_vencer;
  switch (produto.faixa) {
    case 'sem_validade':
      return { texto: 'Sem validade', classe: 'neutro' };
    case 'vencido':
      return { texto: `Vencido há ${pluralizar(-dias, 'dia', 'dias')}`, classe: 'vencido' };
    case 'critico':
      return { texto: dias === 0 ? 'Vence hoje' : `Vence em ${pluralizar(dias, 'dia', 'dias')}`, classe: 'critico' };
    case 'atencao':
      return { texto: `Vence em ${dias} dias`, classe: 'atencao' };
    default:
      return { texto: 'Em dia', classe: 'ok' };
  }
}

function acaoSugerida(produto) {
  const dias = produto.dias_para_vencer;
  switch (produto.faixa) {
    case 'vencido':
      return 'Retirar da venda';
    case 'critico':
      return dias <= 3 ? 'Fazer promoção' : 'Vender primeiro';
    case 'atencao':
      return 'Manter à frente';
    default:
      return '—';
  }
}

function barraVidaUtil(produto) {
  if (produto.vida_util_restante === null || produto.vida_util_restante === undefined) {
    return '—';
  }
  const percentual = produto.vida_util_restante;
  return `
    <div class="vida" title="${percentual}% da vida útil restante">
      <div class="vida-trilho"><span class="cor-${produto.faixa}" style="width: ${percentual}%"></span></div>
      <small>${percentual}%</small>
    </div>`;
}

function celulaVencimento(produto) {
  const situacao = descreverValidade(produto);
  return `
    ${formatarData(produto.data_vencimento)}
    <span class="secundario"><span class="selo ${situacao.classe}">${escaparHtml(situacao.texto)}</span></span>`;
}
