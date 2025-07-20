import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./Landing.jsx"
import PublicRestaurants from "./paginas/PublicRestaurants.jsx"
import Login from "./Login.jsx"
import Register from "./Register.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import LogoutButton from "./components/LogoutButton.jsx"
import GeoNotifier from "./components/GeoNotifier.jsx"
import ChatGastronomico from "./components/ChatGastronomico.jsx"
import Layout from "./components/Layout.jsx"
import { OrderProvider } from "./context/OrderContext.jsx"

// Consumer Flow (autenticado)
import Restaurants from "./paginas/Restaurants.jsx"
import RestaurantDetail from "./paginas/RestaurantDetail.jsx"
import Cart from "./paginas/Cart.jsx"

// Otras páginas protegidas
import Wallet from "./paginas/Wallet.jsx"
import Perfil from "./Perfil.jsx"
import Soporte from "./paginas/Soporte.jsx"
import Dashboard from "./Dashboard.jsx"
import OrdenConfirmada from "./paginas/OrdenConfirmada.jsx"
import Referidos from "./Referidos.jsx"

// Nuevos componentes de Catering
import CateringFlexx from "./components/Catering/CateringFlexx.jsx"
import CateringSolicitudForm from "./components/Catering/CateringSolicitudForm.jsx"
import CateringResumen from "./components/Catering/CateringResumen.jsx" // <-- Nueva ruta resumen

export default function App() {
  return (
    <OrderProvider>
      <Router>
        <GeoNotifier />
        <ChatGastronomico />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/restaurantes" element={<PublicRestaurants />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<LogoutButton />} />

          {/* Layout protegido con subrutas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="restaurants" element={<Restaurants />} />
            <Route path="restaurants/:id" element={<RestaurantDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="soporte" element={<Soporte />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orden-confirmada" element={<OrdenConfirmada />} />
            <Route path="referidos" element={<Referidos />} />

            {/* Rutas Catering */}
            <Route path="catering" element={<CateringFlexx />} />
            <Route path="catering/solicitar/:id" element={<CateringSolicitudForm />} /> {/* Corregido: parámetro dinámico */}
            <Route path="catering/resumen" element={<CateringResumen />} /> {/* Nueva ruta */}
          </Route>
        </Routes>
      </Router>
    </OrderProvider>
  )
}
