import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checklist.css';

const Checklist = () => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newTask, setNewTask] = useState('');
  
  // Função para buscar as listas do banco de dados
  const fetchLists = () => {
    axios.get('http://localhost:5000/listas')
      .then((response) => {
        setLists(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar listas:', error);
      });
  };

  // Função para adicionar uma nova lista
  const addList = () => {
    if (newListName) {
      axios.post('http://localhost:5000/listas', { nome: newListName })
        .then((response) => {
          fetchLists(); // Atualiza as listas após a adição
          setNewListName('');
        })
        .catch((error) => {
          console.error('Erro ao adicionar lista:', error);
        });
    }
  };

  // Função para adicionar uma nova tarefa a uma lista específica
  const addTask = (listId) => {
    if (newTask) {
      axios.post('http://localhost:5000/tarefas', { lista_id: listId, nome: newTask })
        .then((response) => {
          fetchLists();  // Atualiza as listas após adicionar a nova tarefa
          setNewTask(''); // Limpa o campo de entrada
        })
        .catch((error) => {
          console.error('Erro ao adicionar tarefa:', error);
        });
    }
  };

  // Função para excluir uma tarefa
  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/tarefas/${taskId}`)
      .then(() => {
        fetchLists();  // Atualiza as listas após a exclusão
      })
      .catch((error) => {
        console.error('Erro ao excluir tarefa:', error);
      });
  };

  // Função para marcar ou desmarcar tarefa como concluída
  const toggleTaskCompletion = (taskId, currentStatus) => {
    axios.put(`http://localhost:5000/tarefas/${taskId}`, { concluida: !currentStatus })
      .then(() => {
        fetchLists();  // Atualiza as listas após a modificação
      })
      .catch((error) => {
        console.error('Erro ao atualizar tarefa:', error);
      });
  };

  // Função para alterar o nome de uma lista
  const changeListName = (listId, newName) => {
    axios.put(`http://localhost:5000/listas/${listId}`, { nome: newName })
      .then(() => {
        fetchLists();  // Atualiza as listas após a alteração de nome
      })
      .catch((error) => {
        console.error('Erro ao alterar nome da lista:', error);
      });
  };

  // Função para excluir uma lista
  const deleteList = (listId) => {
    axios.delete(`http://localhost:5000/listas/${listId}`)
      .then(() => {
        fetchLists(); // Atualiza as listas após a exclusão
      })
      .catch((error) => {
        console.error('Erro ao excluir lista:', error);
      });
  };


  // Carregar as listas do banco de dados ao montar o componente
  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="checklist-container">
      <h1>Check-lists</h1>

      <div className=' nomeLista'>
        <input
          type="text"
          placeholder="Nome da nova lista"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button onClick={addList}>+</button>
      </div>

      {lists.map((list) => (
        <div key={list.id} className="list">
          <div className="list-header">
            <input
              type="text"
              value={list.nome}
              onChange={(e) => changeListName(list.id, e.target.value)}
            />
            <button onClick={() => deleteList(list.id)}>Excluir Lista</button>
          </div>

          <div className="tasks">
            {list.tarefas && list.tarefas.length > 0 ? (
              list.tarefas.map((task) => (
                <div key={task.id} className="task">
                  <input
                    type="checkbox"
                    checked={task.concluida}
                    onChange={() => toggleTaskCompletion(task.id, task.concluida)}
                  />
                  <span className={task.concluida ? 'completed' : ''}>{task.nome}</span>
                  <button onClick={() => deleteTask(task.id)}>X</button>
                </div>
              ))
            ) : (
              <p>Nenhuma tarefa nesta lista.</p>
            )}
          </div>

          <div className="add-task">
            <input
              type="text"
              placeholder="Nova tarefa"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={() => addTask(list.id)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
