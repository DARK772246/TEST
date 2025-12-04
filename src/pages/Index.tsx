import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { GraduationCap, Users, BookOpen, Shield, Sun, Moon, ArrowRight } from 'lucide-react';

export default function Index() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SMS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Link to="/login" className="btn-secondary hidden sm:flex">
              Admin Login
            </Link>
            <Link to="/student-login" className="btn-primary">
              Student Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            IMPERIAL MEDICAL SCIENCE AND ART COLLEGE
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Manage Students
            <br />
            <span className="text-primary">Effortlessly</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A comprehensive solution for managing students, attendance, fees, and academic records.
            Works online and offline with automatic synchronization.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/student-login" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              Admin Access
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: 'Student Management',
                description: 'Complete student profiles with academic and personal information.',
              },
              {
                icon: BookOpen,
                title: 'Academic Tracking',
                description: 'Track attendance, subjects, and academic progress.',
              },
              {
                icon: Shield,
                title: 'Secure Access',
                description: 'Separate admin and student portals with secure login.',
              },
              {
                icon: GraduationCap,
                title: 'Fee Management',
                description: 'Track fee payments, generate receipts, and manage dues.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Support */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Works Offline
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our system uses IndexedDB for local storage, allowing you to work seamlessly
              even without an internet connection. Data automatically syncs when you're back online.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="badge badge-success">Offline Support</span>
              <span className="badge badge-primary">Auto Sync</span>
              <span className="badge bg-secondary text-secondary-foreground">PWA Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Try It Now
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Admin Login</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Email:</span> <code className="text-foreground">admin@school.com</code></p>
                <p><span className="text-muted-foreground">Password:</span> <code className="text-foreground">admin123</code></p>
              </div>
              <Link to="/login" className="btn-primary w-full mt-4">
                Go to Admin Login
              </Link>
            </div>
            
            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Student Login</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Roll Number:</span> <code className="text-foreground">STD001</code></p>
                <p><span className="text-muted-foreground">Password:</span> <code className="text-foreground">student123</code></p>
              </div>
              <Link to="/student-login" className="btn-primary w-full mt-4">
                Go to Student Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Developed by <span className="font-semibold text-foreground">Salman Khan</span> — Passion for Discipline, Sports & Technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
