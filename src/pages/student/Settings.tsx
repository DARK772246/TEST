import React, { useState } from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { updateStudent, updateStudentPassword, Student } from '@/lib/db';
import { ChangePasswordDialog } from '@/components/ui/ChangePasswordDialog';
import { DeveloperBrand } from '@/components/ui/DeveloperBrand';
import { Sun, Moon, User, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentSettings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const student = user as Student;

  const [phone, setPhone] = useState(student?.phone || '');
  const [address, setAddress] = useState(student?.address || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleUpdateProfile = async () => {
    if (!student?.id) return;
    
    setIsUpdating(true);
    try {
      await updateStudent(student.id, { phone, address });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    if (!student?.id) return false;
    return await updateStudentPassword(student.id, currentPassword, newPassword);
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Manage your account settings.</p>
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

        {/* Update Contact Info */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Contact Information
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            You can update your contact information below.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your address"
                rows={3}
                className="input-field resize-none"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="btn-primary flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Security
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Keep your account secure by changing your password regularly.
          </p>
          <button 
            onClick={() => setShowPasswordDialog(true)}
            className="btn-primary"
          >
            Change Password
          </button>
        </div>

        {/* Account Info */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Roll Number</span>
              <span className="font-mono text-foreground">{student?.rollNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{student?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-foreground">
                {student?.admissionDate
                  ? new Date(student.admissionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card-elevated p-6">
          <DeveloperBrand />
        </div>
      </div>

      <ChangePasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onChangePassword={handlePasswordChange}
        userType="student"
      />
    </StudentLayout>
  );
}
