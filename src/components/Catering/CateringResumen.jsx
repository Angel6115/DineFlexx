// src/components/Catering/CateringResumen.jsx
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { Download, Users, Calendar, DollarSign } from "lucide-react";
import { Button } from "../ui/button";

const CateringResumen = () => {
  const [solicitudActual, setSolicitudActual] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Mock data del formulario
  useEffect(() => {
    setSolicitudActual({
      nombre: "Juan Pérez Corp",
      email: "juan@dorado.pr",
      telefono: "787-555-0123",
      evento: "Catering Corporativo",
      direccion: "Dorado Beach Resort, Dorado PR 00646",
      fecha: "2026-02-15",
      hora: "12:00 PM",
      personas: 45,
      metodo_pago: "Tarjeta Crédito",
      servicios_adicionales: "Estación de postres + Meseros extra",
      precio_base: 1800.00,
      total_extras: 650.00,
      total_general: 2450.00,
      credito_restante: 1200.00,
      cuotas: "6 cuotas sin intereses"
    });
  }, []);

  const generarPDF = async () => {
    if (!solicitudActual) return alert("Cargando datos...");

    const doc = new jsPDF();
    let currentY = 20;

    // Logo opcional
    try {
      const response = await fetch('/images/dlog1.png');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        await new Promise(resolve => img.onload = resolve);
        doc.addImage(img, 'PNG', 15, currentY, 80, 25);
        currentY += 35;
        setLogoLoaded(true);
      }
    } catch {}

    // Título
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Solicitud CateringFlexx", 15, currentY);
    currentY += 15;

    doc.setFontSize(14);
    doc.text(solicitudActual.evento, 15, currentY);
    currentY += 15;

    // Datos
    const lineHeight = 8;
    const agregarTexto = (label, valor) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 15, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(valor, 60, currentY);
      currentY += lineHeight;
    };

    agregarTexto("Cliente", solicitudActual.nombre);
    agregarTexto("Email", solicitudActual.email);
    agregarTexto("Teléfono", solicitudActual.telefono);
    agregarTexto("Dirección", solicitudActual.direccion);
    agregarTexto("Fecha", solicitudActual.fecha);
    agregarTexto("Hora", solicitudActual.hora);
    agregarTexto("Invitados", `${solicitudActual.personas} personas`);
    agregarTexto("Pago", solicitudActual.metodo_pago);
    agregarTexto("Extras", solicitudActual.servicios_adicionales);
    agregarTexto("Precio Base", `$${solicitudActual.precio_base.toLocaleString()}`);
    agregarTexto("Total Extras", `$${solicitudActual.total_extras.toLocaleString()}`);
    agregarTexto("TOTAL", `$${solicitudActual.total_general.toLocaleString()}`);
    agregarTexto("Crédito", `$${solicitudActual.credito_restante.toLocaleString()}`);
    agregarTexto("Cuotas", solicitudActual.cuotas);

    doc.setFontSize(10);
    doc.text(`Dorado PR • ${new Date().toLocaleDateString('es-PR')}`, 15, 270);

    doc.save(`Catering_${solicitudActual.evento.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  if (!solicitudActual) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando resumen...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-3xl shadow-2xl mb-8 -translate-y-4">
          <h1 className="text-4xl font-black flex items-center gap-4 mb-2">
            <Download className="w-12 h-12 drop-shadow-lg" />
            Resumen Solicitud
          </h1>
          <p className="text-indigo-100 text-xl opacity-90">{solicitudActual.evento}</p>
          <p className="text-indigo-200 text-sm mt-2">ID: #{Math.floor(Math.random() * 1000 + 1000)}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all">
            <Users className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <div className="text-3xl font-black text-emerald-700">{solicitudActual.personas}</div>
            <div className="text-emerald-600 font-semibold">Invitados</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-blue-800">{solicitudActual.fecha}</div>
            <div className="text-blue-600 font-semibold">{solicitudActual.hora}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all">
            <DollarSign className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <div className="text-3xl font-black text-indigo-700">${solicitudActual.total_general.toLocaleString()}</div>
            <div className="text-indigo-600 font-semibold">Total</div>
          </div>
        </div>

        {/* Datos */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Detalles Completos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Cliente", value: solicitudActual.nombre },
              { label: "Email", value: solicitudActual.email },
              { label: "Teléfono", value: solicitudActual.telefono },
              { label: "Dirección", value: solicitudActual.direccion },
              { label: "Fecha", value: solicitudActual.fecha },
              { label: "Hora", value: solicitudActual.hora },
              { label: "Invitados", value: `${solicitudActual.personas} personas` },
              { label: "Pago", value: solicitudActual.metodo_pago },
              { label: "Extras", value: solicitudActual.servicios_adicionales }
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl hover:bg-white transition-all group">
                <span className="font-semibold text-gray-800 group-hover:text-gray-900">{label}:</span>
                <span className="font-bold text-gray-900 text-right">{value}</span>
              </div>
            ))}
          </div>
          
          {/* Finanzas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="font-bold text-2xl text-emerald-800">${solicitudActual.precio_base.toLocaleString()}</div>
              <div className="text-sm text-emerald-600">Precio Base</div>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="font-bold text-2xl text-blue-800">${solicitudActual.total_extras.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Total Extras</div>
            </div>
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl col-span-2 md:col-span-1 shadow-lg">
              <div className="text-3xl font-black">${solicitudActual.total_general.toLocaleString()}</div>
              <div className="text-emerald-100 font-semibold">TOTAL</div>
            </div>
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl col-span-2 md:col-span-1 shadow-lg">
              <div className="text-xl font-bold">${solicitudActual.credito_restante.toLocaleString()}</div>
              <div className="text-indigo-100">{solicitudActual.cuotas}</div>
            </div>
          </div>
        </div>

        {/* PDF Button */}
        <Button 
          onClick={generarPDF}
          className="w-full h-16 text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:via-purple-700 hover:to-emerald-700 shadow-2xl hover:shadow-3xl text-white rounded-3xl border-4 border-white/50 backdrop-blur-xl transform hover:scale-[1.02] active:scale-100 transition-all duration-300 mx-auto block"
        >
          <Download className="w-8 h-8 mr-4 inline" />
          📄 {logoLoaded ? "Descargar PDF con Logo" : "Descargar PDF Completo"}
        </Button>

        <p className={`text-center mt-6 font-medium text-sm ${
          logoLoaded ? 'text-emerald-600' : 'text-amber-600'
        }`}>
          {logoLoaded ? '✅ Logo listo en PDF' : '💡 Crea public/images/dlog1.png (opcional)'}
        </p>
      </div>
    </motion.div>
  );
};

export default CateringResumen;
