import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Store, 
  User, 
  Target, 
  RefreshCw, 
  Trash2, 
  Database, 
  Server, 
  Cpu, 
  Share2, 
  Info,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { formatIDR } from '../utils/format';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetToMockData, 
    clearAllData, 
    addToast 
  } = useApp();

  // Profile Form State
  const [shopName, setShopName] = useState(settings.shopName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [targetRevenue, setTargetRevenue] = useState(settings.monthlyRevenueTarget.toString());

  // Confirm delete states
  const [confirmClear, setConfirmClear] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Submit Profile Form
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const targetVal = parseFloat(targetRevenue);
    if (!shopName.trim()) {
      addToast('error', 'Nama toko tidak boleh kosong.');
      return;
    }
    if (!ownerName.trim()) {
      addToast('error', 'Nama pemilik tidak boleh kosong.');
      return;
    }
    if (isNaN(targetVal) || targetVal <= 0) {
      addToast('error', 'Target omset bulanan harus di atas Rp 0.');
      return;
    }

    updateSettings({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      monthlyRevenueTarget: targetVal,
      currency: 'IDR'
    });
  };

  // Safe reset
  const handleReset = () => {
    setShowResetConfirm(true);
  };

  // Safe wipe
  const handleWipe = () => {
    if (confirmClear) {
      clearAllData();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000); // Reset button lock in 5 seconds
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
          Pengaturan Sistem & Profil Toko
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
          Ubah nama toko, kelola target omset bulanan, lakukan pemeliharaan database, serta pelajari skema arsitektur.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Profile configuration form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-7 bg-white dark:bg-slate-900 p-5.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
            <Store className="h-4.5 w-4.5 text-blue-600" /> Profil Konter Ritel
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4">
            Informasi profil akan digunakan di kop cetak laporan PDF dan ringkasan target dashboard.
          </p>

          {/* Shop Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Nama Toko / Konter *</label>
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                id="setting-shop-name"
              />
            </div>
          </div>

          {/* Owner Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Nama Pemilik Toko *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                id="setting-owner-name"
              />
            </div>
          </div>

          {/* Revenue Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Target Omset Bulanan (Rp) *</label>
            <div className="relative">
              <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                required
                min="1"
                value={targetRevenue}
                onChange={(e) => setTargetRevenue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                id="setting-target-revenue"
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none block">
              Saat ini diatur ke: {formatIDR(parseFloat(targetRevenue) || 0)}
            </span>
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all"
              id="btn-save-settings"
            >
              Simpan Perubahan Profil
            </button>
          </div>
        </form>

        {/* RIGHT: Sandbox Maintenance + Cloud Prep */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Sandbox controls */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-amber-500" /> Sandbox & Pemeliharaan Data
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Gunakan kontrol di bawah untuk mengatur ulang data demonstrasi juri atau menghapus lembar kerja Anda.
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-amber-50/25 hover:bg-amber-50/55 dark:bg-amber-950/5 dark:hover:bg-amber-950/15 text-amber-900 dark:text-amber-400 font-bold text-xs cursor-pointer transition-colors text-left"
                id="btn-settings-reset-mock"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4.5 w-4.5" /> Muat Ulang Data Sampel Bawaan
                </span>
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-amber-100/60 dark:bg-amber-950">Pre-seed</span>
              </button>

              <button
                type="button"
                onClick={handleWipe}
                className={`w-full flex items-center justify-between p-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors text-left ${
                  confirmClear 
                    ? 'bg-rose-600 text-white border-rose-600' 
                    : 'border-slate-100 dark:border-slate-800 bg-rose-50/25 hover:bg-rose-50/55 dark:bg-rose-950/5 dark:hover:bg-rose-950/15 text-rose-900 dark:text-rose-400'
                }`}
                id="btn-settings-wipe-all"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4.5 w-4.5" /> {confirmClear ? 'Konfirmasi: Klik Sekali Lagi untuk Hapus!' : 'Kosongkan Seluruh Data (Wipe)'}
                </span>
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-rose-100/60 dark:bg-rose-950">Wipe Database</span>
              </button>
            </div>
          </div>

          {/* Database Architecture / Cloud prep */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-indigo-500" /> Kesiapan Migrasi Database Cloud
            </h3>
            
            {/* Visual flow chart */}
            <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 space-y-3.5 text-[10.5px]">
              <div className="flex items-center justify-between text-slate-400 font-semibold font-mono">
                <span>FRONTEND</span>
                <span>DATA LAYER</span>
                <span>BACKEND PREP</span>
              </div>

              <div className="flex items-center justify-between gap-1.5 font-mono font-bold text-center">
                <div className="flex-1 p-2 bg-blue-100/50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 rounded-lg flex flex-col items-center gap-1">
                  <Cpu className="h-4 w-4" /> React UI (TSX)
                </div>
                <div className="text-slate-400 text-base">➔</div>
                <div className="flex-1 p-2 bg-indigo-100/50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 rounded-lg flex flex-col items-center gap-1">
                  <Database className="h-4 w-4" /> AppContext API
                </div>
                <div className="text-slate-400 text-base">➔</div>
                <div className="flex-1 p-2 bg-emerald-100/50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg flex flex-col items-center gap-1">
                  <Server className="h-4 w-4" /> Supabase / SQL
                </div>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                Struktur data KonterIQ dipisahkan sepenuhnya di <span className="font-bold">AppContext.tsx</span>. Semua pemanggilan fungsi CRUD memiliki parameter payload standar, sehingga Anda dapat mengganti <span className="font-mono">localStorage</span> dengan koneksi SDK <span className="font-bold text-blue-600 dark:text-blue-400">Supabase</span> atau <span className="font-bold text-blue-600 dark:text-blue-400">Firebase Firestore</span> hanya dengan merubah 1 file tanpa merubah kode UI di komponen halaman.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* --- RESET DATA CONFIRMATION MODAL --- */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowResetConfirm(false)} />
          
          {/* Content Pane */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" /> Atur Ulang Data Sampel
              </h3>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                id="btn-close-reset-modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-5.5 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Apakah Anda yakin ingin mengatur ulang seluruh produk, transaksi, dan log aktivitas kembali ke data sampel bawaan?
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                Tindakan ini akan menghapus dan menimpa seluruh data produk dan transaksi yang telah Anda buat saat ini secara permanen.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4.5 py-2 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer transition-colors"
                  id="btn-cancel-reset-data"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    resetToMockData();
                    setShowResetConfirm(false);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all"
                  id="btn-confirm-reset-data"
                >
                  Atur Ulang Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
