// src/components/Catering/CateringFlexx.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

// Lista de tipos de servicios
const TIPOS_SERVICIOS = [
  "Cumpleaños",
  "Corporativo",
  "Boda",
  "Graduación",
  "Brunch",
  "Baby Shower",
  "Aniversario",
  "Cena Romántica"
];

// Imágenes confiables de Pexels (libres de derechos y optimizadas)
const IMAGENES = {
  Cumpleaños: "https://images.pexels.com/photos/6793461/pexels-photo-6793461.jpeg?auto=compress&cs=tinysrgb&w=800",
  Corporativo: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800",
  Boda: "https://images.pexels.com/photos/14457551/pexels-photo-14457551.jpeg?auto=compress&cs=tinysrgb&w=800",
  Graduación: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800",
  Brunch: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Baby Shower": "https://images.pexels.com/photos/1625235/pexels-photo-1625235.jpeg?auto=compress&cs=tinysrgb&w=800",
  Aniversario: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
  "Cena Romántica": "https://images.pexels.com/photos/19763210/pexels-photo-19763210.jpeg?auto=compress&cs=tinysrgb&w=800"
};

// Fallbacks por si alguna imagen falla
const PLACEHOLDERS = {
  Cumpleaños: "https://via.placeholder.com/800x500/FFB2B2/FF3030?text=Cumpleaños",
  Corporativo: "https://via.placeholder.com/800x500/F0F0F0/BB2B2?text=Corporativo",
  Boda: "https://via.placeholder.com/800x500/FFCF2B/FF9000?text=Boda",
  Graduación: "https://via.placeholder.com/800x500/E85EF8/6600FF?text=Graduación",
  Brunch: "https://via.placeholder.com/800x500/FFE5B4/FF6B6B?text=Brunch",
  "Baby Shower": "https://via.placeholder.com/800x500/B2F2E2/2ECC71?text=Baby+Shower",
  Aniversario: "https://via.placeholder.com/800x500/FAD0C4/FF6B6B?text=Aniversario",
  "Cena Romántica": "https://via.placeholder.com/800x500/FFD1DC/FF69B4?text=Cena+Romántica"
};

// Descripciones personalizadas por tipo de evento (ahora se entiende perfectamente cada servicio)
const DESCRIPCIONES = {
  Cumpleaños: "Fiesta inolvidable con decoración temática, postres personalizados, menú infantil/adulto y sorpresas especiales",
  Corporativo: "Desayunos y almuerzos ejecutivos, coffee breaks profesionales, servicio de meseros y presentación impecable",
  Boda: "Menú gourmet multicurso, barra libre premium, decoración floral elegante y servicio de meseros coordinado",
  Graduación: "Buffet variado con estación de postres, bebidas ilimitadas, ambientación festiva y entrega de diplomas",
  Brunch: "Opciones saludables y deliciosas: frutas frescas, panes artesanales, huevos benedictinos y mimosas ilimitadas",
  "Baby Shower": "Menú ligero y colorido, estación de dulces y cupcakes, bebidas sin alcohol y decoración tierna y personalizada",
  Aniversario: "Cena romántica o familiar con platos gourmet, detalles personalizados, velas y música suave",
  "Cena Romántica": "Menú a la carta con entrantes, plato principal y postre exquisito, ambiente íntimo con velas y vino seleccionado"
};

const CateringFlexx = () => {
  const [esVIP, setEsVIP] = useState(false);
  const navigate = useNavigate();

  const handleSolicitar = (tipo) => {
    navigate(`/catering/solicitar/${encodeURIComponent(tipo)}`, { 
      state: { tipo, esVIP } 
    });
  };

  return (
    <div className="min-h-screen px-4 py-12 md:px-8 lg:px-20 bg-gradient-to-br from-white/80 via-blue-50/50 to-indigo-50/80">
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
          Catering Premium
        </h1>
        <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto">
          Menús personalizados para todo tipo de eventos • Delivery incluido
        </p>
      </motion.div>

      {/* Toggle VIP */}
      <div className="max-w-md mx-auto mb-12 text-center">
        <label className="flex items-center justify-center gap-3 p-4 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border hover:shadow-2xl transition-all cursor-pointer">
          <input 
            type="checkbox" 
            className="w-6 h-6 rounded-xl accent-teal-500" 
            checked={esVIP} 
            onChange={(e) => setEsVIP(e.target.checked)} 
          />
          <span className="font-bold text-lg text-gray-800">Modo VIP ✨ (Precios especiales)</span>
        </label>
      </div>

      {/* Grid de tarjetas */}
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TIPOS_SERVICIOS.map((tipo, index) => (
            <motion.div
              key={tipo}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={() => handleSolicitar(tipo)}
            >
              <article className="min-h-[420px] rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/95 backdrop-blur-xl border border-gray-100/50 hover:border-gray-200/70 overflow-hidden relative flex flex-col">
                {/* Imagen */}
                <div className="w-full h-40 rounded-2xl mb-5 overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-700 relative">
                  <img
                    src={IMAGENES[tipo] || PLACEHOLDERS[tipo]}
                    alt={`Catering para ${tipo}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { e.target.src = PLACEHOLDERS[tipo]; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Contenido */}
                <header className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                    {tipo}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Servicio Premium
                  </p>
                </header>

                {/* Descripción personalizada - ahora visible completa con scroll si es necesario */}
                <p className="text-sm text-gray-600 leading-relaxed overflow-y-auto max-h-[120px] pr-2 flex-grow mb-8">
                  {DESCRIPCIONES[tipo]}
                </p>

                {/* Botón fijo en la parte inferior */}
                <div className="absolute bottom-6 left-6 right-6 mt-auto">
                  <Button 
                    className={`
                      w-full h-12 rounded-xl font-semibold text-base shadow-lg transform transition-all duration-300
                      ${esVIP 
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-teal-300/50 hover:shadow-teal-400/70" 
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-400/50 hover:shadow-blue-500/70"
                      }
                      text-white border-0 hover:scale-[1.02] active:scale-95
                    `}
                  >
                    Solicitar {esVIP ? " (VIP)" : ""}
                  </Button>
                </div>

                {/* Badge VIP */}
                {esVIP && (
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500/90 to-emerald-500/90 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-teal-300/60 backdrop-blur-sm animate-pulse">
                      <span className="text-white text-lg font-bold">✨</span>
                    </div>
                  </div>
                )}
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CateringFlexx;