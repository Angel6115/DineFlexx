// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./Landing.jsx"
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import GeoNotifier from "./components/GeoNotifier.jsx"
import ChatGastronomico from "./components/ChatGastronomico.jsx"
import Layout from "./components/Layout.jsx"
import { OrderProvider } from "./context/OrderContext.jsx"

// Consumer Flow
import Restaurants from "./paginas/Restaurants.jsx"
import Menu from "./paginas/Menu.jsx"
import Cart from "./paginas/Cart.jsx"

// Otras páginas
import Wallet from "./paginas/Wallet.jsx"
import Perfil from "./Perfil.jsx"
import Soporte from "./paginas/Soporte.jsx"
import Dashboard from "./Dashboard.jsx"
import OrdenConfirmada from "./paginas/OrdenConfirmada.jsx"
import Referidos from "./Referidos.jsx"

// Catering
import CateringFlexx from "./components/Catering/CateringFlexx.jsx"
import CateringSolicitudForm from "./components/Catering/CateringSolicitudForm.jsx"
import CateringResumen from "./components/Catering/CateringResumen.jsx"

export default function App() {
  return (
    <OrderProvider>
      <Router>
        <GeoNotifier />
        <ChatGastronomico />
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ⚠️ TEMPORAL: Protección desactivada para debugging */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orden-confirmada" element={<OrdenConfirmada />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/referidos" element={<Referidos />} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/catering" element={<CateringFlexx />} />
            <Route path="/catering/solicitar/:id" element={<CateringSolicitudForm />} />
            <Route path="/catering/resumen" element={<CateringResumen />} />
          </Route>
        </Routes>
      </Router>
    </OrderProvider>
  )
}
