import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Post from "./paginas/Post";

function App() {
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoOscuro");
    const esOscuro =
      modoGuardado === "true" ||
      (modoGuardado === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
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
    <div
      className={`min-h-screen flex flex-col items-center transition-colors duration-500 
      bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
    >
      <Navbar modoOscuro={modoOscuro} alternarModo={alternarModo} />

      {/* 🔀 Aquí controlas las secciones de la app */}
      <Routes>
        <Route path="/" element={<Post />} />
        <Route path="/posts" element={<Post />} />
        {/* Puedes agregar más rutas luego, como /contacto o /perfil */}
      </Routes>
    </div>
  );
}

export default App;