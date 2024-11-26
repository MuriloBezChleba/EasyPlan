const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Middleware para permitir o envio de JSON

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'easy_plan',
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Acesso negado');

  jwt.verify(token, 'secreta', (err, user) => {
    if (err) return res.status(403).send('Token inválido');
    req.user = user;
    next();
  });
};


// Rota para salvar o tempo de atividade (Pomodoro) e a data
app.post('/save-pomodoro', (req, res) => {
  const { tempoAtiv } = req.body; // tempoAtiv em minutos
  console.log(`Tempo recebido: ${tempoAtiv}`); // Verifique se tempoAtiv está sendo recebido corretamente

  // Verificar se tempoAtiv está definido e é um número válido
  if (!tempoAtiv || isNaN(tempoAtiv)) {
    return res.status(400).json({ error: 'Tempo inválido!' });
  }

  // Inserir tempoAtiv na tabela tbpomodoro
  db.query('INSERT INTO tbpomodoro (tempoAtiv) VALUES (?)', [tempoAtiv], (err, result) => {
    if (err) {
      console.error('Erro ao salvar tempoAtiv na tbpomodoro:', err);
      return res.status(500).json({ error: 'Erro ao salvar o tempo de atividade.' });
    }

    // Salvar estatísticas na tbestat
    const dataAtiv = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    db.query('INSERT INTO tbestat (tempoAtiv, dataAtiv) VALUES (?, ?)', [tempoAtiv, dataAtiv], (err, result) => {
      if (err) {
        console.error('Erro ao salvar na tbestat:', err);
        return res.status(500).json({ error: 'Erro ao salvar as estatísticas.' });
      }

      // Se não houver erro, enviar uma resposta de sucesso
      res.status(200).json({ message: 'Tempo e estatísticas salvos com sucesso!' });
    });
  });
});





// Rota para cadastro de usuário
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Campos obrigatórios não informados');
  }

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
});

// Rota de login
// Rota de login
app.post('/login', (req, res) => {
  console.log('Recebendo dados de login:', req.body);
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send('Campos obrigatórios não informados');
  }

  db.query('SELECT * FROM tblogin WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).send('Erro no banco de dados');
    if (result.length === 0) return res.status(400).send('Usuário não encontrado');

    const user = result[0];

    // Comparação da senha usando bcrypt
    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err) return res.status(500).send('Erro ao comparar senhas');
      if (!isMatch) return res.status(400).send('Senha incorreta');

      // Gerar token JWT
      const token = jwt.sign({ idu: user.idu }, 'secreta', { expiresIn: '1h' });
      res.json({ message: 'Login bem-sucedido', token });
    });
  });
});




// Rota para adicionar um compromisso
app.post('/api/calendario', authenticateToken, (req, res) => {
  const { name, time, location, details, date, anotacoes } = req.body;

  if (!name || !time || !location || !date) {
    return res.status(400).send('Campos obrigatórios não informados');
  }

  console.log('Recebendo dados para adicionar compromisso:', req.body);

  const checkQuery = 'SELECT * FROM calendario WHERE DATE(dataAtiv) = ? AND time = ? AND location = ?';
  db.query(checkQuery, [date, time, location], (err, result) => {
    if (err) {
      console.error('Erro ao verificar compromisso existente:', err);
      return res.status(500).send('Erro ao verificar compromisso');
    }

    if (result.length > 0) {
      return res.status(400).send('Já existe um compromisso para esse horário e local');
    }

    const query = 'INSERT INTO calendario (name, time, location, details, dataAtiv, anotacoes) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, time, location, details, date, anotacoes], (err, result) => {
      if (err) {
        console.error('Erro ao adicionar compromisso:', err);
        return res.status(500).send('Erro ao adicionar compromisso');
      }

      res.status(201).send({
        id: result.insertId,
        name,
        time,
        location,
        details,
        date,
        anotacoes
      });
    });
  });
});

// Rota para buscar compromissos de uma data específica
app.get('/api/calendario/:date', authenticateToken, (req, res) => {
  const { date } = req.params;

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
  }

  console.log(`Buscando compromissos para a data: ${date}`);
  
  const query = 'SELECT * FROM calendario WHERE DATE(dataAtiv) = ?';
  db.query(query, [date], (err, result) => {
    if (err) {
      console.error('Erro ao buscar compromissos:', err);
      return res.status(500).json({ error: 'Erro ao buscar dados' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Nenhum compromisso encontrado' });
    }

    res.status(200).json(result);
  });
});

// Rota para deletar um compromisso
app.delete('/api/calendario/:id', authenticateToken, (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send('ID do compromisso não fornecido');
  }

  const query = 'DELETE FROM calendario WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar compromisso:', err);
      return res.status(500).send('Erro ao deletar compromisso');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Compromisso não encontrado');
    }

    res.status(200).send('Compromisso deletado com sucesso');
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
