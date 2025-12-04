import React from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/lib/db';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StudentAttendance() {
  const { user } = useAuth();
  const student = user as Student;

  const attendancePercentage = student?.attendance || 0;
  const isGood = attendancePercentage >= 80;
  const isAverage = attendancePercentage >= 60 && attendancePercentage < 80;

  // Generate mock monthly data
  const monthlyData = [
    { month: 'Jan', percentage: 85, total: 22, present: 19 },
    { month: 'Feb', percentage: 90, total: 20, present: 18 },
    { month: 'Mar', percentage: 80, total: 23, present: 18 },
    { month: 'Apr', percentage: 88, total: 21, present: 18 },
    { month: 'May', percentage: 92, total: 24, present: 22 },
    { month: 'Jun', percentage: attendancePercentage, total: 20, present: Math.round(20 * attendancePercentage / 100) },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Attendance</h1>
          <p className="page-description">Track your attendance record.</p>
        </div>

        {/* Overall Attendance */}
        <div className="card-elevated p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={isGood ? 'hsl(var(--success))' : isAverage ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(attendancePercentage / 100) * 440} 440`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{attendancePercentage}%</span>
                <span className="text-sm text-muted-foreground">Overall</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {isGood ? 'Excellent Attendance!' : isAverage ? 'Good Progress' : 'Needs Improvement'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isGood
                  ? 'Keep up the great work! Your attendance is above the required minimum.'
                  : isAverage
                  ? 'Your attendance is acceptable but could be better.'
                  : 'Your attendance is below the required minimum. Please improve your attendance.'}
              </p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                {isGood ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : isAverage ? (
                  <Minus className="w-5 h-5 text-warning" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
                <span className={`font-medium ${
                  isGood ? 'text-success' : isAverage ? 'text-warning' : 'text-destructive'
                }`}>
                  {isGood ? 'Above 80%' : isAverage ? 'Between 60-80%' : 'Below 60%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Monthly Breakdown
          </h3>
          
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div
                key={month.month}
                className="flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 text-sm font-medium text-muted-foreground">
                  {month.month}
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        month.percentage >= 80 ? 'bg-success' :
                        month.percentage >= 60 ? 'bg-warning' :
                        'bg-destructive'
                      }`}
                      style={{ width: `${month.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-medium text-foreground">{month.percentage}%</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({month.present}/{month.total})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated p-6 text-center">
            <p className="text-3xl font-bold text-success mb-2">
              {monthlyData.reduce((acc, m) => acc + m.present, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Days Present</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <p className="text-3xl font-bold text-destructive mb-2">
              {monthlyData.reduce((acc, m) => acc + (m.total - m.present), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Days Absent</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <p className="text-3xl font-bold text-foreground mb-2">
              {monthlyData.reduce((acc, m) => acc + m.total, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Days</p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
