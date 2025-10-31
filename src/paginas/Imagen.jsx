import { useState } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Imagen() {
 

  const [imagen, setImagen] = useState(null);
  const [url, setUrl] = useState("");
  const [subiendo, setSubiendo] = useState(false);
 

  
  // Subir imagen
  const subirImagen = async () => {
    if (!imagen) return alert("Primero selecciona una imagen");
    setSubiendo(true);

    const imagenRef = ref(storage, `imagenes/${imagen.name}`);
    await uploadBytes(imagenRef, imagen);

    const urlDescarga = await getDownloadURL(imagenRef);
    setUrl(urlDescarga);
    setSubiendo(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
        Subir Imagen
      </h1>

      {/* Input */}
      <label className="block mb-4">
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Seleccionar imagen:
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="mt-2 block w-full text-gray-800 dark:text-gray-200 
          bg-gray-100 dark:bg-gray-800 border border-gray-300 
          dark:border-gray-700 p-2 rounded-lg cursor-pointer"
        />
      </label>

      {/* Botón */}
      <button
        onClick={subirImagen}
        disabled={subiendo}
        className={`w-full py-3 rounded-lg text-white font-semibold transition 
          ${
            subiendo
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {subiendo ? "Subiendo..." : "Subir Imagen"}
      </button>

      {/* Vista previa */}
      {url && (
        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Vista previa:
          </p>
          <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
            <img
              src={url}
              alt="imagen subida"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Imagen;
