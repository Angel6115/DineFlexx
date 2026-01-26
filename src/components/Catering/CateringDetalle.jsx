// src/components/Catering/CateringDetalle.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";  // ← AGREGADO
import { 
  Briefcase, 
  Heart, 
  Coffee, 
  GraduationCap,
  ArrowRight 
} from "lucide-react";

const ICONS = {
  "Catering Corporativo": Briefcase,
  "Catering para Bodas": Heart,
  "Catering para Brunch": Coffee,
  "Catering para Graduaciones": GraduationCap,
};

const menus = {
  "Catering Corporativo": {
    descripcion: "Ideal para reuniones de negocios con bandejas ejecutivas, desayunos y coffee breaks.",
    incluye: [
      "Bandejas ejecutivas con variedad de sándwiches",
      "Desayunos calientes y fríos",
      "Coffee breaks con café premium",
      "Opciones saludables y veganas",
    ],
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
    borderColor: "border-blue-200 ring-blue-100",
  },
  "Catering para Bodas": {
    descripcion: "Servicio elegante para bodas, con menú personalizado y decoración especial.",
    incluye: [
      "Menú gourmet personalizado",
      "Decoración floral",
      "Música ambiental",
      "Servicio de fotografía",
    ],
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-gradient-to-r from-rose-50 to-pink-50",
    borderColor: "border-rose-200 ring-rose-100",
  },
  "Catering para Brunch": {
    descripcion: "Brunch delicioso para celebraciones matutinas con variedad de opciones frescas.",
    incluye: [
      "Variedad de panes y bollería",
      "Jugos naturales y café",
      "Platos fríos y calientes",
      "Opciones vegetarianas",
    ],
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-gradient-to-r from-orange-50 to-amber-50",
    borderColor: "border-orange-200 ring-orange-100",
  },
  "Catering para Graduaciones": {
    descripcion: "Celebra con un menú especial para eventos de graduación con servicio completo.",
    incluye: [
      "Buffet con platos calientes y fríos",
      "Decoración temática de graduación",
      "Pastel personalizado",
      "Bebidas no alcohólicas y snacks",
    ],
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-gradient-to-r from-purple-50 to-violet-50",
    borderColor: "border-purple-200 ring-purple-100",
  },
};

export default function CateringDetalle({ tipo, esVIP = false }) {
  const navigate = useNavigate();  // ← AGREGADO
  const menu = menus[tipo];
  if (!menu) return null;

  const Icon = ICONS[tipo] || Briefcase;

  const handleSolicitar = () => {
    // ← NUEVO: Navega a formulario con tipo como ID
    navigate(`/catering/solicitar/${encodeURIComponent(tipo)}`, {
      state: { tipo, esVIP }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`
        mb-8 p-6 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl cursor-pointer
        border-2 ${esVIP ? "border-teal-400 ring-4 ring-teal-100/50" : "border-gray-100 ring-1 ring-gray-50/50"}
        ${esVIP ? "bg-gradient-to-br from-teal-50 to-emerald-50" : menu.bgColor}
        md:p-8 md:mb-10 hover:bg-opacity-100
        group
        hover:-translate-y-2
      `}
      role="article"
      aria-labelledby={`menu-${tipo}-title`}
      onClick={handleSolicitar}  // ← AGREGADO: Click directo al form
    >
      {/* Header con ícono */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.15 }}
            className={`
              flex-shrink-0 w-16 h-16 p-4 rounded-2xl shadow-lg
              ${esVIP ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white" : `bg-gradient-to-r ${menu.color} text-white`}
              group-hover:scale-110 transition-all duration-300
            `}
          >
            <Icon className="w-8 h-8" aria-hidden="true" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 
              id={`menu-${tipo}-title`}
              className={`
                text-2xl md:text-3xl font-bold mb-3 leading-tight
                ${esVIP ? "text-teal-900 bg-gradient-to-r bg-clip-text text-transparent from-teal-900 to-emerald-900" : "text-gray-900"}
                group-hover:text-gray-800
              `}
            >
              {tipo}
              {esVIP && (
                <span className="ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-800 text-sm font-bold rounded-full ring-2 ring-teal-200/50 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                  VIP Exclusivo
                </span>
              )}
            </h3>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6 line-clamp-3">
              {menu.descripcion}
            </p>
          </div>
        </div>

        {/* Botón flotante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 10 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 ml-4"
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleSolicitar();
            }}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg
              transition-all duration-300 hover:shadow-xl
              ${esVIP 
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600" 
                : "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }
            `}
          >
            Solicitar
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Lista de inclusiones */}
      <ul className="space-y-3 mb-8">
        {menu.incluye.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl border-l-4 
                       border-gray-200 group-hover:border-gray-400 transition-all duration-300 hover:bg-white/90"
          >
            <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-700 mt-2.5 rounded-full group-hover:scale-125 transition-all" />
            <span className="text-base leading-relaxed text-gray-800 font-medium">{item}</span>
          </motion.li>
        ))}
      </ul>

      {/* Mensaje VIP mejorado */}
      {esVIP && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-2 border-teal-200/50 
                     rounded-2xl backdrop-blur-sm ring-1 ring-teal-100/30"
        >
          <p className="text-teal-900 font-bold text-lg flex items-center gap-3">
            ✨ <span>¡Usuario VIP! Delivery prioritario + menú personalizado + 10% descuento automático.</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
