import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      if (user?.mustChangePassword) {
        navigate('/change-password', { replace: true });
        return;
      }
      if (user?.role === 'student') {
        navigate('/student/portal');
      } else if (user?.role === 'parent') {
        navigate('/parent/portal');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      if (!err.response) {
        setError('Unable to reach the server. Please make sure the backend is running and try again.');
      } else {
        const validationError = err.response.data?.errors?.[0];
        setError(
          validationError
            ? `${validationError.field}: ${validationError.message}`
            : err.response.data?.message || 'Invalid email or password'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm p-4">
              <div className="text-center mb-4">
                <img src="/DTS%20logo.png" alt="Logo" width="64" height="64" className="mb-2 rounded" />
                <h5 className="fw-bold">Admin Login</h5>
                <p className="text-muted small mb-0">Daaru Tayseer Dashboard</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small">{error}</div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Email</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      setValueAs: (value) => String(value || '').trim().toLowerCase(),
                    })}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="admin@example.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: 'Password is required' })}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 rounded-pill"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

