// src/components/Catering/CateringDetalle.jsx

import React from "react";

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
  },
};

export default function CateringDetalle({ tipo, esVIP }) {
  const menu = menus[tipo] || null;
  if (!menu) return null;

  return (
    <div
      style={{
        marginBottom: 24,
        padding: 20,
        backgroundColor: esVIP ? "#e0f7fa" : "#f9f9f9",
        borderRadius: 10,
        border: esVIP ? "2px solid #00796b" : "1px solid #ccc",
      }}
    >
      <h3 style={{ color: esVIP ? "#004d40" : "#333", marginBottom: 10 }}>
        {tipo} {esVIP && <span style={{ color: "#00796b" }}>· VIP</span>}
      </h3>
      <p style={{ marginBottom: 10 }}>{menu.descripcion}</p>
      <ul style={{ marginBottom: 10 }}>
        {menu.incluye.map((item, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            • {item}
          </li>
        ))}
      </ul>
      {esVIP && (
        <p style={{ color: "#00796b", fontWeight: "bold", marginTop: 15 }}>
          ¡Gracias por ser usuario VIP! Disfruta beneficios exclusivos.
        </p>
      )}
    </div>
  );
}
