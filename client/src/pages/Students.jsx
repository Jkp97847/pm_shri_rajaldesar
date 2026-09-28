import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Search, Filter, Printer, Download, Sparkles, 
  GraduationCap, Phone, Calendar, MapPin, Award, CheckCircle2, ChevronRight, X 
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export default function Students() {
  const { settings } = useSchool();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Print modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printClass, setPrintClass] = useState('Class 10');

  const classesList = [
    'All',
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 Arts', 'Class 11 Science', 'Class 11 Commerce',
    'Class 12 Arts', 'Class 12 Science', 'Class 12 Commerce'
  ];

  const categoriesList = ['All', 'GEN', 'OBC', 'SC', 'ST', 'EWS', 'MBC'];

  const fetchStudents = () => {
    let url = '/api/students?';
    if (selectedClass !== 'All') url += `class_name=${encodeURIComponent(selectedClass)}&`;
    if (selectedGender !== 'All') url += `gender=${encodeURIComponent(selectedGender)}&`;
    if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.students);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchStats = () => {
    fetch('/api/students/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedGender, selectedCategory, searchQuery]);

  // Export current filtered list as CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert("एक्सपोर्ट करने के लिए कोई विद्यार्थी डेटा उपलब्ध नहीं है।");
      return;
    }
    const headers = ["SR No", "Roll No", "Student Name", "Father Name", "Mother Name", "Class", "Section", "Gender", "Category", "DOB", "Phone", "Address"];
    const rows = students.map(s => [
      `"${s.sr_no || ''}"`,
      `"${s.roll_no || ''}"`,
      `"${s.name || ''}"`,
      `"${s.father_name || ''}"`,
      `"${s.mother_name || ''}"`,
      `"${s.class_name || ''}"`,
      `"${s.section || 'A'}"`,
      `"${s.gender || ''}"`,
      `"${s.category || ''}"`,
      `"${s.dob || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.address || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PM_SHRI_Rajaldesar_Students_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const studentsForPrint = students.filter(s => printClass === 'All' || s.class_name === printClass);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>विद्यार्थी पोर्टल (Student Information Panel)</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            कक्षावार विद्यार्थी विवरण एवं सांख्यिकी
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            कक्षा नर्सरी से 12वीं तक अध्ययनरत सभी विद्यार्थियों की विस्तृत जानकारी, लिंगानुपात, वर्गवार संख्या एवं कक्षावार नामांकित विद्यार्थियों की सूची।
          </p>
        </div>
      </div>

      {/* 2. Key Statistical Metrics (Total, Boys, Girls, Categories) */}
      {stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Students */}
            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-t-blue-900 border-x border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">कुल नामांकित विद्यार्थी</p>
                <h3 className="text-3xl font-black text-blue-950 mt-1">{stats.total}</h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">सत्र 2025-2026 (Nursery से 12वीं)</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
            </div>

            {/* Girls Count */}
            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-t-pink-600 border-x border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">बालिकाएं (Girls)</p>
                <h3 className="text-3xl font-black text-pink-700 mt-1">{stats.girls}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  {stats.total > 0 ? ((stats.girls / stats.total) * 100).toFixed(1) : 0}% कुल नामांकन
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <UserCheck className="w-7 h-7" />
              </div>
            </div>

            {/* Boys Count */}
            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-t-cyan-600 border-x border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">बालक (Boys)</p>
                <h3 className="text-3xl font-black text-cyan-800 mt-1">{stats.boys}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  {stats.total > 0 ? ((stats.boys / stats.total) * 100).toFixed(1) : 0}% प्राथमिक/प्राक
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
            </div>

            {/* Gender Ratio Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-t-amber-500 border-x border-b border-slate-200 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">लिंगानुपात (Gender Ratio)</p>
                <div className="flex items-center justify-between text-xs font-black text-slate-700 mt-2 mb-1">
                  <span className="text-pink-600">बालिकाएं ({stats.girls})</span>
                  <span className="text-cyan-700">बालक ({stats.boys})</span>
                </div>
                <div className="w-full h-3 bg-cyan-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-pink-500 h-full" 
                    style={{ width: `${stats.total > 0 ? (stats.girls / stats.total) * 100 : 50}%` }}
                    title={`Girls: ${stats.girls}`}
                  ></div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">बालिका शिक्षा को सर्वोच्च प्राथमिकता</p>
            </div>
          </div>

          {/* Category-wise Breakdown Cards */}
          <div className="bg-gradient-to-r from-orange-50/70 via-white to-emerald-50/70 rounded-2xl p-6 shadow-md border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>वर्गवार विद्यार्थी संख्या (Category-wise Distribution)</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-semibold">नियम व आरक्षण मानकों के अनुसार</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(stats.categories || {}).map(([cat, cnt]) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                  className={`p-3.5 rounded-xl border text-center transition ${
                    selectedCategory === cat
                      ? 'bg-blue-950 text-amber-400 border-blue-900 shadow-md ring-2 ring-amber-400'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">{cat}</p>
                  <p className="text-2xl font-black mt-0.5">{cnt}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">विद्यार्थी</p>
                </button>
              ))}
            </div>
          </div>

          {/* Class-wise Total Cards (Nursery to 12th) */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-blue-950 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>कक्षावार विद्यार्थी संख्या (Class-wise Student Totals)</span>
                </h4>
                <p className="text-xs text-slate-500">किसी भी कक्षा पर क्लिक कर उस कक्षा के विद्यार्थियों की सूची देखें</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
                कक्षा नर्सरी से 12वीं तक
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {stats.class_wise.map((cw) => {
                const isSelected = selectedClass === cw.class_name;
                return (
                  <button
                    key={cw.class_name}
                    onClick={() => setSelectedClass(isSelected ? 'All' : cw.class_name)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950 text-white border-blue-900 shadow-lg ring-2 ring-orange-500'
                        : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black truncate ${isSelected ? 'text-amber-400' : 'text-blue-950'}`}>
                        {cw.class_name}
                      </span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-950'}`}>
                        {cw.total}
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] flex items-center justify-between opacity-80">
                      <span>बालिकाएं: <strong>{cw.girls}</strong></span>
                      <span>बालक: <strong>{cw.boys}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Controls & Print / Export Action Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>कक्षा:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent font-bold text-blue-950 focus:outline-none cursor-pointer"
              >
                {classesList.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'सभी कक्षाएं (All)' : c}</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
              <span>लिंग:</span>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="bg-transparent font-bold text-blue-950 focus:outline-none cursor-pointer"
              >
                <option value="All">सभी (All)</option>
                <option value="Girl">बालिकाएं (Girls)</option>
                <option value="Boy">बालक (Boys)</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
              <span>वर्ग:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent font-bold text-blue-950 focus:outline-none cursor-pointer"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'सभी वर्ग' : cat}</option>
                ))}
              </select>
            </div>

            {(selectedClass !== 'All' || selectedGender !== 'All' || selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => { setSelectedClass('All'); setSelectedGender('All'); setSelectedCategory('All'); setSearchQuery(''); }}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 underline"
              >
                फ़िल्टर हटाएं
              </button>
            )}
          </div>

          {/* Search Box & Buttons */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="नाम, रोल नं, SR नं खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Print Class List Button */}
            <button
              onClick={() => {
                setPrintClass(selectedClass !== 'All' ? selectedClass : 'Class 10');
                setIsPrintModalOpen(true);
              }}
              className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition flex items-center gap-1.5 shadow"
              title="कक्षा सूची व उपस्थिति पत्रक प्रिंट करें"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">कक्षा सूची प्रिंट करें</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition flex items-center gap-1.5 shadow"
              title="विद्यार्थी डेटा CSV फ़ाइल में डाउनलोड करें"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV एक्सपोर्ट</span>
            </button>
          </div>
        </div>

        {/* Showing Count */}
        <div className="text-xs text-slate-500 font-medium">
          कुल प्रदर्शित विद्यार्थी: <strong className="text-blue-950">{students.length}</strong>
          {selectedClass !== 'All' && <span> | कक्षा: <strong className="text-blue-950">{selectedClass}</strong></span>}
          {selectedGender !== 'All' && <span> | लिंग: <strong className="text-blue-950">{selectedGender === 'Girl' ? 'बालिकाएं' : 'बालक'}</strong></span>}
          {selectedCategory !== 'All' && <span> | वर्ग: <strong className="text-blue-950">{selectedCategory}</strong></span>}
        </div>
      </div>

      {/* 4. Students Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-semibold bg-white rounded-2xl shadow">
          विद्यार्थी सूची लोड हो रही है...
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow border border-slate-200 space-y-3">
          <p className="text-slate-600 font-bold">चयनित फ़िल्टर के अनुसार कोई विद्यार्थी नहीं मिला।</p>
          <button
            onClick={() => { setSelectedClass('All'); setSelectedGender('All'); setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs bg-blue-950 text-white font-bold px-4 py-2 rounded-lg"
          >
            सभी विद्यार्थी देखें
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white">
                <tr>
                  <th className="p-3.5 font-bold">क्र.सं.</th>
                  <th className="p-3.5 font-bold">SR नं. / रोल नं.</th>
                  <th className="p-3.5 font-bold">विद्यार्थी का नाम</th>
                  <th className="p-3.5 font-bold">पिता का नाम</th>
                  <th className="p-3.5 font-bold">माता का नाम</th>
                  <th className="p-3.5 font-bold">कक्षा व वर्ग</th>
                  <th className="p-3.5 font-bold">लिंग</th>
                  <th className="p-3.5 font-bold">श्रेणी / वर्ग</th>
                  <th className="p-3.5 font-bold">जन्म तिथि</th>
                  <th className="p-3.5 font-bold">संपर्क / पता</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {students.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-blue-950 font-mono">{s.roll_no || '-'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">SR: {s.sr_no || '-'}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{s.status || 'Active'}</div>
                    </td>
                    <td className="p-3.5">{s.father_name || '-'}</td>
                    <td className="p-3.5">{s.mother_name || '-'}</td>
                    <td className="p-3.5">
                      <span className="inline-block bg-blue-100 text-blue-950 font-bold px-2 py-0.5 rounded text-[11px]">
                        {s.class_name} {s.section ? `(${s.section})` : ''}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.gender === 'Girl' || s.gender === 'बालिका'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-cyan-100 text-cyan-800'
                      }`}>
                        {s.gender === 'Girl' || s.gender === 'बालिका' ? 'बालिका' : 'बालक'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded text-[10px]">
                        {s.category || 'GEN'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{s.dob || '-'}</td>
                    <td className="p-3.5">
                      {s.phone && (
                        <div className="flex items-center gap-1 text-slate-800 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{s.phone}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{s.address || 'राजलदेसर'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Class-wise Formal Print Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-4xl w-full space-y-4 my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-950" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">कक्षा सूची प्रिंट एवं उपस्थिति पत्रक</h3>
                  <p className="text-xs text-slate-500">विद्यालय के आधिकारिक लेटरहेड के साथ प्रिंट निकालें</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={printClass}
                  onChange={(e) => setPrintClass(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 focus:outline-none"
                >
                  {classesList.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'सभी कक्षाएं' : c}</option>
                  ))}
                </select>

                <button
                  onClick={() => window.print()}
                  className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>अभी प्रिंट करें (Print)</span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Sheet View */}
            <div id="printable-class-register" className="overflow-y-auto flex-1 p-6 border-2 border-slate-300 rounded-xl space-y-6 bg-white text-slate-900">
              
              {/* Formal Letterhead */}
              <div className="text-center border-b-2 border-blue-950 pb-4 space-y-1">
                <div className="text-[11px] font-black text-orange-600 uppercase tracking-widest">
                  🇮🇳 भारत सरकार — पीएम श्री विद्यालय योजना (PM SHRI SCHOOL) 🇮🇳
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight">
                  {settings.school_name_hi || "पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर"}
                </h2>
                <p className="text-xs text-slate-700 font-semibold uppercase">
                  {settings.school_name || "PM SHRI UNION CLUB GOVT GIRLS SENIOR SECONDARY SCHOOL, RAJALDESAR"}
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 font-medium pt-1">
                  <span>UDISE: <strong>{settings.udise_code || "08040700105"}</strong></span>
                  <span>|</span>
                  <span>ब्लॉक: <strong>रतनगढ़</strong>, जिला: <strong>चूरू (राजस्थान)</strong></span>
                  <span>|</span>
                  <span>सत्र: <strong>2025-2026</strong></span>
                </div>
                <div className="inline-block bg-blue-950 text-white text-xs font-bold px-4 py-1 rounded-full mt-2">
                  कक्षा रोल सूची एवं छात्र रजिस्टर: {printClass === 'All' ? 'समस्त कक्षाएं' : printClass} (कुल: {studentsForPrint.length})
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                  <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="p-2 border border-slate-300 text-center w-10">क्र.सं.</th>
                      <th className="p-2 border border-slate-300 text-center">SR नं.</th>
                      <th className="p-2 border border-slate-300 text-center">रोल नं.</th>
                      <th className="p-2 border border-slate-300">विद्यार्थी का नाम</th>
                      <th className="p-2 border border-slate-300">पिता का नाम</th>
                      <th className="p-2 border border-slate-300">माता का नाम</th>
                      <th className="p-2 border border-slate-300 text-center">कक्षा</th>
                      <th className="p-2 border border-slate-300 text-center">लिंग</th>
                      <th className="p-2 border border-slate-300 text-center">वर्ग</th>
                      <th className="p-2 border border-slate-300 text-center">जन्म तिथि</th>
                      <th className="p-2 border border-slate-300">मोबाइल</th>
                      <th className="p-2 border border-slate-300 text-center">हस्ताक्षर / उपस्थिति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentsForPrint.map((s, i) => (
                      <tr key={s.id || i} className="hover:bg-slate-50">
                        <td className="p-2 border border-slate-300 text-center font-mono">{i + 1}</td>
                        <td className="p-2 border border-slate-300 text-center font-mono">{s.sr_no || '-'}</td>
                        <td className="p-2 border border-slate-300 text-center font-mono font-bold">{s.roll_no || '-'}</td>
                        <td className="p-2 border border-slate-300 font-bold">{s.name}</td>
                        <td className="p-2 border border-slate-300">{s.father_name || '-'}</td>
                        <td className="p-2 border border-slate-300">{s.mother_name || '-'}</td>
                        <td className="p-2 border border-slate-300 text-center font-semibold">{s.class_name}</td>
                        <td className="p-2 border border-slate-300 text-center">{s.gender === 'Girl' || s.gender === 'बालिका' ? 'बालिका' : 'बालक'}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold">{s.category || 'GEN'}</td>
                        <td className="p-2 border border-slate-300 text-center font-mono">{s.dob || '-'}</td>
                        <td className="p-2 border border-slate-300 font-mono">{s.phone || '-'}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-300">____________</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature Blocks */}
              <div className="pt-12 grid grid-cols-2 text-center text-xs font-bold text-slate-800">
                <div>
                  <div className="w-48 mx-auto border-t-2 border-slate-800 pt-1">
                    हस्ताक्षर कक्षा अध्यापक
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal">Class Teacher Signature</p>
                </div>
                <div>
                  <div className="w-48 mx-auto border-t-2 border-slate-800 pt-1">
                    हस्ताक्षर एवं सील प्रधानाचार्य
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal">Principal Seal & Signature</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
