import { Link } from 'react-router-dom';
import { FaBookOpen, FaImage, FaEnvelope } from 'react-icons/fa';

const FEATURES = [
  {
    icon: <FaBookOpen size={28} />,
    title: 'Academic Programmes',
    desc: 'Structured curriculum in Arabic language, Islamic jurisprudence, Qur\'anic studies, and general education.',
  },
  {
    icon: <FaImage size={28} />,
    title: 'School Gallery',
    desc: 'Browse photos of school events, classrooms, and student activities.',
  },
  {
    icon: <FaEnvelope size={28} />,
    title: 'Get In Touch',
    desc: 'Contact us for admissions, inquiries, or partnership opportunities.',
  },
];

export default function Home() {
  return (
    <>
      {/* ───── HERO ───── */}
      <section className="hero-surface text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-8 text-center text-lg-start">
              <h1 className="display-4 fw-bold arabic-text" style={{ direction: 'rtl' }}>
                دار تيسير الدراسات العربية والثقافة الإسلامية
              </h1>
              <p className="fs-5 mt-3 opacity-90">
                ARABIC SCHOOL OF EASY LEARNING AND ISLAMIC CIVILIZATION
              </p>
              <p className="lead mt-2 text-white-75">
                Boluwaji, Ibadan, Oyo State, Nigeria
              </p>
              <div className="mt-4 d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
                <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-4">
                  Contact Us
                </Link>
                <Link to="/programme" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  Our Programmes
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center">
              <img
                src="/DTS%20logo.png"
                alt="Daaru Tayseer school logo"
                className="hero-logo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── WELCOME MESSAGE ───── */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Welcome Message from the Principal</h2>
              <p className="text-muted fs-5 mb-0">
                We are delighted to welcome you to ARABIC SCHOOL OF EASY LEARNING AND ISLAMIC CIVILIZATION.
                Our school remains committed to nurturing learners who are grounded in knowledge, discipline,
                and excellent character.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Motto, Vision, Mission</h5>
                  <p className="small text-muted mb-2"><strong>Motto:</strong> Easy Learning, Sound Character.</p>
                  <p className="small text-muted mb-2"><strong>Vision:</strong> Raising impactful learners through balanced education.</p>
                  <p className="small text-muted mb-0"><strong>Mission:</strong> Deliver quality academics rooted in Islamic civilization.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-0 shadow-sm h-100 text-center p-4">
                  <div className="text-success mb-3">{f.icon}</div>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="fw-bold mb-3">Latest News and Announcements</h3>
          <div className="row g-3">
            <div className="col-md-4"><div className="card border-0 shadow-sm"><div className="card-body small text-muted">Entrance screening schedule for new admissions is now available.</div></div></div>
            <div className="col-md-4"><div className="card border-0 shadow-sm"><div className="card-body small text-muted">Inter-house sports training starts this weekend.</div></div></div>
            <div className="col-md-4"><div className="card border-0 shadow-sm"><div className="card-body small text-muted">Parents and guardians meeting will hold on the final Friday of the month.</div></div></div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h3 className="fw-bold mb-3">School Highlights</h3>
          <div className="row g-3">
            {[1, 2, 3].map((item) => (
              <div className="col-md-4" key={item}>
                <img
                  src={`https://picsum.photos/seed/dts-${item}/800/550`}
                  alt="School activity"
                  className="img-fluid rounded-3 shadow-sm"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-5 hero-surface text-white text-center">
        <div className="container">
          <h3 className="fw-bold">Ready to learn with us?</h3>
          <p className="mb-4">Contact us today for admission inquiries.</p>
          <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}

