import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook para navegação
import Logo from "./logo.jsx";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate(); // Hook para redirecionar

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!e.target.value.includes('@')) {
            setErrorMessage('Por favor, insira um e-mail válido.');
        } else {
            setErrorMessage('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        console.log("Login realizado com:", { email, password });
        navigate('/timer')
    };

    const handleRegister = () => {
        console.log("Redirecionando para registro...");
        navigate('/cadastro'); // Redireciona para a rota de cadastro
    };

    const handleForgotPassword = () => {
        console.log("Redirecionar para recuperação de senha");
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
                value={password}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha"
                className="password-input"
            />

            <div className="button-container">
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleRegister}>Registrar</button>
                <button onClick={handleForgotPassword}>Esqueci a Senha</button>
            </div>
        </div>
    );
};

export default Login;
