import React from "react";
import EPlogo from "../images/logo_easyplan.svg"

function logo(prop) {
    return(
        <img src= {EPlogo} width={prop.tamanho}/>
    )
}

export default logo