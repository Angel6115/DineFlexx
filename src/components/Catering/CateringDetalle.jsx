// src/components/Catering/CateringDetalle.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Heart, 
  Coffee, 
  GraduationCap 
} from "lucide-react";

const ICONS = {
  "Catering Corporativo": Briefcase,
  "Catering para Bodas": Heart,
  "Catering para Brunch": Coffee,
  "Catering para Graduaciones": GraduationCap,
};

const menus = {
  "Catering Corporativo": {
    descripcion:
      "Ideal para reuniones de negocios con bandejas ejecutivas, desayunos y coffee breaks.",
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
    descripcion:
      "Servicio elegante para bodas, con menú personalizado y decoración especial.",
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
    descripcion:
      "Brunch delicioso para celebraciones matutinas con variedad de opciones frescas.",
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
    descripcion:
      "Celebra con un menú especial para eventos de graduación con servicio completo.",
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

export default function CateringDetalle({ tipo, esVIP }) {
  const menu = menus[tipo];
  if (!menu) return null;

  const Icon = ICONS[tipo] || Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`
        mb-6 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl
        border-2 ${esVIP ? "border-teal-400 ring-2 ring-teal-100/50" : "border-gray-100 ring-1 ring-gray-50/50"}
        ${esVIP ? "bg-gradient-to-br from-teal-50 to-emerald-50" : menu.bgColor}
        md:p-8 md:mb-8
        group
      `}
      role="article"
      aria-labelledby={`menu-${tipo}-title`}
    >
      {/* Header con ícono */}
      <div className="flex items-start gap-4 mb-6">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          className={`
            flex-shrink-0 w-14 h-14 p-3 rounded-2xl shadow-md
            ${esVIP ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white" : `bg-gradient-to-r ${menu.color} text-white`}
            group-hover:scale-110 transition-all
          `}
        >
          <Icon className="w-7 h-7" aria-hidden="true" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 
            id={`menu-${tipo}-title`}
            className={`
              text-xl md:text-2xl font-bold mb-2 leading-tight
              ${esVIP ? "text-teal-900" : "text-gray-900"}
              group-hover:text-gray-800
            `}
          >
            {tipo}
            {esVIP && (
              <span className="ml-2 inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 text-sm font-semibold rounded-full ring-1 ring-teal-200">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                VIP Exclusivo
              </span>
            )}
          </h3>
          
          <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
            {menu.descripcion}
          </p>
        </div>
      </div>

      {/* Lista de inclusiones */}
      <ul className="space-y-3 mb-6">
        {menu.incluye.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border-l-4 
                       border-gray-200 group-hover:border-gray-300 transition-all"
          >
            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-600 mt-2 rounded-full group-hover:scale-125" />
            <span className="text-sm leading-relaxed text-gray-700">{item}</span>
          </motion.li>
        ))}
      </ul>

      {/* Mensaje VIP */}
      {esVIP && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200/50 
                     rounded-xl backdrop-blur-sm"
        >
          <p className="text-teal-900 font-semibold flex items-center gap-2">
            ✨ <span>¡Gracias por ser usuario VIP! Disfruta beneficios exclusivos como delivery prioritario y menú personalizado.</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
