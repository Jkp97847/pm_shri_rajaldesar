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
      {/* 1. Top Govt / PM SHRI Indian Tricolor Ribbon */}
      <div className="h-2 w-full tiranga-bar shadow-sm"></div>

      {/* 2. Top Info Header (Ashoka Chakra Navy Blue) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-blue-950 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-orange-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>भारत सरकार की महत्वाकांक्षी पीएम श्री (PM SHRI) योजना से चयनित</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300">UDISE: <strong className="text-white font-mono bg-blue-900/60 px-1.5 py-0.5 rounded">{settings.udise_code || "08040700105"}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a href={`tel:${settings.contact_phone}`} className="hover:text-orange-400 flex items-center gap-1 transition">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{settings.contact_phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a href={`mailto:${settings.contact_email}`} className="hover:text-orange-400 flex items-center gap-1 transition">
              <Mail className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">{settings.contact_email}</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link 
              to="/admin" 
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-3 py-0.5 rounded flex items-center gap-1 text-xs font-bold transition shadow-sm border border-orange-400/50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main School Brand Banner (Tiranga Wash: Kesariya to Shwet to India Green) */}
      <div className="bg-gradient-to-r from-orange-50/70 via-white to-emerald-50/70 py-3.5 px-4 sm:px-8 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-5">
            {/* National & PM SHRI Emblem Logos with Tricolor Rim */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 bg-gradient-to-b from-orange-500 via-white to-emerald-600 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-1 border border-blue-900 shadow-inner">
                  <span className="text-[10px] sm:text-[11px] font-black text-orange-600 tracking-tighter uppercase leading-none">PM SHRI</span>
                  <span className="text-[9px] sm:text-[10px] font-black text-blue-950 tracking-wider">SCHOOL</span>
                  <span className="text-[7px] text-emerald-700 font-black">RAJASTHAN</span>
                </div>
              </div>
            </div>

            {/* School Name */}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full mb-1 shadow-sm">
                <span>🇮🇳</span>
                <span>पीएम श्री विद्यालय (PM SHRI SCHOOL)</span>
              </div>
              <h1 className="text-base sm:text-xl md:text-2xl font-black text-blue-950 tracking-tight leading-tight">
                {settings.school_name_hi || "पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय"}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {settings.school_name || "PM SHRI UNION CLUB GOVT GIRLS SR. SEC. SCHOOL, RAJALDESAR (CHURU)"}
              </p>
              <p className="text-[11px] text-emerald-800 font-extrabold italic flex items-center gap-1 mt-0.5">
                <span className="text-orange-600">॥</span>
                <span>सा विद्या या विमुक्तये</span>
                <span className="text-emerald-700">॥</span>
                <span className="font-semibold text-slate-600">(ज्ञान वही जो मुक्ति दिलाए)</span>
              </p>
            </div>
          </div>

          {/* Right badge (RBSE & Location with Tiranga styling) */}
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="bg-gradient-to-r from-blue-950 to-blue-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm border border-orange-400/30 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>माध्यमिक शिक्षा बोर्ड राजस्थान (RBSE)</span>
            </span>
            <span className="text-xs text-slate-600 mt-1.5 flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              राजलदेसर (चूरू), पिन - {settings.pin_code || "331801"}
            </span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-orange-50 focus:outline-none border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-orange-600" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3.5. Live Breaking News Ticker (Right above Navigation Tabs) */}
      <NoticeTicker />

      {/* 4. Desktop Navigation Bar (Chakra Blue with Saffron active highlights) */}
      <nav className="hidden lg:block bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white shadow-lg">
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
                      ? 'border-orange-400 text-orange-400 bg-white/10' 
                      : 'border-transparent text-slate-100 hover:text-orange-300 hover:bg-blue-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-orange-400' : 'text-blue-300'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/result"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md transition flex items-center gap-1.5 border border-orange-300/30"
          >
            <Award className="w-4 h-4 text-white" />
            <span>परीक्षा परिणाम</span>
          </Link>
        </div>
        {/* Subtle Tricolor baseline beneath navbar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>
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
