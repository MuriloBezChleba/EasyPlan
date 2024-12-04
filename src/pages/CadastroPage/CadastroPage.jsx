import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CadastroPage.css';

function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
  });

  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await axios.post('http://localhost:5000/cadastro', formData);
      alert('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      setErro(error.response ? error.response.data : 'Erro ao criar conta.');
    }
  };

  return (
    <main>
      <div className="cadastro-container">
        <div className="planets">
          <img src='/planetas/0.svg' alt='terra'/>
          <img src='/planetas/9.svg' alt='planeta9'/>
          <img src='/planetas/1.svg' alt='planeta1'/>
        </div>
        {erro && <p className="cadastro-error">{erro}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="cadastro-input"
              placeholder="Digite seu nome"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="cadastro-input"
              placeholder="Digite seu email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="cadastro-input"
              placeholder="Digite sua senha"
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmSenha">Confirmar Senha:</label>
            <input
              type="password"
              id="confirmSenha"
              name="confirmSenha"
              value={formData.confirmSenha}
              onChange={handleChange}
              className="cadastro-input"
              placeholder="Confirme sua senha"
            />
          </div>
          <button type="submit" className="cadastro-button">Cadastrar</button>
        </form>
        <p>
          Já tem uma conta? <Link to="/login" className="cadastro-link">Faça login</Link>
        </p>
      </div>
    </main>
  );
}

export default CadastroPage;
