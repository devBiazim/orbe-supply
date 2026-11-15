const fornecedorId = lerParametro('id');
const formFornecedor = document.getElementById('form-fornecedor');

function lerFormularioFornecedor() {
  return {
    nome: document.getElementById('nome').value.trim(),
    cnpj: document.getElementById('cnpj').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    email: document.getElementById('email').value.trim()
  };
}

function validarFornecedor(dados) {
  if (dados.nome === '') {
    return 'O nome é obrigatório.';
  }
  if (dados.cnpj.replace(/\D/g, '').length !== 14) {
    return 'O CNPJ deve ter 14 dígitos.';
  }
  return null;
}

function preencherFormulario(fornecedor) {
  document.getElementById('nome').value = fornecedor.nome;
  document.getElementById('cnpj').value = formatarCnpj(fornecedor.cnpj);
  document.getElementById('telefone').value = fornecedor.telefone || '';
  document.getElementById('email').value = fornecedor.email || '';
}

async function carregarFornecedorParaEdicao() {
  document.getElementById('titulo').textContent = 'Editar fornecedor';
  try {
    preencherFormulario(await api.buscarFornecedor(fornecedorId));
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

async function salvarFornecedor(evento) {
  evento.preventDefault();
  limparMensagem();

  const dados = lerFormularioFornecedor();
  const problema = validarFornecedor(dados);
  if (problema) {
    mostrarMensagem(problema);
    return;
  }

  try {
    if (fornecedorId) {
      await api.atualizarFornecedor(fornecedorId, dados);
    } else {
      await api.criarFornecedor(dados);
    }
    window.location.href = 'fornecedores.html';
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

formFornecedor.addEventListener('submit', salvarFornecedor);
document.getElementById('cnpj').addEventListener('blur', (evento) => {
  evento.target.value = formatarCnpj(evento.target.value.trim());
});
if (fornecedorId) {
  carregarFornecedorParaEdicao();
}
