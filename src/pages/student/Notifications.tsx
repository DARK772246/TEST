import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getNotificationsByStudent, markNotificationRead, Notification, Student } from '@/lib/db';
import { Bell, Check, Clock } from 'lucide-react';

export default function StudentNotifications() {
  const { user } = useAuth();
  const student = user as Student;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [student]);

  const loadNotifications = async () => {
    if (!student?.id) return;
    try {
      const data = await getNotificationsByStudent(student.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Add some default notifications if none exist
  const displayNotifications = notifications.length > 0 ? notifications : [
    {
      id: 'default-1',
      studentId: student?.id || '',
      title: 'Welcome to Student Portal',
      message: 'Welcome to the IMPERIAL MEDICAL SCIENCE AND ART COLLEGE. You can view your profile, subjects, attendance, and fee status here.',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-2',
      studentId: student?.id || '',
      title: 'Fee Reminder',
      message: 'Please ensure your fees are paid on time to avoid any late payment charges.',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="page-header mb-0">
            <h1 className="page-title">Notifications</h1>
            <p className="page-description">Stay updated with important announcements.</p>
          </div>
          
          {unreadCount > 0 && (
            <span className="badge badge-primary">
              {unreadCount} new
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {displayNotifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && handleMarkRead(notification.id)}
                className={`card-elevated p-6 cursor-pointer transition-all animate-fade-in ${
                  !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.read ? 'bg-secondary' : 'bg-primary/10'
                  }`}>
                    <Bell className={`w-5 h-5 ${
                      notification.read ? 'text-muted-foreground' : 'text-primary'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-semibold ${
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      
                      {notification.read ? (
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {displayNotifications.length === 0 && (
              <div className="card-elevated p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
