import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1" style={{ paddingTop: '72px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

