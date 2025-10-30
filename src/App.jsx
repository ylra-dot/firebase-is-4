import { Routes, Route } from 'react-router-dom'

import Navbar from './componentes/Navbar'
import Post from './paginas/Post'
import Inicio from './paginas/Inicio'
import Usuario from './paginas/Usuario'
import Productos from './paginas/Productos'


function App() {


  return (
    <div> 
       <Navbar />
        <Routes>
         

          <Route path="/inicio" element={<Inicio />} />
          <Route path="/post" element={<Post />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/productos" element={<Productos />} />
      

        <Route path="*" element={<h1>404 - Página no encontrada 😢</h1>} /> 
        
         </Routes>
      
    </div>
  )
}

export default App