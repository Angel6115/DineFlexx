import React, { useState, useEffect, useRef } from "react";
import supabase from "../../supabaseClient";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

// Tipos de catering y sus menús asociados
const tiposDeCatering = {
  "Cumpleaños": {
    servicios: [
      { nombre: "Decoración especial", precio: 150 },
      { nombre: "Postres personalizados", precio: 180 },
    ],
    menu: [
      { nombre: "Menú Básico", precio: 25, descripcion: "Hamburguesas, hot dogs, ensalada y bebidas" },
      { nombre: "Menú Premium", precio: 40, descripcion: "Pasta, carnes, ensaladas gourmet y postres" }
    ]
  },
  "Corporativo": {
    servicios: [
      { nombre: "Música / DJ", precio: 200 },
      { nombre: "Servicio de meseros", precio: 100 },
    ],
    menu: [
      { nombre: "Desayuno Ejecutivo", precio: 20, descripcion: "Frutas, panes, huevos y café" },
      { nombre: "Almuerzo de Negocios", precio: 35, descripcion: "Plato principal, ensalada, postre y bebidas" }
    ]
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
    ]
  }
};

const creditoInicial = 1500;

export default function CateringSolicitudForm() {
  const navigate = useNavigate();
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
  });

  const [errores, setErrores] = useState({});
  const [creditoTotal, setCreditoTotal] = useState(creditoInicial);
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const direccionInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Cargar API de Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCcotv_0G8ETQb-7i25p36Ean0aOOrquOs&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    script.onerror = () => {
      console.error("Error al cargar Google Maps API");
      setGoogleLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Inicializar autocomplete cuando Google Maps esté cargado
  useEffect(() => {
    if (!googleLoaded || !direccionInputRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        direccionInputRef.current,
        { types: ["address"], componentRestrictions: { country: "us" } }
      );

      autocompleteRef.current.setFields(["formatted_address"]);
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          setForm(prev => ({ ...prev, direccion: place.formatted_address }));
        }
      });
    } catch (error) {
      console.error("Error al inicializar autocomplete:", error);
    }
  }, [googleLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "servicios_adicionales") {
      let nuevosServicios = [...form.servicios_adicionales];
      if (checked) {
        nuevosServicios.push(value);
      } else {
        nuevosServicios = nuevosServicios.filter(s => s !== value);
      }
      setForm({ ...form, servicios_adicionales: nuevosServicios });
    } else {
      setForm({ ...form, [name]: type === "number" ? Number(value) : value });
    }
  };

  const handleMenuChange = (menuItem) => {
    setForm(prev => ({ ...prev, menu_seleccionado: menuItem }));
  };

  const validarFormulario = () => {
    const erroresVal = {};
    const hoy = new Date().toISOString().split("T")[0];

    if (!form.nombre.trim()) erroresVal.nombre = "Nombre requerido";
    if (!form.email.includes("@")) erroresVal.email = "Correo inválido";
    if (!form.telefono || form.telefono.length < 10) erroresVal.telefono = "Teléfono inválido";
    if (!form.tipo) erroresVal.tipo = "Tipo de evento requerido";
    if (!form.direccion.trim()) erroresVal.direccion = "Dirección requerida";
    if (!form.fecha) erroresVal.fecha = "Fecha requerida";
    else if (form.fecha < hoy) erroresVal.fecha = "Fecha inválida";
    if (!form.hora) erroresVal.hora = "Hora requerida";
    if (!form.personas || form.personas < 1) erroresVal.personas = "Debe tener al menos 1 persona";
    if (!form.metodo_pago) erroresVal.metodo_pago = "Método de pago requerido";
    if (!form.cuotas || form.cuotas < 1 || form.cuotas > 6) erroresVal.cuotas = "Cuotas entre 1 y 6";
    if (!form.menu_seleccionado) erroresVal.menu = "Debe seleccionar un menú";

    return erroresVal;
  };

  // Calcular totales
  const serviciosSeleccionados = form.tipo && tiposDeCatering[form.tipo]?.servicios || [];
  const totalExtras = serviciosSeleccionados
    .filter(s => form.servicios_adicionales.includes(s.nombre))
    .reduce((total, servicio) => total + servicio.precio, 0);

  const costoMenu = form.menu_seleccionado ? form.menu_seleccionado.precio * (form.personas || 0) : 0;
  const totalGeneral = costoMenu + totalExtras;
  const creditoRestante = creditoTotal - totalGeneral;

  // Plan de pagos
  const MAX_CUOTAS = 6;
  const cuotasSeleccionadas = Math.min(form.cuotas || 1, MAX_CUOTAS);
  const cuotaInicialPorcentaje = 0.25;
  const cuotaInicial = totalGeneral * cuotaInicialPorcentaje;
  const restoPorPagar = totalGeneral - cuotaInicial;
  const cuotaMensual = cuotasSeleccionadas > 1 ? restoPorPagar / (cuotasSeleccionadas - 1) : 0;

  const formatearHora = (hora) => {
    if (!hora) return null;
    return hora.length === 5 ? hora + ":00" : hora;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erroresVal = validarFormulario();
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal);
      return;
    } else {
      setErrores({});
    }

    if (creditoRestante < 0) {
      alert("No tienes suficiente crédito disponible para esta solicitud.");
      return;
    }

    setLoading(true);
    const usuario_id = "4d7c5276-9a75-4af4-9db6-36c5320f8806";

    // Preparar datos para Supabase - ajustado a tu esquema
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
      total_extras: totalExtras,
      total_general: totalGeneral,
      credito_restante: creditoRestante,
      precio_base: costoMenu,
      usuario_id: usuario_id,
      mensaje_restaurante: form.menu_seleccionado 
        ? `Menú seleccionado: ${form.menu_seleccionado.nombre} ($${form.menu_seleccionado.precio} por persona)\n${form.notas}`
        : form.notas,
      evento: form.tipo
    };

    try {
      const { data, error } = await supabase
        .from("solicitudes_catering")
        .insert([payload])
        .select();

      if (error) {
        console.error("Error al insertar en Supabase:", error);
        alert(`Error al enviar la solicitud: ${error.message}`);
        setLoading(false);
        return;
      }

      // Actualizar crédito del usuario
      const { error: updateError } = await supabase
        .from("usuarios")
        .update({ credito: creditoRestante })
        .eq("id", usuario_id);

      if (updateError) {
        console.error("Error al actualizar crédito:", updateError);
      }

      setLoading(false);
      setConfirmado(true);
      setMostrarResumen(true);
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Error inesperado al enviar la solicitud");
      setLoading(false);
    }
  };

  // Función para cargar imágenes en base64
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error("Error al cargar la imagen"));
      img.src = url;
    });
  };

  const generarPDF = async () => {
    const doc = new jsPDF();
    
    // Configuración inicial
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = 20;
    
    // Función para agregar texto con manejo de páginas
    const addText = (text, x, y, options = {}) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Si el contenido se sale de la página, agregamos una nueva
      if (y > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
        y = currentY;
        
        // Encabezado en cada nueva página
        doc.setFontSize(12);
        doc.text(`Resumen de Catering - Página ${doc.internal.getNumberOfPages()}`, pageWidth / 2, 10, { align: 'center' });
      }
      
      doc.text(text, x, y, options);
      currentY = y + 7; // Espaciado entre líneas
      return currentY;
    };

    try {
      // Cargar logo
      const logoUrl = '/images/dlogo1.png';
      const imgData = await loadImage(logoUrl);
      
      // Tamaño del logo
      const logoWidth = 50;
      const logoHeight = 30;
      const logoX = (pageWidth - logoWidth) / 2;
      
      // Agregar logo
      doc.addImage(imgData, 'PNG', logoX, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 15;

      // Encabezado
      doc.setFontSize(18);
      currentY = addText("Resumen de Solicitud de Catering", pageWidth / 2, currentY, { align: 'center' });
      doc.setFontSize(12);
      currentY = addText(`Fecha de generación: ${new Date().toLocaleDateString()}`, margin, currentY);

      // Información del cliente
      doc.setFontSize(14);
      currentY = addText("Información del Cliente", margin, currentY);
      doc.setFontSize(12);
      currentY = addText(`Nombre: ${form.nombre}`, margin, currentY);
      currentY = addText(`Email: ${form.email}`, margin, currentY);
      currentY = addText(`Teléfono: ${form.telefono}`, margin, currentY);
      
      // Detalles del evento
      doc.setFontSize(14);
      currentY = addText("Detalles del Evento", margin, currentY);
      doc.setFontSize(12);
      currentY = addText(`Tipo: ${form.tipo}`, margin, currentY);
      currentY = addText(`Fecha: ${form.fecha}`, margin, currentY);
      currentY = addText(`Hora: ${form.hora}`, margin, currentY);
      currentY = addText(`Personas: ${form.personas}`, margin, currentY);
      currentY = addText(`Dirección: ${form.direccion}`, margin, currentY);
      
      // Menú seleccionado
      if (form.menu_seleccionado) {
        doc.setFontSize(14);
        currentY = addText("Menú Seleccionado", margin, currentY);
        doc.setFontSize(12);
        currentY = addText(`${form.menu_seleccionado.nombre} - $${form.menu_seleccionado.precio} por persona`, margin, currentY);
        
        // Manejo de descripción larga
        const descLines = doc.splitTextToSize(form.menu_seleccionado.descripcion, pageWidth - 2 * margin);
        descLines.forEach(line => {
          currentY = addText(line, margin, currentY);
        });
        
        currentY = addText(`Total menú: $${costoMenu.toFixed(2)}`, margin, currentY);
      }
      
      // Servicios adicionales
      doc.setFontSize(14);
      currentY = addText("Servicios Adicionales", margin, currentY);
      doc.setFontSize(12);
      if (form.servicios_adicionales.length > 0) {
        form.servicios_adicionales.forEach((servicio) => {
          const precio = serviciosSeleccionados.find(s => s.nombre === servicio)?.precio || 0;
          currentY = addText(`• ${servicio} - $${precio.toFixed(2)}`, margin, currentY);
        });
      } else {
        currentY = addText("Ningún servicio adicional seleccionado", margin, currentY);
      }
      
      // Línea divisoria
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;
      
      // Resumen financiero
      doc.setFontSize(14);
      currentY = addText("Resumen Financiero", margin, currentY);
      doc.setFontSize(12);
      currentY = addText(`Total servicios adicionales: $${totalExtras.toFixed(2)}`, margin, currentY);
      currentY = addText(`Total general: $${totalGeneral.toFixed(2)}`, margin, currentY);
      currentY = addText(`Método de pago: ${form.metodo_pago}`, margin, currentY);
      currentY = addText(`Cuotas: ${cuotasSeleccionadas}`, margin, currentY);
      
      // Línea divisoria
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;
      
      // Plan de pagos
      doc.setFontSize(14);
      currentY = addText("Plan de Pagos", margin, currentY);
      doc.setFontSize(12);
      currentY = addText(`Cuota inicial (25%): $${cuotaInicial.toFixed(2)}`, margin, currentY);
      if (cuotasSeleccionadas > 1) {
        currentY = addText(`Cuotas mensuales (${cuotasSeleccionadas - 1}x): $${cuotaMensual.toFixed(2)}`, margin, currentY);
      }
      
      doc.save("resumen_catering.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el PDF. Por favor intente nuevamente.");
    }
  };

  // Estilos
  const containerStyle = {
    maxWidth: "550px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px"
  };

  const labelStyle = { 
    fontWeight: "bold", 
    marginBottom: "5px", 
    display: "block",
    fontSize: "14px"
  };

  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px"
  };

  const errorText = (campo) => errores[campo] && (
    <p style={{ color: "red", fontSize: "12px", marginTop: "-10px", marginBottom: "15px" }}>
      {errores[campo]}
    </p>
  );

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "20px" }}>
        Solicitud de Servicio de Catering
      </h2>
      
      {!confirmado ? (
        <form onSubmit={handleSubmit}>
          {/* Campos del formulario */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Nombre completo *</label>
            <input 
              type="text" 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="Ingrese su nombre completo"
            />
            {errorText("nombre")}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Correo electrónico *</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="ejemplo@correo.com"
            />
            {errorText("email")}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Teléfono *</label>
            <input 
              type="tel" 
              name="telefono" 
              value={form.telefono} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="123-456-7890"
            />
            {errorText("telefono")}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Tipo de evento *</label>
            <select 
              name="tipo" 
              value={form.tipo} 
              onChange={handleChange} 
              style={inputStyle}
            >
              <option value="">Seleccione un tipo de evento</option>
              {Object.keys(tiposDeCatering).map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            {errorText("tipo")}
          </div>

          {form.tipo && (
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Seleccione un menú *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                {tiposDeCatering[form.tipo].menu.map(item => (
                  <div 
                    key={item.nombre}
                    style={{ 
                      border: form.menu_seleccionado?.nombre === item.nombre ? "2px solid #4CAF50" : "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "15px",
                      cursor: "pointer",
                      backgroundColor: form.menu_seleccionado?.nombre === item.nombre ? "#f0fff4" : "#fff"
                    }}
                    onClick={() => handleMenuChange(item)}
                  >
                    <h4 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>
                      {item.nombre} - ${item.precio} por persona
                    </h4>
                    <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                      {item.descripcion}
                    </p>
                  </div>
                ))}
              </div>
              {errorText("menu")}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Dirección del evento *</label>
            <input 
              type="text" 
              name="direccion" 
              ref={direccionInputRef} 
              value={form.direccion} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="Ingrese la dirección del evento"
            />
            {errorText("direccion")}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Fecha del evento *</label>
              <input 
                type="date" 
                name="fecha" 
                value={form.fecha} 
                onChange={handleChange} 
                style={inputStyle} 
              />
              {errorText("fecha")}
            </div>
            <div>
              <label style={labelStyle}>Hora del evento *</label>
              <input 
                type="time" 
                name="hora" 
                value={form.hora} 
                onChange={handleChange} 
                style={inputStyle} 
              />
              {errorText("hora")}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Número de personas *</label>
            <input 
              type="number" 
              name="personas" 
              value={form.personas} 
              onChange={handleChange} 
              style={inputStyle} 
              min="1"
              placeholder="Ej: 50"
            />
            {errorText("personas")}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Método de pago *</label>
            <select 
              name="metodo_pago" 
              value={form.metodo_pago} 
              onChange={handleChange} 
              style={inputStyle}
            >
              <option value="Tarjeta de crédito">Tarjeta de crédito</option>
              <option value="Cheque">Cheque</option>
              <option value="Efectivo">Efectivo</option>
              <option value="ATH Móvil">ATH Móvil</option>
            </select>
            {errorText("metodo_pago")}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Número de cuotas (1-6) *</label>
            <input 
              type="number" 
              name="cuotas" 
              value={form.cuotas} 
              onChange={handleChange} 
              style={inputStyle} 
              min="1" 
              max="6"
            />
            {errorText("cuotas")}
          </div>

          {form.tipo && (
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Servicios adicionales</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "5px" }}>
                {tiposDeCatering[form.tipo].servicios.map(({ nombre, precio }) => (
                  <label 
                    key={nombre} 
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      type="checkbox"
                      name="servicios_adicionales"
                      value={nombre}
                      checked={form.servicios_adicionales.includes(nombre)}
                      onChange={handleChange}
                    />
                    {nombre} (${precio})
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Notas o instrucciones especiales</label>
            <textarea 
              name="notas" 
              value={form.notas} 
              onChange={handleChange} 
              rows={4} 
              style={{ ...inputStyle, minHeight: "80px" }} 
              placeholder="Indique cualquier requerimiento especial..."
            />
          </div>

          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "15px", 
            borderRadius: "4px", 
            marginBottom: "20px",
            border: "1px solid #eee"
          }}>
            <h3 style={{ marginTop: "0", color: "#2c3e50" }}>Resumen Financiero</h3>
            
            {form.menu_seleccionado && (
              <p style={{ margin: "5px 0" }}>
                <strong>Menú:</strong> {form.menu_seleccionado.nombre} ({form.personas || 0} personas) - 
                <strong> ${costoMenu.toFixed(2)}</strong>
              </p>
            )}
            
            {totalExtras > 0 && (
              <p style={{ margin: "5px 0" }}>
                <strong>Servicios adicionales:</strong> ${totalExtras.toFixed(2)}
              </p>
            )}
            
            <p style={{ margin: "5px 0", fontSize: "18px" }}>
              <strong>Total general:</strong> ${totalGeneral.toFixed(2)}
            </p>
            
            <p style={{ margin: "5px 0" }}>
              <strong>Crédito restante:</strong> 
              <span style={{ color: creditoRestante < 0 ? "red" : "green" }}>
                ${creditoRestante.toFixed(2)}
              </span>
            </p>
            
            <h4 style={{ margin: "15px 0 5px 0", color: "#2c3e50" }}>Plan de Pagos:</h4>
            <p style={{ margin: "5px 0" }}>
              <strong>Cuota inicial (25%):</strong> ${cuotaInicial.toFixed(2)}
            </p>
            {cuotasSeleccionadas > 1 && (
              <p style={{ margin: "5px 0" }}>
                <strong>Cuotas mensuales ({cuotasSeleccionadas - 1}x):</strong> ${cuotaMensual.toFixed(2)}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              type="submit"
              disabled={loading || creditoRestante < 0}
              style={{
                ...buttonStyle,
                backgroundColor: loading || creditoRestante < 0 ? "#95a5a6" : "#4CAF50",
                flex: 1
              }}
            >
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "30px 20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #eee"
        }}>
          <h3 style={{ color: "#4CAF50", marginTop: "0" }}>
            ¡Solicitud enviada exitosamente!
          </h3>
          
          {mostrarResumen && (
            <div style={{ 
              margin: "20px 0", 
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              textAlign: "left"
            }}>
              <h3 style={{ color: "#2c3e50" }}>Resumen de tu Solicitud</h3>
              
              <p><strong>Nombre:</strong> {form.nombre}</p>
              <p><strong>Evento:</strong> {form.tipo}</p>
              <p><strong>Fecha:</strong> {form.fecha} a las {form.hora}</p>
              <p><strong>Personas:</strong> {form.personas}</p>
              <p><strong>Dirección:</strong> {form.direccion}</p>
              
              {form.menu_seleccionado && (
                <div style={{ margin: "15px 0" }}>
                  <h4 style={{ marginBottom: "5px" }}>Menú Seleccionado</h4>
                  <p><strong>{form.menu_seleccionado.nombre}:</strong> ${form.menu_seleccionado.precio} por persona</p>
                  <p><em>{form.menu_seleccionado.descripcion}</em></p>
                  <p><strong>Total menú:</strong> ${costoMenu.toFixed(2)}</p>
                </div>
              )}
              
              {form.servicios_adicionales.length > 0 && (
                <div style={{ margin: "15px 0" }}>
                  <h4 style={{ marginBottom: "5px" }}>Servicios Adicionales</h4>
                  <ul style={{ paddingLeft: "20px" }}>
                    {form.servicios_adicionales.map(servicio => {
                      const precio = serviciosSeleccionados.find(s => s.nombre === servicio)?.precio || 0;
                      return <li key={servicio}>{servicio} - ${precio.toFixed(2)}</li>;
                    })}
                  </ul>
                  <p><strong>Total servicios:</strong> ${totalExtras.toFixed(2)}</p>
                </div>
              )}
              
              <div style={{ margin: "15px 0" }}>
                <h4 style={{ marginBottom: "5px" }}>Resumen Financiero</h4>
                <p><strong>Total general:</strong> ${totalGeneral.toFixed(2)}</p>
                <p><strong>Método de pago:</strong> {form.metodo_pago}</p>
                <p><strong>Cuotas:</strong> {cuotasSeleccionadas}</p>
                <p><strong>Cuota inicial (25%):</strong> ${cuotaInicial.toFixed(2)}</p>
                {cuotasSeleccionadas > 1 && (
                  <p><strong>Cuotas mensuales ({cuotasSeleccionadas - 1}x):</strong> ${cuotaMensual.toFixed(2)}</p>
                )}
                <p style={{ color: creditoRestante < 0 ? "red" : "green" }}>
                  <strong>Crédito restante:</strong> ${creditoRestante.toFixed(2)}
                </p>
              </div>
            </div>
          )}
          
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px" }}>
            <button
              onClick={generarPDF}
              style={{
                ...buttonStyle,
                backgroundColor: "#3498db",
                width: "auto"
              }}
            >
              Descargar PDF
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                ...buttonStyle,
                backgroundColor: "#7f8c8d",
                width: "auto"
              }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}