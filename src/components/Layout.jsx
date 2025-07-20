import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { ShoppingCart, Wallet, Menu } from "lucide-react";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { orden, credit } = useOrder();

  const itemCount = Array.isArray(orden) ? orden.length : 0;
  const formattedCredit = typeof credit === "number" ? credit.toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-all">
            🍽️ DineFlexx
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/restaurants" className="hover:text-blue-700">Restaurantes</Link>
            <Link to="/catering" className="hover:text-blue-700">Catering</Link>
            <Link to="/dashboard" className="hover:text-blue-700">Dashboard</Link>
            <Link to="/perfil" className="hover:text-blue-700">Perfil</Link>
            <Link to="/wallet" className="hover:text-blue-700">Wallet</Link>
            <Link to="/soporte" className="hover:text-blue-700">Soporte</Link>
          </nav>

          {/* Crédito y carrito */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full shadow-sm">
              <Wallet className="w-4 h-4 mr-2 text-green-600" />
              ${formattedCredit}
            </div>
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-700 transition">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden ml-2 text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-2">
            <Link to="/restaurants" className="block text-sm text-gray-700 hover:text-blue-700">Restaurantes</Link>
            <Link to="/catering" className="block text-sm text-gray-700 hover:text-blue-700">Catering</Link>
            <Link to="/dashboard" className="block text-sm text-gray-700 hover:text-blue-700">Dashboard</Link>
            <Link to="/perfil" className="block text-sm text-gray-700 hover:text-blue-700">Perfil</Link>
            <Link to="/wallet" className="block text-sm text-gray-700 hover:text-blue-700">Wallet</Link>
            <Link to="/soporte" className="block text-sm text-gray-700 hover:text-blue-700">Soporte</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
