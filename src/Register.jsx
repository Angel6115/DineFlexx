// src/Register.jsx
import { useState } from "react";
import supabase from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: "" } },
    });
    if (error) {
      setError(error.message);
    } else {
      navigate("/restaurants");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </label>
        <label className="block mb-6">
          <span className="text-gray-700">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded"
        >
          Registrar
        </button>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Ingresar
          </Link>
        </p>
      </form>
    </div>
  );
}
