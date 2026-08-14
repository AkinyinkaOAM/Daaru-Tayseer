const faqs = [
  {
    q: 'How do I apply for admission?',
    a: 'Complete the admission form and submit required documents to the school office.',
  },
  {
    q: 'How can parents track student progress?',
    a: 'Parents can use the portal to view courses, scores, classwork, assignments, and announcements.',
  },
  {
    q: 'Do you provide Islamic and conventional subjects?',
    a: 'Yes. We offer a blended curriculum in Arabic, Islamic studies, and core general subjects.',
  },
];

export default function FAQ() {
  return (
    <>
      <section className="hero-surface text-white py-5">
        <div className="container">
          <h1 className="fw-bold mb-2">Frequently Asked Questions</h1>
          <p className="mb-0">Quick answers for parents, students, and prospective families.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="accordion" id="faq-accordion">
            {faqs.map((item, index) => {
              const collapseId = `faq-collapse-${index}`;
              const headingId = `faq-heading-${index}`;
              return (
                <div className="accordion-item" key={item.q}>
                  <h2 className="accordion-header" id={headingId}>
                    <button
                      className={`accordion-button ${index > 0 ? 'collapsed' : ''}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${collapseId}`}
                      aria-expanded={index === 0 ? 'true' : 'false'}
                      aria-controls={collapseId}
                    >
                      {item.q}
                    </button>
                  </h2>
                  <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    aria-labelledby={headingId}
                    data-bs-parent="#faq-accordion"
                  >
                    <div className="accordion-body text-muted">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
