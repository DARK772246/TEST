import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { processSyncQueue } from '@/lib/db';
import {
  Sun,
  Moon,
  Database,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Shield,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    try {
      await processSyncQueue();
      toast.success('Data synced successfully');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('sms_backup');
    if (!data) {
      toast.error('No data to export');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sms-backup.json';
    a.click();
    toast.success('Data exported successfully');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Manage application settings and preferences.</p>
        </div>

        {/* Appearance */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-warning" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">
                  {theme === 'light' ? 'Light mode' : 'Dark mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-7 bg-secondary rounded-full transition-colors"
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform ${
                  theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data & Sync */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Data & Synchronization
          </h3>
          
          <div className="space-y-4">
            {/* Connection status */}
            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-success" />
                ) : (
                  <WifiOff className="w-5 h-5 text-warning" />
                )}
                <div>
                  <p className="font-medium text-foreground">Connection Status</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? 'Connected to internet' : 'Working offline'}
                  </p>
                </div>
              </div>
              <span className={`badge ${isOnline ? 'badge-success' : 'badge-warning'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Sync button */}
            <button
              onClick={handleSync}
              disabled={!isOnline || isSyncing}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Data Now'}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleExportData}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Backup
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Import Backup
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Fee Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Send automatic reminders for pending fees
                </p>
              </div>
              <button className="relative w-14 h-7 bg-primary rounded-full">
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary-foreground rounded-full" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Attendance Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Alert for low attendance students
                </p>
              </div>
              <button className="relative w-14 h-7 bg-primary rounded-full">
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary-foreground rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </h3>
          
          <div className="space-y-4">
            <button className="btn-secondary w-full">
              Change Password
            </button>
            <button className="btn-secondary w-full">
              Manage Admin Accounts
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card-elevated p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Student Management System
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Version 1.0.0</p>
          <p className="text-sm text-muted-foreground">
            Developed by <span className="font-semibold text-foreground">Salman Khan</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Passion for Discipline, Sports & Technology.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
