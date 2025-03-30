import React from 'react';

export default function Soporte() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-[#fdfaf6] min-h-screen">
      <h1 className="text-3xl font-bold text-[#673ab7] mb-6 text-center">Soporte al Cliente</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-[#f4b400] mb-2">Preguntas Frecuentes</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <strong>¿Cómo puedo usar mi crédito en DineFlexx?</strong>
              <p>Puedes usar tu crédito aprobado al momento de confirmar tu pedido en el checkout.</p>
            </li>
            <li>
              <strong>¿Puedo compartir mi crédito?</strong>
              <p>Sí, desde tu perfil puedes compartir crédito con hasta 3 personas.</p>
            </li>
            <li>
              <strong>¿Dónde puedo ver mis puntos acumulados?</strong>
              <p>Están disponibles en la sección "Perfil".</p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f4b400] mb-2">¿Necesitás ayuda directa?</h2>
          <p className="text-gray-700">Podés escribirnos a <a href="mailto:soporte@dineflexx.com" className="text-[#673ab7] underline">soporte@dineflexx.com</a> o usar el botón abajo.</p>
          <button className="mt-4 bg-[#f4b400] hover:bg-[#e4a500] text-white font-semibold px-4 py-2 rounded-full">
            Contactar Soporte
          </button>
        </section>
      </div>
    </div>
  );
}
