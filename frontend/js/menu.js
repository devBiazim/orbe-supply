// Menu lateral compartilhado. Cada página marca a sua seção em <body data-pagina="...">.
(function () {
  const itens = [
    {
      pagina: 'painel',
      href: 'index.html',
      rotulo: 'Painel',
      icone: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'
    },
    {
      pagina: 'estoque',
      href: 'estoque.html',
      rotulo: 'Estoque (FEFO)',
      icone: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>'
    },
    {
      pagina: 'fornecedores',
      href: 'fornecedores.html',
      rotulo: 'Fornecedores',
      icone: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>'
    }
  ];

  const atual = document.body.dataset.pagina;
  const links = itens.map((item) => `
    <a href="${item.href}" ${item.pagina === atual ? 'aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.icone}</svg>
      ${item.rotulo}
    </a>`).join('');

  document.getElementById('menu').innerHTML = `
    <a class="marca" href="index.html"><img src="img/logo.svg" alt="Orbe Supply"></a>
    <nav class="menu" aria-label="Principal">${links}</nav>`;
})();
