import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  Activity, 
  Plus, 
  ListPlus, 
  Sparkles,
  HeartPulse,
  ChevronRight,
  ArrowUpRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { formatIDR, formatIDRShort } from '../utils/format';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    products, 
    sales, 
    logs, 
    settings, 
    insights, 
    setActiveTab, 
    addToast 
  } = useApp();

  // --- Dynamic Calculations based on Current Date ---
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // --- Dynamic calculations ---
  const todaySales = sales.filter(s => s.date === todayStr);
  const todayRevenue = todaySales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
  const todayProfit = todaySales.reduce((sum, s) => sum + s.profit, 0);

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalTransactions = sales.length;

  // --- Best Selling Product ---
  const productSalesMap: Record<string, { name: string; qty: number }> = {};
  sales.forEach(s => {
    if (!productSalesMap[s.productId]) {
      productSalesMap[s.productId] = { name: s.productName, qty: 0 };
    }
    productSalesMap[s.productId].qty += s.quantity;
  });

  let bestProduct = 'Belum ada transaksi';
  let bestQty = 0;
  Object.values(productSalesMap).forEach(p => {
    if (p.qty > bestQty) {
      bestQty = p.qty;
      bestProduct = p.name;
    }
  });

  // --- Monthly Target Calculation ---
  const currentMonthSales = sales.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const currentMonthRevenue = currentMonthSales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
  const currentMonthProfit = currentMonthSales.reduce((sum, s) => sum + s.profit, 0);
  const targetPercent = Math.min(100, (currentMonthRevenue / settings.monthlyRevenueTarget) * 100);

  // --- Business Health Score Calculation ---
  const calculateHealthScore = () => {
    if (products.length === 0) return 0;
    let score = 100;
    
    // Deduct for low stock ratio
    const lowStockRatio = lowStockCount / products.length;
    score -= Math.round(lowStockRatio * 40); // Max deduct 40 points

    // Profit margin points
    const totalRevenueSum = sales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
    const totalProfitSum = sales.reduce((sum, s) => sum + s.profit, 0);
    if (totalRevenueSum > 0) {
      const margin = totalProfitSum / totalRevenueSum;
      if (margin < 0.1) score -= 15; // Low profit margin
      else if (margin >= 0.2) score += 5; // Healthy profit margin
    } else {
      score -= 20; // No sales
    }

    // Target completion pace (current day of the month divided by total days in the month)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const elapsedPace = now.getDate() / (daysInMonth || 30);
    const targetPaceRevenue = settings.monthlyRevenueTarget * elapsedPace;
    if (currentMonthRevenue < targetPaceRevenue * 0.7) {
      score -= 10; // Behind revenue targets
    } else {
      score += 5; // Right on track
    }

    return Math.max(10, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  // Get Health Score Text and Color
  const getHealthMeta = (score: number) => {
    if (score >= 80) return { label: 'Sangat Sehat', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/40', barColor: 'bg-emerald-500' };
    if (score >= 60) return { label: 'Cukup Sehat', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-900/40', barColor: 'bg-blue-500' };
    if (score >= 40) return { label: 'Waspada', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-900/40', barColor: 'bg-amber-500' };
    return { label: 'Kritis', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-900/40', barColor: 'bg-rose-500' };
  };

  const healthMeta = getHealthMeta(healthScore);

  // --- Chart Data Preparation ---
  // Group last 15 days of transactions (June 20 - July 4, 2026)
  const getChartData = () => {
    const dates: string[] = [];
    const now = new Date(todayStr);
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    return dates.map(date => {
      const daySales = sales.filter(s => s.date === date);
      const rev = daySales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
      const prof = daySales.reduce((sum, s) => sum + s.profit, 0);
      
      // Formatting date label (e.g. "25 Jun" or "01 Jul")
      const dObj = new Date(date);
      const day = dObj.getDate().toString().padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const label = `${day} ${monthNames[dObj.getMonth()]}`;

      return {
        rawDate: date,
        dateLabel: label,
        Revenue: rev,
        Profit: prof,
      };
    });
  };

  const chartData = getChartData();

  // --- Category Breakdown Data ---
  const getCategoryData = () => {
    const catMap: Record<string, { revenue: number; profit: number }> = {
      'HP': { revenue: 0, profit: 0 },
      'Aksesoris': { revenue: 0, profit: 0 },
      'Pulsa & Data': { revenue: 0, profit: 0 },
      'Service': { revenue: 0, profit: 0 },
      'Lain-lain': { revenue: 0, profit: 0 },
    };

    sales.forEach(s => {
      if (catMap[s.category]) {
        catMap[s.category].revenue += s.sellingPrice * s.quantity;
        catMap[s.category].profit += s.profit;
      }
    });

    const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

    return Object.entries(catMap).map(([category, vals], idx) => ({
      name: category,
      Revenue: vals.revenue,
      Profit: vals.profit,
      color: colors[idx % colors.length]
    })).filter(item => item.Revenue > 0);
  };

  const categoryData = getCategoryData();

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome row for Desktop */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative Grid Circles */}
        <div className="absolute right-0 top-0 h-40 w-40 bg-white/5 rounded-full translate-x-10 -translate-y-10 blur-xl" />
        <div className="absolute right-1/4 bottom-0 h-28 w-28 bg-indigo-500/10 rounded-full translate-y-10 blur-lg" />
        
        <div className="relative z-10 max-w-3xl">

          <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight mb-2 leading-tight">
            Monitor Bisnis Jadi Lebih Pintar
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-medium">
            Selamat datang di <span className="text-white font-bold underline decoration-amber-400 decoration-2">KonterIQ</span>. Kumpulkan penjualan harian, pantau pergerakan stok aksesoris & HP, dan raih kemandirian finansial toko Anda secara mandiri!
          </p>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        
        {/* KPI: Revenue Today */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Omset Hari Ini</span>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white">{formatIDR(todayRevenue)}</h3>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                +{todaySales.length} Transaksi
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">aktif</span>
            </div>
          </div>
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* KPI: Profit Today */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Laba Bersih Hari Ini</span>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white">{formatIDR(todayProfit)}</h3>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded">
                Margin {todayRevenue > 0 ? ((todayProfit / todayRevenue) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* KPI: Low Stock Alert */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Stok Kritis</span>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white">{lowStockCount} <span className="text-xs font-medium text-slate-400">produk</span></h3>
            <div className="flex items-center gap-1">
              {lowStockCount > 0 ? (
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded animate-pulse">
                  Butuh Restok Segera
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                  Semua Aman
                </span>
              )}
            </div>
          </div>
          <div className={`p-3.5 rounded-xl ${lowStockCount > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        {/* KPI: Total Transactions */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Transaksi</span>
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white">{totalTransactions} <span className="text-xs font-medium text-slate-400">kali</span></h3>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Produk Aktif: {products.length} item
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
            <ShoppingCart className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Target Progress & Health Score side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Business Health Score Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <HeartPulse className="h-4.5 w-4.5 text-rose-500" /> Skor Kesehatan Bisnis
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${healthMeta.bg} ${healthMeta.color} border ${healthMeta.border}`}>
                {healthMeta.label}
              </span>
            </div>

            {/* Circular representation in beautiful progress bar */}
            <div className="flex items-center justify-center py-6">
              <div className="relative flex items-center justify-center">
                {/* Visual circle representation inside clean CSS layout */}
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-blue-600 dark:stroke-blue-400 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - healthScore / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">{healthScore}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">dari 100</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed text-center mt-2 border-t border-slate-100 dark:border-slate-800/60 pt-3.5">
            Skor dihitung otomatis berdasarkan ketersediaan stok, kelancaran transaksi, dan margin keuntungan bersih.
          </p>
        </div>

        {/* Monthly Revenue Target Progress Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Pencapaian Target Bulanan
              </h3>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-semibold uppercase">
                Juli 2026
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-950 dark:text-white font-sans">
                  {targetPercent.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Goal: {formatIDR(settings.monthlyRevenueTarget)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${targetPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Omset Bulan Ini</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{formatIDR(currentMonthRevenue)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Selisih Target</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {currentMonthRevenue >= settings.monthlyRevenueTarget 
                    ? 'Target Terlampaui!' 
                    : formatIDR(settings.monthlyRevenueTarget - currentMonthRevenue)
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100/40 dark:border-blue-900/10 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium block truncate">Best-Seller Toko Saat Ini:</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{bestProduct} ({bestQty} unit)</span>
            </div>
            <ArrowUpRight className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3.5">
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => setActiveTab('sales')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-950 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold text-xs cursor-pointer text-left"
              id="quick-action-catat-penjualan"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600" /> Catat Penjualan Baru
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-950 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold text-xs cursor-pointer text-left"
              id="quick-action-tambah-produk"
            >
              <span className="flex items-center gap-2">
                <ListPlus className="h-4 w-4 text-emerald-600" /> Tambah Produk Baru
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-950 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold text-xs cursor-pointer text-left"
              id="quick-action-restok"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Restok Barang
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-950 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all font-semibold text-xs cursor-pointer text-left"
              id="quick-action-laporan"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-indigo-500" /> Ekspor & Cetak Laporan
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Trend Area Chart (Revenue vs Profit) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Grafik Kinerja Penjualan (15 Hari Terakhir)
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Membandingkan total omset kotor dengan profit bersih harian
              </p>
            </div>
            {/* Custom chart legend indicators */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Omset (Omset HP & Aksesoris)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Laba Bersih (Untung)
              </span>
            </div>
          </div>

          <div className="h-72 w-full text-xs font-medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="dateLabel" 
                  tickLine={false} 
                  stroke="#94A3B8"
                  className="dark:stroke-slate-700"
                />
                <YAxis 
                  tickFormatter={formatIDRShort}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94A3B8"
                  className="dark:stroke-slate-700"
                  width={75}
                />
                <Tooltip
                  formatter={(value: any) => [formatIDR(Number(value)), '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Revenue" 
                  stroke="#2563EB" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Profit" 
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Kontribusi Kategori
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-5">
              Omset kotor yang disumbang oleh masing-masing kategori produk
            </p>

            {categoryData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-center text-xs text-slate-400">
                Belum ada data kontribusi penjualan
              </div>
            ) : (
              <div className="h-48 w-full text-xs font-medium">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="#94A3B8" width={80} />
                    <Tooltip
                      formatter={(value: any) => [formatIDR(Number(value)), 'Omset']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="Revenue" radius={[0, 8, 8, 0]} barSize={14}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {formatIDR(item.Revenue)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Smart Business Insights & Low Stock & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Smart Business Insights List */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" /> Smart Business Insight
              </h3>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">
                Saran Cerdas (Non-AI)
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {insights.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Data belum mencukupi untuk membuat business insights.
                </div>
              ) : (
                insights.map((insight) => {
                  let border = 'border-slate-100 dark:border-slate-800';
                  let iconBg = 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
                  
                  if (insight.type === 'success') {
                    border = 'border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/20 dark:bg-emerald-950/10';
                    iconBg = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
                  } else if (insight.type === 'warning') {
                    border = 'border-amber-100 dark:border-amber-950/40 bg-amber-50/20 dark:bg-amber-950/10';
                    iconBg = 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400';
                  } else if (insight.type === 'danger') {
                    border = 'border-rose-100 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10';
                    iconBg = 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400';
                  } else if (insight.type === 'info') {
                    border = 'border-blue-100 dark:border-blue-950/40 bg-blue-50/20 dark:bg-blue-950/10';
                    iconBg = 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400';
                  }

                  return (
                    <div key={insight.id} className={`flex items-start gap-3 p-3.5 rounded-xl border ${border}`}>
                      <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                          {insight.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-3 border-t border-slate-100 dark:border-slate-800/60 pt-3">
            Analisis data berjalan langsung di browser menggunakan aturan logika bisnis ritel UMKM mandiri.
          </div>
        </div>

        {/* Recent Activities Logs */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-blue-600" /> Log Aktivitas & Riwayat Hari Ini
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada catatan aktivitas di Konter HP.
                </div>
              ) : (
                logs.slice(0, 5).map((log) => {
                  let dotColor = 'bg-slate-400';
                  let bgBadge = 'bg-slate-50 dark:bg-slate-800 text-slate-600';
                  
                  if (log.type === 'sale') {
                    dotColor = 'bg-emerald-500';
                    bgBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
                  } else if (log.type === 'product_add') {
                    dotColor = 'bg-blue-500';
                    bgBadge = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
                  } else if (log.type === 'stock_alert') {
                    dotColor = 'bg-rose-500 animate-ping';
                    bgBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
                  }

                  const formattedTime = new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

                  return (
                    <div key={log.id} className="relative pl-5 pb-1 border-l border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      {/* Interactive indicator dot */}
                      <span className={`absolute left-[-4.5px] top-[5px] h-2 w-2 rounded-full ${dotColor}`} />
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200">
                            {log.message}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {formattedTime}
                          </span>
                        </div>
                        {log.details && (
                          <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-center mt-3 border-t border-slate-100 dark:border-slate-800/60 pt-3">
            <button
              onClick={() => setActiveTab('settings')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              id="btn-dashboard-view-logs"
            >
              Lihat Pengaturan Sistem Selengkapnya
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
