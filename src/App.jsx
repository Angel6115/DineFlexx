import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import Register from "./Register"
import Perfil from "./Perfil"
import Referidos from "./Referidos"
import Soporte from "./SupportForm"
import Menu from "./paginas/Menu"
import Navbar from "./components/Navbar"
import Checkout from "./Checkout"

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
          <Route path="/referidos" element={<Referidos />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
