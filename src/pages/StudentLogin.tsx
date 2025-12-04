import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GraduationCap, Hash, Lock, Eye, EyeOff, Sun, Moon, AlertCircle } from 'lucide-react';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await loginStudent(rollNumber, password);
      if (success) {
        navigate('/student');
      } else {
        setError('Invalid roll number or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-foreground/90" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-background">
          <div className="mb-8">
            <div className="w-16 h-16 bg-background/20 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Student Portal</h1>
            <p className="text-lg text-background/80">
              Access your academic records, attendance, and fee status all in one place.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-background/60" />
              <p className="text-background/80">View your academic profile</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-background/60" />
              <p className="text-background/80">Track attendance and fees</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-background/60" />
              <p className="text-background/80">Download receipts and reports</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-background/10 rounded-full" />
        <div className="absolute top-20 -right-10 w-32 h-32 bg-background/10 rounded-full" />
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="lg:hidden mb-8">
            <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Student Portal</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Student Login</h2>
            <p className="text-muted-foreground">
              Enter your roll number and password to access your portal.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Roll Number
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="STD001"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Are you an administrator?
            </p>
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Go to Admin Login →
            </Link>
          </div>

          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
            <p className="text-sm text-foreground">Roll Number: STD001</p>
            <p className="text-sm text-foreground">Password: student123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
