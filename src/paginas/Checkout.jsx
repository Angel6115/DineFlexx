import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { Link } from "react-router-dom"

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
    const { data, error } = await supabase.from("reservas").insert([
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
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img src="/images/logo1.jpg" alt="DineFlexx" className="h-12 w-12 object-contain shadow rounded" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">DineFlexx Restaurant</h1>
        </div>
        <Link to="/checkout" className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-900">
          Ir a Checkout
        </Link>
      </div>

      {/* Resto del componente sigue igual... */}
      {/* Código existente ya tiene lógica para checkout y todo el flujo */}

    </div>
  )
}

export default Checkout