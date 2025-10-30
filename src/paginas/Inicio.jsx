import { Link } from "react-router-dom";

function Inicio() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Bienvenido a FirebaseApp 🚀
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Esta es una aplicación React con conexión a Firebase, modo oscuro/claro y manejo de publicaciones en tiempo real.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/post"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Ver publicaciones 📝
        </Link>

        <a
          href="https://firebase.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition"
        >
          Conoce Firebase 🔥
        </a>
      </div>

      <footer className="mt-16 text-gray-500 dark:text-gray-400 text-sm">
        Creado con ❤️ usando React + Firebase
      </footer>
    </div>
  );
}

export default Inicio;