const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
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

//salvar o pomodoro
app.post('/save-pomodoro', (req, res) => {
  const { tempoAtiv } = req.body;
  console.log('Tempo de atividade recebido:', tempoAtiv); // Verifique o valor recebido
  
  if (!tempoAtiv || isNaN(tempoAtiv)) {
    return res.status(400).json({ error: 'Tempo inválido!' });
  }

  // Verificar se já existe um registro para o mesmo tempo de atividade
  db.query('SELECT * FROM tbpomodoro ORDER BY id DESC LIMIT 1', (err, result) => {
    if (err) {
      console.error('Erro ao recuperar o tempo total:', err);
      return res.status(500).json({ error: 'Erro ao salvar o tempo de atividade.' });
    }

    // Se o tempo de atividade já foi salvo, não insira novamente
    if (result.length > 0 && result[0].tempoAtiv === tempoAtiv) {
      return res.status(400).json({ error: 'Esse tempo de atividade já foi salvo.' });
    }

    // Recupera o último tempo total armazenado
    const lastTotalTime = result[0] ? result[0].tempoTotal : 0;

    // Calcula o novo tempo total
    const totalTime = lastTotalTime + tempoAtiv;

    // Insere o novo tempo de atividade com o tempo total atualizado
    db.query('INSERT INTO tbpomodoro (tempoAtiv, tempoTotal) VALUES (?, ?)', [tempoAtiv, totalTime], (err) => {
      if (err) {
        console.error('Erro ao salvar tempoAtiv:', err);
        return res.status(500).json({ error: 'Erro ao salvar o tempo de atividade.' });
      }

      // Retorna o tempo total acumulado
      res.status(200).json({ message: 'Tempo total salvo com sucesso!', totalTime });
    });
  });
});

//login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Consulta o banco de dados para verificar o usuário
  db.query('SELECT * FROM tblogin WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = result[0];

    // Verifica a senha com bcrypt
    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar a senha' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      // Se a senha estiver correta, envia uma resposta de sucesso
      res.status(200).json({ message: 'Login bem-sucedido', token: 'fake-jwt-token' });
    });
  });
});

// Rota para cadastro de usuário
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Campos obrigatórios não informados');
  }

  db.query('SELECT * FROM tblogin WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).send('Erro no banco de dados');
    if (result.length > 0) return res.status(400).send('Email já registrado');

    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) return res.status(500).send('Erro ao criptografar a senha');

      db.query('INSERT INTO tblogin (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword], (err) => {
        if (err) return res.status(500).send('Erro ao registrar usuário');
        res.status(201).send('Cadastro realizado com sucesso');
      });
    });
  });
});

// Rota para adicionar um compromisso
app.post('/api/calendario', (req, res) => {
  const { name, time, location, details, date, anotacoes } = req.body;

  if (!name || !time || !location || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).send('Campos obrigatórios não informados ou formato de data inválido');
  }
  
  // Verifica se já existe um compromisso para a mesma data e hora
  const checkQuery = 'SELECT * FROM calendario WHERE DATE(dataAtiv) = ? AND time = ? AND location = ?';
  db.query(checkQuery, [date, time, location], (err, result) => {
    if (err) {
      return res.status(500).send('Erro ao verificar compromisso');
    }

    if (result.length > 0) {
      return res.status(400).send('Já existe um compromisso para esse horário e local');
    }

    const query = 'INSERT INTO calendario (name, time, location, details, dataAtiv, anotacoes) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, time, location, details, date, anotacoes], (err, result) => {
      if (err) {
        return res.status(500).send('Erro ao adicionar compromisso');
      }

      res.status(201).send({ id: result.insertId, name, time, location, details, date, anotacoes });
    });
  });
});


app.get('/api/calendario/month/:monthKey', (req, res) => {
  const { monthKey } = req.params;

  const query = 'SELECT * FROM calendario WHERE DATE_FORMAT(dataAtiv, "%Y-%m") = ?';
  db.query(query, [monthKey], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar compromissos mensais.' });
    }
    res.status(200).json(result);
  });
});




// Rota para buscar compromissos de uma data específica
app.get('/api/calendario/:date', (req, res) => {
  const { date } = req.params;

  // Use DATE_FORMAT para garantir que a comparação de datas seja feita corretamente
  const query = 'SELECT * FROM calendario WHERE DATE_FORMAT(dataAtiv, "%Y-%m-%d") = ?';
  db.query(query, [date], (err, result) => {
    if (err) {
      console.error('Erro ao buscar compromissos:', err);
      return res.status(500).send('Erro ao buscar compromissos');
    }
    res.json(result);
  });
});

// Rota para deletar um compromisso
app.delete('/api/calendario/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send('ID do compromisso não fornecido');
  }

  const query = 'DELETE FROM calendario WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
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
