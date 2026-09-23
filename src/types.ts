export type ServiceType =
  | 'Web Development'
  | 'Commercial Marketing'
  | 'Ad Campaign Management'
  | 'SEO & Site Audit'
  | 'Design & Branding'
  | 'AI Promotional Videos'
  | 'Other';

export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delivered';

export interface Order {
  id: string;
  clientName: string;
  phoneNumber: string;
  service: ServiceType;
  description: string;
  deliveryDate: string;
  totalAmount: number;
  firstPayment: number;
  remainingBalance: number;
  firstPaymentDate: string;
  secondPaymentDate: string;
  status: OrderStatus;
  createdAt: string;
}
