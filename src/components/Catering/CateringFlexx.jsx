// src/components/Catering/CateringFlexx.jsx

import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import CateringDetalle from "./CateringDetalle"; // ✅ Importación correcta

const CateringFlexx = () => {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      const { data, error } = await supabase
        .from("catering_services")
        .select("*");

      if (error) {
        console.error("Error al cargar servicios:", error.message);
      } else {
        setServicios(data);
      }
    };

    fetchServicios();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 md:px-20 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        Servicios de Catering
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servicios.map((servicio) => (
          <Card key={servicio.id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <img
                src={servicio.image_url || "/images/default-catering.jpg"}
                alt={servicio.title}
                className="w-full aspect-[4/3] object-cover rounded"
              />
              <h2 className="text-xl font-semibold text-blue-800">
                {servicio.title}
              </h2>
              <p className="text-sm text-gray-600">{servicio.description}</p>
              <p className="text-green-700 font-semibold">
                Desde ${servicio.price}
              </p>
              <p className="text-sm text-gray-500">
                Hasta {servicio.max_installments} cuotas disponibles
              </p>

              {/* ✅ Aquí mostramos el menú detallado si existe */}
              <div className="mt-2">
                <CateringDetalle tipo={servicio.title} />
              </div>

              <Button
                className="w-full bg-blue-700 hover:bg-blue-800 text-white mt-2"
                onClick={() => navigate(`/catering/solicitar/${servicio.id}`)}
              >
                Solicitar este servicio
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {servicios.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hay servicios de catering disponibles en este momento.
        </p>
      )}
    </div>
  );
};

export default CateringFlexx;
