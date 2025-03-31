import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

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
  const [planPago, setPlanPago] = useState("4-semanas")
  const [propina, setPropina] = useState(0.2)

  const navigate = useNavigate()

  useEffect(() => {
    const verificarSesion = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) {
        navigate("/login")
      }
    }
    verificarSesion()
  }, [navigate])

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
        propina: propina * 100,
        total: totalOrden.toFixed(2)
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

  const cuotas = planPago === "4-semanas"
    ? { label: "4 pagos semanales", monto: (restante / 4).toFixed(2), plazos: 4 }
    : { label: `${planPago.split("-")[1]} pagos mensuales`, monto: (restante / parseInt(planPago.split("-")[1])).toFixed(2), plazos: parseInt(planPago.split("-")[1]) }

  return (
    <div className="max-w-7xl mx-auto font-sans">
      {/* Info fija */}
      <div className="sticky top-0 z-10 bg-gray-50 px-4 py-4 shadow">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <img src="/images/logo1.jpg" alt="DineFlexx" className="h-10 w-10 object-contain rounded shadow" />
            <h1 className="text-xl font-bold">DineFlexx Restaurant</h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">💰 Crédito: <span className="text-green-600">${creditoRestante.toFixed(2)}</span></p>
            <p className="text-sm font-semibold">🎁 Puntos: <span className="text-blue-600">{puntos}</span></p>
          </div>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className="px-4 pb-16 pt-6">
        {orden.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
            <h2 className="text-xl font-bold mb-2">🧾 Resumen del Pedido</h2>
            <ul className="mb-3 text-gray-700">
              {orden.map((item, index) => (
                <li key={index}>{item.nombre} - ${item.precio.toFixed(2)}</li>
              ))}
            </ul>
            <p>Total: <strong>${totalOrden.toFixed(2)}</strong></p>
            <p>Propina: <strong>{(propina * 100)}%</strong></p>
            <p>Cuota Inicial (20%): <strong>${cuotaInicial.toFixed(2)}</strong></p>
            <p>{cuotas.label} de: <strong>${cuotas.monto}</strong></p>

            <button
              onClick={() => setMostrarReserva(true)}
              className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-full py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              💳 Ir al Pago
            </button>
          </div>
        )}

        {mostrarReserva && (
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
            <h2 className="text-2xl font-semibold mb-4">📅 Finalizar Compra</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-4">
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

            <div className="mb-4">
              <label className="block font-semibold mb-2">💸 Propina</label>
              <select value={propina} onChange={(e) => setPropina(parseFloat(e.target.value))} className="w-full p-3 border rounded-xl">
                <option value={0.2}>20%</option>
                <option value={0.25}>25%</option>
                <option value={0.3}>30%</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">📆 Plan de Pago</label>
              <select value={planPago} onChange={(e) => setPlanPago(e.target.value)} className="w-full p-3 border rounded-xl">
                <option value="4-semanas">Semanal (4 pagos)</option>
                <option value="1-meses">Mensual (1 mes)</option>
                <option value="2-meses">Mensual (2 meses)</option>
                <option value="3-meses">Mensual (3 meses)</option>
                <option value="4-meses">Mensual (4 meses)</option>
              </select>
            </div>

            <button
              onClick={handleReserva}
              disabled={!fecha || !hora}
              className={`w-full mt-4 py-3 rounded-xl font-semibold transition ${
                fecha && hora
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              💰 Confirmar y Pagar
            </button>
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
    </div>
  )
}

export default Checkout
