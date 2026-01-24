import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";           // ✅ motion solo
import { AnimatePresence } from "framer-motion"; // ✅ AnimatePresence separado
import { useNavigate, useParams } from "react-router-dom";
import { 
  User, Mail, Phone, Calendar, Clock, Users, MapPin, 
  CreditCard, FileText, CheckCircle, Download, ArrowLeft 
} from "lucide-react";
import supabase from "../../supabaseClient";
import jsPDF from "jspdf";

const tiposDeCatering = {
  "Cumpleaños": {
    servicios: [
      { nombre: "Decoración especial", precio: 150 },
      { nombre: "Postres personalizados", precio: 180 },
    ],
    menu: [
      { nombre: "Menú Básico", precio: 25, descripcion: "Hamburguesas, hot dogs, ensalada y bebidas" },
      { nombre: "Menú Premium", precio: 40, descripcion: "Pasta, carnes, ensaladas gourmet y postres" }
    ],
    icon: "🎉",
    color: "from-pink-500 to-rose-500"
  },
  "Corporativo": {
    servicios: [
      { nombre: "Música / DJ", precio: 200 },
      { nombre: "Servicio de meseros", precio: 100 },
    ],
    menu: [
      { nombre: "Desayuno Ejecutivo", precio: 20, descripcion: "Frutas, panes, huevos y café" },
      { nombre: "Almuerzo de Negocios", precio: 35, descripcion: "Plato principal, ensalada, postre y bebidas" }
    ],
    icon: "💼",
    color: "from-blue-500 to-indigo-500"
  },
  "Boda": {
    servicios: [
      { nombre: "Decoración especial", precio: 150 },
      { nombre: "Bebidas premium", precio: 120 },
      { nombre: "Servicio de meseros", precio: 100 },
    ],
    menu: [
      { nombre: "Menú Clásico", precio: 45, descripcion: "Entrada, plato principal y postre tradicional" },
      { nombre: "Menú Gourmet", precio: 65, descripcion: "Platos gourmet con opciones vegetarianas y veganas" }
    ],
    icon: "💍",
    color: "from-purple-500 to-pink-500"
  }
};

const creditoInicial = 1500;

