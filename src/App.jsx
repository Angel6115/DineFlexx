import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./Dashboard"
import Perfil from "./Perfil"
import Menu from "./Menu"
import Soporte from "./paginas/Soporte" // ✅ Importación corregida

function App() {
  return (
    <Router>
      {/* Navegación superior */}
      <nav className="bg-white shadow p-4 flex gap-6 justify-center">
        <Link to="/" className="text-blue-600 hover:underline">Soporte</Link>
        <Link to="/perfil" className="text-blue-600 hover:underline">Perfil</Link>
        <Link to="/menu" className="text-blue-600 hover:underline">Menú</Link>
      </nav>

      {/* Contenido dinámico según ruta */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Soporte />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

