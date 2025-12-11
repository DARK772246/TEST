import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { initDB } from "@/lib/db";

// Layouts
import AdminLayout from "@/components/layout/AdminLayout";
import StudentLayout from "@/components/layout/StudentLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AddStudent from "./pages/admin/AddStudent";
import ViewStudent from "./pages/admin/ViewStudent";
import AdminFees from "./pages/admin/Fees";
import AdminSettings from "./pages/admin/Settings";
import ChangePassword from "./pages/admin/ChangePassword";
import StudentDashboard from "./pages/student/Dashboard";
import StudentSubjects from "./pages/student/Subjects";
import StudentAttendance from "./pages/student/Attendance";
import StudentFees from "./pages/student/Fees";
import StudentNotifications from "./pages/student/Notifications";
import StudentSettings from "./pages/student/Settings";
import StudentChangePassword from "./pages/student/ChangePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ allowedType }: { allowedType: 'admin' | 'student' }) {
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

  return <Outlet />;
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
      <Route element={<ProtectedRoute allowedType="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/:id" element={<ViewStudent />} />
          <Route path="students/:id/edit" element={<AddStudent />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="settings/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedType="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="subjects" element={<StudentSubjects />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route path="settings/change-password" element={<StudentChangePassword />} />
        </Route>
      </Route>

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
