import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export default function Footer() {
  const { settings } = useSchool();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-6 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About School */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow">
              PM SHRI
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">
                {settings.school_name_hi ? settings.school_name_hi.split(' ')[0] + ' ' + (settings.school_name_hi.split(' ')[1] || '') : 'पीएम श्री यूनियन क्लब'}
              </h3>
              <p className="text-xs text-amber-400 font-semibold">{settings.school_name_hi || "राजकीय बालिका उच्च माध्यमिक विद्यालय"}</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            {settings.school_address || "राजलदेसर (चूरू)"} स्थित यह प्रतिष्ठित राजकीय बालिका विद्यालय बालिकाओं के सर्वांगीण विकास, उत्कृष्ट शिक्षण, आधुनिक डिजिटल शिक्षा और खेलकूद के लिए समर्पित है।
          </p>
          <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>"बेटी बचाओ, बेटी पढ़ाओ, देश आगे बढ़ाओ"</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 pb-1 border-b border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-amber-400"></span>
            महत्वपूर्ण लिंक्स (Quick Links)
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-amber-400 transition flex items-center gap-1">› मुख्य पृष्ठ (Home)</Link></li>
            <li><Link to="/teachers" className="hover:text-amber-400 transition flex items-center gap-1">› हमारे शिक्षक (Faculty)</Link></li>
            <li><Link to="/result" className="hover:text-amber-400 transition flex items-center gap-1">› परीक्षा परिणाम (Board Results)</Link></li>
            <li><Link to="/classes" className="hover:text-amber-400 transition flex items-center gap-1">› कक्षाएं एवं संकाय (Classes & Streams)</Link></li>
            <li><Link to="/library" className="hover:text-amber-400 transition flex items-center gap-1">› पुस्तकालय एवं ई-वाचनालय (Library)</Link></li>
            <li><Link to="/game" className="hover:text-amber-400 transition flex items-center gap-1">› खेलकूद एवं व्यायाम (Game & Sports)</Link></li>
            <li><Link to="/computer-lab" className="hover:text-amber-400 transition flex items-center gap-1">› आईसीटी व कंप्यूटर लैब (ICT Lab)</Link></li>
            <li><Link to="/gallery" className="hover:text-amber-400 transition flex items-center gap-1">› फोटो गैलरी (School Gallery)</Link></li>
          </ul>
        </div>

        {/* Col 3: Govt Portals & PM SHRI */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 pb-1 border-b border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-green-500"></span>
            सरकारी पोर्टल (Govt Portals)
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <a href="https://pmshrischools.education.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                <span>पीएम श्री पोर्टल (PM SHRI)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://rajshaladarpan.nic.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                <span>शाला दर्पण (Shala Darpan Rajasthan)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://rajeduboard.rajasthan.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                <span>माध्यमिक शिक्षा बोर्ड (RBSE Ajmer)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://education.rajasthan.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center justify-between">
                <span>शिक्षा विभाग राजस्थान सरकार</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
          </ul>

          <div className="mt-5 p-3 rounded bg-slate-900 border border-slate-800">
            <p className="text-xs font-semibold text-amber-300">UDISE CODE</p>
            <p className="text-sm font-bold text-white tracking-widest">{settings.udise_code || "08040700105"}</p>
          </div>
        </div>

        {/* Col 4: Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm mb-4 pb-1 border-b border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-sky-400"></span>
            संपर्क सूत्र (Contact Us)
          </h4>
          <div className="flex items-start gap-2.5 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{settings.school_address || "पीएम श्री यूनियन क्लब रा.बा.उ.मा.वि., राजलदेसर, जिला - चूरू (राजस्थान)"} {settings.pin_code && `पिन - ${settings.pin_code}`}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{settings.contact_phone} {settings.contact_phone_alt && `/ ${settings.contact_phone_alt}`}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{settings.contact_email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{settings.school_timing || "सोमवार से शनिवार: प्रातः 07:30 से अपराह्न 01:30"}</span>
          </div>

          <div className="pt-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-slate-900 border border-slate-800 hover:border-amber-500/50 px-3 py-1.5 rounded transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>विद्यालय प्रशासक लॉग-इन (Admin Login)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर (चूरू). सर्वाधिकार सुरक्षित।</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Girl Child Education Excellence
        </p>
      </div>
    </footer>
  );
}
