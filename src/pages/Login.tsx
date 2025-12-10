import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GoldParticles } from '@/components/ui/GoldParticles';
import { PremiumLoader } from '@/components/ui/PremiumLoader';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Sun, Moon, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, 'admin');
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Gold Particles */}
      <GoldParticles />

      {/* Left side - Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold)), hsl(var(--gold-dark)))',
          }}
        />
        
        {/* Animated decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 animate-float"
            style={{ background: 'hsl(0 0% 100%)' }}
          />
          <div 
            className="absolute bottom-20 -right-20 w-96 h-96 rounded-full opacity-15 animate-float"
            style={{ background: 'hsl(0 0% 100%)', animationDelay: '2s' }}
          />
          <div 
            className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-10 animate-float"
            style={{ background: 'hsl(0 0% 100%)', animationDelay: '4s' }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-background">
          <div className="mb-12">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 animate-pulse-gold"
              style={{
                background: 'hsl(0 0% 100% / 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid hsl(0 0% 100% / 0.3)',
              }}
            >
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-display font-bold mb-4">
              IMPERIAL MEDICAL SCIENCE AND ART COLLEGE
            </h1>
            <p className="text-xl text-background/80 leading-relaxed">
              A comprehensive solution for managing students, attendance, fees, and academic records.
            </p>
          </div>
          
          <div className="space-y-5">
            {[
              'Real-time data synchronization',
              'Offline support with auto-sync',
              'Comprehensive student profiles',
            ].map((feature, index) => (
              <div 
                key={feature}
                className="flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-3 h-3 rounded-full bg-background/80 animate-pulse" />
                <p className="text-background/90 text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 relative z-10">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300 group"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 group-hover:text-gold transition-colors" />
          ) : (
            <Sun className="w-5 h-5 group-hover:text-gold transition-colors" />
          )}
        </button>

        <div className="max-w-md mx-auto w-full">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 animate-fade-in">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 animate-pulse-gold"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold)))',
              }}
            >
              <GraduationCap className="w-7 h-7 text-background" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">IMPERIAL</h1>
            <p className="text-sm text-gold tracking-widest">EDUCATION SYSTEM</p>
          </div>

          <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-gold" />
              <span className="text-sm font-semibold text-gold tracking-widest uppercase">Admin Portal</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground mb-3">Welcome Back</h2>
            <p className="text-muted-foreground text-lg">
              Please enter your credentials to continue.
            </p>
          </div>

          {error && (
            <div 
              className="mb-8 p-4 rounded-xl flex items-center gap-3 animate-fade-in"
              style={{
                background: 'hsl(var(--destructive) / 0.1)',
                border: '1px solid hsl(var(--destructive) / 0.3)',
              }}
            >
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-gold transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@school.com"
                  className="input-premium pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-gold transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full flex items-center justify-center gap-3 py-4 text-lg"
            >
              {isLoading ? (
                <PremiumLoader size="sm" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-muted-foreground mb-4">
              Are you a student?
            </p>
            <Link
              to="/student-login"
              className="inline-flex items-center gap-2 text-gold font-semibold hover:underline transition-all"
            >
              Go to Student Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div 
            className="mt-10 p-5 rounded-xl animate-fade-in" 
            style={{ 
              animationDelay: '0.4s',
              background: 'hsl(var(--secondary) / 0.5)',
              border: '1px solid hsl(var(--gold) / 0.2)',
            }}
          >
            <p className="text-xs text-muted-foreground mb-3 tracking-widest uppercase">Demo Credentials</p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{' '}
                <code className="text-gold font-mono">admin@school.com</code>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Password:</span>{' '}
                <code className="text-gold font-mono">admin123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
