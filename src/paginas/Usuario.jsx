import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {collection,query,onSnapshot,addDoc,deleteDoc,doc,updateDoc} from "firebase/firestore";
import { useModo } from "../context/ModoContext";

export default function Usuario() {
  const { modoOscuro } = useModo();
  const [usuarios, setUsuarios] = useState([]);
  const [modoEditar, setModoEditar] = useState(null); // ID del usuario que se está editando
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellidos: "",
    fechaNac: "",
    correo: "",
    direccion: "",
    celular: "",
  });

  const [editData, setEditData] = useState({
    nombre: "",
    apellidos: "",
    fechaNac: "",
    correo: "",
    direccion: "",
    celular: "",
  });

  // 🔄 Escuchar cambios en Firestore
  useEffect(() => {
    const consulta = query(collection(db, "usuario"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(docs);
    });
    return () => unsubscribe();
  }, []);

  // 📝 Guardar nuevo usuario
  const guardarUsuario = async () => {
    const { nombre, apellidos, fechaNac, correo, direccion, celular } = formulario;
    if (!nombre || !apellidos || !fechaNac || !correo || !direccion || !celular) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      await addDoc(collection(db, "usuario"), {
        ...formulario,
        fechaRegistro: new Date(),
      });
      alert("✅ Usuario guardado con éxito");
      setFormulario({
        nombre: "",
        apellidos: "",
        fechaNac: "",
        correo: "",
        direccion: "",
        celular: "",
      });
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  // 🧾 Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    guardarUsuario();
  };

  // 🗑️ Eliminar usuario
  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, "usuario", id));
      alert("🗑️ Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // ✏️ Habilitar edición
  const activarEdicion = (usuario) => {
    setModoEditar(usuario.id);
    setEditData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      fechaNac: usuario.fechaNac,
      correo: usuario.correo,
      direccion: usuario.direccion,
      celular: usuario.celular,
    });
  };

  // 💾 Guardar cambios de edición
  const guardarEdicion = async (id) => {
    try {
      await updateDoc(doc(db, "usuario", id), { ...editData });
      alert("✅ Usuario actualizado correctamente");
      setModoEditar(null);
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  return (
    <div
      className={`p-6 max-w-md mx-auto rounded-lg shadow-md transition-colors duration-500 ${
        modoOscuro ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        👤 Registro de Usuarios
      </h1>

      {/* 🧾 Formulario para nuevo usuario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {["nombre", "apellidos", "fechaNac", "correo", "direccion", "celular"].map((campo) => (
          <input
            key={campo}
            type={campo === "fechaNac" ? "date" : campo === "correo" ? "email" : "text"}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            value={formulario[campo]}
            onChange={(e) => setFormulario({ ...formulario, [campo]: e.target.value })}
            className="border p-2 rounded"
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar Usuario
        </button>
      </form>

      {/* 👇 Mostrar usuarios registrados */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">
          📋 Usuarios registrados:
        </h2>

        {usuarios.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados aún.</p>
        ) : (
          <ul className="space-y-3">
            {usuarios.map((u) => (
              <li
                key={u.id}
                className={`p-3 rounded-lg shadow-sm border ${
                  modoOscuro ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {modoEditar === u.id ? (
                  // 🔧 Modo edición
                  <div className="flex flex-col gap-2">
                    {["nombre", "apellidos", "fechaNac", "correo", "direccion", "celular"].map(
                      (campo) => (
                        <input
                          key={campo}
                          type={
                            campo === "fechaNac"
                              ? "date"
                              : campo === "correo"
                              ? "email"
                              : "text"
                          }
                          value={editData[campo]}
                          onChange={(e) =>
                            setEditData({ ...editData, [campo]: e.target.value })
                          }
                          className="border p-2 rounded text-white"
                        />
                      )
                    )}

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => guardarEdicion(u.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        💾 Guardar
                      </button>
                      <button
                        onClick={() => setModoEditar(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // 👁️ Vista normal
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {u.nombre} {u.apellidos}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => activarEdicion(u)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarUsuario(u.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>

                    <p className="text-sm mt-1">📧 {u.correo}</p>
                    <p className="text-sm">🏠 {u.direccion}</p>
                    <p className="text-sm">📱 {u.celular}</p>
                    <p className="text-sm">🎂 {u.fechaNac || "No registrada"}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
