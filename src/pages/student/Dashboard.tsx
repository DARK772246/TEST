import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Student, getStudentById } from '@/lib/db';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = async () => {
    if (user && 'rollNumber' in user) {
      const data = await getStudentById(user.id);
      setStudent(data || null);
    }
  };

  const studentData = student || (user as Student);

  if (!studentData) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-description">View your personal and academic information.</p>
        </div>

        {/* Profile Header */}
        <div className="card-elevated p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-28 h-28 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {studentData.profilePhoto ? (
                <img
                  src={studentData.profilePhoto}
                  alt={studentData.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{studentData.fullName}</h2>
              <p className="text-muted-foreground mt-1">S/O {studentData.fatherName}</p>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="badge badge-primary">{studentData.rollNumber}</span>
                <span className="badge bg-secondary text-secondary-foreground">
                  Class {studentData.class} - {studentData.semester}
                </span>
                <span className="badge bg-secondary text-secondary-foreground">
                  {studentData.gender}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">{studentData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground">{studentData.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-foreground">{studentData.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Registration Number</p>
                  <p className="text-foreground font-mono">{studentData.registrationNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Admission Date</p>
                  <p className="text-foreground">
                    {new Date(studentData.admissionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Class</p>
                  <p className="text-foreground">Class {studentData.class} - {studentData.semester} Semester</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">{studentData.attendance}%</span>
            </div>
            <p className="font-medium text-foreground">Attendance</p>
            <p className="text-sm text-muted-foreground">
              {studentData.attendance >= 80 ? 'Excellent' : studentData.attendance >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              studentData.feeStatus === 'Paid' ? 'bg-success/10' :
              studentData.feeStatus === 'Pending' ? 'bg-warning/10' :
              'bg-destructive/10'
            }`}>
              <span className={`text-sm font-bold ${
                studentData.feeStatus === 'Paid' ? 'text-success' :
                studentData.feeStatus === 'Pending' ? 'text-warning' :
                'text-destructive'
              }`}>
                {studentData.feeStatus}
              </span>
            </div>
            <p className="font-medium text-foreground">Fee Status</p>
            <p className="text-sm text-muted-foreground">
              Rs. {studentData.feePaid.toLocaleString()} / {studentData.feeTotal.toLocaleString()}
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">{studentData.subjects.length}</span>
            </div>
            <p className="font-medium text-foreground">Subjects</p>
            <p className="text-sm text-muted-foreground">Enrolled</p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
