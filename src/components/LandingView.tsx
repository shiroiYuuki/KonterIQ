import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  Sparkles, 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  FileText, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  BarChart3, 
  Layers, 
  Database,
  LogIn,
  Check,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Menu,
  X
} from 'lucide-react';

interface LandingViewProps {
  onNavigateToLogin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigateToLogin }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'inventory' | 'reports' | 'snapshot'>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased scroll-smooth selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Decorative ambient background lights */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.15)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* STICKY HEADER & NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 select-none shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg border border-blue-400/20">
              <Store className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1 sm:gap-1.5">
                KonterIQ
                <span className="text-[8px] sm:text-[9px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20 px-1 sm:px-1.5 py-0.5 rounded-full shrink-0">
                  v1.0
                </span>
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on Mobile, Adaptive on Tablet) */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-xs lg:text-sm font-semibold text-slate-400">
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-white transition-colors cursor-pointer"
              id="nav-link-features"
            >
              Fitur Utama
            </button>
            <button 
              onClick={() => scrollToSection('preview')} 
              className="hover:text-white transition-colors cursor-pointer"
              id="nav-link-preview"
            >
              Preview Dashboard
            </button>
            <button 
              onClick={() => scrollToSection('benefits')} 
              className="hidden lg:block hover:text-white transition-colors cursor-pointer"
              id="nav-link-benefits"
            >
              Keunggulan
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="hidden lg:block hover:text-white transition-colors cursor-pointer"
              id="nav-link-contact"
            >
              Hubungi Kami
            </button>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Real Connection Status Indicator - Desktop/Tablet */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 rounded-full bg-slate-900 border border-slate-800 shrink-0">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Compact Status Indicator - Mobile */}
            <div className="flex sm:hidden items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-850 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300">
                {isOnline ? 'Sync' : 'Local'}
              </span>
            </div>

            <button
              onClick={onNavigateToLogin}
              id="nav-btn-login"
              className="bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold text-xs sm:text-sm px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 active:scale-95 transition-all duration-150 flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
            >
              <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400 shrink-0" />
              <span>Masuk</span>
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg md:hidden cursor-pointer transition-all active:scale-90 shrink-0"
              aria-label="Menu utama"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-slate-950 border-l border-slate-900/80 p-6 z-50 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-900">
                <div className="flex items-center gap-2 select-none">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg border border-blue-400/20">
                    <Store className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-black tracking-tight text-white">
                    KonterIQ
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
                  aria-label="Tutup menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-5 py-8 text-sm font-semibold text-slate-400">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('features');
                  }}
                  className="flex items-center gap-2 text-left py-2 hover:text-white transition-colors cursor-pointer"
                >
                  Fitur Utama
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('preview');
                  }}
                  className="flex items-center gap-2 text-left py-2 hover:text-white transition-colors cursor-pointer"
                >
                  Preview Dashboard
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('benefits');
                  }}
                  className="flex items-center gap-2 text-left py-2 hover:text-white transition-colors cursor-pointer"
                >
                  Keunggulan
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('contact');
                  }}
                  className="flex items-center gap-2 text-left py-2 hover:text-white transition-colors cursor-pointer"
                >
                  Hubungi Kami
                </button>
              </nav>

              {/* Drawer Footer with Connection Status */}
              <div className="mt-auto pt-6 border-t border-slate-900 space-y-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-900">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {isOnline ? 'Online • Auto Sync' : 'Offline • Local'}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigateToLogin();
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 border border-blue-400/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Masuk Dashboard
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold font-mono">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            Smart Business Dashboard untuk Counter HP
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Kelola Bisnis Konter HP <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Jauh Lebih Pintar.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            KonterIQ membantu pemilik toko handphone dan konter pulsa memantau transaksi penjualan, 
            kelola stok produk, melacak keuntungan bersih, dan mengevaluasi kesehatan bisnis secara instan dalam satu dashboard cerdas.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => scrollToSection('preview')}
              id="hero-btn-preview"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/10 border border-blue-400/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Lihat Preview Dashboard
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            
            <button
              onClick={onNavigateToLogin}
              id="hero-btn-login"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="h-4.5 w-4.5 text-slate-500" />
              Masuk (Admin)
            </button>
          </div>

          {/* Trust indicators / Stats */}
          <div className="pt-8 border-t border-slate-900/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">Auto Sync</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-bold tracking-wider font-mono">Offline-First</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">Instan</div>
              <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider font-mono">Insight Bisnis</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">Gratis</div>
              <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider font-mono">Tanpa Langganan</div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Mockup Column */}
        <div className="lg:col-span-5 relative w-full max-w-lg mx-auto">
          {/* Subtle decoration elements */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-3xl blur-md opacity-25" />
          
          {/* CSS Interactive-looking Mockup of KonterIQ Dashboard */}
          <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-5 overflow-hidden text-left select-none">
            {/* Top Bar Decoration */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 font-mono font-medium ml-2">konteriq_dashboard_live</span>
              </div>
              {isOnline ? (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE • SINKRON
                </span>
              ) : (
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  OFFLINE • LOCAL
                </span>
              )}
            </div>

            {/* Mock Layout Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Metric 1 */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850/50">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Omset Bulan Ini</p>
                <p className="text-base font-black text-white mt-1 font-mono">Rp 24.500.000</p>
                <div className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-0.5">
                  <span className="text-xs">↑</span> +12.4% dari kemarin
                </div>
              </div>
              {/* Metric 2 */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850/50">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Profit Bersih</p>
                <p className="text-base font-black text-emerald-400 mt-1 font-mono">Rp 4.250.000</p>
                <div className="text-[10px] text-slate-500 mt-1 font-mono font-medium">Margin Bersih 17.3%</div>
              </div>
            </div>

            {/* Mock Chart Visualization */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850/50 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Tren Penjualan Pulsa & HP</span>
                <span className="text-[9px] text-slate-500 font-mono">7 Hari Terakhir</span>
              </div>
              {/* Simple visual bar chart using CSS */}
              <div className="h-20 flex items-end justify-between gap-1.5 pt-2">
                <div className="w-full bg-slate-800 hover:bg-slate-750 transition-all rounded-t h-[40%]" />
                <div className="w-full bg-slate-800 hover:bg-slate-750 transition-all rounded-t h-[55%]" />
                <div className="w-full bg-slate-800 hover:bg-slate-750 transition-all rounded-t h-[45%]" />
                <div className="w-full bg-blue-600 rounded-t h-[75%] relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-mono font-bold px-1 py-0.5 rounded shadow">Rp3.5M</div>
                </div>
                <div className="w-full bg-slate-800 hover:bg-slate-750 transition-all rounded-t h-[60%]" />
                <div className="w-full bg-blue-500 rounded-t h-[85%]" />
                <div className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t h-[95%]" />
              </div>
              {/* Label bar */}
              <div className="flex justify-between text-[8px] text-slate-600 font-mono mt-2 font-bold uppercase">
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
                <span>Ahd</span>
              </div>
            </div>

            {/* Recent Transaction Mock Alert */}
            <div className="bg-slate-950/30 p-2.5 rounded-xl border border-blue-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-[10px] font-mono">HP</div>
                <div>
                  <p className="font-bold text-white text-[11px]">Redmi Note 13 Pro 5G</p>
                  <p className="text-[9px] text-slate-500 font-mono">Oleh Admin • Baru saja</p>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-[11px]">+Rp 3.899.000</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="relative z-10 border-t border-slate-900/60 bg-slate-950 py-24 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Text */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-black tracking-widest text-blue-500 font-mono uppercase">
              Dashboard Spesial UMKM HP
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Fitur Lengkap untuk Mendorong Kemandirian Konter Anda
            </h3>
            <p className="text-slate-400">
              KonterIQ didesain dari bawah ke atas agar pas dengan model bisnis konter pulsa dan aksesoris HP di Indonesia.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                📊 Business Dashboard
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pantau seluruh keadaan finansial toko, dari total omset harian, pengeluaran kulakan, hingga margin laba bersih secara langsung.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                📦 Inventory Monitoring
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Kelola stok handphone (berdasarkan brand/varian), aksesoris, kartu perdana, hingga kuota internet dengan peringatan stok menipis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                📈 Sales Analytics
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Evaluasi produk apa yang paling laris, tren penjualan per hari dalam seminggu, serta rata-rata nilai transaksi pelanggan Anda.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                📋 Business Reports
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Hasilkan laporan penjualan otomatis harian dan bulanan yang siap dicetak untuk evaluasi usaha, laporan pajak, atau bagi hasil rekan bisnis.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                ⚡ Smart Business Snapshot
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ketahui skor kondisi kesehatan bisnis secara real-time yang mengevaluasi efisiensi modal, tren profit, dan kecukupan modal kerja.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-slate-800/80 text-slate-400 border border-slate-800 rounded-xl flex items-center justify-center mb-5">
                  <ShieldCheck className="h-6 w-6 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  🔒 Keamanan Server-Side
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Sesi aman dan terlindungi dengan password administrator terenkripsi lokal di perangkat Anda, bebas dari intipan pihak luar.
                </p>
              </div>
              <button
                onClick={onNavigateToLogin}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 font-mono uppercase tracking-wider text-left transition-colors cursor-pointer"
                id="btn-feature-try-login"
              >
                Coba Login Sekarang <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section id="preview" className="relative z-10 border-t border-slate-900/60 bg-slate-900/20 py-24 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Text */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-xs font-black tracking-widest text-blue-500 font-mono uppercase">
              UI Sneak Peek
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Lihat Betapa Mudahnya Mengoperasikan KonterIQ
            </h3>
            <p className="text-slate-400 text-sm">
              Kami memisahkan fitur penting ke dalam tab yang intuitif untuk mengoptimalkan efisiensi kerja Anda sehari-hari.
            </p>
          </div>

          {/* Interactive tabs navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-2xl mx-auto bg-slate-950 p-1.5 rounded-2xl border border-slate-900">
            {[
              { id: 'dashboard', label: 'Finansial & Tren', icon: LayoutDashboard },
              { id: 'inventory', label: 'Katalog & Stok', icon: Package },
              { id: 'reports', label: 'Ekspor Laporan', icon: FileText },
              { id: 'snapshot', label: 'Kondisi Bisnis', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePreviewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                  id={`btn-preview-tab-${tab.id}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Preview Window Screen */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden min-h-[400px]">
            {/* Window buttons */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500 font-mono ml-3 font-semibold uppercase">PREVIEW: {activePreviewTab.toUpperCase()}</span>
              </div>
              <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/15">
                ILUSTRASI RESPONSIF
              </span>
            </div>

            {/* Tab Render: Dashboard */}
            {activePreviewTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Pemasukan Hari Ini</span>
                    <p className="text-xl font-bold mt-1 text-white font-mono">Rp 3.420.000</p>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">↑ 8 transaksi selesai</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Modal Terkunci di Stok</span>
                    <p className="text-xl font-bold mt-1 text-slate-200 font-mono">Rp 45.100.000</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Evaluasi nilai inventory aktif</span>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Alert Stok Tipis</span>
                    <p className="text-xl font-bold mt-1 text-amber-400 font-mono">3 Produk</p>
                    <span className="text-[10px] text-amber-500 font-medium mt-1 block">Perlu re-stock segera</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-850 space-y-4">
                  <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Metrik Sebaran Penjualan</span>
                  <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500 w-[55%] hover:opacity-90 transition-opacity" title="Handphone (55%)" />
                    <div className="h-full bg-emerald-500 w-[25%] hover:opacity-90 transition-opacity" title="Aksesoris (25%)" />
                    <div className="h-full bg-amber-500 w-[20%] hover:opacity-90 transition-opacity" title="Kuota & Pulsa (20%)" />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Handphone (55%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Aksesoris (25%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Voucher & Pulsa (20%)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Render: Inventory */}
            {activePreviewTab === 'inventory' && (
              <div className="space-y-4 animate-fadeIn duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Katalog Produk Terdaftar</span>
                  <span className="text-xs text-slate-500 font-mono">Total: 42 Produk</span>
                </div>

                <div className="overflow-x-auto border border-slate-900 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                        <th className="p-3">NAMA PRODUK</th>
                        <th className="p-3">KATEGORI</th>
                        <th className="p-3">HARGA BELI</th>
                        <th className="p-3">HARGA JUAL</th>
                        <th className="p-3">STOK</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      <tr className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">Samsung Galaxy A15 8/256GB</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold text-[10px]">Handphone</span></td>
                        <td className="p-3 font-mono">Rp 2.450.000</td>
                        <td className="p-3 font-mono text-emerald-400">Rp 2.749.000</td>
                        <td className="p-3 font-mono font-bold">12 pcs</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">Tersedia</span></td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">Silicon Case Redmi 13C Matte</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold text-[10px]">Aksesoris</span></td>
                        <td className="p-3 font-mono">Rp 12.000</td>
                        <td className="p-3 font-mono text-emerald-400">Rp 35.000</td>
                        <td className="p-3 font-mono font-bold">2 pcs</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold text-[10px]">Sisa Sedikit</span></td>
                      </tr>
                      <tr className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">Charger Infinix 45W Original</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold text-[10px]">Aksesoris</span></td>
                        <td className="p-3 font-mono">Rp 140.000</td>
                        <td className="p-3 font-mono text-emerald-400">Rp 225.000</td>
                        <td className="p-3 font-mono font-bold text-rose-400">0 pcs</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-semibold text-[10px]">Habis</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Render: Reports */}
            {activePreviewTab === 'reports' && (
              <div className="space-y-4 animate-fadeIn duration-300">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h5 className="font-bold text-white text-sm">Laporan Bulanan Terkompilasi</h5>
                    <p className="text-xs text-slate-400">Periode: Juli 2026 • Format siap print, PDF & Excel</p>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow">
                      <FileText className="h-4 w-4" /> Download PDF
                    </div>
                    <div className="bg-slate-950 border border-slate-800 text-slate-300 font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 hover:bg-slate-900">
                      Print Langsung
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850/80 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Volume Penjualan</span>
                    <p className="text-lg font-bold text-white mt-1 font-mono">148 Transaksi</p>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850/80 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Rata-Rata Margin</span>
                    <p className="text-lg font-bold text-emerald-400 mt-1 font-mono">18.4%</p>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850/80 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Laba Terbuang (Refund)</span>
                    <p className="text-lg font-bold text-rose-400 mt-1 font-mono">Rp 0</p>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850/80 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase font-mono">Status Audit</span>
                    <p className="text-lg font-bold text-blue-400 mt-1 font-mono flex items-center justify-center gap-1 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> SELESAI
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Render: Snapshot */}
            {activePreviewTab === 'snapshot' && (
              <div className="space-y-4 animate-fadeIn duration-300">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-850 flex flex-col md:flex-row items-center gap-6">
                  {/* Gauge score */}
                  <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#0F172A" strokeWidth="8" fill="transparent" />
                      <circle cx="56" cy="56" r="46" stroke="#2563EB" strokeWidth="8" fill="transparent" strokeDasharray="289" strokeDashoffset="50" strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-white font-mono">82</span>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-widest">Skor Usaha</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs font-bold font-mono uppercase">SANGAT SEHAT</span>
                      <span className="text-xs text-slate-500">Update Terakhir: Hari ini</span>
                    </div>
                    <h5 className="font-extrabold text-white text-base">Rekomendasi Pintar KonterIQ</h5>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                      Penjualan aksesoris memberikan margin keuntungan tertinggi pekan ini (52%). 
                      Kami menyarankan Anda untuk menambah variasi stok temper glass dan silicon case guna melipatgandakan keuntungan bersih konter.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section id="benefits" className="relative z-10 border-t border-slate-900/60 bg-slate-950 py-24 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xs font-black tracking-widest text-blue-500 font-mono uppercase">
                Mengapa Memilih Kami
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Dirancang Sederhana, Berkinerja Maksimal
              </h3>
              <p className="text-slate-400 leading-relaxed">
                KonterIQ menyingkirkan kerumitan program kasir modern yang terlalu rumit. 
                Kami fokus menghadirkan kemudahan input, kalkulasi laba instan, dan akurasi stok produk.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  'Bebas biaya langganan bulanan selamanya',
                  'Akses responsif penuh dari HP, tablet, maupun laptop',
                  'Penyimpanan aman lokal di browser perangkat Anda',
                  'Desain gelap yang aman di mata untuk operasional malam',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900 space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-white text-base">Hemat Waktu Buku Manual</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tidak perlu menulis nota manual lagi. Transaksi tercatat rapi, laporan bulanan selesai dalam 3 detik saja.
                </p>
              </div>

              <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900 space-y-3">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-white text-base">Pantau Stok Akurat</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ketahui stok tersisa tiap saat. Cegah komplain pelanggan akibat produk kosong atau stok voucher hangus tidak terdeteksi.
                </p>
              </div>

              <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900 space-y-3">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-white text-base">Keputusan Bisnis Tepat</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ketahui keuntungan bersih yang sebenarnya. Tidak bias antara uang kas yang berputar dengan laba usaha murni Anda.
                </p>
              </div>

              <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900 space-y-3">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-white text-base">Sangat Mudah Dipahami</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Didukung panduan interaktif, istilah yang familiar dengan operasional konter pulsa di lapangan, tanpa teori akuntansi berbelit.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION (CTA) SECTION */}
      <section className="relative z-10 border-t border-slate-900/60 bg-slate-950 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="relative bg-gradient-to-tr from-slate-900 via-blue-950/20 to-slate-900 border border-slate-800/80 p-10 sm:p-16 rounded-3xl overflow-hidden shadow-2xl">
            {/* Ambient radial overlay inside CTA card */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative space-y-6 max-w-2xl mx-auto">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Siap mengelola bisnis konter Anda secara profesional?
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Mulai pencatatan digital Anda hari ini bersama KonterIQ. Nikmati efisiensi, akurasi data keuangan, 
                dan perkembangan usaha yang terpantau nyata secara berkala.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={onNavigateToLogin}
                  id="cta-btn-login"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/15 border border-blue-400/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="h-5 w-5" />
                  Masuk ke Dashboard Admin
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  id="cta-btn-learn-more"
                  className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-slate-300 font-bold px-6 py-4 rounded-xl border border-slate-850 hover:border-slate-800 active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Pelajari Lebih Lanjut
                </button>
              </div>

              <div className="pt-4 text-xs font-mono text-slate-500">
                Gunakan kredensial bawaan: <span className="text-blue-400 font-bold">admin</span> / <span className="text-blue-400 font-bold">admin</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 border-t border-slate-900/60 bg-slate-950/40 py-20 scroll-mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Hubungi Kami / Layanan Support</h3>
              <p className="text-slate-400 text-sm">
                Apakah Anda memiliki pertanyaan atau masukan untuk pengembangan fitur KonterIQ versi selanjutnya? 
                Kami selalu siap mendengar masukan dari para pejuang UMKM konter seluler.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl inline-flex flex-col sm:flex-row items-center gap-6 max-w-xl mx-auto text-left">
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Email Resmi Dukungan UMKM</p>
                <p className="text-base font-bold text-white">support@konteriq.id</p>
              </div>
              <div className="hidden sm:block h-8 w-[1px] bg-slate-800" />
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Jam Operasional CS</p>
                <p className="text-base font-bold text-white">Setiap Hari, 08:00 - 21:00 WIB</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-900/60 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo & Brand description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow border border-blue-400/20">
                <Store className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">KonterIQ</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Satu dashboard terintegrasi untuk mendigitalisasi operasional keuangan dan inventaris konter pulsa dan aksesoris HP di seluruh Indonesia.
            </p>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Navigasi</h6>
              <ul className="text-xs text-slate-500 space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-slate-300 cursor-pointer">Fitur Utama</button></li>
                <li><button onClick={() => scrollToSection('preview')} className="hover:text-slate-300 cursor-pointer">Preview Dashboard</button></li>
                <li><button onClick={() => scrollToSection('benefits')} className="hover:text-slate-300 cursor-pointer">Keunggulan</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-slate-300 cursor-pointer">Hubungi Kami</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Dukungan</h6>
              <ul className="text-xs text-slate-500 space-y-2">
                <li><a href="#contact" className="hover:text-slate-300">FAQ</a></li>
                <li><a href="#contact" className="hover:text-slate-300">Panduan Admin</a></li>
                <li><a href="#contact" className="hover:text-slate-300">Kebijakan Privasi</a></li>
                <li><a href="#contact" className="hover:text-slate-300">Syarat Ketentuan</a></li>
              </ul>
            </div>
          </div>

          {/* Social icons */}
          <div className="md:col-span-3 space-y-4">
            <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Ikuti Perkembangan Kami</h6>
            <div className="flex gap-3">
              <a href="#follow" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-850 transition-colors" title="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#follow" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-850 transition-colors" title="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="#follow" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-850 transition-colors" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#follow" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-850 transition-colors" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <div className="text-[10px] font-mono text-slate-600">
              Versi Produksi: v1.0.0 Stable Build
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-650 font-mono">
          <p>© {new Date().getFullYear()} KonterIQ. Hak Cipta Dilindungi. Mendorong Kemandirian UMKM Indonesia.</p>
          <p className="flex items-center gap-1 text-[10px] text-slate-600 font-sans font-semibold">
            Made with <span className="text-rose-600 animate-pulse">♥</span> for Counter Owners
          </p>
        </div>
      </footer>

    </div>
  );
};
