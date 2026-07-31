import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import TopBar from './components/TopBar/TopBar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Sectors from './pages/Sectors/Sectors';
import Subsidiaries from './pages/Subsidiaries/Subsidiaries';
import Offices from './pages/Offices/Offices';
import News from './pages/News/News';
import Contact from './pages/Contact/Contact';
import Careers from './pages/Careers/Careers';
import JobDetails from './pages/JobDetails/JobDetails';
import SectorDetail from './pages/SectorDetail/SectorDetail';
import Admin from './pages/Admin/Admin';

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/* Layout wrapper — TopBar + Navbar + content + Footer */
function SiteLayout({ children }) {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin has its own full-screen layout */}
          <Route path="/admin" element={<Admin />} />

          {/* All public pages share the site layout */}
          <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
          <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
          <Route path="/sectors" element={<SiteLayout><Sectors /></SiteLayout>} />
          <Route path="/sectors/:sectorSlug" element={<SiteLayout><SectorDetail /></SiteLayout>} />
          <Route path="/subsidiaries" element={<SiteLayout><Subsidiaries /></SiteLayout>} />
          <Route path="/offices" element={<SiteLayout><Offices /></SiteLayout>} />
          <Route path="/news" element={<SiteLayout><News /></SiteLayout>} />
          <Route path="/careers" element={<SiteLayout><Careers /></SiteLayout>} />
          <Route path="/careers/:jobId" element={<SiteLayout><JobDetails /></SiteLayout>} />
          <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
