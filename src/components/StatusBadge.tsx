import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  Pending: { bg: 'bg-gray-800/60 border-gray-600', text: 'text-gray-300', dot: 'bg-gray-400' },
  'In Progress': { bg: 'bg-amber-900/30 border-amber-600/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  Completed: { bg: 'bg-emerald-900/30 border-emerald-600/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  Delivered: { bg: 'bg-blue-900/30 border-blue-600/50', text: 'text-blue-300', dot: 'bg-blue-400' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
      {status}
    </span>
  );
}
