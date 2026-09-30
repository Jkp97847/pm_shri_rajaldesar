import React, { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, CheckCircle, Clock, Heart, Sparkles, 
  HelpCircle, Calendar, Download, FileText, Bell, Layers, ShieldCheck, 
  ArrowRight, Award, Compass, School
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Classes() {
  const [classesList, setClassesList] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('All');

  const [timetables, setTimetables] = useState([]);
  const [loadingTimetable, setLoadingTimetable] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Fetch dynamic classes from server DB
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.classes) {
          setClassesList(data.classes);
        }
        setLoadingClasses(false);
      })
      .catch(err => {
        console.error("Error fetching classes:", err);
        setLoadingClasses(false);
      });

    // Fetch timetables
    fetch('/api/timetables')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.timetables) {
          setTimetables(data.timetables);
        }
        setLoadingTimetable(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingTimetable(false);
      });
  }, []);

  const sections = [
    {
      title: "पूर्व-प्राथमिक स्तर (Pre-Primary / बालवाटिका Wing: Nursery, LKG, UKG)",
      badge: "नर्सरी, LKG, UKG",
      desc: "राष्ट्रीय शिक्षा नीति (NEP) एवं निपुण भारत के तहत खेल-खेल में प्रारंभिक बाल्यावस्था देखभाल एवं शिक्षा (ECCE)।",
      features: [
        "रंग-बिरंगे, आकर्षक व बाल-सुलभ क्लासरूम एवं खिलौने",
        "बुनियादी अक्षर ज्ञान, कविताएं, चित्रकला एवं संगीत",
        "शारीरिक, बौद्धिक व भावनात्मक विकास हेतु ममतामयी शिक्षण",
        "निःशुल्क पोषण आहार एवं बालवाटिका एक्टिविटी किट"
      ],
      color: "border-pink-500 bg-pink-50/30",
      accent: "text-pink-600 bg-pink-100"
    },
    {
      title: "प्राथमिक स्तर (Primary Wing: Class 1 to 5)",
      badge: "कक्षा 1 से 5",
      desc: "निपुण भारत (NIPUN Bharat) एवं बुनियादी साक्षरता व संख्यात्मक ज्ञान (FLN) की सशक्त नींव।",
      features: [
        "बुनियादी साक्षरता एवं संख्यात्मक ज्ञान (FLN) का दैनिक अभ्यास",
        "कक्षा 1 से 5 तक गतिविधि आधारित सरल व सुगम शिक्षण",
        "पौष्टिक गरमा-गरम मध्याह्न भोजन (Mid-Day Meal)",
        "निःशुल्क पाठ्यपुस्तकें एवं यूनिफॉर्म सहायता"
      ],
      color: "border-orange-500 bg-orange-50/30",
      accent: "text-orange-600 bg-orange-100"
    },
    {
      title: "उच्च प्राथमिक स्तर (Upper Primary: Class 6 to 8)",
      badge: "कक्षा 6 से 8",
      desc: "विषयवार गहन शिक्षण, विज्ञान प्रयोग और कंप्यूटर की बुनियादी शिक्षा की शुरुआत।",
      features: [
        "हिंदी, अंग्रेजी, संस्कृत, गणित, विज्ञान एवं सामाजिक विज्ञान",
        "आईसीटी कंप्यूटर लैब में व्यावहारिक शिक्षण",
        "रानी लक्ष्मीबाई आत्मरक्षा (Self Defence) प्रशिक्षण अनिवार्य",
        "प्रारंभिक शिक्षा पूर्णता प्रमाण पत्र (8वीं बोर्ड) की विशेष तैयारी"
      ],
      color: "border-blue-500 bg-blue-50/30",
      accent: "text-blue-600 bg-blue-100"
    },
    {
      title: "माध्यमिक स्तर (Secondary Wing: Class 9 & 10)",
      badge: "कक्षा 9 व 10 (बोर्ड)",
      desc: "माध्यमिक शिक्षा बोर्ड राजस्थान (RBSE) आधारित 10वीं बोर्ड परीक्षा की विशेष तैयारी।",
      features: [
        "बोर्ड परीक्षाओं हेतु नियमित साप्ताहिक टेस्ट एवं उपचारात्मक (Remedial) कक्षाएं",
        "अत्याधुनिक विज्ञान प्रयोगशाला में हैंड्स-ऑन प्रयोग",
        "कैरियर गाइडेंस एवं राष्ट्रीय प्रतिभा खोज (NMMS/NTSE) की तैयारी",
        "सत्र पर्यंत 100% बोर्ड परिणाम देने का गौरवमयी इतिहास"
      ],
      color: "border-emerald-500 bg-emerald-50/30",
      accent: "text-emerald-600 bg-emerald-100"
    },
    {
      title: "उच्च माध्यमिक स्तर (Senior Secondary: Class 11 & 12)",
      badge: "कक्षा 11 व 12 (कला एवं विज्ञान संकाय)",
      desc: "विज्ञान एवं कला दोनों संकायों में उच्च स्तरीय विषयवार विशेषज्ञ व्याख्याता। (नोट: विद्यालय में कला एवं विज्ञान संकाय उपलब्ध हैं)।",
      features: [
        "विज्ञान संकाय (Physics, Chemistry, Biology, Mathematics)",
        "कला संकाय (Hindi Literature, History, Pol. Science, Geography, Sanskrit)",
        "NEET / JEE / CUET प्रवेश परीक्षाओं हेतु विशेष मार्गदर्शन",
        "भौतिकी, रसायन विज्ञान व जीव विज्ञान की पृथक आधुनिक प्रयोगशालाएं"
      ],
      color: "border-purple-500 bg-purple-50/30",
      accent: "text-purple-600 bg-purple-100"
    }
  ];

  // Level tabs for dynamic classes
  const levelTabs = [
    { id: 'All', label: 'सभी कक्षाएं (All Classes)' },
    { id: 'पूर्व-प्राथमिक', label: 'पूर्व-प्राथमिक (Nursery to UKG)' },
    { id: 'प्राथमिक', label: 'प्राथमिक (Class 1 to 5)' },
    { id: 'उच्च प्राथमिक', label: 'उच्च प्राथमिक (Class 6 to 8)' },
    { id: 'माध्यमिक', label: 'माध्यमिक (Class 9 & 10)' },
    { id: 'उच्च माध्यमिक', label: 'उच्च माध्यमिक (Arts & Science 11-12)' }
  ];

  const filteredClasses = selectedLevel === 'All'
    ? classesList
    : classesList.filter(c => c.level && c.level.includes(selectedLevel));

  const filteredTimetables = activeFilter === 'All' 
    ? timetables 
    : timetables.filter(t => t.type === activeFilter || t.class_name.includes(activeFilter));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b-4 border-orange-500">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
            <span>🇮🇳</span>
            <span>शैक्षणिक संरचना (Academic Classes)</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            कक्षाएं एवं उपलब्ध संकाय
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            नर्सरी (पूर्व-प्राथमिक/बालवाटिका) से कक्षा 12 (कला एवं विज्ञान संकाय) तक बालिकाओं के लिए पूर्णतः निःशुल्क, सुरक्षित, सर्व-सुविधायुक्त और आधुनिक शिक्षा व्यवस्था।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 z-10">
          <Link
            to="/admin"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
          >
            <GraduationCap className="w-4 h-4" />
            <span>कक्षा व संकाय प्रबंधित करें (Admin)</span>
          </Link>
          <Link
            to="/admin"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>समय सारणी अपडेट करें</span>
          </Link>
        </div>
      </div>

      {/* 1. Academic Wings Overview (Starting from Nursery to 12th) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">विद्यालय के 5 प्रमुख शैक्षणिक चरण</span>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950">
              शैक्षणिक विंग्स एवं अध्ययन प्रणाली (School Wings)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            नर्सरी से 12वीं तक (कला व विज्ञान)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec, idx) => (
            <div key={idx} className={`bg-white rounded-2xl p-6 shadow-md border-t-4 ${sec.color} space-y-4 flex flex-col justify-between hover:shadow-lg transition`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${sec.accent}`}>
                    {sec.badge}
                  </span>
                  <BookOpen className="w-5 h-5 text-slate-400" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-blue-950 leading-snug">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                {sec.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC CLASS & STREAM DIRECTORY (Database-Driven, starts from Nursery) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              <School className="w-4 h-4 text-orange-600" />
              <span>कक्षावार विस्तृत विवरण (Class Directory)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950">
              प्रत्येक कक्षा, संकाय एवं विषय संरचना ({classesList.length} कक्षाएं)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              प्रशासक द्वारा कक्षा विवरण, संकाय एवं विषयों को एडमिन पैनल से सीधे संपादित, जोड़ा या हटाया जा सकता है।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>कक्षाएं संपादित / जोड़ें (Admin)</span>
            </Link>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {levelTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedLevel(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedLevel === tab.id
                  ? 'bg-blue-950 text-amber-400 shadow-md ring-2 ring-orange-500/40'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Class Cards Grid */}
        {loadingClasses ? (
          <div className="text-center py-12 text-slate-500 text-xs">कक्षा विवरण लोड हो रहा है...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
            <School className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">इस स्तर की कोई कक्षा उपलब्ध नहीं है।</p>
            <p className="text-[11px] text-slate-500">एडमिन पैनल से नई कक्षाएं जोड़ी जा सकती हैं।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((item) => {
              const isPre = item.level && item.level.includes('पूर्व-प्राथमिक');
              const isPrimary = item.level && item.level.includes('प्राथमिक') && !isPre && !item.level.includes('उच्च');
              const isUpper = item.level && item.level.includes('उच्च प्राथमिक');
              const isSec = item.level && item.level.includes('माध्यमिक') && !item.level.includes('उच्च');
              const isSrSec = item.level && item.level.includes('उच्च माध्यमिक');

              let badgeStyle = "bg-blue-100 text-blue-900 border-blue-200";
              if (isPre) badgeStyle = "bg-pink-100 text-pink-800 border-pink-200";
              else if (isPrimary) badgeStyle = "bg-orange-100 text-orange-800 border-orange-200";
              else if (isUpper) badgeStyle = "bg-sky-100 text-sky-800 border-sky-200";
              else if (isSec) badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
              else if (isSrSec) badgeStyle = "bg-purple-100 text-purple-800 border-purple-200";

              return (
                <div 
                  key={item.id} 
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-lg transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${badgeStyle}`}>
                        {item.level}
                      </span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        संकाय: {item.stream || 'सामान्य'}
                      </span>
                    </div>

                    {/* Class Name */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 text-amber-400 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                        {item.display_order}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-blue-950 leading-tight">
                          {item.class_name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          सेक्शन: {item.section || 'A'} | माध्यम: {item.medium || 'हिंदी व अंग्रेजी'}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100 font-medium">
                        {item.description}
                      </p>
                    )}

                    {/* Subjects */}
                    {item.subjects && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                          प्रमुख विषय (Key Subjects):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.subjects.split(',').map((subj, sIdx) => (
                            <span 
                              key={sIdx}
                              className="text-[10px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                            >
                              {subj.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom status */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>प्रवेश हेतु उपलब्ध</span>
                    </span>
                    <span className="text-slate-400 font-mono">क्रम: #{item.display_order}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Live Timetables & Examination Schedule Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">नवीनतम समय सारणी</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950">
              कक्षावार समय सारणी एवं परीक्षा कार्यक्रम (Timetable)
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Exam', 'Regular Bell', 'Class Routine'].map((flt) => (
              <button
                key={flt}
                onClick={() => setActiveFilter(flt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeFilter === flt
                    ? 'bg-blue-950 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {flt === 'All' ? 'सभी समय सारणी' : flt}
              </button>
            ))}
          </div>
        </div>

        {loadingTimetable ? (
          <div className="text-center py-8 text-slate-500 text-xs">समय सारणी लोड हो रही है...</div>
        ) : filteredTimetables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTimetables.map((item) => (
              <div key={item.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase ${
                      item.type === 'Exam' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                    <p className="text-xs text-amber-700 font-bold">लागू कक्षा: {item.class_name}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>

                {item.schedule_details && (
                  <p className="text-xs text-slate-600 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-100">
                    {item.schedule_details}
                  </p>
                )}

                {item.file_url && (
                  <div className="pt-2">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>समय सारणी फाइल देखें / डाउनलोड करें</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">वर्तमान में इस श्रेणी की समय सारणी उपलब्ध नहीं है।</p>
            <p className="text-[11px] text-slate-500">एडमिन पैनल से नई समय सारणी एवं परीक्षा तिथियां जोड़ी जा सकती हैं।</p>
          </div>
        )}
      </div>

      {/* 4. Girls Benefits & Govt Schemes */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 sm:p-8 border border-amber-200 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-orange-700 uppercase">बालिका कल्याण योजनाएं</span>
          <h3 className="text-xl sm:text-2xl font-black text-blue-950">
            बालिकाओं को मिलने वाली सरकारी सुविधाएं एवं छात्रवृत्तियां
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 space-y-2">
            <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>गार्गी एवं बालिका प्रोत्साहन पुरस्कार</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              10वीं एवं 12वीं बोर्ड में 75% या अधिक अंक प्राप्त करने वाली मेधावी छात्राओं को राज्य सरकार द्वारा नकद पुरस्कार एवं प्रमाण पत्र।
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 space-y-2">
            <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>निःशुल्क साइकिल / ट्रांसपोर्ट वाउचर</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              दूर-दराज के गांवों व ढाणियों से आने वाली छात्राओं के लिए निःशुल्क साइकिल योजना अथवा दैनिक यात्रा भत्ता (Transport Voucher)।
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 space-y-2">
            <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>आत्मरक्षा (Self Defence) प्रशिक्षण</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              प्रत्येक छात्रा को रानी लक्ष्मीबाई आत्मरक्षा योजना के तहत ताइक्वांडो, जूडो और मार्शल आर्ट्स का अनिवार्य निःशुल्क प्रशिक्षण।
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
