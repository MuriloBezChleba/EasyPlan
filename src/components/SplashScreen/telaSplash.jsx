import React, { useEffect, useState } from "react";
import Tela from "./telaLogo.svg";
import './telaSplash.css'; // Para incluir o CSS

function TelaSplash({ onSplashEnd }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false); // Esconde a tela após 1,5 segundos
            onSplashEnd(); // Chama a função para notificar o fim da splash screen
        }, 1500);

        return () => clearTimeout(timer); // Limpa o timer ao desmontar
    }, [onSplashEnd]);

    return (
        <div className={`splash-screen ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <img src={Tela} alt="Tela de Splash" />
        </div>
    );
}

export default TelaSplash;
