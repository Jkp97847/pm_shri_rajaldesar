import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Plus, Pencil, Trash2, Upload, Download, 
  Printer, Search, Filter, CheckCircle2, AlertCircle, X, GraduationCap, 
  FileText, Sparkles, Phone, Calendar, MapPin, Eye 
} from 'lucide-react';

export default function AdminStudentsTab({ token, showMsg }) {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for Add / Edit
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentForm, setStudentForm] = useState({
    sr_no: '',
    roll_no: '',
    name: '',
    father_name: '',
    mother_name: '',
    class_name: 'Class 10',
    section: 'A',
    gender: 'Girl',
    category: 'GEN',
    dob: '',
    phone: '',
    address: 'राजलदेसर',
    admission_date: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  // Modal states
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printClass, setPrintClass] = useState('Class 10');
  const [submitting, setSubmitting] = useState(false);

  const classesList = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 Arts', 'Class 11 Science', 'Class 11 Commerce',
    'Class 12 Arts', 'Class 12 Science', 'Class 12 Commerce'
  ];

  const categoriesList = ['GEN', 'OBC', 'SC', 'ST', 'EWS', 'MBC'];

  const loadData = () => {
    setLoading(true);
    let url = '/api/students?';
    if (selectedClass !== 'All') url += `class_name=${encodeURIComponent(selectedClass)}&`;
    if (selectedGender !== 'All') url += `gender=${encodeURIComponent(selectedGender)}&`;
    if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) setStudents(data.students);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/students/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedClass, selectedGender, selectedCategory, searchQuery]);

  // Handle Add or Edit Student
  const handleSubmitStudent = (e) => {
    e.preventDefault();
    if (!studentForm.name.trim()) {
      showMsg("कृपया विद्यार्थी का नाम दर्ज करें।", "error");
      return;
    }
    setSubmitting(true);
    const url = editingStudentId ? `/api/admin/students/${editingStudentId}` : '/api/admin/students';
    const method = editingStudentId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token
      },
      body: JSON.stringify(studentForm)
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          showMsg(editingStudentId ? "विद्यार्थी विवरण सफलतापूर्वक अपडेट हो गया!" : "नया विद्यार्थी सफलतापूर्वक जुड़ गया!");
          resetForm();
          loadData();
        } else {
          showMsg(data.message || "त्रुटि हुई", "error");
        }
      })
      .catch(() => {
        setSubmitting(false);
        showMsg("सर्वर से संपर्क करने में समस्या आई।", "error");
      });
  };

  const startEditStudent = (s) => {
    setEditingStudentId(s.id);
    setStudentForm({
      sr_no: s.sr_no || '',
      roll_no: s.roll_no || '',
      name: s.name || '',
      father_name: s.father_name || '',
      mother_name: s.mother_name || '',
      class_name: s.class_name || 'Class 10',
      section: s.section || 'A',
      gender: s.gender || 'Girl',
      category: s.category || 'GEN',
      dob: s.dob || '',
      phone: s.phone || '',
      address: s.address || 'राजलदेसर',
      admission_date: s.admission_date || '',
      status: s.status || 'Active'
    });
    window.scrollTo({ top: 350, behavior: 'smooth' });
    showMsg(`विद्यार्थी '${s.name}' का रिकॉर्ड संपादित कर रहे हैं।`, "info");
  };

  const resetForm = () => {
    setEditingStudentId(null);
    setStudentForm({
      sr_no: '',
      roll_no: '',
      name: '',
      father_name: '',
      mother_name: '',
      class_name: 'Class 10',
      section: 'A',
      gender: 'Girl',
      category: 'GEN',
      dob: '',
      phone: '',
      address: 'राजलदेसर',
      admission_date: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
  };

  const handleDeleteStudent = (id, name) => {
    if (!window.confirm(`क्या आप विद्यार्थी '${name}' का रिकॉर्ड हटाना चाहते हैं?`)) return;
    fetch(`/api/admin/students/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showMsg("विद्यार्थी रिकॉर्ड हटा दिया गया।");
          loadData();
        } else {
          showMsg(data.message || "त्रुटि हुई", "error");
        }
      });
  };

  // Export current list to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (students.length === 0) {
      showMsg("एक्सपोर्ट करने के लिए कोई विद्यार्थी डेटा नहीं है।", "error");
      return;
    }
    const headers = ["SR No", "Roll No", "Student Name", "Father Name", "Mother Name", "Class", "Section", "Gender", "Category", "DOB", "Phone", "Address", "Status"];
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
      `"${s.address || ''}"`,
      `"${s.status || 'Active'}"`
    ]);

    const csvString = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `PM_SHRI_Students_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMsg(`विद्यार्थी डेटा CSV फ़ाइल में सफलतापूर्वक डाउनलोड हुआ!`);
  };

  // Download Sample CSV Template
  const handleDownloadSampleCSV = () => {
    const headers = ["SR No", "Roll No", "Student Name", "Father Name", "Mother Name", "Class", "Section", "Gender", "Category", "DOB", "Phone", "Address"];
    const sampleRows = [
      ["SR-1051", "101", "कविता शर्मा", "सुरेश कुमार शर्मा", "मंजू देवी", "Class 10", "A", "Girl", "GEN", "2010-04-15", "9829123456", "राजलदेसर"],
      ["SR-1052", "102", "सुनील प्रजापत", "रामगोपाल प्रजापत", "शांति देवी", "Class 10", "A", "Boy", "OBC", "2010-08-20", "9414567890", "कुम्हार बास, राजलदेसर"]
    ];
    const csvString = "\uFEFF" + [headers.join(","), ...sampleRows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sample_Students_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV File or Text for Bulk Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBulkCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleProcessBulkImport = () => {
    if (!bulkCsvText.trim()) {
      showMsg("कृपया CSV डेटा दर्ज करें या फाइल चुनें।", "error");
      return;
    }

    const lines = bulkCsvText.trim().split(/\r\n|\n/);
    if (lines.length < 2) {
      showMsg("CSV फ़ाइल में कम से कम एक शीर्षक पंक्ति और एक डेटा पंक्ति होनी चाहिए।", "error");
      return;
    }

    // Parse CSV headers
    const parseCSVLine = (text) => {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    const studentsToImport = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });

      const name = row['student name'] || row['name'] || row['विद्यार्थी का नाम'] || row['naam'] || '';
      const className = row['class'] || row['class name'] || row['कक्षा'] || 'Class 10';
      
      if (name) {
        studentsToImport.push({
          sr_no: row['sr no'] || row['sr_no'] || row['sr'] || '',
          roll_no: row['roll no'] || row['roll_no'] || row['roll'] || '',
          name: name,
          father_name: row['father name'] || row["father's name"] || row['father'] || '',
          mother_name: row['mother name'] || row["mother's name"] || row['mother'] || '',
          class_name: className,
          section: row['section'] || 'A',
          gender: row['gender'] || row['लिंग'] || 'Girl',
          category: (row['category'] || row['वर्ग'] || 'GEN').toUpperCase(),
          dob: row['dob'] || row['date of birth'] || row['जन्म तिथि'] || '',
          phone: row['phone'] || row['mobile'] || row['मोबाइल'] || '',
          address: row['address'] || row['पता'] || 'राजलदेसर',
          admission_date: row['admission date'] || new Date().toISOString().split('T')[0],
          status: row['status'] || 'Active'
        });
      }
    }

    if (studentsToImport.length === 0) {
      showMsg("कोई वैध विद्यार्थी डेटा नहीं मिला। कृपया कॉलम शीर्षकों की जांच करें।", "error");
      return;
    }

    setSubmitting(true);
    fetch('/api/admin/students/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token
      },
      body: JSON.stringify({ students: studentsToImport })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          showMsg(data.message || `सफलतापूर्वक ${studentsToImport.length} विद्यार्थियों का डेटा आयात किया गया!`);
          setIsBulkModalOpen(false);
          setBulkCsvText('');
          loadData();
        } else {
          showMsg(data.message || "आयात करने में त्रुटि हुई", "error");
        }
      })
      .catch(() => {
        setSubmitting(false);
        showMsg("सर्वर से संपर्क करने में समस्या आई।", "error");
      });
  };

  const studentsForPrint = students.filter(s => printClass === 'All' || s.class_name === printClass);

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Summary Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-600" />
              <span>विद्यार्थी प्रबंधन एवं कक्षावार रजिस्टर (Student Panel)</span>
            </h3>
            <p className="text-xs text-slate-500">
              कक्षा नर्सरी से 12वीं तक सभी विद्यार्थियों का डेटा, वर्गवार व लिंगानुपात सांख्यिकी, बल्क CSV इम्पोर्ट/एक्सपोर्ट एवं प्रिंट रजिस्टर।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>बल्क CSV आयात (Import)</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV एक्सपोर्ट</span>
            </button>

            <button
              onClick={() => {
                setPrintClass(selectedClass !== 'All' ? selectedClass : 'Class 10');
                setIsPrintModalOpen(true);
              }}
              className="bg-blue-950 hover:bg-blue-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>कक्षा सूची प्रिंट निकालें</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
              <p className="text-[10px] font-bold text-blue-900 uppercase">कुल विद्यार्थी</p>
              <p className="text-xl font-black text-blue-950 mt-0.5">{stats.total}</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 text-center">
              <p className="text-[10px] font-bold text-pink-700 uppercase">बालिकाएं</p>
              <p className="text-xl font-black text-pink-700 mt-0.5">{stats.girls}</p>
            </div>
            <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-100 text-center">
              <p className="text-[10px] font-bold text-cyan-800 uppercase">बालक</p>
              <p className="text-xl font-black text-cyan-800 mt-0.5">{stats.boys}</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
              <p className="text-[10px] font-bold text-amber-800 uppercase">GEN</p>
              <p className="text-xl font-black text-amber-900 mt-0.5">{stats.categories?.GEN || 0}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
              <p className="text-[10px] font-bold text-emerald-800 uppercase">OBC</p>
              <p className="text-xl font-black text-emerald-900 mt-0.5">{stats.categories?.OBC || 0}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center">
              <p className="text-[10px] font-bold text-purple-800 uppercase">SC / ST</p>
              <p className="text-xl font-black text-purple-900 mt-0.5">{(stats.categories?.SC || 0) + (stats.categories?.ST || 0)}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center">
              <p className="text-[10px] font-bold text-orange-800 uppercase">EWS / MBC</p>
              <p className="text-xl font-black text-orange-900 mt-0.5">{(stats.categories?.EWS || 0) + (stats.categories?.MBC || 0)}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Two-Column Layout: Add/Edit Form + Students Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Add / Edit Student Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-blue-950 flex items-center gap-2">
              {editingStudentId ? <Pencil className="w-4 h-4 text-orange-600" /> : <Plus className="w-4 h-4 text-orange-600" />}
              <span>{editingStudentId ? "विद्यार्थी विवरण संपादित करें" : "नया विद्यार्थी जोड़ें (Add Student)"}</span>
            </h4>
            {editingStudentId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" /> रद्द करें
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitStudent} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">SR नंबर (Scholar No.)</label>
                <input
                  type="text"
                  placeholder="उदा: SR-1045"
                  value={studentForm.sr_no}
                  onChange={(e) => setStudentForm({ ...studentForm, sr_no: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">रोल नंबर (Roll No.)</label>
                <input
                  type="text"
                  placeholder="उदा: 1001"
                  value={studentForm.roll_no}
                  onChange={(e) => setStudentForm({ ...studentForm, roll_no: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">विद्यार्थी का नाम (Student Name) *</label>
              <input
                type="text"
                required
                placeholder="उदा: पूजा प्रजापत"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">पिता का नाम (Father Name)</label>
                <input
                  type="text"
                  placeholder="पिता का नाम"
                  value={studentForm.father_name}
                  onChange={(e) => setStudentForm({ ...studentForm, father_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">माता का नाम (Mother Name)</label>
                <input
                  type="text"
                  placeholder="माता का नाम"
                  value={studentForm.mother_name}
                  onChange={(e) => setStudentForm({ ...studentForm, mother_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">कक्षा (Class) *</label>
                <select
                  value={studentForm.class_name}
                  onChange={(e) => setStudentForm({ ...studentForm, class_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                >
                  {classesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">सेक्शन</label>
                <select
                  value={studentForm.section}
                  onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">लिंग (Gender) *</label>
                <select
                  value={studentForm.gender}
                  onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                >
                  <option value="Girl">बालिका (Girl)</option>
                  <option value="Boy">बालक (Boy)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">वर्ग (Category) *</label>
                <select
                  value={studentForm.category}
                  onChange={(e) => setStudentForm({ ...studentForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">जन्म तिथि (DOB)</label>
                <input
                  type="date"
                  value={studentForm.dob}
                  onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर (Phone)</label>
                <input
                  type="tel"
                  placeholder="10 अंकों का मोबाइल"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">निवास स्थान / पता (Address)</label>
              <input
                type="text"
                placeholder="उदा: वार्ड 12, राजलदेसर"
                value={studentForm.address}
                onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg transition shadow flex items-center justify-center gap-2"
              >
                {editingStudentId ? <Pencil className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
                <span>{submitting ? "सहेजा जा रहा है..." : (editingStudentId ? "बदलाव सुरक्षित करें (Update)" : "विद्यार्थी जोड़ें")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Students Table with Class Filters & Search */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-base font-bold text-blue-950">
                विद्यार्थी सूची ({students.length})
              </h4>
              <p className="text-[11px] text-slate-500">कक्षा अनुसार छांटे अथवा खोजें</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 focus:outline-none"
              >
                <option value="All">सभी कक्षाएं (All)</option>
                {classesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 focus:outline-none"
              >
                <option value="All">सभी लिंग</option>
                <option value="Girl">बालिकाएं</option>
                <option value="Boy">बालक</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 focus:outline-none"
              >
                <option value="All">सभी वर्ग</option>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="नाम, पिता का नाम, रोल नंबर, SR नंबर से खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>

          {/* Table Container */}
          <div className="max-h-[550px] overflow-y-auto border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 sticky top-0 font-bold border-b border-slate-200 z-10">
                <tr>
                  <th className="p-2.5 text-center">क्र.</th>
                  <th className="p-2.5">रोल नं / SR</th>
                  <th className="p-2.5">विद्यार्थी का नाम</th>
                  <th className="p-2.5">कक्षा</th>
                  <th className="p-2.5">पिता का नाम</th>
                  <th className="p-2.5">लिंग / वर्ग</th>
                  <th className="p-2.5 text-center">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-blue-950 font-mono">{s.roll_no || '-'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SR: {s.sr_no || '-'}</div>
                    </td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      {s.phone && <div className="text-[10px] text-slate-400 font-mono">{s.phone}</div>}
                    </td>
                    <td className="p-2.5">
                      <span className="inline-block bg-blue-100 text-blue-950 px-2 py-0.5 rounded text-[10px] font-bold">
                        {s.class_name}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600">{s.father_name || '-'}</td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.gender === 'Girl' || s.gender === 'बालिका' ? 'bg-pink-100 text-pink-700' : 'bg-cyan-100 text-cyan-800'}`}>
                          {s.gender === 'Girl' || s.gender === 'बालिका' ? 'बालिका' : 'बालक'}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                          {s.category || 'GEN'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEditStudent(s)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit Student"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete Student"
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
        </div>

      </div>

      {/* 3. Bulk CSV Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">विद्यार्थी डेटा बल्क आयात (Bulk CSV Import)</h3>
                  <p className="text-xs text-slate-500">Excel अथवा CSV फाइल से एक साथ सैकड़ों विद्यार्थियों का रिकॉर्ड अपलोड करें</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                <p className="font-bold text-emerald-900 flex items-center justify-between">
                  <span>मानक CSV प्रारूप (Columns Required):</span>
                  <button
                    onClick={handleDownloadSampleCSV}
                    className="text-xs text-blue-900 font-bold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>नमूना CSV डाउनलोड करें</span>
                  </button>
                </p>
                <p className="text-[11px] text-emerald-800 font-mono">
                  SR No, Roll No, Student Name, Father Name, Mother Name, Class, Section, Gender, Category, DOB, Phone, Address
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CSV फ़ाइल चुनें (.csv):</label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">-- या यहाँ CSV टेक्स्ट पेस्ट करें: --</label>
                <textarea
                  rows={8}
                  placeholder={`SR No,Roll No,Student Name,Father Name,Mother Name,Class,Section,Gender,Category,DOB,Phone,Address\nSR-1051,101,कविता शर्मा,सुरेश कुमार शर्मा,मंजू देवी,Class 10,A,Girl,GEN,2010-04-15,9829123456,राजलदेसर`}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleProcessBulkImport}
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>{submitting ? "आयात किया जा रहा है..." : "डेटा आयात करें (Import Now)"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Class-wise Printable Register Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-4xl w-full space-y-4 my-8 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-950" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">कक्षा रोल सूची एवं उपस्थिति पत्रक</h3>
                  <p className="text-xs text-slate-500">विद्यालय के आधिकारिक लेटरहेड के साथ प्रिंट निकालें</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={printClass}
                  onChange={(e) => setPrintClass(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 focus:outline-none"
                >
                  <option value="All">समस्त कक्षाएं</option>
                  {classesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  onClick={() => window.print()}
                  className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिंट करें</span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable View */}
            <div id="printable-class-register" className="overflow-y-auto flex-1 p-6 border-2 border-slate-300 rounded-xl space-y-6 bg-white text-slate-900">
              <div className="text-center border-b-2 border-blue-950 pb-4 space-y-1">
                <div className="text-[11px] font-black text-orange-600 uppercase tracking-widest">
                  🇮🇳 भारत सरकार — पीएम श्री विद्यालय योजना (PM SHRI SCHOOL) 🇮🇳
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-blue-950">
                  पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर
                </h2>
                <p className="text-xs text-slate-600 font-semibold uppercase">
                  PM SHRI UNION CLUB GOVT GIRLS SENIOR SECONDARY SCHOOL, RAJALDESAR (CHURU)
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 pt-1">
                  <span>UDISE: <strong>08040700105</strong></span>
                  <span>|</span>
                  <span>ब्लॉक: <strong>रतनगढ़</strong>, जिला: <strong>चूरू</strong></span>
                  <span>|</span>
                  <span>सत्र: <strong>2025-2026</strong></span>
                </div>
                <div className="inline-block bg-blue-950 text-white text-xs font-bold px-4 py-1 rounded-full mt-2">
                  कक्षा सूची: {printClass === 'All' ? 'समस्त कक्षाएं' : printClass} (कुल: {studentsForPrint.length})
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                  <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="p-2 border border-slate-300 text-center w-10">क्र.</th>
                      <th className="p-2 border border-slate-300 text-center">SR नं.</th>
                      <th className="p-2 border border-slate-300 text-center">रोल नं.</th>
                      <th className="p-2 border border-slate-300">विद्यार्थी का नाम</th>
                      <th className="p-2 border border-slate-300">पिता का नाम</th>
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
