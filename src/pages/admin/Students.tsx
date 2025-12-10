import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DataTable } from '@/components/ui/DataTable';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import { getAllStudents, deleteStudent, Student } from '@/lib/db';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = !filterClass || student.class === filterClass;
      const matchesStatus = !filterStatus || student.feeStatus === filterStatus;
      
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, searchTerm, filterClass, filterStatus]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueClasses = [...new Set(students.map((s) => s.class))].sort();

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteStudent(studentToDelete.id);
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      toast.success('Student deleted successfully');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Roll Number', 'Class', 'Email', 'Phone', 'Fee Status', 'Attendance'];
    const rows = students.map((s) => [
      s.fullName,
      s.rollNumber,
      s.class,
      s.email,
      s.phone,
      s.feeStatus,
      `${s.attendance}%`,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    toast.success('Export successful');
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Student',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {student.profilePhoto ? (
              <img
                src={student.profilePhoto}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-primary">
                {student.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">{student.fullName}</p>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rollNumber',
      header: 'Roll No.',
      render: (student: Student) => (
        <span className="font-mono text-foreground">{student.rollNumber}</span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (student: Student) => (
        <span className="text-foreground">Class {student.class} - {student.semester}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (student: Student) => (
        <span className="text-muted-foreground">{student.phone}</span>
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
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                student.attendance >= 80 ? 'bg-success' :
                student.attendance >= 60 ? 'bg-warning' :
                'bg-destructive'
              }`}
              style={{ width: `${student.attendance}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{student.attendance}%</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-16',
      render: (student: Student) => (
        <div 
          className="flex items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Link
            to={`/admin/students/${student.id}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`/admin/students/${student.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeleteClick(student);
            }}
            className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">Students</h1>
            <p className="page-description">Manage all student records and information.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link to="/admin/students/add" className="btn-primary flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Student
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card-elevated p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, roll number, or email..."
                className="input-field pl-12"
              />
            </div>

            {/* Class Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={filterClass}
                onChange={(e) => {
                  setFilterClass(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field pl-12 pr-8 appearance-none cursor-pointer"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Active filters */}
          {(searchTerm || filterClass || filterStatus) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <span className="badge badge-primary">
                  Search: {searchTerm}
                </span>
              )}
              {filterClass && (
                <span className="badge badge-primary">
                  Class: {filterClass}
                </span>
              )}
              {filterStatus && (
                <span className="badge badge-primary">
                  Status: {filterStatus}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterClass('');
                  setFilterStatus('');
                }}
                className="text-sm text-primary hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedStudents.length} of {filteredStudents.length} students
          </p>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={paginatedStudents}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={(student) => navigate(`/admin/students/${student.id}`)}
          isLoading={isLoading}
          emptyMessage="No students found matching your criteria"
        />
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        description={`Are you sure you want to delete ${studentToDelete?.fullName}? This action cannot be undone and all associated data will be permanently removed.`}
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}
