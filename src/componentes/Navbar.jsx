import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useModo } from "../context/ModoContext";
import { ZonaUsuario } from "../componentes/ZonaUsuario";


export default function Navbar() {
  const { modoOscuro, alternarModo } = useModo();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const links = [
    { to: "/Inicio", label: "Inicio" },
    { to: "/Usuario", label: "Usuarios" },
    { to: "/Post", label: "Post" },
    { to: "/Productos", label: "Productos" },
  ];

  return (
    <nav
      className={`w-full transition-colors duration-500 shadow-md ${
        modoOscuro ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* 🔹 Logo */}
        <Link
          to="/Registro"
          className="text-2xl font-bold tracking-wide hover:text-blue-500 transition-colors"
        >
          📝 Mis Posts
        </Link>

        {/* 🔹 Enlaces centrados (pantallas grandes) */}
        <ul className="hidden sm:flex gap-8 font-medium mx-auto">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

          
          

        {/* 🔹 Botones (modo oscuro + menú móvil) */}
        <div className="flex items-center gap-3">
          <ZonaUsuario />
          {/* Botón de modo oscuro */}
          <button
            onClick={alternarModo}
            className="p-2 rounded-full border border-gray-400 hover:scale-110 transition-transform duration-300"
            aria-label="Cambiar modo"
          >
            {modoOscuro ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-blue-600" />
            )}
          </button>

          {/* Botón de menú móvil */}
          <button
            onClick={toggleMenu}
            className="sm:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            aria-label="Abrir menú"
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 🔹 Menú móvil (solo visible cuando está abierto) */}
      {menuAbierto && (
        <ul
          className={`sm:hidden flex flex-col items-center gap-3 py-3 border-t transition-colors duration-500 ${
            modoOscuro ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-100"
          }`}
        >
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={() => setMenuAbierto(false)} // 🔹 Cierra el menú al hacer clic
                className="block px-4 py-2 hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
