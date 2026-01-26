// src/components/Catering/CateringSolicitudForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  User, Mail, Phone, Calendar, Clock, Users, MapPin, 
  CreditCard, FileText, CheckCircle, Download, ArrowLeft, AlertCircle 
} from "lucide-react";
import supabase from "../../supabaseClient";
import jsPDF from "jspdf";

// Mapeo ID de Supabase → Tipo de Catering
const ID_TO_TIPO = {
  "1": "Corporativo",
  "2": "Boda",
  "3": "Graduación",
  "4": "Brunch"
};

// Configuración completa de 4 tipos de catering (detallada)
const tiposDeCatering = {
  "Corporativo": {
    servicios: [
      { nombre: "Música / DJ profesional", precio: 200 },
      { nombre: "Servicio de meseros", precio: 100 },
      { nombre: "Coffee break premium", precio: 150 },
      { nombre: "Equipos audiovisuales", precio: 180 }
    ],
    menu: [
      { 
        nombre: "Desayuno Ejecutivo", 
        precio: 20,
        descripcion: "Energiza tu equipo desde temprano",
        incluye: [
          "☕ Estación de café gourmet (espresso, cappuccino, latte)",
          "🥐 Selección de panes artesanales y croissants",
          "🍳 Huevos revueltos con vegetales y queso",
          "🥓 Bacon crujiente y salchichas de pavo",
          "🍓 Frutas frescas de estación",
          "🥤 Jugos naturales (naranja, china, toronja)",
          "🧈 Mantequilla, mermeladas y miel"
        ],
        alergenos: "Contiene: Gluten, lácteos, huevos"
      },
      { 
        nombre: "Almuerzo de Negocios", 
        precio: 35,
        descripcion: "Impresiona a tus clientes y socios",
        incluye: [
          "🥗 Ensalada gourmet con mix de lechugas, frutos secos y vinagreta balsámica",
          "🍗 Plato principal: Pechuga de pollo en salsa de champiñones O Salmón al horno con hierbas",
          "🍚 Acompañantes: Arroz primavera y vegetales al vapor",
          "🍰 Postre: Mousse de chocolate belga O Cheesecake de guayaba",
          "🥤 Bebidas: Agua premium, refrescos, café y té",
          "🍞 Pan ciabatta recién horneado"
        ],
        alergenos: "Contiene: Pescado, frutos secos, lácteos"
      }
    ],
    icon: "💼",
    color: "from-blue-500 to-indigo-500",
    minPersonas: 20,
    descripcionTipo: "Eventos corporativos, reuniones de trabajo, conferencias"
  },
  
  "Boda": {
    servicios: [
      { nombre: "Decoración floral premium", precio: 350 },
      { nombre: "Barra de bebidas open bar", precio: 450 },
      { nombre: "Servicio completo de meseros", precio: 280 },
      { nombre: "Coordinador de eventos profesional", precio: 300 },
      { nombre: "Centro de mesa personalizados", precio: 200 }
    ],
    menu: [
      { 
        nombre: "Menú Clásico Elegante", 
        precio: 45,
        descripcion: "Tradición puertorriqueña con toque gourmet",
        incluye: [
          "🥗 Entrada: Ensalada mixta con vinagreta de mango y almendras tostadas",
          "🍗 Plato Principal (Elige uno):",
          "   • Pollo guisado al estilo criollo con arroz con gandules",
          "   • Pernil asado con mofongo de ajo y yuca",
          "🍠 Acompañantes: Amarillos maduros, habichuelas guisadas",
          "🍮 Postre: Tembleque de coco artesanal con polvo de canela",
          "🥤 Bebidas: Agua, refrescos variados, té helado de pasión ilimitado",
          "🍞 Pan de agua tibio con mantequilla de hierbas"
        ],
        alergenos: "Contiene: Lácteos, frutos secos, coco"
      },
      { 
        nombre: "Menú Gourmet Premium", 
        precio: 65,
        descripcion: "Alta cocina internacional con opciones especiales",
        incluye: [
          "🦐 Entrada: Tostones rellenos de camarones al ajillo con aioli de cilantro",
          "🥩 Plato Principal (Elige uno):",
          "   • Churrasco Angus con chimichurri de perejil y yuca cremosa",
          "   • Filete de dorado en costra de hierbas con risotto de azafrán",
          "   • 🌱 Opción vegana: Berenjena rellena de quinoa, espinacas y hongos",
          "🥦 Vegetales: Espárragos asados con aceite de trufa",
          "🍮 Postre: Flan de queso con caramelo de ron Don Q y frutas flambeadas",
          "🍾 Bebidas: Sangría de frutas tropicales, vinos premium, champagne de bienvenida",
          "🍞 Pan ciabatta y focaccia recién horneados"
        ],
        alergenos: "Contiene: Mariscos, lácteos, alcohol, frutos secos"
      }
    ],
    icon: "💍",
    color: "from-purple-500 to-pink-500",
    minPersonas: 50,
    descripcionTipo: "Bodas, recepciones elegantes, aniversarios especiales"
  },
  
  "Graduación": {
    servicios: [
      { nombre: "Decoración temática académica", precio: 120 },
      { nombre: "Photobooth con props personalizados", precio: 150 },
      { nombre: "DJ con equipos de sonido", precio: 200 },
      { nombre: "Pastel de graduación 3 pisos", precio: 180 },
      { nombre: "Globos y pancartas personalizadas", precio: 90 }
    ],
    menu: [
      { 
        nombre: "Menú Festivo Casual", 
        precio: 28,
        descripcion: "Perfecto para celebrar con familia y amigos",
        incluye: [
          "🍕 Pizza gourmet (pepperoni, vegetariana, hawaiana)",
          "🍔 Mini sliders variados (res, pollo BBQ, vegetariano)",
          "🌯 Wraps mediterráneos con hummus y vegetales",
          "🍗 Alitas de pollo (BBQ, buffalo, miel mostaza)",
          "🥗 Ensalada César con crutones de parmesano",
          "🍟 Papas fritas artesanales con trio de salsas",
          "🥤 Bebidas: Refrescos, jugos tropicales, limonada de coco",
          "🍪 Postre: Brownies y cookies de chocolate"
        ],
        alergenos: "Contiene: Gluten, lácteos, frutos secos"
      },
      { 
        nombre: "Menú Premium Graduación", 
        precio: 42,
        descripcion: "Celebra a lo grande con platos especiales",
        incluye: [
          "🥩 Estación de carnes: Mini chuletones y churrasco con chimichurri",
          "🍝 Pasta bar: Alfredo, carbonara y marinara (elige tu pasta)",
          "🦐 Camarones al ajillo estilo español",
          "🥗 Bar de ensaladas gourmet con 10 toppings a elegir",
          "🍚 Arroz con gandules premium y tostones rellenos",
          "🍰 Bar de postres: Flan, tres leches, tembleque, bizcocho",
          "🥤 Bebidas: Mojitos sin alcohol, sangría, aguas saborizadas",
          "🍞 Pan focaccia con dips variados"
        ],
        alergenos: "Contiene: Mariscos, lácteos, gluten"
      }
    ],
    icon: "🎓",
    color: "from-yellow-500 to-amber-500",
    minPersonas: 50,
    descripcionTipo: "Graduaciones escolares, universitarias, celebraciones académicas"
  },
  
  "Brunch": {
    servicios: [
      { nombre: "Estación de mimosas y bellinis", precio: 180 },
      { nombre: "Chef en vivo preparando omelettes", precio: 250 },
      { nombre: "Decoración floral fresca", precio: 140 },
      { nombre: "Música jazz en vivo", precio: 200 },
      { nombre: "Servicio de té premium", precio: 120 }
    ],
    menu: [
      { 
        nombre: "Brunch Clásico Casual", 
        precio: 32,
        descripcion: "La combinación perfecta de desayuno y almuerzo",
        incluye: [
          "🥞 Pancakes esponjosos con jarabe de maple y mantequilla",
          "🍳 Huevos Benedict con jamón serrano y salsa holandesa",
          "🥓 Bacon ahumado y salchichas de pavo",
          "🥯 Bagels variados con cream cheese saborizado",
          "🍓 Frutas frescas: melón, piña, uvas, fresas",
          "☕ Café premium ilimitado y selección de tés",
          "🥤 Jugos naturales: naranja, toronja, verde detox",
          "🥐 Croissants y danishes recién horneados"
        ],
        alergenos: "Contiene: Gluten, lácteos, huevos"
      },
      { 
        nombre: "Brunch Gourmet Exquisito", 
        precio: 48,
        descripcion: "Experiencia culinaria sofisticada",
        incluye: [
          "🥐 Croissants de mantequilla francesa con jamón y queso gruyere",
          "🍳 Estación de omelettes personalizados con ingredientes premium",
          "🐟 Salmón ahumado noruego con alcaparras y cebolla morada",
          "🥗 Ensalada caprese con mozzarella di bufala y reducción balsámica",
          "🥧 Mini quiches de lorraine y spanakopita griega",
          "🍞 Pan brioche francés tostado con frutas flambeadas",
          "🍾 Barra de champagne con frutas frescas",
          "🍰 Pasteles artesanales: macarons, éclairs, tartaletas",
          "☕ Barra de café gourmet con barista profesional"
        ],
        alergenos: "Contiene: Pescado, lácteos, gluten, alcohol, frutos secos"
      }
    ],
    icon: "🥂",
    color: "from-orange-500 to-rose-500",
    minPersonas: 15,
    descripcionTipo: "Brunch dominical, despedidas, reuniones de amigos"
  }
};

