// src/Landing.jsx
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 px-6"
    >
      <img
        src="/images/logo2.png"
        alt="DineFlexx Logo"
        className="w-40 h-auto object-contain mb-6 shadow"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
        Bienvenido a DineFlexx
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center max-w-xl">
        La experiencia gastronómica flexible, inteligente y premiada con puntos. Ordena, paga y disfruta sin complicaciones.
      </p>

      <div className="flex gap-4 mb-10">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
        >
          Ingresar
        </Link>
        <Link
          to="/register"
          className="bg-white dark:bg-gray-900 border dark:border-gray-700 text-gray-800 dark:text-white font-semibold px-6 py-2 rounded-xl shadow"
        >
          Crear cuenta
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-16">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow text-center">
          <img src="/images/menu.jpg" alt="Menú" className="rounded-xl w-full h-32 object-cover mb-3" />
          <h3 className="text-lg font-semibold mb-1">Explora el Menú</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Descubre platos exclusivos y personaliza tu experiencia.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow text-center">
          <img src="/images/pago.jpg" alt="Pago" className="rounded-xl w-full h-32 object-cover mb-3" />
          <h3 className="text-lg font-semibold mb-1">Paga como prefieras</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cuotas semanales, Apple Pay, o tu tarjeta digital.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow text-center">
          <img src="/images/puntos.jpg" alt="Puntos" className="rounded-xl w-full h-32 object-cover mb-3" />
          <h3 className="text-lg font-semibold mb-1">Acumula puntos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gana recompensas por cada orden y recomendación.
          </p>
        </div>
      </div>

      {/* Testimonios */}
      <div className="max-w-5xl w-full mb-20 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow text-sm">
            <p className="italic mb-2">
              “Con DineFlexx puedo invitar a mis amigos sin preocuparme por pagar todo de una. ¡Genial!”
            </p>
            <p className="font-semibold text-blue-600">Carlos M.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow text-sm">
            <p className="italic mb-2">
              “Uso mi wallet digital en el restaurante y ya no tengo que hacer fila para pagar.”
            </p>
            <p className="font-semibold text-blue-600">Laura G.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow text-sm">
            <p className="italic mb-2">
              “Mis puntos se acumulan súper rápido. Ya los usé para cubrir una comida entera.”
            </p>
            <p className="font-semibold text-blue-600">Esteban R.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
