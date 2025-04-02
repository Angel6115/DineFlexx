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
        className="w-52 h-auto object-contain mb-6"
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
        {[
          {
            src: "/images/menu.jpg",
            title: "Explora el Menú",
            desc: "Descubre platos exclusivos y personaliza tu experiencia."
          },
          {
            src: "/images/pago.jpg",
            title: "Paga como prefieras",
            desc: "Cuotas semanales, Apple Pay, o tu tarjeta digital."
          },
          {
            src: "/images/puntos.jpg",
            title: "Acumula puntos",
            desc: "Gana recompensas por cada orden y recomendación."
          }
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow text-center flex flex-col"
          >
            <img
              src={card.src}
              alt={card.title}
              className="w-full h-[160px] object-cover mb-3"
            />
            <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
