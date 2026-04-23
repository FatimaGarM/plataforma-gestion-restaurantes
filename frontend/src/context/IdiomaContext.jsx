import { createContext, useContext, useState } from "react";
import { traducciones } from "../utils/traducciones";

const IdiomaContext = createContext();

export function IdiomaProvider({ children }) {
    const [idioma, setIdiomaState] = useState(
        () => localStorage.getItem("idioma") || "es"
    );

    function setIdioma(lang) {
        localStorage.setItem("idioma", lang);
        setIdiomaState(lang);
    }

    function t(clave) {
        return traducciones[idioma]?.[clave] ?? traducciones["es"][clave] ?? clave;
    }

    return (
        <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>
            {children}
        </IdiomaContext.Provider>
    );
}

export function useIdioma() {
    return useContext(IdiomaContext);
}
