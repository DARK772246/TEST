import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
<<<<<<< HEAD
import { GraduationCap, Users, BookOpen, Shield, Sun, Moon, ArrowRight } from 'lucide-react';
=======
import { GoldParticles } from '@/components/ui/GoldParticles';
import { DeveloperBrand } from '@/components/ui/DeveloperBrand';
import { GraduationCap, Users, BookOpen, Shield, Sun, Moon, ArrowRight, Sparkles } from 'lucide-react';
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7

export default function Index() {
  const { theme, toggleTheme } = useTheme();

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SMS</span>
=======
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gold Particles Background */}
      <GoldParticles />

      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-gold/10">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--background) / 0.95), hsl(var(--background) / 0.8))',
          }}
        />
        <div className="relative container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse-gold"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold)))',
                boxShadow: '0 10px 30px -10px hsl(var(--gold) / 0.5)',
              }}
            >
              <GraduationCap className="w-6 h-6 text-background" />
            </div>
            <div>
              <span className="text-xl font-display font-bold text-foreground">IMPERIAL</span>
              <p className="text-xs text-gold tracking-widest">EDUCATION</p>
            </div>
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
<<<<<<< HEAD
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Link to="/login" className="btn-secondary hidden sm:flex">
              Admin Login
            </Link>
            <Link to="/student-login" className="btn-primary">
=======
              className="p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300 group"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 group-hover:text-gold transition-colors" />
              ) : (
                <Sun className="w-5 h-5 group-hover:text-gold transition-colors" />
              )}
            </button>
            <Link 
              to="/login" 
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 glass-card rounded-xl text-foreground font-medium hover:scale-105 transition-all duration-300"
            >
              Admin Login
            </Link>
            <Link to="/student-login" className="btn-gold">
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
              Student Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
<<<<<<< HEAD
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
=======
      <section className="relative pt-40 pb-24 px-6">
        <div className="container mx-auto text-center relative z-10">
          {/* Floating badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 animate-float glass-card border border-gold/30"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold">IMPERIAL MEDICAL SCIENCE AND ART COLLEGE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 animate-fade-in">
            <span className="text-foreground">Manage Students</span>
            <br />
            <span className="metallic-gold">Effortlessly</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
            A comprehensive solution for managing students, attendance, fees, and academic records.
            Works online and offline with automatic synchronization.
          </p>
          
<<<<<<< HEAD
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/student-login" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
=======
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/student-login" 
              className="btn-gold text-lg px-10 py-4 flex items-center gap-3"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-4 glass-card rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
              Admin Access
            </Link>
          </div>
        </div>
<<<<<<< HEAD
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
=======

        {/* Decorative 3D elements */}
        <div 
          className="absolute top-1/2 left-10 w-20 h-20 rounded-full opacity-30 blur-xl animate-float"
          style={{ 
            background: 'hsl(var(--gold))',
            animationDelay: '0s',
          }}
        />
        <div 
          className="absolute top-1/3 right-20 w-32 h-32 rounded-full opacity-20 blur-2xl animate-float"
          style={{ 
            background: 'hsl(var(--gold))',
            animationDelay: '2s',
          }}
        />
      </section>

      {/* Features - 3D Cards */}
      <section className="py-24 px-6 relative">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent, hsl(var(--card) / 0.5), transparent)',
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="text-foreground">Key </span>
              <span className="text-gold">Features</span>
            </h2>
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)',
              }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
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
<<<<<<< HEAD
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
=======
                className="card-3d p-8 animate-fade-in group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.1))',
                    border: '1px solid hsl(var(--gold) / 0.3)',
                  }}
                >
                  <feature.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Support */}
<<<<<<< HEAD
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Works Offline
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
=======
      <section className="py-24 px-6 relative">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto glass-card p-12 rounded-3xl">
            <h2 className="text-4xl font-display font-bold mb-6">
              <span className="text-foreground">Works </span>
              <span className="text-gold">Offline</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
              Our system uses IndexedDB for local storage, allowing you to work seamlessly
              even without an internet connection. Data automatically syncs when you're back online.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
<<<<<<< HEAD
              <span className="badge badge-success">Offline Support</span>
              <span className="badge badge-primary">Auto Sync</span>
              <span className="badge bg-secondary text-secondary-foreground">PWA Ready</span>
=======
              <span className="badge-premium">
                <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                Offline Support
              </span>
              <span className="badge-premium">
                <span className="w-2 h-2 rounded-full bg-gold mr-2 animate-pulse" />
                Auto Sync
              </span>
              <span className="badge-premium">
                <span className="w-2 h-2 rounded-full bg-gold mr-2 animate-pulse" />
                PWA Ready
              </span>
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
<<<<<<< HEAD
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
=======
      <section className="py-24 px-6 relative">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent, hsl(var(--card) / 0.5), transparent)',
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="text-foreground">Try It </span>
              <span className="text-gold">Now</span>
            </h2>
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)',
              }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card-3d p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.1))',
                    border: '1px solid hsl(var(--gold) / 0.3)',
                  }}
                >
                  <Shield className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground">Admin Login</h3>
              </div>
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-secondary/50">
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <code className="text-gold font-mono">admin@school.com</code>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Password:</span>{' '}
                  <code className="text-gold font-mono">admin123</code>
                </p>
              </div>
              <Link to="/login" className="btn-gold w-full flex items-center justify-center gap-2">
                Go to Admin Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="card-3d p-8">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.1))',
                    border: '1px solid hsl(var(--gold) / 0.3)',
                  }}
                >
                  <GraduationCap className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground">Student Login</h3>
              </div>
              <div className="space-y-3 mb-6 p-4 rounded-xl bg-secondary/50">
                <p className="text-sm">
                  <span className="text-muted-foreground">Roll Number:</span>{' '}
                  <code className="text-gold font-mono">STD001</code>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Password:</span>{' '}
                  <code className="text-gold font-mono">student123</code>
                </p>
              </div>
              <Link to="/student-login" className="btn-gold w-full flex items-center justify-center gap-2">
                Go to Student Login
                <ArrowRight className="w-4 h-4" />
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
              </Link>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Developed by <span className="font-semibold text-foreground">Salman Khan</span> — Passion for Discipline, Sports & Technology.
          </p>
        </div>
=======
      {/* Premium Footer */}
      <footer className="relative border-t border-gold/10 bg-card/50 backdrop-blur-sm">
        <DeveloperBrand />
>>>>>>> 01bd450c63ccdf5da618003b6be8ac6aa4e318e7
      </footer>
    </div>
  );
}
