import { Routes, Route } from 'react-router-dom'
import {useState} from "react"
import Navbar from './componentes/Navbar'
import Post from './paginas/Post'
import Inicio from './paginas/Inicio'
import Usuario from './paginas/Usuario'
import Productos from './paginas/Productos'
import Registro from "./componentes/Registro";
import Modal from "./componentes/Modal";
import Login from "./componentes/Login";



function App() {
  //Variables para Manejar el Modal Login y Registro
  const [loginModalAbierto, setLoginModalAbierto] = useState(false);
  const [registroModalAbierto, setRegistroModalAbierto] = useState(false);

  //Funciones para Manejar los MOdales
  // --- Abrir / cerrar Login ---
  const abrirLogin = () => {
    setRegistroModalAbierto(false);
    setLoginModalAbierto(true);
  };

  const cerrarLogin = () => {
    setLoginModalAbierto(false);
  };

  // --- Abrir / cerrar Registro ---
  const abrirRegistro = () => {
    setLoginModalAbierto(false);
    setRegistroModalAbierto(true);
  };

  const cerrarRegistro = () => {
    setRegistroModalAbierto(false);
  };

  // --- Callbacks de éxito ---
  const manejarLoginExitoso = () => {
    setLoginModalAbierto(false);
  };

  const manejarRegistroExitoso = () => {
    // Después de registrarse → cerramos registro y abrimos login
    setRegistroModalAbierto(false);
    setLoginModalAbierto(true);
  };

  return (
    <>

      <Navbar />

      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/post" element={<Post />} />
        <Route path="/productos" element={<Productos />} />

        <Route path="/login" element={<Login />} />
      </Routes>

      {/* 🔹 Modal de REGISTRO */}
      {registroModalAbierto && (
        <Modal onClose={cerrarRegistro}>
          <Registro
            onRegistroExitoso={manejarRegistroExitoso}
            irALogin={() => {
              cerrarRegistro();
              abrirLogin();
            }}
          />
        </Modal>
      )}

      {/* 🔹 Modal de LOGIN */}
      {loginModalAbierto && (
        <Modal onClose={cerrarLogin}>
          <Login
            onLoginExitoso={manejarLoginExitoso}
            irARegistro={() => {
              cerrarLogin();
              abrirRegistro();
            }}
          />
        </Modal>
      )}


    </>
  ); }

export default App