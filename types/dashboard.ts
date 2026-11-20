export interface DashboardSummary {
  total_revenue: number;
  total_orders: number;
  paid_orders: number;
  total_customers: number;
}

export interface DailySalesPoint {
  sale_date: string;
  order_count: number;
  revenue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  total_quantity: number;
  total_revenue: number;
}

export interface RecentOrder {
  id: string;
  order_no: string;
  customer_name: string;
  customer_email: string;
  status: 'paid' | 'pending' | 'cancelled';
  ordered_at: string;
  total_amount: number;
}