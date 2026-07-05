import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Sale, ActivityLog, ShopSettings, Toast, BusinessInsight, Category } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_LOGS, DEFAULT_SETTINGS } from '../mockData';

interface AppContextType {
  products: Product[];
  sales: Sale[];
  logs: ActivityLog[];
  settings: ShopSettings;
  theme: 'light' | 'dark';
  activeTab: string;
  toasts: Toast[];
  insights: BusinessInsight[];
  isAuthenticated: boolean;
  
  // Tab control
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Authentication & Splash actions
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updateProduct: (product: Product) => { success: boolean; message: string };
  deleteProduct: (id: string) => { success: boolean; message: string };
  
  // Sales actions
  recordSale: (productId: string, quantity: number, customSellingPrice?: number) => { success: boolean; message: string };
  deleteSale: (saleId: string) => { success: boolean; message: string };
  
  // Utility actions
  addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  removeToast: (id: string) => void;
  resetToMockData: () => void;
  clearAllData: () => void;
  updateSettings: (settings: ShopSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  
  // --- Auth & Splash States ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('konteriq_auth') === 'true';
  });

  // --- Load Initial Data from LocalStorage ---
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('konteriq_products');
      const storedSales = localStorage.getItem('konteriq_sales');
      const storedLogs = localStorage.getItem('konteriq_logs');
      const storedSettings = localStorage.getItem('konteriq_settings');
      const storedTheme = localStorage.getItem('konteriq_theme');

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('konteriq_products', JSON.stringify(INITIAL_PRODUCTS));
      }

      if (storedSales) setSales(JSON.parse(storedSales));
      else {
        setSales(INITIAL_SALES);
        localStorage.setItem('konteriq_sales', JSON.stringify(INITIAL_SALES));
      }

      if (storedLogs) setLogs(JSON.parse(storedLogs));
      else {
        setLogs(INITIAL_LOGS);
        localStorage.setItem('konteriq_logs', JSON.stringify(INITIAL_LOGS));
      }

      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed.ownerName === 'Bang Abid') {
          parsed.ownerName = 'Owner';
          localStorage.setItem('konteriq_settings', JSON.stringify(parsed));
        }
        setSettings(parsed);
      } else {
        setSettings(DEFAULT_SETTINGS);
        localStorage.setItem('konteriq_settings', JSON.stringify(DEFAULT_SETTINGS));
      }

      if (storedTheme) {
        const parsedTheme = storedTheme as 'light' | 'dark';
        setThemeState(parsedTheme);
        document.documentElement.classList.toggle('dark', parsedTheme === 'dark');
      } else {
        setThemeState('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error loading data from LocalStorage:', e);
      // Fallbacks
      setProducts(INITIAL_PRODUCTS);
      setSales(INITIAL_SALES);
      setLogs(INITIAL_LOGS);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // --- Toggle Theme ---
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('konteriq_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // --- Save helper functions to keep LocalStorage in sync ---
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('konteriq_products', JSON.stringify(newProducts));
  };

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem('konteriq_sales', JSON.stringify(newSales));
  };

  const saveLogs = (newLlogs: ActivityLog[]) => {
    setLogs(newLlogs);
    localStorage.setItem('konteriq_logs', JSON.stringify(newLlogs));
  };

  const saveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    localStorage.setItem('konteriq_settings', JSON.stringify(newSettings));
  };

  // --- Toast Manager ---
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Log Activity Utility ---
  const logActivity = (type: ActivityLog['type'], message: string, details?: string) => {
    const newLog: ActivityLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
      details
    };
    saveLogs([newLog, ...logs].slice(0, 50)); // Keep last 50 activities
  };

  // --- Product CRUD Actions ---
  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
    // Check duplicates
    const duplicate = products.find((prod) => prod.name.toLowerCase().trim() === p.name.toLowerCase().trim());
    if (duplicate) {
      return { success: false, message: `Nama produk "${p.name}" sudah terdaftar.` };
    }

    // Validations
    if (p.purchasePrice < 0 || p.sellingPrice < 0) {
      return { success: false, message: 'Harga beli dan harga jual tidak boleh negatif.' };
    }
    if (p.purchasePrice > p.sellingPrice) {
      addToast('warning', 'Peringatan: Harga jual lebih rendah dari harga beli!');
    }
    if (p.stock < 0) {
      return { success: false, message: 'Stok awal tidak boleh negatif.' };
    }

    const newProduct: Product = {
      ...p,
      id: 'prod_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedProducts = [newProduct, ...products];
    saveProducts(updatedProducts);
    logActivity('product_add', `Produk baru ditambahkan: ${p.name}`, `Kategori: ${p.category}, Stok: ${p.stock}`);
    addToast('success', `Produk "${p.name}" berhasil ditambahkan.`);
    return { success: true, message: 'Produk berhasil ditambahkan' };
  };

  const updateProduct = (updatedProd: Product) => {
    // Check duplicates with other products
    const duplicate = products.find(
      (p) => p.id !== updatedProd.id && p.name.toLowerCase().trim() === updatedProd.name.toLowerCase().trim()
    );
    if (duplicate) {
      return { success: false, message: `Nama produk "${updatedProd.name}" sudah digunakan oleh produk lain.` };
    }

    if (updatedProd.purchasePrice < 0 || updatedProd.sellingPrice < 0) {
      return { success: false, message: 'Harga beli dan harga jual tidak boleh negatif.' };
    }
    if (updatedProd.stock < 0) {
      return { success: false, message: 'Stok tidak boleh negatif.' };
    }

    const updatedProducts = products.map((p) => (p.id === updatedProd.id ? updatedProd : p));
    saveProducts(updatedProducts);
    logActivity('product_update', `Produk diperbarui: ${updatedProd.name}`, `Stok sekarang: ${updatedProd.stock}`);
    addToast('success', `Produk "${updatedProd.name}" berhasil diperbarui.`);
    return { success: true, message: 'Produk berhasil diperbarui' };
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return { success: false, message: 'Produk tidak ditemukan.' };

    const updatedProducts = products.filter((p) => p.id !== id);
    saveProducts(updatedProducts);
    logActivity('product_delete', `Produk dihapus: ${prod.name}`);
    addToast('info', `Produk "${prod.name}" telah dihapus.`);
    return { success: true, message: 'Produk berhasil dihapus' };
  };

  // --- Sales Actions ---
  const recordSale = (productId: string, quantity: number, customSellingPrice?: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: 'Produk tidak ditemukan.' };
    }

    if (quantity <= 0) {
      return { success: false, message: 'Jumlah kuantitas harus minimal 1 unit.' };
    }

    if (product.stock < quantity) {
      return { success: false, message: `Stok tidak mencukupi. Stok saat ini: ${product.stock} unit.` };
    }

    const actualSellingPrice = customSellingPrice !== undefined ? customSellingPrice : product.sellingPrice;
    const profitPerUnit = actualSellingPrice - product.purchasePrice;
    const totalProfit = profitPerUnit * quantity;

    // Deduct stock
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        const newStock = p.stock - quantity;
        
        // Low stock warning trigger
        if (newStock <= p.minStock) {
          setTimeout(() => {
            logActivity('stock_alert', `Stok Kritis: "${p.name}" tinggal ${newStock} unit!`, `Batas minimum: ${p.minStock}`);
            addToast('warning', `Stok kian menipis! "${p.name}" tersisa ${newStock} unit.`);
          }, 500);
        }
        
        return { ...p, stock: newStock };
      }
      return p;
    });

    // Create Sale record
    const todayStr = new Date().toISOString().split('T')[0]; // Current date YYYY-MM-DD
    const newSale: Sale = {
      id: 'sale_' + Math.random().toString(36).substring(2, 9),
      productId,
      productName: product.name,
      category: product.category,
      quantity,
      purchasePrice: product.purchasePrice,
      sellingPrice: actualSellingPrice,
      profit: totalProfit,
      date: todayStr,
      timestamp: new Date().toISOString()
    };

    saveProducts(updatedProducts);
    saveSales([newSale, ...sales]);
    logActivity(
      'sale', 
      `Transaksi Berhasil: ${product.name} x${quantity}`, 
      `Total: Rp ${(actualSellingPrice * quantity).toLocaleString('id-ID')}, Untung: Rp ${totalProfit.toLocaleString('id-ID')}`
    );
    addToast('success', `Berhasil menjual ${product.name} sebanyak ${quantity} unit.`);
    return { success: true, message: 'Penjualan berhasil dicatat' };
  };

  const deleteSale = (saleId: string) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return { success: false, message: 'Transaksi tidak ditemukan.' };

    // Restore stock back to the product
    const updatedProducts = products.map((p) => {
      if (p.id === sale.productId) {
        return { ...p, stock: p.stock + sale.quantity };
      }
      return p;
    });

    const updatedSales = sales.filter((s) => s.id !== saleId);
    saveProducts(updatedProducts);
    saveSales(updatedSales);
    logActivity('system', `Transaksi dibatalkan/dihapus: ${sale.productName} x${sale.quantity}`);
    addToast('info', `Transaksi untuk "${sale.productName}" dibatalkan.`);
    return { success: true, message: 'Transaksi berhasil dihapus' };
  };

  // --- Settings Action ---
  const updateSettings = (newSettings: ShopSettings) => {
    saveSettings(newSettings);
    logActivity('system', `Profil toko diperbarui: ${newSettings.shopName}`);
    addToast('success', 'Pengaturan toko berhasil disimpan.');
  };

  // --- Reset & Clean actions ---
  const resetToMockData = () => {
    saveProducts(INITIAL_PRODUCTS);
    saveSales(INITIAL_SALES);
    saveLogs(INITIAL_LOGS);
    saveSettings(DEFAULT_SETTINGS);
    addToast('info', 'Semua data telah direset ke data sampel bawaan.');
    logActivity('system', 'Data toko direset ke data sampel bawaan.');
  };

  const clearAllData = () => {
    saveProducts([]);
    saveSales([]);
    saveLogs([]);
    saveSettings({
      shopName: 'Konter HP Baru',
      ownerName: 'Owner',
      monthlyRevenueTarget: 10000000,
      currency: 'IDR'
    });
    addToast('warning', 'Semua data transaksi dan produk berhasil dihapus.');
    logActivity('system', 'Semua data dihapus. Memulai lembar kerja baru.');
  };

  // --- Calculate automated business insights dynamically ---
  useEffect(() => {
    const list: BusinessInsight[] = [];
    if (products.length === 0) return;

    // 1. Low stock count
    const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
    if (lowStockCount > 0) {
      list.push({
        id: 'i1',
        type: 'danger',
        title: `${lowStockCount} Produk Menipis`,
        description: `Ada ${lowStockCount} produk dengan stok di bawah batas minimum. Harap segera restok untuk menghindari kehilangan potensi penjualan.`
      });
    }

    // 2. Best-selling category this month
    const categoryRevenueMap: Record<string, number> = {};
    const categoryProfitMap: Record<string, number> = {};
    sales.forEach((s) => {
      categoryRevenueMap[s.category] = (categoryRevenueMap[s.category] || 0) + (s.sellingPrice * s.quantity);
      categoryProfitMap[s.category] = (categoryProfitMap[s.category] || 0) + s.profit;
    });

    let bestCategory = '';
    let maxProfit = 0;
    Object.entries(categoryProfitMap).forEach(([cat, profit]) => {
      if (profit > maxProfit) {
        maxProfit = profit;
        bestCategory = cat;
      }
    });

    if (bestCategory) {
      const revenue = categoryRevenueMap[bestCategory] || 0;
      list.push({
        id: 'i2',
        type: 'success',
        title: `Kategori Teruntung: ${bestCategory}`,
        description: `Kategori ${bestCategory} menghasilkan profit terbesar sebesar Rp ${maxProfit.toLocaleString('id-ID')} dengan total omset Rp ${revenue.toLocaleString('id-ID')}.`
      });
    }

    // 3. Profit margin warning (check if any product has low margin)
    const lowMarginProducts = products.filter((p) => {
      if (p.sellingPrice <= 0) return false;
      const margin = (p.sellingPrice - p.purchasePrice) / p.sellingPrice;
      return margin < 0.05; // Less than 5% margin is extremely low
    });

    if (lowMarginProducts.length > 0) {
      list.push({
        id: 'i3',
        type: 'warning',
        title: `${lowMarginProducts.length} Produk Margin Tipis`,
        description: `${lowMarginProducts.slice(0, 2).map(p => p.name).join(', ')} dijual dengan margin laba di bawah 5%. Pertimbangkan untuk menyesuaikan harga.`
      });
    }

    // 4. Target analysis
    const currentMonthRevenue = sales
      .filter((s) => {
        const saleDate = new Date(s.date);
        const now = new Date();
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, s) => sum + s.sellingPrice * s.quantity, 0);

    const targetPercent = (currentMonthRevenue / settings.monthlyRevenueTarget) * 100;
    if (targetPercent >= 100) {
      list.push({
        id: 'i4',
        type: 'success',
        title: 'Target Penjualan Tercapai!',
        description: `Luar biasa! Omset bulan ini (${(targetPercent).toFixed(1)}%) telah menembus target bulanan Rp ${settings.monthlyRevenueTarget.toLocaleString('id-ID')}.`
      });
    } else if (targetPercent >= 75) {
      list.push({
        id: 'i5',
        type: 'info',
        title: 'Mendekati Target Bulanan',
        description: `Hampir sampai! Omset bulanan saat ini mencapai Rp ${currentMonthRevenue.toLocaleString('id-ID')} (${(targetPercent).toFixed(1)}% dari target). Pertahankan performa!`
      });
    } else if (targetPercent < 30) {
      list.push({
        id: 'i5_low',
        type: 'warning',
        title: 'Evaluasi Penjualan Diperlukan',
        description: `Pencapaian target bulanan baru mencapai ${(targetPercent).toFixed(1)}%. Disarankan meningkatkan promosi paket bundling aksesoris.`
      });
    }

    // 5. High-Value stock risk
    const highValueProductsInStock = products.filter(p => p.category === 'HP' && p.stock > 10);
    if (highValueProductsInStock.length > 0) {
      list.push({
        id: 'i6',
        type: 'info',
        title: 'Aset Likuid HP Tinggi',
        description: `Ada ${highValueProductsInStock.length} jenis HP dengan stok di atas 10 unit. Pantau tren pasar agar tidak menimbun modal terlalu lama.`
      });
    }

    setInsights(list);
  }, [products, sales, settings]);

  // --- Auth & Splash Actions ---
  const login = (username: string, password: string) => {
    if (username.trim() === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('konteriq_auth', 'true');
      addToast('success', 'Selamat datang! Login berhasil.');
      return { success: true, message: 'Login berhasil' };
    }
    return { success: false, message: 'Username atau password salah.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('konteriq_auth');
    addToast('info', 'Anda telah berhasil log out.');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        sales,
        logs,
        settings,
        theme,
        activeTab,
        toasts,
        insights,
        isAuthenticated,
        setActiveTab,
        setTheme,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        recordSale,
        deleteSale,
        addToast,
        removeToast,
        resetToMockData,
        clearAllData,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
