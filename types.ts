
export type Role = 'manager' | 'worker' | 'super-admin';
export type UserStatus = 'active' | 'pending' | 'rejected';
export type PlanType = 'free' | 'growth' | 'pro';
export type Language = 'en' | 'rw' | 'fr';
export type CurrencyCode = 'RWF' | 'UGX' | 'KES' | 'USD' | 'EUR';
export type AuthMode = 'login' | 'new-shop' | 'staff' | 'forgot';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string;
  status: UserStatus;
  companyName?: string;
  currency?: CurrencyCode;
  plan?: PlanType;
  // Track the original intended plan regardless of current activation status
  actualPlan?: PlanType;
  subscriptionEnd?: string;
}

export interface Company {
  id: string;
  name: string;
  currency: CurrencyCode;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  category: string;
  lowStockThreshold: number;
  lastRestockedAt: string;
  companyId: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  timestamp: string;
  sellerName: string;
  sellerId: string;
  companyId: string;
}

export interface ActivityLog {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface Subscription {
  company_id: string;
  plan: PlanType;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  payer_name: string | null;
  payer_phone: string | null;
  unlock_pin: string | null;
}

export interface SupportTicket {
  id: string;
  company_id: string;
  user_id: string;
  user_name: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  admin_reply?: string;
  created_at: string;
  updated_at: string;
}
