import { useState } from "react"
import { supabase } from "./supabaseClient"

const menuData = {
  comidas: [
    { nombre: "Bruschetta", precio: 7.5, imagen: "/images/comidas/bruschetta.jpg" },
    { nombre: "Paella", precio: 14.99, imagen: "/images/comidas/paella.jpg" },
    { nombre: "Pasta", precio: 11.5, imagen: "/images/comidas/pasta.jpg" }
  ],
  bebidas: [
    { nombre: "Limonada", precio: 3.5, imagen: "/images/bebidas/limonada.jpg" },
    { nombre: "Mojito", precio: 5.5, imagen: "/images/bebidas/mojito.jpg" }
  ],
  postres: [
    { nombre: "Flan", precio: 4.0, imagen: "/images/postres/flan.jpg" },
    { nombre: "Tiramisú", precio: 4.75, imagen: "/images/postres/tiramisu.jpg" }
  ]
}

function Menu() {
  const [orden, setOrden] = useState([])
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")

  const handleAgregar = (item) => {
    setOrden([...orden, item])
  }

  const handleReserva = async () => {
    const user = await supabase.auth.getUser()
    const { data, error } = await supabase.from("reservas").insert([
      {
        user_id: user.data.user.id,
        fecha,
        hora,
        items: orden,
        propina: 0,
        total: orden.reduce((acc, item) => acc + item.precio, 0)
      }
    ])
    if (error) console.error("Error al reservar:", error)
    else alert("Reserva confirmada")
  }

  const renderSeccion = (titulo, items) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.nombre} className="bg-white rounded-xl shadow p-3">
            <img
              src={item.imagen}
              alt={item.nombre}
              className="rounded-xl object-cover h-40 w-full mb-2"
            />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="text-blue-600 font-semibold">${item.precio.toFixed(2)}</p>
              </div>
              <button
                onClick={() => handleAgregar(item)}
                className="bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
              >
                + Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🍽️ DineFlexx - Menú</h1>

      {renderSeccion("Comidas", menuData.comidas)}
      {renderSeccion("Bebidas", menuData.bebidas)}
      {renderSeccion("Postres", menuData.postres)}

      <div className="mt-10 p-4 bg-white rounded-xl shadow w-full max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4">Reservar en Dine Restaurant</h2>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <button
          onClick={handleReserva}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reservar aquí
        </button>
      </div>
    </div>
  )
}

export default Menu
