import React, { useState } from 'react';
import { 
  BookOpen, ExternalLink, Sparkles, BookMarked, Quote, 
  GraduationCap, Globe, Library as LibIcon, CheckCircle2, ZoomIn, X 
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Link } from 'react-router-dom';

export default function Library() {
  const { settings } = useSchool();
  const [photoModal, setPhotoModal] = useState(null);

  const libraryPhoto = settings?.library_photo || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80";
  const librarianPhoto = settings?.librarian_photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80";
  const librarianName = settings?.librarian_name || "श्रीमती विमला शर्मा";
  const librarianMessage = settings?.librarian_message || "पुस्तकालय ज्ञान और विद्या का जीवंत स्रोत है। अध्ययन और स्वाध्याय की आदत छात्राओं के दृष्टिकोण को व्यापक बनाकर उन्हें जीवन के प्रत्येक क्षेत्र में आत्मनिर्भर और सफल बनाती है। हमारे विद्यालय का समृद्ध वाचनालय एवं डिजिटल लाइब्रेरी सभी बालिकाओं के सर्वांगीण विकास हेतु सदैव तत्पर है।";
  const totalBooks = settings?.library_total_books || "5,420+ पुस्तकें";

  // Verified Direct Digital Library Portals for Students & Teachers
  const digitalLibraries = [
    {
      name: "नेशनल डिजिटल लाइब्रेरी ऑफ इंडिया (NDLI)",
      tag: "भारत सरकार — MHRD / IIT खड़गपुर",
      desc: "लाखों संदर्भ पुस्तकें, शोध पत्र, पाठ्यसामग्री एवं प्रतियोगी परीक्षा संदर्भ निःशुल्क उपलब्ध।",
      url: "https://ndl.iitkgp.ac.in/",
      color: "from-blue-900 to-indigo-950",
      badge: "National Portal"
    },
    {
      name: "दीक्षा (DIKSHA - One Nation, One Platform)",
      tag: "शिक्षा मंत्रालय, भारत सरकार",
      desc: "कक्षा 1 से 12 तक के इंटरएक्टिव डिजिटल पाठ, QR कोड पाठ्यपुस्तकें एवं वीडियो लेसन्स।",
      url: "https://diksha.gov.in/",
      color: "from-orange-600 to-amber-700",
      badge: "DIKSHA"
    },
    {
      name: "ई-पाठशाला (e-Pathshala - NCERT)",
      tag: "NCERT नई दिल्ली",
      desc: "सभी कक्षाओं की अधिकृत NCERT ई-बुक्स, ऑडियो एवं वीडियो संसाधन सभी भाषाओं में।",
      url: "https://epathshala.nic.in/",
      color: "from-emerald-700 to-teal-900",
      badge: "NCERT"
    },
    {
      name: "राजस्थान शाला दर्पण ई-पुस्तकालय (e-Library)",
      tag: "स्कूल शिक्षा विभाग, राजस्थान सरकार",
      desc: "राजस्थान के राजकीय विद्यालयों के विद्यार्थियों व शिक्षकों हेतु विशेष डिजिटल पाठ्यसामग्री।",
      url: "https://rajshaladarpan.nic.in/",
      color: "from-cyan-800 to-blue-950",
      badge: "Shala Darpan"
    },
    {
      name: "NCERT ऑनलाइन पाठ्यपुस्तक पोर्टल",
      tag: "NCERT Textbook PDF Free Access",
      desc: "कक्षा 1 से 12वीं तक सभी विषयों की नवीनतम संशोधित पाठ्यपुस्तकों की अधिकृत PDF प्रतियां।",
      url: "https://ncert.nic.in/textbook.php",
      color: "from-slate-800 to-slate-950",
      badge: "e-Books"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ज्ञान का भंडार (School Library & Reading Hall)</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            समृद्ध पुस्तकालय एवं डिजिटल ई-वाचनालय
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            पीएम श्री विद्यालय राजलदेसर में सुसज्जित शांत अध्ययन कक्ष, विशाल पुस्तक संग्रह एवं डिजिटल संसाधनों के माध्यम से छात्राओं में स्वाध्याय की प्रेरणा जागृत की जाती है।
          </p>
        </div>

        <Link
          to="/admin"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 shadow-md"
        >
          <BookMarked className="w-4 h-4" />
          <span>लाइब्रेरी विवरण संपादित करें (Admin)</span>
        </Link>
      </div>

      {/* 2. Total Books Stat Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen className="w-9 h-9" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-200 font-bold">पुस्तकालय में कुल उपलब्ध पुस्तकें (Total Books)</p>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight mt-1">{totalBooks}</h3>
            <p className="text-xs text-emerald-100 mt-1">NCERT पाठ्यपुस्तकें, संदर्भ ग्रंथ, साहित्य, जीवनियां एवं प्रतियोगी परीक्षा पुस्तकें</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-xs space-y-1.5 shrink-0 text-center sm:text-right">
          <div className="font-bold flex items-center justify-center sm:justify-end gap-1 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>दैनिक समाचार पत्र व पत्रिकाएं</span>
          </div>
          <p className="text-white/80">शांत वाचनालय • डिजिटल ई-संसाधन कॉर्नर</p>
        </div>
      </div>

      {/* 3. Main Photos Section: Library Photo & Librarian Photo with Message */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Library Photo Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LibIcon className="w-5 h-5 text-emerald-700" />
              <h3 className="font-black text-blue-950 text-base">पुस्तकालय एवं वाचनालय कक्ष (School Library)</h3>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              सुसज्जित हॉल
            </span>
          </div>

          <div 
            className="relative h-80 sm:h-96 bg-slate-900 overflow-hidden group cursor-pointer"
            onClick={() => setPhotoModal({ url: libraryPhoto, title: "विद्यालय पुस्तकालय एवं वाचनालय कक्ष" })}
          >
            {/* Ambient blurred backdrop so photo is 100% visible uncropped */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 scale-105"
              style={{ backgroundImage: `url(${libraryPhoto})` }}
            ></div>
            <img
              src={libraryPhoto}
              alt="School Library"
              className="relative w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
              <div className="text-white">
                <p className="text-xs font-bold text-amber-400">पीएम श्री यूनियन क्लब रा.बा.उ.मा.वि. राजलदेसर</p>
                <p className="text-sm font-black">आधुनिक पुस्तकालय, संदर्भ कक्ष एवं शांत अध्ययन स्थल</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>फोटो पर क्लिक करके बड़ा देखें (Click to Zoom)</span>
            <span className="font-semibold text-emerald-700">सुव्यवस्थित आलमारियां एवं अध्ययन टेबल</span>
          </div>
        </div>

        {/* Librarian Photo & Message Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100">
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">पुस्तकालयाध्यक्ष संदेश</span>
            <h3 className="font-black text-blue-950 text-base">पुस्तकालय प्रभारी (Librarian Desk)</h3>
          </div>

          <div className="p-6 space-y-5 flex-1 flex flex-col justify-center">
            
            {/* Librarian Profile with uncropped photo */}
            <div className="flex items-center gap-4">
              <div 
                className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-slate-100 border-2 border-emerald-600 overflow-hidden relative shrink-0 cursor-pointer shadow group"
                onClick={() => setPhotoModal({ url: librarianPhoto, title: librarianName })}
              >
                <img
                  src={librarianPhoto}
                  alt={librarianName}
                  className="w-full h-full object-contain bg-slate-800 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Librarian
                </span>
                <h4 className="text-base sm:text-lg font-black text-blue-950 leading-tight">
                  {librarianName}
                </h4>
                <p className="text-xs font-bold text-slate-600">
                  पुस्तकालयाध्यक्ष / पुस्तकालय प्रभारी
                </p>
                <p className="text-[11px] text-slate-500">
                  पीएम श्री विद्यालय राजलदेसर (चूरू)
                </p>
              </div>
            </div>

            {/* Librarian Inspirational Message */}
            <div className="bg-emerald-50/70 p-5 rounded-xl border-l-4 border-emerald-600 relative">
              <Quote className="w-6 h-6 text-emerald-300 absolute top-3 right-3" />
              <p className="text-xs text-slate-700 leading-relaxed italic relative z-10">
                "{librarianMessage}"
              </p>
            </div>

          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs font-bold text-blue-950">
            "किताबें हमारी सबसे सच्ची और निष्ठावान मित्र होती हैं"
          </div>
        </div>

      </div>

      {/* 4. Digital Library Quick Jump Links (Direct links for users) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-orange-600" />
              <span>राष्ट्रीय एवं राज्य स्तरीय डिजिटल वाचनालय (Digital Library Portals)</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950 mt-1">
              प्रमुख डिजिटल लाइब्रेरी सीधे लिंक (Direct Access)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              छात्राएं एवं शिक्षकगण नीचे दिए गए अधिकृत सरकारी पोर्टल्स से लाखों ई-पुस्तकों व शोध सामग्री तक तुरंत पहुंच सकते हैं।
            </p>
          </div>
          <span className="bg-blue-100 text-blue-950 text-xs font-black px-3 py-1 rounded-full w-fit">
            100% निःशुल्क ई-संसाधन
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {digitalLibraries.map((portal, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-xl transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-950 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {portal.badge}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-950 transition" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-blue-950 group-hover:text-orange-600 transition leading-snug">
                    {portal.name}
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    {portal.tag}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {portal.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-200">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>पोर्टल पर जाएं (Open Library)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Photo Zoom Modal */}
      {photoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          onClick={() => setPhotoModal(null)}
        >
          <div 
            className="bg-slate-900 text-white rounded-2xl overflow-hidden max-w-4xl w-full border border-slate-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200">{photoModal.title}</h3>
              <button
                onClick={() => setPhotoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh] bg-black">
              <img
                src={photoModal.url}
                alt={photoModal.title}
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
