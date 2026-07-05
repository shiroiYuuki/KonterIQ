import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Sun, Moon, Bell, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDate } from '../utils/format';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, setTheme, settings, products, setActiveTab } = useApp();
  const [time, setTime] = useState<Date>(new Date());
  const [showBellDropdown, setShowBellDropdown] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const bellRef = useRef<HTMLDivElement>(null);

  // Dynamic connection listener
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

  // Dynamic ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBellDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute low stock count and details
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hours = time.getHours();
    if (hours >= 5 && hours < 11) return 'Selamat Pagi';
    if (hours >= 11 && hours < 15) return 'Selamat Siang';
    if (hours >= 15 && hours < 19) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // Convert weekday to Indonesian
  const getIndonesianDay = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[time.getDay()];
  };

  return (
    <header className="h-20 border-b border-[#E2E8F0] dark:border-slate-900 bg-white dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Area: Mobile Menu Trigger + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 lg:hidden transition-colors"
          aria-label="Open Sidebar"
          id="btn-open-sidebar"
        >
          <Menu className="h-5.5 w-5.5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
            {getGreeting()}, <span className="text-blue-600 dark:text-blue-400">{settings.ownerName}</span>! 👋
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
            {getIndonesianDay()}, {formatDate(time.toISOString())} • {time.toLocaleTimeString('id-ID')} WIB
          </p>
        </div>
      </div>

      {/* Right Area: Interactive Widgets */}
      <div className="flex items-center gap-3.5">
        {/* Dynamic Display of date/time on very small mobile screens */}
        <div className="sm:hidden text-right">
          <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
            {time.toLocaleTimeString('id-ID')} WIB
          </p>
        </div>

        {/* Real Online/Offline Status Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/80 transition-all cursor-pointer"
          title={theme === 'light' ? 'Nyalakan Mode Gelap' : 'Nyalakan Mode Terang'}
          id="btn-theme-toggle"
        >
          {theme === 'light' ? (
            <Moon className="h-4.5 w-4.5" />
          ) : (
            <Sun className="h-4.5 w-4.5 text-amber-400" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setShowBellDropdown(!showBellDropdown)}
            className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/80 transition-all relative cursor-pointer"
            id="btn-bell-notification"
          >
            <Bell className="h-4.5 w-4.5" />
            {lowStockProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse border-2 border-white dark:border-slate-950">
                {lowStockProducts.length}
              </span>
            )}
          </button>

          {showBellDropdown && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-3 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Notifikasi Stok
                </h4>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {lowStockProducts.length} Alert
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {lowStockProducts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    Semua stok produk aman dan tercukupi! 👍
                  </div>
                ) : (
                  lowStockProducts.map((p) => (
                    <div key={p.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Brand: {p.brand} • Min: {p.minStock}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 whitespace-nowrap">
                          Stok: {p.stock}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('inventory');
                          setShowBellDropdown(false);
                        }}
                        className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                        id={`btn-bell-restock-${p.id}`}
                      >
                        <RefreshCw className="h-3 w-3" /> Restok Sekarang
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {lowStockProducts.length > 0 && (
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('inventory');
                      setShowBellDropdown(false);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    id="btn-bell-view-all-restock"
                  >
                    Lihat Semua Monitor Inventory
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
