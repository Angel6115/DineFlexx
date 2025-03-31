import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import Register from "./Register"
import Perfil from "./Perfil"
import Soporte from "./paginas/Soporte"
import Menu from "./paginas/Menu"
import Checkout from "./Checkout"
import Referidos from "./paginas/Referidos"
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
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/referidos" element={<Referidos />} />
        </Routes>
        <LogoutButton />
      </div>
    </Router>
  )
}

export default App
