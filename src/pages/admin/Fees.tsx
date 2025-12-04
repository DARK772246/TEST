import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { getAllStudents, updateStudent, Student } from '@/lib/db';
import { DollarSign, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminFees() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Paid' | 'Pending' | 'Overdue'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = filter === 'all'
    ? students
    : students.filter((s) => s.feeStatus === filter);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = {
    totalRevenue: students.reduce((acc, s) => acc + s.feePaid, 0),
    totalPending: students.reduce((acc, s) => acc + (s.feeTotal - s.feePaid), 0),
    paidCount: students.filter((s) => s.feeStatus === 'Paid').length,
    pendingCount: students.filter((s) => s.feeStatus === 'Pending').length,
    overdueCount: students.filter((s) => s.feeStatus === 'Overdue').length,
  };

  const handleUpdateStatus = async (studentId: string, newStatus: 'Paid' | 'Pending' | 'Overdue') => {
    try {
      const student = students.find((s) => s.id === studentId);
      if (!student) return;

      const updates: Partial<Student> = { feeStatus: newStatus };
      if (newStatus === 'Paid') {
        updates.feePaid = student.feeTotal;
      }

      await updateStudent(studentId, updates);
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
      );
      toast.success('Fee status updated');
    } catch (error) {
      toast.error('Failed to update fee status');
    }
  };

  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (student: Student) => (
        <Link to={`/admin/students/${student.id}`} className="flex items-center gap-3 hover:opacity-80">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {student.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{student.fullName}</p>
            <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
          </div>
        </Link>
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
      key: 'total',
      header: 'Total Fee',
      render: (student: Student) => (
        <span className="font-medium text-foreground">
          Rs. {student.feeTotal.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paid',
      header: 'Paid',
      render: (student: Student) => (
        <span className="text-success font-medium">
          Rs. {student.feePaid.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'pending',
      header: 'Pending',
      render: (student: Student) => (
        <span className="text-warning font-medium">
          Rs. {(student.feeTotal - student.feePaid).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (student: Student) => (
        <select
          value={student.feeStatus}
          onChange={(e) => handleUpdateStatus(student.id, e.target.value as any)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer ${
            student.feeStatus === 'Paid' ? 'bg-success/10 text-success' :
            student.feeStatus === 'Pending' ? 'bg-warning/10 text-warning' :
            'bg-destructive/10 text-destructive'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">Fee Management</h1>
            <p className="page-description">Track and manage student fee payments.</p>
          </div>
          
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
          />
          <StatCard
            title="Total Pending"
            value={`Rs. ${stats.totalPending.toLocaleString()}`}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Students Paid"
            value={stats.paidCount}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Overdue Fees"
            value={stats.overdueCount}
            icon={AlertTriangle}
            variant="destructive"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['all', 'Paid', 'Pending', 'Overdue'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {status === 'all' ? 'All Students' : status}
              <span className="ml-2 text-xs opacity-70">
                ({status === 'all' ? students.length :
                  status === 'Paid' ? stats.paidCount :
                  status === 'Pending' ? stats.pendingCount :
                  stats.overdueCount})
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={paginatedStudents}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          emptyMessage="No students found"
        />
      </div>
    </AdminLayout>
  );
}
