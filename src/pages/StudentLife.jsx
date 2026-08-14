const items = [
  'Clubs and societies',
  'Sports and fitness activities',
  'School events and Islamic programs',
  'Excursions and inter-school competitions',
];

export default function StudentLife() {
  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Student Life</h1>
          <p className="mb-0">Beyond the classroom: growth, creativity, and teamwork.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-3">
            {items.map((item) => (
              <div className="col-md-6" key={item}>
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
