import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { admissionsAPI } from '../services/api';

export default function Admissions() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (formData) => {
    await admissionsAPI.apply(formData);
    setSubmitted(true);
    reset();
  };

  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Admissions</h1>
          <p className="mb-0">Requirements, process, fees, and forms.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <h4 className="fw-bold">Admission Requirements</h4>
              <ul className="text-muted mb-0">
                <li>Completed admission form</li>
                <li>Birth certificate or age declaration</li>
                <li>Two recent passport photographs</li>
                <li>Previous school report (if transfer)</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <h4 className="fw-bold">Application Process</h4>
              <ol className="text-muted mb-0">
                <li>Collect or download form</li>
                <li>Submit completed form with required documents</li>
                <li>Entrance assessment/interview</li>
                <li>Admission decision and enrollment</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h5 className="fw-bold mb-1">School Fees and Forms</h5>
            <p className="text-muted mb-0">Detailed fee schedule is available from the school office and portal.</p>
          </div>
          <Link className="btn btn-success rounded-pill" to="/downloads">Open Downloads</Link>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Online Admission Portal</h4>
              {submitted && (
                <div className="alert alert-success py-2 small">
                  Application submitted successfully. Our admissions team will contact you.
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Student First Name</label>
                    <input className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} {...register('firstName', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Student Last Name</label>
                    <input className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} {...register('lastName', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Parent/Guardian Name</label>
                    <input className={`form-control ${errors.parentName ? 'is-invalid' : ''}`} {...register('parentName', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Class Applying For</label>
                    <input className={`form-control ${errors.gradeApplied ? 'is-invalid' : ''}`} {...register('gradeApplied', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Email</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email', { required: true })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Phone</label>
                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`} {...register('phone', { required: true })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Address</label>
                    <input className="form-control" {...register('address')} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Additional Note</label>
                    <textarea rows="4" className="form-control" {...register('note')} />
                  </div>
                </div>
                <button type="submit" className="btn btn-success rounded-pill px-4 mt-3" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
