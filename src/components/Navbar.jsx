import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import logo from '/images/logo/logo.jpg';

export default function Navbar() {
  const { carrito } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <nav className="bg-white shadow px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="DineFlexx Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold text-[#673ab7]">DineFlexx</h1>
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none text-2xl"
          >
            ☰
          </button>
        </div>

        <div className={`md:flex space-x-6 text-sm font-medium items-center ${menuAbierto ? 'block mt-4' : 'hidden'} md:mt-0 md:space-x-6 md:flex-row`}>  
          <Link to="/" className="block md:inline text-gray-700 hover:text-[#f4b400] transition py-2">Inicio</Link>
          <Link to="/menu" className="block md:inline text-gray-700 hover:text-[#f4b400] transition py-2">Menú</Link>
          <Link to="/perfil" className="block md:inline text-gray-700 hover:text-[#f4b400] transition py-2">Perfil</Link>
          <Link to="/checkout" className="relative block md:inline bg-[#f4b400] hover:bg-[#e4a500] px-4 py-2 rounded-full transition flex items-center space-x-2">
          <Link to="/soporte" className="block md:inline text-gray-700 hover:text-[#f4b400] transition py-2">
  Soporte
</Link>

            <span className="text-white">🍽️</span>
            <span className="text-white">Ver Pedido</span>
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {carrito.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
