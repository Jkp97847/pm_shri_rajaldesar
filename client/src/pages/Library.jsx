import React, { useState, useEffect } from 'react';
import { Library as LibIcon, BookOpen, Search, BookmarkCheck, ExternalLink, Sparkles, CheckCircle2, PlusCircle, BookMarked, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/library')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.books) {
          setBooks(data.books);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    {
      title: "पाठ्यपुस्तकें एवं संदर्भ ग्रंथ",
      count: "2,200+ पुस्तकें",
      desc: "कक्षा 1 से 12 तक NCERT एवं RBSE द्वारा अधिकृत पाठ्यपुस्तकें, गाइड एवं विषय संदर्भ पुस्तकें।",
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "प्रतियोगी परीक्षा संदर्भ कॉर्नर",
      count: "850+ पुस्तकें",
      desc: "NEET, JEE, CUET, NDA, REET, SSC, BSTC एवं राजस्थान प्रशासनिक सेवा की प्राथमिक तैयारी सामग्री।",
      icon: BookmarkCheck,
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "साहित्य, उपन्यास एवं जीवनियां",
      count: "1,400+ पुस्तकें",
      desc: "मुंशी प्रेमचंद, जयशंकर प्रसाद, डॉ. कलाम, स्वामी विवेकानंद, कल्पना चावला आदि के जीवन चरित्र।",
      icon: Sparkles,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "दैनिक समाचार पत्र एवं ज्ञान पत्रिकाएं",
      count: "15+ मासिक पत्रिकाएं",
      desc: "राजस्थान पत्रिका, दैनिक भास्कर, प्रतियोगिता दर्पण, विज्ञान प्रगति, चंपक एवं इंडिया टुडे।",
      icon: LibIcon,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const bookCategoryFilters = ['All', 'NCERT', 'Literature', 'Competitive', 'Reference', 'General'];

  const filteredBooks = books.filter(b => {
    const matchesCategory = activeCategory === 'All' || b.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            ज्ञान का भंडार (School Library & Reading Room)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            समृद्ध पुस्तकालय एवं डिजिटल ई-वाचनालय
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            5000+ से अधिक पुस्तकों, पत्र-पत्रिकाओं और शांत अध्ययन कक्ष से सुसज्जित हमारा पुस्तकालय छात्राओं में स्वाध्याय और ज्ञान-पिपासा को बढ़ाता है।
          </p>
        </div>

        <Link
          to="/admin"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shrink-0 shadow"
        >
          <BookMarked className="w-4 h-4" />
          <span>पुस्तकें प्रबंधित करें (Admin)</span>
        </Link>
      </div>

      {/* Library Overview Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-3 hover:shadow-xl transition">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded">
                {cat.count}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Books Catalog Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase">पुस्तकालय कैटलॉग</span>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950">
              उपलब्ध पुस्तकें एवं ई-संसाधन सूची
            </h3>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="शीर्षक, लेखक या विषय खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {bookCategoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-emerald-950 text-emerald-300 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'सभी पुस्तकें' : cat}
            </button>
          ))}
        </div>

        {/* Books List Grid */}
        {loading ? (
          <div className="text-center py-10 text-slate-500 text-xs">पुस्तकें लोड हो रही हैं...</div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      {b.category}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      प्रतियां: {b.total_copies || 1}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                  {b.author && (
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{b.author}</span>
                    </p>
                  )}
                  {b.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {b.description}
                    </p>
                  )}
                </div>

                {b.digital_link && (
                  <div className="pt-2 border-t border-slate-100">
                    <a
                      href={b.digital_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <span>ई-पुस्तक पढ़ें (Digital Access)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">कोई पुस्तक नहीं मिली।</p>
            <p className="text-[11px] text-slate-500">एडमिन पैनल से नई पुस्तकें और संदर्भ ग्रंथ जोड़े जा सकते हैं।</p>
          </div>
        )}
      </div>

      {/* Digital e-Library Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            डिजिटल ई-पुस्तकालय
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            ऑनलाइन पुस्तकें एवं राष्ट्रीय डिजिटल पुस्तकालय (NDLI)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            छात्राएं विद्यालय के कंप्यूटर लैब से सीधे भारत सरकार के नेशनल डिजिटल लाइब्रेरी (NDLI), दीक्षा (DIKSHA) एवं ई-पाठशाला (e-Pathshala) से लाखों ई-बुक्स और शोध सामग्री निःशुल्क पढ़ सकती हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://ndl.iitkgp.ac.in"
            target="_blank"
            rel="noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5"
          >
            <span>NDLI पोर्टल पर जाएं</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://diksha.gov.in"
            target="_blank"
            rel="noreferrer"
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-white/40 transition flex items-center gap-1.5"
          >
            <span>दीक्षा ई-बुक्स</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Reading Room Rules & Instructions */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>पुस्तकालय उपयोग एवं वाचनालय नियमावली</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            • प्रत्येक छात्रा को सत्र के प्रारंभ में पुस्तकालय कार्ड (Library Card) निःशुल्क जारी किया जाता है।
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            • एक समय में अधिकतम 2 पुस्तकें 14 दिनों की अवधि के लिए जारी (Issue) कराई जा सकती हैं।
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            • वाचनालय में पूर्ण शांति बनाए रखना अनिवार्य है ताकि सभी छात्राएं एकाग्रचित्त होकर अध्ययन कर सकें।
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            • संदर्भ ग्रंथ, शब्दकोश एवं दैनिक समाचार पत्र केवल वाचनालय में ही पढ़ने हेतु उपलब्ध रहते हैं।
          </div>
        </div>
      </div>

    </div>
  );
}
