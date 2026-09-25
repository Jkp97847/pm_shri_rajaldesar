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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-black">
              ★
            </div>
            <h2 className="text-xl font-black text-blue-950">पीएम श्री विद्यालय राजलदेसर</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              पेज लोड करने में कोई तकनीकी समस्या आई है। कृपया मुख्य पृष्ठ पर जाएं।
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md"
            >
              ← मुख्य पृष्ठ पर जाएं (Go to Home Page)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
