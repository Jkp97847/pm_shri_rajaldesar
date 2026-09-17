import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Award, BookOpen, Library, Trophy, Monitor, GraduationCap, 
  Image, Info, ShieldCheck, Menu, X, Phone, Mail, MapPin, Sparkles
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import NoticeTicker from './NoticeTicker';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSchool();

  const navLinks = [
    { name: "मुख्य पृष्ठ (Home)", path: "/", icon: Home },
    { name: "शिक्षक (Teachers)", path: "/teachers", icon: Users },
    { name: "परिणाम (Result)", path: "/result", icon: Award },
    { name: "कक्षाएं (Classes)", path: "/classes", icon: BookOpen },
    { name: "पुस्तकालय (Library)", path: "/library", icon: Library },
    { name: "खेलकूद (Game)", path: "/game", icon: Trophy },
    { name: "कंप्यूटर लैब (Lab)", path: "/computer-lab", icon: Monitor },
    { name: "पाठ्यक्रम (Courses)", path: "/courses", icon: GraduationCap },
    { name: "गैलरी (Gallery)", path: "/gallery", icon: Image },
    { name: "परिचय (About)", path: "/about", icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* 1. Top Govt / PM SHRI Tricolor Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

      {/* 2. Top Info Header */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>भारत सरकार की महत्वाकांक्षी पीएम श्री (PM SHRI) योजना से चयनित</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">UDISE: <strong>{settings.udise_code || "08040700105"}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a href={`tel:${settings.contact_phone}`} className="hover:text-amber-400 flex items-center gap-1 transition">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{settings.contact_phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a href={`mailto:${settings.contact_email}`} className="hover:text-amber-400 flex items-center gap-1 transition">
              <Mail className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">{settings.contact_email}</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link 
              to="/admin" 
              className="bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white px-2.5 py-0.5 rounded flex items-center gap-1 text-xs font-semibold transition border border-amber-500/40"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main School Brand Banner */}
      <div className="bg-gradient-to-b from-amber-50/50 to-white py-3 px-4 sm:px-8 border-b border-amber-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-5">
            {/* National & PM SHRI Emblem Logos */}
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 p-1 shadow-md flex items-center justify-center text-white shrink-0">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-1 border-2 border-amber-500">
                  <span className="text-[10px] sm:text-[11px] font-black text-orange-600 tracking-tighter uppercase leading-none">PM SHRI</span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-blue-900 tracking-wider">SCHOOL</span>
                  <span className="text-[7px] text-green-700 font-bold">RAJASTHAN</span>
                </div>
              </div>
            </div>

            {/* School Name */}
            <div>
              <div className="inline-block bg-orange-100 text-orange-800 text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5 border border-orange-200">
                ★ पीएम श्री विद्यालय ★
              </div>
              <h1 className="text-base sm:text-xl md:text-2xl font-black text-blue-950 tracking-tight leading-tight">
                {settings.school_name_hi || "पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय"}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {settings.school_name || "PM SHRI UNION CLUB GOVT GIRLS SR. SEC. SCHOOL, RAJALDESAR (CHURU)"}
              </p>
              <p className="text-[11px] text-emerald-800 font-bold italic">
                ॥ सा विद्या या विमुक्तये ॥ (ज्ञान वही जो मुक्ति दिलाए)
              </p>
            </div>
          </div>

          {/* Right badge */}
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              माध्यमिक शिक्षा बोर्ड राजस्थान (RBSE)
            </span>
            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-red-500" />
              राजलदेसर (चूरू), पिन - {settings.pin_code || "331801"}
            </span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3.5. Live Breaking News Ticker (Right above Navigation Tabs) */}
      <NoticeTicker />

      {/* 4. Desktop Navigation Bar */}
      <nav className="hidden lg:block bg-blue-950 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-3 text-sm font-semibold transition border-b-2 ${
                    active 
                      ? 'border-amber-400 text-amber-400 bg-blue-900/60' 
                      : 'border-transparent text-slate-100 hover:text-amber-300 hover:bg-blue-900/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-blue-300'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/result"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow transition flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>रिजल्ट चेक करें</span>
          </Link>
        </div>
      </nav>

      {/* 5. Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-blue-950 border-t border-blue-900 text-white px-4 py-3 space-y-1 shadow-2xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-semibold transition ${
                  active 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'text-slate-100 hover:bg-blue-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-blue-900">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2.5 rounded-md text-sm font-bold text-center justify-center"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
