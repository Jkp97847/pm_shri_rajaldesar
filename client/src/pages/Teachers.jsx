import React, { useState, useEffect } from 'react';
import { Users, Search, Award, GraduationCap, Phone, Mail, BookOpen, ZoomIn, X, ExternalLink, Globe, KeyRound } from 'lucide-react';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTeacher, setActiveModalTeacher] = useState(null);

  const getDeptLabel = (dept) => {
    switch (dept) {
      case 'Arts': return 'कला संकाय (Arts)';
      case 'Science': return 'विज्ञान संकाय (Science)';
      case 'Administration': return 'प्रशासन (Administration)';
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
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return t.name.toLowerCase().includes(q) ||
           t.designation.toLowerCase().includes(q) ||
           (t.subject && t.subject.toLowerCase().includes(q)) ||
           (t.qualification && t.qualification.toLowerCase().includes(q)) ||
           (t.phone && t.phone.includes(q));
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

      {/* Faculty Quick Portal Access: Shala Darpan & SSO Rajasthan Direct Links */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-emerald-50 rounded-2xl p-5 sm:p-6 shadow-md border-2 border-orange-200/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping"></span>
              <span>शिक्षक त्वरित लॉगिन पोर्टल (Faculty Quick Access Links)</span>
            </span>
            <h3 className="text-base sm:text-lg font-black text-blue-950">
              शाला दर्पण (Shala Darpan) एवं राजस्थान SSO सीधे लॉगिन
            </h3>
            <p className="text-xs text-slate-600">
              शिक्षकगण दैनिक कार्य, स्टाफ कॉर्नर, ऑनलाइन उपस्थिति एवं प्रशासनिक कार्यों हेतु नीचे दिए गए लिंक से सीधे लॉगिन कर सकते हैं।
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Shala Darpan Button */}
            <a
              href="https://rajshaladarpan.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-2.5 border-2 border-amber-400 group shrink-0"
            >
              <img
                src="/shaladarpan-logo.png"
                alt="शाला दर्पण"
                className="h-8 object-contain group-hover:scale-105 transition-transform"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-semibold leading-none">राजस्थान शिक्षा विभाग</div>
                <div className="text-xs font-black text-blue-950">शाला दर्पण (Shala Darpan)</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </a>

            {/* Rajasthan SSO Button */}
            <a
              href="https://sso.rajasthan.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-2.5 border-2 border-orange-400 group shrink-0"
            >
              <img
                src="/sso-logo.jpeg"
                alt="राजस्थान SSO"
                className="h-8 w-8 rounded-full object-contain group-hover:scale-105 transition-transform"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-semibold leading-none">Government of Rajasthan</div>
                <div className="text-xs font-black text-orange-950">राजस्थान SSO लॉगिन</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Search and Total Staff Count Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Users className="w-5 h-5 text-blue-900" />
          <span className="text-sm font-bold">
            कुल कार्मिक एवं शिक्षक: <span className="text-blue-900 font-extrabold text-base">{filtered.length}</span>
          </span>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="शिक्षक का नाम, पद या विषय खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                {/* Photo container - 100% Full Uncropped Photo on Mobile & PC */}
                <div 
                  onClick={() => setActiveModalTeacher(teacher)}
                  className="h-64 sm:h-72 w-full bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 relative overflow-hidden flex items-center justify-center p-3 cursor-pointer group/photo"
                  title="पूरी फोटो देखने के लिए क्लिक करें"
                >
                  {/* Subtle blurred ambient backdrop to fill aspect ratio naturally */}
                  <img
                    src={teacher.photo || "/uploads/staff/user.jpg"}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-125 pointer-events-none"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  
                  {/* 100% Uncropped Full Photo */}
                  <img
                    src={teacher.photo || "/uploads/staff/user.jpg"}
                    alt={teacher.name}
                    className="relative z-10 max-h-full max-w-full object-contain rounded-xl drop-shadow-md transition-transform duration-300 group-hover/photo:scale-105"
                    onError={(e) => { e.currentTarget.src = "/uploads/staff/user.jpg"; }}
                  />

                  {/* Zoom hint on hover */}
                  <div className="absolute inset-0 z-20 bg-blue-950/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-blue-950/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                      <span>बड़ा देखें</span>
                    </span>
                  </div>

                  {/* Department Badge - Only show if department is Arts, Science, or Administration */}
                  {teacher.department && ['Arts', 'Science', 'Administration'].includes(teacher.department) && (
                    <span className="absolute bottom-2 left-2 z-20 bg-blue-950/90 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-0.5 rounded shadow">
                      {getDeptLabel(teacher.department)}
                    </span>
                  )}

                  {/* Tiranga Top Rim */}
                  <div className="absolute top-0 left-0 right-0 h-1 tiranga-bar z-20"></div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition">
                    {teacher.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-900">
                    {teacher.designation}{teacher.subject ? ` (${teacher.subject})` : ''}
                  </p>

                  <div className="pt-2 space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
                    <p className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{teacher.qualification || "स्नातकोत्तर, बी.एड."}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>अनुभव: {teacher.experience}</span>
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
                <span>
                  {teacher.department && ['Arts', 'Science', 'Administration'].includes(teacher.department)
                    ? getDeptLabel(teacher.department)
                    : 'पीएम श्री विद्यालय'}
                </span>
                <button
                  onClick={() => setActiveModalTeacher(teacher)}
                  className="text-orange-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>फोटो देखें</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
          <p className="text-slate-500 font-medium">कोई शिक्षक नहीं मिला।</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-blue-900 font-bold hover:underline"
          >
            सभी शिक्षक देखें
          </button>
        </div>
      )}

      {/* Photo Enlarge / Lightbox Modal */}
      {activeModalTeacher && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModalTeacher(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative border-2 border-orange-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 tiranga-bar w-full"></div>
            <button
              onClick={() => setActiveModalTeacher(null)}
              className="absolute top-3 right-3 z-30 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Full Photo - 100% Uncropped */}
            <div className="bg-slate-900 flex items-center justify-center p-4 max-h-[65vh] overflow-hidden">
              <img
                src={activeModalTeacher.photo || "/uploads/staff/user.jpg"}
                alt={activeModalTeacher.name}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-xl"
                onError={(e) => { e.currentTarget.src = "/uploads/staff/user.jpg"; }}
              />
            </div>

            {/* Modal Teacher Details */}
            <div className="p-5 space-y-3 bg-white">
              <div>
                {activeModalTeacher.department && ['Arts', 'Science', 'Administration'].includes(activeModalTeacher.department) && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    {getDeptLabel(activeModalTeacher.department)}
                  </span>
                )}
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {activeModalTeacher.name}
                </h3>
                <p className="text-sm font-bold text-blue-950">
                  {activeModalTeacher.designation}{activeModalTeacher.subject ? ` (${activeModalTeacher.subject})` : ''}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>शैक्षणिक योग्यता:</strong> {activeModalTeacher.qualification || "स्नातकोत्तर, बी.एड."}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>वर्तमान पद अनुभव:</strong> {activeModalTeacher.experience}</span>
                </p>
                {activeModalTeacher.phone && (
                  <p className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`tel:${activeModalTeacher.phone}`} className="hover:underline">
                      {activeModalTeacher.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
