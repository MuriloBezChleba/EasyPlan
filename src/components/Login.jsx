import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./logo.jsx";
import axios from "axios";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');  // Corrigi o nome do estado de 'senha' para 'setSenha'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value.includes('@')) {
      setErrorMessage('Por favor, insira um e-mail válido.');
    } else {
      setErrorMessage('');
    }
  };

  const handlePasswordChange = (e) => {
    setSenha(e.target.value);  // Corrigi a função para atualizar o estado de 'senha'
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // Enviar o email
          senha: senha, // Enviar a senha em texto claro
        }),
      });
  
      // Verifica se a resposta é válida (erro 400)
      if (!response.ok) {
        // Lê a resposta como texto (caso não seja JSON)
        const errorText = await response.text();
        setErrorMessage(errorText);  // Exibe a mensagem de erro recebida
        console.log('Erro no login:', errorText);
        return;
      }
  
      // Se a resposta for 200 (OK), tenta obter a resposta como JSON
      const data = await response.json();
  
      console.log('Login realizado com sucesso:', data);
      setIsAuthenticated(true);
      navigate('/timer');  // Redireciona para a página inicial
    } catch (err) {
      console.error('Erro na requisição:', err);
      setErrorMessage('Erro ao conectar com o servidor');
    }
  };
  
  
  

  const handleRegister = () => {
    navigate('/cadastro');
  };

  return (
    <div className="login-container">
      <Logo />
      <label htmlFor="email">E-mail:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Digite seu e-mail"
        className="email-input"
      />
      {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
      
      <label htmlFor="password">Senha:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={senha}  // Corrigi a referência de 'password' para 'senha'
        onChange={handlePasswordChange}
        placeholder="Digite sua senha"
        className="password-input"
      />

      <div className="button-container">
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Registrar</button>
      </div>
    </div>
  );
};

export default Login;
