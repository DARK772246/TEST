import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { initDB } from "@/lib/db";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AddStudent from "./pages/admin/AddStudent";
import EditStudent from "./pages/admin/EditStudent";
import ViewStudent from "./pages/admin/ViewStudent";
import AdminFees from "./pages/admin/Fees";
import AdminSettings from "./pages/admin/Settings";
import StudentDashboard from "./pages/student/Dashboard";
import StudentSubjects from "./pages/student/Subjects";
import StudentAttendance from "./pages/student/Attendance";
import StudentFees from "./pages/student/Fees";
import StudentNotifications from "./pages/student/Notifications";
import StudentSettings from "./pages/student/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedType }: { children: React.ReactNode; allowedType: 'admin' | 'student' }) {
  const { user, userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || userType !== allowedType) {
    return <Navigate to={allowedType === 'admin' ? '/login' : '/student-login'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student-login" element={<StudentLogin />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedType="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedType="admin"><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/students/add" element={<ProtectedRoute allowedType="admin"><AddStudent /></ProtectedRoute>} />
      <Route path="/admin/students/:id" element={<ProtectedRoute allowedType="admin"><ViewStudent /></ProtectedRoute>} />
      <Route path="/admin/students/:id/edit" element={<ProtectedRoute allowedType="admin"><EditStudent /></ProtectedRoute>} />
      <Route path="/admin/fees" element={<ProtectedRoute allowedType="admin"><AdminFees /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedType="admin"><AdminSettings /></ProtectedRoute>} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedType="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/subjects" element={<ProtectedRoute allowedType="student"><StudentSubjects /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute allowedType="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/fees" element={<ProtectedRoute allowedType="student"><StudentFees /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute allowedType="student"><StudentNotifications /></ProtectedRoute>} />
      <Route path="/student/settings" element={<ProtectedRoute allowedType="student"><StudentSettings /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
