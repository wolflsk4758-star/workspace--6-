import { Order } from '../types';
import { Language, translations } from '../i18n/translations';
import {
  Edit2,
  Trash2,
  Calendar,
  FileText,
  Loader2,
  CheckCircle2,
  Send,
  Clock,
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface DashboardProps {
  orders: Order[];
  searchQuery: string;
  language: Language;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

// مكون الحالات المتحركة (أنيميشن خاص لكل حالة)
function AnimatedStatusBadge({ status, language }: { status: string; language: Language }) {
  const isAr = language === 'ar';

  // 1. قيد التنفيذ (In Progress) — حركة رادار متوهج + دوران مستمر يجذب النظر
  if (status === 'In Progress') {
    return (
      <span className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-300 border border-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.35)] animate-pulse">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-90"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
        <Loader2 size={13} className="animate-spin text-amber-400" />
        <span>{isAr ? 'قيد التنفيذ' : 'In Progress'}</span>
      </span>
    );
  }

  // 2. مكتمل (Completed) — إضاءة خضراء صافية مع بريق هادئ يدل على الإنجاز
  if (status === 'Completed') {
    return (
      <span className="relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all">
        <span className=" status-shimmer-bar " />
        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 status-completed-icon" />
        <span>{isAr ? 'مكتمل ✓' : 'Completed'}</span>
      </span>
    );
  }

  // 3. تم التسليم (Delivered) — لون أزرق سماوي مع حركة سهم تسليم انسيابية
  if (status === 'Delivered') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-[0_0_12px_rgba(14,165,233,0.2)]">
        <Send size={13} className="text-sky-400 shrink-0 status-delivered-icon" />
        <span>{isAr ? 'تم التسليم' : 'Delivered'}</span>
      </span>
    );
  }

  // 4. قيد الانتظار (Pending) أو أي حالة أخرى
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
      <Clock size={13} className="text-gray-400 animate-pulse" />
      <span>{isAr ? 'قيد الانتظار' : status}</span>
    </span>
  );
}

export default function Dashboard({
  orders,
  searchQuery,
  language,
  onEdit,
  onDelete,
}: DashboardProps) {
  const t = translations[language];

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.clientName.toLowerCase().includes(query) ||
      order.phoneNumber.includes(query) ||
      order.service.toLowerCase().includes(query)
    );
  });

  const handlePrintPDF = async (order: Order) => {
    try {
      await generateInvoicePDF(order, language);
    } catch (err) {
      console.error('PDF generation failed:', err);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center mb-6">
          <span className="text-3xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.noOrders}</h3>
        <p className="text-gray-400 max-w-md">{t.noOrdersDesc}</p>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{t.noResults}</h3>
        <p className="text-gray-400 text-sm">{t.noResultsDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* حركات CSS المخصصة للحالات */}
      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          50%, 100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes completedBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.16); }
        }
        @keyframes deliveredFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(2px, -2px); }
        }
        .status-shimmer-bar {
          position: absolute;
          inset: 0;
          width: 45%;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.22), transparent);
          animation: shimmerSweep 3.5s infinite ease-in-out;
          pointer-events: none;
        }
        .status-completed-icon {
          animation: completedBounce 2.4s infinite ease-in-out;
        }
        .status-delivered-icon {
          animation: deliveredFloat 2s infinite ease-in-out;
        }
      `}</style>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-start py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.client}
              </th>
              <th className="text-start py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.service}
              </th>
              <th className="text-start py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.deliveryDate}
              </th>
              <th className="text-end py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.total}
              </th>
              <th className="text-end py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.remaining}
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.status}
              </th>
              <th className="text-end py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-white">{order.clientName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.phoneNumber}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm
