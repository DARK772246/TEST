import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { getStats, getAllStudents, Student } from '@/lib/db';
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  UserPlus,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    averageAttendance: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
  });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, students] = await Promise.all([
        getStats(),
        getAllStudents(),
      ]);
      setStats(statsData);
      setRecentStudents(students.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const feeChartData = [
    { name: 'Paid', value: stats.totalPaid, color: 'hsl(142, 76%, 36%)' },
    { name: 'Pending', value: stats.totalPending, color: 'hsl(38, 92%, 50%)' },
    { name: 'Overdue', value: stats.totalOverdue, color: 'hsl(0, 72%, 51%)' },
  ];

  const attendanceData = [
    { month: 'Jan', attendance: 85 },
    { month: 'Feb', attendance: 88 },
    { month: 'Mar', attendance: 82 },
    { month: 'Apr', attendance: 90 },
    { month: 'May', attendance: 87 },
    { month: 'Jun', attendance: 91 },
  ];

  const columns = [
    {
      key: 'fullName',
      header: 'Student',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {student.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{student.fullName}</p>
            <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (student: Student) => (
        <span className="text-foreground">Class {student.class}</span>
      ),
    },
    {
      key: 'feeStatus',
      header: 'Fee Status',
      render: (student: Student) => (
        <span className={`badge ${
          student.feeStatus === 'Paid' ? 'badge-success' :
          student.feeStatus === 'Pending' ? 'badge-warning' :
          'badge-destructive'
        }`}>
          {student.feeStatus}
        </span>
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      render: (student: Student) => (
        <span className="text-foreground">{student.attendance}%</span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-description">Welcome back! Here's an overview of your institution.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/admin/students/add" className="btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Student
            </Link>
            <button className="btn-secondary flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stagger-1">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              variant="primary"
              trend={{ value: 12, isPositive: true }}
            />
          </div>
          <div className="stagger-2">
            <StatCard
              title="Fees Paid"
              value={stats.totalPaid}
              icon={CheckCircle}
              variant="success"
            />
          </div>
          <div className="stagger-3">
            <StatCard
              title="Fees Pending"
              value={stats.totalPending}
              icon={Clock}
              variant="warning"
            />
          </div>
          <div className="stagger-4">
            <StatCard
              title="Fees Overdue"
              value={stats.totalOverdue}
              icon={AlertTriangle}
              variant="destructive"
            />
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
          />
          <StatCard
            title="Average Attendance"
            value={`${stats.averageAttendance}%`}
            icon={TrendingUp}
            variant="primary"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fee Status Chart */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Fee Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {feeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {feeChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Attendance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="attendance"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Students */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Students</h3>
            <Link
              to="/admin/students"
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <DataTable
            columns={columns}
            data={recentStudents}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            isLoading={isLoading}
            emptyMessage="No students found"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
