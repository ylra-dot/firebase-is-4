// src/componentes/Post.jsx
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import EmojiPicker from "emoji-picker-react";
import { Sun, Moon } from "lucide-react";

function Post() {
  const [post, setPost] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [modoEditar, setModoEditar] = useState(null);
  const [mensajeEditado, setMensajeEditado] = useState("");
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  // 🔄 Escuchar cambios en Firestore
  useEffect(() => {
    const consulta = query(collection(db, "post"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => b.fecha?.seconds - a.fecha?.seconds);
      setPost(docs);
    });
    return () => unsubscribe();
  }, []);

  const agregarPost = async (e) => {
    e.preventDefault();
    if (mensaje.trim() === "") return;
    try {
      await addDoc(collection(db, "post"), {
        mensaje: mensaje.trim(),
        fecha: serverTimestamp(),
      });
      setMensaje("");
    } catch (error) {
      console.error("Error al agregar post:", error);
    }
  };

  const eliminarPost = async (id) => {
    try {
      await deleteDoc(doc(db, "post", id));
    } catch (error) {
      console.error("Error al eliminar post:", error);
    }
  };

  const guardarEdicion = async (id) => {
    if (mensajeEditado.trim() === "") return;
    try {
      const ref = doc(db, "post", id);
      await updateDoc(ref, {
        mensaje: mensajeEditado.trim(),
        fecha: serverTimestamp(),
      });
      setModoEditar(null);
      setMensajeEditado("");
    } catch (error) {
      console.error("Error al editar post:", error);
    }
  };

  const formatearFecha = (timestamp) => {
    if (!timestamp) return "Sin fecha";
    const fecha = timestamp.toDate();
    return fecha.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
  };

  const onEmojiClick = (emojiData) => {
    setMensaje((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mt-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">📝 Lista de Posts</h1>

      {/* Formulario */}
      <form
        onSubmit={agregarPost}
        className="flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-lg relative"
      >
        <div className="flex w-full relative">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un nuevo post..."
            className="flex-1 border rounded-lg p-2
             bg-white text-gray-900 border-gray-300
             dark:bg-gray-700 dark:text-white dark:border-gray-600
             focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setMostrarEmojis(!mostrarEmojis)}
            className="absolute right-2 top-2 text-2xl hover:scale-110 transition"
          >
            😊
          </button>
          {mostrarEmojis && (
            <div className="absolute top-12 right-0 z-50">
              <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} lazyLoadEmojis />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Agregar
        </button>
      </form>

      {/* Lista */}
      <ul
        className="w-full max-w-lg shadow-lg rounded-lg p-6 space-y-4
               bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
      >
        {post.length === 0 ? (
          <p className="text-gray-400 text-center">No hay posts aún 😢</p>
        ) : (
          post.map((doc) => (
            <li
              key={doc.id}
              className="flex justify-between items-start border border-gray-700 rounded-xl p-4 hover:bg-gray-700 transition"
            >
              {modoEditar === doc.id ? (
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    value={mensajeEditado}
                    onChange={(e) => setMensajeEditado(e.target.value)}
                    className="bg-gray-600 text-white border border-gray-500 rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => guardarEdicion(doc.id)}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={() => setModoEditar(null)}
                      className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600"
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <p className="text-gray-100 font-medium">{doc.mensaje}</p>
                  <p className="text-sm text-gray-400 mt-1">📅 {formatearFecha(doc.fecha)}</p>
                </div>
              )}

              {modoEditar !== doc.id && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setModoEditar(doc.id);
                      setMensajeEditado(doc.mensaje);
                    }}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarPost(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Post;