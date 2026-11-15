const { Pool, types } = require('pg');

// Colunas DATE (código 1082) voltam como texto "AAAA-MM-DD".
// Sem isso, o driver converte para Date e o fuso horário pode mudar o dia.
types.setTypeParser(1082, (valor) => valor);

// O Supabase exige SSL e o certificado do pooler não passa na verificação padrão do Node.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