export default function CateringSolicitudForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const direccionInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Estados existentes (mantengo tu lógica completa)
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", tipo: id || "", fecha: "", hora: "",
    personas: "", direccion: "", metodo_pago: "Tarjeta de crédito", cuotas: 1,
    notas: "", servicios_adicionales: [], menu_seleccionado: null,
  });
  const [errores, setErrores] = useState({});
  const [creditoTotal, setCreditoTotal] = useState(creditoInicial);
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [step, setStep] = useState(1);

  // Tus useEffects existentes (Google Maps, autocomplete) - SIN CAMBIOS
  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleLoaded(true); return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCcotv_0G8ETQb-7i25p36Ean0aOOrquOs&libraries=places`;
    script.async = true; script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!googleLoaded || !direccionInputRef.current) return;
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        direccionInputRef.current, { types: ["address"], componentRestrictions: { country: "us" } }
      );
      autocompleteRef.current.setFields(["formatted_address"]);
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) setForm(prev => ({ ...prev, direccion: place.formatted_address }));
      });
    } catch (error) { console.error("Error autocomplete:", error); }
  }, [googleLoaded]);

  // Tus handlers existentes (SIN CAMBIOS)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "servicios_adicionales") {
      let nuevosServicios = [...form.servicios_adicionales];
      if (checked) nuevosServicios.push(value);
      else nuevosServicios = nuevosServicios.filter(s => s !== value);
      setForm({ ...form, servicios_adicionales: nuevosServicios });
    } else {
      setForm({ ...form, [name]: type === "number" ? Number(value) : value });
    }
  };

  const handleMenuChange = (menuItem) => setForm(prev => ({ ...prev, menu_seleccionado: menuItem }));

  // Tus cálculos existentes (SIN CAMBIOS)
  const serviciosSeleccionados = form.tipo && tiposDeCatering[form.tipo]?.servicios || [];
  const totalExtras = serviciosSeleccionados
    .filter(s => form.servicios_adicionales.includes(s.nombre))
    .reduce((total, servicio) => total + servicio.precio, 0);
  const costoMenu = form.menu_seleccionado ? form.menu_seleccionado.precio * (form.personas || 0) : 0;
  const totalGeneral = costoMenu + totalExtras;
  const creditoRestante = creditoTotal - totalGeneral;
  const cuotasSeleccionadas = Math.min(form.cuotas || 1, 6);
  const cuotaInicial = totalGeneral * 0.25;
  const restoPorPagar = totalGeneral - cuotaInicial;
  const cuotaMensual = cuotasSeleccionadas > 1 ? restoPorPagar / (cuotasSeleccionadas - 1) : 0;

  const formatearHora = (hora) => hora?.length === 5 ? hora + ":00" : hora;

  // Tus funciones handleSubmit y generarPDF (SIN CAMBIOS - solo optimizo generarPDF)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresVal = validarFormulario();
    if (Object.keys(erroresVal).length > 0) { setErrores(erroresVal); return; }
    if (creditoRestante < 0) { alert("Crédito insuficiente"); return; }

    setLoading(true);
    const usuario_id = "4d7c5276-9a75-4af4-9db6-36c5320f8806";
    const payload = {
      nombre: form.nombre, email: form.email, telefono: form.telefono, tipo: form.tipo,
      fecha: form.fecha, hora: formatearHora(form.hora), personas: Number(form.personas),
      direccion: form.direccion, notas: form.notas, cuotas: cuotasSeleccionadas,
      metodo_pago: form.metodo_pago, servicios_adicionales: form.servicios_adicionales.join(", "),
      total_extras: totalExtras, total_general: totalGeneral, credito_restante: creditoRestante,
      precio_base: costoMenu, usuario_id, evento: form.tipo,
      mensaje_restaurante: form.menu_seleccionado 
        ? `Menú: ${form.menu_seleccionado.nombre} ($${form.menu_seleccionado.precio}/persona)\n${form.notas}`
        : form.notas,
    };

    try {
      const { error } = await supabase.from("solicitudes_catering").insert([payload]).select();
      if (error) throw error;

      await supabase.from("usuarios").update({ credito: creditoRestante }).eq("id", usuario_id);
      setLoading(false); setConfirmado(true); setMostrarResumen(true);
    } catch (err) {
      console.error(err); alert(`Error: ${err.message}`); setLoading(false);
    }
  };

  const validarFormulario = () => {
    const erroresVal = {}; const hoy = new Date().toISOString().split("T")[0];
    if (!form.nombre.trim()) erroresVal.nombre = "Nombre requerido";
    if (!form.email.includes("@")) erroresVal.email = "Correo inválido";
    if (!form.telefono || form.telefono.length < 10) erroresVal.telefono = "Teléfono inválido";
    if (!form.tipo) erroresVal.tipo = "Tipo requerido";
    if (!form.direccion.trim()) erroresVal.direccion = "Dirección requerida";
    if (!form.fecha || form.fecha < hoy) erroresVal.fecha = "Fecha inválida";
    if (!form.hora) erroresVal.hora = "Hora requerida";
    if (!form.personas || form.personas < 1) erroresVal.personas = "# personas inválido";
    if (!form.menu_seleccionado) erroresVal.menu = "Selecciona menú";
    return erroresVal;
  };

  const generarPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Resumen de Solicitud de Catering", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Nombre: ${form.nombre}`, 20, 40);
    doc.text(`Email: ${form.email}`, 20, 50);
    doc.text(`Teléfono: ${form.telefono}`, 20, 60);
    doc.text(`Tipo de Evento: ${form.tipo}`, 20, 70);
    doc.text(`Fecha: ${form.fecha} ${form.hora}`, 20, 80);
    doc.text(`Número de Personas: ${form.personas}`, 20, 90);
    doc.text(`Dirección: ${form.direccion}`, 20, 100);
    doc.text(`Menú Seleccionado: ${form.menu_seleccionado?.nombre || "N/A"}`, 20, 110);
    doc.text(`Servicios Adicionales: ${form.servicios_adicionales.join(", ") || "Ninguno"}`, 20, 120);
    doc.text(`Total Menú: $${costoMenu.toFixed(2)}`, 20, 130);
    doc.text(`Total Extras: $${totalExtras.toFixed(2)}`, 20, 140);
    doc.text(`Total General: $${totalGeneral.toFixed(2)}`, 20, 150);
    doc.text(`Crédito Restante: $${creditoRestante.toFixed(2)}`, 20, 160);
    doc.text(`Método de Pago: ${form.metodo_pago}`, 20, 170);
    doc.text(`Cuotas: ${form.cuotas}`, 20, 180);
    doc.text(`Notas: ${form.notas || "Ninguna"}`, 20, 190);
    doc.save("resumen_catering.pdf");
  };

  if (confirmado) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4"
      >
        <div className="max-w-2xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/catering")}
            className="mb-8 flex items-center gap-2 text-teal-700 hover:text-teal-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Volver a Catering
          </motion.button>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50"
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                ¡Solicitud Confirmada!
              </h1>
              <p className="text-xl text-gray-600">Tu evento está en camino 🎉</p>
            </div>

            {mostrarResumen && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                      <User className="w-5 h-5" /> Cliente
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nombre:</strong> {form.nombre}</p>
                      <p><strong>Tel:</strong> {form.telefono}</p>
                      <p><strong>Email:</strong> {form.email}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-800">
                      <Calendar className="w-5 h-5" /> Evento
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Tipo:</strong> {form.tipo}</p>
                      <p><strong>Fecha:</strong> {form.fecha} {form.hora}</p>
                      <p><strong>Personas:</strong> {form.personas}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <h3 className="font-bold text-xl mb-6 text-gray-800">Resumen Financiero</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Menú ({form.personas} personas)</span>
                        <span>${costoMenu.toFixed(2)}</span>
                      </div>
                      {totalExtras > 0 && (
                        <div className="flex justify-between py-2 border-b">
                          <span>Servicios adicionales</span>
                          <span>${totalExtras.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between py-2 border-b font-bold text-lg">
                        <span>Total</span>
                        <span>${totalGeneral.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-3 bg-emerald-50 rounded-xl px-4 mt-4">
                        <span className="font-bold text-emerald-800">Crédito restante</span>
                        <span className="font-bold text-emerald-800">${creditoRestante.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={generarPDF}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Descargar PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/catering")}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Nuevo Evento
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
              step >= 1 ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-24 h-1 rounded-full transition-all ${
              step >= 2 ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-200'
            }`} />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
              step >= 2 ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 border border-white/50"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Solicitud de Catering
            </h1>
            <p className="text-xl text-gray-600">Paso {step} de 2 - Completa los detalles de tu evento</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Datos Personales + Evento */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Datos Personales */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Nombre completo *
                      </label>
                      <input 
                        type="text" name="nombre" value={form.nombre} onChange={handleChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                        placeholder="Tu nombre completo"
                      />
                      {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Teléfono *
                      </label>
                      <input 
                        type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                        placeholder="123-456-7890"
                      />
                      {errores.telefono && <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email *
                    </label>
                    <input 
                      type="email" name="email" value={form.email} onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      placeholder="tu@email.com"
                    />
                    {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
                  </div>

                  {/* Evento */}
                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-dashed border-yellow-200">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-orange-800">
                      <span className="text-2xl">{tiposDeCatering[form.tipo]?.icon || '🎉'}</span>
                      Tipo de Evento: {form.tipo || 'Selecciona uno'}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
                        <input type="date" name="fecha" value={form.fecha} onChange={handleChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500" />
                        {errores.fecha && <p className="text-red-500 text-sm mt-1">{errores.fecha}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
                        <input type="time" name="hora" value={form.hora} onChange={handleChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500" />
                        {errores.hora && <p className="text-red-500 text-sm mt-1">{errores.hora}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Personas *
                        </label>
                        <input type="number" name="personas" value={form.personas} onChange={handleChange} min="1"
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500" />
                        {errores.personas && <p className="text-red-500 text-sm mt-1">{errores.personas}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Dirección *
                        </label>
                        <input 
                          type="text" name="direccion" ref={direccionInputRef} value={form.direccion} onChange={handleChange}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 shadow-sm"
                          placeholder="Busca tu dirección..."
                        />
                        {errores.direccion && <p className="text-red-500 text-sm mt-1">{errores.direccion}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 0.98 }} 
                      type="button"
                      onClick={() => navigate("/catering")}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                    >
                      Siguiente →
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Menú, Servicios, Pago */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  className="space-y-6"
                >
                  {form.tipo && tiposDeCatering[form.tipo] && (
                    <>
                      {/* Menús */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5" /> Selecciona tu Menú *
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {tiposDeCatering[form.tipo].menu.map((item) => {
                            const selected = form.menu_seleccionado?.nombre === item.nombre;
                            return (
                              <motion.div
                                key={item.nombre}
                                whileHover={{ y: -4 }}
                                onClick={() => handleMenuChange(item)}
                                className={`p-6 rounded-2xl cursor-pointer transition-all border-2 shadow-md hover:shadow-xl ${
                                  selected 
                                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 ring-2 ring-purple-200' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <h4 className="font-bold text-xl mb-2 flex items-start gap-2">
                                  {item.nombre}
                                  <span className="ml-auto text-2xl font-bold text-purple-600">
                                    ${item.precio}/persona
                                  </span>
                                </h4>
                                <p className="text-gray-600 leading-relaxed">{item.descripcion}</p>
                                {selected && (
                                  <div className="mt-3 p-2 bg-purple-100 rounded-xl text-xs font-medium text-purple-800">
                                    ✓ Seleccionado - Total: ${(item.precio * (form.personas || 0)).toLocaleString()}
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                        {errores.menu && <p className="text-red-500 text-sm mt-2">{errores.menu}</p>}
                      </div>

                      {/* Servicios Adicionales */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Servicios Adicionales</label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {tiposDeCatering[form.tipo].servicios.map(({ nombre, precio }) => (
                            <label key={nombre} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all group">
                              <input
                                type="checkbox"
                                name="servicios_adicionales"
                                value={nombre}
                                checked={form.servicios_adicionales.includes(nombre)}
                                onChange={handleChange}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <span className="ml-3 flex-1">
                                <span className="font-medium text-gray-900 group-hover:text-gray-800">{nombre}</span>
                                <span className="ml-2 text-sm font-bold text-emerald-600">${precio}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Pago */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Método de Pago *
                          </label>
                          <select name="metodo_pago" value={form.metodo_pago} onChange={handleChange}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm">
                            <option>Tarjeta de crédito</option>
                            <option>ATH Móvil</option>
                            <option>Efectivo</option>
                            <option>Cheque</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Cuotas (1-6)</label>
                          <input type="range" name="cuotas" value={form.cuotas} onChange={handleChange} min="1" max="6"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                          <div className="text-center mt-2">
                            <span className="text-sm font-bold">{form.cuotas} cuota{form.cuotas > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>

                      {/* Notas */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Notas especiales</label>
                        <textarea 
                          name="notas" value={form.notas} onChange={handleChange} rows={3}
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-vertical shadow-sm"
                          placeholder="Alergias, preferencias dietéticas, etc..."
                        />
                      </div>
                    </>
                  )}

                  {/* Resumen Financiero */}
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                    <h3 className="font-bold text-lg mb-4 text-emerald-800 flex items-center gap-2">
                      💰 Resumen Financiero
                    </h3>
                    <div className="space-y-2 text-sm">
                      {form.menu_seleccionado && (
                        <div className="flex justify-between py-2">
                          <span>Menú x{form.personas} personas</span>
                          <span className="font-bold">${costoMenu.toFixed(2)}</span>
                        </div>
                      )}
                      {totalExtras > 0 && (
                        <div className="flex justify-between py-2">
                          <span>Servicios adicionales</span>
                          <span className="font-bold">${totalExtras.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 bg-white rounded-xl px-4 shadow-sm border">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-2xl text-emerald-700">${totalGeneral.toFixed(2)}</span>
                      </div>
                      <div className={`p-3 rounded-xl text-center font-bold text-sm ${
                        creditoRestante >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        Crédito restante: ${creditoRestante.toFixed(2)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-white/50 rounded-xl">
                        <div className="text-xs text-center py-2 bg-emerald-100 rounded-lg">
                          <span className="block font-bold text-emerald-800">${cuotaInicial.toFixed(2)}</span>
                          <span>Cuota inicial (25%)</span>
                        </div>
                        {cuotasSeleccionadas > 1 && (
                          <div className="text-xs text-center py-2 bg-blue-100 rounded-lg">
                            <span className="block font-bold text-blue-800">${cuotaMensual.toFixed(2)}</span>
                            <span>{cuotasSeleccionadas - 1}x mensual</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <motion.button
                      whileHover={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-semibold transition-all flex items-center gap-2"
                    >
                      ← Anterior
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || creditoRestante < 0}
                      className={`px-12 py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2 ${
                        loading || creditoRestante < 0
                          ? 'bg-gray-400 cursor-not-allowed text-gray-500 shadow-none'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl text-white'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Confirmar Solicitud →'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}