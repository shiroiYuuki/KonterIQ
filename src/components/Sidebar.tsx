import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Smartphone, 
  ShoppingBag, 
  Layers, 
  BarChart3, 
  Settings, 
  X,
  Store,
  Sparkles,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, settings, logout } = useApp();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Produk HP', icon: Smartphone },
    { id: 'sales', name: 'Catat Penjualan', icon: ShoppingBag },
    { id: 'inventory', name: 'Stok & Restok', icon: Layers },
    { id: 'reports', name: 'Laporan Bisnis', icon: BarChart3 },
    { id: 'settings', name: 'Profil & Reset', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-60 border-r bg-white dark:bg-slate-950 border-[#E2E8F0] dark:border-slate-900 flex flex-col z-50 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#E2E8F0] dark:border-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white shadow-sm">
              <span className="font-bold text-base tracking-tight">IQ</span>
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-xl tracking-tight text-[#0F172A] dark:text-white leading-none">KonterIQ</h1>
              <span className="text-[9px] font-mono text-[#64748B] dark:text-slate-500 font-bold tracking-wider uppercase">Monitoring Ritel</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden transition-colors"
            id="btn-close-sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store Context Quick Stats - Styled as the Professional Polish Sidebar profile card */}
        <div className="p-4 border-b border-[#E2E8F0] dark:border-slate-900/40">
          <div className="flex items-center gap-3 bg-[#F1F5F9] dark:bg-[#1E293B]/40 p-3 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[#CBD5E1] dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center font-bold text-[#475569] dark:text-slate-300 text-sm shrink-0">
              {settings.ownerName ? settings.ownerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'BH'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">{settings.ownerName}</p>
              <p className="text-[10px] text-[#64748B] dark:text-slate-400 uppercase tracking-wider font-semibold truncate">{settings.shopName}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                id={`nav-link-${item.id}`}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#EFF6FF] dark:bg-blue-950/35 text-[#2563EB] dark:text-blue-400 font-semibold' 
                    : 'text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-900 hover:text-[#0F172A] dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-[#64748B] dark:text-slate-500'}`} />
                {item.name}
              </button>
            );
          })}
          
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            id="nav-link-logout"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-700 dark:hover:text-rose-400 transition-colors mt-4 border-t border-dashed border-slate-100 dark:border-slate-900/60 pt-4 cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0 text-rose-500" />
            Keluar (Logout)
          </button>
        </nav>

        {/* UMKM Competition Banner */}
        <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-900/60">
          <div className="p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10">
              <Sparkles className="h-24 w-24 translate-y-6 translate-x-4" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500 text-white leading-none">Vibe Coding</span>
            </div>
            <h4 className="text-xs font-bold leading-tight tracking-wide mb-1">Kemandirian UMKM</h4>
            <p className="text-[10px] text-blue-100 leading-normal">
              Inovasi Digital untuk Kemandirian UMKM Lokal.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
