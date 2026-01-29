// src/components/Catering/CateringSolicitudForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  Download,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import supabase from "../../supabaseClient";

// ✅ Mapeo ID de Supabase → Tipo de Catering
const ID_TO_TIPO = {
  "1": "Corporativo",
  "2": "Boda",
  "3": "Graduación",
  "4": "Brunch",
};

// ✅ Configuración completa de 4 tipos de catering (detallada)
const tiposDeCatering = {
  Corporativo: {
    servicios: [
      { nombre: "Música / DJ profesional", precio: 200 },
      { nombre: "Servicio de meseros", precio: 100 },
      { nombre: "Coffee break premium", precio: 150 },
      { nombre: "Equipos audiovisuales", precio: 180 },
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
          "🧈 Mantequilla, mermeladas y miel",
        ],
        alergenos: "Contiene: Gluten, lácteos, huevos",
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
          "🍞 Pan ciabatta recién horneado",
        ],
        alergenos: "Contiene: Pescado, frutos secos, lácteos",
      },
    ],
    icon: "💼",
    color: "from-blue-500 to-indigo-500",
    minPersonas: 20,
    descripcionTipo: "Eventos corporativos, reuniones de trabajo, conferencias",
  },

  Boda: {
    servicios: [
      { nombre: "Decoración floral premium", precio: 350 },
      { nombre: "Barra de bebidas open bar", precio: 450 },
      { nombre: "Servicio completo de meseros", precio: 280 },
      { nombre: "Coordinador de eventos profesional", precio: 300 },
      { nombre: "Centro de mesa personalizados", precio: 200 },
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
          "🍞 Pan de agua tibio con mantequilla de hierbas",
        ],
        alergenos: "Contiene: Lácteos, frutos secos, coco",
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
          "🍞 Pan ciabatta y focaccia recién horneados",
        ],
        alergenos: "Contiene: Mariscos, lácteos, alcohol, frutos secos",
      },
    ],
    icon: "💍",
    color: "from-purple-500 to-pink-500",
    minPersonas: 50,
    descripcionTipo: "Bodas, recepciones elegantes, aniversarios especiales",
  },

  Graduación: {
    servicios: [
      { nombre: "Decoración temática académica", precio: 120 },
      { nombre: "Photobooth con props personalizados", precio: 150 },
      { nombre: "DJ con equipos de sonido", precio: 200 },
      { nombre: "Pastel de graduación 3 pisos", precio: 180 },
      { nombre: "Globos y pancartas personalizadas", precio: 90 },
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
          "🍪 Postre: Brownies y cookies de chocolate",
        ],
        alergenos: "Contiene: Gluten, lácteos, frutos secos",
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
          "🍞 Pan focaccia con dips variados",
        ],
        alergenos: "Contiene: Mariscos, lácteos, gluten",
      },
    ],
    icon: "🎓",
    color: "from-yellow-500 to-amber-500",
    minPersonas: 50,
    descripcionTipo: "Graduaciones escolares, universitarias, celebraciones académicas",
  },

  Brunch: {
    servicios: [
      { nombre: "Estación de mimosas y bellinis", precio: 180 },
      { nombre: "Chef en vivo preparando omelettes", precio: 250 },
      { nombre: "Decoración floral fresca", precio: 140 },
      { nombre: "Música jazz en vivo", precio: 200 },
      { nombre: "Servicio de té premium", precio: 120 },
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
          "🥐 Croissants y danishes recién horneados",
        ],
        alergenos: "Contiene: Gluten, lácteos, huevos",
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
          "☕ Barra de café gourmet con barista profesional",
        ],
        alergenos: "Contiene: Pescado, lácteos, gluten, alcohol, frutos secos",
      },
    ],
    icon: "🥂",
    color: "from-orange-500 to-rose-500",
    minPersonas: 15,
    descripcionTipo: "Brunch dominical, despedidas, reuniones de amigos",
  },
};

const FEE_PORCENTAJE = 0.13;
const TAX_PORCENTAJE = 0.115;

// ✅ ENV: recomendado
// Vite:  VITE_GOOGLE_MAPS_API_KEY
// CRA:   REACT_APP_GOOGLE_MAPS_API_KEY
const getGoogleKey = () =>
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_GOOGLE_MAPS_API_KEY) ||
  "";

const formatMoney = (n) => `$${Number(n || 0).toFixed(2)}`;
const digitsOnly = (s) => String(s || "").replace(/[^0-9]/g, "");
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
const isValidPhone10 = (phone) => digitsOnly(phone).length >= 10;
const todayISO = () => new Date().toISOString().split("T")[0];
const formatearHora = (hora) => (hora?.length === 5 ? `${hora}:00` : hora);
const scrollTopSmooth = () => window.scrollTo({ top: 0, behavior: "smooth" });

