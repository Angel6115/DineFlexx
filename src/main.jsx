// src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { registerSW } from "virtual:pwa-register"

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
    <App />
  </React.StrictMode>
)
