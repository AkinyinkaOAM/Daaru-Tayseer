export default function ParentsCorner() {
  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Parents' Corner</h1>
          <p className="mb-0">Circulars, school policies, PTA information, and announcements.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <ul className="text-muted mb-0">
                <li>Official circulars and notices</li>
                <li>School policy updates</li>
                <li>PTA updates and meeting schedule</li>
                <li>Assignment and class activity updates for wards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
