// src/paginas/Productos.jsx
import { useEffect, useState } from "react";
import { db, storage } from "../lib/firebase";
import {collection,addDoc,doc,updateDoc,deleteDoc,onSnapshot,query,orderBy,} from "firebase/firestore";
import {ref,uploadBytes,getDownloadURL,deleteObject,} from "firebase/storage";

const ETIQUETAS_OPCIONES = [
  "Nuevo",
  "Oferta",
  "Popular",
  "Edición limitada",
  "Recomendado",
];

function Productos() {
  // formulario crear
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    precioOferta: "",
    descuento: "",
    cantidad: "",
    descripcion: "",
    rating: 3,
    etiquetas: [],
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  // productos y modales
  const [productos, setProductos] = useState([]);
  const [viewProduct, setViewProduct] = useState(null); // producto para ver en modal
  const [editProduct, setEditProduct] = useState(null); // producto para editar en modal
  const [editForm, setEditForm] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  // --- Helpers: manejo de inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectEtiquetas = (e) => {
    // select multiple
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, etiquetas: selected }));
  };

  // --- Subir imagen auxiliar ---
  const uploadImageAndGetInfo = async (file, folder = "productos") => {
    // Returns { url, imageName }
    if (!file) return { url: null, imageName: null };

    const imageName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${imageName}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, imageName };
  };

  // --- Crear producto ---
  const crearProducto = async (e) => {
    e?.preventDefault();
    // validación simple
    if (
      !form.nombre ||
      !form.categoria ||
      !form.precio ||
      !form.cantidad ||
      !form.descripcion ||
      !imagenFile
    ) {
      return alert("Completa todos los campos y selecciona una imagen.");
    }

    setSubiendo(true);
    try {
      const { url, imageName } = await uploadImageAndGetInfo(imagenFile);
      await addDoc(collection(db, "productos"), {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: Number(form.precio),
        precioOferta: form.precioOferta ? Number(form.precioOferta) : null,
        descuento: form.descuento ? Number(form.descuento) : null,
        cantidad: Number(form.cantidad),
        descripcion: form.descripcion,
        rating: Number(form.rating) || 0,
        etiquetas: form.etiquetas || [],
        imagen: url,
        imagenName: imageName,
        creado: new Date(),
      });

      // limpiar formulario
      setForm({
        nombre: "",
        categoria: "",
        precio: "",
        precioOferta: "",
        descuento: "",
        cantidad: "",
        descripcion: "",
        rating: 3,
        etiquetas: [],
      });
      setImagenFile(null);
      alert("Producto creado ✅");
    } catch (err) {
      console.error(err);
      alert("Error subiendo producto.");
    } finally {
      setSubiendo(false);
    }
  };

  // --- Obtener productos (realtime) ---
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("creado", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProductos(lista);
      },
      (err) => {
        console.error("snapshot error:", err);
      }
    );
    return () => unsub();
  }, []);

  // --- Eliminar producto (doc + storage) ---
  const eliminarProducto = async (p) => {
    const ok = confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      // borrar doc
      await deleteDoc(doc(db, "productos", p.id));
      // borrar imagen del storage si existe imagenName
      if (p.imagenName) {
        const imgRef = ref(storage, `productos/${p.imagenName}`);
        await deleteObject(imgRef).catch((err) => {
          // no bloquear si falla el borrado del storage
          console.warn("No se pudo borrar imagen del storage:", err.message);
        });
      }
      alert("Producto eliminado ✅");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto.");
    }
  };

  // --- Abrir modal editar (prefill) ---
  const abrirEditar = (p) => {
    setEditProduct(p);
    setEditForm({
      nombre: p.nombre || "",
      categoria: p.categoria || "",
      precio: p.precio ?? "",
      precioOferta: p.precioOferta ?? "",
      descuento: p.descuento ?? "",
      cantidad: p.cantidad ?? "",
      descripcion: p.descripcion || "",
      rating: p.rating ?? 3,
      etiquetas: p.etiquetas || [],
    });
    setEditImageFile(null);
  };

  const cerrarEditar = () => {
    setEditProduct(null);
    setEditForm(null);
    setEditImageFile(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditEtiquetas = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setEditForm((prev) => ({ ...prev, etiquetas: selected }));
  };

  // --- Guardar edición ---
  const guardarEdicion = async (e) => {
    e?.preventDefault();
    if (!editProduct) return;

    setSubiendo(true);
    try {
      let imageUrl = editProduct.imagen;
      let imageName = editProduct.imagenName || null;

      if (editImageFile) {
        // subir nueva imagen
        const uploaded = await uploadImageAndGetInfo(editImageFile);
        imageUrl = uploaded.url;
        imageName = uploaded.imageName;
        // intentar borrar la anterior (si existía)
        if (editProduct.imagenName) {
          const oldRef = ref(storage, `productos/${editProduct.imagenName}`);
          await deleteObject(oldRef).catch(() => {});
        }
      }

      const productRef = doc(db, "productos", editProduct.id);
      await updateDoc(productRef, {
        nombre: editForm.nombre,
        categoria: editForm.categoria,
        precio: Number(editForm.precio),
        precioOferta: editForm.precioOferta ? Number(editForm.precioOferta) : null,
        descuento: editForm.descuento ? Number(editForm.descuento) : null,
        cantidad: Number(editForm.cantidad),
        descripcion: editForm.descripcion,
        rating: Number(editForm.rating) || 0,
        etiquetas: editForm.etiquetas || [],
        imagen: imageUrl,
        imagenName: imageName,
      });

      alert("Producto actualizado ✅");
      cerrarEditar();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar producto.");
    } finally {
      setSubiendo(false);
    }
  };

  // --- Vista completa modal ---
  const abrirVista = (p) => setViewProduct(p);
  const cerrarVista = () => setViewProduct(null);

  // --- UI ---
  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        🛍️ Tienda / Gestión de Productos
      </h1>

      {/* Grid formulario + preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* FORMULARIO CREAR */}
        <div className="lg:col-span-1 bg-gray-900 dark:bg-gray-900 rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-3">Crear Producto</h2>
          <form onSubmit={crearProducto} className="space-y-3">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
            />

            <input
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Categoría"
              className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
            />

            <div className="flex gap-1">
              <input
                name="precio"
                type="number"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                className="flex-1 p-4 rounded border bg-gray-100 dark:bg-gray-800"
              />
              <input
                name="precioOferta"
                type="number"
                step="0.1"
                value={form.precioOferta}
                onChange={handleChange}
                placeholder="Precio oferta (opcional)"
                className="w-30 p-2 rounded border bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="flex gap-2">
              <input
                name="descuento"
                type="number"
                value={form.descuento}
                onChange={handleChange}
                placeholder="Descuento (%)"
                className="flex-1 p-2 rounded border bg-gray-100 dark:bg-gray-800"
              />
              <input
                name="cantidad"
                type="number"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Cantidad"
                className="w-40 p-2 rounded border bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800"
              rows={3}
            />

            <div className="flex gap-2 items-center">
              <label className="text-sm">Rating (1-5):</label>
              <input
                name="rating"
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={handleChange}
                className="w-20 p-2 rounded border bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Etiquetas (select múltiple):</label>
              <select
                multiple
                value={form.etiquetas}
                onChange={handleSelectEtiquetas}
                className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800 h-28"
              >
                {ETIQUETAS_OPCIONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Imagen:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagenFile(e.target.files[0])}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={subiendo}
              className={`w-full py-2 rounded-lg text-white font-bold ${
                subiendo ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {subiendo ? "Creando..." : "Crear Producto"}
            </button>
          </form>

          {/* preview rápida */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p>
              Consejo: agrega etiqueta <span className="font-semibold">Oferta</span> si vas a usar
              precio de oferta.
            </p>
          </div>
        </div>

        {/* LISTADO DE PRODUCTOS (tarjetas) */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative">
                  <img src={p.imagen} alt={p.nombre} className="w-full h-44 object-cover" />
                  {/* etiquetas pequeñas */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {Array.isArray(p.etiquetas) &&
                      p.etiquetas.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {p.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{p.categoria}</p>

                  <div className="mt-2 flex items-baseline gap-3">
                    {p.precioOferta ? (
                      <>
                        <span className="text-lg font-bold text-blue-600">S/ {p.precioOferta}</span>
                        <span className="text-sm line-through text-gray-400">S/ {p.precio}</span>
                        {p.descuento ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            -{p.descuento}%
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-lg font-bold text-blue-600">S/ {p.precio}</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Stock: <span className="font-semibold">{p.cantidad}</span>
                  </p>

                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {p.descripcion}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => abrirVista(p)}
                      className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-sm"
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => abrirEditar(p)}
                      className="py-2 px-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarProducto(p)}
                      className="py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- MODAL VISTA COMPLETA ---------------- */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4">
                <img src={viewProduct.imagen} alt={viewProduct.nombre} className="w-full h-96 object-cover rounded" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{viewProduct.nombre}</h2>
                <p className="text-sm text-gray-500 mb-3">{viewProduct.categoria}</p>

                <div className="mb-3">
                  {viewProduct.precioOferta ? (
                    <>
                      <div className="text-2xl font-extrabold text-blue-600">S/ {viewProduct.precioOferta}</div>
                      <div className="text-sm line-through text-gray-400">S/ {viewProduct.precio}</div>
                    </>
                  ) : (
                    <div className="text-2xl font-extrabold text-blue-600">S/ {viewProduct.precio}</div>
                  )}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{viewProduct.descripcion}</p>

                <p className="text-sm text-gray-600 mb-3">
                  Rating: <span className="font-semibold">{viewProduct.rating ?? "-"}</span>/5
                </p>

                <div className="flex gap-2 mb-4">
                  {Array.isArray(viewProduct.etiquetas) &&
                    viewProduct.etiquetas.map((t) => (
                      <span key={t} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {t}
                      </span>
                    ))}
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-lg bg-green-600 text-white">Comprar</button>
                  <button onClick={() => { abrirEditar(viewProduct); cerrarVista(); }} className="px-4 py-2 rounded-lg bg-yellow-500 text-white">Editar</button>
                  <button onClick={() => { eliminarProducto(viewProduct); cerrarVista(); }} className="px-4 py-2 rounded-lg bg-red-600 text-white">Eliminar</button>
                </div>

                <button onClick={cerrarVista} className="mt-4 text-sm text-gray-500">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL EDITAR ---------------- */}
      {editProduct && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full shadow-lg overflow-auto p-6">
            <h3 className="text-xl font-semibold mb-4">Editar producto</h3>

            <form onSubmit={guardarEdicion} className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="nombre" value={editForm.nombre} onChange={handleEditChange} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />
                <input name="categoria" value={editForm.categoria} onChange={handleEditChange} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input name="precio" type="number" step="0.01" value={editForm.precio} onChange={handleEditChange} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />
                <input name="precioOferta" type="number" step="0.01" value={editForm.precioOferta ?? ""} onChange={handleEditChange} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />
                <input name="descuento" type="number" value={editForm.descuento ?? ""} onChange={handleEditChange} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="cantidad" type="number" value={editForm.cantidad} onChange={handleEditChange} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />
                <input name="rating" type="number" min="1" max="5" value={editForm.rating} onChange={handleEditChange} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />
              </div>

              <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditChange} rows={3} className="p-2 rounded border bg-gray-100 dark:bg-gray-400" />

              <label className="text-sm">Etiquetas (select múltiple):</label>
              <select multiple value={editForm.etiquetas} onChange={handleEditEtiquetas} className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-800 h-28">
                {ETIQUETAS_OPCIONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <div>
                <label className="block text-sm mb-1">Cambiar imagen (opcional):</label>
                <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files[0])} />
                <p className="text-xs text-gray-500 mt-1">Si subes una nueva imagen, la anterior se eliminará del Storage.</p>
              </div>

              <div className="flex gap-2 mt-3">
                <button type="submit" disabled={subiendo} className={`py-2 px-4 rounded-lg text-white ${subiendo ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}>{subiendo ? "Guardando..." : "Guardar cambios"}</button>
                <button type="button" onClick={cerrarEditar} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-800">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
