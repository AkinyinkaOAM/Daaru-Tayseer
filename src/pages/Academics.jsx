const classes = ['Nursery', 'Primary', 'Junior Secondary', 'Senior Secondary', 'Hifdh'];
const subjects = ['Qur\'anic Studies', 'Arabic Language', 'Islamic Studies', 'English', 'Mathematics', 'Sciences'];

export default function Academics() {
  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Academics</h1>
          <p className="mb-0">Classes, curriculum, subjects, and examination information.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <h4 className="fw-bold">Classes and Departments</h4>
              <ul className="text-muted">
                {classes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="col-lg-6">
              <h4 className="fw-bold">Subjects Offered</h4>
              <ul className="text-muted">
                {subjects.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h4 className="fw-bold">Academic Calendar and Examinations</h4>
          <p className="text-muted mb-2">The school runs First, Second, and Third Term sessions each academic year.</p>
          <p className="text-muted mb-0">
            Continuous assessment, assignments, classwork, and end-of-term examinations are used for student evaluation.
          </p>
        </div>
      </section>
    </>
  );
}
