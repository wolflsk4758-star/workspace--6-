import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Order } from './types';
import { Language, translations } from './i18n/translations';
import {
  saveOrders,
  subscribeToOrders,
  subscribeToAppSettings,
  saveAppSettings,
  UserAccount,
  DEFAULT_LOGO,
  DEFAULT_USERS,
} from './utils/storage';
import Dashboard from './components/Dashboard';
import OrderModal from './components/OrderModal';
import {
  Plus,
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  LogOut,
  Globe,
  Lock,
  Key,
  UserPlus,
  CheckCircle2,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO);

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<'staff' | 'admin'>('staff');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUsernameVal, setEditUsernameVal] = useState('');
  const [editPasswordVal, setEditPasswordVal] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const logoInputRef = useRef<HTMLInputElement>(null);

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('wolf_lsk_lang') as Language) || 'en';
  });

  useEffect(() => {
    const unsubscribe = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAppSettings((settings) => {
      setLogoUrl(settings.logoUrl || DEFAULT_LOGO);
      setUsers(settings.users && settings.users.length > 0 ? settings.users : DEFAULT_USERS);

      const savedAuth = localStorage.getItem('wolf_lsk_auth');
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          const matched = settings.users.find(
            (u) => u.username.toLowerCase() === String(parsed.username || '').toLowerCase()
          );
          if (matched) {
            setCurrentUser(matched);
          }
        } catch {
          localStorage.removeItem('wolf_lsk_auth');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('wolf_lsk_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = users.find(
      (u) =>
        u.username.trim().toLowerCase() === loginUsername.trim().toLowerCase() &&
        u.password === loginPassword
    );
    if (!found) {
      setLoginError(
        language === 'ar'
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
          : 'Invalid username or password'
      );
      return;
    }
    setCurrentUser(found);
    localStorage.setItem('wolf_lsk_auth', JSON.stringify({ username: found.username, role: found.role }));
    setLoginError('');
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('wolf_lsk_auth');
    setCurrentUser(null);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updatedLogo = reader.result;
        setLogoUrl(updatedLogo);
        saveAppSettings({ logoUrl: updatedLogo, users });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newDisplayName.trim()) return;
    if (users.some((u) => u.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      alert('اسم المستخدم هذا موجود مسبقاً!');
      return;
    }
    const created: UserAccount = {
      id: 'usr-' + Date.now(),
      username: newUsername.trim(),
      password: newPassword.trim(),
      displayName: newDisplayName.trim(),
      role: newRole,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedUsers = [...users, created];
    setUsers(updatedUsers);
    saveAppSettings({ logoUrl, users: updatedUsers });
    setNewUsername('');
    setNewPassword('');
    setNewDisplayName('');
    setNewRole('staff');
  };

  const handleSaveCredentials = (userId: string) => {
    if (!editUsernameVal.trim() || !editPasswordVal.trim()) return;
    const updatedUsers = users.map((u) =>
      u.id === userId
        ? { ...u, username: editUsernameVal.trim(), password: editPasswordVal.trim() }
        : u
    );
    setUsers(updatedUsers);
    saveAppSettings({ logoUrl, users: updatedUsers });
    if (currentUser?.id === userId) {
      const updatedCurrent = {
        ...currentUser,
        username: editUsernameVal.trim(),
        password: editPasswordVal.trim(),
      };
      setCurrentUser(updatedCurrent);
      localStorage.setItem(
        'wolf_lsk_auth',
        JSON.stringify({ username: updatedCurrent.username, role: updatedCurrent.role })
      );
    }
    setEditingUserId(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('لا يمكنك حذف حسابك الشخصي أثناء تسجيل الدخول!');
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف حساب هذا الموظف؟')) {
      const updatedUsers = users.filter((u) => u.id !== userId);
      setUsers(updatedUsers);
      saveAppSettings({ logoUrl, users: updatedUsers });
    }
  };

  const handleSaveOrder = (order: Order) => {
    setOrders((prev) => {
      let updatedOrders;
      const existing = prev.findIndex((o) => o.id === order.id);
      if (existing >= 0) {
        updatedOrders = [...prev];
        updatedOrders[existing] = order;
      } else {
        updatedOrders = [order, ...prev];
      }
      saveOrders(updatedOrders);
      return updatedOrders;
    });
    setEditingOrder(null);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (currentUser?.role !== 'admin') {
      alert(language === 'ar' ? 'عذراً، حذف الفواتير متاح للمدير الرئيسي فقط.' : 'Only Admin can delete orders.');
      return;
    }
    const t = translations[language];
    if (window.confirm(t.deleteConfirm)) {
      setOrders((prev) => {
        const updatedOrders = prev.filter((o) => o.id !== id);
        saveOrders(updatedOrders);
        return updatedOrders;
      });
    }
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const t = translations[language];

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRemaining = orders.reduce((sum, o) => sum + o.remainingBalance, 0);
  const totalCollected = Math.max(0, totalRevenue - totalRemaining);
  const activeOrders = orders.filter((o) => o.status === 'In Progress' || o.status === 'Pending').length;
  const totalClients = new Set(orders.map((o) => o.clientName)).size;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="flex justify-end p-5 relative z-10">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900/90 border border-gray-800 rounded-xl text-xs font-medium text-gray-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
          >
            <Globe size={14} />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 relative z-10">
          <div className="w-full max-w-md bg-gray-900/75 backdrop-blur-2xl border border-gray-800/80 rounded-3xl p-7 sm:p-9 shadow-2xl">
            <div className="text-center mb-7">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gray-950 border-2 border-amber-500/40 p-1.5 shadow-xl shadow-amber-500/10 flex items-center justify-center overflow-hidden">
                <img
                  src={logoUrl}
                  alt="WOLF LSK Brand Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">WOLF LSK Agency</h1>
              <p className="text-xs text-amber-400/90 font-semibold mt-1">
                {language === 'ar'
                  ? 'بوابة إدارة العملاء والفواتير'
                  : 'Client & Order Management Portal'}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  {language === 'ar' ? 'اسم المستخدم (Username)' : 'Username'}
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل اسم المستخدم...' : 'Enter username...'}
                  autoComplete="username"
                  className="w-full px-4 py-3 bg-gray-950/90 border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  {language === 'ar' ? 'كلمة المرور (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-gray-950/90 border border-gray-800 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 ${
                      language === 'ar' ? 'left-3.5' : 'right-3.5'
                    }`}
                  >
                    {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            </form>
          </div>
        </div>

        <footer className="p-4 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} WOLF LSK Agency
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />

      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                onClick={() => currentUser.role === 'admin' && logoInputRef.current?.click()}
                title={currentUser.role === 'admin' ? 'اضغط لتغيير صورة اللوغو' : 'WOLF LSK'}
                className={`w-10 h-10 rounded-xl bg-gray-900 border border-amber-500/40 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10 overflow-hidden ${
                  currentUser.role === 'admin' ? 'cursor-pointer hover:border-amber-400' : ''
                }`}
              >
                <img src={logoUrl} alt="WOLF LSK" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">WOLF LSK</h1>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {currentUser.role === 'admin'
                      ? language === 'ar'
                        ? 'المدير الرئيسي'
                        : 'Main Admin'
                      : language === 'ar'
                      ? `موظف: ${currentUser.displayName}`
                      : `Staff: ${currentUser.displayName}`}
                  </span>
                </div>
                <p className="text-[10px] text-amber-400/80 font-medium uppercase tracking-widest -mt-0.5">
                  {t.dashboard}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setIsStaffModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all"
                >
                  <Key size={14} />
                  <span className="hidden md:inline">
                    {language === 'ar' ? 'إدارة الموظفين واللوغو' : 'Staff & Logo'}
                  </span>
                </button>
              )}

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/80 border border-gray-800 rounded-lg text-xs font-medium text-gray-300 hover:text-amber-400 hover:border-amber-500/30 transition-all"
              >
                <Globe size={14} />
                <span>{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/80 border border-gray-800 rounded-lg text-xs font-medium text-gray-300 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>

              <button
                onClick={handleNewOrder}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg text-gray-900 text-sm font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Plus size={16} strokeWidth={3} />
                <span className="hidden sm:inline">{t.newOrder}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser.role === 'admin' ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {language === 'ar'
                    ? 'الملخص المالي ومجموع الفواتير والمدخولات (خاص بالمدير الرئيسي فقط)'
                    : 'Executive Financial Summary (Admin Only)'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-amber-500/25 rounded-xl hover:border-amber-500/40 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <DollarSign size={16} className="text-amber-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">
                  {language === 'ar' ? 'إجمالي مجموع الفواتير' : t.totalRevenue}
                </p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-emerald-500/25 rounded-xl hover:border-emerald-500/40 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">
                  {language === 'ar' ? 'صافي المدخولات المقبوضة' : 'Net Collected Income'}
                </p>
                <p className="text-lg sm:text-xl font-bold text-emerald-400">
                  ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <TrendingUp size={16} className="text-red-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{t.outstanding}</p>
                <p className="text-lg sm:text-xl font-bold text-amber-400">
                  ${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Clock size={16} className="text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{t.activeOrders}</p>
                <p className="text-lg sm:text-xl font-bold text-white">{activeOrders}</p>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Users size={16} className="text-purple-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{t.totalClients}</p>
                <p className="text-lg sm:text-xl font-bold text-white">{totalClients}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-900/50 border border-gray-800/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {language === 'ar'
                    ? 'مساحة عمل الموظف — إنشاء الفواتير والتعديل والطباعة'
                    : 'Staff Workspace — Create, Edit & Print Invoices'}
                </h2>
                <p className="text-xs text-gray-400">
                  {language === 'ar'
                    ? `مرحباً ${currentUser.displayName}، يمكنك إضافة فواتير جديدة أو التعديل على الفواتير وطباعتها.`
                    : `Welcome ${currentUser.displayName}, you can create, edit, and print client invoices.`}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${
                language === 'ar' ? 'right-3.5' : 'left-3.5'
              }`}
            />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all ${
                language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-xl">
              {orders.length} {t.orders}
            </span>
          </div>
        </div>

        <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">{t.dashboard}</h2>
            </div>
          </div>
          <Dashboard
            orders={orders}
            searchQuery={searchQuery}
            language={language}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <footer className="mt-12 pb-6 text-center">
          <p className="text-xs text-gray-600">{t.footerText}</p>
          <p className="text-[10px] text-gray-700 mt-1">{t.dataStored}</p>
        </footer>
      </main>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
        editOrder={editingOrder}
        language={language}
      />

      {isStaffModalOpen && currentUser.role === 'admin' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
              <div className="flex items-center gap-2.5">
                <Key size={18} className="text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {language === 'ar'
                    ? 'إدارة حسابات الموظفين وتغيير اللوغو'
                    : 'Manage Staff Accounts & Brand Logo'}
                </h3>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="p-4 bg-gray-950/80 border border-gray-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={logoUrl}
                    alt="Current Logo"
                    className="w-14 h-14 object-contain rounded-xl bg-gray-900 border border-amber-500/30 p-1"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'ar' ? 'شعار البراند (Logo)' : 'Brand Logo'}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {language === 'ar'
                        ? 'ارفع صورة شعارك ليظهر في شاشة الدخول والهيدر لجميع الأجهزة'
                        : 'Upload your brand logo to sync across all devices'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Upload size={14} />
                  <span>{language === 'ar' ? 'رفع صورة لوغو جديدة' : 'Upload New Logo'}</span>
                </button>
              </div>

              <form
                onSubmit={handleCreateUser}
                className="p-4 bg-gray-950/60 border border-gray-800 rounded-xl space-y-4"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <UserPlus size={14} />
                  <span>
                    {language === 'ar' ? 'إنشاء حساب موظف جديد (Create Account)' : 'Create New Account'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      {language === 'ar' ? 'اسم الموظف' : 'Staff Name'}
                    </label>
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: أحمد' : 'e.g. Ahmad'}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      {language === 'ar' ? 'الصلاحية' : 'Role'}
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as 'staff' | 'admin')}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white"
                    >
                      <option value="staff">
                        {language === 'ar' ? 'موظف (فواتير فقط بدون أرباح)' : 'Staff (Invoices Only)'}
                      </option>
                      <option value="admin">
                        {language === 'ar' ? 'مدير (كامل الصلاحيات)' : 'Admin (Full Access)'}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      {language === 'ar' ? 'اسم المستخدم (Username)' : 'Username'}
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="staff1"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      {language === 'ar' ? 'كلمة المرور (Password)' : 'Password'}
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-gray-950 font-bold text-xs rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all"
                >
                  {language === 'ar' ? '+ إضافة الحساب الآن' : '+ Create Account'}
                </button>
              </form>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {language === 'ar'
                    ? 'الحسابات المسجلة (تعديل اليوزر أو الباسورد بأي وقت)'
                    : 'Registered Accounts'}
                </h4>

                {users.map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 bg-gray-950/80 border border-gray-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{u.displayName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {u.role === 'admin' ? 'مدير' : 'موظف'}
                        </span>
                      </div>

                      {editingUserId === u.id ? (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={editUsernameVal}
                            onChange={(e) => setEditUsernameVal(e.target.value)}
                            className="px-2.5 py-1 bg-gray-900 border border-amber-500/50 rounded text-xs text-white"
                            placeholder="Username"
                          />
                          <input
                            type="text"
                            value={editPasswordVal}
                            onChange={(e) => setEditPasswordVal(e.target.value)}
                            className="px-2.5 py-1 bg-gray-900 border border-amber-500/50 rounded text-xs text-white"
                            placeholder="Password"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCredentials(u.id)}
                            className="px-3 py-1 bg-emerald-500 text-gray-950 font-bold text-xs rounded"
                          >
                            حفظ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUserId(null)}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>
                            User: <strong className="text-gray-200">{u.username}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            Pass:{' '}
                            <strong className="text-amber-400">
                              {visiblePasswords[u.id] ? u.password : '••••••'}
                            </strong>
                            <button
                              type="button"
                              onClick={() =>
                                setVisiblePasswords((prev) => ({ ...prev, [u.id]: !prev[u.id] }))
                              }
                              className="text-gray-500 hover:text-gray-300"
                            >
                              {visiblePasswords[u.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {editingUserId !== u.id && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUserId(u.id);
                            setEditUsernameVal(u.username);
                            setEditPasswordVal(u.password);
                          }}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-amber-400 text-xs font-semibold rounded-lg transition-all"
                        >
                          {language === 'ar' ? 'تغيير اليوزر/الباسورد' : 'Change Pass'}
                        </button>
                      )}
                      {u.id !== currentUser.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
