import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard.jsx"
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import Perfil from "./Perfil.jsx"
import Menu from "./Menu.jsx"
import Soporte from "./SupportForm.jsx"
import Referidos from "./Referidos.jsx"
import Checkout from "./Checkout.jsx"

import Navbar from "./components/Navbar.jsx"
import LogoutButton from "./components/LogoutButton.jsx"

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
