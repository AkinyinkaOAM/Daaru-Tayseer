import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ChangePassword() {
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async ({ currentPassword, newPassword: submittedPassword }) => {
    setServerError('');
    try {
      await changePassword(currentPassword, submittedPassword);
      if (user?.role === 'student') navigate('/student/portal', { replace: true });
      else if (user?.role === 'parent') navigate('/parent/portal', { replace: true });
      else navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-2">Change Your Password</h5>
              <p className="text-muted small">Your temporary password must be replaced before you continue.</p>
              {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Temporary password</label>
                  <input type="password" className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`} {...register('currentPassword', { required: 'Temporary password is required' })} />
                  {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword.message}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">New password</label>
                  <input type="password" className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`} {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
                  {errors.newPassword && <div className="invalid-feedback">{errors.newPassword.message}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Confirm new password</label>
                  <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} {...register('confirmPassword', { required: 'Please confirm your new password', validate: (value) => value === newPassword || 'Passwords do not match' })} />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Set New Password'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
