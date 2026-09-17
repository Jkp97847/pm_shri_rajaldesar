import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DailyNoticeModal from './components/DailyNoticeModal';
import Footer from './components/Footer';
import { SchoolProvider } from './context/SchoolContext';

// Pages
import Home from './pages/Home';
import Teachers from './pages/Teachers';
import Result from './pages/Result';
import Classes from './pages/Classes';
import Library from './pages/Library';
import Game from './pages/Game';
import ComputerLab from './pages/ComputerLab';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Admin from './pages/Admin';

// Helper to scroll to top on page change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <SchoolProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-slate-950">
        <ScrollToTop />
        
        {/* Daily Announcement Modal (Pops up on first visit of the day or upon new notices) */}
        <DailyNoticeModal />

        {/* Main Navbar with PM SHRI Brand */}
        <Navbar />

        {/* Page Routing */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/result" element={<Result />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/library" element={<Library />} />
            <Route path="/game" element={<Game />} />
            <Route path="/computer-lab" element={<ComputerLab />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SchoolProvider>
  );
}
