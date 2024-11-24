// db.js
const mysql = require('mysql2');  // Usando mysql2

// Configuração da conexão
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'easy_plan',
});

// Teste da conexão
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

module.exports = db;
