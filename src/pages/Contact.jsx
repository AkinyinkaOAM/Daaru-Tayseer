import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactAPI } from '../services/api';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setSending(true);
    try {
      await contactAPI.send(formData);
      setSent(true);
      reset();
    } catch {
      alert('Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="bg-success text-white py-5">
        <div className="container text-center">
          <h1 className="fw-bold">Contact Us</h1>
          <p className="fs-5 mt-2 opacity-90">
            We'd love to hear from you
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-5 justify-content-center">
            {/* Contact Info */}
            <div className="col-lg-4">
              <h5 className="fw-bold mb-3">Get In Touch</h5>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex align-items-start gap-3">
                  <FaMapMarkerAlt className="text-success mt-1 flex-shrink-0" size={18} />
                  <div>
                    <strong>Address</strong>
                    <p className="text-muted small mb-0">Boluwaji, Ibadan, Oyo State, Nigeria</p>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start gap-3">
                  <FaPhone className="text-success mt-1 flex-shrink-0" size={18} />
                  <div>
                    <strong>Phone</strong>
                    <p className="text-muted small mb-0">08073315870 | 08060130110</p>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <FaEnvelope className="text-success mt-1 flex-shrink-0" size={18} />
                  <div>
                    <strong>Email</strong>
                    <p className="text-muted small mb-0">
                      <a href="mailto:daaruttayseercivilization20@gmail.com" className="text-decoration-none">
                        daaruttayseercivilization20@gmail.com
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Form */}
            <div className="col-lg-6">
              {sent ? (
                <div className="text-center py-5">
                  <FaCheckCircle size={48} className="text-success mb-3" />
                  <h5>Message Sent!</h5>
                  <p className="text-muted">We will get back to you shortly.</p>
                  <button
                    className="btn btn-outline-success btn-sm rounded-pill"
                    onClick={() => setSent(false)}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Your Name</label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter your name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Email</label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Subject</label>
                      <input
                        {...register('subject', { required: 'Subject is required' })}
                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                        placeholder="Subject"
                      />
                      {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Message</label>
                      <textarea
                        rows="5"
                        {...register('message', { required: 'Message is required' })}
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                        placeholder="Write your message..."
                      />
                      {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-success rounded-pill px-4"
                        disabled={sending}
                      >
                        {sending ? (
                          <>Sending...</>
                        ) : (
                          <><FaPaperPlane className="me-1" /> Send Message</>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

