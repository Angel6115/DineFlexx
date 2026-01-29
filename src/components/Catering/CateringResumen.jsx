// src/components/Catering/CateringResumen.jsx - COMPLETO
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import {
  Download,
  Users,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { Button } from "../ui/button";
import supabase from "../../supabaseClient";

const CateringResumen = () => {
  const [solicitudActual, setSolicitudActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      cargarSolicitud(id);
    } else {
      setError("No se proporcionó ID de solicitud");
      setLoading(false);
    }
  }, [searchParams]);

  const cargarSolicitud = async (id) => {
    try {
      const { data, error } = await supabase
        .from("solicitudes_catering")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Solicitud no encontrada");

      const fechaFormateada = data.fecha
        ? new Date(data.fecha).toLocaleDateString("es-PR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Por confirmar";

      const horaFormateada = data.hora
        ? data.hora.toString().slice(0, 5)
        : "Por confirmar";

      setSolicitudActual({
        ...data,
        fechaFormateada,
        horaFormateada,
        eventoTitulo: `${data.tipo || "Catering"}${
          data.evento ? ` - ${data.evento}` : ""
        }`,
        personas: data.personas || 0,
        cuotasTexto: data.cuotas
          ? `${data.cuotas} cuota${data.cuotas !== 1 ? "s" : ""} sin intereses`
          : "Pago único",
        precio_base: Number(data.precio_base || 0),
        total_extras: Number(data.total_extras || 0),
        subtotal_sin_fee: Number(data.subtotal_sin_fee || data.total_general || 0),
        fee_gestion: Number(data.fee_gestion || 0),
        subtotal_con_fee: Number(data.subtotal_con_fee || 0),
        tax_amount: Number(data.tax_amount || 0),
        total_final: Number(data.total_final || data.total_general || 0),
        credito_restante: Number(data.credito_restante || 0),
      });
    } catch (err) {
      console.error("Error cargando solicitud:", err);
      setError(err.message || "No se pudo cargar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    if (!solicitudActual) return;

    const s = solicitudActual;
    const doc = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = 297;
    const m = 12;
    const cw = w - m * 2;

    // ===== HEADER GRADIENTE =====
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, w, 28, "F");

    doc.setFillColor(147, 51, 234);
    doc.rect(0, 24, w, 4, "F");

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("SOLICITUD DE CATERING", w / 2, 16, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("DineFlexx Catering Services", w / 2, 22, { align: "center" });

    let y = 35;

    // ===== ROW 1: EVENTO + FECHA/HORA =====
    doc.setFillColor(240, 245, 255);
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.rect(m, y, cw / 2 - 3, 10, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("EVENTO", m + 3, y + 3);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(s.eventoTitulo, m + 3, y + 7.5);

    // FECHA/HORA BOX
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.rect(m + cw / 2 + 3, y, cw / 2 - 3, 10, "FD");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("FECHA | HORA", m + cw / 2 + 6, y + 3);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`${s.fechaFormateada} | ${s.horaFormateada}`, m + cw / 2 + 6, y + 7.5);

    y += 15;

    // ===== ROW 2: CLIENTE + FINANCIERO RÁPIDO =====
    
    // DATOS CLIENTE
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(m, y, cw / 2 - 3, 60, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("INFORMACIÓN", m + 3, y + 3);

    doc.setLineWidth(0.3);
    doc.line(m + 3, y + 4.5, m + cw / 2 - 6, y + 4.5);

    let yl = y + 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(64, 64, 64);

    const infoCliente = [
      ["Cliente", s.nombre],
      ["Email", s.email],
      ["Telefono", s.telefono],
      ["Invitados", `${s.personas} personas`],
      ["Tipo", s.tipo],
      ["Direccion", s.direccion],
      ["Alergias", s.alergias || "Ninguna"],
      ["Entrega", s.instrucciones_entrega || "N/A"],
    ];

    infoCliente.forEach(([label, valor], idx) => {
      if (yl > y + 58) return;

      if (idx % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(m + 1, yl - 2, cw / 2 - 5, 4, "F");
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(64, 64, 64);
      doc.text(label + ":", m + 3, yl + 1);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(String(valor).slice(0, 25), m + 28, yl + 1);

      yl += 4.5;
    });

    // FINANCIERO RÁPIDO
    doc.setFillColor(16, 185, 129);
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.rect(m + cw / 2 + 3, y, cw / 2 - 3, 60, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("RESUMEN FINANCIERO", m + cw / 2 + 6, y + 3);

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1);
    doc.line(m + cw / 2 + 6, y + 4.5, w - m - 6, y + 4.5);

    let yr = y + 8;
    const finanzasCortas = [
      ["Precio Base", s.precio_base],
      ["Extras", s.total_extras],
      ["Subtotal", s.subtotal_con_fee],
      ["Impuestos", s.tax_amount],
      ["TOTAL", s.total_final],
      ["Credito", s.credito_restante],
    ];

    doc.setFontSize(8);
    finanzasCortas.forEach(([label, valor], idx) => {
      if (yr > y + 58) return;

      doc.setFont("helvetica", idx === 4 ? "bold" : "normal");
      doc.setTextColor(255, 255, 255);
      doc.text(label, m + cw / 2 + 6, yr);

      const valortxt = `$${Number(valor).toLocaleString("es-PR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      doc.setFont("helvetica", idx === 4 ? "bold" : "normal");
      doc.text(valortxt, w - m - 9, yr, { align: "right" });

      yr += idx === 4 ? 5.5 : 4.5;
    });

    y += 65;

    // ===== ROW 3: DETALLES ADICIONALES =====
    doc.setFillColor(240, 245, 255);
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.rect(m, y, cw, 25, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("DETALLES ADICIONALES", m + 3, y + 3);

    doc.setLineWidth(0.3);
    doc.line(m + 3, y + 4.5, m + 50, y + 4.5);

    let yd = y + 7;
    doc.setFontSize(8);

    const detalles = [
      ["Notas", s.notas || "Sin notas"],
      ["Emergencia", s.contacto_emergencia ? `${s.contacto_emergencia} (${s.telefono_emergencia || "N/A"})` : "N/A"],
      ["Pago", `${s.metodo_pago || "Por definir"}`],
      ["Cuotas", s.cuotasTexto],
    ];

    detalles.forEach(([label, valor]) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(64, 64, 64);
      doc.text(label + ":", m + 3, yd);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const maxLen = String(valor).length > 35 ? String(valor).slice(0, 35) + "..." : valor;
      doc.text(String(maxLen), m + 28, yd);

      yd += 4.5;
    });

    y += 30;

    // ===== DESGLOSE FINANCIERO COMPLETO =====
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.rect(m, y, cw, 32, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("DESGLOSE FINANCIERO DETALLADO", m + 3, y + 3);

    doc.setLineWidth(0.3);
    doc.line(m + 3, y + 4.5, m + 80, y + 4.5);

    let yf = y + 7;
    doc.setFontSize(8);

    const finanzasDetalle = [
      ["Precio Base Menu", s.precio_base, false],
      ["Servicios Adicionales", s.total_extras, false],
      ["Subtotal sin Fee", s.subtotal_sin_fee, false],
      ["Fee de Gestion", s.fee_gestion, true],
      ["Subtotal con Fee", s.subtotal_con_fee, false],
      ["Impuestos (11.5%)", s.tax_amount, true],
    ];

    finanzasDetalle.forEach(([label, valor, isFee]) => {
      if (yf > y + 30) return;

      if (isFee) {
        doc.setFillColor(254, 243, 199);
        doc.rect(m + 1, yf - 2, cw - 2, 3.2, "F");
      }

      doc.setFont("helvetica", isFee ? "bold" : "normal");
      doc.setTextColor(64, 64, 64);
      doc.text(label, m + 3, yf + 0.8);

      const txtval = `$${Number(valor).toLocaleString("es-PR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      doc.setFont("helvetica", isFee ? "bold" : "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(txtval, w - m - 3, yf + 0.8, { align: "right" });

      yf += 4;
    });

    y += 36;

    // ===== TOTAL FINAL =====
    doc.setFillColor(16, 185, 129);
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.rect(m, y, cw, 7, "FD");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("TOTAL DEL EVENTO", m + 3, y + 4);

    const totaltxt = `$${Number(s.total_final).toLocaleString("es-PR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    doc.text(totaltxt, w - m - 3, y + 4, { align: "right" });

    // ===== FOOTER =====
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(m, 285, w - m, 285);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("DineFlexx", w / 2, 289, { align: "center" });

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Catering Services | Puerto Rico | catering@dineflexx.pr", w / 2, 293, { align: "center" });
    doc.text(`Generado: ${new Date().toLocaleDateString("es-PR")} | ID: #${s.id}`, w / 2, 296, { align: "center" });

    // SAVE
    const safeName = (s.nombre || "Cliente").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 15);
    const safeDate = (s.fecha || "").replace(/[^0-9-]/g, "");
    doc.save(`DineFlexx_${safeName}_${safeDate}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Cargando resumen...</p>
        </div>
      </div>
    );
  }

  if (error || !solicitudActual) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-12 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "No encontrada"}</p>
          <Button onClick={() => window.history.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const s = solicitudActual;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-xl bg-white/80 border border-slate-200 font-semibold text-slate-700 hover:bg-white shadow-sm"
          >
            ← Volver
          </button>
          <div className="text-right">
            <p className="text-sm text-slate-600">ID Solicitud</p>
            <p className="text-2xl font-black text-indigo-600">#{s.id}</p>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/70">
          
          {/* HEADER */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-bold text-slate-600 mb-1">EVENTO</p>
              <p className="text-2xl font-black text-slate-900">{s.eventoTitulo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-600 mb-1">TOTAL</p>
              <p className="text-2xl font-black text-emerald-600">
                ${Number(s.total_final).toLocaleString("es-PR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-600">INVITADOS</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{s.personas}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs font-bold text-blue-600">FECHA</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{s.fechaFormateada}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs font-bold text-amber-600">HORA</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{s.horaFormateada}</p>
            </div>
          </div>

          {/* INFO CLIENTE */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 mb-8 border border-slate-200">
            <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              INFORMACIÓN DEL CLIENTE
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-600">NOMBRE</p>
                <p className="text-lg font-bold text-slate-900">{s.nombre}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">EMAIL</p>
                <p className="text-sm font-bold text-slate-900">{s.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">TELÉFONO</p>
                <p className="text-sm font-bold text-slate-900">{s.telefono}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">TIPO DE EVENTO</p>
                <p className="text-sm font-bold text-slate-900">{s.tipo}</p>
              </div>
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-200">
            <h3 className="font-black text-lg text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              DIRECCIÓN DEL EVENTO
            </h3>
            <p className="text-slate-900 font-semibold">{s.direccion}</p>
          </div>

          {/* DETALLES ADICIONALES */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-600" />
                ALERGIAS/RESTRICCIONES
              </h4>
              <p className="text-slate-900 font-semibold">{s.alergias || "Ninguna"}</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                CONTACTO DE EMERGENCIA
              </h4>
              <p className="text-slate-900 font-semibold">
                {s.contacto_emergencia} ({s.telefono_emergencia || "N/A"})
              </p>
            </div>
          </div>

          {/* INSTRUCCIONES */}
          {s.instrucciones_entrega && (
            <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-200">
              <h4 className="font-black text-slate-900 mb-2">📋 INSTRUCCIONES DE ENTREGA</h4>
              <p className="text-slate-900">{s.instrucciones_entrega}</p>
            </div>
          )}

          {/* NOTAS */}
          {s.notas && (
            <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-200">
              <h4 className="font-black text-slate-900 mb-2">📝 NOTAS DEL CLIENTE</h4>
              <p className="text-slate-900">{s.notas}</p>
            </div>
          )}

          {/* RESUMEN FINANCIERO */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-200">
            <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              RESUMEN FINANCIERO
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-semibold text-slate-700">Precio Base Menu</span>
                <span className="font-bold text-slate-900">
                  ${Number(s.precio_base).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-semibold text-slate-700">Servicios Adicionales</span>
                <span className="font-bold text-slate-900">
                  ${Number(s.total_extras).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-semibold text-slate-700">Subtotal sin Fee</span>
                <span className="font-bold text-slate-900">
                  ${Number(s.subtotal_sin_fee).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-100 rounded-lg">
                <span className="font-semibold text-slate-700">Fee de Gestion</span>
                <span className="font-bold text-amber-900">
                  ${Number(s.fee_gestion).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-semibold text-slate-700">Subtotal con Fee</span>
                <span className="font-bold text-slate-900">
                  ${Number(s.subtotal_con_fee).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                <span className="font-semibold text-slate-700">Impuestos (11.5%)</span>
                <span className="font-bold text-green-900">
                  ${Number(s.tax_amount).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white">
              <span className="font-black text-lg">TOTAL DEL EVENTO</span>
              <span className="font-black text-2xl">
                ${Number(s.total_final).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* PLAN DE PAGO */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-200">
            <h3 className="font-black text-lg text-slate-900 mb-4">💳 PLAN DE PAGO</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="font-semibold text-slate-700">Método de Pago</span>
                <span className="font-bold text-slate-900">{s.metodo_pago || "Por definir"}</span>
              </div>
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="font-semibold text-slate-700">Cuotas</span>
                <span className="font-bold text-slate-900">{s.cuotasTexto}</span>
              </div>
            </div>
          </div>

          {/* CRÉDITO RESTANTE */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 shadow-lg">
            <p className="text-white/80 text-sm font-bold mb-2">CRÉDITO RESTANTE</p>
            <p className="text-white font-black text-3xl">
              ${Number(s.credito_restante).toLocaleString("es-PR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* BOTÓN DESCARGAR PDF */}
          <Button
            onClick={generarPDF}
            className="w-full px-8 py-6 text-lg font-black bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-xl flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            DESCARGAR PDF PROFESIONAL
          </Button>
          <p className="text-center text-xs text-slate-500 mt-3">
            ✓ Todo en una página • ✓ Todos los detalles • ✓ Diseño profesional
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CateringResumen;
