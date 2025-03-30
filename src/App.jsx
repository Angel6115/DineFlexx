import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Perfil from "./Perfil"
import Menu from "./Menu"
import Soporte from "./paginas/Soporte"
import Navbar from "./components/Navbar"

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Soporte />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/menu" element={<Menu credit={1500} puntosIniciales={0} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

