import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './logo.jsx';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage(''); // Limpa mensagens de erro anteriores
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(errorText || 'Credenciais inválidas');
        return;
      }

      const data = await response.json();

      // Salva o token no localStorage
      localStorage.setItem('token', data.token);

      // Atualiza o estado de autenticação
      setIsAuthenticated(true);

      // Redireciona para a página protegida
      navigate('/timer');
    } catch (err) {
      console.error('Erro ao realizar login:', err);
      setErrorMessage('Erro ao conectar com o servidor.');
    }
  };

  const handleRegister = () => {
    navigate('/cadastro');
  };

  return (
    <div className="login-container">
      <Logo />
      <h1>Login</h1>
      <label htmlFor="email">E-mail:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu e-mail"
      />

      <label htmlFor="senha">Senha:</label>
      <input
        type="password"
        id="senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Digite sua senha"
      />

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <button onClick={handleLogin}>Entrar</button>
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default Login;
