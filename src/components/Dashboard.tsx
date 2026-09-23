import { Order } from '../types';
import { Language, translations } from '../i18n/translations';
import StatusBadge from './StatusBadge';
import { Edit2, Trash2, Calendar, FileText } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface DashboardProps {
  orders: Order[];
  searchQuery: string;
  language: Language;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export default function Dashboard({ orders, searchQuery, language, onEdit, onDelete }: DashboardProps) {
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
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-start py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.client}</th>
              <th className="text-start py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.service}</th>
              <th className="text-start py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.deliveryDate}</th>
              <th className="text-end py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.total}</th>
              <th className="text-end py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.remaining}</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.status}</th>
              <th className="text-end py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.actions}</th>
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
                  <span className="text-sm text-gray-300">{order.service}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Calendar size={14} className="text-gray-500" />
                    {new Date(order.deliveryDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td className="py-4 px-4 text-end">
                  <span className="text-sm font-medium text-white">
                    ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-4 px-4 text-end">
                  <span className={`text-sm font-semibold ${order.remainingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    ${order.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <StatusBadge status={order.status} language={language} />
                </td>
                <td className="py-4 px-4 text-end">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePrintPDF(order)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                      title={t.printPdf}
                    >
                      <FileText size={15} />
                    </button>
                    <button
                      onClick={() => onEdit(order)}
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                      title={t.edit}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(order.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      title={t.delete}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl hover:border-amber-500/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{order.clientName}</p>
                <p className="text-xs text-gray-500">{order.phoneNumber}</p>
              </div>
              <StatusBadge status={order.status} language={language} />
            </div>
            <div className="space-y-2 mb-3">
              <p className="text-xs text-gray-400">
                <span className="text-gray-500">{t.service}:</span> {order.service}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar size={12} />
                  {new Date(order.deliveryDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-white font-medium">
                  ${order.totalAmount.toLocaleString()}
                </div>
              </div>
              {order.remainingBalance > 0 && (
                <p className="text-xs text-amber-400 font-medium">
                  {t.remaining}: ${order.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-700/50">
              <button
                onClick={() => handlePrintPDF(order)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-300 hover:text-blue-400 hover:bg-blue-400/5 rounded-lg transition-all"
              >
                <FileText size={13} /> PDF
              </button>
              <button
                onClick={() => onEdit(order)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-300 hover:text-amber-400 hover:bg-amber-400/5 rounded-lg transition-all"
              >
                <Edit2 size={13} /> {t.edit}
              </button>
              <button
                onClick={() => onDelete(order.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-300 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
              >
                <Trash2 size={13} /> {t.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
