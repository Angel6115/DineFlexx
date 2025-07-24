// src/Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center pt-8 pb-12 px-4 sm:px-6 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Logo */}
      <motion.img 
        src="/images/dlogo1.png"
        alt="DineFlexx Logo"
        className="w-[660px] md:w-[660px] h-auto object-contain mt-4 mb-4 hover:scale-105 transition-transform duration-300"
        whileHover={{ scale: 1.05 }}
      />

      {/* Eslogan */}
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 italic mb-6 font-medium">
        “Saborea hoy, paga a tu ritmo”
      </p>

      {/* Oferta Pre-Venta */}
      <motion.div 
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg mb-10"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        🎉 Oferta Pre-Venta:
        <span className="bg-white text-yellow-600 px-2 py-1 rounded mx-2">
          $1.00 = 10% OFF
        </span>
        en tu primera orden
      </motion.div>

      {/* Título */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-4">
        Revoluciona tu experiencia gastronómica
      </h1>

      {/* Descripción */}
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 text-center max-w-2xl leading-relaxed">
        La plataforma que combina <strong className="text-blue-600">flexibilidad de pago</strong>, <strong className="text-purple-600">recomendaciones con IA</strong> y un <strong className="text-green-600">sistema de puntos premiun</strong>.
      </p>

      {/* Botones principales */}
      <div className="flex flex-wrap gap-4 justify-center mb-16 w-full max-w-2xl">
        <Link
          to="/register"
          className="flex-1 min-w-[160px] text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg"
        >
          Crear cuenta
        </Link>
        <Link
          to="/login"
          className="flex-1 min-w-[160px] text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/restaurantes"
          className="flex-1 min-w-[160px] text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
        >
          Ver restaurantes
        </Link>
        <Link
          to="/registro-restaurante"
          className="flex-1 min-w-[160px] text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
        >
          Soy restaurante
        </Link>
      </div>

      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-20 px-4">
        {[
          {
            title: "Menú Inteligente",
            desc: "IA que sugiere platos basados en tus preferencias y alergias",
            img: "/images/menu.jpg",
            color: "from-blue-400 to-blue-500"
          },
          {
            title: "Pago Flexible",
            desc: "Divide tus pagos en cuotas sin intereses o paga completo",
            img: "/images/pago.jpg",
            color: "from-purple-400 to-purple-500"
          },
          {
            title: "Puntos Premium",
            desc: "Gana puntos en cada compra y redímelos en cualquier restaurante",
            img: "/images/puntos.jpg",
            color: "from-green-400 to-green-500"
          }
        ].map((item, index) => (
          <motion.div 
            key={index}
            className="group bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800 hover-tilt"
            whileHover={{ y: -5 }}
          >
            <div className={`bg-gradient-to-r ${item.color} h-2 rounded-t-lg mb-4`}></div>
            <div className="overflow-hidden rounded-lg mb-4 h-48">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Testimonios */}
      <div className="max-w-6xl w-full mb-20 px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800 dark:text-white">
          Opiniones de <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">nuestros usuarios</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Con DineFlexx puedo disfrutar de restaurantes finos pagando en cuotas. ¡Cambió mi vida social!",
              author: "Carlos M.",
              role: "Cliente frecuente"
            },
            {
              quote: "La IA me sugirió un plato que nunca hubiera pedido y fue mi favorito. ¡Increíble!",
              author: "Laura G.",
              role: "Foodie"
            },
            {
              quote: "Canjeé mis puntos por una cena gratis. El sistema de recompensas es real y funciona.",
              author: "Felix R.",
              role: "Influencer"
            }
          ].map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                  index === 0 ? "from-blue-400 to-blue-600" : 
                  index === 1 ? "from-purple-400 to-purple-600" : "from-green-400 to-green-600"
                }`}></div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800 dark:text-white">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sección para restaurantes */}
      <div className="max-w-4xl w-full mb-12 px-4 text-center">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">¿Tienes un restaurante?</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a la revolución gastronómica y aumenta tus ventas con nuestro sistema inteligente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
            <ul className="space-y-3">
              {[
                "✅ Registro 100% gratuito",
                "📸 Perfil con fotos profesionales",
                "🍽️ Menú digital interactivo",
                "📊 Dashboard de analíticas"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 mt-1">{item.split(' ')[0]}</span>
                  <span>{item.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {[
                "📍 Geolocalización avanzada",
                "🤖 Recomendaciones por IA",
                "💳 Sistema de pagos integrado",
                "🏆 Programa de premios"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 mt-1">{item.split(' ')[0]}</span>
                  <span>{item.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/registro-restaurante"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
          >
            Regístrate gratis como restaurante
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
