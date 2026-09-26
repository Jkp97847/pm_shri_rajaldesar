import React, { useState, useEffect } from 'react';
import { Users, Search, Award, GraduationCap, Phone, Mail, BookOpen } from 'lucide-react';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = ['All', 'Administration', 'Science', 'Arts', 'ICT', 'Primary / Elementary'];

  const getDeptLabel = (dept) => {
    switch (dept) {
      case 'All': return 'सभी संकाय (All)';
      case 'Administration': return 'प्रशासन (Admin)';
      case 'Science': return 'विज्ञान संकाय';
      case 'Arts': return 'कला संकाय';
      case 'ICT': return 'कंप्यूटर / ICT';
      case 'Primary / Elementary': return 'प्राथमिक / उच्च प्राथमिक';
      default: return dept;
    }
  };

  useEffect(() => {
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTeachers(data.teachers);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = teachers.filter(t => {
    const matchesDept = selectedDept === 'All' || (t.department && t.department.toLowerCase() === selectedDept.toLowerCase());
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.qualification && t.qualification.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.phone && t.phone.includes(searchQuery));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            शिक्षक वृंद (Our Dedicated Faculty)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            हमारे समर्पित एवं अनुभवी शिक्षक
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            पीएम श्री यूनियन क्लब विद्यालय में उच्च योग्यताधारी, समर्पित एवं नवाचारी शिक्षकों की टीम है जो प्रत्येक छात्रा के सर्वांगीण विकास हेतु निरंतर प्रयासरत हैं।
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Department Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedDept === dept
                  ? 'bg-blue-950 text-amber-400 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {getDeptLabel(dept)}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="शिक्षक का नाम या विषय खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-semibold">लोड हो रहा है...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo container */}
                <div className="h-56 bg-slate-100 overflow-hidden relative">
                  <img
                    src={teacher.photo || "/uploads/staff/blank-teacher.png"}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.currentTarget.src = "/uploads/staff/blank-teacher.png"; }}
                  />
                  <span className="absolute bottom-2 left-2 bg-blue-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-0.5 rounded">
                    {teacher.department}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition">
                    {teacher.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-900">
                    {teacher.designation}
                  </p>

                  <div className="pt-2 space-y-1 text-xs text-slate-600 border-t border-slate-100">
                    <p className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{teacher.qualification || "स्नातकोत्तर, बी.एड."}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>अनुभव: {teacher.experience || "10+ वर्ष"}</span>
                    </p>
                    {teacher.phone && (
                      <p className="flex items-center gap-1.5 text-emerald-800 font-semibold pt-0.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <a href={`tel:${teacher.phone}`} className="hover:underline">{teacher.phone}</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>पीएम श्री संकाय</span>
                <span className="text-emerald-700 font-bold">सक्रिय शिक्षक</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-slate-500 font-medium">कोई शिक्षक नहीं मिला।</p>
          <button
            onClick={() => { setSelectedDept('All'); setSearchQuery(''); }}
            className="text-xs text-blue-900 font-bold hover:underline"
          >
            सभी शिक्षक देखें
          </button>
        </div>
      )}
    </div>
  );
}
