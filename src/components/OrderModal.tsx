import { useState, useEffect } from 'react';
import { Order, ServiceType, OrderStatus } from '../types';
import { Language, translations } from '../i18n/translations';
import { X } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  editOrder?: Order | null;
  language?: Language;
}

const serviceKeys: ServiceType[] = [
  'Web Development',
  'Commercial Marketing',
  'Ad Campaign Management',
  'SEO & Site Audit',
  'Design & Branding',
  'AI Promotional Videos',
  'Other',
];

const serviceTranslationKeys: Record<ServiceType, string> = {
  'Web Development': 'webDev',
  'Commercial Marketing': 'commercialMarketing',
  'Ad Campaign Management': 'adCampaign',
  'SEO & Site Audit': 'seoAudit',
  'Design & Branding': 'designBranding',
  'AI Promotional Videos': 'aiVideos',
  'Other': 'other',
};

const statusKeys: OrderStatus[] = ['Pending', 'In Progress', 'Completed', 'Delivered'];

const statusTranslationKeys: Record<OrderStatus, string> = {
  Pending: 'pending',
  'In Progress': 'inProgress',
  Completed: 'completed',
  Delivered: 'delivered',
};

export default function OrderModal({ isOpen, onClose, onSave, editOrder, language = 'en' }: OrderModalProps) {
  const t = translations[language];

  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    service: 'Web Development' as ServiceType,
    description: '',
    deliveryDate: '',
    totalAmount: '',
    firstPayment: '',
    firstPaymentDate: '',
    secondPaymentDate: '',
    status: 'Pending' as OrderStatus,
  });

  useEffect(() => {
    if (editOrder) {
      setFormData({
        clientName: editOrder.clientName,
        phoneNumber: editOrder.phoneNumber,
        service: editOrder.service,
        description: editOrder.description,
        deliveryDate: editOrder.deliveryDate,
        totalAmount: editOrder.totalAmount.toString(),
        firstPayment: editOrder.firstPayment.toString(),
        firstPaymentDate: editOrder.firstPaymentDate,
        secondPaymentDate: editOrder.secondPaymentDate,
        status: editOrder.status,
      });
    } else {
      setFormData({
        clientName: '',
        phoneNumber: '',
        service: 'Web Development',
        description: '',
        deliveryDate: '',
        totalAmount: '',
        firstPayment: '',
        firstPaymentDate: '',
        secondPaymentDate: '',
        status: 'Pending',
      });
    }
  }, [editOrder, isOpen]);

  const remainingBalance = Math.max(
    0,
    (parseFloat(formData.totalAmount) || 0) - (parseFloat(formData.firstPayment) || 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order: Order = {
      id: editOrder?.id || crypto.randomUUID(),
      clientName: formData.clientName,
      phoneNumber: formData.phoneNumber,
      service: formData.service,
      description: formData.description,
      deliveryDate: formData.deliveryDate,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      firstPayment: parseFloat(formData.firstPayment) || 0,
      remainingBalance,
      firstPaymentDate: formData.firstPaymentDate,
      secondPaymentDate: formData.secondPaymentDate,
      status: formData.status,
      createdAt: editOrder?.createdAt || new Date().toISOString(),
    };
    onSave(order);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-500/5">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-900/95 backdrop-blur border-b border-amber-500/10 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editOrder ? t.editOrderTitle : t.newOrderTitle}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {editOrder ? t.editOrderDesc : t.newOrderDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500/50"></span>
              {t.clientInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.clientName} *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder={language === 'en' ? 'John Doe' : 'أحمد محمد'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.phoneNumber} *</label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          {/* Service Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500/50"></span>
              {t.serviceDetails}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.serviceRequested} *</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value as ServiceType })}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              >
                {serviceKeys.map((s) => (
                  <option key={s} value={s}>
                    {t[serviceTranslationKeys[s] as keyof typeof t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.projectDescription}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                placeholder={t.projectDescPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.deliveryDateLabel} *</label>
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          {/* Financial Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500/50"></span>
              {t.financialDetails}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.totalAmount} *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder="5000.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.firstPayment} *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.firstPayment}
                  onChange={(e) => setFormData({ ...formData, firstPayment: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder="2500.00"
                />
              </div>
            </div>

            {/* Remaining Balance - Auto-calculated */}
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{t.remainingBalanceLabel}</p>
                  <p className="text-xs text-gray-500">{t.autoCalc}</p>
                </div>
                <p className="text-2xl font-bold text-amber-400">
                  ${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.dateOfFirstPayment}</label>
                <input
                  type="date"
                  value={formData.firstPaymentDate}
                  onChange={(e) => setFormData({ ...formData, firstPaymentDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.secondPaymentDue}</label>
                <input
                  type="date"
                  value={formData.secondPaymentDate}
                  onChange={(e) => setFormData({ ...formData, secondPaymentDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500/50"></span>
              {t.orderStatus}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.statusLabel}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              >
                {statusKeys.map((s) => (
                  <option key={s} value={s}>
                    {t[statusTranslationKeys[s] as keyof typeof t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-700 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg text-gray-900 font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              {editOrder ? t.updateOrder : t.createOrder}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
