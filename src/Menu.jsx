import { useState } from "react"
import { supabase } from "../supabaseClient"

const menuData = {
  comidas: [
    { nombre: "Bruschetta", precio: 7.5, imagen: "/images/comidas/bruschetta.jpg" },
    { nombre: "Paella", precio: 14.99, imagen: "/images/comidas/paella.jpg" },
    { nombre: "Pasta", precio: 11.5, imagen: "/images/comidas/pasta.jpg" },
    { nombre: "Hamburguesa Gourmet", precio: 13.99, imagen: "/images/comidas/hamburguesa.jpg" },
    { nombre: "Ensalada César", precio: 9.25, imagen: "/images/comidas/ensalada.jpg" },
    { nombre: "Pizza Margherita", precio: 12.0, imagen: "/images/comidas/pizza.jpg" }
  ],
  bebidas: [
    { nombre: "Limonada", precio: 3.5, imagen: "/images/bebidas/limonada.jpg" },
    { nombre: "Mojito", precio: 5.5, imagen: "/images/bebidas/mojito.jpg" },
    { nombre: "Café Espresso", precio: 2.75, imagen: "/images/bebidas/espresso.jpg" },
    { nombre: "Té Helado", precio: 3.25, imagen: "/images/bebidas/te-helado.jpg" },
    { nombre: "Jugo Natural", precio: 2.5, imagen: "/images/bebidas/jugo-natural.jpg" },
    { nombre: "Agua Mineral", precio: 2.0, imagen: "/images/bebidas/agua.jpg" }
  ],
  postres: [
    { nombre: "Flan", precio: 4.0, imagen: "/images/postres/flan.jpg" },
    { nombre: "Tiramisú", precio: 4.75, imagen: "/images/postres/tiramisu.jpg" },
    { nombre: "Cheesecake", precio: 5.0, imagen: "/images/postres/cheesecake.jpg" },
    { nombre: "Brownie con Helado", precio: 5.25, imagen: "/images/postres/brownie.jpg" }
  ]
}

function Menu() {
  const [orden, setOrden] = useState([])
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [mostrarReserva, setMostrarReserva] = useState(false)

  const handleAgregar = (item) => {
    setOrden([...orden, item])
  }

  const handleReserva = async () => {
    const { data: user } = await supabase.auth.getUser()
    const { data, error } = await supabase.from("reservas").insert([
      {
        user_id: user.data.user.id,
        fecha,
        hora,
        items: orden,
        propina: 18,
        total: orden.reduce((acc, item) => acc + item.precio, 0)
      }
    ])
    if (!error) {
      setOrden([])
      setFecha("")
      setHora("")
      alert("Reserva creada exitosamente")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">🍽️ DineFlexx - Menú</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setMostrarReserva(!mostrarReserva)}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
        >
          {mostrarReserva ? "Cerrar reserva" : "Reservar una mesa"}
        </button>
      </div>

      {mostrarReserva && (
        <div className="bg-white p-4 rounded shadow-md max-w-md mx-auto mb-8">
          <h2 className="text-lg font-bold mb-2">Reservar en Dine Restaurant</h2>
          <input
            type="date"
            className="w-full mb-2 px-3 py-2 border rounded"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <input
            type="time"
            className="w-full mb-4 px-3 py-2 border rounded"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
          <button
            onClick={handleReserva}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Reservar ahora
          </button>
        </div>
      )}

      {Object.entries(menuData).map(([categoria, items]) => (
        <div key={categoria} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{categoria}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img src={item.imagen} alt={item.nombre} className="w-full h-40 object-cover rounded mb-2" />
                <h3 className="text-lg font-medium">{item.nombre}</h3>
                <p className="text-gray-600 mb-2">${item.precio.toFixed(2)}</p>
                <button
                  onClick={() => handleAgregar(item)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Menu