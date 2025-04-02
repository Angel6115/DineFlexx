// src/paginas/Soporte.jsx
import { useState } from "react"
import { motion } from "framer-motion"

export default function Soporte() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto p-6 text-gray-800 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-6">Soporte DineFlexx</h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">
        ¿Tienes dudas o necesitas ayuda? Rellena el siguiente formulario y nos pondremos en contacto contigo.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600"
        />
        <textarea
          name="mensaje"
          rows="5"
          placeholder="Escribe tu mensaje aquí..."
          value={form.mensaje}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          Enviar mensaje
        </button>
        {enviado && (
          <p className="text-green-500 text-sm mt-2 text-center">Mensaje enviado correctamente ✅</p>
        )}
      </form>
    </motion.div>
  )
}
