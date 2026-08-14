import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api, { studentsAPI } from '../../services/api';
import { FaCheckCircle } from 'react-icons/fa';

const SESSIONS = [
  '2023/2024', '2024/2025', '2025/2026', '2026/2027', '2027/2028',
];

const CLASSES = [
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3',
  'Hifdh 1', 'Hifdh 2', 'Hifdh 3',
];

export default function CreateStudent() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [courses, setCourses] = useState([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data.data || []);
      } catch {
        setCourses([]);
      }
    };
    loadCourses();
  }, []);

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        admissionNumber: formData.admissionNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        grade: formData.grade,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        parentAddress: formData.parentAddress,
        feePaid: Number(formData.feePaid || 0),
        feeBalance: Number(formData.feeBalance || 0),
        courses: formData.courses || [],
      };
      await studentsAPI.create(payload);
      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create student');
    }
  };

  if (success) {
    return (
      <div className="text-center py-5">
        <FaCheckCircle size={56} className="text-success mb-3" />
        <h5>Student Created Successfully!</h5>
        <p className="text-muted">You can add another student or go back to the list.</p>
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-success rounded-pill" onClick={() => setSuccess(false)}>
            Add Another
          </button>
          <button className="btn btn-outline-success rounded-pill" onClick={() => navigate('/admin/students')}>
            View Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Create New Student</h4>
        <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => navigate('/admin/students')}>
          ← Back to Students
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {serverError && (
            <div className="alert alert-danger py-2 small">{serverError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">First Name <span className="text-danger">*</span></label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  placeholder="First name"
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Last Name <span className="text-danger">*</span></label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  placeholder="Last name"
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Admission Number <span className="text-danger">*</span></label>
                <input
                  {...register('admissionNumber', { required: 'Admission number is required' })}
                  className={`form-control ${errors.admissionNumber ? 'is-invalid' : ''}`}
                  placeholder="e.g. DTS001"
                />
                {errors.admissionNumber && <div className="invalid-feedback">{errors.admissionNumber.message}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Class <span className="text-danger">*</span></label>
                <select
                  {...register('grade', { required: 'Class is required' })}
                  className={`form-select ${errors.grade ? 'is-invalid' : ''}`}
                >
                  <option value="">Select class</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.grade && <div className="invalid-feedback">{errors.grade.message}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Gender</label>
                <select {...register('gender')} className="form-select">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Date of Birth</label>
                <input type="date" {...register('dateOfBirth')} className="form-control" />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Parent / Guardian Name</label>
                <input {...register('parentName')} className="form-control" placeholder="Parent name" />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Parent Email</label>
                <input type="email" {...register('parentEmail')} className="form-control" placeholder="parent@example.com" />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Parent Phone</label>
                <input {...register('parentPhone')} className="form-control" placeholder="Phone" />
              </div>

              <div className="col-md-12">
                <label className="form-label small fw-bold">Parent Address</label>
                <input {...register('parentAddress')} className="form-control" placeholder="Address" />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Fee Paid</label>
                <input type="number" {...register('feePaid')} className="form-control" defaultValue={0} />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Fee Balance</label>
                <input type="number" {...register('feeBalance')} className="form-control" defaultValue={0} />
              </div>

              <div className="col-md-12">
                <label className="form-label small fw-bold">Register Courses</label>
                <select {...register('courses')} className="form-select" multiple size="5">
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>{course.name}</option>
                  ))}
                </select>
                <div className="form-text">Hold Ctrl/Cmd to select multiple subjects.</div>
              </div>
            </div>

            <hr />
            <button
              type="submit"
              className="btn btn-success rounded-pill px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Student'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

