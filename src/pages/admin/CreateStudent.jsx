import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import { FaCheckCircle } from 'react-icons/fa';

const CLASSES = [
  'الروضة Kindergarten',
  'التمهيدي Preparatory',
  'الحضانة Nursery',
  'Arobiyyah 1 الفصل الأول',
  'Arobiyyah 2 الفصل الثانى',
  'Arobiyyah 3 الفصل الثالث',
  'Class Four الفصل الرابعة',
];

export default function CreateStudent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTeacher = user?.role === 'admin';
  const [success, setSuccess] = useState(false);
  const [createdStudent, setCreatedStudent] = useState(null);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { grade: isTeacher ? user?.assignedGrade || '' : '' },
  });

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        grade: formData.grade,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        parentAddress: formData.parentAddress,
      };
      const { data } = await studentsAPI.create(payload);
      setCreatedStudent(data.data?.student || null);
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
        {createdStudent?.admissionNumber && (
          <p className="text-muted">
            Admission Number: <strong>{createdStudent.admissionNumber}</strong>
          </p>
        )}
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
                <label className="form-label small fw-bold">Class <span className="text-danger">*</span></label>
                {isTeacher ? (
                  <input className="form-control" value={user?.assignedGrade || ''} disabled />
                ) : (
                  <select
                    {...register('grade', { required: 'Class is required' })}
                    className={`form-select ${errors.grade ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select class</option>
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
                {isTeacher && <input type="hidden" {...register('grade', { required: 'Class is required' })} />}
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

            </div>
            <p className="form-text mt-2">Subjects are assigned automatically based on the selected class. The admission number is generated automatically.</p>

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

