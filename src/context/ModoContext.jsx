/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const ModoContext = createContext();

export function ModoProvider({ children }) {
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoOscuro");
    const esOscuro =
      modoGuardado === "true" ||
      (modoGuardado === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setModoOscuro(esOscuro);
    document.documentElement.classList.toggle("dark", esOscuro);
  }, []);

  const alternarModo = () => {
    const nuevoModo = !modoOscuro;
    setModoOscuro(nuevoModo);
    localStorage.setItem("modoOscuro", nuevoModo);
    document.documentElement.classList.toggle("dark", nuevoModo);
  };

  return (
    <ModoContext.Provider value={{ modoOscuro, alternarModo }}>
      {children}
    </ModoContext.Provider>
  );
}

export function useModo() {
  return useContext(ModoContext);
}