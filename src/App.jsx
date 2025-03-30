import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./Dashboard"
import Perfil from "./Perfil"
import Menu from "./Menu"
import Soporte from "./paginas/Soporte"
import LogoutButton from "./components/LogoutButton"
import { Home, User, Utensils, Calendar } from "lucide-react"

function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex gap-6">
          <Link to="/" className="flex flex-col items-center text-blue-600 hover:text-blue-800">
            <div className="bg-blue-100 p-2 rounded-full">
              <Home size={20} />
            </div>
            <span className="text-xs mt-1">Soporte</span>
          </Link>
          <Link to="/perfil" className="flex flex-col items-center text-blue-600 hover:text-blue-800">
            <div className="bg-blue-100 p-2 rounded-full">
              <User size={20} />
            </div>
            <span className="text-xs mt-1">Perfil</span>
          </Link>
          <Link to="/menu" className="flex flex-col items-center text-blue-600 hover:text-blue-800">
            <div className="bg-blue-100 p-2 rounded-full">
              <Utensils size={20} />
            </div>
            <span className="text-xs mt-1">Menú</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center text-blue-600 hover:text-blue-800">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar size={20} />
            </div>
            <span className="text-xs mt-1">Reservas</span>
          </Link>
        </div>
        <LogoutButton />
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
