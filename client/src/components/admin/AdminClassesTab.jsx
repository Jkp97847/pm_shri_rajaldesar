import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Plus, Pencil, Trash2, CheckCircle2, 
  AlertCircle, X, School, BookOpen, Layers, Sparkles, Filter, Search, RotateCcw
} from 'lucide-react';

export default function AdminClassesTab({ token, showMsg }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [formData, setFormData] = useState({
    class_name: '',
    level: 'उच्च माध्यमिक (Senior Secondary)',
    stream: 'कला संकाय (Arts)',
    section: 'A',
    medium: 'Hindi & English',
    subjects: '',
    description: '',
    display_order: 18,
    is_active: 1
  });
  const [submitting, setSubmitting] = useState(false);

  // Load classes from API
  const loadClasses = () => {
    setLoading(true);
    fetch('/api/admin/classes', {
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.classes) {
          setClasses(data.classes);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading admin classes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const openAddForm = () => {
    const nextOrder = classes.length > 0 ? Math.max(...classes.map(c => c.display_order || 0)) + 1 : 1;
    setFormData({
      class_name: '',
      level: 'उच्च माध्यमिक (Senior Secondary)',
      stream: 'कला संकाय (Arts)',
      section: 'A',
      medium: 'Hindi & English',
      subjects: '',
      description: '',
      display_order: nextOrder,
      is_active: 1
    });
    setEditingClassId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setFormData({
      class_name: item.class_name,
      level: item.level,
      stream: item.stream || 'General',
      section: item.section || 'A',
      medium: item.medium || 'Hindi & English',
      subjects: item.subjects || '',
      description: item.description || '',
      display_order: item.display_order || 0,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditingClassId(item.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (!formData.class_name.trim()) {
      showMsg("कृपया कक्षा का नाम दर्ज करें!", "error");
      return;
    }

    setSubmitting(true);
    const url = editingClassId ? `/api/admin/classes/${editingClassId}` : '/api/admin/classes';
    const method = editingClassId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showMsg(editingClassId ? "कक्षा विवरण सफलतापूर्वक अपडेट हो गया!" : "नई कक्षा सफलतापूर्वक जोड़ दी गई!");
        setIsFormOpen(false);
        setEditingClassId(null);
        loadClasses();
      } else {
        showMsg(data.message || "त्रुटि आई, कृपया पुनः प्रयास करें।", "error");
      }
    } catch (err) {
      console.error(err);
      showMsg("सर्वर से संपर्क नहीं हो सका।", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (id, name) => {
    if (!window.confirm(`क्या आप निश्चित रूप से कक्षा "${name}" को हटाना चाहते हैं?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/classes/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.success) {
        showMsg(`कक्षा "${name}" सफलतापूर्वक हटा दी गई!`);
        loadClasses();
      } else {
        showMsg(data.message || "हटाने में समस्या आई।", "error");
      }
    } catch (err) {
      console.error(err);
      showMsg("सर्वर त्रुटि।", "error");
    }
  };

  const handleQuickAddCommerce = async () => {
    if (!window.confirm("क्या आप कक्षा 11 एवं 12 में वाणिज्य संकाय (Commerce Stream) जोड़ना चाहते हैं?")) {
      return;
    }

    try {
      const res = await fetch('/api/admin/classes/quick-add-commerce', {
        method: 'POST',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.success) {
        showMsg(data.message);
        loadClasses();
      } else {
        showMsg(data.message || "त्रुटि आई।", "error");
      }
    } catch (err) {
      console.error(err);
      showMsg("सर्वर त्रुटि।", "error");
    }
  };

  const filteredClasses = classes.filter(c => {
    const matchesLevel = selectedLevel === 'All' || (c.level && c.level.includes(selectedLevel));
    const matchesSearch = !searchQuery.trim() || 
      c.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.stream && c.stream.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.subjects && c.subjects.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
      
      {/* Header and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-900 border border-purple-200 text-xs font-black px-3 py-1 rounded-full mb-1">
            <School className="w-3.5 h-3.5 text-purple-700" />
            <span>कक्षा, संकाय एवं विषय प्रबंधन पोर्टल</span>
          </div>
          <h3 className="text-xl font-black text-blue-950">
            कक्षावार शैक्षणिक संरचना प्रबंधन (Classes & Streams Manager)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            यहाँ से आप नर्सरी से 12वीं तक किसी भी कक्षा को जोड़ सकते हैं, संपादित कर सकते हैं या हटा सकते हैं। आवश्यकता होने पर वाणिज्य (Commerce) संकाय भी 1-क्लिक में जोड़ा जा सकता है।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleQuickAddCommerce}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow"
            title="11वीं व 12वीं में कॉमर्स संकाय जोड़ें"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>+ वाणिज्य संकाय जोड़ें (Commerce)</span>
          </button>

          <button
            onClick={openAddForm}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ नई कक्षा जोड़ें (Add Class)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p className="text-2xl font-black text-blue-950">{classes.length}</p>
          <p className="text-[11px] font-bold text-slate-500">कुल कक्षाएं (Total Classes)</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
          <p className="text-2xl font-black text-emerald-700">{classes.filter(c => c.is_active === 1).length}</p>
          <p className="text-[11px] font-bold text-emerald-800">सक्रिय कक्षाएं (Active)</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
          <p className="text-2xl font-black text-amber-700">
            {classes.filter(c => c.level && c.level.includes('उच्च माध्यमिक')).length}
          </p>
          <p className="text-[11px] font-bold text-amber-800">उच्च माध्यमिक संकाय (11-12)</p>
        </div>
        <div className="bg-pink-50 p-3 rounded-xl border border-pink-200">
          <p className="text-2xl font-black text-pink-700">
            {classes.filter(c => c.level && c.level.includes('पूर्व-प्राथमिक')).length}
          </p>
          <p className="text-[11px] font-bold text-pink-800">पूर्व-प्राथमिक (Nursery-UKG)</p>
        </div>
      </div>

      {/* Add / Edit Form Modal / Accordion */}
      {isFormOpen && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/40 border-2 border-orange-500/40 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-orange-200 pb-3">
            <h4 className="text-sm font-black text-blue-950 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span>{editingClassId ? "कक्षा विवरण संपादित करें (Edit Class Details)" : "नई कक्षा जोड़ें (Add New Class)"}</span>
            </h4>
            <button
              onClick={() => { setIsFormOpen(false); setEditingClassId(null); }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">कक्षा का नाम (Class Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: Class 11 Commerce या Nursery"
                  value={formData.class_name}
                  onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">शैक्षणिक स्तर (Level) *</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
                >
                  <option value="पूर्व-प्राथमिक (Pre-Primary)">पूर्व-प्राथमिक (Pre-Primary / बालवाटिका)</option>
                  <option value="प्राथमिक (Primary)">प्राथमिक (Primary: 1 to 5)</option>
                  <option value="उच्च प्राथमिक (Upper Primary)">उच्च प्राथमिक (Upper Primary: 6 to 8)</option>
                  <option value="माध्यमिक (Secondary)">माध्यमिक (Secondary: 9 & 10)</option>
                  <option value="उच्च माध्यमिक (Senior Secondary)">उच्च माध्यमिक (Senior Secondary: 11 & 12)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">संकाय (Stream)</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
                >
                  <option value="General">सामान्य (General)</option>
                  <option value="कला संकाय (Arts)">कला संकाय (Arts)</option>
                  <option value="विज्ञान संकाय (Science)">विज्ञान संकाय (Science)</option>
                  <option value="वाणिज्य संकाय (Commerce)">वाणिज्य संकाय (Commerce)</option>
                  <option value="कृषि संकाय (Agriculture)">कृषि संकाय (Agriculture)</option>
                  <option value="व्यावसायिक (Vocational)">व्यावसायिक (Vocational)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">अनुभाग (Section)</label>
                <input
                  type="text"
                  placeholder="उदा: A या A, B"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">माध्यम (Medium)</label>
                <input
                  type="text"
                  placeholder="उदा: Hindi & English"
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रदर्शन क्रम (Display Order #)</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="class_is_active"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="class_is_active" className="font-bold text-slate-700">
                  सक्रिय (Active on Website)
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                प्रमुख विषय (Subjects - कॉमा लगा कर दर्ज करें)
              </label>
              <input
                type="text"
                placeholder="उदा: अनिवार्य हिंदी, अनिवार्य अंग्रेजी, राजनीति विज्ञान, इतिहास, भूगोल..."
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">विवरण (Description / Key Highlights)</label>
              <textarea
                rows={2}
                placeholder="उदा: खेल-खेल में प्रारंभिक शिक्षा या NEET / JEE प्रतियोगी परीक्षा मार्गदर्शन..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-950 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? "सुरक्षित कर रहे हैं..." : editingClassId ? "अपडेट सुरक्षित करें" : "कक्षा जोड़ें"}</span>
              </button>

              <button
                type="button"
                onClick={() => { setIsFormOpen(false); setEditingClassId(null); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition"
              >
                रद्द करें
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'पूर्व-प्राथमिक', 'प्राथमिक', 'उच्च प्राथमिक', 'माध्यमिक', 'उच्च माध्यमिक'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedLevel === lvl
                  ? 'bg-blue-950 text-amber-400 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'All' ? 'सभी स्तर' : lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="कक्षा, संकाय या विषय खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-950 outline-none"
          />
        </div>
      </div>

      {/* Classes Table */}
      {loading ? (
        <div className="text-center py-10 text-slate-500 text-xs">डेटा लोड हो रहा है...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
          कोई कक्षा नहीं मिली।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">क्रम</th>
                <th className="p-3">कक्षा का नाम</th>
                <th className="p-3">शैक्षणिक स्तर</th>
                <th className="p-3">संकाय (Stream)</th>
                <th className="p-3">सेक्शन व माध्यम</th>
                <th className="p-3">प्रमुख विषय</th>
                <th className="p-3 text-center">स्थिति</th>
                <th className="p-3 text-center">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClasses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 text-center font-bold text-slate-500 font-mono">
                    #{item.display_order}
                  </td>
                  <td className="p-3 font-bold text-blue-950">
                    {item.class_name}
                  </td>
                  <td className="p-3">
                    <span className="bg-blue-50 text-blue-900 border border-blue-200 font-semibold px-2 py-0.5 rounded text-[11px]">
                      {item.level}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-amber-800">
                    {item.stream || 'सामान्य'}
                  </td>
                  <td className="p-3 text-slate-600">
                    सेक्शन {item.section || 'A'} | {item.medium || 'हिंदी/अंग्रेजी'}
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate" title={item.subjects}>
                    {item.subjects || '-'}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.is_active === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.is_active === 1 ? 'सक्रिय' : 'निष्क्रिय'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 transition"
                        title="संपादित करें (Edit)"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(item.id, item.class_name)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
