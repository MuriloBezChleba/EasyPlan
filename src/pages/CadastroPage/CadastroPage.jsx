// src/pages/CadastroPage/CadastroPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importe o Link do React Router

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

  const handleSubmit = (e) => {
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
    alert('Conta criada com sucesso!');
    console.log('Dados enviados:', formData);
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
          <label htmlFor="confirmSenha">Confirme a senha:</label>
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
        <button type="submit" style={styles.button}>
          Criar Conta
        </button>
      </form>

      {/* Link para a tela de login */}
      <p style={styles.loginText}>
        Já tem conta?{' '}
        <Link to="/" style={styles.loginLink}>
          Entrar
        </Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  loginText: {
    marginTop: '20px',
    fontSize: '14px',
  },
  loginLink: {
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default CadastroPage;
