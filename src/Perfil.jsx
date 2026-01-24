// src/Perfil.jsx
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
  Gift,
  TrendingUp,
  Award,
  QrCode,
  DollarSign,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Perfil() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    photo: '/images/perfil.jpg',
    points: 0,
    referralCode: '',
  });
  const [wallet, setWallet] = useState({ balance: 1500 });
  const [score, setScore] = useState(650);
  const [loading, setLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState('resumen');

  // Data states
  const [referrals, setReferrals] = useState([]);
  const [sharedCredits, setSharedCredits] = useState([]);
  const [cards, setCards] = useState([]);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalReferrals: 0,
    totalCommissions: 0,
  });

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', photoFile: null });
  const [uploading, setUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

      // Carga crítica
      await Promise.all([
        loadProfile(user.id),
        loadWallet(user.id),
        loadScore(user.id),
      ]);

      setLoading(false);

      // Carga secundaria
      Promise.all([
        loadReferrals(user.id),
        loadSharedCredits(user.id),
        loadCards(user.id),
        loadPlans(user.id),
        loadStats(user.id),
      ]);
    })();
  }, []);

  const loadProfile = async (uid) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, photo, points, referral_code')
      .eq('id', uid)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setProfile((p) => ({
        ...p,
        name: data.full_name || 'Usuario',
        photo: data.photo || p.photo,
        points: data.points || 0,
        referralCode: data.referral_code || '',
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
      .maybeSingle();
    if (data?.score != null) setScore(data.score);
  };

  const loadReferrals = async (uid) => {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        id,
        referred_email,
        status,
        points_earned,
        commission_earned,
        created_at,
        completed_at
      `)
      .eq('referrer_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading referrals:', error);
      return;
    }

    setReferrals(data || []);
  };

  const loadSharedCredits = async (uid) => {
    const { data, error } = await supabase
      .from('shared_credits')
      .select(`
        id,
        code,
        amount,
        assigned_to,
        status,
        used_by,
        used_at,
        created_at
      `)
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading shared credits:', error);
      return;
    }

    setSharedCredits(data || []);
  };

  const loadCards = async (uid) => {
    const { data } = await supabase
      .from('virtual_cards')
      .select('id, remaining_amount, status, assigned_to')
      .eq('user_id', uid);
    setCards(data || []);
  };

  const loadPlans = async (uid) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        created_at,
        financing_plans (
          total_amount,
          installments
        )
      `)
      .eq('client_id', uid)
      .not('financing_plans', 'is', null);

    if (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
      return;
    }

    const transformed =
      data?.map((order) => ({
        order_id: order.id,
        total_amount: order.financing_plans?.total_amount || order.total,
        installments: order.financing_plans?.installments || 0,
        created_at: order.created_at,
      })) || [];

    setPlans(transformed);
  };

  const loadStats = async (uid) => {
    // Total gastado
    const { data: orders } = await supabase
      .from('orders')
      .select('total')
      .eq('client_id', uid);

    const totalSpent = orders?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;

    // Total referidos completados
    const { data: refs } = await supabase
      .from('referrals')
      .select('commission_earned')
      .eq('referrer_id', uid)
      .eq('status', 'completed');

    const totalReferrals = refs?.length || 0;
    const totalCommissions = refs?.reduce((sum, r) => sum + parseFloat(r.commission_earned || 0), 0) || 0;

    setStats({ totalSpent, totalReferrals, totalCommissions });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="flex gap-4 mb-8">
            <div className="h-28 w-28 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
        className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-white p-6 rounded-xl shadow"
      >
        <div className="relative">
          <img
            src={profile.photo}
            alt="Perfil"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-lg"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-3xl font-bold">{profile.name || 'Usuario'}</p>
          <p className="text-gray-600 mb-2">{profile.email}</p>
          <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
            <Award className="text-yellow-500" size={20} />
            <span className="font-semibold">{profile.points} puntos</span>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <button
              onClick={openEditModal}
              className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
            >
              <Edit2 size={16} /> Editar perfil
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={32} />
            <p className="text-sm opacity-90">Wallet</p>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(wallet.balance)}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Award size={32} />
            <p className="text-sm opacity-90">Puntos</p>
          </div>
          <p className="text-3xl font-bold">{profile.points}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={32} />
            <p className="text-sm opacity-90">Score</p>
          </div>
          <p className="text-3xl font-bold">{score}</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {[
          { id: 'resumen', label: 'Resumen', icon: TrendingUp },
          { id: 'referidos', label: 'Referidos', icon: Users },
          { id: 'credito', label: 'Crédito Compartido', icon: Gift },
          { id: 'tarjetas', label: 'Tarjetas & Planes', icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* RESUMEN */}
        {activeTab === 'resumen' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-600 mb-2">Total Gastado</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-600 mb-2">Referidos Activos</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-600 mb-2">Comisiones Ganadas</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalCommissions)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
              <p className="text-gray-500 text-sm">📊 Próximamente: gráfica de actividad</p>
            </div>
          </motion.div>
        )}

        {/* REFERIDOS */}
        {activeTab === 'referidos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg mb-6">
              <h3 className="text-xl font-semibold mb-3">Tu Código de Referido</h3>
              <div className="flex items-center gap-3">
                <code className="bg-white text-purple-600 px-6 py-3 rounded-lg text-2xl font-bold flex-1 text-center">
                  {profile.referralCode || 'CARGANDO...'}
                </code>
                <button
                  onClick={copyReferralCode}
                  className="bg-white text-purple-600 p-3 rounded-lg hover:bg-purple-50 transition"
                  title="Copiar código"
                >
                  {copySuccess ? <CheckCircle size={24} /> : <Copy size={24} />}
                </button>
              </div>
              <p className="text-sm mt-3 opacity-90">
                🎁 Gana <strong>$10</strong> por cada amigo que se registre con tu código
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-4">Mis Referidos ({referrals.length})</h3>
              {referrals.length ? (
                <ul className="space-y-3">
                  {referrals.map((ref) => (
                    <li key={ref.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{ref.referred_email}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(ref.created_at).toLocaleDateString('es-PR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${ref.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {ref.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
                        </p>
                        {ref.status === 'completed' && (
                          <p className="text-sm text-gray-600">
                            +{ref.points_earned} pts • {formatCurrency(ref.commission_earned)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aún no has referido a nadie. ¡Comparte tu código!
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* CRÉDITO COMPARTIDO */}
        {activeTab === 'credito' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-6 rounded-xl shadow mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">QRs Compartidos</h3>
                <button
                  onClick={() => navigate('/wallet')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <QrCode size={18} /> Crear Nuevo QR
                </button>
              </div>

              {sharedCredits.length ? (
                <ul className="space-y-3">
                  {sharedCredits.map((qr) => (
                    <li key={qr.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {qr.assigned_to || 'Sin asignar'} • {formatCurrency(qr.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Creado: {new Date(qr.created_at).toLocaleDateString('es-PR')}
                        </p>
                        {qr.used_at && (
                          <p className="text-xs text-green-600">
                            ✅ Usado el {new Date(qr.used_at).toLocaleDateString('es-PR')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {qr.status === 'used' ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Usado
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Activo
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No has compartido crédito aún. ¡Crea tu primer QR!
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* TARJETAS & PLANES */}
        {activeTab === 'tarjetas' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-6 rounded-xl shadow mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Tarjetas Virtuales</h3>
                <button
                  onClick={() => navigate('/tarjetas/crear')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                >
                  <CreditCard size={18} /> Crear Tarjeta
                </button>
              </div>

              {cards.length ? (
                <ul className="space-y-3">
                  {cards.map((c) => (
                    <li key={c.id} className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg">
                      <p className="font-mono text-lg">•••• {c.id.slice(-4)}</p>
                      <div className="flex justify-between mt-2">
                        <span>{c.assigned_to || 'Mi tarjeta'}</span>
                        <span className="font-bold">{formatCurrency(c.remaining_amount)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">No tienes tarjetas virtuales.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-4">Planes de Financiamiento</h3>
              {plans.length ? (
                <ul className="space-y-3">
                  {plans.map((p) => (
                    <li key={p.order_id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Orden #{p.order_id.slice(0, 8)}...</p>
                          <p className="text-sm text-gray-500">
                            {p.installments} cuotas • {new Date(p.created_at).toLocaleDateString('es-PR')}
                          </p>
                        </div>
                        <p className="text-lg font-bold">{formatCurrency(p.total_amount)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">No tienes planes activos.</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={copyReferralCode}
          className="p-3 bg-white rounded-full shadow hover:shadow-lg transition"
          title="Copiar código de referido"
        >
          <Copy size={20} />
        </button>
        <button
          onClick={() => window.open(`https://wa.me/?text=Únete con mi código: ${profile.referralCode}`)}
          className="p-3 bg-white rounded-full shadow hover:shadow-lg transition"
          title="Compartir por WhatsApp"
        >
          <MessageCircle size={20} />
        </button>
        <button
          onClick={() => window.location.href = `mailto:?subject=Únete a la plataforma&body=Usa mi código: ${profile.referralCode}`}
          className="p-3 bg-white rounded-full shadow hover:shadow-lg transition"
          title="Compartir por Email"
        >
          <Mail size={20} />
        </button>
      </div>
    </div>
  );
}
