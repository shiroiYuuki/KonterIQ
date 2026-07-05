import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  RefreshCw, 
  Sparkles,
  Info,
  Package,
  XCircle,
  TrendingDown
} from 'lucide-react';
import { formatIDR } from '../utils/format';

export const InventoryView: React.FC = () => {
  const { products, updateProduct, addToast } = useApp();

  // Quick Inline restock adjustment state
  const [adjustingProductId, setAdjustingProductId] = useState<string | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState('10');

  // --- Calculations ---
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);
  const outOfStockItems = products.filter(p => p.stock === 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const healthyItems = products.filter(p => p.stock > p.minStock);

  // --- Instant Adjust Stock ---
  const handleQuickRestock = (product: Product, amt: number) => {
    const newStock = product.stock + amt;
    if (newStock < 0) {
      addToast('error', 'Stok tidak boleh bernilai negatif!');
      return;
    }

    const updated = {
      ...product,
      stock: newStock
    };

    const res = updateProduct(updated);
    if (res.success) {
      addToast('success', `Berhasil menyesuaikan stok "${product.name}" menjadi ${newStock} unit.`);
    }
  };

  const handleCustomAdjustmentSubmit = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    const amt = parseInt(adjustmentValue);
    if (isNaN(amt)) {
      addToast('error', 'Masukkan angka penyesuaian yang valid.');
      return;
    }

    handleQuickRestock(product, amt);
    setAdjustingProductId(null);
    setAdjustmentValue('10');
  };

  // Restock Recommendation logic
  const getRestockSuggestion = (p: Product) => {
    if (p.stock > p.minStock) return 0;
    // Suggest buying enough to reach 3x minStock
    return Math.max(5, (p.minStock * 3) - p.stock);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
          Pemantauan Stok & Analisis Restok
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
          Otomatis mendeteksi barang menipis, menghitung volume pengadaan ideal, dan memperbarui ketersediaan rak toko secara langsung.
        </p>
      </div>

      {/* Summary KPI Cards for Inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        
        {/* KPI: Total Stock Quantity */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Unit Tersedia</span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-900 dark:text-white">{totalStockItems} <span className="text-xs font-medium text-slate-400">Pcs</span></h3>
            <span className="text-[10px] text-slate-400 font-medium">Beban aset fisik di rak</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400">
            <Package className="h-5 w-5" />
          </div>
        </div>

        {/* KPI: Out of Stock */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stok Habis (Kosong)</span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-900 dark:text-white">{outOfStockItems.length} <span className="text-xs font-medium text-slate-400">Barang</span></h3>
            <span className="text-[10px] text-rose-500 font-bold">Kehilangan omset potensial</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="h-5 w-5" />
          </div>
        </div>

        {/* KPI: Low stock Alert */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Peringatan Menipis</span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-900 dark:text-white">{lowStockItems.length} <span className="text-xs font-medium text-slate-400">Barang</span></h3>
            <span className="text-[10px] text-amber-500 font-semibold">Mendekati limit aman</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* KPI: Healthy Stock */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kondisi Aman (Sehat)</span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-sans text-slate-900 dark:text-white">{healthyItems.length} <span className="text-xs font-medium text-slate-400">Barang</span></h3>
            <span className="text-[10px] text-emerald-500 font-semibold">Tercukupi & siap dijual</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Procurement Advisor Panel */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-amber-500" /> Analisis Pengadaan & Rekomendasi Restok Toko
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Menghitung kuantitas pembelian optimal berdasarkan batas minimum pengaman agar modal berputar maksimal.
            </p>
          </div>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100/50 px-2.5 py-0.5 rounded-full uppercase">
            Saran Otomatis
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">Belum ada barang untuk dianalisis.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filter(p => p.stock <= p.minStock).length === 0 ? (
              <div className="col-span-full p-6 text-center border border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-950/20 text-xs font-bold text-slate-500 dark:text-slate-400 flex flex-col items-center gap-1.5">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" /> Semua stok barang di toko dalam kondisi aman. Tidak ada barang yang memerlukan pengadaan mendesak!
              </div>
            ) : (
              products.filter(p => p.stock <= p.minStock).map(p => {
                const suggestionAmt = getRestockSuggestion(p);
                const estimatedCost = suggestionAmt * p.purchasePrice;

                return (
                  <div key={p.id} className="p-4 border border-rose-100 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/5 rounded-xl flex flex-col justify-between space-y-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                          {p.stock === 0 ? 'Stok Kosong' : 'Stok Menipis'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{p.brand}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{p.name}</h4>
                      
                      <div className="flex items-baseline justify-between text-xs font-medium pt-1">
                        <span className="text-slate-400">Stok Saat Ini:</span>
                        <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{p.stock} / {p.minStock} min</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-500">Saran Pembelian:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">+{suggestionAmt} Pcs</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-500">Estimasi Modal Beli:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{formatIDR(estimatedCost)}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleQuickRestock(p, suggestionAmt)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors"
                        id={`btn-suggest-restock-apply-${p.id}`}
                      >
                        <Plus className="h-3.5 w-3.5" /> Restok +{suggestionAmt}
                      </button>
                      <button
                        onClick={() => handleQuickRestock(p, 10)}
                        className="px-2.5 py-1.5 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                        title="Restok Standar +10 Pcs"
                        id={`btn-suggest-restock-10-${p.id}`}
                      >
                        +10
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* Main Stock Monitor list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Ledger Pemantauan Stok & Pengatur Cepat
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/20 dark:bg-slate-950/10 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-5">Detail Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Indikator Level Stok</th>
                <th className="py-3 px-4 text-center">Stok Saat Ini</th>
                <th className="py-3 px-5 text-center">Aksi Penyesuaian Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {products.map((p) => {
                const isLowStock = p.stock <= p.minStock;
                const isOutOfStock = p.stock === 0;
                
                // Calculate visualization percentage capped at 100
                const safetyMargin = p.minStock * 3;
                const barPercent = Math.min(100, Math.round((p.stock / (safetyMargin || 10)) * 100));

                let barColor = 'bg-blue-500';
                let statusText = 'Normal';
                let textCol = 'text-blue-600 dark:text-blue-400';

                if (isOutOfStock) {
                  barColor = 'bg-rose-500';
                  statusText = 'Stok Kosong!';
                  textCol = 'text-rose-600 dark:text-rose-400 font-extrabold';
                } else if (isLowStock) {
                  barColor = 'bg-amber-500';
                  statusText = 'Kritis (Low)';
                  textCol = 'text-amber-600 dark:text-amber-400 font-bold';
                } else {
                  barColor = 'bg-emerald-500';
                  statusText = 'Sangat Sehat';
                  textCol = 'text-emerald-600 dark:text-emerald-400';
                }

                return (
                  <tr key={p.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-3 px-5">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                        <p className="text-[10px] text-slate-400">Brand: {p.brand} • Batas minimum aman: {p.minStock} unit</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{p.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1.5 max-w-[160px]">
                        <div className="flex items-center justify-between text-[10px] font-semibold leading-none">
                          <span className={textCol}>{statusText}</span>
                          <span className="text-slate-400">{barPercent}%</span>
                        </div>
                        {/* CSS Progress bar representation of saturation */}
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${barPercent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {p.stock} Pcs
                    </td>
                    <td className="py-3 px-5 text-center">
                      {adjustingProductId === p.id ? (
                        <form 
                          onSubmit={(e) => handleCustomAdjustmentSubmit(e, p)}
                          className="flex items-center justify-center gap-1.5 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <input
                            type="number"
                            required
                            placeholder="Qty"
                            value={adjustmentValue}
                            onChange={(e) => setAdjustmentValue(e.target.value)}
                            className="w-16 px-2 py-1 text-center font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                            autoFocus
                            id={`quick-adjust-input-${p.id}`}
                          />
                          <button
                            type="submit"
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 cursor-pointer"
                            id={`quick-adjust-submit-${p.id}`}
                          >
                            Set
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdjustingProductId(null)}
                            className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 cursor-pointer"
                            id={`quick-adjust-cancel-${p.id}`}
                          >
                            Batal
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleQuickRestock(p, 1)}
                            className="p-1 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors cursor-pointer"
                            title="Tambah 1 Unit"
                            id={`btn-adjust-plus-1-${p.id}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleQuickRestock(p, -1)}
                            disabled={p.stock === 0}
                            className={`p-1 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg transition-colors ${
                              p.stock === 0
                                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed border-dashed'
                                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer'
                            }`}
                            title="Kurang 1 Unit"
                            id={`btn-adjust-minus-1-${p.id}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setAdjustingProductId(p.id);
                              setAdjustmentValue('10');
                            }}
                            className="ml-1 px-2.5 py-1 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors cursor-pointer"
                            id={`btn-adjust-custom-${p.id}`}
                          >
                            Ubah Custom
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
