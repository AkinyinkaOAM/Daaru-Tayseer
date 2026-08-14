import { FaQuran, FaLanguage, FaGlobe, FaCalculator, FaFlask, FaHistory } from 'react-icons/fa';

const SUBJECTS = [
  { icon: <FaQuran size={24} />, title: 'Qur\'anic Studies', desc: 'Tajweed, Tafsir, and memorisation.' },
  { icon: <FaLanguage size={24} />, title: 'Arabic Language', desc: 'Grammar, literature, composition, and conversation.' },
  { icon: <FaGlobe size={24} />, title: 'Islamic Studies', desc: 'Fiqh, Hadith, Tawheed, and Seerah.' },
  { icon: <FaHistory size={24} />, title: 'Islamic History', desc: 'Study of Islamic civilisation and heritage.' },
  { icon: <FaCalculator size={24} />, title: 'Mathematics', desc: 'Core arithmetic, algebra, and geometry.' },
  { icon: <FaFlask size={24} />, title: 'Sciences', desc: 'Basic and integrated science studies.' },
];

const LEVELS = [
  { title: 'Primary Section', desc: 'Foundation years focusing on Arabic literacy, basic Islamic knowledge, and general education.' },
  { title: 'Secondary Section', desc: 'Advanced curriculum combining Nigerian standard subjects with in-depth Islamic and Arabic studies.' },
  { title: 'Hifdh Programme', desc: 'Specialised Qur\'anic memorisation track for students dedicated to becoming Huffadh.' },
];

export default function Programme() {
  return (
    <>
      {/* Header */}
      <section className="bg-success text-white py-5">
        <div className="container text-center">
          <h1 className="fw-bold">Academic Programme</h1>
          <p className="fs-5 mt-2 opacity-90">
            A balanced curriculum rooted in Islamic values and academic excellence
          </p>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Subjects Offered</h2>
          <div className="row g-4">
            {SUBJECTS.map((s, i) => (
              <div className="col-md-4 col-sm-6" key={i}>
                <div className="card border-0 shadow-sm h-100 p-3">
                  <div className="d-flex align-items-start gap-3">
                    <div className="text-success flex-shrink-0 mt-1">{s.icon}</div>
                    <div>
                      <h6 className="fw-bold mb-1">{s.title}</h6>
                      <p className="text-muted small mb-0">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Class Levels</h2>
          <div className="row g-4">
            {LEVELS.map((l, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-success border-2 h-100 p-4 text-center">
                  <h5 className="fw-bold text-success">{l.title}</h5>
                  <p className="text-muted small mb-0">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-4 text-center text-muted">
        <div className="container">
          <p className="small mb-0">
            Assessment is based on continuous assessment (tests & assignments) and
            end-of-term examinations. Promotion is determined by cumulative performance.
          </p>
        </div>
      </section>
    </>
  );
}

