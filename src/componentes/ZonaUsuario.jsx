import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export function ZonaUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end text-right leading-tight">
          <span className="text-sm text-slate-700 font-medium">
            {user.displayName || user.email}
          </span>
          <button
            onClick={logout}
            className="text-xs text-blue-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full border border-slate-300 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  }

  // 🔹 Invitado
  return (
    <button
      onClick={() => navigate("/login")}
      className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
    >
      Iniciar sesión
    </button>
  );
}
