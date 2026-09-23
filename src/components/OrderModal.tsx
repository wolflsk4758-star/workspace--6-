import { useState, useEffect } from 'react';
import { Order, ServiceType, OrderStatus } from '../types';
import { X } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  editOrder?: Order | null;
}

const services: ServiceType[] = [
  'Web Development',
  'Commercial Marketing',
  'Ad Campaign Management',
  'SEO & Site Audit',
  'Design & Branding',
  'AI Promotional Videos',
  'Other',
];

const statuses: OrderStatus[] = ['Pending', 'In Progress', 'Completed', 'Delivered'];

export default function OrderModal({ isOpen, onClose, onSave, editOrder }: OrderModalProps) {
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
              {editOrder ? 'Edit Order' : 'New Order'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {editOrder ? 'Update the order details below' : 'Fill in the client and project details'}
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
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number *</label>
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
              Service Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Service Requested *</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value as ServiceType })}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              >
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                placeholder="Describe the project scope, requirements, and deliverables..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Delivery Date *</label>
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
              Financial Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Total Amount ($) *</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-1.5">First Payment / Deposit ($) *</label>
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
                  <p className="text-sm text-gray-400">Remaining Balance</p>
                  <p className="text-xs text-gray-500">Auto-calculated: Total - First Payment</p>
                </div>
                <p className="text-2xl font-bold text-amber-400">
                  ${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Date of First Payment</label>
                <input
                  type="date"
                  value={formData.firstPaymentDate}
                  onChange={(e) => setFormData({ ...formData, firstPaymentDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Remaining Balance Due Date</label>
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
              Order Status
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
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
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg text-gray-900 font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              {editOrder ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
