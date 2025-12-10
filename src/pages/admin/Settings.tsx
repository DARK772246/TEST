import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { processSyncQueue, updateAdminPassword, exportAllData, importAllData } from '@/lib/db';
import { ChangePasswordDialog } from '@/components/ui/ChangePasswordDialog';
import { AdminManagementDialog } from '@/components/ui/AdminManagementDialog';
import { DeveloperBrand } from '@/components/ui/DeveloperBrand';
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
  HardDrive,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleBackup = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sms-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup created successfully');
    } catch (error) {
      toast.error('Failed to create backup');
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const result = await importAllData(content);
      
      if (result.success) {
        toast.success('Data restored successfully! Please refresh the page.');
      } else {
        toast.error(result.error || 'Failed to restore data');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    return await updateAdminPassword((user as any).id, currentPassword, newPassword);
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
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            Backup & Restore
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a backup of all your data or restore from a previous backup.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleBackup}
              className="btn-secondary flex items-center justify-center gap-2 py-4"
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Create Backup</p>
                <p className="text-xs text-muted-foreground">Export all data as JSON</p>
              </div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary flex items-center justify-center gap-2 py-4"
            >
              <Upload className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Restore Backup</p>
                <p className="text-xs text-muted-foreground">Import from JSON file</p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
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

        {/* Account Settings */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account & Security
          </h3>
          
          <div className="space-y-4">
            {/* Current Account Info */}
            <div className="p-4 bg-secondary rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Logged in as</p>
              <p className="font-medium text-foreground">{user?.email || 'admin@school.com'}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setShowPasswordDialog(true)}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Change Password
              </button>
              <button 
                onClick={() => setShowAdminDialog(true)}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Manage Admins
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
            Student Management System
          </h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">Version 1.0.0</p>
          <DeveloperBrand />
        </div>
      </div>

      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onChangePassword={handlePasswordChange}
        userType="admin"
      />

      <AdminManagementDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
      />
    </AdminLayout>
  );
}
