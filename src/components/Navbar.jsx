import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const NAV_ITEMS = [
  { type: 'link', label: 'Home', path: '/' },
  {
    type: 'dropdown',
    label: 'About',
    path: '/about',
    children: [
      { label: 'Staff', path: '/staff' },
      { label: 'Student Life', path: '/student-life' },
      { label: 'Parents', path: '/parents-corner' },
      { label: 'Downloads', path: '/downloads' },
      { label: 'FAQ', path: '/faq' },
    ],
  },
  {
    type: 'dropdown',
    label: 'Academics',
    path: '/academics',
    children: [{ label: 'Admissions', path: '/admissions' }],
  },
  { type: 'link', label: 'Gallery', path: '/gallery' },
  { type: 'link', label: 'News', path: '/news-events' },
  { type: 'link', label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [query, setQuery] = useState('');

  const onSearch = (event) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (label) => {
    setOpenDropdown((current) => (current === label ? null : label));
  };

  const closeMenus = () => {
    setOpen(false);
    setOpenDropdown(null);
  };

  const isDropdownActive = (item) => {
    if (location.pathname === item.path) return true;
    return item.children?.some((child) => location.pathname === child.path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src="/DTS%20logo.png"
            alt="Daaru Tayseer"
            width="36"
            height="36"
            className="rounded"
          />
          <span className="fw-bold fs-6">
            Daaru Tayseer <span className="arabic-text">دار تيسير</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          onClick={() => {
            setOpen(!open);
            if (open) setOpenDropdown(null);
          }}
          aria-label="Toggle navigation"
        >
          {open ? <FaTimes color="white" /> : <FaBars color="white" />}
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1 me-lg-3">
            {NAV_ITEMS.map((item) => (
              item.type === 'link' ? (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link px-3 ${isActive ? 'active' : ''}`
                    }
                    to={item.path}
                    onClick={closeMenus}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ) : (
                <li
                  className={`nav-item dropdown ${openDropdown === item.label ? 'show' : ''}`}
                  key={item.label}
                  onMouseEnter={() => !open && setOpenDropdown(item.label)}
                  onMouseLeave={() => !open && setOpenDropdown(null)}
                >
                  <div className="d-flex align-items-center">
                    <NavLink
                      className={`nav-link px-3 ${isDropdownActive(item) ? 'active' : ''}`}
                      to={item.path}
                      onClick={closeMenus}
                    >
                      {item.label}
                    </NavLink>
                    <button
                      className="btn btn-link nav-link px-2 text-white text-decoration-none"
                      type="button"
                      aria-expanded={openDropdown === item.label}
                      onClick={() => toggleDropdown(item.label)}
                    >
                      ▾
                    </button>
                  </div>
                  <ul className={`dropdown-menu dropdown-menu-dark ${openDropdown === item.label ? 'show' : ''}`}>
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <NavLink
                          className={({ isActive }) =>
                            `dropdown-item ${isActive ? 'active' : ''}`
                          }
                          to={child.path}
                          onClick={closeMenus}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            ))}
            <li className="nav-item">
              <form className="d-flex" role="search" onSubmit={onSearch}>
                <input
                  className="form-control form-control-sm me-2"
                  type="search"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search"
                />
              </form>
            </li>
            <li className="nav-item ms-lg-1">
              <Link
                className="btn btn-outline-light btn-sm rounded-pill px-3"
                to="/login"
                onClick={closeMenus}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

