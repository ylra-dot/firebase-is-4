import { useState, useEffect } from 'react'
import './App.css'
import { db } from './lib/firebase'
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'

function App() {
  const [post, setPost] = useState([])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const consulta = query(collection(db, 'post'))

    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // Ordenar por fecha descendente
      docs.sort((a, b) => b.fecha?.seconds - a.fecha?.seconds)
      setPost(docs)
    })

    return () => unsubscribe()
  }, [])

  const agregarPost = async (e) => {
    e.preventDefault()
    if (mensaje.trim() === '') return
    try {
      await addDoc(collection(db, 'post'), {
        mensaje: mensaje.trim(),
        fecha: serverTimestamp(),
      })
      setMensaje('')
    } catch (error) {
      console.error('Error al agregar post:', error)
    }
  }

  const eliminarPost = async (id) => {
    try {
      await deleteDoc(doc(db, 'post', id))
    } catch (error) {
      console.error('Error al eliminar post:', error)
    }
  }

  const formatearFecha = (timestamp) => {
    if (!timestamp) return 'Sin fecha'
    const fecha = timestamp.toDate()
    return fecha.toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  return (
    <div className="min-h-screen bg-linaer-to-br from-gray-900 via-gray-900 to-black text-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-10 tracking-wide drop-shadow-md">
        📝 Lista de Posts
      </h1>

      {/* Formulario */}
      <form
        onSubmit={agregarPost}
        className="flex gap-3 mb-8 w-full max-w-xl"
      >
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe un nuevo post..."
          className="flex-1 bg-gray-800 text-gray-100 border border-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition shadow-md"
        >
          Agregar
        </button>
      </form>

      {/* Lista */}
      <ul className="w-full max-w-xl bg-gray-900/70 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4 border border-gray-800">
        {post.length === 0 ? (
          <p className="text-gray-400 text-center">No hay posts aún 😢</p>
        ) : (
          post.map((doc) => (
            <li
              key={doc.id}
              className="flex justify-between items-start border border-gray-800 rounded-xl p-4 bg-gray-800/60 hover:bg-gray-700/70 transition-all duration-200"
            >
              <div>
                <p className="text-gray-100 font-medium text-lg">{doc.mensaje}</p>
                <p className="text-sm text-gray-400 mt-1">
                  📅 {formatearFecha(doc.fecha)}
                </p>
              </div>
              <button
                onClick={() => eliminarPost(doc.id)}
                className="text-red-500 hover:text-red-400 font-semibold text-xl ml-4 transition-transform hover:scale-110"
              >
                🗑️
              </button>
            </li>
          ))
        )}
      </ul>

      <footer className="mt-10 text-sm text-gray-500">
        ✨ Hecho con React + Firebase
      </footer>
    </div>
  )
}

export default App
