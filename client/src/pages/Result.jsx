import React, { useState, useEffect } from 'react';
import { 
  Award, Search, Printer, CheckCircle2, Trophy, Star, AlertCircle, 
  FileText, Calendar, User, ShieldCheck, Sparkles, Filter, ChevronRight, X
} from 'lucide-react';

export default function Result() {
  const [rollInput, setRollInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAllResults(data.results);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!rollInput.trim() || !dobInput.trim()) {
      setErrorMsg("कृपया अनुक्रमांक (Roll Number) और जन्म तिथि (DOB) दोनों दर्ज करें।");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSearchResult(null);
    setSearched(true);

    fetch(`/api/results/search?roll=${encodeURIComponent(rollInput.trim())}&dob=${encodeURIComponent(dobInput.trim())}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success && data.result) {
          setSearchResult(data.result);
          // Scroll smoothly to marksheet
          setTimeout(() => {
            const el = document.getElementById('printable-marksheet');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          setErrorMsg(data.message || "दर्ज विवरण के अनुसार कोई परीक्षा परिणाम नहीं मिला। कृपया अपना रोल नंबर और जन्म तिथि पुनः जांचें।");
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg("सर्वर से परिणाम प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।");
      });
  };

  const handlePrint = () => {
    window.print();
  };

  const setDemoData = (roll, dob) => {
    setRollInput(roll);
    setDobInput(dob);
    setErrorMsg('');
  };

  // Helper to format DOB nicely
  const formatDob = (dobStr) => {
    if (!dobStr) return 'उपलब्ध नहीं';
    try {
      const parts = dobStr.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dobStr;
    } catch {
      return dobStr;
    }
  };

  // Filter toppers class-wise
  const filteredToppers = allResults.filter(item => {
    if (selectedClassFilter === 'All') return true;
    if (selectedClassFilter === '12th') return item.class_name.toLowerCase().includes('12');
    if (selectedClassFilter === '11th') return item.class_name.toLowerCase().includes('11');
    if (selectedClassFilter === '10th') return item.class_name.toLowerCase().includes('10');
    if (selectedClassFilter === 'UpperPrimary') {
      return ['9', '8', '7', '6'].some(c => item.class_name.includes(c));
    }
    if (selectedClassFilter === 'Primary') {
      return ['5', '4', '3', '2', '1'].some(c => item.class_name.includes(c)) && !item.class_name.includes('11') && !item.class_name.includes('12') && !item.class_name.includes('10');
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="no-print bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ऑनलाइन परीक्षा परिणाम एवं अंकतालिका पोर्टल (Result Portal)</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            वार्षिक परीक्षा परिणाम एवं कक्षावार मेधावी छात्राएं
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            कक्षा नर्सरी से 12वीं तक अध्ययनरत छात्राएं अपना अनुक्रमांक (Roll No) एवं जन्म तिथि (DOB) दर्ज करके अपनी आधिकारिक कम्प्यूटरीकृत द्वितीयक अंकतालिका (Duplicate Copy) देख व प्रिंट निकाल सकती हैं।
          </p>
        </div>
      </div>

      {/* 2. Search Result Card (Roll No + DOB Verification) */}
      <div className="no-print bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-950 mb-1">
            <FileText className="w-6 h-6 text-blue-900" />
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-blue-950">
            अपना परीक्षा परिणाम खोजें (Search Marksheet)
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            गोपनीयता एवं सुरक्षा हेतु अपना <strong>अनुक्रमांक (Roll No)</strong> एवं <strong>जन्म तिथि (DOB)</strong> सही-सही दर्ज करें।
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-6 text-xs text-slate-600">
          <p className="font-bold text-slate-700 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>परीक्षण हेतु उदाहरण (Demo Click to Test):</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDemoData("260101", "2008-05-15")}
              className="bg-white hover:bg-amber-50 hover:border-amber-400 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium transition text-[11px] shadow-xs"
            >
              12वीं साइंस: <strong>260101</strong> (15/05/2008)
            </button>
            <button
              type="button"
              onClick={() => setDemoData("260104", "2010-04-18")}
              className="bg-white hover:bg-amber-50 hover:border-amber-400 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium transition text-[11px] shadow-xs"
            >
              10वीं बोर्ड: <strong>260104</strong> (18/04/2010)
            </button>
            <button
              type="button"
              onClick={() => setDemoData("260102", "2008-08-20")}
              className="bg-white hover:bg-amber-50 hover:border-amber-400 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium transition text-[11px] shadow-xs"
            >
              12वीं आर्ट्स: <strong>260102</strong> (20/08/2008)
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Roll Number Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                अनुक्रमांक / रोल नंबर (Roll Number) *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 260101 या 120192329..."
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>
            </div>

            {/* Date of Birth Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                जन्म तिथि (Date of Birth) *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "परिणाम खोज रहे हैं..." : "परीक्षा परिणाम देखें (View Result)"}</span>
            </button>
            {(rollInput || dobInput || searchResult) && (
              <button
                type="button"
                onClick={() => { setRollInput(''); setDobInput(''); setSearchResult(null); setErrorMsg(''); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl text-sm transition"
              >
                रीसेट करें
              </button>
            )}
          </div>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}
      </div>

      {/* 3. Official Printable Marksheet (DUPLICATE COPY) */}
      {searchResult && (
        <div className="space-y-4">
          
          {/* Action Bar (Print & Close) - Hidden when printing */}
          <div className="no-print max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>सत्यापित अंकतालिका सफलतापूर्वक लोड हो गई है।</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>अंकतालिका प्रिंट निकालें (Print Marksheet)</span>
              </button>
              <button
                onClick={() => setSearchResult(null)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-lg"
              >
                बंद करें
              </button>
            </div>
          </div>

          {/* Marksheet Container (Printed as A4 page) */}
          <div 
            id="printable-marksheet" 
            className="bg-white rounded-2xl shadow-2xl border-4 border-double border-blue-950 max-w-4xl mx-auto overflow-hidden relative"
          >
            {/* 1. DUPLICATE COPY Top Banner */}
            <div className="bg-red-700 text-white text-center py-1.5 px-4 font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-inner border-b-2 border-red-800">
              <span>★ द्वितीयक प्रतिलिपि / DUPLICATE COPY ★</span>
            </div>

            {/* Background Watermark for Duplicate Copy */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none overflow-hidden z-0">
              <div className="text-6xl sm:text-9xl font-black text-slate-900 rotate-[-28deg] uppercase tracking-widest">
                DUPLICATE COPY
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-6 relative z-10">

              {/* 2. Official Header */}
              <div className="text-center border-b-2 border-slate-300 pb-5 space-y-1.5">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-950 text-amber-400 flex items-center justify-center font-black text-sm border-2 border-amber-400 shadow">
                    PM
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      माध्यमिक शिक्षा बोर्ड राजस्थान, अजमेर (RBSE) / शाला दर्पण
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      School Code: 217036 | U-DISE Code: 08040809202
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-blue-950 tracking-tight mt-2">
                  पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर
                </h3>
                <h4 className="text-xs sm:text-sm font-bold text-slate-700 uppercase">
                  PM SHRI GOVT. GIRLS SENIOR SECONDARY SCHOOL, RAJALDESAR (CHURU)
                </h4>
                
                <div className="inline-block bg-slate-100 text-slate-900 font-extrabold text-xs px-4 py-1 rounded-full border border-slate-300 mt-1">
                  वार्षिक परीक्षा अंकतालिका / ANNUAL EXAMINATION MARKSHEET (सत्र 2025-2026)
                </div>
              </div>

              {/* 3. Student Details Section */}
              <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50/70">
                <div className="bg-slate-200/80 px-4 py-2 border-b border-slate-300 font-bold text-xs text-blue-950 uppercase tracking-wider flex items-center justify-between">
                  <span>विद्यार्थी का व्यक्तिगत विवरण (Student Information)</span>
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-black border border-red-200">
                    DUPLICATE COPY
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 p-4 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">विद्यार्थी का नाम (Student Name):</span>
                    <strong className="text-sm text-blue-950 font-black">{searchResult.student_name}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">अनुक्रमांक (Roll Number):</span>
                    <strong className="text-sm font-mono text-blue-950 font-black">{searchResult.roll_no}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">एस.आर. नंबर (SR Number):</span>
                    <strong className="text-sm font-mono text-slate-800 font-bold">{searchResult.sr_no || '5101'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">कक्षा एवं वर्ग (Class & Sec):</span>
                    <strong className="text-sm text-blue-950 font-bold">{searchResult.class_name} - Sec {searchResult.section || 'A'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">पिता का नाम (Father's Name):</span>
                    <span className="font-bold text-slate-800">{searchResult.father_name || 'उपलब्ध नहीं'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">माता का नाम (Mother's Name):</span>
                    <span className="font-bold text-slate-800">{searchResult.mother_name || 'श्रीमती उपलब्ध नहीं'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">जन्म तिथि (Date of Birth):</span>
                    <span className="font-bold text-slate-900 font-mono">{formatDob(searchResult.dob)}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">जाति संवर्ग (Category):</span>
                    <span className="font-bold text-slate-800 uppercase">{searchResult.category || 'GEN'} (नियमित / Regular)</span>
                  </div>
                </div>
              </div>

              {/* 4. Overall Result Performance Summary (No Subject List - All-Over Performance) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>सम्पूर्ण परीक्षा परिणाम सारांश (All-Over Performance Summary)</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">सत्र 2025-2026 मूल्यांकन</span>
                </div>

                {/* Performance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* Maximum Total Marks */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">कुल पूर्णांक</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{searchResult.total_marks || 600}</p>
                    <p className="text-[10px] text-slate-400">Total Marks</p>
                  </div>

                  {/* Marks Obtained / Gain */}
                  <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-center">
                    <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">कुल प्राप्तांक</p>
                    <p className="text-2xl font-black text-blue-950 mt-1">{searchResult.obtained_marks || '-'}</p>
                    <p className="text-[10px] text-blue-700 font-semibold">Marks Gained</p>
                  </div>

                  {/* Overall Percentage */}
                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-center">
                    <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">कुल प्रतिशत</p>
                    <p className="text-2xl font-black text-amber-800 mt-1">{searchResult.percentage}%</p>
                    <p className="text-[10px] text-amber-700 font-semibold">Percentage</p>
                  </div>

                  {/* Pass / Fail Status */}
                  <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">परीक्षा परिणाम</p>
                    <p className="text-xl font-black text-emerald-700 mt-1 uppercase flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{searchResult.status || 'PASS'}</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold">उत्तीर्ण</p>
                  </div>

                  {/* Grade / Division */}
                  <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200 text-center">
                    <p className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">श्रेणी / ग्रेड</p>
                    <p className="text-base font-black text-purple-900 mt-1 truncate" title={searchResult.grade}>
                      {searchResult.grade || 'A+'}
                    </p>
                    <p className="text-[10px] text-purple-700 font-semibold">Grade / Division</p>
                  </div>

                  {/* Class Rank */}
                  <div className="bg-orange-50 p-3.5 rounded-xl border border-orange-200 text-center">
                    <p className="text-[10px] font-bold text-orange-900 uppercase tracking-wider">कक्षा में स्थान</p>
                    <p className="text-xl font-black text-orange-700 mt-1">
                      {searchResult.rank ? `${searchResult.rank} Rank` : 'योग्य'}
                    </p>
                    <p className="text-[10px] text-orange-800 font-semibold">
                      {searchResult.rank === 1 ? 'प्रथम स्थान' : searchResult.rank === 2 ? 'द्वितीय स्थान' : searchResult.rank === 3 ? 'तृतीय स्थान' : 'सफल स्थान'}
                    </p>
                  </div>
                </div>

                {/* Structured Result Summary Table */}
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-blue-950 text-white font-bold">
                      <tr>
                        <th className="p-3 text-center">सत्र</th>
                        <th className="p-3 text-center">पूर्णांक (Max Marks)</th>
                        <th className="p-3 text-center">प्राप्तांक (Marks Gained)</th>
                        <th className="p-3 text-center">प्रतिशत (Percentage)</th>
                        <th className="p-3 text-center">श्रेणी (Grade)</th>
                        <th className="p-3 text-center">कक्षा रैंक (Class Rank)</th>
                        <th className="p-3 text-center">अंतिम स्थिति (Result)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-800 text-center">
                      <tr className="bg-slate-50/50">
                        <td className="p-3 text-slate-600 font-normal">{searchResult.year || '2025-2026'}</td>
                        <td className="p-3 font-mono">{searchResult.total_marks || 600}</td>
                        <td className="p-3 font-mono text-blue-950 font-black text-sm">{searchResult.obtained_marks || '-'}</td>
                        <td className="p-3 font-mono text-amber-800 font-black text-sm">{searchResult.percentage}%</td>
                        <td className="p-3 text-purple-900">{searchResult.grade}</td>
                        <td className="p-3 text-orange-700 font-black">
                          {searchResult.rank ? `${searchResult.rank}st Rank` : 'सफल'}
                        </td>
                        <td className="p-3 text-emerald-700 font-black">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
                            {searchResult.status || 'PASS (उत्तीर्ण)'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Authentication Signatures & Verification Disclaimer */}
              <div className="pt-6 border-t-2 border-slate-200 space-y-8">
                <div className="text-[11px] text-slate-500 leading-relaxed text-center italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <strong>प्रमाणीकरण टिप्पणी:</strong> यह शाला दर्पण एवं विद्यालय परीक्षा प्रकोष्ठ द्वारा जारी अधिकृत कम्प्यूटरीकृत द्वितीयक अंकतालिका प्रति (Computerized Duplicate Marksheet) है। किसी भी विसंगति की स्थिति में विद्यालय का मूल परीक्षा अभिलेख एवं रजिस्टर ही मान्य होगा।
                </div>

                <div className="grid grid-cols-3 text-center text-xs font-bold text-slate-800 items-end pt-4">
                  <div>
                    <p className="text-[11px] text-slate-500 font-normal">जारी दिनांक (Date of Issue):</p>
                    <p className="font-mono text-xs text-slate-700 mt-1">{new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>

                  <div>
                    <div className="w-36 mx-auto border-t-2 border-slate-800 pt-1.5 font-bold">
                      हस्ताक्षर कक्षा अध्यापक
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Class Teacher Signature</p>
                  </div>

                  <div>
                    <div className="w-44 mx-auto border-t-2 border-slate-800 pt-1.5 font-bold">
                      हस्ताक्षर एवं सील प्रधानाचार्य
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Principal Seal & Signature</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Print Button */}
          <div className="no-print text-center pt-2">
            <button
              onClick={handlePrint}
              className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl text-sm shadow-lg transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>द्वितीयक अंकतालिका प्रिंट करें (Print Marksheet Copy)</span>
            </button>
          </div>

        </div>
      )}

      {/* 4. School Toppers Wall (Class-wise Sorted) */}
      <div className="no-print space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-blue-950">
                विद्यालय की मेरिट एवं टॉपर्स सूची (Class-wise Merit List)
              </h3>
              <p className="text-xs text-slate-500">
                कक्षावार क्रमानुसार (Class-wise Sorted) उत्कृष्ट अंक प्राप्त मेधावी छात्राएं
              </p>
            </div>
          </div>

          {/* Class-wise Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {[
              { id: 'All', label: 'सभी कक्षाएं (All)' },
              { id: '12th', label: '12वीं (Class 12)' },
              { id: '11th', label: '11वीं (Class 11)' },
              { id: '10th', label: '10वीं (Class 10)' },
              { id: 'UpperPrimary', label: 'उच्च प्राथमिक (6th-9th)' },
              { id: 'Primary', label: 'प्राथमिक (1st-5th)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedClassFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedClassFilter === tab.id
                    ? 'bg-blue-950 text-amber-400 font-bold shadow'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toppers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredToppers.map((item, idx) => (
            <div 
              key={item.id || idx} 
              className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 space-y-4 relative hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span>{item.class_name}</span>
                  </span>
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                    {item.rank ? `${item.rank} Rank` : 'Topper'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">{item.student_name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">पिता: {item.father_name || 'श्री ...'}</p>
                </div>
              </div>

              {/* All-Over Performance Strip */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">कुल प्राप्तांक</p>
                    <p className="text-xs font-mono font-bold text-slate-700">
                      {item.obtained_marks ? `${item.obtained_marks} / ${item.total_marks || 600}` : `${item.percentage}%`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">प्राप्त प्रतिशत</p>
                    <p className="text-xl font-black text-orange-600">{item.percentage}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                  <span className="text-purple-900 font-bold truncate max-w-[160px]">{item.grade}</span>
                  <span className="text-emerald-700 font-black uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{item.status || 'PASS'}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
