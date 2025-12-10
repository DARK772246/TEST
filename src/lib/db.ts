import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Student {
  id: string;
  fullName: string;
  fatherName: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string;
  semester: string;
  rollNumber: string;
  registrationNumber: string;
  subjects: string[];
  phone: string;
  email: string;
  address: string;
  profilePhoto?: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  feePaid: number;
  feeTotal: number;
  attendance: number;
  admissionDate: string;
  comments: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Notification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface StudentDBSchema extends DBSchema {
  students: {
    key: string;
    value: Student;
    indexes: {
      'by-roll': string;
      'by-class': string;
      'by-name': string;
      'by-email': string;
    };
  };
  admins: {
    key: string;
    value: Admin;
    indexes: {
      'by-email': string;
    };
  };
  notifications: {
    key: string;
    value: Notification;
    indexes: {
      'by-student': string;
    };
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      type: 'create' | 'update' | 'delete';
      table: string;
      data: unknown;
      timestamp: number;
    };
  };
}

let db: IDBPDatabase<StudentDBSchema> | null = null;

export async function initDB(): Promise<IDBPDatabase<StudentDBSchema>> {
  if (db) return db;

  db = await openDB<StudentDBSchema>('student-management', 1, {
    upgrade(database) {
      // Students store
      const studentStore = database.createObjectStore('students', { keyPath: 'id' });
      studentStore.createIndex('by-roll', 'rollNumber', { unique: true });
      studentStore.createIndex('by-class', 'class');
      studentStore.createIndex('by-name', 'fullName');
      studentStore.createIndex('by-email', 'email', { unique: true });

      // Admins store
      const adminStore = database.createObjectStore('admins', { keyPath: 'id' });
      adminStore.createIndex('by-email', 'email', { unique: true });

      // Notifications store
      const notificationStore = database.createObjectStore('notifications', { keyPath: 'id' });
      notificationStore.createIndex('by-student', 'studentId');

      // Sync queue store
      database.createObjectStore('syncQueue', { keyPath: 'id' });
    },
  });

  // Reset all admin passwords
  const adminTx = db.transaction('admins', 'readwrite');
  let adminCursor = await adminTx.store.openCursor();
  while (adminCursor) {
    const admin = { ...adminCursor.value, password: 'password' };
    adminCursor.update(admin);
    adminCursor = await adminCursor.continue();
  }
  await adminTx.done;

  // Reset all student passwords
  const studentTx = db.transaction('students', 'readwrite');
  let studentCursor = await studentTx.store.openCursor();
  while (studentCursor) {
    const student = { ...studentCursor.value, password: 'password' };
    studentCursor.update(student);
    studentCursor = await studentCursor.continue();
  }
  await studentTx.done;

  // Initialize default admin if not exists
  const adminCount = await db.count('admins');
  if (adminCount === 0) {
    await db.add('admins', {
      id: 'admin-1',
      email: 'admin@school.com',
      password: 'password',
      name: 'Administrator',
    });
  }

  // Add sample students if empty
  const studentCount = await db.count('students');
  if (studentCount === 0) {
    const sampleStudents: Student[] = [
      {
        id: 'std-1',
        fullName: 'Ahmed Khan',
        fatherName: 'Mohammad Khan',
        gender: 'Male',
        class: '10',
        semester: '1st',
        rollNumber: 'STD001',
        registrationNumber: 'REG2024001',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
        phone: '+92 300 1234567',
        email: 'ahmed@student.com',
        address: '123 Main Street, Islamabad',
        feeStatus: 'Paid',
        feePaid: 50000,
        feeTotal: 50000,
        attendance: 92,
        admissionDate: '2024-01-15',
        comments: 'Excellent academic performance',
        password: 'password',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: true,
      },
      {
        id: 'std-2',
        fullName: 'Fatima Ali',
        fatherName: 'Ali Hassan',
        gender: 'Female',
        class: '10',
        semester: '1st',
        rollNumber: 'STD002',
        registrationNumber: 'REG2024002',
        subjects: ['Mathematics', 'Biology', 'Chemistry', 'English', 'Urdu'],
        phone: '+92 301 2345678',
        email: 'fatima@student.com',
        address: '456 Garden Town, Lahore',
        feeStatus: 'Pending',
        feePaid: 25000,
        feeTotal: 50000,
        attendance: 88,
        admissionDate: '2024-01-20',
        comments: 'Good in biology and chemistry',
        password: 'password',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: true,
      },
      {
        id: 'std-3',
        fullName: 'Usman Malik',
        fatherName: 'Tariq Malik',
        gender: 'Male',
        class: '9',
        semester: '2nd',
        rollNumber: 'STD003',
        registrationNumber: 'REG2024003',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Pakistan Studies'],
        phone: '+92 302 3456789',
        email: 'usman@student.com',
        address: '789 Defence, Karachi',
        feeStatus: 'Overdue',
        feePaid: 10000,
        feeTotal: 50000,
        attendance: 75,
        admissionDate: '2024-02-01',
        comments: 'Needs improvement in attendance',
        password: 'password',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: true,
      },
    ];

    for (const student of sampleStudents) {
      await db.add('students', student);
    }

    // Add sample notifications
    await db.add('notifications', {
      id: 'notif-1',
      studentId: 'std-1',
      title: 'Fee Payment Confirmed',
      message: 'Your fee payment of Rs. 50,000 has been confirmed.',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return db;
}

export async function getDB(): Promise<IDBPDatabase<StudentDBSchema>> {
  if (!db) {
    return initDB();
  }
  return db;
}

// Student operations
export async function getAllStudents(): Promise<Student[]> {
  const database = await getDB();
  return database.getAll('students');
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const database = await getDB();
  return database.get('students', id);
}

export async function getStudentByEmail(email: string): Promise<Student | undefined> {
  const database = await getDB();
  return database.getFromIndex('students', 'by-email', email);
}

export async function getStudentByRollNumber(rollNumber: string): Promise<Student | undefined> {
  const database = await getDB();
  return database.getFromIndex('students', 'by-roll', rollNumber);
}

export async function addStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Promise<Student> {
  const database = await getDB();
  const newStudent: Student = {
    ...student,
    id: `std-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    synced: navigator.onLine,
  };
  await database.add('students', newStudent);
  
  if (!navigator.onLine) {
    await addToSyncQueue('create', 'students', newStudent);
  }
  
  return newStudent;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined> {
  const database = await getDB();
  const existing = await database.get('students', id);
  if (!existing) return undefined;

  const updated: Student = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
    synced: navigator.onLine,
  };
  await database.put('students', updated);
  
  if (!navigator.onLine) {
    await addToSyncQueue('update', 'students', updated);
  }
  
  return updated;
}

export async function deleteStudent(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('students', id);
  
  if (!navigator.onLine) {
    await addToSyncQueue('delete', 'students', { id });
  }
}

// Admin operations
export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  const database = await getDB();
  return database.getFromIndex('admins', 'by-email', email);
}

export async function getAllAdmins(): Promise<Admin[]> {
  const database = await getDB();
  return database.getAll('admins');
}

export async function addAdmin(admin: Omit<Admin, 'id'>): Promise<Admin> {
  const database = await getDB();
  
  // Check if email already exists
  const existing = await database.getFromIndex('admins', 'by-email', admin.email);
  if (existing) {
    throw new Error('An admin with this email already exists');
  }
  
  const newAdmin: Admin = {
    ...admin,
    id: `admin-${Date.now()}`,
  };
  await database.add('admins', newAdmin);
  return newAdmin;
}

export async function updateAdmin(id: string, updates: Partial<Omit<Admin, 'id' | 'password'>>): Promise<Admin | undefined> {
  const database = await getDB();
  const existing = await database.get('admins', id);
  if (!existing) return undefined;

  // Check if new email already exists (if email is being updated)
  if (updates.email && updates.email !== existing.email) {
    const emailExists = await database.getFromIndex('admins', 'by-email', updates.email);
    if (emailExists) {
      throw new Error('An admin with this email already exists');
    }
  }

  const updated: Admin = {
    ...existing,
    ...updates,
  };
  await database.put('admins', updated);
  return updated;
}

export async function deleteAdmin(id: string): Promise<void> {
  const database = await getDB();
  const admins = await database.getAll('admins');
  if (admins.length <= 1) {
    throw new Error('Cannot delete the last admin');
  }
  await database.delete('admins', id);
}

// Notification operations
export async function getNotificationsByStudent(studentId: string): Promise<Notification[]> {
  const database = await getDB();
  return database.getAllFromIndex('notifications', 'by-student', studentId);
}

export async function markNotificationRead(id: string): Promise<void> {
  const database = await getDB();
  const notification = await database.get('notifications', id);
  if (notification) {
    notification.read = true;
    await database.put('notifications', notification);
  }
}

export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
  const database = await getDB();
  await database.add('notifications', {
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
}

// Sync queue operations
async function addToSyncQueue(type: 'create' | 'update' | 'delete', table: string, data: unknown): Promise<void> {
  const database = await getDB();
  await database.add('syncQueue', {
    id: `sync-${Date.now()}`,
    type,
    table,
    data,
    timestamp: Date.now(),
  });
}

export async function processSyncQueue(): Promise<void> {
  const database = await getDB();
  const queue = await database.getAll('syncQueue');
  
  for (const item of queue) {
    // In a real app, this would sync to a backend server
    console.log('Syncing:', item);
    await database.delete('syncQueue', item.id);
  }
  
  // Mark all students as synced
  const students = await database.getAll('students');
  for (const student of students) {
    if (!student.synced) {
      student.synced = true;
      await database.put('students', student);
    }
  }
}

// Stats
export async function getStats(): Promise<{
  totalStudents: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  averageAttendance: number;
  totalRevenue: number;
  pendingRevenue: number;
}> {
  const students = await getAllStudents();
  
  const totalStudents = students.length;
  const totalPaid = students.filter(s => s.feeStatus === 'Paid').length;
  const totalPending = students.filter(s => s.feeStatus === 'Pending').length;
  const totalOverdue = students.filter(s => s.feeStatus === 'Overdue').length;
  const averageAttendance = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)
    : 0;
  const totalRevenue = students.reduce((acc, s) => acc + s.feePaid, 0);
  const pendingRevenue = students.reduce((acc, s) => acc + (s.feeTotal - s.feePaid), 0);
  
  return {
    totalStudents,
    totalPaid,
    totalPending,
    totalOverdue,
    averageAttendance,
    totalRevenue,
    pendingRevenue,
  };
}

// Admin password change
export async function updateAdminPassword(adminId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const database = await getDB();
  const admin = await database.get('admins', adminId);
  if (!admin || admin.password !== currentPassword) {
    return false;
  }
  admin.password = newPassword;
  await database.put('admins', admin);
  return true;
}

// Student password change
export async function updateStudentPassword(studentId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const database = await getDB();
  const student = await database.get('students', studentId);
  if (!student || student.password !== currentPassword) {
    return false;
  }
  student.password = newPassword;
  student.updatedAt = new Date().toISOString();
  await database.put('students', student);
  return true;
}

// Backup & Restore
export async function exportAllData(): Promise<string> {
  const database = await getDB();
  const students = await database.getAll('students');
  const admins = await database.getAll('admins');
  const notifications = await database.getAll('notifications');
  
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    students,
    admins,
    notifications,
  };
  
  return JSON.stringify(data, null, 2);
}

export async function importAllData(jsonString: string): Promise<{ success: boolean; error?: string }> {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.version || !data.students) {
      return { success: false, error: 'Invalid backup file format' };
    }
    
    const database = await getDB();
    
    // Clear existing data
    const tx = database.transaction(['students', 'notifications'], 'readwrite');
    await tx.objectStore('students').clear();
    await tx.objectStore('notifications').clear();
    
    // Import students
    for (const student of data.students) {
      await database.add('students', student);
    }
    
    // Import notifications
    if (data.notifications) {
      for (const notification of data.notifications) {
        await database.add('notifications', notification);
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to parse backup file' };
  }
}
