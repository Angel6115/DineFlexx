import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./Dashboard"
import Perfil from "./Perfil"
import Menu from "./Menu"
import Soporte from "./Soporte"

function App() {
  return (
    <Router>
      {/* Navegación superior */}
      <nav className="bg-white shadow-md p-4 flex justify-center gap-6 mb-6 text-lg font-medium">
        <Link to="/" className="text-blue-600 hover:underline">
          Soporte
        </Link>
        <Link to="/perfil" className="text-blue-600 hover:underline">
          Perfil
        </Link>
        <Link to="/menu" className="text-blue-600 hover:underline">
          Menú
        </Link>
      </nav>

      {/* Contenido dinámico por ruta */}
      <div className="px-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/soporte" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


