import React from 'react';
import { useCarrito } from '../context/CarritoContext';

export default function Checkout() {
  const { carrito, eliminarDelCarrito } = useCarrito();

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#c08942] mb-6 text-center">Resumen del Pedido</h1>

      {carrito.length === 0 ? (
        <p className="text-center text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white shadow p-4 rounded-xl border border-gray-200"
            >
              <div>
                <h2 className="font-semibold text-gray-800">{item.nombre}</h2>
                <p className="text-sm text-gray-500">${item.precio.toFixed(2)}</p>
              </div>
              <button
                onClick={() => eliminarDelCarrito(index)}
                className="text-sm text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 border-t mt-6">
            <span className="font-bold text-xl text-gray-700">Total:</span>
            <span className="text-xl text-amber-600 font-bold">${total.toFixed(2)}</span>
          </div>

          <div className="text-center mt-6">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition">
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
