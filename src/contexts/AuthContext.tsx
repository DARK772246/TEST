import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAdminByEmail, getStudentByEmail, getStudentByRollNumber, Student, Admin } from '@/lib/db';

type UserType = 'admin' | 'student' | null;

interface AuthContextType {
  user: Admin | Student | null;
  userType: UserType;
  isLoading: boolean;
  login: (email: string, password: string, type: 'admin' | 'student') => Promise<boolean>;
  loginStudent: (rollNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Admin | Student | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('sms_user');
    const storedType = localStorage.getItem('sms_user_type') as UserType;
    
    if (storedUser && storedType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedType);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, type: 'admin' | 'student'): Promise<boolean> => {
    try {
      if (type === 'admin') {
        const admin = await getAdminByEmail(email);
        if (admin && admin.password === password) {
          setUser(admin);
          setUserType('admin');
          localStorage.setItem('sms_user', JSON.stringify(admin));
          localStorage.setItem('sms_user_type', 'admin');
          return true;
        }
      } else {
        const student = await getStudentByEmail(email);
        if (student && student.password === password) {
          setUser(student);
          setUserType('student');
          localStorage.setItem('sms_user', JSON.stringify(student));
          localStorage.setItem('sms_user_type', 'student');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginStudent = async (rollNumber: string, password: string): Promise<boolean> => {
    try {
      const student = await getStudentByRollNumber(rollNumber);
      if (student && student.password === password) {
        setUser(student);
        setUserType('student');
        localStorage.setItem('sms_user', JSON.stringify(student));
        localStorage.setItem('sms_user_type', 'student');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_user_type');
  };

  return (
    <AuthContext.Provider value={{ user, userType, isLoading, login, loginStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
