function apenasDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

function textoOuNulo(valor) {
  const texto = String(valor ?? '').trim();
  return texto === '' ? null : texto;
}

function numeroOuNulo(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === '') {
    return null;
  }
  return Number(valor);
}

// Date.parse('2026-02-31') não falha (o V8 empurra para março), então confere o dia de volta.
function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return false;
  }
  const [ano, mes, dia] = texto.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return (
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes - 1 &&
    data.getUTCDate() === dia
  );
}

function emailValido(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
}

module.exports = { apenasDigitos, textoOuNulo, numeroOuNulo, dataValida, emailValido };
