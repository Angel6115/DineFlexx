import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

const menuData = {
  comidas: [
    { nombre: "Bruschetta", precio: 7.5, imagen: "/images/comidas/bruschetta.jpg" },
    { nombre: "Paella", precio: 14.99, imagen: "/images/comidas/paella.jpg" },
    { nombre: "Pasta", precio: 11.5, imagen: "/images/comidas/pasta.jpg" },
    { nombre: "Sopa de Tomate", precio: 6.25, imagen: "/images/comidas/sopa-tomate.jpg" },
    { nombre: "Tacos", precio: 9.5, imagen: "/images/comidas/tacos.jpg" },
    { nombre: "Tomahawk", precio: 24.99, imagen: "/images/comidas/tomahawk.jpg" }
  ],
  bebidas: [
    { nombre: "Limonada", precio: 3.5, imagen: "/images/bebidas/limonada.jpg" },
    { nombre: "Mojito", precio: 5.5, imagen: "/images/bebidas/mojito.jpg" },
    { nombre: "Coca Cola", precio: 2.75, imagen: "/images/bebidas/coca_cola.jpg" },
    { nombre: "Cabernet", precio: 4.0, imagen: "/images/bebidas/cabernet.jpg" },
    { nombre: "Pinot Grigio", precio: 4.5, imagen: "/images/bebidas/pinot.jpg" },
    { nombre: "Rose", precio: 4.5, imagen: "/images/bebidas/rose.jpg" },
    { nombre: "Moet", precio: 5.0, imagen: "/images/bebidas/moet.jpg" }
  ],
  postres: [
    { nombre: "Flan", precio: 4.0, imagen: "/images/postres/flan.jpg" },
    { nombre: "Tiramisu", precio: 4.75, imagen: "/images/postres/tiramisu.jpg" }
  ]
}

function Checkout({ credit = 1500, puntosIniciales = 0 }) {
  const [orden, setOrden] = useState([])
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [mostrarReserva, setMostrarReserva] = useState(false)
  const [puntos, setPuntos] = useState(puntosIniciales)
  const [creditoRestante, setCreditoRestante] = useState(credit)

  useEffect(() => {
    const verificarSesion = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/login"
      }
    }
    verificarSesion()
  }, [])

  const handleAgregar = (item) => {
    setOrden([...orden, item])
    setPuntos((prev) => prev + 10)
    setCreditoRestante((prev) => prev - item.precio)
  }

  const handleReserva = async () => {
    const { data: user } = await supabase.auth.getUser()
    const { error } = await supabase.from("reservas").insert([
      {
        user_id: user?.user?.id,
        fecha,
        hora,
        items: orden,
        propina: 18,
        total: orden.reduce((acc, item) => acc + item.precio, 0)
      }
    ])
    if (!error) {
      alert("✅ Reserva completada con éxito")
      setOrden([])
    }
  }

  const totalOrden = orden.reduce((acc, item) => acc + item.precio, 0)
  const cuotaInicial = totalOrden * 0.2
  const restante = totalOrden - cuotaInicial
  const cuotasMensuales = (restante / 6).toFixed(2)

  return (
    <div className="p-4 max-w-7xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/images/logo1.jpg"
          alt="DineFlexx"
          className="h-12 w-12 object-contain shadow rounded"
        />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">DineFlexx Restaurant</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg md:text-xl font-semibold">
            💰 Crédito Disponible: <span className="text-green-600">${creditoRestante.toFixed(2)}</span>
          </p>
          <p className="text-lg md:text-xl font-semibold">
            🎁 Puntos Acumulados: <span className="text-blue-600">{puntos}</span>
          </p>
        </div>
        <button
          onClick={() => setMostrarReserva(!mostrarReserva)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 md:py-3 rounded-xl mt-4 md:mt-0 font-semibold shadow-lg hover:scale-105 transition"
        >
          Reservar
        </button>
      </div>

      {mostrarReserva && (
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
          <h2 className="text-2xl font-semibold mb-4">📅 Reservar en Dine Restaurant</h2>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="p-3 border rounded-xl shadow-sm"
            />
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="p-3 border rounded-xl shadow-sm"
            />
          </div>
          <button
            onClick={handleReserva}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Confirmar Reserva
          </button>
        </div>
      )}

      {orden.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
          <h2 className="text-xl font-bold mb-2">🧾 Resumen del Pedido</h2>
          <ul className="mb-3 text-gray-700">
            {orden.map((item, index) => (
              <li key={index}>
                {item.nombre} - ${item.precio.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total: <strong>${totalOrden.toFixed(2)}</strong></p>
          <p>Cuota Inicial (20%): <strong>${cuotaInicial.toFixed(2)}</strong></p>
          <p>6 pagos mensuales de: <strong>${cuotasMensuales}</strong></p>
        </div>
      )}

      {Object.entries(menuData).map(([seccion, items]) => (
        <div key={seccion} className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 capitalize text-gray-800">{seccion}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-40 md:h-48 w-full object-contain rounded-xl mb-4"
                />
                <h3 className="text-lg md:text-xl font-semibold mb-1">{item.nombre}</h3>
                <p className="text-blue-600 font-bold text-md md:text-lg mb-3">${item.precio.toFixed(2)}</p>
                <button
                  onClick={() => handleAgregar(item)}
                  className="bg-blue-600 text-white w-full py-2 rounded-xl hover:bg-blue-700 font-medium"
                >
                  + Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Checkout
