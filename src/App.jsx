import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./paginas/Login"
import Register from "./paginas/Register"
import Perfil from "./paginas/Perfil"
import Menu from "./paginas/Menu"
import Soporte from "./paginas/Soporte"
import Referidos from "./paginas/Referidos"
import Checkout from "./paginas/Checkout"
import Navbar from "./components/Navbar"
import LogoutButton from "./components/LogoutButton"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/referidos" element={<Referidos />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <LogoutButton />
      </div>
    </Router>
  )
}

export default App
