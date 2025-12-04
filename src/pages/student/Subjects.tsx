import React from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/lib/db';
import { BookOpen, GraduationCap } from 'lucide-react';

const subjectColors: Record<string, string> = {
  'Mathematics': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'Physics': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'Chemistry': 'bg-green-500/10 text-green-600 dark:text-green-400',
  'Biology': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'English': 'bg-red-500/10 text-red-600 dark:text-red-400',
  'Urdu': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  'Computer Science': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  'Pakistan Studies': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'Islamic Studies': 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
};

export default function StudentSubjects() {
  const { user } = useAuth();
  const student = user as Student;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">My Subjects</h1>
          <p className="page-description">View your enrolled subjects for this semester.</p>
        </div>

        {/* Overview */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Class {student?.class} - {student?.semester} Semester
              </h3>
              <p className="text-muted-foreground">
                {student?.subjects?.length || 0} subjects enrolled
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {student?.subjects?.map((subject, index) => (
            <div
              key={subject}
              className="card-elevated p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                subjectColors[subject] || 'bg-primary/10 text-primary'
              }`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{subject}</h3>
              <p className="text-sm text-muted-foreground">
                {student.semester} Semester
              </p>
            </div>
          ))}
        </div>

        {(!student?.subjects || student.subjects.length === 0) && (
          <div className="card-elevated p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Subjects Assigned</h3>
            <p className="text-muted-foreground">
              Contact the administration to enroll in subjects.
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
