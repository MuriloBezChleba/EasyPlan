import React from "react";

function Botao(prop){

    return(
        <button const style = {{backgroundColor: 'black',color: 'aliceblue',borderRadius: '10px'}}>{prop.text}</button>
    )
}

export default Botao