import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, CheckCircle, Clock, Heart, Sparkles, HelpCircle, Calendar, Download, FileText, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Classes() {
  const [timetables, setTimetables] = useState([]);
  const [loadingTimetable, setLoadingTimetable] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
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
      title: "प्राथमिक स्तर (Primary Wing: Class 1 to 5)",
      badge: "कक्षा 1 से 5",
      desc: "निपुण भारत (NIPUN Bharat) एवं खेल-खेल में सीखने (Joyful Activity-Based Learning) की पद्धति।",
      features: [
        "बुनियादी साक्षरता एवं संख्यात्मक ज्ञान (FLN)",
        "बालवाटिका एवं सुंदर, रंग-बिरंगे बाल-सुलभ क्लासरूम",
        "पौष्टिक गरमा-गरम मध्याह्न भोजन (Mid-Day Meal)",
        "निःशुल्क पाठ्यपुस्तकें एवं स्कूली बैग/ड्रेस"
      ],
      color: "border-orange-500 bg-orange-50/30"
    },
    {
      title: "उच्च प्राथमिक स्तर (Upper Primary: Class 6 to 8)",
      badge: "कक्षा 6 से 8",
      desc: "विषयवार गहन शिक्षण, विज्ञान प्रयोग और कंप्यूटर की बुनियादी शिक्षा की शुरुआत।",
      features: [
        "हिंदी, अंग्रेजी, संस्कृत, गणित, विज्ञान एवं सामाजिक विज्ञान",
        "आईसीटी कंप्यूटर लैब में व्यावहारिक शिक्षण",
        "आत्मरक्षा (Self Defence) प्रशिक्षण अनिवार्य",
        "विज्ञान एवं गणित क्लब की गतिविधियाँ"
      ],
      color: "border-blue-500 bg-blue-50/30"
    },
    {
      title: "माध्यमिक स्तर (Secondary Wing: Class 9 & 10)",
      badge: "कक्षा 9 व 10 (बोर्ड)",
      desc: "माध्यमिक शिक्षा बोर्ड राजस्थान (RBSE) आधारित बोर्ड परीक्षा की विशेष तैयारी।",
      features: [
        "बोर्ड परीक्षाओं हेतु नियमित साप्ताहिक टेस्ट एवं उपचारात्मक (Remedial) कक्षाएं",
        "अत्याधुनिक विज्ञान प्रयोगशाला में हैंड्स-ऑन प्रयोग",
        "कैरियर गाइडेंस एवं राष्ट्रीय प्रतिभा खोज (NMMS/NTSE) की तैयारी",
        "सत्र पर्यंत 100% परिणाम देने का गौरवमयी इतिहास"
      ],
      color: "border-emerald-500 bg-emerald-50/30"
    },
    {
      title: "उच्च माध्यमिक स्तर (Senior Secondary: Class 11 & 12)",
      badge: "कक्षा 11 व 12 (तीनों संकाय)",
      desc: "विज्ञान, कला एवं वाणिज्य तीनों संकायों में उच्च स्तरीय विषयवार विशेषज्ञ व्याख्याता।",
      features: [
        "विज्ञान संकाय (Physics, Chemistry, Biology, Mathematics)",
        "कला संकाय (Hindi Literature, History, Pol. Science, Geography)",
        "वाणिज्य संकाय (Accountancy, Business Studies, Economics)",
        "NEET / JEE / CUET प्रवेश परीक्षाओं हेतु विशेष मार्गदर्शन"
      ],
      color: "border-purple-500 bg-purple-50/30"
    }
  ];

  const filteredTimetables = activeFilter === 'All' 
    ? timetables 
    : timetables.filter(t => t.type === activeFilter || t.class_name.includes(activeFilter));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            शैक्षणिक संरचना (Academic Classes)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            कक्षाएं एवं उपलब्ध संकाय
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            कक्षा 1 से 12 तक बालिकाओं के लिए पूर्णतः निःशुल्क, सुरक्षित, सर्व-सुविधायुक्त और आधुनिक शिक्षा व्यवस्था।
          </p>
        </div>

        <Link
          to="/admin"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shrink-0 shadow"
        >
          <Calendar className="w-4 h-4" />
          <span>समय सारणी अपडेट करें (Admin)</span>
        </Link>
      </div>

      {/* Class Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 sm:p-8 shadow-md border-t-4 ${sec.color} space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="bg-slate-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                {sec.badge}
              </span>
              <BookOpen className="w-5 h-5 text-slate-400" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-blue-950">
              {sec.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {sec.desc}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100">
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

      {/* Live Timetables & Examination Schedule Section */}
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

      {/* Girls Benefits & Govt Schemes */}
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
