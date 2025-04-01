// src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { OrderProvider } from "./context/OrderContext"

const root = document.getElementById("root")

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("SW registrado 💾", reg.scope))
      .catch((err) => console.error("SW error", err))
  })
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrderProvider>
        <App />
      </OrderProvider>
    </BrowserRouter>
  </React.StrictMode>
)
