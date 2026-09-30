import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Users, UserCheck, Plus, Pencil, Trash2, Upload, Download, 
  Printer, Search, Filter, CheckCircle2, AlertCircle, X, GraduationCap, 
  FileText, Sparkles, Phone, Calendar, MapPin, Eye, FileSpreadsheet 
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

    fetch(url, {
      headers: token ? { 'x-admin-token': token } : {}
    })
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

  const studentHeaders = [
    "SRNO",
    "Rollno",
    "Student Name",
    "Father/Guardian Name",
    "Mother Name",
    "Cast Category",
    "Gender",
    "DOB",
    "Mobile No",
    "Class",
    "Section"
  ];

  // Export current list to Excel (.xlsx) with the exact 11 columns
  const handleExportExcel = () => {
    if (students.length === 0) {
      showMsg("एक्सपोर्ट करने के लिए कोई विद्यार्थी डेटा नहीं है।", "error");
      return;
    }
    const wsData = [
      studentHeaders,
      ...students.map(s => [
        s.sr_no || '',
        s.roll_no || '',
        s.name || '',
        s.father_name || '',
        s.mother_name || '',
        s.category || 'GEN',
        s.gender || 'Girl',
        s.dob || '',
        s.phone || '',
        s.class_name || '',
        s.section || 'A'
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const colWidths = studentHeaders.map((h, i) => {
      let maxLen = h.length;
      wsData.forEach(row => {
        const val = row[i] ? String(row[i]) : '';
        if (val.length > maxLen) maxLen = val.length;
      });
      return { wch: Math.min(maxLen + 4, 32) };
    });
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `PM_SHRI_Students_${selectedClass}_${new Date().toISOString().split('T')[0]}.xlsx`);
    showMsg(`विद्यार्थी डेटा Excel (.xlsx) फ़ाइल में सफलतापूर्वक डाउनलोड हुआ!`);
  };

  // Export current list to CSV with UTF-8 BOM matching the exact 11 columns
  const handleExportCSV = () => {
    if (students.length === 0) {
      showMsg("एक्सपोर्ट करने के लिए कोई विद्यार्थी डेटा नहीं है।", "error");
      return;
    }
    const rows = students.map(s => [
      `"${(s.sr_no || '').replace(/"/g, '""')}"`,
      `"${(s.roll_no || '').replace(/"/g, '""')}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.father_name || '').replace(/"/g, '""')}"`,
      `"${(s.mother_name || '').replace(/"/g, '""')}"`,
      `"${(s.category || '').replace(/"/g, '""')}"`,
      `"${(s.gender || '').replace(/"/g, '""')}"`,
      `"${(s.dob || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.class_name || '').replace(/"/g, '""')}"`,
      `"${(s.section || 'A').replace(/"/g, '""')}"`
    ]);

    const csvString = "\uFEFF" + [studentHeaders.join(","), ...rows.map(r => r.join(","))].join("\n");
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

  // Download Sample Excel (.xlsx) Template matching the exact 11 columns
  const handleDownloadSampleExcel = () => {
    const sampleRows = [
      ["5569", "120192329", "Aaina Saini", "Shankar Lal Saini", "Lichhma Devi", "OBC", "Girl", "2011-12-03", "9772325355", "Class 10", "A"],
      ["6145", "124209424", "Aarti", "Mahendra Maru", "Punam Devi", "OBC", "Girl", "2011-12-08", "7023240704", "Class 10", "A"],
      ["5890", "120192330", "कविता शर्मा", "सुरेश कुमार शर्मा", "मंजू देवी", "GEN", "Girl", "2010-04-15", "9829123456", "Class 10", "B"],
      ["6012", "120192331", "सुनील प्रजापत", "रामगोपाल प्रजापत", "शांति देवी", "OBC", "Boy", "2010-08-20", "9414567890", "Class 10", "B"]
    ];
    const ws = XLSX.utils.aoa_to_sheet([studentHeaders, ...sampleRows]);
    ws['!cols'] = studentHeaders.map(h => ({ wch: h.length + 6 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "PM_SHRI_Students_Sample_11_Columns.xlsx");
  };

  // Download Sample CSV Template matching the exact 11 columns
  const handleDownloadSampleCSV = () => {
    const sampleRows = [
      ["5569", "120192329", "Aaina Saini", "Shankar Lal Saini", "Lichhma Devi", "OBC", "Girl", "2011-12-03", "9772325355", "Class 10", "A"],
      ["6145", "124209424", "Aarti", "Mahendra Maru", "Punam Devi", "OBC", "Girl", "2011-12-08", "7023240704", "Class 10", "A"],
      ["5890", "120192330", "कविता शर्मा", "सुरेश कुमार शर्मा", "मंजू देवी", "GEN", "Girl", "2010-04-15", "9829123456", "Class 10", "B"],
      ["6012", "120192331", "सुनील प्रजापत", "रामगोपाल प्रजापत", "शांति देवी", "OBC", "Boy", "2010-08-20", "9414567890", "Class 10", "B"]
    ];
    const csvString = "\uFEFF" + [studentHeaders.join(","), ...sampleRows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "PM_SHRI_Students_Sample_11_Columns.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse Excel (.xlsx, .xls) or CSV File for Bulk Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const csvText = rows.map(r => (r || []).map(cell => {
            const val = cell !== undefined && cell !== null ? String(cell) : '';
            return val.includes(',') || val.includes('"') || val.includes('\n')
              ? `"${val.replace(/"/g, '""')}"`
              : val;
          }).join(',')).join('\n');
          setBulkCsvText(csvText);
          showMsg(`Excel फ़ाइल '${file.name}' सफलतापूर्वक लोड हुई (${rows.length} पंक्तियां)!`, 'info');
        } catch (err) {
          showMsg("Excel फ़ाइल पढ़ने में समस्या: " + err.message, "error");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBulkCsvText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleProcessBulkImport = () => {
    if (!bulkCsvText.trim()) {
      showMsg("कृपया CSV डेटा दर्ज करें या फाइल चुनें।", "error");
      return;
    }

    const lines = bulkCsvText.trim().split(/\r\n|\n/).filter(l => l.trim().length > 0);
    if (lines.length < 1) {
      showMsg("CSV फ़ाइल में कोई डेटा पंक्ति नहीं मिली।", "error");
      return;
    }

    // Helper to format DOB: converts 5-digit Excel serial dates, DD-MM-YYYY, or standard strings
    const formatDOB = (val) => {
      if (!val) return '';
      val = String(val).trim();
      if (/^\d{5}$/.test(val)) {
        const days = parseInt(val, 10);
        const d = new Date((days - 25569) * 86400 * 1000);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      }
      const dmy = val.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
      if (dmy) {
        return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
      }
      return val;
    };

    // Delimiter aware line parser (handles commas and tabs, quoted fields)
    const parseDelimitedLine = (line, delimiter) => {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === delimiter && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim());
      return result;
    };

    const firstLine = lines[0];
    const delimiter = firstLine.includes('\t') ? '\t' : ',';
    const firstRowValues = parseDelimitedLine(firstLine, delimiter).map(v => v.replace(/^["'\s]+|["'\s]+$/g, ''));
    
    // Check if line 0 is a header row
    const normalizedFirstRow = firstRowValues.map(h => h.toLowerCase().replace(/[\s_\/-]+/g, ' '));
    const isHeaderRow = normalizedFirstRow.some(h => 
      h.includes('class') || h.includes('student') || h.includes('name') || 
      h.includes('srno') || h.includes('sr no') || h.includes('roll') || 
      h.includes('father') || h.includes('category') || h.includes('gender') || 
      h.includes('dob') || h.includes('mobile') || h.includes('नाम') || h.includes('कक्षा')
    );

    let dataLines = lines;
    let headers = [];

    if (isHeaderRow) {
      headers = normalizedFirstRow;
      dataLines = lines.slice(1);
    }

    const studentsToImport = [];

    for (let i = 0; i < dataLines.length; i++) {
      if (!dataLines[i].trim()) continue;
      const values = parseDelimitedLine(dataLines[i], delimiter).map(v => v.replace(/^"|"$/g, '').trim());
      
      let className = '';
      let section = 'A';
      let srNo = '';
      let rollNo = '';
      let name = '';
      let fatherName = '';
      let motherName = '';
      let category = 'GEN';
      let gender = 'Girl';
      let dob = '';
      let phone = '';

      if (headers.length > 0) {
        // Map by header names
        const getVal = (possibleKeys) => {
          for (const key of possibleKeys) {
            const idx = headers.findIndex(h => h === key || h.includes(key));
            if (idx !== -1 && values[idx] !== undefined && values[idx] !== '') {
              return values[idx];
            }
          }
          return '';
        };

        className = getVal(['class', 'class name', 'कक्षा', 'standard']);
        section = getVal(['section', 'सेक्शन', 'sec']) || 'A';
        srNo = getVal(['srno', 'sr no', 'sr_no', 'sr', 'scholar no', 'एसआर नंबर', 'एसआर']);
        rollNo = getVal(['rollno', 'roll no', 'roll_no', 'roll', 'student unique nic id', 'nic id', 'unique id', 'रोल नंबर', 'रोल नं']);
        name = getVal(['student name', 'name', 'विद्यार्थी का नाम', 'विद्यार्थी नाम', 'छात्र नाम', 'naam']);
        fatherName = getVal(['father guardian name', 'father/guardian name', 'father name', 'father\'s name', 'guardian name', 'पिता का नाम', 'पिता/अभिभावक का नाम', 'पिता']);
        motherName = getVal(['mother name', 'mother\'s name', 'mother', 'माता का नाम', 'माता']);
        category = getVal(['cast category', 'caste category', 'category', 'cast', 'caste', 'वर्ग', 'जाति वर्ग', 'जाति']) || 'GEN';
        gender = getVal(['gender', 'sex', 'लिंग']) || 'Girl';
        dob = formatDOB(getVal(['dob', 'date of birth', 'birth date', 'जन्म तिथि', 'जन्मतिथि']));
        phone = getVal(['mobile no', 'mobile number', 'mobile', 'phone', 'phone no', 'phone number', 'contact', 'संपर्क', 'मोबाइल', 'मोबाइल नं']);
      } else {
        // Positional fallback to the exact 11 columns:
        // 0: SRNO, 1: Rollno, 2: Student Name, 3: Father/Guardian Name, 4: Mother Name, 5: Cast Category, 6: Gender, 7: DOB, 8: Mobile No, 9: Class, 10: Section
        srNo = values[0] || '';
        rollNo = values[1] || '';
        name = values[2] || '';
        fatherName = values[3] || '';
        motherName = values[4] || '';
        category = values[5] || 'GEN';
        gender = values[6] || 'Girl';
        dob = formatDOB(values[7] || '');
        phone = values[8] || '';
        className = values[9] || '';
        section = values[10] || 'A';
      }

      // Default class fallback
      if (!className) {
        className = selectedClass !== 'All' ? selectedClass : 'Class 10';
      }

      // Normalize gender
      const gLower = (gender || '').toLowerCase();
      if (gLower.includes('boy') || gLower === 'बालक' || gLower === 'm' || gLower === 'male') {
        gender = 'Boy';
      } else {
        gender = 'Girl';
      }

      // Normalize category
      category = (category || 'GEN').toUpperCase();

      if (name) {
        studentsToImport.push({
          sr_no: srNo,
          roll_no: rollNo,
          name: name,
          father_name: fatherName,
          mother_name: motherName,
          class_name: className,
          section: section || 'A',
          gender: gender,
          category: category,
          dob: dob,
          phone: phone,
          status: 'Active'
        });
      }
    }

    if (studentsToImport.length === 0) {
      showMsg("कोई वैध विद्यार्थी डेटा नहीं मिला। कृपया सुनिश्चित करें कि 'Student Name' अथवा डेटा पंक्ति सही है।", "error");
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
              <span>बल्क आयात (Excel / CSV)</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel एक्सपोर्ट (.xlsx)</span>
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
                  <h3 className="font-bold text-slate-900 text-base">विद्यार्थी डेटा बल्क आयात (Bulk Excel / CSV Import)</h3>
                  <p className="text-xs text-slate-500">Excel (.xlsx) अथवा CSV फाइल से एक साथ सैकड़ों विद्यार्थियों का रिकॉर्ड अपलोड करें</p>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-emerald-950">मानक 11-कॉलम प्रारूप (Required 11 Columns):</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadSampleExcel}
                      className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1 shrink-0 bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-sm"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                      <span>नमूना Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={handleDownloadSampleCSV}
                      className="text-xs text-blue-900 font-bold hover:underline flex items-center gap-1 shrink-0 bg-white px-2.5 py-1 rounded-md border border-slate-300 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-800" />
                      <span>नमूना CSV</span>
                    </button>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-300 font-mono text-[11px] text-emerald-900 overflow-x-auto whitespace-nowrap select-all font-bold">
                  SRNO, Rollno, Student Name, Father/Guardian Name, Mother Name, Cast Category, Gender, DOB, Mobile No, Class, Section
                </div>
                <p className="text-[11px] text-emerald-800">
                  💡 आप <strong>शाला दर्पण (Shala Darpan)</strong> अथवा Excel (.xlsx) से सीधे फ़ाइल अपलोड कर सकते हैं या डेटा कॉपी करके नीचे पेस्ट कर सकते हैं। यह स्वतः 5-अंकों वाली जन्म तिथि (Serial Date) व सभी फ़ील्ड्स को पहचान लेगा।
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Excel अथवा CSV फ़ाइल चुनें (.xlsx, .xls, .csv):</label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">-- या यहाँ 11-कॉलम Excel / CSV डेटा पेस्ट करें: --</label>
                <textarea
                  rows={8}
                  placeholder={`SRNO,Rollno,Student Name,Father/Guardian Name,Mother Name,Cast Category,Gender,DOB,Mobile No,Class,Section\n5569,120192329,Aaina Saini,Shankar Lal Saini,Lichhma Devi,OBC,Girl,2011-12-03,9772325355,Class 10,A\n6145,124209424,Aarti,Mahendra Maru,Punam Devi,OBC,Girl,2011-12-08,7023240704,Class 10,A`}
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
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-5xl w-full space-y-4 my-8 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-950" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">कक्षा रोल सूची एवं उपस्थिति पत्रक</h3>
                  <p className="text-xs text-slate-500">विद्यालय के आधिकारिक लेटरहेड के साथ 11-कॉलम रजिस्टर प्रिंट निकालें</p>
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
                      <th className="p-2 border border-slate-300 text-center">कक्षा</th>
                      <th className="p-2 border border-slate-300 text-center">सेक्शन</th>
                      <th className="p-2 border border-slate-300 text-center">SR नं.</th>
                      <th className="p-2 border border-slate-300 text-center">रोल नं.</th>
                      <th className="p-2 border border-slate-300">विद्यार्थी का नाम</th>
                      <th className="p-2 border border-slate-300">पिता/अभिभावक का नाम</th>
                      <th className="p-2 border border-slate-300">माता का नाम</th>
                      <th className="p-2 border border-slate-300 text-center">जाति वर्ग</th>
                      <th className="p-2 border border-slate-300 text-center">लिंग</th>
                      <th className="p-2 border border-slate-300 text-center">जन्म तिथि</th>
                      <th className="p-2 border border-slate-300">मोबाइल नं.</th>
                      <th className="p-2 border border-slate-300 text-center">हस्ताक्षर / उपस्थिति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentsForPrint.map((s, i) => (
                      <tr key={s.id || i} className="hover:bg-slate-50">
                        <td className="p-2 border border-slate-300 text-center font-mono">{i + 1}</td>
                        <td className="p-2 border border-slate-300 text-center font-semibold">{s.class_name}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold">{s.section || 'A'}</td>
                        <td className="p-2 border border-slate-300 text-center font-mono">{s.sr_no || '-'}</td>
                        <td className="p-2 border border-slate-300 text-center font-mono font-bold">{s.roll_no || '-'}</td>
                        <td className="p-2 border border-slate-300 font-bold">{s.name}</td>
                        <td className="p-2 border border-slate-300">{s.father_name || '-'}</td>
                        <td className="p-2 border border-slate-300">{s.mother_name || '-'}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold">{s.category || 'GEN'}</td>
                        <td className="p-2 border border-slate-300 text-center">{s.gender === 'Girl' || s.gender === 'बालिका' ? 'बालिका' : 'बालक'}</td>
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
