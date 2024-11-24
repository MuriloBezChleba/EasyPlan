const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Conexão com o banco de dados
const db = require('../db/connections');

// Função para registro
const registerUser = (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se o email já está registrado
  db.query('SELECT * FROM tblogin WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).send('Erro no banco de dados');
    if (result.length > 0) return res.status(400).send('Email já registrado');

    // Criptografar a senha
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) return res.status(500).send('Erro ao criptografar a senha');
      
      // Inserir dados no banco de dados
      db.query('INSERT INTO tblogin (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send('Erro ao registrar usuário');
        res.status(201).send('Cadastro realizado com sucesso');
      });
    });
  });
};

// Função para login
const loginUser = (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM tblogin WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).send('Erro no banco de dados');
    if (result.length === 0) return res.status(400).send('Usuário não encontrado');

    const user = result[0];

    // Verificar senha
    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err) return res.status(500).send('Erro ao comparar senhas');
      if (!isMatch) return res.status(400).send('Senha incorreta');
      
      // Gerar token JWT
      const token = jwt.sign({ idu: user.idu }, 'secreta', { expiresIn: '1h' });
      res.json({ message: 'Login bem-sucedido', token });
    });
  });
};

module.exports = { registerUser, loginUser };
