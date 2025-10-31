import { Link } from "react-router-dom";
import { Rocket, Zap, Database, Sun, Moon } from "lucide-react";

function Inicio() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Bienvenido a FirebaseApp 🚀
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-600 mb-8 max-w-2xl">
        Esta es una aplicación React con conexión a Firebase, modo oscuro/claro y manejo de publicaciones en tiempo real.
      </p>

      {/* ✅ Botones principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/post"
          className="bg-blue-600 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
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

      {/* ✅ SECCIÓN DE NOVEDADES */}
      <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
        <Feature
          icon={<Rocket className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
          title="Carga ultrarrápida"
          desc="Firebase Firestore garantiza lecturas y escrituras instantáneas."
        />
        <Feature
          icon={<Database className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
          title="Datos en tiempo real"
          desc="Tu contenido se actualiza automáticamente sin recargar la página."
        />
        <Feature
          icon={<Zap className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />}
          title="Implementación simple"
          desc="Conecta tu app a Firebase con pocas líneas de código."
        />
        <Feature
          icon={<Moon className="w-10 h-10 text-indigo-500 dark:text-indigo-300" />}
          title="Modo oscuro"
          desc="Diseño moderno y cómodo para trabajar de noche."
        />
        <Feature
          icon={<Sun className="w-10 h-10 text-orange-500 dark:text-orange-300" />}
          title="Modo claro"
          desc="Ideal para visualización limpia y elegante de día."
        />
        <Feature
          icon={<Rocket className="w-10 h-10 text-green-600 dark:text-green-400" />}
          title="100% escalable"
          desc="Crece tu proyecto sin preocuparte por servidores."
        />
      </div>

      {/* ✅ Estadísticas simples */}
      <div className="mt-16 grid grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
        <Stat number="5ms" label="Respuesta del servidor" />
        <Stat number="24/7" label="Servicio continuo" />
        <Stat number="+100%" label="Escalabilidad" />
      </div>

      {/* ✅ CTA final */}
      <div className="mt-16">
        <Link
          to="/post"
          className="text-blue-600 dark:text-blue-400 font-medium underline hover:no-underline"
        >
          Comienza explorando publicaciones →
        </Link>
      </div>

      <footer className="mt-16 text-gray-500 dark:text-gray-400 text-sm">
        Creado con ❤️ usando React + Firebase
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{number}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default Inicio;
