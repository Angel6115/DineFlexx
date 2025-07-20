import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import {
  Users,
  Copy,
  MessageCircle,
  Mail,
  Share2,
  Edit2,
  CreditCard,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Perfil() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    photo: '/images/perfil.jpg',
  });
  const [wallet, setWallet] = useState({ balance: 1500 });
  const [score, setScore] = useState(Math.floor(Math.random() * 251) + 600);
  const [cards, setCards] = useState([]);
  const [plans, setPlans] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', photoFile: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: ud, error: ae } = await supabase.auth.getUser();
      if (ae || !ud.user) {
        console.error(ae);
        setLoading(false);
        return;
      }
      const user = ud.user;
      setAuthUser(user);
      setProfile((p) => ({ ...p, email: user.email }));

      await Promise.all([
        loadProfile(user.id),
        loadWallet(user.id),
        loadScore(user.id),
        loadCards(user.id),
        loadPlans(user.id),
        loadReservas(user.id),
      ]);

      setLoading(false);
    })();
  }, []);

  const loadProfile = async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, photo')
      .eq('id', uid)
      .single();
    if (data) {
      setProfile((p) => ({
        ...p,
        name: data.full_name,
        photo: data.photo || p.photo,
      }));
    }
  };

  const loadWallet = async (uid) => {
    const { data } = await supabase
      .from('digital_wallet')
      .select('balance')
      .eq('user_id', uid)
      .single();
    if (data?.balance != null) setWallet({ balance: data.balance });
  };

  const loadScore = async (uid) => {
    const { data } = await supabase
      .from('credit_checks')
      .select('score')
      .eq('user_id', uid)
      .single();
    if (data?.score != null) setScore(data.score);
  };

  const loadCards = async (uid) => {
    const { data } = await supabase
      .from('virtual_cards')
      .select('id, remaining_amount, status')
      .eq('user_id', uid);
    setCards(data || []);
  };

  const loadPlans = async (uid) => {
    const { data } = await supabase
      .from('financing_plans')
      .select('order_id, total_amount, installments')
      .eq('user_id', uid);
    setPlans(data || []);
  };

  const loadReservas = async (uid) => {
    const { data } = await supabase
      .from('reservas')
      .select('date, total, restaurant')
      .eq('user_id', uid);
    setReservas(data || []);
  };

  const goToReferidos = () => navigate('/referidos');
  const goToCrearTarjeta = () => navigate('/tarjetas/crear');

  const formatCurrency = (v) =>
    new Intl.NumberFormat('es-PR', { style: 'currency', currency: 'USD' }).format(v);

  const openEditModal = () => {
    setFormData({ full_name: profile.name, photoFile: null });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    setUploading(true);
    const uid = authUser.id;
    let photoUrl = profile.photo;

    if (formData.photoFile) {
      const ext = formData.photoFile.name.split('.').pop();
      const name = `${uid}.${Date.now()}.${ext}`;
      const path = `avatars/${name}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, formData.photoFile, { upsert: true });
      if (upErr) {
        console.error(upErr);
        alert('Error al subir la foto.');
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      photoUrl = urlData.publicUrl;
    }

    const { error: pe } = await supabase
      .from('profiles')
      .update({ full_name: formData.full_name, photo: photoUrl })
      .eq('id', uid);

    if (pe) {
      console.error(pe);
      alert('Error al actualizar.');
    } else {
      setProfile({ ...profile, name: formData.full_name, photo: photoUrl });
      setShowEditModal(false);
    }
    setUploading(false);
  };

  if (loading) return <div className="p-6 text-center">Cargando…</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow">
      <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-2xl text-gray-500"
            >
              ×
            </button>
            <h2 className="text-2xl mb-4">Editar Perfil</h2>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full border rounded p-2 mb-4"
              placeholder="Nombre completo"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photoFile: e.target.files[0] })}
              className="w-full mb-4"
            />
            <button
              onClick={handleEditSubmit}
              disabled={uploading}
              className={`w-full py-2 rounded ${
                uploading ? 'bg-gray-300' : 'bg-blue-600 text-white'
              }`}
            >
              {uploading ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-center gap-8 mb-10"
      >
        <div className="relative">
          <img
            src={profile.photo}
            alt="Perfil"
            className="w-28 h-28 rounded-full object-cover border-2 shadow-lg"
          />
          <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow">
            <Share2 size={18} />
          </label>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-semibold">{profile.name || 'Usuario'}</p>
          <p className="text-gray-600 mb-3">{profile.email}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={openEditModal}
              className="flex items-center gap-1 text-blue-600 text-sm"
            >
              <Edit2 size={16} /> Editar perfil
            </button>
            <button
              onClick={goToReferidos}
              className="flex items-center gap-1 bg-teal-600 text-white px-4 py-2 rounded-full text-sm"
            >
              <Users size={16} /> Ver Referidos
            </button>
          </div>
        </div>
      </motion.div>

      {/* Wallet & Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Wallet Digital</h2>
          <p className="mb-4">Disponible: {formatCurrency(wallet.balance)}</p>
          <button
            onClick={goToCrearTarjeta}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <CreditCard size={16} /> Crear Tarjeta Virtual
          </button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Score de Crédito</h2>
          <p className="text-3xl font-bold mb-4">{score}</p>
          <button className="flex items-center gap-2 text-blue-600 text-sm">
            <MessageCircle size={16} /> Solicitar aumento
          </button>
        </motion.div>
      </div>

      {/* Tarjetas */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <CreditCard size={20} /> Tarjetas Activas
        </h2>
        {cards.length ? (
          <ul className="space-y-2">
            {cards.map((c) => (
              <motion.li key={c.id} whileHover={{ x: 5 }}>
                #{c.id.slice(0, 6)}… – {formatCurrency(c.remaining_amount)}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p>No tienes tarjetas registradas.</p>
        )}
      </section>

      {/* Planes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Planes de Pago</h2>
        {plans.length ? (
          <ul className="space-y-2">
            {plans.map((p) => (
              <motion.li key={p.order_id} whileHover={{ scale: 1.02 }} className="cursor-pointer">
                🧾 Orden #{p.order_id.slice(0, 6)}… • {formatCurrency(p.total_amount)} •{' '}
                {p.installments} cuotas
              </motion.li>
            ))}
          </ul>
        ) : (
          <p>No tienes planes activos.</p>
        )}
      </section>

      {/* Reservas */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Historial de Reservas</h2>
        {reservas.length ? (
          <ul className="space-y-2">
            {reservas.map((r, i) => (
              <motion.li key={i} whileHover={{ scale: 1.02 }}>
                📅 {new Date(r.date).toLocaleDateString('es-PR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                – {formatCurrency(r.total)}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p>No tienes reservas previas.</p>
        )}
      </section>

      {/* Footer */}
      <div className="flex justify-end gap-4 mb-6">
        <button title="Copiar" className="p-3 bg-white rounded-full shadow">
          <Copy size={18} />
        </button>
        <button title="WhatsApp" className="p-3 bg-white rounded-full shadow">
          <MessageCircle size={18} />
        </button>
        <button title="Email" className="p-3 bg-white rounded-full shadow">
          <Mail size={18} />
        </button>
      </div>
    </div>
  );
}