const nextMonthLabel = () => {
  const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("es-PR", { year: "numeric", month: "long", day: "numeric" });
};

export default function CateringSolicitudForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const direccionInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const googleScriptRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipo: "",
    fecha: "",
    hora: "",
    personas: "",
    direccion: "",
    metodo_pago: "Tarjeta de crédito",
    cuotas: 1,
    notas: "",
    servicios_adicionales: [],
    menu_seleccionado: null,
    contacto_emergencia: "",
    telefono_emergencia: "",
    instrucciones_entrega: "",
    alergias: "",
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [step, setStep] = useState(0);
  const [ubicacionValida, setUbicacionValida] = useState(false);

  // ✅ Wallet real (digital_wallet.balance)
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);

  // ✅ Auto-detectar tipo desde ID
  useEffect(() => {
    if (id && ID_TO_TIPO[id]) {
      const tipoMapeado = ID_TO_TIPO[id];
      setForm((prev) => ({ ...prev, tipo: tipoMapeado }));
      // No forzamos step aquí para no saltar UX, pero podrías moverlo a step 0/1 si quieres.
    }
  }, [id]);

  // ✅ Cargar wallet
  useEffect(() => {
    const loadWallet = async () => {
      try {
        setWalletLoading(true);

        const { data: auth } = await supabase.auth.getUser();
        const userId = auth?.user?.id;

        if (!userId) {
          setWalletBalance(0);
          return;
        }

        const { data: walletRow, error } = await supabase
          .from("digital_wallet")
          .select("balance")
          .eq("user_id", userId)
          .single();

        // Si no existe wallet, creamos en 0
        if (error && error.code === "PGRST116") {
          await supabase.from("digital_wallet").insert([{ user_id: userId, balance: 0 }]);
          setWalletBalance(0);
        } else if (error) {
          throw error;
        } else {
          setWalletBalance(Number(walletRow?.balance ?? 0));
        }
      } catch (e) {
        console.error("loadWallet error:", e);
        setWalletBalance(0);
      } finally {
        setWalletLoading(false);
      }
    };

    loadWallet();
  }, []);

  // ✅ Cargar Google Maps Places (solo PR)
  useEffect(() => {
    if (window.google?.maps?.places) {
      setGoogleLoaded(true);
      return;
    }

    const key = getGoogleKey();
    // Si no hay key, no rompemos la app. El user puede escribir dirección manual.
    if (!key) {
      console.warn("Google Maps API key no encontrada en env. Autocomplete desactivado.");
      return;
    }

    const script = document.createElement("script");
    googleScriptRef.current = script;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      try {
        if (googleScriptRef.current?.parentNode) {
          googleScriptRef.current.parentNode.removeChild(googleScriptRef.current);
        }
      } catch (_) {}
    };
  }, []);

  // ✅ Inicializar Autocomplete
  useEffect(() => {
    if (!googleLoaded || !direccionInputRef.current) return;
    if (!window.google?.maps?.places) return;

    try {
      // Evita duplicar Autocomplete si el effect corre más de una vez
      if (autocompleteRef.current) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        direccionInputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "pr" },
          fields: ["formatted_address", "address_components", "geometry"], // ✅ reemplaza setFields (deprecated)
        }
      );

      const onPlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace?.();
        const formatted = place?.formatted_address;

        if (!formatted) return;

        const isPuertoRico = place?.address_components?.some(
          (component) =>
            component.short_name === "PR" &&
            component.types.includes("administrative_area_level_1")
        );

        if (isPuertoRico) {
          setForm((prev) => ({ ...prev, direccion: formatted }));
          setUbicacionValida(true);
          setErrores((prev) => ({ ...prev, direccion: "" }));
        } else {
          setForm((prev) => ({ ...prev, direccion: "" }));
          setUbicacionValida(false);
          setErrores((prev) => ({ ...prev, direccion: "Solo servimos en Puerto Rico" }));
        }
      };

      autocompleteRef.current.addListener("place_changed", onPlaceChanged);
    } catch (error) {
      console.error("Error autocomplete:", error);
    }
  }, [googleLoaded]);

  // ✅ Helpers de navegación por pasos (restaurados)
  const setError = (name, msg) => setErrores((prev) => ({ ...prev, [name]: msg }));
  const clearError = (name) => setErrores((prev) => ({ ...prev, [name]: "" }));

  const validarStep0 = () => {
    const err = {};
    if (!form.tipo) err.tipo = "Selecciona un tipo de evento";

    const min = tiposDeCatering[form.tipo]?.minPersonas || 10;
    const personasN = Number(form.personas || 0);
    if (!personasN || personasN < min) err.personas = `Mínimo ${min} personas para ${form.tipo || "este evento"}`;
    return err;
  };

  const validarStep1 = () => {
    const err = {};
    if (!String(form.nombre || "").trim() || String(form.nombre).trim().length < 3)
      err.nombre = "Nombre completo requerido (mín 3 caracteres)";
    if (!isValidEmail(form.email)) err.email = "Email válido requerido";
    if (!isValidPhone10(form.telefono)) err.telefono = "Teléfono válido requerido (10 dígitos)";
    if (!form.fecha || form.fecha < todayISO()) err.fecha = "Fecha debe ser futura";
    if (!form.hora) err.hora = "Hora requerida";

    // Dirección
    if (!String(form.direccion || "").trim()) err.direccion = "Dirección completa requerida";
    // Si Google está activo y ya detectamos que NO es PR, bloquea.
    if (String(form.direccion || "").trim() && googleLoaded && !ubicacionValida) {
      // Si el user escribió manual, ubicacionValida puede estar false; en ese caso no lo bloqueamos duro.
      // Solo bloqueamos si el error ya lo seteo el Autocomplete (solo servimos PR).
      // Mantengo la validación suave:
      if (errores.direccion === "Solo servimos en Puerto Rico") {
        err.direccion = "Solo servimos en Puerto Rico";
      }
    }

    if (!String(form.contacto_emergencia || "").trim())
      err.contacto_emergencia = "Contacto de emergencia requerido";
    if (!isValidPhone10(form.telefono_emergencia))
      err.telefono_emergencia = "Teléfono emergencia requerido (10 dígitos)";

    return err;
  };

  const validarStep2 = () => {
    const err = {};
    if (!form.menu_seleccionado) err.menu = "Selecciona un menú";
    return err;
  };

  const goNext = (targetStep) => {
    let err = {};
    if (step === 0) err = validarStep0();
    if (step === 1) err = validarStep1();
    if (step === 2) err = validarStep2();

    if (Object.keys(err).length > 0) {
      setErrores((prev) => ({ ...prev, ...err }));
      scrollTopSmooth();
      return;
    }
    setStep(targetStep);
    scrollTopSmooth();
  };

  const goBack = (targetStep) => {
    setStep(targetStep);
    scrollTopSmooth();
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      email: "",
      telefono: "",
      tipo: "",
      fecha: "",
      hora: "",
      personas: "",
      direccion: "",
      metodo_pago: "Tarjeta de crédito",
      cuotas: 1,
      notas: "",
      servicios_adicionales: [],
      menu_seleccionado: null,
      contacto_emergencia: "",
      telefono_emergencia: "",
      instrucciones_entrega: "",
      alergias: "",
    });
    setErrores({});
    setConfirmado(false);
    setMostrarResumen(false);
    setStep(0);
    setUbicacionValida(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "servicios_adicionales") {
      setForm((prev) => {
        const actuales = Array.isArray(prev.servicios_adicionales) ? prev.servicios_adicionales : [];
        const nuevos = checked ? [...actuales, value] : actuales.filter((s) => s !== value);
        return { ...prev, servicios_adicionales: nuevos };
      });
      if (errores[name]) clearError(name);
      return;
    }

    const parsedValue = type === "number" ? Number(value) : value;

    setForm((prev) => ({
      ...prev,
      [name]: name === "cuotas" ? Number(parsedValue) : parsedValue,
    }));

    if (errores[name]) clearError(name);
  };

  const handleMenuChange = (item) => {
    setForm((prev) => ({ ...prev, menu_seleccionado: item }));
    if (errores.menu) clearError("menu");
  };

  // ✅ Cálculos financieros (memo para evitar recalcular en cada render)
  const calculos = useMemo(() => {
    const serviciosSeleccionados = (form.tipo && tiposDeCatering[form.tipo]?.servicios) || [];
    const totalExtras = serviciosSeleccionados
      .filter((s) => form.servicios_adicionales.includes(s.nombre))
      .reduce((t, s) => t + Number(s.precio || 0), 0);

    const personasN = Number(form.personas || 0);
    const costoMenu = form.menu_seleccionado ? Number(form.menu_seleccionado.precio || 0) * personasN : 0;

    const subtotalSinFee = costoMenu + totalExtras;
    const feeGestion = subtotalSinFee * FEE_PORCENTAJE;
    const subtotalConFee = subtotalSinFee + feeGestion;
    const taxAmount = subtotalConFee * TAX_PORCENTAJE;
    const totalFinal = subtotalConFee + taxAmount;

    const creditoDisponible = Number(walletBalance ?? 0);
    const creditoDespues = creditoDisponible - totalFinal;

    const cuotasSeleccionadas = Math.min(Math.max(Number(form.cuotas || 1), 1), 6);
    const pagoInicial = totalFinal * 0.25;
    const balanceRestante = totalFinal - pagoInicial;
    const cuotaMensual = cuotasSeleccionadas > 1 ? balanceRestante / (cuotasSeleccionadas - 1) : 0;

    return {
      serviciosSeleccionados,
      totalExtras,
      costoMenu,
      subtotalSinFee,
      feeGestion,
      subtotalConFee,
      taxAmount,
      totalFinal,
      creditoDisponible,
      creditoDespues,
      cuotasSeleccionadas,
      pagoInicial,
      balanceRestante,
      cuotaMensual,
    };
  }, [
    form.tipo,
    form.personas,
    form.menu_seleccionado,
    form.servicios_adicionales,
    form.cuotas,
    walletBalance,
  ]);

  const {
    serviciosSeleccionados,
    totalExtras,
    costoMenu,
    subtotalSinFee,
    feeGestion,
    subtotalConFee,
    taxAmount,
    totalFinal,
    creditoDisponible,
    creditoDespues,
    cuotasSeleccionadas,
    pagoInicial,
    balanceRestante,
    cuotaMensual,
  } = calculos;

  const validarFormularioFinal = () => {
    // Validación total (restaurada) por si alguien intenta submit directo
    const err0 = validarStep0();
    const err1 = validarStep1();
    const err2 = validarStep2();
    return { ...err0, ...err1, ...err2 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (walletLoading) {
      alert("Cargando tu wallet... intenta de nuevo en 2 segundos.");
      return;
    }

    const err = validarFormularioFinal();
    if (Object.keys(err).length > 0) {
      setErrores((prev) => ({ ...prev, ...err }));
      scrollTopSmooth();
      return;
    }

    if (creditoDespues < 0) {
      alert(
        `⚠️ CRÉDITO INSUFICIENTE\n\n` +
          `Necesitas: ${formatMoney(Math.abs(creditoDespues))} adicionales\n\n` +
          `Ve a tu PERFIL para solicitar una evaluación crediticia.`
      );
      return;
    }

    setLoading(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      const usuario_id = auth?.user?.id;

      if (!usuario_id) {
        alert("No se encontró sesión. Inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      // ✅ payload completo (restaurado + mejorado)
      const payload = {
        usuario_id,

        // Identidad / contacto
        nombre: String(form.nombre || "").trim(),
        email: String(form.email || "").trim(),
        telefono: String(form.telefono || "").trim(),

        // Evento
        tipo: form.tipo,
        evento: form.tipo,
        fecha: form.fecha,
        hora: formatearHora(form.hora),
        personas: Number(form.personas),

        // Dirección
        direccion: String(form.direccion || "").trim(),

        // Menú
        menu_nombre: form.menu_seleccionado?.nombre || null,
        menu_precio_por_persona: Number(form.menu_seleccionado?.precio || 0),
        menu_descripcion: form.menu_seleccionado?.descripcion || null,

        // Extras
        servicios_adicionales: Array.isArray(form.servicios_adicionales)
          ? form.servicios_adicionales.join(", ")
          : "",
        total_extras: totalExtras,

        // Notas / restricciones
        notas: form.notas,
        instrucciones_entrega: form.instrucciones_entrega,
        alergias: form.alergias,

        // Emergencia
        contacto_emergencia: form.contacto_emergencia,
        telefono_emergencia: form.telefono_emergencia,

        // Pago
        metodo_pago: form.metodo_pago,
        cuotas: cuotasSeleccionadas,

        // Totales
        precio_base: costoMenu,
        subtotal_sin_fee: subtotalSinFee,
        fee_gestion: feeGestion,
        subtotal_con_fee: subtotalConFee,
        tax_amount: taxAmount,
        total_final: totalFinal,
        total_general: subtotalSinFee,
        credito_restante: creditoDespues,

        // Mensaje (útil para backoffice / restaurante)
        mensaje_restaurante:
          `EVENTO: ${form.tipo}\n` +
          `MENÚ: ${form.menu_seleccionado?.nombre || "N/A"} (${formatMoney(
            form.menu_seleccionado?.precio
          )}/persona)\n` +
          `PERSONAS: ${form.personas}\n` +
          `ALERGIAS: ${form.alergias || "Ninguna"}\n` +
          `INSTRUCCIONES: ${form.instrucciones_entrega || "N/A"}\n` +
          `NOTAS: ${form.notas || "N/A"}\n` +
          `EMERGENCIA: ${form.contacto_emergencia} - ${form.telefono_emergencia}`,
      };

      // 1) Insert solicitud
      const { error: insertError } = await supabase.from("solicitudes_catering").insert([payload]).select();
      if (insertError) throw insertError;

      // 2) Descuenta wallet (balance real)
      // Nota: para 100% atomicidad, esto idealmente sería RPC/transaction server-side.
      const { error: wErr } = await supabase
        .from("digital_wallet")
        .update({ balance: creditoDespues, updated_at: new Date().toISOString() })
        .eq("user_id", usuario_id);

      if (wErr) throw wErr;

      // 3) UI local
      setWalletBalance(creditoDespues);
      setConfirmado(true);
      setMostrarResumen(true);
      scrollTopSmooth();
    } catch (err2) {
      console.error("Error al enviar:", err2);
      alert("Error al enviar: " + (err2?.message || "Error desconocido"));
    } finally {
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

    doc.text(`Cliente: ${form.nombre}`, 20, y);
    y += 8;
    doc.text(`Email: ${form.email}`, 20, y);
    y += 8;
    doc.text(`Teléfono: ${form.telefono}`, 20, y);
    y += 12;

    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text("Detalles del Evento", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tipo: ${form.tipo}`, 20, y);
    y += 8;
    doc.text(`Fecha: ${form.fecha} - Hora: ${form.hora}`, 20, y);
    y += 8;
    doc.text(`Personas: ${form.personas}`, 20, y);
    y += 8;
    doc.text(`Dirección: ${form.direccion}`, 20, y);
    y += 12;

    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text("Servicio Escogido", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    doc.text(
      `Menú: ${form.menu_seleccionado?.nombre || "N/A"} (${form.personas} personas)`,
      20,
      y
    );
    doc.text(formatMoney(costoMenu), 170, y);
    y += 7;

    if (totalExtras > 0) {
      doc.text(`Servicios adicionales`, 20, y);
      doc.text(formatMoney(totalExtras), 170, y);
      y += 7;
    }

    doc.text(`Subtotal catering`, 20, y);
    doc.text(formatMoney(subtotalSinFee), 170, y);
    y += 7;

    doc.text(`Fee de gestión del evento`, 20, y);
    doc.text(formatMoney(feeGestion), 170, y);
    y += 7;

    doc.text(`Tax IVU (11.5%)`, 20, y);
    doc.text(formatMoney(taxAmount), 170, y);
    y += 10;

    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text(`TOTAL A PAGAR`, 20, y);
    doc.text(formatMoney(totalFinal), 170, y);
    y += 12;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");

    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text("Plan de Pagos", 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Método: ${form.metodo_pago}`, 20, y);
    y += 7;
    doc.text(`Pago inicial (25%): ${formatMoney(pagoInicial)}`, 20, y);
    y += 7;

    if (cuotasSeleccionadas > 1) {
      doc.text(
        `Cuotas mensuales (${cuotasSeleccionadas - 1}x): ${formatMoney(cuotaMensual)}`,
        20,
        y
      );
      y += 7;
    }

    y += 5;
    doc.text(`Crédito disponible: ${formatMoney(creditoDisponible)}`, 20, y);
    y += 7;
    doc.text(`Crédito después: ${formatMoney(creditoDespues)}`, 20, y);

    const nombreArchivo = `DineFlexx_Catering_${form.tipo}_${form.fecha}.pdf`;
    doc.save(nombreArchivo);
  };

  // ✅ UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/catering")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>

            <div className="text-right">
              <p className="text-sm text-gray-600">Crédito Disponible</p>
              <p className="text-2xl font-bold text-green-600">
                {walletLoading ? "..." : formatMoney(creditoDisponible)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Después de esta compra:{" "}
                <span
                  className={
                    creditoDespues >= 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {formatMoney(Math.abs(creditoDespues))}
                </span>
                {creditoDespues < 0 && (
                  <span className="text-red-600 font-semibold"> (Fondos Insuficientes)</span>
                )}
              </p>
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
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step >= i
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs mt-1 font-medium text-gray-600">{label}</span>
                </div>
                {i < 3 && (
                  <div
                    className={`h-1 w-12 rounded-full transition-all ${
                      step > i
                        ? "bg-gradient-to-r from-purple-500 to-blue-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FORMULARIO */}
        {!confirmado ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8">
            <AnimatePresence mode="wait">
              {/* STEP 0 */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Selecciona el Tipo de Evento
                    </h2>
                    <p className="text-gray-600">Primero elige la categoría de tu evento</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.keys(tiposDeCatering).map((tipo) => {
                      const config = tiposDeCatering[tipo];
                      return (
                        <motion.div
                          key={tipo}
                          whileHover={{ y: -4, scale: 1.02 }}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, tipo, personas: config.minPersonas }));
                            clearError("tipo");
                            clearError("personas");
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

                            <div
                              className={`p-3 rounded-xl ${
                                form.tipo === tipo ? "bg-purple-100" : "bg-gray-100"
                              }`}
                            >
                              <p className="text-xs text-gray-600 mb-1">Mínimo de invitados:</p>
                              <p className="text-2xl font-bold text-purple-600">{config.minPersonas}</p>
                              <p className="text-xs text-gray-500 mt-1">{config.menu.length} menús disponibles</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {errores.tipo && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span>{errores.tipo}</span>
                    </div>
                  )}

                  {/* Selector de Personas */}
                  {form.tipo && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200"
                    >
                      <label className="block text-center mb-4">
                        <span className="text-lg font-bold text-indigo-900">
                          👥 ¿Cuántas personas asistirán?
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Mínimo {tiposDeCatering[form.tipo].minPersonas} personas para {form.tipo}
                        </p>
                      </label>

                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            const min = tiposDeCatering[form.tipo].minPersonas;
                            const actual = Number(form.personas || min);
                            const nuevoValor = Math.max(min, actual - 5);
                            setForm((prev) => ({ ...prev, personas: nuevoValor }));
                            clearError("personas");
                          }}
                          disabled={Number(form.personas || 0) <= tiposDeCatering[form.tipo].minPersonas}
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
                            setForm((prev) => ({ ...prev, personas: val }));
                            if (val >= min) clearError("personas");
                          }}
                          min={tiposDeCatering[form.tipo].minPersonas}
                          className="w-32 text-center text-4xl font-bold text-indigo-900 bg-white border-2 border-indigo-300 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500"
                          placeholder={String(tiposDeCatering[form.tipo].minPersonas)}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const min = tiposDeCatering[form.tipo].minPersonas;
                            const actual = Number(form.personas || min);
                            const nuevoValor = actual + 5;
                            setForm((prev) => ({ ...prev, personas: nuevoValor }));
                            clearError("personas");
                          }}
                          className="w-12 h-12 bg-white rounded-xl shadow-md hover:shadow-lg font-bold text-2xl text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          +
                        </button>
                      </div>

                      {form.personas && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-indigo-700 font-medium mb-2">
                            {form.personas} invitado{Number(form.personas) > 1 ? "s" : ""} confirmado
                            {Number(form.personas) > 1 ? "s" : ""}
                          </p>

                          <div className="bg-white rounded-xl p-4 inline-block">
                            <p className="text-xs text-gray-600 mb-1">Precio estimado desde:</p>
                            <p className="text-3xl font-bold text-purple-600">
                              {formatMoney(tiposDeCatering[form.tipo].menu[0].precio * Number(form.personas || 0))}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Menú {tiposDeCatering[form.tipo].menu[0].nombre}
                            </p>
                          </div>
                        </div>
                      )}

                      {errores.personas && (
                        <p className="text-red-600 text-sm text-center mt-2">{errores.personas}</p>
                      )}
                    </motion.div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/catering")}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={() => goNext(1)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl disabled:opacity-50"
                      disabled={!form.tipo || !form.personas}
                    >
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Información del Cliente
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.nombre ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Juan Pérez"
                      />
                      {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.email ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="juan@email.com"
                      />
                      {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.telefono ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="787-123-4567"
                      />
                      {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Fecha del Evento *
                      </label>
                      <input
                        type="date"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        min={todayISO()}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.fecha ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errores.fecha && <p className="text-red-500 text-xs mt-1">{errores.fecha}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Hora del Evento *
                      </label>
                      <input
                        type="time"
                        name="hora"
                        value={form.hora}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.hora ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errores.hora && <p className="text-red-500 text-xs mt-1">{errores.hora}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Dirección del Evento * 🇵🇷
                      </label>
                      <input
                        ref={direccionInputRef}
                        type="text"
                        name="direccion"
                        value={form.direccion}
                        onChange={(e) => {
                          handleChange(e);
                          // Si el user escribe manual, no bloqueamos. Solo limpiamos el “PR validado”
                          setUbicacionValida(false);
                        }}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.direccion ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Ej: 123 Calle Luna, San Juan, PR 00901"
                      />
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
                        📍 Actualmente servimos todo Puerto Rico. La dirección será validada automáticamente (si la API está activa).
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contacto de Emergencia *
                      </label>
                      <input
                        type="text"
                        name="contacto_emergencia"
                        value={form.contacto_emergencia}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.contacto_emergencia ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Nombre completo"
                      />
                      {errores.contacto_emergencia && (
                        <p className="text-red-500 text-xs mt-1">{errores.contacto_emergencia}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono Emergencia *
                      </label>
                      <input
                        type="tel"
                        name="telefono_emergencia"
                        value={form.telefono_emergencia}
                        onChange={handleChange}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                          errores.telefono_emergencia ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="787-123-4567"
                      />
                      {errores.telefono_emergencia && (
                        <p className="text-red-500 text-xs mt-1">{errores.telefono_emergencia}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => goBack(0)}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                    >
                      ← Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => goNext(2)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl"
                    >
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && form.tipo && (
                <motion.div
                  key="step2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Selecciona tu Menú
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    {tiposDeCatering[form.tipo].menu.map((item, idx) => {
                      const costoTotal = Number(item.precio || 0) * Number(form.personas || 0);
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
                                <li key={i} className="text-xs text-gray-600">
                                  {inc}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <p className="text-xs text-amber-600">⚠️ {item.alergenos}</p>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Total para {form.personas} personas:
                              </p>
                              <p className="text-xl font-bold text-purple-600">
                                {formatMoney(costoTotal)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {errores.menu && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span>{errores.menu}</span>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">
                      🎉 Servicios Adicionales (Opcionales)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {serviciosSeleccionados.map((servicio, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-purple-300 transition-all"
                        >
                          <input
                            type="checkbox"
                            name="servicios_adicionales"
                            value={servicio.nombre}
                            checked={form.servicios_adicionales.includes(servicio.nombre)}
                            onChange={handleChange}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Alergias o Restricciones Alimentarias
                      </label>
                      <textarea
                        name="alergias"
                        value={form.alergias}
                        onChange={handleChange}
                        rows="2"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                        placeholder="Ej: Sin gluten, vegetariano, alergia a mariscos..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Instrucciones Especiales de Entrega
                      </label>
                      <textarea
                        name="instrucciones_entrega"
                        value={form.instrucciones_entrega}
                        onChange={handleChange}
                        rows="2"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                        placeholder="Ej: Entrega por entrada lateral, contactar al llegar..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notas Adicionales
                      </label>
                      <textarea
                        name="notas"
                        value={form.notas}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                        placeholder="Cualquier detalle adicional..."
                      />
                    </div>
                  </div>

                  {form.menu_seleccionado && (
                    <div className="sticky top-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 border-2 border-purple-300 shadow-xl">
                      <h3 className="font-bold text-xl mb-4 text-purple-900 text-center">
                        💰 Servicio Escogido
                      </h3>

                      <div className="bg-white rounded-xl p-4 space-y-2 mb-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">Evento:</span>
                          <span className="text-sm font-bold text-purple-600">{form.tipo}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">Invitados:</span>
                          <span className="text-sm font-bold text-purple-600">
                            {form.personas} personas
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">
                            Menú: {form.menu_seleccionado.nombre}
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            {formatMoney(costoMenu)}
                          </span>
                        </div>

                        {totalExtras > 0 && (
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Servicios adicionales</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {formatMoney(totalExtras)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Subtotal catering</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {formatMoney(subtotalSinFee)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Fee de gestión (13%)</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {formatMoney(feeGestion)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Tax IVU (11.5%)</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {formatMoney(taxAmount)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {formatMoney(totalFinal)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`text-center p-3 rounded-xl ${
                          creditoDespues >= 0 ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <p className="text-sm text-gray-700 mb-1">
                          Crédito disponible: <b>{walletLoading ? "..." : formatMoney(creditoDisponible)}</b>
                        </p>
                        <p className="text-sm text-gray-700 mb-1">Crédito después de este evento:</p>
                        <p
                          className={`text-2xl font-bold ${
                            creditoDespues >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatMoney(Math.abs(creditoDespues))}{" "}
                          {creditoDespues < 0 && "(Fondos Insuficientes)"}
                        </p>

                        {creditoDespues < 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm text-red-700 font-semibold">
                              Necesitas {formatMoney(Math.abs(creditoDespues))} adicionales
                            </p>
                            <button
                              type="button"
                              onClick={() => navigate("/perfil")}
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
                    <button
                      type="button"
                      onClick={() => goBack(1)}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
                    >
                      ← Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => goNext(3)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl disabled:opacity-50"
                      disabled={!form.menu_seleccionado}
                    >
                      Continuar →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Método de Pago
                  </h2>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-green-600" />
                        <span className="font-bold text-lg text-gray-800">Opciones de Pago</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total a pagar:</p>
                        <p className="text-2xl font-bold text-green-600">{formatMoney(totalFinal)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {["Tarjeta de crédito", "ATH Móvil"].map((metodo) => (
                        <label
                          key={metodo}
                          className={`flex items-center gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${
                            form.metodo_pago === metodo
                              ? "border-green-500 ring-2 ring-green-200"
                              : "border-gray-200 hover:border-green-400"
                          }`}
                        >
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

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      <h3 className="font-bold text-xl text-gray-800">Plan de Pagos Flexible</h3>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        ¿En cuántos pagos deseas dividir tu compra?
                      </label>

                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, cuotas: n }))}
                            className={`p-4 rounded-xl border-2 font-bold transition-all ${
                              Number(form.cuotas) === n
                                ? "bg-purple-500 text-white border-purple-600 shadow-lg scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:shadow-md"
                            }`}
                          >
                            <div className="text-2xl">{n}</div>
                            <div className="text-xs mt-1">{n === 1 ? "pago" : "cuotas"}</div>
                          </button>
                        ))}
                      </div>

                      <select
                        name="cuotas"
                        value={form.cuotas}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-gray-800 cursor-pointer hover:border-purple-400 transition-all bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n}{" "}
                            {n === 1
                              ? "pago único (completo ahora)"
                              : `cuotas mensuales de ${formatMoney(totalFinal / n)}`}
                          </option>
                        ))}
                      </select>

                      <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        💡 Sin intereses ni cargos adicionales • 0% APR
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 space-y-3 shadow-inner">
                      <div className="text-center mb-3">
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
                          Tu Plan Seleccionado
                        </p>
                        <p className="text-3xl font-bold text-purple-600 mt-1">
                          {cuotasSeleccionadas} {cuotasSeleccionadas === 1 ? "Pago" : "Cuotas"}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          Pago inicial (25%)
                        </span>
                        <span className="text-lg font-bold text-purple-600">
                          {formatMoney(pagoInicial)}
                        </span>
                      </div>

                      {cuotasSeleccionadas > 1 ? (
                        <>
                          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Balance restante</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {formatMoney(balanceRestante)}
                            </span>
                          </div>

                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs text-gray-600">Cuota mensual</p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {cuotasSeleccionadas - 1} pago{cuotasSeleccionadas - 1 > 1 ? "s" : ""} de:
                                </p>
                              </div>
                              <span className="text-2xl font-bold text-purple-600">
                                {formatMoney(cuotaMensual)}
                              </span>
                            </div>
                          </div>

                          <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">
                              📅 Próximo pago: <span className="font-semibold">{nextMonthLabel()}</span>
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Pagarás el monto completo hoy
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">📋 Resumen de tu Pago</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total del evento</span>
                        <span className="text-sm font-semibold text-gray-800">{formatMoney(totalFinal)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Método de pago</span>
                        <span className="text-sm font-semibold text-gray-800">{form.metodo_pago}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="text-sm font-bold text-gray-700">Pagarás hoy</span>
                        <span className="text-xl font-bold text-blue-600">{formatMoney(pagoInicial)}</span>
                      </div>

                      {cuotasSeleccionadas > 1 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Pagos mensuales restantes</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {cuotasSeleccionadas - 1}x {formatMoney(cuotaMensual)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="text-sm text-gray-600">Crédito disponible</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {walletLoading ? "..." : formatMoney(creditoDisponible)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Crédito después</span>
                        <span
                          className={`text-sm font-bold ${
                            creditoDespues >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatMoney(Math.abs(creditoDespues))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => goBack(2)}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
                    >
                      ← Atrás
                    </button>

                    <div className="relative group">
                      <button
                        type="submit"
                        disabled={loading || creditoDespues < 0 || walletLoading}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg font-semibold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                      >
                        {walletLoading ? (
                          <>
                            Cargando wallet... <CheckCircle className="w-5 h-5 animate-spin" />
                          </>
                        ) : loading ? (
                          <>
                            Procesando... <CheckCircle className="w-5 h-5 animate-spin" />
                          </>
                        ) : creditoDespues < 0 ? (
                          <>
                            Crédito Insuficiente <AlertCircle className="w-5 h-5" />
                          </>
                        ) : (
                          <>
                            Confirmar Reservación <CheckCircle className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      {creditoDespues < 0 && (
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
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
                  <div>
                    <span className="font-semibold text-gray-700">Cliente:</span>{" "}
                    <span className="text-gray-600">{form.nombre}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email:</span>{" "}
                    <span className="text-gray-600">{form.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Tipo de Evento:</span>{" "}
                    <span className="text-gray-600">{form.tipo}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Fecha:</span>{" "}
                    <span className="text-gray-600">
                      {form.fecha} a las {form.hora}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Invitados:</span>{" "}
                    <span className="text-gray-600">{form.personas} personas</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Menú:</span>{" "}
                    <span className="text-gray-600">{form.menu_seleccionado?.nombre}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-semibold text-gray-700">Ubicación:</span>{" "}
                    <span className="text-gray-600">{form.direccion}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total pagado:</span>
                    <span className="text-xl font-bold text-green-600">{formatMoney(totalFinal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Crédito restante (wallet):</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatMoney(Number(walletBalance ?? 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={generarPDF}
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold"
              >
                <Download className="w-5 h-5" /> Descargar PDF
              </button>

              <button
                onClick={() => navigate("/catering")}
                type="button"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
              >
                Volver al Inicio
              </button>

              <button
                onClick={resetForm}
                type="button"
                className="px-6 py-3 border-2 border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 font-semibold"
              >
                Crear otra solicitud
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
