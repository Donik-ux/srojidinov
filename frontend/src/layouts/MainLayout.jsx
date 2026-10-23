import { Outlet } from 'react-router-dom';
import Navbar from './LyceumNavbar';
import Footer from './LyceumFooter';
import ScrollToTop from '../components/ScrollToTop';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
