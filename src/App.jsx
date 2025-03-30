import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./Dashboard"
import Perfil from "./Perfil"
import Menu from "./Menu"
import Soporte from "./paginas/Soporte"

function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex gap-6 justify-center text-sm font-semibold">
        <Link to="/" className="text-blue-600 hover:underline">Soporte</Link>
        <Link to="/perfil" className="text-blue-600 hover:underline">Perfil</Link>
        <Link to="/menu" className="text-blue-600 hover:underline">Menú</Link>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Soporte />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

