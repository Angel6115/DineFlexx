// src/Perfil.jsx - MOBILE PERFECT
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import {
  Users,
  Copy,
  MessageCircle,
  Mail,
  Edit2,
  CreditCard,
  Gift,
  TrendingUp,
  Award,
  QrCode,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  FileText,
  ShoppingCart,
  ChefHat,
  X,
  Plus,
  ArrowUpCircle,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [wallet, setWallet] = useState({ balance: 0 });
  const [score, setScore] = useState(650);
  const [loading, setLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState('resumen');

  // Data states
  const [referrals, setReferrals] = useState([]);
  const [sharedCredits, setSharedCredits] = useState([]);
  const [cards, setCards] = useState([]);
  const [plans, setPlans] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [unifiedHistory, setUnifiedHistory] = useState([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalReferrals: 0,
    totalCommissions: 0,
    cateringSpent: 0,
    ordersSpent: 0,
  });

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreditRequestModal, setShowCreditRequestModal] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', photoFile: null });
  const [creditForm, setCreditForm] = useState({
    requested_amount: '',
    reason: '',
    monthly_income: '',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
        loadCreditRequests(user.id),
        loadUnifiedHistory(user.id),
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
    if (data?.balance != null) setWallet({ balance: Number(data.balance) });
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
      .select('id, remaining_amount, status, assigned_to, initial_amount')
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

  const loadCreditRequests = async (uid) => {
    const { data, error } = await supabase
      .from('credit_requests')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading credit requests:', error);
      return;
    }

    setCreditRequests(data || []);
  };

  const loadUnifiedHistory = async (uid) => {
    const history = [];

    // Catering
    const { data: catering } = await supabase
      .from('solicitudes_catering')
      .select('id, total_final, fecha, tipo, created_at')
      .eq('usuario_id', uid);

    catering?.forEach((c) => {
      history.push({
        type: 'catering',
        icon: ChefHat,
        title: `Catering ${c.tipo}`,
        amount: c.total_final,
        date: c.created_at,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
      });
    });

    // Orders
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total, created_at')
      .eq('client_id', uid);

    orders?.forEach((o) => {
      history.push({
        type: 'order',
        icon: ShoppingCart,
        title: `Pedido #${o.id.slice(0, 8)}`,
        amount: o.total,
        date: o.created_at,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      });
    });

    // Tarjetas usadas
    cards?.forEach((c) => {
      if (c.initial_amount && c.remaining_amount < c.initial_amount) {
        const used = c.initial_amount - c.remaining_amount;
        history.push({
          type: 'card',
          icon: CreditCard,
          title: `Tarjeta ****${c.id.slice(-4)}`,
          amount: used,
          date: c.created_at,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
        });
      }
    });

    // QRs usados
    const usedQRs = sharedCredits.filter((qr) => qr.status === 'used');
    usedQRs.forEach((qr) => {
      history.push({
        type: 'qr',
        icon: QrCode,
        title: `QR Compartido - ${qr.assigned_to || 'Usado'}`,
        amount: qr.amount,
        date: qr.used_at || qr.created_at,
        color: 'text-green-600',
        bg: 'bg-green-50',
      });
    });

    // Ordenar por fecha
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    setUnifiedHistory(history);
  };

  const loadStats = async (uid) => {
    // Catering
    const { data: catering } = await supabase
      .from('solicitudes_catering')
      .select('total_final')
      .eq('usuario_id', uid);

    const cateringSpent = catering?.reduce((sum, c) => sum + parseFloat(c.total_final || 0), 0) || 0;

    // Orders
    const { data: orders } = await supabase
      .from('orders')
      .select('total')
      .eq('client_id', uid);

    const ordersSpent = orders?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;

    const totalSpent = cateringSpent + ordersSpent;

    // Referidos
    const { data: refs } = await supabase
      .from('referrals')
      .select('commission_earned')
      .eq('referrer_id', uid)
      .eq('status', 'completed');

    const totalReferrals = refs?.length || 0;
    const totalCommissions = refs?.reduce((sum, r) => sum + parseFloat(r.commission_earned || 0), 0) || 0;

    setStats({ totalSpent, totalReferrals, totalCommissions, cateringSpent, ordersSpent });
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

  const handleCreditRequestSubmit = async () => {
    if (!creditForm.requested_amount || !creditForm.reason || !creditForm.monthly_income) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const amount = parseFloat(creditForm.requested_amount);
    const income = parseFloat(creditForm.monthly_income);

    if (amount <= 0 || income <= 0) {
      alert('Los montos deben ser mayores a 0.');
      return;
    }

    if (score < 650) {
      alert('Tu score crediticio debe ser mayor a 650 para solicitar crédito.');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('credit_requests').insert([
      {
        user_id: authUser.id,
        current_credit: wallet.balance,
        requested_amount: amount,
        reason: creditForm.reason,
        monthly_income: income,
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('Error submitting request:', error);
      alert('Error al enviar solicitud. Intenta de nuevo.');
    } else {
      alert('✅ Solicitud enviada. Te notificaremos pronto!');
      setCreditForm({ requested_amount: '', reason: '', monthly_income: '' });
      setShowCreditRequestModal(false);
      loadCreditRequests(authUser.id);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 mb-6 sm:mb-8"></div>
          <div className="flex gap-4 mb-6 sm:mb-8">
            <div className="h-20 w-20 sm:h-28 sm:w-28 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="h-28 sm:h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-28 sm:h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-28 sm:h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Mi Perfil</h1>

      {/* MODAL: EDITAR PERFIL - MOBILE OPTIMIZED */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 pr-8">Editar Perfil</h2>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Nombre completo"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, photoFile: e.target.files[0] })}
                className="w-full mb-4 text-sm"
              />
              <button
                onClick={handleEditSubmit}
                disabled={uploading}
                className={`w-full py-3 rounded-xl font-semibold text-sm sm:text-base ${
                  uploading ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploading ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SOLICITAR CRÉDITO - MOBILE OPTIMIZED */}
      <AnimatePresence>
        {showCreditRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setShowCreditRequestModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 sm:p-3 rounded-xl flex-shrink-0">
                  <ArrowUpCircle className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">Solicitar Crédito</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Score actual: <strong>{score}</strong></p>
                </div>
              </div>

              {score < 650 ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold">Score insuficiente</p>
                    <p>Necesitas un score de 650+ para solicitar crédito.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-blue-900">
                      <strong>Crédito actual:</strong> {formatCurrency(wallet.balance)}
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        💰 Monto a solicitar
                      </label>
                      <input
                        type="number"
                        value={creditForm.requested_amount}
                        onChange={(e) => setCreditForm({ ...creditForm, requested_amount: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                        placeholder="Ej: 5000"
                        min="0"
                        step="100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        📝 Razón de la solicitud
                      </label>
                      <textarea
                        value={creditForm.reason}
                        onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                        placeholder="Ej: Expandir negocio, eventos grandes..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        💵 Ingresos mensuales
                      </label>
                      <input
                        type="number"
                        value={creditForm.monthly_income}
                        onChange={(e) => setCreditForm({ ...creditForm, monthly_income: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                        placeholder="Ej: 3000"
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreditRequestSubmit}
                    disabled={submitting}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base ${
                      submitting
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    }`}
                  >
                    <Send size={18} />
                    {submitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER - MOBILE OPTIMIZED */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg"
      >
        <div className="relative">
          <img
            src={profile.photo}
            alt="Perfil"
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-blue-100 shadow-lg"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{profile.name || 'Usuario'}</p>
          <p className="text-sm sm:text-base text-gray-600 mb-2">{profile.email}</p>
          <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
            <Award className="text-yellow-500" size={18} />
            <span className="font-semibold text-sm sm:text-base">{profile.points} puntos</span>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <button
              onClick={openEditModal}
              className="flex items-center gap-1 text-blue-600 text-xs sm:text-sm hover:underline"
            >
              <Edit2 size={14} /> Editar perfil
            </button>
          </div>
        </div>
      </motion.div>

      {/* STATS CARDS - MOBILE OPTIMIZED */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} className="sm:w-8 sm:h-8" />
            <p className="text-xs sm:text-sm opacity-90">Crédito Disponible</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(wallet.balance)}</p>
          <button
            onClick={() => setShowCreditRequestModal(true)}
            className="mt-3 bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-50 transition flex items-center gap-2"
          >
            <Plus size={14} /> Solicitar Más
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Award size={24} className="sm:w-8 sm:h-8" />
            <p className="text-xs sm:text-sm opacity-90">Puntos</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{profile.points}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} className="sm:w-8 sm:h-8" />
            <p className="text-xs sm:text-sm opacity-90">Credit Score</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{score}</p>
          <p className="text-xs mt-2 opacity-90">
            {score >= 750 ? '🎉 Excelente' : score >= 650 ? '✅ Bueno' : '⚠️ Mejorar'}
          </p>
        </motion.div>
      </div>

      {/* TABS - MOBILE OPTIMIZED */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto scrollbar-hide">
        {[
          { id: 'resumen', label: 'Resumen', icon: TrendingUp },
          { id: 'historial', label: 'Historial', icon: History },
          { id: 'credito', label: 'Solicitudes', icon: FileText },
          { id: 'referidos', label: 'Referidos', icon: Users },
          { id: 'tarjetas', label: 'Tarjetas', icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap transition text-xs sm:text-sm md:text-base ${
              activeTab === tab.id
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[400px]">
        {/* RESUMEN - MOBILE OPTIMIZED */}
        {activeTab === 'resumen' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-l-4 border-purple-500">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <ChefHat className="text-purple-600" size={20} />
                  <p className="text-gray-600 font-semibold text-sm sm:text-base">Catering</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.cateringSpent)}</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <ShoppingCart className="text-blue-600" size={20} />
                  <p className="text-gray-600 font-semibold text-sm sm:text-base">Pedidos</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.ordersSpent)}</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <DollarSign className="text-green-600" size={20} />
                  <p className="text-gray-600 font-semibold text-sm sm:text-base">Total Gastado</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                <p className="text-gray-600 mb-2 font-semibold text-sm sm:text-base">Referidos Activos</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{stats.totalReferrals}</p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                <p className="text-gray-600 mb-2 font-semibold text-sm sm:text-base">Comisiones Ganadas</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{formatCurrency(stats.totalCommissions)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* HISTORIAL UNIFICADO - MOBILE OPTIMIZED */}
        {activeTab === 'historial' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <History className="text-blue-600" size={20} />
                Historial Completo ({unifiedHistory.length})
              </h3>
              {unifiedHistory.length ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {unifiedHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-3 sm:p-4 rounded-xl ${item.bg} border border-gray-200`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-2 rounded-lg bg-white ${item.color} flex-shrink-0`}>
                          <item.icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString('es-PR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold text-base sm:text-lg ${item.color} xs:text-right`}>
                        -{formatCurrency(item.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">No hay actividad registrada.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* SOLICITUDES DE CRÉDITO - MOBILE OPTIMIZED */}
        {activeTab === 'credito' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-3">💰 Solicitar Aumento de Crédito</h3>
              <p className="mb-4 text-xs sm:text-sm opacity-90">
                Evalúa tu elegibilidad y solicita más crédito para eventos grandes.
              </p>
              <button
                onClick={() => setShowCreditRequestModal(true)}
                className="bg-white text-green-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-green-50 transition flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus size={18} />
                Nueva Solicitud
              </button>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Mis Solicitudes ({creditRequests.length})</h3>
              {creditRequests.length ? (
                <ul className="space-y-3">
                  {creditRequests.map((req) => (
                    <li key={req.id} className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-2">
                        <div>
                          <p className="font-bold text-base sm:text-lg">{formatCurrency(req.requested_amount)}</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {new Date(req.created_at).toLocaleDateString('es-PR')}
                          </p>
                        </div>
                        <div>
                          {req.status === 'approved' && (
                            <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 w-fit">
                              <CheckCircle size={14} /> Aprobado
                            </span>
                          )}
                          {req.status === 'pending' && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 w-fit">
                              <Clock size={14} /> Pendiente
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 w-fit">
                              <AlertCircle size={14} /> Rechazado
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mb-1">
                        <strong>Razón:</strong> {req.reason}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Ingresos:</strong> {formatCurrency(req.monthly_income)}
                      </p>
                      {req.admin_notes && (
                        <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded border">
                          <strong>Nota Admin:</strong> {req.admin_notes}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No has solicitado crédito aún. ¡Solicita tu primera evaluación!
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* REFERIDOS - MOBILE OPTIMIZED */}
        {activeTab === 'referidos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Tu Código de Referido</h3>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
                <code className="bg-white text-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-lg sm:text-2xl font-bold flex-1 text-center">
                  {profile.referralCode || 'CARGANDO...'}
                </code>
                <button
                  onClick={copyReferralCode}
                  className="bg-white text-purple-600 p-2 sm:p-3 rounded-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
                  title="Copiar código"
                >
                  {copySuccess ? <CheckCircle size={20} /> : <Copy size={20} />}
                  <span className="xs:hidden text-sm font-semibold">Copiar</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm mt-3 opacity-90">
                🎁 Gana <strong>$10</strong> por cada amigo que se registre
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Mis Referidos ({referrals.length})</h3>
              {referrals.length ? (
                <ul className="space-y-3">
                  {referrals.map((ref) => (
                    <li key={ref.id} className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{ref.referred_email}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(ref.created_at).toLocaleDateString('es-PR')}
                        </p>
                      </div>
                      <div className="text-left xs:text-right">
                        <p
                          className={`font-semibold text-sm ${
                            ref.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                          }`}
                        >
                          {ref.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
                        </p>
                        {ref.status === 'completed' && (
                          <p className="text-xs sm:text-sm text-gray-600">
                            +{ref.points_earned} pts • {formatCurrency(ref.commission_earned)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">
                  Aún no has referido a nadie. ¡Comparte tu código!
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* TARJETAS & PLANES - MOBILE OPTIMIZED */}
        {activeTab === 'tarjetas' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Tarjetas Virtuales</h3>
                <button
                  onClick={() => navigate('/tarjetas/crear')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 text-sm sm:text-base"
                >
                  <CreditCard size={16} /> Crear Tarjeta
                </button>
              </div>

              {cards.length ? (
                <ul className="space-y-3">
                  {cards.map((c) => {
                    const percentage = c.initial_amount
                      ? ((c.remaining_amount / c.initial_amount) * 100).toFixed(0)
                      : 0;
                    return (
                      <li
                        key={c.id}
                        className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl sm:rounded-2xl shadow-lg"
                      >
                        <p className="font-mono text-base sm:text-lg mb-2">•••• {c.id.slice(-4)}</p>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm opacity-90 truncate">{c.assigned_to || 'Mi tarjeta'}</span>
                          <span className="font-bold text-base sm:text-lg">{formatCurrency(c.remaining_amount)}</span>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-white h-full rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1 opacity-75">{percentage}% disponible</p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">No tienes tarjetas virtuales.</p>
              )}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Planes de Financiamiento</h3>
              {plans.length ? (
                <ul className="space-y-3">
                  {plans.map((p) => (
                    <li key={p.order_id} className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate">Orden #{p.order_id.slice(0, 8)}...</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {p.installments} cuotas •{' '}
                            {new Date(p.created_at).toLocaleDateString('es-PR')}
                          </p>
                        </div>
                        <p className="text-base sm:text-lg font-bold">{formatCurrency(p.total_amount)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">No tienes planes activos.</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* FOOTER ACTIONS - MOBILE OPTIMIZED */}
      <div className="flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
        <button
          onClick={copyReferralCode}
          className="p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition"
          title="Copiar código"
        >
          <Copy size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() =>
            window.open(
              `https://wa.me/?text=Únete con mi código: ${profile.referralCode}`,
              '_blank'
            )
          }
          className="p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition"
          title="WhatsApp"
        >
          <MessageCircle size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() =>
            (window.location.href = `mailto:?subject=Únete&body=Código: ${profile.referralCode}`)
          }
          className="p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition"
          title="Email"
        >
          <Mail size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
