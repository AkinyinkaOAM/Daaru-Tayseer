const achievements = [
  'Best Arabic Curriculum Integration Award (Ibadan Schools Forum)',
  'Inter-School Qur\'an Memorisation Competition Finalists',
  'Consistent improvement in WAEC/NECO pass rates',
];

export default function About() {
  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">About Us</h1>
          <p className="mb-0">History, values, and the vision behind our learning culture.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <h3 className="fw-bold">Our History</h3>
              <p className="text-muted">
                ARABIC SCHOOL OF EASY LEARNING AND ISLAMIC CIVILIZATION was founded to provide
                excellent academics rooted in Islamic civilization, Arabic fluency, and strong character.
              </p>
              <h4 className="fw-bold mt-4">Vision</h4>
              <p className="text-muted">To raise knowledgeable, disciplined, and impactful learners.</p>
              <h4 className="fw-bold mt-4">Mission</h4>
              <p className="text-muted mb-0">
                To deliver balanced education through sound teaching, moral guidance, and community service.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold">Core Values</h5>
                  <ul className="text-muted mb-0">
                    <li>Faith and integrity</li>
                    <li>Academic excellence</li>
                    <li>Discipline and respect</li>
                    <li>Service and leadership</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="fw-bold mb-3">School Achievements</h3>
          <div className="row g-3">
            {achievements.map((item) => (
              <div className="col-md-4" key={item}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="mb-0 text-muted">{item}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
