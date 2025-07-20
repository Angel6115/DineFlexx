import React from "react";
import jsPDF from "jspdf";

export default function CateringResumen({ solicitud }) {
  const generarPDF = () => {
    const doc = new jsPDF();

    // Ruta relativa al logo en carpeta public/images
    const logoPath = "/images/dlog1.png";

    // Función para convertir imagen a base64 usando canvas
    const cargarImagenBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Para evitar problemas CORS
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    cargarImagenBase64(logoPath)
      .then((imgData) => {
        // Insertar logo tamaño 90x30 mm
        doc.addImage(imgData, "PNG", 15, 10, 90, 30);

        // Título
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Solicitud para Catering Corporativo", 15, 50);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        let currentY = 60;
        const lineHeight = 10;

        // Función para escribir etiqueta y valor
        const agregarTexto = (label, valor) => {
          doc.setFont("helvetica", "bold");
          doc.text(`${label}:`, 15, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(`${valor}`, 60, currentY);
          currentY += lineHeight;
        };

        agregarTexto("Nombre", solicitud.nombre);
        agregarTexto("Email", solicitud.email);
        agregarTexto("Teléfono", solicitud.telefono);
        agregarTexto("Evento", solicitud.evento);
        agregarTexto("Dirección", solicitud.direccion);
        agregarTexto("Fecha", solicitud.fecha);
        agregarTexto("Hora", solicitud.hora);
        agregarTexto("Número de invitados", solicitud.personas);
        agregarTexto("Método de pago", solicitud.metodo_pago);
        agregarTexto("Servicios adicionales", solicitud.servicios_adicionales || "Ninguno");
        agregarTexto("Precio base", `$${solicitud.precio_base.toFixed(2)}`);
        agregarTexto("Total extras", `$${solicitud.total_extras.toFixed(2)}`);
        agregarTexto("Total general", `$${solicitud.total_general.toFixed(2)}`);
        agregarTexto("Crédito restante", `$${solicitud.credito_restante.toFixed(2)}`);
        agregarTexto("Cuotas", solicitud.cuotas);

        // Línea divisoria
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(15, currentY, 195, currentY);
        currentY += 10;

        // Pie de página con fecha actual
        const fechaActual = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.text(`Generado el: ${fechaActual}`, 15, currentY);

        // Guardar PDF
        doc.save("solicitud_catering.pdf");
      })
      .catch((error) => {
        console.error("Error cargando el logo para el PDF:", error);
        alert("Error al cargar el logo para el PDF.");
      });
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <button
        onClick={generarPDF}
        style={{
          backgroundColor: "#1a73e8",
          color: "white",
          padding: "12px 20px",
          borderRadius: 6,
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: 20,
          fontSize: 16,
        }}
      >
        Generar PDF con Logo Mejorado
      </button>

      <div>
        <h3 style={{ borderBottom: "2px solid #1a73e8", paddingBottom: 8, marginBottom: 20 }}>
          Resumen de Solicitud
        </h3>
        <p><b>Nombre:</b> {solicitud.nombre}</p>
        <p><b>Email:</b> {solicitud.email}</p>
        <p><b>Teléfono:</b> {solicitud.telefono}</p>
        <p><b>Evento:</b> {solicitud.evento}</p>
        <p><b>Dirección:</b> {solicitud.direccion}</p>
        <p><b>Fecha:</b> {solicitud.fecha}</p>
        <p><b>Hora:</b> {solicitud.hora}</p>
        <p><b>Número de invitados:</b> {solicitud.personas}</p>
        <p><b>Método de pago:</b> {solicitud.metodo_pago}</p>
        <p><b>Servicios adicionales:</b> {solicitud.servicios_adicionales || "Ninguno"}</p>
        <p><b>Precio base:</b> ${solicitud.precio_base.toFixed(2)}</p>
        <p><b>Total extras:</b> ${solicitud.total_extras.toFixed(2)}</p>
        <p><b>Total general:</b> ${solicitud.total_general.toFixed(2)}</p>
        <p><b>Crédito restante:</b> ${solicitud.credito_restante.toFixed(2)}</p>
        <p><b>Cuotas:</b> {solicitud.cuotas}</p>
      </div>
    </div>
  );
}
