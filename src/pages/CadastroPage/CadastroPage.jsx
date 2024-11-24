// src/pages/CadastroPage/CadastroPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importe o Link do React Router
import axios from 'axios'; // Importe axios para fazer requisições HTTP

function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
  });

  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações simples
    if (formData.senha !== formData.confirmSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!formData.nome || !formData.email || !formData.senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setErro('');

    try {
      // Enviando os dados para a API
      const response = await axios.post('http://localhost:5000/cadastro', formData);
      alert('Conta criada com sucesso!');
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      if (error.response) {
        setErro(error.response.data);
      } else {
        setErro('Erro ao criar conta.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Cadastro</h1>
      {erro && <p style={styles.error}>{erro}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Digite seu nome"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu email"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Digite sua senha"
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmSenha">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmSenha"
            name="confirmSenha"
            value={formData.confirmSenha}
            onChange={handleChange}
            placeholder="Confirme sua senha"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Cadastrar</button>
      </form>
      <p>
        Já tem uma conta? <Link to="/login" style={styles.link}>Faça login</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
  },
};

export default CadastroPage;
