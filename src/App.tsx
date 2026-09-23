import { useState, useEffect } from 'react';
import { Order } from './types';
import { loadOrders, saveOrders } from './utils/storage';
import Dashboard from './components/Dashboard';
import OrderModal from './components/OrderModal';
import StatusBadge from './components/StatusBadge';
import {
  Plus,
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Shield,
} from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const handleSaveOrder = (order: Order) => {
    setOrders((prev) => {
      const existing = prev.findIndex((o) => o.id === order.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = order;
        return updated;
      }
      return [order, ...prev];
    });
    setEditingOrder(null);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRemaining = orders.reduce((sum, o) => sum + o.remainingBalance, 0);
  const activeOrders = orders.filter((o) => o.status === 'In Progress' || o.status === 'Pending').length;
  const totalClients = new Set(orders.map((o) => o.clientName)).size;

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
                <p className="text-[10px] text-amber-400/80 font-medium uppercase tracking-widest -mt-0.5">Agency CRM</p>
              </div>
            </div>

            {/* New Order Button */}
            <button
              onClick={handleNewOrder}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg text-gray-900 text-sm font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="hidden sm:inline">New Order</span>
            </button>
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
            <p className="text-xs text-gray-500 mb-0.5">Total Revenue</p>
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
            <p className="text-xs text-gray-500 mb-0.5">Outstanding</p>
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
            <p className="text-xs text-gray-500 mb-0.5">Active Orders</p>
            <p className="text-lg sm:text-xl font-bold text-white">{activeOrders}</p>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800/50 rounded-xl hover:border-amber-500/20 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users size={16} className="text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-0.5">Total Clients</p>
            <p className="text-lg sm:text-xl font-bold text-white">{totalClients}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by client name, phone, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-xl">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Dashboard Table */}
        <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">All Orders</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage your client projects and payments</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <StatusBadge status="Pending" />
              <StatusBadge status="In Progress" />
              <StatusBadge status="Completed" />
            </div>
          </div>
          <Dashboard
            orders={orders}
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pb-6 text-center">
          <p className="text-xs text-gray-600">
            © 2024 WOLF LSK Agency — Client & Order Management System
          </p>
          <p className="text-[10px] text-gray-700 mt-1">
            Data stored locally in your browser
          </p>
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
      />
    </div>
  );
}
