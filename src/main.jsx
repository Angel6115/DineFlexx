// src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { OrderProvider } from "./context/OrderContext"
// Helper para registrar el Service Worker generado por vite-plugin-pwa
import { registerSW } from "virtual:pwa-register"

// Registrar el SW automáticamente al cargar la app
registerSW({
  immediate: true,
  onRegistered(reg) {
    console.log("SW registrado 💾", reg)
  },
  onRegisterError(err) {
    console.error("Error al registrar SW:", err)
  }
})

const root = document.getElementById("root")

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrderProvider>
        <App />
      </OrderProvider>
    </BrowserRouter>
  </React.StrictMode>
)
