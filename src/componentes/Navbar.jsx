import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";

function Navbar({ modoOscuro, alternarModo }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/publicar", label: "Publicar" },
    { to: "/perfil", label: "Perfil" },
    { to: "/acerca", label: "Acerca de" },
  ];

  return (
    <nav
      className={`w-full transition-colors duration-500 shadow-md sticky top-0 z-50 ${
        modoOscuro ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* 🧭 Logo / título */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-blue-500 transition-colors"
        >
          📝 Mis Posts
        </Link>

        {/* 🌗 Botones */}
        <div className="flex items-center gap-3">
          {/* 🌙/☀️ Modo oscuro */}
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

          {/* 🍔 Menú móvil */}
          <button
            onClick={toggleMenu}
            className="sm:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 🧩 Enlaces Desktop */}
        <ul className="hidden sm:flex gap-6 font-medium">
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
      </div>

      {/* 📱 Menú Móvil */}
      {menuAbierto && (
        <ul
          className={`sm:hidden flex flex-col gap-4 px-6 pb-4 font-medium border-t ${
            modoOscuro ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
          }`}
        >
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={() => setMenuAbierto(false)}
                className="block py-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
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

export default Navbar;