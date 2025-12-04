import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Student } from '@/lib/db';
import {
  User,
  BookOpen,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: User, label: 'Profile', path: '/student' },
  { icon: BookOpen, label: 'Subjects', path: '/student/subjects' },
  { icon: Calendar, label: 'Attendance', path: '/student/attendance' },
  { icon: DollarSign, label: 'Fees', path: '/student/fees' },
  { icon: Bell, label: 'Notifications', path: '/student/notifications' },
  { icon: Settings, label: 'Settings', path: '/student/settings' },
];

export function StudentLayout({ children }: StudentLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const studentUser = user as Student;

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
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground">IMPERIAL MEDICAL SCIENCE AND ARTS</h1>
                <p className="text-xs text-muted-foreground">Student Portal</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4 p-3 bg-secondary rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {studentUser?.profilePhoto ? (
                  <img
                    src={studentUser.profilePhoto}
                    alt={studentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary-foreground font-semibold">
                    {studentUser?.fullName?.charAt(0) || 'S'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {studentUser?.fullName || 'Student'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {studentUser?.rollNumber}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="nav-item w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-2">
              {/* Online status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                isOnline ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>

              {/* Notifications */}
              <Link to="/student/notifications" className="p-2 hover:bg-secondary rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-secondary rounded-lg"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-4 px-6">
          <p className="text-center text-sm text-muted-foreground">
            Developed by <span className="font-semibold text-foreground">Salman Khan</span> — Passion for Discipline, Sports & Technology.
          </p>
        </footer>
      </div>
    </div>
  );
}
