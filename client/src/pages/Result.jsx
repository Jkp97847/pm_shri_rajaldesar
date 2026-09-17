import React, { useState, useEffect } from 'react';
import { Award, Search, Printer, CheckCircle2, Trophy, Star, AlertCircle, FileText } from 'lucide-react';

export default function Result() {
  const [rollInput, setRollInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!rollInput.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSearchResult(null);
    setSearched(true);

    fetch(`/api/results/search?roll=${encodeURIComponent(rollInput.trim())}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSearchResult(data.result);
        } else {
          setErrorMsg(data.message || "इस अनुक्रमांक (Roll Number) का कोई परीक्षा परिणाम नहीं मिला।");
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg("परिणाम प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।");
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            ऑनलाइन परीक्षा परिणाम पोर्टल (Result Portal)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            परीक्षा परिणाम एवं मेधावी छात्राएं
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            कक्षा 10वीं, 12वीं (कला, विज्ञान, वाणिज्य) एवं स्थानीय परीक्षाओं का परिणाम यहाँ अपने अनुक्रमांक (Roll Number) द्वारा आसानी से जांचें।
          </p>
        </div>
      </div>

      {/* Search Result Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 max-w-3xl mx-auto">
        <h3 className="text-lg sm:text-xl font-bold text-blue-950 mb-2 text-center">
          अपना परीक्षा परिणाम खोजें (Search Marksheet)
        </h3>
        <p className="text-xs text-slate-500 text-center mb-6">
          उदाहरण के लिए रोल नंबर दर्ज करें: <span className="font-bold text-blue-900 cursor-pointer" onClick={() => setRollInput("260101")}>260101</span>, <span className="font-bold text-blue-900 cursor-pointer" onClick={() => setRollInput("260102")}>260102</span>, <span className="font-bold text-blue-900 cursor-pointer" onClick={() => setRollInput("260104")}>260104</span>
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="रोल नंबर दर्ज करें (e.g. 260101)..."
              value={rollInput}
              onChange={(e) => setRollInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm shadow transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "खोज रहे हैं..." : "परिणाम देखें"}</span>
          </button>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Display Search Result (Official Marksheet Layout) */}
      {searchResult && (
        <div id="printable-marksheet" className="bg-white rounded-2xl shadow-xl border-2 border-blue-900 p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
          {/* Marksheet Header */}
          <div className="text-center border-b-2 border-slate-200 pb-4 space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              माध्यमिक शिक्षा बोर्ड राजस्थान, अजमेर (RBSE)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950">
              पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              अंक तालिका / वार्षिक परीक्षा परिणाम पत्रक (SESSION {searchResult.year})
            </p>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
            <div>
              <p className="text-slate-500 font-medium">अनुक्रमांक (Roll No)</p>
              <p className="text-sm font-bold text-blue-950">{searchResult.roll_no}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">छात्रा का नाम (Student)</p>
              <p className="text-sm font-bold text-blue-950">{searchResult.student_name}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">पिता का नाम (Father)</p>
              <p className="text-sm font-bold text-blue-950">{searchResult.father_name || "उपलब्ध नहीं"}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">कक्षा एवं संकाय (Class)</p>
              <p className="text-sm font-bold text-blue-950">{searchResult.class_name}</p>
            </div>
          </div>

          {/* Subject-wise Marks Table */}
          {searchResult.marks_breakdown && Object.keys(searchResult.marks_breakdown).length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-blue-950 text-white font-bold">
                  <tr>
                    <th className="p-3">क्र.सं.</th>
                    <th className="p-3">विषय (Subject Name)</th>
                    <th className="p-3 text-right">प्राप्तांक / पूर्णांक (Marks Obtained)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {Object.entries(searchResult.marks_breakdown).map(([subject, marks], index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-semibold text-slate-900">{subject}</td>
                      <td className="p-3 text-right font-bold text-blue-900">{marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary Footer */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-600">कुल प्रतिशत (Overall Percentage):</p>
              <p className="text-3xl font-black text-blue-950">{searchResult.percentage}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">परिणाम स्थिति (Result Status):</p>
              <p className="text-sm font-black text-emerald-700 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{searchResult.status} ({searchResult.grade})</span>
              </p>
            </div>
            <div>
              <button
                onClick={handlePrint}
                className="bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट निकालें (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School Toppers Wall */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-950">
              विद्यालय की मेरिट एवं टॉपर्स सूची (Merit List)
            </h3>
            <p className="text-xs text-slate-500">हाल ही में आयोजित बोर्ड परीक्षाओं में उत्कृष्ट अंक प्राप्त छात्राएं</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allResults.map((item, idx) => (
            <div key={item.id || idx} className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-3 relative hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>{item.class_name}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">Roll: {item.roll_no}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{item.student_name}</h4>
                <p className="text-xs text-slate-500">पिता: {item.father_name}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">प्राप्तांक</p>
                  <p className="text-xl font-black text-orange-600">{item.percentage}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">श्रेणी</p>
                  <p className="text-xs font-bold text-emerald-700">{item.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
