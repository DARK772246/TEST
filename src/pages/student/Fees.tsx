import React from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/lib/db';
import { DollarSign, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentFees() {
  const { user } = useAuth();
  const student = user as Student;

  const feePercentage = Math.round((student?.feePaid || 0) / (student?.feeTotal || 1) * 100);
  const pendingAmount = (student?.feeTotal || 0) - (student?.feePaid || 0);

  const feeHistory = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 25000,
      type: 'Tuition Fee',
      status: 'Paid',
      receipt: 'RCP-2024-001',
    },
    {
      id: '2',
      date: '2024-02-15',
      amount: 15000,
      type: 'Lab Fee',
      status: 'Paid',
      receipt: 'RCP-2024-002',
    },
    {
      id: '3',
      date: '2024-03-15',
      amount: 10000,
      type: 'Library Fee',
      status: student?.feeStatus === 'Paid' ? 'Paid' : 'Pending',
      receipt: student?.feeStatus === 'Paid' ? 'RCP-2024-003' : null,
    },
  ];

  const handleDownloadReceipt = (receiptId: string) => {
    toast.success(`Downloading receipt ${receiptId}...`);
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Fee Status</h1>
          <p className="page-description">View your fee payment details and history.</p>
        </div>

        {/* Fee Overview */}
        <div className="card-elevated p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              student?.feeStatus === 'Paid' ? 'bg-success/10' :
              student?.feeStatus === 'Pending' ? 'bg-warning/10' :
              'bg-destructive/10'
            }`}>
              {student?.feeStatus === 'Paid' ? (
                <CheckCircle className="w-8 h-8 text-success" />
              ) : student?.feeStatus === 'Pending' ? (
                <Clock className="w-8 h-8 text-warning" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-destructive" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Fee {student?.feeStatus}
                </h3>
                <span className={`badge ${
                  student?.feeStatus === 'Paid' ? 'badge-success' :
                  student?.feeStatus === 'Pending' ? 'badge-warning' :
                  'badge-destructive'
                }`}>
                  {student?.feeStatus}
                </span>
              </div>
              <p className="text-muted-foreground">
                {student?.feeStatus === 'Paid'
                  ? 'All fees have been paid for this semester.'
                  : student?.feeStatus === 'Pending'
                  ? 'Please complete your pending fee payment.'
                  : 'Your fee payment is overdue. Please pay immediately.'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Payment Progress</span>
              <span className="text-sm font-medium text-foreground">{feePercentage}%</span>
            </div>
            <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
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

        {/* Fee Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated p-6 text-center">
            <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-2xl font-bold text-foreground">
              Rs. {student?.feeTotal?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-muted-foreground">Total Fee</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
            <p className="text-2xl font-bold text-success">
              Rs. {student?.feePaid?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-muted-foreground">Paid Amount</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <Clock className="w-8 h-8 text-warning mx-auto mb-3" />
            <p className="text-2xl font-bold text-warning">
              Rs. {pendingAmount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Pending Amount</p>
          </div>
        </div>

        {/* Payment History */}
        <div className="card-elevated overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header text-left px-6 py-4">Date</th>
                  <th className="table-header text-left px-6 py-4">Type</th>
                  <th className="table-header text-left px-6 py-4">Amount</th>
                  <th className="table-header text-left px-6 py-4">Status</th>
                  <th className="table-header text-left px-6 py-4">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {feeHistory.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className="border-b border-border last:border-0 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="table-cell px-6">
                      {new Date(payment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="table-cell px-6 font-medium text-foreground">
                      {payment.type}
                    </td>
                    <td className="table-cell px-6">
                      Rs. {payment.amount.toLocaleString()}
                    </td>
                    <td className="table-cell px-6">
                      <span className={`badge ${
                        payment.status === 'Paid' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="table-cell px-6">
                      {payment.receipt ? (
                        <button
                          onClick={() => handleDownloadReceipt(payment.receipt!)}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          {payment.receipt}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
