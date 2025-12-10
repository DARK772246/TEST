import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getStudentById, updateStudent, Student } from '@/lib/db';
import { ArrowLeft, Upload, User, BookOpen, Phone, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Urdu',
  'Computer Science',
  'Pakistan Studies',
  'Islamic Studies',
];

const classes = ['9', '10', '11', '12'];
const semesters = ['1st', '2nd'];
const genders = ['Male', 'Female', 'Other'];

export default function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [student, setStudent] = useState<Student | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    class: '10',
    semester: '1st',
    rollNumber: '',
    registrationNumber: '',
    subjects: [] as string[],
    phone: '',
    email: '',
    address: '',
    feeStatus: 'Pending' as 'Paid' | 'Pending' | 'Overdue',
    feePaid: 0,
    feeTotal: 50000,
    attendance: 0,
    admissionDate: new Date().toISOString().split('T')[0],
    comments: '',
    password: '',
  });

  useEffect(() => {
    if (id) {
      loadStudent(id);
    }
  }, [id]);

  const loadStudent = async (studentId: string) => {
    try {
      const data = await getStudentById(studentId);
      if (data) {
        setStudent(data);
        setProfilePhoto(data.profilePhoto || '');
        setFormData({
          fullName: data.fullName,
          fatherName: data.fatherName,
          gender: data.gender,
          class: data.class,
          semester: data.semester,
          rollNumber: data.rollNumber,
          registrationNumber: data.registrationNumber,
          subjects: data.subjects,
          phone: data.phone,
          email: data.email,
          address: data.address,
          feeStatus: data.feeStatus,
          feePaid: data.feePaid,
          feeTotal: data.feeTotal,
          attendance: data.attendance,
          admissionDate: data.admissionDate,
          comments: data.comments,
          password: data.password,
        });
      } else {
        toast.error('Student not found');
        navigate('/admin/students');
      }
    } catch (error) {
      toast.error('Failed to load student');
      navigate('/admin/students');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);

    try {
      await updateStudent(id, {
        ...formData,
        profilePhoto,
      });
      toast.success('Student updated successfully');
      navigate(`/admin/students/${id}`);
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="page-header mb-0">
            <h1 className="page-title">Edit Student</h1>
            <p className="page-description">Update {student?.fullName}'s information.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Photo
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Father's Name *
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="input-field"
                  required
                >
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Admission Date *
                </label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Class *
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="input-field"
                  required
                >
                  {classes.map((c) => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Semester *
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="input-field"
                  required
                >
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s} Semester</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Roll Number *
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="STD001"
                  className="input-field font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="REG2024001"
                  className="input-field font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Subjects
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.subjects.includes(subject)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@email.com"
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Fee Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Fee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Total Fee (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.feeTotal}
                  onChange={(e) => setFormData({ ...formData, feeTotal: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fee Paid (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.feePaid}
                  onChange={(e) => setFormData({ ...formData, feePaid: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fee Status
                </label>
                <select
                  value={formData.feeStatus}
                  onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value as any })}
                  className="input-field"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Attendance (%)
                </label>
                <input
                  type="number"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comments / Notes
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Any additional notes about the student..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
