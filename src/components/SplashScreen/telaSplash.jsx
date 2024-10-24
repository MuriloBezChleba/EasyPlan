import React, { useEffect, useState } from "react";
import Tela from "./telaLogo.svg";
import './telaSplash.css'; // Para incluir o CSS

function TelaSplash() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false); // Esconde a tela após 3 segundos
        }, 1500);

        return () => clearTimeout(timer); // Limpa o timer ao desmontar
    }, []);

    return (
        <div className={`splash-screen ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <img src={Tela} alt="Tela de Splash" />
        </div>
    );
}

export default TelaSplash;