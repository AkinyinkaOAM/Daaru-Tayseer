const staff = [
  { name: 'Ustadh AbdulMajeed Kareem', role: 'Principal / Head Teacher' },
  { name: 'Ustadhah Rahmah Azeez', role: 'Vice Principal (Academics)' },
  { name: 'Ustadh Ismail Tijani', role: 'Arabic Department Lead' },
  { name: 'Mrs. Hadiza Bello', role: 'Administrative Officer' },
];

export default function Staff() {
  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Staff</h1>
          <p className="mb-0">Principal profile and teaching/administrative team.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold">Principal's Profile</h4>
              <p className="text-muted mb-0">
                The Principal provides strategic leadership for quality learning, spiritual guidance,
                and continuous staff development.
              </p>
            </div>
          </div>

          <div className="row g-3">
            {staff.map((member) => (
              <div className="col-md-6" key={member.name}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-1">{member.name}</h6>
                    <p className="text-muted mb-0">{member.role}</p>
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
