// src/Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, CreditCard, Gift, Zap, ArrowRight, Check } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* HERO SECTION - OPTIMIZADO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              {/* Promo Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full mb-5 text-sm font-bold shadow-md"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Lanzamiento: $1 = 10% OFF en tu primera orden</span>
              </motion.div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-5 leading-tight">
                Come hoy,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  paga después
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                La primera plataforma de restaurantes con{" "}
                <strong className="text-blue-600">Buy Now Pay Later</strong>.
                Divide en 4 cuotas sin interés + gana puntos por cada orden.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/restaurantes"
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-semibold px-7 py-3.5 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  Ver restaurantes
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-5 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-3">
                  {[
                    "from-blue-500 to-blue-600",
                    "from-purple-500 to-purple-600",
                    "from-pink-500 to-pink-600",
                    "from-green-500 to-green-600"
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} border-3 border-white dark:border-gray-900 shadow-md`}
                    />
                  ))}
                </div>
                <p className="font-medium">
                  <strong className="text-gray-900 dark:text-white text-lg">+2,500</strong> usuarios activos
                </p>
              </div>
            </motion.div>

            {/* Right: Logo + Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-1 lg:order-2 flex flex-col items-center lg:items-end"
            >
              {/* Logo */}
              <img
                src="/images/dlogo1.png"
                alt="DineFlexx"
                className="w-56 sm:w-72 lg:w-80 xl:w-96 h-auto object-contain drop-shadow-2xl mb-6"
              />
              
              {/* Badge Movido Aquí - DEBAJO del logo */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, -1, 1, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl p-5 border-4 border-white dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-sm text-green-100 font-bold uppercase tracking-wide">
                      ✓ Aprobado
                    </p>
                    <p className="text-3xl font-black text-white">
                      $1,500
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3">
              Cómo funciona
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tres pasos simples para tu primera orden
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "1",
                icon: CreditCard,
                title: "Regístrate en 30 segundos",
                desc: "Aprobación instantánea hasta $1,500. Sin credit check ni papeleo.",
                color: "blue"
              },
              {
                step: "2",
                icon: Zap,
                title: "Ordena y paga el 25% hoy",
                desc: "Escoge tu restaurante favorito. Solo pagas la primera cuota hoy.",
                color: "purple"
              },
              {
                step: "3",
                icon: Gift,
                title: "Gana puntos automáticamente",
                desc: "1 punto por cada $2. Redime en descuentos o delivery gratis.",
                color: "green"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-7 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all group"
              >
                <div className={`absolute -top-4 -left-4 w-11 h-11 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                  {item.step}
                </div>
                <div className={`w-14 h-14 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-xl flex items-center justify-center mb-4 mt-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3">
              Por qué elegir DineFlexx
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tecnología que mejora tu experiencia gastronómica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "IA que recomienda",
                desc: "Sugerencias personalizadas basadas en tu historial, preferencias y restricciones alimenticias",
                img: "/images/menu.jpg",
                badge: "🤖 Smart AI"
              },
              {
                title: "Paga en 4 cuotas sin interés",
                desc: "Divide tu cuenta automáticamente. Cero fees ocultos, cero sorpresas",
                img: "/images/pago.jpg",
                badge: "💳 0% Interés"
              },
              {
                title: "Rewards que funcionan",
                desc: "Gana 1 punto por cada $2. Canjea en cualquier restaurante de la red",
                img: "/images/puntos.jpg",
                badge: "🎁 Cashback"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {item.badge}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              +2,500 comensales satisfechos en Puerto Rico
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Fui a un restaurante premium pagando solo $20 hoy. El resto en 3 cuotas. Esto cambió mi vida social completamente.",
                author: "Carlos M.",
                role: "San Juan, PR",
                rating: 5
              },
              {
                quote: "La IA me recomendó un plato vegano que nunca hubiera pedido. Ahora es mi favorito del menú. Impresionante.",
                author: "Laura G.",
                role: "Ponce, PR",
                rating: 5
              },
              {
                quote: "Ya acumulé 800 puntos y los canjeé por delivery gratis. El sistema de rewards realmente funciona.",
                author: "Felix R.",
                role: "Bayamón, PR",
                rating: 5
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                    i === 0 ? "from-blue-500 to-blue-600" :
                    i === 1 ? "from-purple-500 to-purple-600" :
                    "from-green-500 to-green-600"
                  } shadow-lg`} />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{t.author}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{t.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESTAURANT CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-black mb-5">
              ¿Tienes un restaurante?
            </h2>
            <p className="text-xl lg:text-2xl mb-10 opacity-95 leading-relaxed">
              Únete a DineFlexx y aumenta tus ventas con nuestro sistema de pagos flexible
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-10">
              {[
                "✅ Registro 100% gratuito",
                "📊 Dashboard de analíticas",
                "💳 Pagos garantizados",
                "🛡️ Zero riesgo de fraude"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-lg font-medium">
                  <span className="text-2xl">{item.split(' ')[0]}</span>
                  <span>{item.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>

            <Link
              to="/registro-restaurante"
              className="inline-flex items-center gap-3 bg-white text-purple-600 font-black px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all text-lg"
            >
              Regístrate como restaurante
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-5">
              Empieza tu primera orden hoy
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
              Aprobación instantánea • Sin papeleo • Sin credit check
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-black px-12 py-5 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all text-lg"
            >
              Crear cuenta gratis
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
