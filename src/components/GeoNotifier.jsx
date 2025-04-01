// src/components/GeoNotifier.jsx
import { useEffect } from "react"
import { toast } from "react-hot-toast"
import { useOrder } from "../context/OrderContext"

const RESTAURANTES = [
  {
    nombre: "Sazón Criollo",
    lat: 18.4655,
    lng: -66.1057 // San Juan, PR
  },
  {
    nombre: "Delicias Flexx",
    lat: 18.4441,
    lng: -66.0835
  }
]

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function GeoNotifier() {
  const { credit, puntos } = useOrder()

  useEffect(() => {
    // Mostrar mensaje si la app se instala como PWA
    window.addEventListener("appinstalled", () => {
      toast.success("✅ DineFlexx fue instalada correctamente en tu dispositivo!", {
        duration: 6000,
        icon: "📲"
      })
    })

    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords

      const cercano = RESTAURANTES.find((rest) => {
        const distancia = getDistanceKm(latitude, longitude, rest.lat, rest.lng)
        return distancia <= 0.3 // 300 metros
      })

      if (cercano) {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100])

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("📍 Estás cerca de " + cercano.nombre, {
            body: `Crédito disponible: $${credit.toFixed(2)} | Puntos: ${puntos}`,
            icon: "/images/logo3.jpg"
          })
        } else if ("Notification" in window && Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification("📍 Estás cerca de " + cercano.nombre, {
                body: `Crédito disponible: $${credit.toFixed(2)} | Puntos: ${puntos}`,
                icon: "/images/logo3.jpg"
              })
            }
          })
        }

        toast.custom(
          (t) => (
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl border dark:border-gray-700 max-w-xs animate-slide-in">
              <h3 className="font-bold text-lg text-blue-600">📍 Cerca de {cercano.nombre}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Crédito: <span className="text-green-600 font-semibold">${credit.toFixed(2)}</span><br />
                Puntos: <span className="text-blue-500 font-semibold">{puntos}</span>
              </p>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="mt-3 w-full text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl"
              >
                Ver Menú
              </button>
            </div>
          ),
          { duration: 9000, position: "top-right" }
        )
      }
    })
  }, [credit, puntos])

  return null
}
