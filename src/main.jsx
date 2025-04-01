if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("SW registrado 💾", reg.scope))
        .catch((err) => console.error("SW error", err))
    })
  }
  