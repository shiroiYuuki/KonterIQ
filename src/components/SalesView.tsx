import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatDate } from '../utils/format';
import { 
  ShoppingBag, 
  Search, 
  Trash2, 
  TrendingUp, 
  Info, 
  DollarSign, 
  ArrowRightLeft, 
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Calendar,
  XCircle,
  X
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const { products, sales, recordSale, deleteSale, addToast } = useApp();

  // --- Record Sale Form States ---
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  
  // --- History Filtering States ---
  const [historySearch, setHistorySearch] = useState('');
  const [historyCategory, setHistoryCategory] = useState<string>('All');
  const [saleToDelete, setSaleToDelete] = useState<{ id: string; productName: string; quantity: number } | null>(null);

  // Find currently selected product details
  const activeProduct = products.find((p) => p.id === selectedProductId);

  // Calculate real-time transaction preview
  const qtyNum = parseInt(quantity) || 0;
  const standardPrice = activeProduct ? activeProduct.sellingPrice : 0;
  const activeSellingPrice = useCustomPrice ? (parseFloat(customPrice) || 0) : standardPrice;
  const purchaseCost = activeProduct ? activeProduct.purchasePrice : 0;
  
  const totalSalesValue = activeSellingPrice * qtyNum;
  const totalPurchaseCost = purchaseCost * qtyNum;
  const expectedProfit = totalSalesValue - totalPurchaseCost;
  const profitMarginPercent = totalSalesValue > 0 ? (expectedProfit / totalSalesValue) * 100 : 0;

  // Form Submission
  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId) {
      addToast('error', 'Silakan pilih produk terlebih dahulu.');
      return;
    }

    if (qtyNum <= 0) {
      addToast('error', 'Jumlah kuantitas harus minimal 1 unit.');
      return;
    }

    if (activeProduct && activeProduct.stock < qtyNum) {
      addToast('error', `Gagal mencatat. Stok ${activeProduct.name} tidak cukup.`);
      return;
    }

    const customPriceParam = useCustomPrice ? parseFloat(customPrice) : undefined;
    
    const result = recordSale(selectedProductId, qtyNum, customPriceParam);

    if (result.success) {
      // Reset form on success
      setQuantity('1');
      setUseCustomPrice(false);
      setCustomPrice('');
    } else {
      addToast('error', result.message);
    }
  };

  // --- Handle Product Selection ---
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setCustomPrice(prod.sellingPrice.toString());
    } else {
      setCustomPrice('');
    }
    setQuantity('1');
    setUseCustomPrice(false);
  };

  // --- Filtering sales list ---
  const filteredSales = sales.filter((s) => {
    const matchesSearch = s.productName.toLowerCase().includes(historySearch.toLowerCase());
    const matchesCategory = historyCategory === 'All' || s.category === historyCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'HP', 'Aksesoris', 'Pulsa & Data', 'Service', 'Lain-lain'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
          Catat Transaksi Penjualan HP & Aksesoris
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
          Input penjualan secara manual di sini. Sistem akan otomatis memotong stok gudang dan memperbarui laba secara instan.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-2xl text-blue-500">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Katalog Produk Masih Kosong</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
            Anda harus mendaftarkan setidaknya satu produk sebelum mencatat penjualan. Silakan klik tombol di bawah untuk mengisi produk.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('nav-link-products');
              if (el) el.click();
            }}
            className="px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            id="btn-go-add-products-from-sales"
          >
            Buka Katalog Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Recording Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs h-fit">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-blue-600" /> Formulir Pencatatan Baru
            </h3>

            <form onSubmit={handleSubmitSale} className="space-y-4">
              
              {/* Product Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Pilih Produk *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  id="form-sale-product-select"
                >
                  <option value="">-- Pilih HP / Aksesoris / Layanan --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock === 0}>
                      {p.name} {p.stock === 0 ? '(Stok Habis)' : `(Stok: ${p.stock})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Quick Details */}
              {activeProduct && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Brand / Merek:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{activeProduct.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kategori:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{activeProduct.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stok Tersedia:</span>
                    <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[10.5px] ${
                      activeProduct.stock <= activeProduct.minStock 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' 
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {activeProduct.stock} unit
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Harga Standar Jual:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatIDR(activeProduct.sellingPrice)}</span>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Jumlah Terjual (Kuantitas) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={activeProduct ? activeProduct.stock.toString() : '9999'}
                  placeholder="Ketik jumlah unit terjual"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                  id="form-sale-qty"
                />
              </div>

              {/* Price override checkbox and input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomPrice}
                    onChange={(e) => {
                      setUseCustomPrice(e.target.checked);
                      if (activeProduct) {
                        setCustomPrice(activeProduct.sellingPrice.toString());
                      }
                    }}
                    disabled={!activeProduct}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    id="checkbox-use-custom-price"
                  />
                  Ubah Harga Jual Eceran (Opsional)
                </label>

                {useCustomPrice && activeProduct && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="Ketik harga jual khusus"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                        id="form-sale-customprice"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
                      Berguna jika Anda memberi diskon ke pembeli langganan atau menjual secara grosir.
                    </span>
                  </div>
                )}
              </div>

              {/* Real-time Math Preview Panel */}
              {activeProduct && qtyNum > 0 && (
                <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/10 rounded-2xl space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-100/30 dark:border-blue-900/10">
                    <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Pratinjau Keuntungan</span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Margin: {profitMarginPercent.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Total Omset:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{formatIDR(totalSalesValue)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Harga Modal Toko:</span>
                      <span className="text-slate-500 font-mono">{formatIDR(totalPurchaseCost)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-blue-100/50">
                      <span className="text-emerald-600 dark:text-emerald-400">Keuntungan Bersih:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">{formatIDR(expectedProfit)}</span>
                    </div>
                  </div>

                  {expectedProfit < 0 && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[10px] font-bold flex items-center gap-1.5 leading-none mt-1 animate-pulse">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Peringatan: Transaksi ini rugi karena harga jual di bawah harga beli!
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedProductId}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                  selectedProductId 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10' 
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
                id="btn-submit-sale"
              >
                Catat Transaksi Sekarang
              </button>

            </form>
          </div>

          {/* RIGHT: Sales Ledger */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <ArrowRightLeft className="h-4.5 w-4.5 text-blue-600" /> Riwayat Transaksi Terkini
                </h3>
                
                {/* Micro search for history */}
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari transaksi..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden"
                    id="input-sales-ledger-search"
                  />
                </div>
              </div>

              {/* Quick filter list */}
              <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setHistoryCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                      historyCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50/50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800/80'
                    }`}
                    id={`ledger-filter-${cat}`}
                  >
                    {cat === 'All' ? 'Semua Kategori' : cat}
                  </button>
                ))}
              </div>

              {/* Transactions list */}
              <div className="overflow-x-auto">
                <div className="max-h-[380px] overflow-y-auto">
                  {filteredSales.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                      Tidak ada rekaman transaksi yang sesuai.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/30 dark:bg-slate-950/20 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800/60">
                          <th className="py-2.5 px-3">Produk / Waktu</th>
                          <th className="py-2.5 px-3 text-center">Jumlah</th>
                          <th className="py-2.5 px-3 text-right">Total Harga</th>
                          <th className="py-2.5 px-3 text-right">Laba Bersih</th>
                          <th className="py-2.5 px-3 text-center">Batal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
                        {filteredSales.map((s) => {
                          const saleDateObj = new Date(s.timestamp);
                          const formattedTime = saleDateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                          const isToday = s.date === new Date().toISOString().split('T')[0];

                          return (
                            <tr key={s.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                              <td className="py-3 px-3">
                                <p className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]" title={s.productName}>
                                  {s.productName}
                                </p>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">
                                  {isToday ? 'Hari ini' : formatDate(s.date)} • {formattedTime}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-bold font-mono text-slate-600 dark:text-slate-300">
                                x{s.quantity}
                              </td>
                              <td className="py-3 px-3 text-right font-bold font-mono text-slate-900 dark:text-white">
                                {formatIDR(s.sellingPrice * s.quantity)}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span className={`font-mono font-bold ${s.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                                  {formatIDR(s.profit)}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => {
                                    setSaleToDelete({ id: s.id, productName: s.productName, quantity: s.quantity });
                                  }}
                                  className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                  title="Batalkan / Void Transaksi"
                                  id={`btn-void-sale-${s.id}`}
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 mt-4 flex items-center gap-3">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                <Info className="h-4 w-4" />
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal">
                Menghapus atau membatalkan (Void) transaksi akan secara otomatis mengembalikan jumlah stok produk ke katalog inventori dan mengkalibrasi ulang grafik dashboard.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* --- VOID SALE CONFIRMATION MODAL --- */}
      {saleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSaleToDelete(null)} />
          
          {/* Content Pane */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" /> Batalkan Transaksi (Void)
              </h3>
              <button
                onClick={() => setSaleToDelete(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                id="btn-close-void-modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-5.5 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Apakah Anda yakin ingin membatalkan transaksi untuk produk <span className="font-bold text-slate-900 dark:text-white">"{saleToDelete.productName}" (x{saleToDelete.quantity})</span>?
              </p>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
                Stok produk akan secara otomatis ditambahkan kembali ke inventori sebanyak <span className="font-bold">{saleToDelete.quantity} unit</span>, dan keuntungan transaksi ini akan dikurangi dari catatan keuangan toko.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setSaleToDelete(null)}
                  className="px-4.5 py-2 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer transition-colors"
                  id="btn-cancel-void-sale"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    deleteSale(saleToDelete.id);
                    setSaleToDelete(null);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all"
                  id="btn-confirm-void-sale"
                >
                  Ya, Batalkan Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
