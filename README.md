# Orbe Supply

Sistema web para um mercadinho cadastrar **fornecedores** e os **produtos** que cada um entrega, com controle de estoque, lote, data de fabricação e data de vencimento.

Trabalho da disciplina N695 - Desenvolvimento de Plataformas Web (Unifor), cenário 6: Mercadinho e seus fornecedores.

## Links

- Aplicação publicada: _(preencher)_
- Repositório: _(preencher)_

## Entidades

- **Fornecedor** (pai): nome, CNPJ, telefone, e-mail.
- **Produto** (filha): nome, quantidade em estoque, preço, lote, data de fabricação, data de vencimento e o fornecedor ao qual pertence.

Um fornecedor tem vários produtos; cada produto pertence a um único fornecedor.

## Tecnologias

- Interface: HTML, CSS e JavaScript puro (`fetch`)
- Serviço web: Node.js + Express
- Banco de dados: PostgreSQL (Supabase)
- Hospedagem: _(preencher)_

## Como rodar localmente

1. Entre em `backend` e instale as dependências: `npm install`
2. Crie o arquivo `backend/.env` com base no `backend/.env.example` (a `DATABASE_URL` do Supabase).
3. Crie as tabelas com o `backend/database/schema.sql` e, se quiser dados de teste, rode o `backend/database/seed.sql` no SQL Editor do Supabase.
4. Inicie: `npm start` (ou `npm run dev` para reiniciar sozinho ao salvar)
5. Abra `http://localhost:3000`. O servidor entrega as páginas e a API no mesmo endereço.

## Estrutura (separação em camadas)

```
backend/
├── routes/         URLs e métodos HTTP
├── controllers/    lê a requisição e monta a resposta
├── services/       regras do cenário e validações
├── repositories/   único lugar com SQL
├── database/       conexão, schema.sql e seed.sql
├── utils/          erros, validação e regras de estoque/FEFO (estoque.js)
└── server.js
frontend/
├── *.html          telas (painel, estoque, fornecedores, formulários)
├── css/estilo.css
└── js/             api.js (único com fetch), utils.js, menu.js e um script por tela
```

## API

| Método | Rota | O que faz |
|---|---|---|
| GET | /fornecedores | lista fornecedores |
| GET | /fornecedores/:id | busca um fornecedor |
| POST | /fornecedores | cria fornecedor |
| PUT | /fornecedores/:id | atualiza fornecedor |
| DELETE | /fornecedores/:id | exclui (bloqueia se houver produtos) |
| GET | /fornecedores/:id/produtos | lista produtos do fornecedor |
| GET | /produtos | lista todos os lotes, do que vence primeiro ao último |
| GET | /indicadores/estoque | indicadores do painel (valor em risco, faixas de validade, fila FEFO) |
| POST | /fornecedores/:id/produtos | cria produto do fornecedor |
| GET | /produtos/:id | busca um produto |
| PUT | /produtos/:id | atualiza produto |
| DELETE | /produtos/:id | exclui produto |

## Indicadores de estoque (FEFO)

FEFO (First Expired, First Out): sai primeiro o lote que vence primeiro. Cada produto cadastrado é um lote, e o painel mostra:

- valor em estoque e valor em risco (lotes vencidos ou a até 7 dias de vencer);
- lotes por faixa de validade: vencido, até 7 dias, 8 a 30, 31 a 90, mais de 90 e sem validade;
- fila FEFO com os 10 lotes que devem sair primeiro, vida útil restante e ação sugerida;
- valor em risco por fornecedor.

Os dias para vencer são calculados no banco, no fuso de Fortaleza. As faixas e os indicadores ficam em `backend/utils/estoque.js`. Lotes sem estoque não entram nos valores de risco.

## Regras de validação

- Campos obrigatórios (nome do fornecedor, CNPJ, nome do produto, estoque).
- CNPJ com 14 dígitos (pontuação é removida antes de contar) e sem repetição.
- Quantidade em estoque inteira e não negativa; preço não negativo.
- Datas existentes no calendário (31/02 é recusado) e vencimento não anterior à fabricação.
- Limites de tamanho dos textos, de preço e de estoque conforme as colunas do banco; e-mail com formato válido.
- Não é possível excluir um fornecedor que ainda tenha produtos (status 409).

## Uso de IA generativa

Foi usada IA generativa (Claude, da Anthropic) como apoio: explicações de conceitos, revisão de scripts SQL, orientação sobre a arquitetura em camadas e geração de código-base, que a equipe revisou e testou. _(Ajuste este texto conforme o que a equipe realmente fez e repita a declaração no PDF, seção 11.)_
