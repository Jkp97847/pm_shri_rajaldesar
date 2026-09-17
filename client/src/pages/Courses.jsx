import React from 'react';
import { GraduationCap, BookOpen, Scissors, HeartPulse, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Courses() {
  const streams = [
    {
      name: "विज्ञान संकाय (Science Stream)",
      desc: "चिकित्सा (NEET), इंजीनियरिंग (JEE), शोध एवं तकनीकी क्षेत्रों में उच्च शिक्षा के लिए।",
      subjects: [
        "भौतिक विज्ञान (Physics)",
        "रसायन विज्ञान (Chemistry)",
        "जीव विज्ञान (Biology) / गणित (Mathematics)",
        "अनिवार्य हिंदी एवं अंग्रेजी"
      ],
      career: "डॉक्टर, इंजीनियर, वैज्ञानिक, अनुसंधानकर्ता, फार्मासिस्ट, नर्सिंग अधिकारी",
      color: "border-blue-500",
      bg: "bg-blue-50/50"
    },
    {
      name: "कला संकाय (Arts / Humanities Stream)",
      desc: "प्रशासनिक सेवाएं (UPSC/RPSC), शिक्षण, कानून (CLAT), पत्रकारिता एवं सामाजिक विकास हेतु।",
      subjects: [
        "हिंदी साहित्य (Hindi Literature)",
        "राजनीति विज्ञान (Political Science)",
        "इतिहास (History) / भूगोल (Geography)",
        "अनिवार्य हिंदी एवं अंग्रेजी"
      ],
      career: "सिविल सेवक (IAS/RAS), प्राध्यापक, अधिवक्ता, पत्रकार, शोधार्थी",
      color: "border-amber-500",
      bg: "bg-amber-50/50"
    },
    {
      name: "वाणिज्य संकाय (Commerce Stream)",
      desc: "बैंकिंग, वित्त, चार्टर्ड एकाउंटेंसी (CA), व्यापार प्रबंधन (BBA/MBA) एवं कॉर्पोरेट क्षेत्र हेतु।",
      subjects: [
        "लेखाशास्त्र (Accountancy)",
        "व्यावसायिक अध्ययन (Business Studies)",
        "अर्थशास्त्र (Economics)",
        "अनिवार्य हिंदी एवं अंग्रेजी"
      ],
      career: "चार्टर्ड एकाउंटेंट (CA), कंपनी सेक्रेटरी (CS), बैंक पीओ, वित्तीय सलाहकार",
      color: "border-emerald-500",
      bg: "bg-emerald-50/50"
    }
  ];

  const vocationalSkills = [
    {
      title: "सूचना प्रौद्योगिकी (IT & Computer Application)",
      desc: "ऑफिस ऑटोमेशन, डेटा एंट्री, कंप्यूटर टाइपिंग एवं डिजिटल मार्केटिंग का व्यावहारिक प्रशिक्षण।",
      icon: GraduationCap
    },
    {
      title: "सिलाई एवं परिधान डिजाइन (Apparel & Tailoring)",
      desc: "वस्त्र निर्माण, आधुनिक फैशन डिजाइनिंग एवं परिधान निर्माण से छात्राओं को स्वावलंबी बनाना।",
      icon: Scissors
    },
    {
      title: "सौंदर्य एवं स्वास्थ्य (Beauty & Wellness)",
      desc: "प्राकृतिक सौंदर्य उपचार, योग, पोषण एवं स्वास्थ्य देखभाल का पेशेवर कौशल विकास।",
      icon: Sparkles
    },
    {
      title: "स्वास्थ्य सहायक बुनियादी प्रशिक्षण (Healthcare)",
      desc: "प्राथमिक चिकित्सा (First Aid), रोगी परिचर्या एवं स्वास्थ्य जागरुकता का मूलभूत ज्ञान।",
      icon: HeartPulse
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            पाठ्यक्रम एवं संकाय (Academic Streams & Vocational Courses)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            वरिष्ठ माध्यमिक संकाय एवं व्यावसायिक कौशल
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            कक्षा 11 एवं 12 में छात्राओं के भविष्य और रुचि के अनुसार तीनों मुख्य संकाय तथा पीएम श्री कौशल विकास कार्यक्रम उपलब्ध हैं।
          </p>
        </div>
      </div>

      {/* Main Streams */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-blue-950">
          कक्षा 11वीं एवं 12वीं हेतु मुख्य शैक्षणिक संकाय
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {streams.map((stream, idx) => (
            <div key={idx} className={`bg-white rounded-2xl p-6 sm:p-8 shadow-md border-t-4 ${stream.color} ${stream.bg} space-y-4 flex flex-col justify-between`}>
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-blue-950">{stream.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{stream.desc}</p>
                
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-800 mb-2">मुख्य ऐच्छिक विषय (Subjects):</p>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {stream.subjects.map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs">
                <span className="font-bold text-slate-900">कैरियर विकल्प: </span>
                <span className="text-slate-600">{stream.career}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PM SHRI Vocational Skill Courses */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-1">
          <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-0.5 rounded-full uppercase">
            पीएम श्री कौशल विकास योजना (NEP 2020)
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            व्यावसायिक एवं स्वरोजगार कौशल प्रशिक्षण
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            बालिकाओं को आत्मनिर्भर और स्वावलंबी बनाने हेतु पढ़ाई के साथ-साथ हुनरमंद बनाने के विशेष पाठ्यक्रम।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vocationalSkills.map((skill, idx) => {
            const Icon = skill.icon;
            return (
              <div key={idx} className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">{skill.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{skill.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admission CTA */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold text-blue-950">सत्र 2026-27 में प्रवेश के लिए संपर्क करें</h4>
          <p className="text-xs text-slate-600">सभी संकायों में बालिकाओं के लिए पूर्णतः निःशुल्क प्रवेश फॉर्म विद्यालय कार्यालय से प्राप्त किए जा सकते हैं।</p>
        </div>
        <Link
          to="/about"
          className="bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold px-5 py-3 rounded-lg transition flex items-center gap-2 shrink-0 shadow"
        >
          <span>कार्यालय संपर्क सूत्र</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
