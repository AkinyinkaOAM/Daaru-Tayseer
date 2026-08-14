import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* School Info */}
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">
              <span className="arabic-text">دار تيسير</span> Daaru Tayseer
            </h5>
            <p className="text-white-50 small">
              Arabic School of Easy Learning and Islamic Civilization — committed
              to nurturing academic excellence and Islamic character.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/programme" className="text-white-50 text-decoration-none">Programme</Link></li>
              <li className="mb-2"><Link to="/gallery" className="text-white-50 text-decoration-none">Gallery</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-white-50 text-decoration-none">Contact</Link></li>
              <li><Link to="/login" className="text-white-50 text-decoration-none">Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Contact</h6>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-2 d-flex align-items-start gap-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>Boluwaji, Ibadan, Oyo State, Nigeria</span>
              </li>
              <li className="mb-2 d-flex align-items-center gap-2">
                <FaPhone className="flex-shrink-0" />
                <span>08073315870 | 08060130110</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="flex-shrink-0" />
                <a href="mailto:daaruttayseercivilization20@gmail.com" className="text-white-50 text-decoration-none">
                  daaruttayseercivilization20@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Arabic Tagline */}
          <div className="col-md-2 d-flex align-items-end justify-content-md-end">
            <p className="arabic-text fs-5 mb-0 opacity-75" style={{ direction: 'rtl' }}>
              دار تيسير الدراسات العربية والثقافة الإسلامية
            </p>
          </div>

          <div className="col-12">
            <h6 className="fw-bold mb-2">Social Media</h6>
            <div className="d-flex flex-wrap gap-3">
              <a href="#" className="text-white-50 text-decoration-none d-inline-flex align-items-center gap-1" aria-label="Facebook">
                <FaFacebook /> Facebook
              </a>
              <a href="#" className="text-white-50 text-decoration-none d-inline-flex align-items-center gap-1" aria-label="Instagram">
                <FaInstagram /> Instagram
              </a>
              <a href="#" className="text-white-50 text-decoration-none d-inline-flex align-items-center gap-1" aria-label="X">
                <FaXTwitter /> X
              </a>
              <a href="#" className="text-white-50 text-decoration-none d-inline-flex align-items-center gap-1" aria-label="YouTube">
                <FaYoutube /> YouTube
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-3" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="text-white-50 small mb-0">
            &copy; {new Date().getFullYear()} Daaru Tayseer. All rights reserved.
          </p>
          <p className="text-white-50 small mb-0">Powered by: Dev-OAMs</p>
        </div>
      </div>
    </footer>
  );
}

