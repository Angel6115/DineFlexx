// src/Landing.jsx
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src="/images/logo3.jpg"
          alt="DineFlexx"
          className="h-20 w-20 mb-4 rounded-full shadow-xl"
        />
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3"
        >
          Bienvenido a DineFlexx
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-300 max-w-md mb-6"
        >
          Tu experiencia gastronómica flexible. Compra, paga a tu ritmo y acumula recompensas.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow"
          >
            Iniciar sesión / Registrarse
          </Link>
          <a
            href="#features"
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white px-6 py-2 rounded-xl font-medium shadow"
          >
            Saber más
          </a>
        </motion.div>
      </div>

      <div id="features" className="py-20 px-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-10 text-center"
          >
            ¿Cómo funciona DineFlexx?
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {["menu-icon.png", "pay-icon.png", "rewards-icon.png"].map((icon, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6 }}
                className="bg-yellow-100 dark:bg-gray-700 rounded-2xl p-6 shadow-lg"
              >
                <img src={`/images/${icon}`} alt="" className="h-16 w-16 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">
                  {i === 0 ? "Explora el Menú" : i === 1 ? "Paga como prefieras" : "Acumula puntos"}
                </h3>
                <p className="text-sm">
                  {i === 0
                    ? "Descubre una variedad de platillos y bebidas según tus gustos y preferencias."
                    : i === 1
                    ? "Usa crédito, ATH Móvil, tarjeta o paga por cuotas semanales o mensuales."
                    : "Recibe recompensas y puntos por cada compra y por referir amigos."}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="my-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-10">Lo que dicen nuestros usuarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Carlos M.", "Laura G.", "Esteban R."].map((name, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-5 text-center"
                >
                  <p className="italic text-sm">
                    {i === 0
                      ? "“Con DineFlexx puedo invitar a mis amigos sin preocuparme por pagar todo de una. ¡Genial!”"
                      : i === 1
                      ? "“Uso mi wallet digital en el restaurante y ya no tengo que hacer fila para pagar.”"
                      : "“Mis puntos se acumulan súper rápido. Ya los usé para cubrir una comida entera.”"}
                  </p>
                  <h4 className="mt-4 font-semibold text-blue-600">{name}</h4>
                </div>
              ))}
            </div>
          </motion.div>

          <footer className="text-center pt-12 mt-20 border-t dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} DineFlexx. Todos los derechos reservados.
            </p>
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-300">
              <a href="#" className="hover:underline">Términos</a>
              <a href="#" className="hover:underline">Privacidad</a>
              <a href="#" className="hover:underline">Contacto</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
