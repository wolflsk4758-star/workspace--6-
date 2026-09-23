import { useState, useEffect } from 'react';
import { Order } from './types';
import { Language, translations } from './i18n/translations';
import { saveOrders, subscribeToOrders } from './utils/storage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import OrderModal from './components/OrderModal';
import {
  Plus,
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Shield,
  LogOut,
  Globe,
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('wolf_lsk_lang') as Language) || 'en';
  });

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('wolf_lsk_auth');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed.username) {
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem('wolf_lsk_auth');
      }
    }
  }, []);

  // جلب الفواتير فورياً من قاعدة البيانات السحابية (Real-time sync)
  useEffect(() => {
    const unsubscribe = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsubscribe();
  }, []);

  // Apply language direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('wolf_lsk_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('wolf_lsk_auth');
    setIsAuthenticated(false);
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

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRemaining = orders.reduce((sum, o) => sum + o.remainingBalance, 0);
  const activeOrders = orders.filter((o) => o.status === 'In Progress' || o.status === 'Pending').length;
  const totalClients = new Set(orders.map((o) => o.clientName)).size;

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
        language={language}
        onToggleLanguage={toggleLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Shield size={18} className="text-gray-900" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">WOLF LSK</h1>
                <p className="text-[10px] text-amber-400/80 font-medium uppercase tracking-widest -mt-0.5">
                  {t.dashboard}
                </p>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/80 border border-gray-800 rounded-lg text-xs font-medium text-gray-300 hover:text-amber-400 hover:border-amber-500/30 transition-all"
              >
                <Globe size={14} />
                <span>{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/80 border border-gray-800 rounded-lg text-xs font-medium text-gray-300 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>

              {/* New Order Button */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <DollarSign size={16} className="text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{t.totalRevenue}</p>
            <p className="text-lg sm:text-xl font-bold text-white">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-red-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{t.outstanding}</p>
            <p className="text-lg sm:text-xl font-bold text-amber-400">
              ${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock size={16} className="text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{t.activeOrders}</p>
            <p className="text-lg sm:text-xl font-bold text-white">{activeOrders}</p>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users size={16} className="text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{t.totalClients}</p>
            <p className="text-lg sm:text-xl font-bold text-white">{totalClients}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-xl">
              {orders.length} {t.orders}
            </span>
          </div>
        </div>

        {/* Dashboard Table */}
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

        {/* Footer */}
        <footer className="mt-12 pb-6 text-center">
          <p className="text-xs text-gray-600">{t.footerText}</p>
          <p className="text-[10px] text-gray-700 mt-1">{t.dataStored}</p>
        </footer>
      </main>

      {/* Order Modal */}
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
    </div>
  );
}