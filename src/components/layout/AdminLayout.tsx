import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GoldParticles } from '@/components/ui/GoldParticles';
import { Avatar3D } from '@/components/ui/Avatar3D';
import { DeveloperBrand } from '@/components/ui/DeveloperBrand';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Bell,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Students', path: '/admin/students' },
  { icon: UserPlus, label: 'Add Student', path: '/admin/students/add' },
  { icon: DollarSign, label: 'Fees', path: '/admin/fees' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Gold Particles Background */}
      <GoldParticles />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-md z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Premium 3D Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 
          glass-card border-r-0 rounded-none rounded-r-3xl
          transform transition-all duration-500 ease-out
          lg:translate-x-0 lg:static lg:z-10
          ${sidebarOpen ? 'translate-x-0 animate-slide-left' : '-translate-x-full'}
        `}
        style={{
          boxShadow: '20px 0 60px -20px hsl(var(--gold) / 0.3)',
        }}
      >
        <div className="flex flex-col h-full relative">
          {/* Gold accent line */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-0.5"
            style={{
              background: 'linear-gradient(180deg, transparent, hsl(var(--gold)), transparent)',
            }}
          />

          {/* Logo */}
          <div className="p-6 border-b border-gold/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-gold"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold)))',
                  }}
                >
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold text-foreground">IMPERIAL</h1>
                  <p className="text-xs text-gold tracking-widest">ADMIN PANEL</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-secondary rounded-xl transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-premium">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  nav-item group
                  ${location.pathname === item.path ? 'active' : ''}
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${location.pathname === item.path 
                    ? 'bg-gold/20 text-gold' 
                    : 'bg-secondary/50 text-muted-foreground group-hover:bg-gold/10 group-hover:text-gold'
                  }
                `}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gold/20">
            <div className="flex items-center gap-3 mb-4 p-3 glass-card rounded-2xl">
              <Avatar3D 
                fallback={(user as any)?.name?.charAt(0) || 'A'} 
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {(user as any)?.name || 'Admin'}
                </p>
                <p className="text-xs text-gold truncate">
                  Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-all">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Premium Top bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-gold/10">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.7))',
            }}
          />
          <div className="relative flex items-center justify-between px-4 lg:px-8 h-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-3">
              {/* Online status */}
              <div className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
                glass-card border
                ${isOnline 
                  ? 'border-success/30 text-success' 
                  : 'border-warning/30 text-warning'
                }
              `}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {/* Notifications */}
              <button className="relative p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300 group">
                <Bell className="w-5 h-5 group-hover:text-gold transition-colors" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gold rounded-full animate-pulse" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300 group overflow-hidden relative"
              >
                <div className="relative z-10">
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 group-hover:text-gold transition-colors" />
                  ) : (
                    <Sun className="w-5 h-5 group-hover:text-gold transition-colors" />
                  )}
                </div>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'radial-gradient(circle at center, hsl(var(--gold) / 0.2), transparent)',
                  }}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Premium Footer */}
        <footer className="relative border-t border-gold/10 bg-card/50 backdrop-blur-sm">
          <DeveloperBrand />
        </footer>
      </div>
    </div>
  );
}
