import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import { 
  Users, Award, BookOpen, Monitor, Library, Trophy, CheckCircle, 
  Calendar, ArrowRight, Sparkles, GraduationCap, Building, Shield, 
  Flame, FileText, ChevronRight, UserCheck
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export default function Home() {
  const { settings } = useSchool();
  const [notices, setNotices] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [activeNoticeTab, setActiveNoticeTab] = useState('all');

  useEffect(() => {
    // Fetch notices
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotices(data.notices);
      })
      .catch(err => console.error(err));

    // Fetch toppers
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        if (data.success) setToppers(data.results.slice(0, 4));
      })
      .catch(err => console.error(err));
  }, []);

  const filteredNotices = activeNoticeTab === 'all' 
    ? notices 
    : notices.filter(n => n.category === activeNoticeTab);

  return (
    <div className="space-y-12">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Key Highlights / Stats Bar (Indian Tricolor Colors: Saffron, White/Navy, India Green, Amber) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-5 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          
          {/* Stat 1: Saffron / Kesariya (नामांकित छात्राएं) */}
          <div className="space-y-1 p-3 rounded-xl border-t-4 border-orange-500 bg-gradient-to-b from-orange-50/80 via-white to-white shadow-sm hover:scale-102 transition">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-orange-600">1,150+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700">नामांकित छात्राएं (Girls Enrolled)</p>
          </div>

          {/* Stat 2: Shwet & Ashoka Chakra Blue (बोर्ड परिणाम) */}
          <div className="space-y-1 p-3 rounded-xl border-t-4 border-blue-900 bg-gradient-to-b from-blue-50/70 via-white to-white shadow-sm hover:scale-102 transition">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-950 flex items-center justify-center mb-2 shadow-inner">
              <Award className="w-6 h-6 text-blue-900" />
            </div>
            <p className="text-3xl font-black text-blue-950">100%</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700">बोर्ड परीक्षा परिणाम (Board Results)</p>
          </div>

          {/* Stat 3: India Green (अनुभवी शिक्षक) */}
          <div className="space-y-1 p-3 rounded-xl border-t-4 border-emerald-600 bg-gradient-to-b from-emerald-50/80 via-white to-white shadow-sm hover:scale-102 transition">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-emerald-700">35+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700">योग्य एवं अनुभवी शिक्षक (Faculty)</p>
          </div>

          {/* Stat 4: Kesariya & Green Accent (स्मार्ट लैब्स) */}
          <div className="space-y-1 p-3 rounded-xl border-t-4 border-amber-500 bg-gradient-to-b from-amber-50/80 via-white to-white shadow-sm hover:scale-102 transition">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2 shadow-inner">
              <Monitor className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-amber-700">20+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700">स्मार्ट लैब्स व क्लासरूम (Smart Labs)</p>
          </div>
        </div>
      </section>

      {/* 3. PM SHRI Special Welcome & Principal Desk (Tiranga Styled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: About PM SHRI School (Tiranga subtle wash) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-orange-50/60 via-white to-emerald-50/60 p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-orange-200/80 space-y-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>
            
            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
                <span>🇮🇳</span>
                <span>पीएम श्री योजना (PM SHRI SCHEME)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950 leading-snug">
                राजलदेसर में बालिका शिक्षा का अग्रदूत — पीएम श्री यूनियन क्लब विद्यालय
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                भारत सरकार की <strong>पीएम श्री (PM Schools for Rising India)</strong> योजना के तहत चयनित यह विद्यालय आधुनिक राष्ट्रीय शिक्षा नीति (NEP 2020) के सिद्धांतों पर आधारित है। यहाँ बालिकाओं को निःशुल्क उच्च गुणवत्तायुक्त शिक्षा, सुसज्जित प्रयोगशालाएं, आधुनिक कंप्यूटर कक्ष, समृद्ध पुस्तकालय एवं खेलकूद के लिए विशाल मैदान उपलब्ध कराया गया है।
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 text-xs font-bold text-slate-800 bg-white p-2.5 rounded-lg border-l-4 border-orange-500 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>कला, विज्ञान एवं वाणिज्य (तीनों संकाय उपलब्ध)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-800 bg-white p-2.5 rounded-lg border-l-4 border-blue-900 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>निःशुल्क पाठ्यपुस्तकें, यूनिफॉर्म एवं छात्रवृत्ति</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-800 bg-white p-2.5 rounded-lg border-l-4 border-emerald-600 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>आधुनिक आईसीटी व रोबोटिक्स प्रयोगशाला</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-800 bg-white p-2.5 rounded-lg border-l-4 border-amber-500 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>बालिका आत्मरक्षा प्रशिक्षण एवं खेलकूद प्रोत्साहन</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link
                to="/about"
                className="bg-gradient-to-r from-blue-950 to-blue-900 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition inline-flex items-center gap-2 shadow-md"
              >
                <span>विद्यालय का विस्तृत इतिहास व विजन</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="text-orange-600 hover:text-orange-700 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition inline-flex items-center gap-1 border border-orange-300 hover:bg-orange-50"
              >
                <span>उपलब्ध विषय संकाय ›</span>
              </Link>
            </div>
          </div>

          {/* Right: Principal Desk Message (Chakra Navy Blue with Tiranga Top Ribbon) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden border border-blue-900">
            <div className="absolute top-0 left-0 right-0 h-2 tiranga-bar"></div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="/uploads/staff/1.jpeg"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"; }}
                    alt="Principal"
                    className="w-20 h-20 rounded-full object-cover object-top border-3 border-orange-500 shadow-lg p-0.5 bg-white"
                  />
                  <span className="absolute bottom-0 right-0 text-base">🇮🇳</span>
                </div>
                <div>
                  <span className="text-orange-400 text-xs font-black uppercase tracking-wider block">प्रधानाचार्य संदेश (Principal's Desk)</span>
                  <h4 className="text-lg font-black text-white leading-tight mt-0.5">{settings.principal_name || "श्री मोहन लाल (प्रधानाचार्य)"}</h4>
                  <p className="text-xs text-slate-300 font-medium">प्रधानाचार्य, {settings.school_name_hi || "रा.बा.उ.मा.वि. राजलदेसर"}</p>
                  <p className="text-[11px] text-emerald-400 font-bold mt-0.5">M.A., M.Ed., Ph.D.</p>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm italic text-slate-200 leading-relaxed border-l-4 border-orange-400 pl-3.5 bg-white/5 p-3 rounded-r-xl">
                "प्रिय अभिभावकों एवं छात्राओं, हमारा लक्ष्य न केवल बालिकाओं को किताबी ज्ञान देना है बल्कि उनमें आत्मविश्वास, नैतिक मूल्य, डिजिटल दक्षता और नेतृत्व क्षमता का विकास करना है ताकि वे 21वीं सदी के भारत का गौरव बन सकें।"
              </blockquote>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>कार्यालय समय: 8:00 AM - 1:00 PM</span>
              </span>
              <Link to="/teachers" className="text-orange-400 hover:text-white font-bold flex items-center gap-1">
                <span>सभी शिक्षक देखें →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Notice Board & Announcements (Tiranga Styled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="h-1.5 w-full tiranga-bar"></div>
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                  <span>विद्यालय सूचना पट्ट (Notice Board)</span>
                  <span className="text-xs bg-orange-500/30 text-orange-300 font-bold px-2 py-0.5 rounded border border-orange-400/30">लाइव</span>
                </h3>
                <p className="text-xs text-slate-300">प्रवेश, परीक्षा, खेलकूद एवं प्रशासनिक सूचनाएं</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl text-xs font-bold border border-slate-700">
              {[
                { id: 'all', label: 'सभी (All)' },
                { id: 'admission', label: 'प्रवेश (Admission)' },
                { id: 'exam', label: 'परीक्षा (Exams)' },
                { id: 'sports', label: 'खेलकूद (Sports)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveNoticeTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeNoticeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((n) => (
                <div key={n.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-orange-50/40 px-3 rounded-xl transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {n.is_flash === 1 && (
                        <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase animate-pulse shadow-sm">
                          ★ FLASH
                        </span>
                      )}
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {n.category || 'General'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        {n.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 hover:text-orange-600 transition">
                      {n.title}
                    </h4>
                    {n.content && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {n.content}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                    <span>विवरण पढ़ें</span>
                    <ChevronRight className="w-3.5 h-3.5 text-orange-600" />
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm py-6">इस श्रेणी में कोई सूचना उपलब्ध नहीं है।</p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Key Facilities (Tiranga Palette Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-emerald-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-sm">
            <span>🇮🇳</span>
            <span>सुविधाएं एवं संसाधन (FACILITIES)</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-950">
            विद्यालय की अत्याधुनिक प्रमुख सुविधाएं
          </h3>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-orange-500 via-white to-emerald-600 rounded-full my-2"></div>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            पीएम श्री योजना के अंतर्गत विद्यालय में बालिकाओं के सर्वांगीण विकास हेतु विश्वस्तरीय संसाधन उपलब्ध कराए गए हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Facility 1: Computer Lab (Chakra Navy Blue Theme) */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 border-t-4 border-t-blue-900 overflow-hidden hover:shadow-2xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80"
                alt="Computer Lab"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-blue-950/90 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded shadow">
                ICT Lab
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-blue-900" />
                <span>आईसीटी व कंप्यूटर लैब</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                40+ आधुनिक कंप्यूटर, हाई-स्पीड इंटरनेट, प्रोजेक्टर एवं कोडिंग/डिजिटल साक्षरता की संपूर्ण व्यवस्था।
              </p>
              <Link to="/computer-lab" className="text-xs font-bold text-blue-900 hover:text-orange-600 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Facility 2: Library (Kesariya Saffron Theme) */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 border-t-4 border-t-orange-500 overflow-hidden hover:shadow-2xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80"
                alt="Library"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-orange-600/90 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded shadow">
                5000+ पुस्तकें
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition flex items-center gap-1.5">
                <Library className="w-4 h-4 text-orange-600" />
                <span>समृद्ध पुस्तकालय व वाचनालय</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                पाठ्यक्रम, प्रतियोगी परीक्षा, संदर्भ ग्रंथ, पत्रिकाएं एवं शांत सुसज्जित ई-रीडिंग रूम।
              </p>
              <Link to="/library" className="text-xs font-bold text-orange-600 hover:text-blue-950 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Facility 3: Sports (India Green Theme) */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 border-t-4 border-t-emerald-600 overflow-hidden hover:shadow-2xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&q=80"
                alt="Sports"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded shadow">
                खेल मैदान
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>खेलकूद एवं व्यायाम</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                खो-खो, कबड्डी, एथलेटिक्स, वॉलीबॉल, बैडमिंटन कोर्ट और प्रशिक्षित शारीरिक शिक्षिका द्वारा मार्गदर्शन।
              </p>
              <Link to="/game" className="text-xs font-bold text-emerald-700 hover:text-blue-950 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Facility 4: Science Labs (Tiranga Gold/Amber Theme) */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 border-t-4 border-t-amber-500 overflow-hidden hover:shadow-2xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"
                alt="Science Lab"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-amber-600/90 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded shadow">
                Lab Excellence
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>विज्ञान व प्रायोगिक लैब्स</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                भौतिक, रसायन व जीव विज्ञान की पृथक-पृथक पूर्णतः आधुनिक उपकरणों से सुसज्जित प्रयोगशालाएं।
              </p>
              <Link to="/classes" className="text-xs font-bold text-amber-600 hover:text-blue-950 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Board Exam Toppers & Stars Showcase (Chakra Navy Blue with Tiranga Borders) */}
      <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 tiranga-bar"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-orange-400 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-orange-400" />
                <span>विद्यालय की गौरवमयी प्रतिभाएं (Our Toppers)</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-1">
                बोर्ड परीक्षा परिणाम सत्र 2025-26 के शीर्ष मेधावी
              </h3>
            </div>
            <Link
              to="/result"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-5 py-2.5 rounded-full text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg border border-orange-300/40"
            >
              <span>संपूर्ण रिजल्ट पोर्टल देखें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toppers.map((t, idx) => (
              <div key={t.id || idx} className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-xl text-center space-y-3 relative overflow-hidden">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-bl from-orange-400 to-amber-500 rounded-full flex items-end justify-start p-1.5 shadow">
                  <span className="text-[10px] font-black text-slate-950">#{idx + 1}</span>
                </div>

                <div className="w-20 h-20 mx-auto rounded-full bg-slate-700 p-1 border-2 border-orange-400 shadow-md">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${t.student_name}`}
                    alt={t.student_name}
                    className="w-full h-full rounded-full bg-slate-900"
                  />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{t.student_name}</h4>
                  <p className="text-xs text-slate-400">{t.father_name}</p>
                  <span className="inline-block bg-blue-900/90 text-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1 border border-blue-700">
                    {t.class_name}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-around">
                  <div>
                    <p className="text-xs text-slate-400">अंक प्रतिशत</p>
                    <p className="text-xl font-black text-orange-400">{t.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">श्रेणी / ग्रेड</p>
                    <p className="text-xs font-black text-emerald-400">{t.grade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action (Admission / Help Desk - Tricolor Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-emerald-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden border-2 border-orange-400/40">
          <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <span>🇮🇳</span>
                <span>बेटी बचाओ, बेटी पढ़ाओ</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                अपनी बेटी के उज्ज्वल भविष्य के लिए आज ही प्रवेश दिलाएं!
              </h3>
              <p className="text-orange-50 text-sm leading-relaxed font-medium">
                कक्षा 1 से 12 तक निःशुल्क प्रवेश, आधुनिक स्मार्ट शिक्षा, सुरक्षित परिवेश और अनुभवी शिक्षक वृंद।
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/about"
                className="bg-white text-blue-950 hover:bg-slate-100 font-black px-6 py-3 rounded-xl text-sm shadow-xl transition hover:scale-102"
              >
                विद्यालय से संपर्क करें
              </Link>
              <Link
                to="/classes"
                className="bg-blue-950/60 hover:bg-blue-950 text-white font-bold px-5 py-3 rounded-xl text-sm border border-white/50 backdrop-blur-sm transition"
              >
                प्रवेश नियम देखें
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
