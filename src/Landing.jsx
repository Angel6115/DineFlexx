// src/Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col justify-start items-center pt-4 pb-4 px-6 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Logo */}
      <img
  src="/images/dlogo1.png"
  alt="DineFlexx Logo"
  className="w-[460px] h-auto object-contain mt-1 mb-2"
/>

<p className="text-lg text-gray-600 dark:text-gray-300 italic mb-2">
  “Saborea hoy, paga a tu ritmo”
</p>

      {/* Banner de oferta pre-venta */}
      <div className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-full shadow mb-4 animate-pulse">
        🔔 Oferta Pre-Venta: Inscríbete por solo <strong>$1.00</strong> y obtén <strong>10% de descuento</strong> en tu primera orden.
      </div>

      {/* Título principal */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
        Bienvenido a DineFlexx
      </h1>

      {/* Descripción */}
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center max-w-xl">
        La experiencia gastronómica <strong>flexible, inteligente</strong> y premiada con puntos.
        Ordena, paga y disfruta sin complicaciones.{" "}
        <span className="text-blue-700 font-semibold">
          Con tecnología de Inteligencia Artificial para sugerencias personalizadas.
        </span>
      </p>

      {/* Botones de navegación */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
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
        <Link
          to="/restaurantes"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
        >
          Ver restaurantes
        </Link>
        <Link
          to="/registro-restaurante"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
        >
          Soy restaurante
        </Link>
      </div>

      {/* Cards de beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-16">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow text-center">
          <img
            src="/images/menu.jpg"
            alt="Menú"
            className="w-full h-48 object-cover object-center mb-3 rounded-xl"
          />
          <h3 className="text-lg font-semibold mb-1">Explora el Menú</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Descubre platos exclusivos y personaliza tu experiencia con IA.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow text-center">
          <img
            src="/images/pago.jpg"
            alt="Pago"
            className="w-full h-48 object-cover object-center mb-3 rounded-xl"
          />
          <h3 className="text-lg font-semibold mb-1">Paga como prefieras</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cuotas semanales, mensuales, Apple Pay o tarjeta digital. También válido para catering (recoge en el restaurante).
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow text-center">
          <img
            src="/images/puntos.jpg"
            alt="Puntos"
            className="w-full h-48 object-cover object-center mb-3 rounded-xl"
          />
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

      {/* Sección para restaurantes */}
      <div className="max-w-5xl w-full mb-28 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          ¿Tienes un restaurante?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Únete gratis a DineFlexx y recibe clientes listos para ordenar. Nuestra IA mejora tu visibilidad automáticamente.
        </p>
        <ul className="text-gray-700 dark:text-gray-300 text-left max-w-xl mx-auto mb-6 list-disc list-inside">
          <li>✅ Registro 100% gratuito</li>
          <li>📸 Sube fotos de tu restaurante y platos principales</li>
          <li>🍽️ Muestra tu menú con recomendaciones inteligentes</li>
          <li>📍 Agrega tu ubicación</li>
          <li>🎉 Marca si ofreces servicio de catering (solo para recoger)</li>
          <li>🏆 Participa en sorteos y premios exclusivos</li>
        </ul>
        <Link
          to="/registro-restaurante"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow"
        >
          Pre-regístrate gratis
        </Link>
      </div>
    </motion.div>
  );
}
