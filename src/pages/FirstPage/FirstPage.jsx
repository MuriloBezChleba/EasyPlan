import React, { useState } from "react";
import "./FirstPage.css";
import TelaSplash from "../../components/SplashScreen/telaSplash";
import "../../components/Login.css"
import Login from "../../components/Login";

const FirstPage = () => {
    const [showContent, setShowContent] = useState(false); // Estado para controlar a exibição de todo o conteúdo

    // Função chamada quando o splash screen termina
    const handleSplashEnd = () => {
        setShowContent(true); // Exibe o conteúdo quando o splash screen terminar
    };

    return (
        <main>
            <div>
                {/* Passa a função callback para o TelaSplash */}
                <TelaSplash onSplashEnd={handleSplashEnd} />
            </div>
            
            {/* Só exibe o conteúdo se o splash screen tiver desaparecido */}
            {showContent && (
                <div className="conteudo-principal">
                    
                    <Login/>
                </div>
            )}
        </main>
    );
};

export default FirstPage;
