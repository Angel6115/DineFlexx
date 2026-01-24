// src/Register.jsx
import { useState } from "react";
import supabase from "./supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Gift } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Crear usuario
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: "" } },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // 2. Si hay código de referido, procesarlo
      if (referralCode.trim()) {
        const { error: refError } = await supabase.rpc('process_referral_signup', {
          p_referred_email: email,
          p_referral_code: referralCode.toUpperCase().trim(),
        });

        if (refError) {
          console.error('Error procesando referido:', refError);
          // No bloqueamos el registro si falla el referido
        }
      }

      // 3. Redirigir
      navigate("/restaurants");
    } catch (err) {
      console.error(err);
      setError('Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <UserPlus className="text-green-600" size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">Crear cuenta</h2>
        <p className="text-gray-600 text-center mb-6">
          Únete y empieza a disfrutar beneficios
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </label>

        <label className="block mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="text-purple-600" size={18} />
            <span className="text-gray-700 font-medium">Código de Referido (Opcional)</span>
          </div>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
            placeholder="Ej: ABC12345"
            maxLength={12}
          />
          <p className="text-sm text-gray-500 mt-1">
            🎁 Si tienes un código, ¡úsalo para beneficios!
          </p>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold p-3 rounded-lg transition ${
            loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creando cuenta...
            </span>
          ) : (
            'Registrar'
          )}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-green-600 hover:underline font-semibold">
            Ingresar
          </Link>
        </p>
      </form>
    </div>
  );
}