const creditoInicial = 10000;
const FEE_PORCENTAJE = 0.13;
const TAX_PORCENTAJE = 0.115;

export default function CateringSolicitudForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const direccionInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", tipo: "", fecha: "", hora: "",
    personas: "", direccion: "", metodo_pago: "Tarjeta de crédito", cuotas: 1,
    notas: "", servicios_adicionales: [], menu_seleccionado: null,
    contacto_emergencia: "", telefono_emergencia: "", 
    instrucciones_entrega: "", alergias: ""
  });
  
  const [errores, setErrores] = useState({});
  const [creditoTotal] = useState(creditoInicial);
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [step, setStep] = useState(0);
  const [ubicacionValida, setUbicacionValida] = useState(false);

  // Auto-detectar tipo desde ID
  useEffect(() => {
    if (id && ID_TO_TIPO[id]) {
      const tipoMapeado = ID_TO_TIPO[id];
      setForm(prev => ({ ...prev, tipo: tipoMapeado }));
    }
  }, [id]);

  // Google Maps Autocomplete (solo Puerto Rico)
  useEffect(() => {
    if (window.google?.maps) { setGoogleLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCcotv_0G8ETQb-7i25p36Ean0aOOrquOs&libraries=places";
    script.async = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!googleLoaded || !direccionInputRef.current) return;
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        direccionInputRef.current, { 
          types: ["address"], 
          componentRestrictions: { country: "pr" }
        }
      );
      autocompleteRef.current.setFields(["formatted_address", "address_components", "geometry"]);
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
          const isPuertoRico = place.address_components?.some(
            component => component.short_name === "PR" && component.types.includes("administrative_area_level_1")
          );
          
          if (isPuertoRico) {
            setForm(prev => ({ ...prev, direccion: place.formatted_address }));
            setUbicacionValida(true);
            setErrores(prev => ({ ...prev, direccion: "" }));
          } else {
            setForm(prev => ({ ...prev, direccion: "" }));
            setUbicacionValida(false);
            setErrores(prev => ({ ...prev, direccion: "Solo servimos en Puerto Rico" }));
          }
        }
      });
    } catch (error) { console.error("Error autocomplete:", error); }
  }, [googleLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "servicios_adicionales") {
      let nuevos = [...form.servicios_adicionales];
      if (checked) nuevos.push(value);
      else nuevos = nuevos.filter(s => s !== value);
      setForm({ ...form, servicios_adicionales: nuevos });
    } else {
      setForm({ ...form, [name]: type === "number" ? Number(value) : value });
    }
    if (errores[name]) setErrores({ ...errores, [name]: "" });
  };

  const handleMenuChange = (item) => {
    setForm(prev => ({ ...prev, menu_seleccionado: item }));
    if (errores.menu) setErrores({ ...errores, menu: "" });
  };

  // Cálculos financieros
  const serviciosSeleccionados = form.tipo && tiposDeCatering[form.tipo]?.servicios || [];
  const totalExtras = serviciosSeleccionados.filter(s => form.servicios_adicionales.includes(s.nombre)).reduce((t, s) => t + s.precio, 0);
  const costoMenu = form.menu_seleccionado ? form.menu_seleccionado.precio * (form.personas || 0) : 0;
  
  const subtotalSinFee = costoMenu + totalExtras;
  const feeGestion = subtotalSinFee * FEE_PORCENTAJE;
  const subtotalConFee = subtotalSinFee + feeGestion;
  const taxAmount = subtotalConFee * TAX_PORCENTAJE;
  const totalFinal = subtotalConFee + taxAmount;
  const creditoRestante = creditoTotal - totalFinal;
  
  const cuotasSeleccionadas = Math.min(form.cuotas || 1, 6);
  const pagoInicial = totalFinal * 0.25;
  const balanceRestante = totalFinal - pagoInicial;
  const cuotaMensual = cuotasSeleccionadas > 1 ? balanceRestante / (cuotasSeleccionadas - 1) : 0;

  const formatearHora = (hora) => hora?.length === 5 ? hora + ":00" : hora;

  const validarFormulario = () => {
    const err = {};
    const hoy = new Date().toISOString().split("T")[0];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[0-9]{10,}$/;
    
    if (!form.nombre.trim() || form.nombre.length < 3) err.nombre = "Nombre completo requerido (mín 3 caracteres)";
    if (!emailRegex.test(form.email)) err.email = "Email válido requerido";
    if (!telefonoRegex.test(form.telefono.replace(/[^0-9]/g, ""))) err.telefono = "Teléfono válido requerido (10 dígitos)";
    if (!form.tipo) err.tipo = "Selecciona tipo de evento";
    if (!form.direccion.trim()) err.direccion = "Dirección completa requerida";
    if (!ubicacionValida) err.direccion = "Selecciona una dirección válida de Puerto Rico";
    if (!form.fecha || form.fecha < hoy) err.fecha = "Fecha debe ser futura";
    if (!form.hora) err.hora = "Hora requerida";
    
    const minPersonas = tiposDeCatering[form.tipo]?.minPersonas || 10;
    if (!form.personas || form.personas < minPersonas) {
      err.personas = `Mínimo ${minPersonas} personas para ${form.tipo}`;
    }
    
    if (!form.menu_seleccionado) err.menu = "Selecciona un menú";
    if (!form.contacto_emergencia.trim()) err.contacto_emergencia = "Contacto de emergencia requerido";
    if (!telefonoRegex.test(form.telefono_emergencia.replace(/[^0-9]/g, ""))) err.telefono_emergencia = "Teléfono emergencia requerido";
    
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validarFormulario();
    if (Object.keys(err).length > 0) { 
      setErrores(err); 
      window.scrollTo({ top: 0, behavior: "smooth" });
      return; 
    }
    
    if (creditoRestante < 0) {
      alert(
        `⚠️ CRÉDITO INSUFICIENTE\n\n` +
        `Necesitas: $${Math.abs(creditoRestante).toFixed(2)} adicionales\n\n` +
        `Ve a tu PERFIL para solicitar una evaluación crediticia.`
      );
      return;
    }

    setLoading(true);
    const usuario_id = "4d7c5276-9a75-4af4-9db6-36c5320f8806";
    
    const payload = {
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono,
      tipo: form.tipo,
      fecha: form.fecha,
      hora: formatearHora(form.hora),
      personas: Number(form.personas),
      direccion: form.direccion,
      notas: form.notas,
      cuotas: cuotasSeleccionadas,
      metodo_pago: form.metodo_pago,
      servicios_adicionales: form.servicios_adicionales.join(", "),
      contacto_emergencia: form.contacto_emergencia,
      telefono_emergencia: form.telefono_emergencia,
      instrucciones_entrega: form.instrucciones_entrega,
      alergias: form.alergias,
      subtotal_sin_fee: subtotalSinFee,
      fee_gestion: feeGestion,
      subtotal_con_fee: subtotalConFee,
      tax_amount: taxAmount,
      total_final: totalFinal,
      total_extras: totalExtras,
      total_general: subtotalSinFee,
      credito_restante: creditoRestante,
      precio_base: costoMenu,
      usuario_id,
      evento: form.tipo,
      mensaje_restaurante: `EVENTO: ${form.tipo}\nMENÚ: ${form.menu_seleccionado?.nombre} ($${form.menu_seleccionado?.precio}/persona)\nALERGIAS: ${form.alergias || "Ninguna"}\nINSTRUCCIONES: ${form.instrucciones_entrega || "N/A"}\nNOTAS: ${form.notas || "N/A"}\nEMERGENCIA: ${form.contacto_emergencia} - ${form.telefono_emergencia}`,
    };

    try {
      const { error } = await supabase.from("solicitudes_catering").insert([payload]).select();
      if (error) throw error;
      
      await supabase.from("usuarios").update({ credito: creditoRestante }).eq("id", usuario_id);
      
      setLoading(false);
      setConfirmado(true);
      setMostrarResumen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error al enviar:", err);
      alert("Error al enviar: " + err.message);
      setLoading(false);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text("DineFlexx - Confirmación de Catering", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 40;
    
    doc.text(`Cliente: ${form.nombre}`, 20, y); y += 8;
    doc.text(`Email: ${form.email}`, 20, y); y += 8;
    doc.text(`Teléfono: ${form.telefono}`, 20, y); y += 12;
    
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text("Detalles del Evento", 20, y); y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tipo: ${form.tipo}`, 20, y); y += 8;
    doc.text(`Fecha: ${form.fecha} - Hora: ${form.hora}`, 20, y); y += 8;
    doc.text(`Personas: ${form.personas}`, 20, y); y += 8;
    doc.text(`Dirección: ${form.direccion}`, 20, y); y += 12;
    
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text("Servicio Escogido", 20, y); y += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Menú: ${form.menu_seleccionado?.nombre} (${form.personas} personas)`, 20, y);
    doc.text(`$${costoMenu.toFixed(2)}`, 170, y); y += 7;
    
    if (totalExtras > 0) {
      doc.text(`Servicios adicionales`, 20, y);
      doc.text(`$${totalExtras.toFixed(2)}`, 170, y); y += 7;
    }
    
    doc.text(`Subtotal catering`, 20, y);
    doc.text(`$${subtotalSinFee.toFixed(2)}`, 170, y); y += 7;
    
    doc.text(`Fee de gestión del evento`, 20, y);
    doc.text(`$${feeGestion.toFixed(2)}`, 170, y); y += 7;
    
    doc.text(`Tax IVU (11.5%)`, 20, y);
    doc.text(`$${taxAmount.toFixed(2)}`, 170, y); y += 10;
    
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL A PAGAR`, 20, y);
    doc.text(`$${totalFinal.toFixed(2)}`, 170, y); y += 12;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text("Plan de Pagos", 20, y); y += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Método: ${form.metodo_pago}`, 20, y); y += 7;
    doc.text(`Pago inicial (25%): $${pagoInicial.toFixed(2)}`, 20, y); y += 7;
    
    if (cuotasSeleccionadas > 1) {
      doc.text(`Cuotas mensuales (${cuotasSeleccionadas - 1}x): $${cuotaMensual.toFixed(2)}`, 20, y); y += 7;
    }
    
    y += 5;
    doc.text(`Crédito restante: $${creditoRestante.toFixed(2)}`, 20, y);
    
    const nombreArchivo = `DineFlexx_Catering_${form.tipo}_${form.fecha}.pdf`;
    doc.save(nombreArchivo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate("/catering")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Crédito Disponible</p>
              <p className={`text-2xl font-bold ${creditoRestante >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${Math.abs(creditoRestante).toFixed(2)}
              </p>
              {creditoRestante < 0 && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  Fondos Insuficientes
                </p>
              )}
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Solicitud de Catering
            </h1>
            <p className="text-gray-600">Completa tu reservación paso a paso</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["Evento", "Datos", "Menú", "Pago"].map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= i ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-xs mt-1 font-medium text-gray-600">{label}</span>
                </div>
                {i < 3 && <div className={`h-1 w-12 rounded-full transition-all ${step > i ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-200"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FORMULARIO */}
        {!confirmado ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
            <AnimatePresence mode="wait">

              {/* STEP 0: Selector de Tipo + PERSONAS */}
              {step === 0 && (
                <motion.div key="step0" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona el Tipo de Evento</h2>
                    <p className="text-gray-600">Primero elige la categoría de tu evento</p>
                  </div>

                  {/* Cards de Tipos de Catering */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.keys(tiposDeCatering).map(tipo => {
                      const config = tiposDeCatering[tipo];
                      
                      return (
                        <motion.div 
                          key={tipo} 
                          whileHover={{ y: -4, scale: 1.02 }} 
                          onClick={() => {
                            setForm({ ...form, tipo, personas: config.minPersonas });
                          }} 
                          className={`p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                            form.tipo === tipo 
                              ? "border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 ring-2 ring-purple-200 shadow-xl" 
                              : "border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-5xl mb-3">{config.icon}</div>
                            <h3 className="font-bold text-xl mb-2 text-gray-800">{tipo}</h3>
                            <p className="text-xs text-gray-600 mb-3">{config.descripcionTipo}</p>
                            
                            <div className={`p-3 rounded-xl ${form.tipo === tipo ? 'bg-purple-100' : 'bg-gray-100'}`}>
                              <p className="text-xs text-gray-600 mb-1">Mínimo de invitados:</p>
                              <p className="text-2xl font-bold text-purple-600">{config.minPersonas}</p>
                              <p className="text-xs text-gray-500 mt-1">{config.menu.length} menús disponibles</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {errores.tipo && <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"><AlertCircle className="w-5 h-5" /><span>{errores.tipo}</span></div>}

                  {/* Selector de Personas */}
                  {form.tipo && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200"
                    >
                      <label className="block text-center mb-4">
                        <span className="text-lg font-bold text-indigo-900">👥 ¿Cuántas personas asistirán?</span>
                        <p className="text-sm text-gray-600 mt-1">Mínimo {tiposDeCatering[form.tipo].minPersonas} personas para {form.tipo}</p>
                      </label>
                      
                      <div className="flex items-center justify-center gap-4">
                        <button 
                          type="button"
                          onClick={() => {
                            const min = tiposDeCatering[form.tipo].minPersonas;
                            const nuevoValor = Math.max(min, (form.personas || min) - 5);
                            setForm({ ...form, personas: nuevoValor });
                          }}
                          disabled={form.personas <= tiposDeCatering[form.tipo].minPersonas}
                          className="w-12 h-12 bg-white rounded-xl shadow-md hover:shadow-lg font-bold text-2xl text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          –
                        </button>
                        
                        <input 
                          type="number" 
                          name="personas" 
                          value={form.personas || ""} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const min = tiposDeCatering[form.tipo].minPersonas;
                            if (val >= min) {
                              setForm({ ...form, personas: val });
                            }
                          }}
                          min={tiposDeCatering[form.tipo].minPersonas}
                          className="w-32 text-center text-4xl font-bold text-indigo-900 bg-white border-2 border-indigo-300 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500"
                          placeholder={tiposDeCatering[form.tipo].minPersonas.toString()}
                        />
                        
                        <button 
                          type="button"
                          onClick={() => {
                            const nuevoValor = (form.personas || tiposDeCatering[form.tipo].minPersonas) + 5;
                            setForm({ ...form, personas: nuevoValor });
                          }}
                          className="w-12 h-12 bg-white rounded-xl shadow-md hover:shadow-lg font-bold text-2xl text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          +
                        </button>
                      </div>
                      
                      {form.personas && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-indigo-700 font-medium mb-2">
                            {form.personas} invitado{form.personas > 1 ? 's' : ''} confirmado{form.personas > 1 ? 's' : ''}
                          </p>
                          
                          <div className="bg-white rounded-xl p-4 inline-block">
                            <p className="text-xs text-gray-600 mb-1">Precio estimado desde:</p>
                            <p className="text-3xl font-bold text-purple-600">
                              ${(tiposDeCatering[form.tipo].menu[0].precio * form.personas).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Menú {tiposDeCatering[form.tipo].menu[0].nombre}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {errores.personas && <p className="text-red-600 text-sm text-center mt-2">{errores.personas}</p>}
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => navigate("/catering")} className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!form.tipo) {
                          setErrores({ ...errores, tipo: "Selecciona un tipo de evento" });
                          return;
                        }
                        if (!form.personas || form.personas < tiposDeCatering[form.tipo].minPersonas) {
                          setErrores({ ...errores, personas: `Mínimo ${tiposDeCatering[form.tipo].minPersonas} personas` });
                          return;
                        }
                        setStep(1);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl disabled:opacity-50"
                      disabled={!form.tipo || !form.personas}
                    >
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Datos Personales */}
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Información del Cliente</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Nombre Completo *
                      </label>
                      <input type="text" name="nombre" value={form.nombre} onChange={handleChange} 
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.nombre ? "border-red-500" : "border-gray-200"}`} 
                        placeholder="Juan Pérez" />
                      {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email *
                      </label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} 
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.email ? "border-red-500" : "border-gray-200"}`} 
                        placeholder="juan@email.com" />
                      {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Teléfono *
                      </label>
                      <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} 
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.telefono ? "border-red-500" : "border-gray-200"}`} 
                        placeholder="787-123-4567" />
                      {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Fecha del Evento *
                      </label>
                      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} 
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.fecha ? "border-red-500" : "border-gray-200"}`} />
                      {errores.fecha && <p className="text-red-500 text-xs mt-1">{errores.fecha}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Hora del Evento *
                      </label>
                      <input type="time" name="hora" value={form.hora} onChange={handleChange} 
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.hora ? "border-red-500" : "border-gray-200"}`} />
                      {errores.hora && <p className="text-red-500 text-xs mt-1">{errores.hora}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Dirección del Evento * 🇵🇷
                      </label>
                      <input type="text" name="direccion" ref={direccionInputRef} value={form.direccion} onChange={handleChange} 
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.direccion ? "border-red-500" : "border-gray-200"}`} 
                        placeholder="Comienza a escribir tu dirección en PR..." />
                      {errores.direccion && <p className="text-red-500 text-xs mt-1">{errores.direccion}</p>}
                      {ubicacionValida && (
                        <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Ubicación válida en Puerto Rico
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Zona de Servicio</p>
                      <p className="text-xs text-blue-700 mt-1">
                        📍 Actualmente servimos todo Puerto Rico. La dirección será validada automáticamente.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contacto de Emergencia *</label>
                      <input type="text" name="contacto_emergencia" value={form.contacto_emergencia} onChange={handleChange} 
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.contacto_emergencia ? "border-red-500" : "border-gray-200"}`} 
                        placeholder="Nombre completo" />
                      {errores.contacto_emergencia && <p className="text-red-500 text-xs mt-1">{errores.contacto_emergencia}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono Emergencia *</label>
                      <input type="tel" name="telefono_emergencia" value={form.telefono_emergencia} onChange={handleChange} 
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errores.telefono_emergencia ? "border-red-500" : "border-gray-200"}`} 
                        placeholder="787-123-4567" />
                      {errores.telefono_emergencia && <p className="text-red-500 text-xs mt-1">{errores.telefono_emergencia}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setStep(0)} className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                      ← Atrás
                    </button>
                    <button type="button" onClick={() => setStep(2)} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl">
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Menú y Servicios */}
              {step === 2 && form.tipo && (
                <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Selecciona tu Menú</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {tiposDeCatering[form.tipo].menu.map((item, idx) => {
                      const costoTotal = item.precio * form.personas;
                      return (
                        <motion.div 
                          key={idx} 
                          whileHover={{ scale: 1.02, y: -4 }}
                          onClick={() => handleMenuChange(item)}
                          className={`p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                            form.menu_seleccionado?.nombre === item.nombre 
                              ? "border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl ring-2 ring-purple-200" 
                              : "border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">{item.nombre}</h3>
                              <p className="text-sm text-gray-600 italic">{item.descripcion}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-purple-600">${item.precio}</p>
                              <p className="text-xs text-gray-500">por persona</p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-xl p-4 mb-3">
                            <p className="font-semibold text-sm text-gray-700 mb-2">✨ Incluye:</p>
                            <ul className="space-y-1">
                              {item.incluye.map((inc, i) => (
                                <li key={i} className="text-xs text-gray-600">{inc}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <p className="text-xs text-amber-600">⚠️ {item.alergenos}</p>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total para {form.personas} personas:</p>
                              <p className="text-xl font-bold text-purple-600">${costoTotal.toLocaleString()}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {errores.menu && <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"><AlertCircle className="w-5 h-5" /><span>{errores.menu}</span></div>}

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">🎉 Servicios Adicionales (Opcionales)</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {serviciosSeleccionados.map((servicio, idx) => (
                        <label key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-purple-300 transition-all">
                          <input type="checkbox" name="servicios_adicionales" value={servicio.nombre} checked={form.servicios_adicionales.includes(servicio.nombre)} onChange={handleChange} 
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{servicio.nombre}</p>
                            <p className="text-sm text-purple-600 font-bold">${servicio.precio}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Alergias o Restricciones Alimentarias</label>
                      <textarea name="alergias" value={form.alergias} onChange={handleChange} rows="2"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" 
                        placeholder="Ej: Sin gluten, vegetariano, alergia a mariscos..." />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Instrucciones Especiales de Entrega</label>
                      <textarea name="instrucciones_entrega" value={form.instrucciones_entrega} onChange={handleChange} rows="2"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" 
                        placeholder="Ej: Entrega por entrada lateral, contactar al llegar..." />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Notas Adicionales</label>
                      <textarea name="notas" value={form.notas} onChange={handleChange} rows="3"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" 
                        placeholder="Cualquier detalle adicional..." />
                    </div>
                  </div>

                  {form.menu_seleccionado && (
                    <div className="sticky top-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 border-2 border-purple-300 shadow-xl">
                      <h3 className="font-bold text-xl mb-4 text-purple-900 text-center">💰 Servicio Escogido</h3>
                      
                      <div className="bg-white rounded-xl p-4 space-y-2 mb-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">Evento:</span>
                          <span className="text-sm font-bold text-purple-600">{form.tipo}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">Invitados:</span>
                          <span className="text-sm font-bold text-purple-600">{form.personas} personas</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Menú: {form.menu_seleccionado.nombre}</span>
                          <span className="text-sm font-semibold text-gray-800">${costoMenu.toLocaleString()}</span>
                        </div>
                        {totalExtras > 0 && (
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Servicios adicionales</span>
                            <span className="text-sm font-semibold text-gray-800">${totalExtras.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Subtotal catering</span>
                          <span className="text-sm font-semibold text-gray-800">${subtotalSinFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Fee de gestión (13%)</span>
                          <span className="text-sm font-semibold text-gray-800">${feeGestion.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Tax IVU (11.5%)</span>
                          <span className="text-sm font-semibold text-gray-800">${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                          <span className="text-2xl font-bold text-purple-600">${totalFinal.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className={`text-center p-3 rounded-xl ${creditoRestante >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className="text-sm text-gray-700 mb-1">Crédito restante después de este evento:</p>
                        <p className={`text-2xl font-bold ${creditoRestante >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(creditoRestante).toFixed(2)} {creditoRestante < 0 && '(Fondos Insuficientes)'}
                        </p>
                        
                        {creditoRestante < 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm text-red-700 font-semibold">
                              Necesitas ${Math.abs(creditoRestante).toFixed(2)} adicionales
                            </p>
                            <button
                              type="button"
                              onClick={() => navigate('/perfil')}
                              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
                            >
                              <CreditCard className="w-5 h-5" />
                              Solicitar Evaluación de Crédito
                            </button>
                            <p className="text-xs text-gray-600 text-center">
                              Proceso rápido y seguro • Respuesta en minutos
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={() => setStep(1)} className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all">
                      ← Atrás
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!form.menu_seleccionado) {
                          setErrores({ ...errores, menu: "Selecciona un menú" });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          return;
                        }
                        setStep(3);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl disabled:opacity-50"
                      disabled={!form.menu_seleccionado}
                    >
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Método de Pago CON SELECTOR DE CUOTAS VISIBLE */}
              {step === 3 && (
                <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Método de Pago</h2>
                  
                  {/* Opciones de Pago */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-green-600" />
                        <span className="font-bold text-lg text-gray-800">Opciones de Pago</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total a pagar:</p>
                        <p className="text-2xl font-bold text-green-600">${totalFinal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {["Tarjeta de crédito", "ATH Móvil"].map(metodo => (
                        <label key={metodo} className={`flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${
                          form.metodo_pago === metodo ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-400'
                        }`}>
                          <input 
                            type="radio" 
                            name="metodo_pago" 
                            value={metodo} 
                            checked={form.metodo_pago === metodo} 
                            onChange={handleChange} 
                            className="w-5 h-5 text-green-600" 
                          />
                          <span className="font-semibold text-gray-800">{metodo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Plan de Cuotas - MÁS VISIBLE CON BOTONES */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      <h3 className="font-bold text-xl text-gray-800">Plan de Pagos Flexible</h3>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        ¿En cuántos pagos deseas dividir tu compra?
                      </label>
                      
                      {/* GRID DE OPCIONES DE CUOTAS - BOTONES GRANDES */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setForm({ ...form, cuotas: n })}
                            className={`p-4 rounded-xl border-2 font-bold transition-all ${
                              form.cuotas === n 
                                ? 'bg-purple-500 text-white border-purple-600 shadow-lg scale-105' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:shadow-md'
                            }`}
                          >
                            <div className="text-2xl">{n}</div>
                            <div className="text-xs mt-1">{n === 1 ? 'pago' : 'cuotas'}</div>
                          </button>
                        ))}
                      </div>

                      {/* SELECT ALTERNATIVO */}
                      <select 
                        name="cuotas" 
                        value={form.cuotas} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-gray-800 cursor-pointer hover:border-purple-400 transition-all bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "pago único (completo ahora)" : `cuotas mensuales de $${(totalFinal / n).toFixed(2)}`}
                          </option>
                        ))}
                      </select>
                      
                      <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        💡 Sin intereses ni cargos adicionales • 0% APR
                      </p>
                    </div>
                    
                    {/* DESGLOSE DEL PLAN */}
                    <div className="bg-white rounded-xl p-5 space-y-3 shadow-inner">
                      <div className="text-center mb-3">
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Tu Plan Seleccionado</p>
                        <p className="text-3xl font-bold text-purple-600 mt-1">{form.cuotas} {form.cuotas === 1 ? 'Pago' : 'Cuotas'}</p>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          Pago inicial (25%)
                        </span>
                        <span className="text-lg font-bold text-purple-600">${pagoInicial.toFixed(2)}</span>
                      </div>

                      {cuotasSeleccionadas > 1 && (
                        <>
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Balance restante</span>
                            <span className="text-sm font-semibold text-gray-800">${balanceRestante.toFixed(2)}</span>
                          </div>
                          
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs text-gray-600">Cuota mensual</p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {cuotasSeleccionadas - 1} pago{cuotasSeleccionadas - 1 > 1 ? 's' : ''} de:
                                </p>
                              </div>
                              <span className="text-2xl font-bold text-purple-600">${cuotaMensual.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">
                              📅 Próximo pago: <span className="font-semibold">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-PR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </p>
                          </div>
                        </>
                      )}

                      {form.cuotas === 1 && (
                        <div className="text-center py-3">
                          <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Pagarás el monto completo hoy
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RESUMEN FINAL */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">📋 Resumen de tu Pago</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total del evento</span>
                        <span className="text-sm font-semibold text-gray-800">${totalFinal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Método de pago</span>
                        <span className="text-sm font-semibold text-gray-800">{form.metodo_pago}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="text-sm font-bold text-gray-700">Pagarás hoy</span>
                        <span className="text-xl font-bold text-blue-600">${pagoInicial.toFixed(2)}</span>
                      </div>
                      {cuotasSeleccionadas > 1 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Pagos mensuales restantes</span>
                          <span className="text-sm font-semibold text-gray-800">{cuotasSeleccionadas - 1}x ${cuotaMensual.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BOTONES DE NAVEGACIÓN */}
                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => setStep(2)} 
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
                    >
                      ← Atrás
                    </button>
                    <div className="relative group">
                      <button 
                        type="submit" 
                        disabled={loading || creditoRestante < 0}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                      >
                        {loading ? (
                          <>Procesando... <CheckCircle className="w-5 h-5 animate-spin" /></>
                        ) : creditoRestante < 0 ? (
                          <>Crédito Insuficiente <AlertCircle className="w-5 h-5" /></>
                        ) : (
                          <>Confirmar Reservación <CheckCircle className="w-5 h-5" /></>
                        )}
                      </button>
                      
                      {creditoRestante < 0 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Ve a tu perfil para solicitar más crédito
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Reservación Confirmada!</h2>
              <p className="text-gray-600">Tu solicitud de catering ha sido procesada exitosamente</p>
            </div>

            {mostrarResumen && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-xl mb-4 text-purple-900">📋 Resumen de tu Evento</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold text-gray-700">Cliente:</span> <span className="text-gray-600">{form.nombre}</span></div>
                  <div><span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-600">{form.email}</span></div>
                  <div><span className="font-semibold text-gray-700">Tipo de Evento:</span> <span className="text-gray-600">{form.tipo}</span></div>
                  <div><span className="font-semibold text-gray-700">Fecha:</span> <span className="text-gray-600">{form.fecha} a las {form.hora}</span></div>
                  <div><span className="font-semibold text-gray-700">Invitados:</span> <span className="text-gray-600">{form.personas} personas</span></div>
                  <div><span className="font-semibold text-gray-700">Menú:</span> <span className="text-gray-600">{form.menu_seleccionado?.nombre}</span></div>
                  <div className="md:col-span-2"><span className="font-semibold text-gray-700">Ubicación:</span> <span className="text-gray-600">{form.direccion}</span></div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total pagado:</span>
                    <span className="text-xl font-bold text-green-600">${totalFinal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Crédito restante:</span>
                    <span className="text-lg font-bold text-purple-600">${creditoRestante.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button onClick={generarPDF} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold">
                <Download className="w-5 h-5" /> Descargar PDF
              </button>
              <button onClick={() => navigate("/catering")} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
                Volver al Inicio
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}