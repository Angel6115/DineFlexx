// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./Landing.jsx"
import Menu from "./paginas/Menu.jsx"
import Wallet from "./paginas/Wallet.jsx"
import Perfil from "./Perfil.jsx"
import Soporte from "./paginas/Soporte.jsx"
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import Dashboard from "./Dashboard.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import LogoutButton from "./components/LogoutButton.jsx"
import GeoNotifier from "./components/GeoNotifier.jsx"
import ChatGastronomico from "./components/ChatGastronomico.jsx"
import Layout from "./components/Layout.jsx"
import { OrderProvider } from "./context/OrderContext.jsx"

export default function App() {
  return (
    <OrderProvider>
      <Router>
        <GeoNotifier />
        <ChatGastronomico />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas con Layout */}
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Layout><Menu /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Layout><Wallet /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Layout><Perfil /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/soporte"
            element={
              <ProtectedRoute>
                <Layout><Soporte /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Cierre de sesión */}
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </Router>
    </OrderProvider>
  )
}
