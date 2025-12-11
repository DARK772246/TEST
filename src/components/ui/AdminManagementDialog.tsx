import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getAllAdmins, addAdmin, updateAdmin, deleteAdmin, Admin } from '@/lib/db';
import { UserPlus, Trash2, Edit2, Save, X, Users } from 'lucide-react';
import { toast } from 'sonner';

interface AdminManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminManagementDialog({ open, onOpenChange }: AdminManagementDialogProps) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (open) {
      loadAdmins();
    }
  }, [open]);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (error) {
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await addAdmin(formData);
      toast.success('Admin added successfully');
      setFormData({ name: '', email: '', password: '' });
      setShowAddForm(false);
      loadAdmins();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add admin');
    }
  };

  const handleUpdateAdmin = async (id: string) => {
    if (!editFormData.name || !editFormData.email) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await updateAdmin(id, editFormData);
      toast.success('Admin updated successfully');
      setEditingId(null);
      loadAdmins();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update admin');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (admins.length <= 1) {
      toast.error('Cannot delete the last admin');
      return;
    }

    try {
      await deleteAdmin(id);
      toast.success('Admin deleted successfully');
      loadAdmins();
    } catch (error) {
      toast.error('Failed to delete admin');
    }
  };

  const startEditing = (admin: Admin) => {
    setEditingId(admin.id);
    setEditFormData({ name: admin.name, email: admin.email });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Manage Administrators
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Admin Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add New Admin
            </button>
          )}

          {/* Add Admin Form */}
          {showAddForm && (
            <form onSubmit={handleAddAdmin} className="p-4 bg-secondary rounded-xl space-y-3">
              <h4 className="font-medium text-foreground">New Administrator</h4>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: '', email: '', password: '' });
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Admins List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Current Administrators ({admins.length})</h4>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-4 bg-secondary rounded-xl"
                  >
                    {editingId === admin.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="input-field"
                          placeholder="Full Name"
                        />
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className="input-field"
                          placeholder="Email"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateAdmin(admin.id)}
                            className="btn-primary flex-1 text-sm py-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn-secondary flex-1 text-sm py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{admin.name}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditing(admin)}
                            className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            disabled={admins.length <= 1}
                            className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
