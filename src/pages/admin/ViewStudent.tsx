import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getStudentById, Student } from '@/lib/db';
import { StudentQRCode } from '@/components/ui/StudentQRCode';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  User,
  DollarSign,
  BarChart2,
  QrCode,
} from 'lucide-react';

export default function ViewStudent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    if (!id) return;
    try {
      const data = await getStudentById(id);
      setStudent(data || null);
    } catch (error) {
      console.error('Error loading student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-4">The student you're looking for doesn't exist.</p>
          <Link to="/admin/students" className="btn-primary">
            Back to Students
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const feePercentage = Math.round((student.feePaid / student.feeTotal) * 100);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="page-header mb-0">
              <h1 className="page-title">Student Profile</h1>
              <p className="page-description">View complete student information.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQRCode(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              View QR
            </button>
            <Link
              to={`/admin/students/${student.id}/edit`}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </div>

        {/* Profile Header */}
        <div className="card-elevated p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-28 h-28 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {student.profilePhoto ? (
                <img
                  src={student.profilePhoto}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{student.fullName}</h2>
                  <p className="text-muted-foreground mt-1">S/O {student.fatherName}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <span className="badge badge-primary">{student.rollNumber}</span>
                    <span className="badge bg-secondary text-secondary-foreground">
                      Class {student.class} - {student.semester}
                    </span>
                    <span className={`badge ${
                      student.feeStatus === 'Paid' ? 'badge-success' :
                      student.feeStatus === 'Pending' ? 'badge-warning' :
                      'badge-destructive'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => setShowQRCode(true)}
                    className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-16 h-16 text-foreground" />
                  </button>
                  <p className="text-xs text-muted-foreground">{student.registrationNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">{student.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-foreground">{student.address || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Admission Date</p>
                  <p className="text-foreground">
                    {new Date(student.admissionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Subjects
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.subjects.map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1.5 bg-secondary rounded-lg text-sm text-foreground"
                >
                  {subject}
                </span>
              ))}
            </div>
            {student.subjects.length === 0 && (
              <p className="text-muted-foreground">No subjects assigned</p>
            )}
          </div>

          {/* Attendance */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              Attendance
            </h3>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="12"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke={
                      student.attendance >= 80 ? 'hsl(var(--success))' :
                      student.attendance >= 60 ? 'hsl(var(--warning))' :
                      'hsl(var(--destructive))'
                    }
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(student.attendance / 100) * 352} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{student.attendance}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {student.attendance >= 80 ? 'Excellent attendance' :
                 student.attendance >= 60 ? 'Needs improvement' :
                 'Critical - requires attention'}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Information */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Fee Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-secondary rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Total Fee</p>
              <p className="text-2xl font-bold text-foreground">Rs. {student.feeTotal.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Paid Amount</p>
              <p className="text-2xl font-bold text-success">Rs. {student.feePaid.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Pending Amount</p>
              <p className="text-2xl font-bold text-warning">
                Rs. {(student.feeTotal - student.feePaid).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Payment Progress</span>
              <span className="text-sm font-medium text-foreground">{feePercentage}%</span>
            </div>
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  feePercentage === 100 ? 'bg-success' :
                  feePercentage >= 50 ? 'bg-primary' :
                  'bg-warning'
                }`}
                style={{ width: `${feePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Comments */}
        {student.comments && (
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Comments / Notes</h3>
            <p className="text-muted-foreground">{student.comments}</p>
          </div>
        )}
      </div>

      <StudentQRCode
        open={showQRCode}
        onOpenChange={setShowQRCode}
        studentData={{
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          registrationNumber: student.registrationNumber,
          class: student.class,
          semester: student.semester,
        }}
      />
    </AdminLayout>
  );
}
