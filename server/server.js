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
  const { tempoAtiv, dataAtiv } = req.body;
  const horaAtiv = new Date().toISOString().slice(0, 19).replace('T', ' '); // Obtém a data e hora atual no formato correto

  if (!tempoAtiv || isNaN(tempoAtiv) || !dataAtiv) {
    return res.status(400).json({ error: 'Dados inválidos!' });
  }

  // Verifica se já existe um registro com a mesma horaAtiv
  db.query('SELECT * FROM tbpomodoro WHERE horaAtiv = ?', [horaAtiv], (err, result) => {
    if (err) {
      console.error('Erro ao verificar duplicação de horaAtiv:', err);
      return res.status(500).json({ error: 'Erro ao verificar duplicação de horário.' });
    }

    if (result.length > 0) {
      // Se já existe, retorna erro
      return res.status(400).json({ error: 'Já existe uma inserção com o mesmo horário!' });
    }

    // Se não existir duplicação, prossegue com a inserção
    db.query('SELECT * FROM tbpomodoro ORDER BY id DESC LIMIT 1', (err, result) => {
      if (err) {
        console.error('Erro ao recuperar o tempo total:', err);
        return res.status(500).json({ error: 'Erro ao salvar o tempo de atividade.' });
      }

      const lastTotalTime = result[0] ? result[0].tempoTotal : 0;
      const totalTime = lastTotalTime + tempoAtiv;

      db.query('INSERT INTO tbpomodoro (tempoAtiv, tempoTotal, horaAtiv) VALUES (?, ?, ?)', [tempoAtiv, totalTime, horaAtiv], (err) => {
        if (err) {
          console.error('Erro ao salvar tempoAtiv:', err);
          return res.status(500).json({ error: 'Erro ao salvar o tempo de atividade.' });
        }

        // Insere na tabela tbestat
        db.query('INSERT INTO tbestat (tempoAtiv, dataAtiv, horaAtiv) VALUES (?, ?, ?)', [tempoAtiv, dataAtiv, horaAtiv], (err) => {
          if (err) {
            console.error('Erro ao salvar na tbestat:', err);
            return res.status(500).json({ error: 'Erro ao salvar a estatística.' });
          }

          res.status(200).json({ message: 'Tempo salvo com sucesso!', totalTime });
        });
      });
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

//get do grafico
// Adicionar biblioteca para lidar com formatação de datas
const moment = require('moment');

app.get('/api/grafico', (req, res) => {
  const query = `
    SELECT DATE(horaAtiv) AS data, SUM(tempoAtiv) AS tempoTotal
    FROM tbpomodoro
    WHERE DATE(horaAtiv) BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
    GROUP BY DATE(horaAtiv)
    ORDER BY DATE(horaAtiv) ASC;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao consultar dados:', err);
      return res.status(500).json({ error: 'Erro ao consultar dados' });
    }

    const days = [];
    const timeData = [];

    // Gerar os últimos 7 dias no formato 'YYYY-MM-DD'
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      days.push(date);
      timeData.push(0);
    }

    // Mapeamento dos resultados
    result.forEach(row => {
      const index = days.indexOf(moment(row.data).format('YYYY-MM-DD'));
      if (index !== -1) {
        timeData[index] = row.tempoTotal;
      }
    });

    console.log("Datas geradas:", days);
    console.log("TimeData mapeado:", timeData);
    res.json({ days, timeData });
  });
});




// Rota para criar uma nova lista
app.post('/listas', (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome da lista é obrigatório' });
  }

  const query = 'INSERT INTO listas (nome) VALUES (?)';
  db.query(query, [nome], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar lista' });
    }
    res.status(201).json({ message: 'Lista criada com sucesso', listaId: result.insertId });
  });
});


// Rota para listar todas as listas com suas tarefas
app.get('/listas', (req, res) => {
  const query = `
    SELECT listas.id, listas.nome, listas.data_criacao,
      (SELECT JSON_ARRAYAGG(
          JSON_OBJECT('id', tarefas.id, 'nome', tarefas.nome, 'concluida', tarefas.concluida)
        ) 
      FROM tarefas WHERE tarefas.lista_id = listas.id) AS tarefas
    FROM listas
  `;

  db.query(query, (err, lists) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar listas' });
    }
    res.status(200).json(lists);
  });
});

// Rota para alterar o nome de uma lista
app.put('/listas/:id', (req, res) => {
  const listaId = req.params.id;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome da lista é obrigatório' });
  }

  const query = 'UPDATE listas SET nome = ? WHERE id = ?';
  db.query(query, [nome, listaId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar lista' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lista não encontrada' });
    }

    res.status(200).json({ message: 'Lista atualizada com sucesso' });
  });
});



// Rota para criar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const { lista_id, nome } = req.body;

  if (!lista_id || !nome) {
    return res.status(400).json({ error: 'Lista ID e nome da tarefa são obrigatórios' });
  }

  const query = 'INSERT INTO tarefas (lista_id, nome) VALUES (?, ?)';
  db.query(query, [lista_id, nome], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
    res.status(201).json({ message: 'Tarefa criada com sucesso', tarefaId: result.insertId });
  });
});

// Rota para listar as tarefas de uma lista específica
app.get('/listas/:id/tarefas', (req, res) => {
  const listaId = req.params.id;
  const query = 'SELECT * FROM tarefas WHERE lista_id = ?';
  
  db.query(query, [listaId], (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
    res.status(200).json(tasks);
  });
});

// Rota para atualizar o status da tarefa (concluída ou não)
app.put('/tarefas/:id', (req, res) => {
  const tarefaId = req.params.id;
  const { concluida } = req.body;

  if (typeof concluida !== 'boolean') {
    return res.status(400).json({ error: 'O status de conclusão deve ser um valor booleano' });
  }

  const query = 'UPDATE tarefas SET concluida = ? WHERE id = ?';
  db.query(query, [concluida, tarefaId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
    res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
  });
});

// Rota para excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
  const tarefaId = req.params.id;
  const query = 'DELETE FROM tarefas WHERE id = ?';
  
  db.query(query, [tarefaId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  });
});


// Rota para excluir uma lista e suas tarefas associadas
app.delete('/listas/:id', (req, res) => {
  const listaId = req.params.id;

  // Exclui as tarefas associadas antes de excluir a lista
  const deleteTasksQuery = 'DELETE FROM tarefas WHERE lista_id = ?';
  db.query(deleteTasksQuery, [listaId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir tarefas da lista' });
    }

    // Exclui a lista
    const deleteListQuery = 'DELETE FROM listas WHERE id = ?';
    db.query(deleteListQuery, [listaId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao excluir lista' });
      }
      res.status(200).json({ message: 'Lista excluída com sucesso' });
    });
  });
});

app.get('/get-last-pomodoro', (req, res) => {
  const query = 'SELECT idPlaneta FROM tbpomodoro ORDER BY id DESC LIMIT 1';
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar último pomodoro' });
    res.status(200).json(result[0] || { idPlaneta: null });
  });
});

app.put('/update-planet', (req, res) => {
  const { idPlaneta } = req.body;
  const query = 'UPDATE tbpomodoro SET idPlaneta = ? ORDER BY id DESC LIMIT 1';
  db.query(query, [idPlaneta], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar planeta' });
    res.status(200).json({ message: 'Planeta atualizado com sucesso' });
  });
});

app.get('/get-total-time', (req, res) => {
  const query = 'SELECT tempoTotal FROM tbpomodoro ORDER BY id DESC LIMIT 1';
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tempo total' });
    res.status(200).json(result[0] || { tempoTotal: 0 });
  });
});


// Atualizar senha com criptografia
app.put('/update-password', (req, res) => {
  const { idu, senha } = req.body;

  if (!idu || !senha) {
    return res.status(400).json({ error: 'Campos obrigatórios não informados' });
  }

  bcrypt.hash(senha, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criptografar a senha' });
    }

    const query = 'UPDATE tblogin SET senha = ? WHERE idu = ?';
    db.query(query, [hashedPassword, idu], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar senha' });
      }
      res.status(200).json({ message: 'Senha atualizada com sucesso' });
    });
  });
});

// Atualizar nome de usuário
app.put('/update-username', (req, res) => {
  const { idu, nome } = req.body;
  const query = 'UPDATE tblogin SET nome = ? WHERE idu = ?';

  db.query(query, [nome, idu], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar nome de usuário' });
    }
    res.status(200).json({ message: 'Nome de usuário atualizado com sucesso' });
  });
});

// Atualizar email
app.put('/update-email', (req, res) => {
  const { idu, email } = req.body;
  const query = 'UPDATE tblogin SET email = ? WHERE idu = ?';

  db.query(query, [email, idu], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar email' });
    }
    res.status(200).json({ message: 'Email atualizado com sucesso' });
  });
});

// Inserir feedback
app.post('/feedback', (req, res) => {
  const { idu, nota, comentario } = req.body;

  if (nota < 0 || nota > 5) {
    return res.status(400).json({ error: 'A nota deve estar entre 0 e 5.' });
  }

  const query = 'INSERT INTO feedback (idu, nota, comentario) VALUES (?, ?, ?)';

  db.query(query, [idu, nota, comentario], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao inserir feedback' });
    }
    res.status(201).json({ message: 'Feedback inserido com sucesso' });
  });
});

app.get('/api/tempo', (req, res) => {
  const queryTotal = 'SELECT tempoTotal FROM tbpomodoro ORDER BY horaAtiv DESC LIMIT 1';  // Pega o tempo da última inserção
  const queryHoje = 'SELECT SUM(tempoAtiv) AS tempoHoje FROM tbpomodoro WHERE DATE(horaAtiv) = CURDATE()';
  const queryOntem = 'SELECT SUM(tempoAtiv) AS tempoOntem FROM tbpomodoro WHERE DATE(horaAtiv) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)';

  db.query(queryTotal, (err, totalResult) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tempo total' });

    db.query(queryHoje, (err, hojeResult) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar tempo de hoje' });

      db.query(queryOntem, (err, ontemResult) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar tempo de ontem' });

        res.status(200).json({
          totalTempo: totalResult[0] ? totalResult[0].tempoTotal : 0,  // Se houver resultado, usa o tempo da última inserção
          tempoHoje: hojeResult[0].tempoHoje || 0,
          tempoOntem: ontemResult[0].tempoOntem || 0,
        });
      });
    });
  });
});



// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
