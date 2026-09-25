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

      {/* 2. Key Highlights / Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 p-2 border-r last:border-0 border-slate-100">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-blue-950">1,150+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-600">नामांकित छात्राएं (Girls Enrolled)</p>
          </div>

          <div className="space-y-1 p-2 border-r last:border-0 border-slate-100">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-blue-950">100%</p>
            <p className="text-xs sm:text-sm font-bold text-slate-600">बोर्ड परीक्षा परिणाम (Board Results)</p>
          </div>

          <div className="space-y-1 p-2 border-r last:border-0 border-slate-100">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-blue-950">35+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-600">योग्य एवं अनुभवी शिक्षक (Faculty)</p>
          </div>

          <div className="space-y-1 p-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
              <Monitor className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-blue-950">20+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-600">स्मार्ट लैब्स व क्लासरूम (Smart Labs)</p>
          </div>
        </div>
      </section>

      {/* 3. PM SHRI Special Welcome & Principal Desk */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: About PM SHRI School */}
          <div className="lg:col-span-7 bg-gradient-to-br from-white to-amber-50/40 p-6 sm:p-8 rounded-2xl shadow-md border border-amber-100 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>पीएम श्री योजना (PM SHRI SCHEME)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950 leading-snug">
                राजलदेसर में बालिका शिक्षा का अग्रदूत — पीएम श्री यूनियन क्लब विद्यालय
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                भारत सरकार की <strong>पीएम श्री (PM Schools for Rising India)</strong> योजना के तहत चयनित यह विद्यालय आधुनिक राष्ट्रीय शिक्षा नीति (NEP 2020) के सिद्धांतों पर आधारित है। यहाँ बालिकाओं को निःशुल्क उच्च गुणवत्तायुक्त शिक्षा, सुसज्जित प्रयोगशालाएं, आधुनिक कंप्यूटर कक्ष, समृद्ध पुस्तकालय एवं खेलकूद के लिए विशाल मैदान उपलब्ध कराया गया है।
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>कला, विज्ञान एवं वाणिज्य (तीनों संकाय उपलब्ध)</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>निःशुल्क पाठ्यपुस्तकें, यूनिफॉर्म एवं छात्रवृत्ति</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>आधुनिक आईसीटी व रोबोटिक्स प्रयोगशाला</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>बालिका आत्मरक्षा प्रशिक्षण एवं खेलकूद प्रोत्साहन</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link
                to="/about"
                className="bg-blue-950 hover:bg-blue-900 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition inline-flex items-center gap-2"
              >
                <span>विद्यालय का विस्तृत इतिहास व विजन</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="text-orange-600 hover:text-orange-700 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition inline-flex items-center gap-1"
              >
                <span>उपलब्ध विषय संकाय ›</span>
              </Link>
            </div>
          </div>

          {/* Right: Principal Desk Message */}
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between border-t-4 border-amber-400">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                  alt="Principal"
                  className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">प्रधानाचार्य संदेश (Principal's Desk)</span>
                  <h4 className="text-lg font-bold text-white leading-tight">{settings.principal_name || "श्री मोहन लाल (प्रधानाचार्य)"}</h4>
                  <p className="text-xs text-slate-300">प्रधानाचार्य, {settings.school_name_hi || "रा.बा.उ.मा.वि. राजलदेसर"}</p>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">M.A., M.Ed., Ph.D.</p>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm italic text-slate-200 leading-relaxed border-l-2 border-amber-400 pl-3">
                "प्रिय अभिभावकों एवं छात्राओं, हमारा लक्ष्य न केवल बालिकाओं को किताबी ज्ञान देना है बल्कि उनमें आत्मविश्वास, नैतिक मूल्य, डिजिटल दक्षता और नेतृत्व क्षमता का विकास करना है ताकि वे 21वीं सदी के भारत का गौरव बन सकें।"
              </blockquote>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>कार्यालय सम्पर्क समय: 8:00 AM - 1:00 PM</span>
              </span>
              <Link to="/teachers" className="text-amber-400 hover:underline font-semibold">
                सभी शिक्षक देखें →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Notice Board & Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">विद्यालय सूचना पट्ट (Notice Board)</h3>
                <p className="text-xs text-slate-400">प्रवेश, परीक्षा, खेलकूद एवं प्रशासनिक सूचनाएं</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs font-semibold">
              {[
                { id: 'all', label: 'सभी (All)' },
                { id: 'admission', label: 'प्रवेश (Admission)' },
                { id: 'exam', label: 'परीक्षा (Exams)' },
                { id: 'sports', label: 'खेलकूद (Sports)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveNoticeTab(tab.id)}
                  className={`px-3 py-1.5 rounded transition ${
                    activeNoticeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
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
                <div key={n.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-lg transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {n.is_flash === 1 && (
                        <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase animate-pulse">
                          महत्वपूर्ण
                        </span>
                      )}
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {n.category || 'General'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {n.date}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 hover:text-orange-600 transition">
                      {n.title}
                    </h4>
                    {n.content && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {n.content}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer">
                    <span>विवरण पढ़ें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm py-6">इस श्रेणी में कोई सूचना उपलब्ध नहीं है।</p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Key Facilities (Computer Lab, Library, Science, Sports) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
            सुविधाएं एवं संसाधन
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-blue-950">
            विद्यालय की अत्याधुनिक प्रमुख सुविधाएं
          </h3>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            पीएम श्री योजना के अंतर्गत विद्यालय में बालिकाओं के सर्वांगीण विकास हेतु विश्वस्तरीय संसाधन उपलब्ध कराए गए हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Facility 1: Computer Lab */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80"
                alt="Computer Lab"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-blue-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded">
                ICT Lab
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span>आईसीटी व कंप्यूटर लैब</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                40+ आधुनिक कंप्यूटर, हाई-स्पीड इंटरनेट, प्रोजेक्टर एवं कोडिंग/डिजिटल साक्षरता की संपूर्ण व्यवस्था।
              </p>
              <Link to="/computer-lab" className="text-xs font-bold text-blue-900 hover:text-orange-600 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Facility 2: Library */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80"
                alt="Library"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded">
                5000+ पुस्तकें
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition flex items-center gap-1.5">
                <Library className="w-4 h-4 text-emerald-600" />
                <span>समृद्ध पुस्तकालय व वाचनालय</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                पाठ्यक्रम, प्रतियोगी परीक्षा, संदर्भ ग्रंथ, पत्रिकाएं एवं शांत सुसज्जित ई-रीडिंग रूम।
              </p>
              <Link to="/library" className="text-xs font-bold text-blue-900 hover:text-orange-600 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Facility 3: Sports */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&q=80"
                alt="Sports"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-amber-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded">
                खेल मैदान
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>खेलकूद एवं व्यायाम</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                खो-खो, कबड्डी, एथलेटिक्स, वॉलीबॉल, बैडमिंटन कोर्ट और प्रशिक्षित शारीरिक शिक्षिका द्वारा मार्गदर्शन।
              </p>
              <Link to="/game" className="text-xs font-bold text-blue-900 hover:text-orange-600 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Facility 4: Science Labs */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition group">
            <div className="h-44 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"
                alt="Science Lab"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-purple-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded">
                Lab Excellence
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>विज्ञान व प्रायोगिक लैब्स</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                भौतिक, रसायन व जीव विज्ञान की पृथक-पृथक पूर्णतः आधुनिक उपकरणों से सुसज्जित प्रयोगशालाएं।
              </p>
              <Link to="/classes" className="text-xs font-bold text-blue-900 hover:text-orange-600 flex items-center gap-1 pt-2">
                <span>विस्तार से देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Board Exam Toppers & Stars Showcase */}
      <section className="bg-gradient-to-b from-slate-900 to-blue-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>विद्यालय की गौरवमयी प्रतिभाएं (Our Toppers)</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-1">
                बोर्ड परीक्षा परिणाम सत्र 2025-26 के शीर्ष मेधावी
              </h3>
            </div>
            <Link
              to="/result"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <span>संपूर्ण रिजल्ट पोर्टल देखें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toppers.map((t, idx) => (
              <div key={t.id || idx} className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 shadow-lg text-center space-y-3 relative overflow-hidden">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-bl from-amber-400 to-orange-500 rounded-full flex items-end justify-start p-1.5 shadow">
                  <span className="text-[10px] font-black text-slate-950">#{idx + 1}</span>
                </div>

                <div className="w-20 h-20 mx-auto rounded-full bg-slate-700 p-1 border-2 border-amber-400">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${t.student_name}`}
                    alt={t.student_name}
                    className="w-full h-full rounded-full bg-slate-900"
                  />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{t.student_name}</h4>
                  <p className="text-xs text-slate-400">{t.father_name}</p>
                  <span className="inline-block bg-blue-900 text-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded mt-1">
                    {t.class_name}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-around">
                  <div>
                    <p className="text-xs text-slate-400">अंक प्रतिशत</p>
                    <p className="text-xl font-black text-amber-400">{t.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">श्रेणी / ग्रेड</p>
                    <p className="text-xs font-bold text-emerald-400">{t.grade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action (Admission / Help Desk) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
        <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black">
              अपनी बेटी के उज्ज्वल भविष्य के लिए आज ही प्रवेश दिलाएं!
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              कक्षा 1 से 12 तक निःशुल्क प्रवेश, आधुनिक स्मार्ट शिक्षा, सुरक्षित परिवेश और अनुभवी शिक्षक वृंद।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/about"
              className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-6 py-3 rounded-lg text-sm shadow-md transition"
            >
              विद्यालय से संपर्क करें
            </Link>
            <Link
              to="/classes"
              className="bg-orange-800/50 hover:bg-orange-800 text-white font-semibold px-5 py-3 rounded-lg text-sm border border-orange-300 transition"
            >
              प्रवेश नियम देखें
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
