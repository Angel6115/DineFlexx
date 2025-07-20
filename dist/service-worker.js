self.addEventListener("install", (event) => {
    console.log("DineFlexx SW instalado ✅")
    self.skipWaiting()
  })
  
  self.addEventListener("activate", (event) => {
    console.log("DineFlexx SW activo 🚀")
  })
  
  self.addEventListener("fetch", (event) => {
    // PWA fallback básico
  })
  