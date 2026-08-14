import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const INDEX = [
  { title: 'Homepage', path: '/' },
  { title: 'About Us', path: '/about' },
  { title: 'Academics', path: '/academics' },
  { title: 'Admissions', path: '/admissions' },
  { title: 'Staff', path: '/staff' },
  { title: 'Student Life', path: '/student-life' },
  { title: 'Gallery', path: '/gallery' },
  { title: 'News and Events', path: '/news-events' },
  { title: "Parents' Corner", path: '/parents-corner' },
  { title: 'Downloads', path: '/downloads' },
  { title: 'FAQ', path: '/faq' },
  { title: 'Contact Us', path: '/contact' },
];

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    return INDEX.filter((item) => item.title.toLowerCase().includes(q));
  }, [q]);

  return (
    <section className="py-5">
      <div className="container">
        <h1 className="fw-bold mb-3">Search</h1>
        {!q ? (
          <p className="text-muted mb-0">Use the search bar in the navigation to find pages.</p>
        ) : results.length === 0 ? (
          <p className="text-muted mb-0">No page matched "{q}".</p>
        ) : (
          <ul className="list-group">
            {results.map((item) => (
              <li key={item.path} className="list-group-item">
                <Link to={item.path} className="text-decoration-none">{item.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
