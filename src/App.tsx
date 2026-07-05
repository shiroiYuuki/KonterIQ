import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';

// View Imports
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { SalesView } from './components/SalesView';
import { InventoryView } from './components/InventoryView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { LoginView } from './components/LoginView';
import { LandingView } from './components/LandingView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeTab, setActiveTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publicRoute, setPublicRoute] = useState<'landing' | 'login'>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return (hash === 'login' || hash === '/login') ? 'login' : 'landing';
  });

  // Use a ref to store activeTab to prevent re-binding the hashchange event listener
  const activeTabRef = React.useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Unified, robust navigation and route protection effect
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const validTabs = ['dashboard', 'products', 'sales', 'inventory', 'reports', 'settings'];
      
      if (!isAuthenticated) {
        if (hash === 'login' || hash === '/login') {
          setPublicRoute('login');
        } else {
          setPublicRoute('landing');
          // Secure Redirect: Force unauthenticated users back to landing hash safely
          if (validTabs.includes(hash)) {
            window.location.hash = '/';
          }
        }
        return;
      }

      // Authenticated routing logic
      if (validTabs.includes(hash)) {
        if (activeTabRef.current !== hash) {
          setActiveTab(hash);
        }
      } else if (hash === 'login' || hash === '/login' || !hash) {
        // If logged in but trying to go to login or empty hash, redirect to active tab
        window.location.hash = activeTabRef.current;
      }
    };

    // Initial check on mount/auth change
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, setActiveTab]);

  // Synchronize state changes (e.g. sidebar clicks) back to URL Hash cleanly
  useEffect(() => {
    if (isAuthenticated) {
      const currentHash = window.location.hash.replace(/^#\/?/, '');
      if (currentHash !== activeTab) {
        window.location.hash = activeTab;
      }
    } else {
      const currentHash = window.location.hash.replace(/^#\/?/, '');
      if (publicRoute === 'login' && currentHash !== 'login' && currentHash !== '/login') {
        window.location.hash = '/login';
      } else if (publicRoute === 'landing' && currentHash !== '' && currentHash !== '/') {
        window.location.hash = '/';
      }
    }
  }, [activeTab, isAuthenticated, publicRoute]);

  // Dynamic View Router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'products':
        return <ProductsView />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // 1. Unauthenticated Experience (Landing or Login)
  if (!isAuthenticated) {
    return (
      <>
        {publicRoute === 'landing' ? (
          <LandingView onNavigateToLogin={() => {
            setPublicRoute('login');
            window.location.hash = '/login';
          }} />
        ) : (
          <LoginView onNavigateToLanding={() => {
            setPublicRoute('landing');
            window.location.hash = '/';
          }} />
        )}
        <ToastContainer />
      </>
    );
  }

  // 3. Authenticated App Layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#1E293B] dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Dynamic Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Main Stage Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Slide-In Toast Notification System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
