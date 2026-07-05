export type Category = 'HP' | 'Aksesoris' | 'Pulsa & Data' | 'Service' | 'Lain-lain';

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number; // For low-stock alerts
  image?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  category: Category;
  quantity: number;
  purchasePrice: number; // Capturing snapshot of cost
  sellingPrice: number;  // Capturing actual selling price
  profit: number;       // (sellingPrice - purchasePrice) * quantity
  date: string;         // ISO format YYYY-MM-DD
  timestamp: string;    // ISO timestamp
}

export interface ActivityLog {
  id: string;
  type: 'sale' | 'product_add' | 'product_update' | 'product_delete' | 'stock_alert' | 'system';
  message: string;
  timestamp: string;
  details?: string;
}

export interface BusinessInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  monthlyRevenueTarget: number;
  currency: string; // Defaults to IDR
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
