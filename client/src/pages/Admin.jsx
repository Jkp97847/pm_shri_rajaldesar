import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Bell, Users, Image as ImageIcon, Award, 
  Plus, Trash2, Upload, CheckCircle2, AlertCircle, RefreshCw, Eye,
  Building, Settings, Save, MapPin, Calendar, Video, Trophy, BookOpen, Clock, FileText,
  MessageSquare, Mail, PhoneCall, CheckCheck, MessageCircle, Pencil, X,
  KeyRound, HelpCircle, GraduationCap
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export default function Admin() {
  const { settings, refreshSettings } = useSchool();
  const [token, setToken] = useState(() => {
    try { localStorage.removeItem('pm_admin_token'); } catch (e) {}
    return sessionStorage.getItem('pm_admin_token') || '';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('school_details');

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', new_pwd: '', confirm: '' });
  const [pwdStatus, setPwdStatus] = useState({ error: '', success: '' });

  // Forgot password recovery modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryForm, setRecoveryForm] = useState({ udise_code: '', recovery_pin: '', new_password: '', confirm_password: '' });
  const [recoveryStatus, setRecoveryStatus] = useState({ error: '', success: '' });

  // School profile edit state
  const [schoolForm, setSchoolForm] = useState({
    school_name_hi: '',
    school_name: '',
    udise_code: '',
    school_address: '',
    city_tehsil: 'राजलदेसर (रतनगढ़)',
    district: 'चूरू (राजस्थान)',
    pin_code: '',
    contact_phone: '',
    contact_phone_alt: '',
    contact_email: '',
    principal_name: '',
    school_timing: '',
    office_timing: ''
  });

  useEffect(() => {
    if (settings) {
      setSchoolForm({
        school_name_hi: settings.school_name_hi || '',
        school_name: settings.school_name || '',
        udise_code: settings.udise_code || '',
        school_address: settings.school_address || '',
        city_tehsil: settings.city_tehsil || 'राजलदेसर (रतनगढ़)',
        district: settings.district || 'चूरू (राजस्थान)',
        pin_code: settings.pin_code || '',
        contact_phone: settings.contact_phone || '',
        contact_phone_alt: settings.contact_phone_alt || '',
        contact_email: settings.contact_email || '',
        principal_name: settings.principal_name || '',
        school_timing: settings.school_timing || '',
        office_timing: settings.office_timing || ''
      });
    }
  }, [settings]);

  // Data lists
  const [notices, setNotices] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [results, setResults] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [sports, setSports] = useState([]);
  const [library, setLibrary] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [inquiryFilter, setInquiryFilter] = useState('All');

  // Edit tracking states
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingResultId, setEditingResultId] = useState(null);
  const [editingTimetableId, setEditingTimetableId] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingSportId, setEditingSportId] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);

  // Form states
  const [newNotice, setNewNotice] = useState({ title: '', content: '', date: new Date().toISOString().split('T')[0], is_flash: false, category: 'general' });
  
  const [newTeacher, setNewTeacher] = useState({ name: '', designation: '', department: 'Science', qualification: '', experience: '', phone: '', photo_url: '' });
  const [teacherFile, setTeacherFile] = useState(null);

  const [newGallery, setNewGallery] = useState({ title: '', category: 'PM SHRI Campus', description: '', image_url: '', date: new Date().toISOString().split('T')[0], media_type: 'image', video_url: '' });
  const [galleryFile, setGalleryFile] = useState(null);

  const [newTimetable, setNewTimetable] = useState({ title: '', class_name: 'All Classes', type: 'Exam', date: new Date().toISOString().split('T')[0], schedule_details: '' });
  const [timetableFile, setTimetableFile] = useState(null);

  const [newSport, setNewSport] = useState({ title: '', sport_name: 'Kho-Kho', level: 'जिला स्तर', date: new Date().toISOString().split('T')[0], description: '', image_url: '' });
  const [sportFile, setSportFile] = useState(null);

  const [newBook, setNewBook] = useState({ title: '', author: '', category: 'NCERT', total_copies: 1, digital_link: '', description: '' });

  const [newResult, setNewResult] = useState({
    roll_no: '',
    student_name: '',
    father_name: '',
    class_name: '12th Science',
    percentage: '',
    grade: 'A+',
    status: 'PASS',
    sub1_name: 'Subject 1', sub1_marks: '95/100',
    sub2_name: 'Subject 2', sub2_marks: '92/100',
    sub3_name: 'Subject 3', sub3_marks: '94/100'
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);

  // Load all data when authenticated
  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const loadAllData = () => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(d => { if (d.success) setNotices(d.notices); });

    fetch('/api/teachers')
      .then(res => res.json())
      .then(d => { if (d.success) setTeachers(d.teachers); });

    fetch('/api/gallery')
      .then(res => res.json())
      .then(d => { if (d.success) setGallery(d.gallery); });

    fetch('/api/results')
      .then(res => res.json())
      .then(d => { if (d.success) setResults(d.results); });

    fetch('/api/timetables')
      .then(res => res.json())
      .then(d => { if (d.success) setTimetables(d.timetables); });

    fetch('/api/sports')
      .then(res => res.json())
      .then(d => { if (d.success) setSports(d.sports); });

    fetch('/api/library')
      .then(res => res.json())
      .then(d => { if (d.success) setLibrary(d.books); });

    if (token) {
      fetch('/api/admin/inquiries', {
        headers: { 'x-admin-token': token }
      })
        .then(res => res.json())
        .then(d => { if (d.success) setInquiries(d.inquiries); });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          sessionStorage.setItem('pm_admin_token', data.token);
          try { localStorage.removeItem('pm_admin_token'); } catch (e) {}
          setToken(data.token);
          setPassword('');
        } else {
          setLoginError(data.message || 'पासवर्ड गलत है');
        }
      })
      .catch(err => setLoginError('लॉगिन करने में समस्या आई।'));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('pm_admin_token');
    try { localStorage.removeItem('pm_admin_token'); } catch (e) {}
    setToken('');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdStatus({ error: '', success: '' });
    if (pwdForm.new_pwd !== pwdForm.confirm) {
      setPwdStatus({ error: 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं।', success: '' });
      return;
    }
    if (pwdForm.new_pwd.length < 6) {
      setPwdStatus({ error: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।', success: '' });
      return;
    }
    fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token
      },
      body: JSON.stringify({
        current_password: pwdForm.current,
        new_password: pwdForm.new_pwd
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPwdStatus({ error: '', success: data.message || 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' });
          setTimeout(() => {
            setIsPasswordModalOpen(false);
            setPwdForm({ current: '', new_pwd: '', confirm: '' });
            setPwdStatus({ error: '', success: '' });
            showMsg("पासवर्ड सफलतापूर्वक बदल दिया गया है!");
          }, 1500);
        } else {
          setPwdStatus({ error: data.message || 'त्रुटि हुई।', success: '' });
        }
      })
      .catch(err => setPwdStatus({ error: 'सर्वर से संपर्क करने में त्रुटि हुई।', success: '' }));
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    setRecoveryStatus({ error: '', success: '' });
    if (recoveryForm.new_password !== recoveryForm.confirm_password) {
      setRecoveryStatus({ error: 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते हैं।', success: '' });
      return;
    }
    if (recoveryForm.new_password.length < 6) {
      setRecoveryStatus({ error: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।', success: '' });
      return;
    }
    fetch('/api/admin/recover-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        udise_code: recoveryForm.udise_code,
        recovery_pin: recoveryForm.recovery_pin,
        new_password: recoveryForm.new_password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecoveryStatus({ error: '', success: data.message });
          setPassword(recoveryForm.new_password);
          setTimeout(() => {
            setIsForgotModalOpen(false);
            setRecoveryForm({ udise_code: '', recovery_pin: '', new_password: '', confirm_password: '' });
            setRecoveryStatus({ error: '', success: '' });
          }, 2000);
        } else {
          setRecoveryStatus({ error: data.message || 'सत्यापन विफल रहा।', success: '' });
        }
      })
      .catch(err => setRecoveryStatus({ error: 'सर्वर से संपर्क करने में त्रुटि हुई।', success: '' }));
  };

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // 0. SAVE SCHOOL PROFILE / SETTINGS
  const handleSaveSchoolDetails = (e) => {
    e.preventDefault();
    setUploading(true);
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-token': token 
      },
      body: JSON.stringify(schoolForm)
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          showMsg("विद्यालय की जानकारी (UDISE, पता, फोन आदि) सफलतापूर्वक अपडेट हो गई!");
          refreshSettings();
        } else {
          showMsg(data.error || "अपडेट में त्रुटि हुई", "error");
        }
      })
      .catch(err => {
        setUploading(false);
        showMsg("सर्वर से संपर्क करने में त्रुटि हुई।", "error");
      });
  };

  // 1. ADD / UPDATE NOTICE
  const handleAddNotice = (e) => {
    e.preventDefault();
    const url = editingNoticeId ? `/api/admin/notices/${editingNoticeId}` : '/api/admin/notices';
    const method = editingNoticeId ? 'PUT' : 'POST';
    fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-token': token 
      },
      body: JSON.stringify(newNotice)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showMsg(editingNoticeId ? "सूचना सफलतापूर्वक अपडेट हो गई!" : "नई सूचना सफलतापूर्वक जोड़ दी गई!");
          setNewNotice({ title: '', content: '', date: new Date().toISOString().split('T')[0], is_flash: false, category: 'general' });
          setEditingNoticeId(null);
          loadAllData();
        } else {
          showMsg(data.error || "त्रुटि हुई", "error");
        }
      });
  };

  const startEditNotice = (n) => {
    setEditingNoticeId(n.id);
    setNewNotice({
      title: n.title,
      content: n.content || '',
      date: n.date,
      is_flash: Boolean(n.is_flash),
      category: n.category || 'general'
    });
    showMsg(`सूचना #${n.id} संपादित कर रहे हैं।`, "info");
  };

  const cancelEditNotice = () => {
    setEditingNoticeId(null);
    setNewNotice({ title: '', content: '', date: new Date().toISOString().split('T')[0], is_flash: false, category: 'general' });
  };

  const handleDeleteNotice = (id) => {
    if (!window.confirm("क्या आप इस सूचना को हटाना चाहते हैं?")) return;
    fetch(`/api/admin/notices/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("सूचना हटा दी गई।");
        loadAllData();
      });
  };

  // 2. ADD / UPDATE TEACHER WITH PHOTO UPLOAD
  const handleAddTeacher = (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('name', newTeacher.name);
    formData.append('designation', newTeacher.designation);
    formData.append('department', newTeacher.department);
    formData.append('qualification', newTeacher.qualification);
    formData.append('experience', newTeacher.experience);
    formData.append('phone', newTeacher.phone);
    formData.append('photo_url', newTeacher.photo_url);
    if (teacherFile) {
      formData.append('photo_file', teacherFile);
    }

    const url = editingTeacherId ? `/api/admin/teachers/${editingTeacherId}` : '/api/admin/teachers';
    const method = editingTeacherId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'x-admin-token': token },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          showMsg(editingTeacherId ? "शिक्षक प्रोफाइल सफलतापूर्वक अपडेट हो गई!" : "शिक्षक प्रोफाइल फोटो सहित सफलतापूर्वक जुड़ गई!");
          setNewTeacher({ name: '', designation: '', department: 'Science', qualification: '', experience: '', phone: '', photo_url: '' });
          setTeacherFile(null);
          setEditingTeacherId(null);
          loadAllData();
        } else {
          showMsg(data.error || "त्रुटि हुई", "error");
        }
      })
      .catch(err => {
        setUploading(false);
        showMsg("अपलोड में समस्या आई।", "error");
      });
  };

  const startEditTeacher = (t) => {
    setEditingTeacherId(t.id);
    setNewTeacher({
      name: t.name,
      designation: t.designation,
      department: t.department,
      qualification: t.qualification || '',
      experience: t.experience || '',
      phone: t.phone || '',
      photo_url: t.photo || ''
    });
    setTeacherFile(null);
    showMsg(`शिक्षक '${t.name}' की प्रोफाइल संपादित कर रहे हैं।`, "info");
  };

  const cancelEditTeacher = () => {
    setEditingTeacherId(null);
    setNewTeacher({ name: '', designation: '', department: 'Science', qualification: '', experience: '', phone: '', photo_url: '' });
    setTeacherFile(null);
  };

  const handleDeleteTeacher = (id) => {
    if (!window.confirm("क्या आप इस शिक्षक को हटाना चाहते हैं?")) return;
    fetch(`/api/admin/teachers/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("शिक्षक प्रोफाइल हटा दी गई।");
        loadAllData();
      });
  };

  // 3. ADD / UPDATE GALLERY MEDIA (PHOTO OR VIDEO)
  const handleAddGallery = (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('title', newGallery.title);
    formData.append('category', newGallery.category);
    formData.append('description', newGallery.description);
    formData.append('date', newGallery.date);
    formData.append('image_url', newGallery.image_url);
    formData.append('media_type', newGallery.media_type);
    formData.append('video_url', newGallery.video_url);
    if (galleryFile) {
      formData.append('image_file', galleryFile);
    }

    const url = editingGalleryId ? `/api/admin/gallery/${editingGalleryId}` : '/api/admin/gallery';
    const method = editingGalleryId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'x-admin-token': token },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          showMsg(editingGalleryId ? "गैलरी विवरण सफलतापूर्वक अपडेट हो गया!" : (data.message || "गैलरी में सफलतापूर्वक जोड़ दिया गया!"));
          setNewGallery({ title: '', category: 'PM SHRI Campus', description: '', image_url: '', date: new Date().toISOString().split('T')[0], media_type: 'image', video_url: '' });
          setGalleryFile(null);
          setEditingGalleryId(null);
          loadAllData();
        } else {
          showMsg(data.message || data.error || "त्रुटि हुई", "error");
        }
      })
      .catch(err => {
        setUploading(false);
        showMsg("अपलोड में समस्या आई।", "error");
      });
  };

  const startEditGallery = (g) => {
    setEditingGalleryId(g.id);
    setNewGallery({
      title: g.title,
      category: g.category,
      description: g.description || '',
      image_url: g.image_url || '',
      date: g.date || '',
      media_type: g.media_type || 'image',
      video_url: g.video_url || ''
    });
    setGalleryFile(null);
    showMsg(`गैलरी आइटम #${g.id} संपादित कर रहे हैं।`, "info");
  };

  const cancelEditGallery = () => {
    setEditingGalleryId(null);
    setNewGallery({ title: '', category: 'PM SHRI Campus', description: '', image_url: '', date: new Date().toISOString().split('T')[0], media_type: 'image', video_url: '' });
    setGalleryFile(null);
  };

  const handleDeleteGallery = (id) => {
    if (!window.confirm("क्या आप इसे गैलरी से हटाना चाहते हैं?")) return;
    fetch(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("गैलरी से हटा दिया गया।");
        loadAllData();
      });
  };

  // 4. ADD / UPDATE RESULT
  const handleAddResult = (e) => {
    e.preventDefault();
    const marksObj = {};
    if (newResult.sub1_name) marksObj[newResult.sub1_name] = newResult.sub1_marks;
    if (newResult.sub2_name) marksObj[newResult.sub2_name] = newResult.sub2_marks;
    if (newResult.sub3_name) marksObj[newResult.sub3_name] = newResult.sub3_marks;

    const payload = {
      roll_no: newResult.roll_no,
      student_name: newResult.student_name,
      father_name: newResult.father_name,
      class_name: newResult.class_name,
      percentage: newResult.percentage,
      grade: newResult.grade,
      status: newResult.status,
      marks_details: marksObj
    };

    const url = editingResultId ? `/api/admin/results/${editingResultId}` : '/api/admin/results';
    const method = editingResultId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-token': token 
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showMsg(editingResultId ? "परीक्षा परिणाम सफलतापूर्वक अपडेट हो गया!" : "छात्रा का परीक्षा परिणाम सफलतापूर्वक रिकॉर्ड हो गया!");
          setNewResult({
            roll_no: '', student_name: '', father_name: '', class_name: '12th Science',
            percentage: '', grade: 'A+', status: 'PASS',
            sub1_name: 'Subject 1', sub1_marks: '95/100',
            sub2_name: 'Subject 2', sub2_marks: '92/100',
            sub3_name: 'Subject 3', sub3_marks: '94/100'
          });
          setEditingResultId(null);
          loadAllData();
        } else {
          showMsg(data.error || "त्रुटि हुई", "error");
        }
      });
  };

  const startEditResult = (r) => {
    setEditingResultId(r.id);
    let md = {};
    try { 
      md = typeof r.marks_details === 'object' ? r.marks_details : JSON.parse(r.marks_details || '{}'); 
    } catch (e) {
      md = {};
    }
    const entries = Object.entries(md);
    setNewResult({
      roll_no: r.roll_no,
      student_name: r.student_name,
      father_name: r.father_name || '',
      class_name: r.class_name,
      percentage: String(r.percentage),
      grade: r.grade,
      status: r.status,
      sub1_name: entries[0] ? entries[0][0] : 'Subject 1',
      sub1_marks: entries[0] ? entries[0][1] : '95/100',
      sub2_name: entries[1] ? entries[1][0] : 'Subject 2',
      sub2_marks: entries[1] ? entries[1][1] : '90/100',
      sub3_name: entries[2] ? entries[2][0] : 'Subject 3',
      sub3_marks: entries[2] ? entries[2][1] : '85/100'
    });
    showMsg(`रोल नंबर ${r.roll_no} का परिणाम संपादित कर रहे हैं।`, "info");
  };

  const cancelEditResult = () => {
    setEditingResultId(null);
    setNewResult({
      roll_no: '', student_name: '', father_name: '', class_name: '12th Science',
      percentage: '', grade: 'A+', status: 'PASS',
      sub1_name: 'Subject 1', sub1_marks: '95/100',
      sub2_name: 'Subject 2', sub2_marks: '92/100',
      sub3_name: 'Subject 3', sub3_marks: '94/100'
    });
  };

  const handleDeleteResult = (id) => {
    if (!window.confirm("क्या आप इस परिणाम को हटाना चाहते हैं?")) return;
    fetch(`/api/admin/results/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("रिजल्ट हटा दिया गया।");
        loadAllData();
      });
  };

  // 5. ADD / UPDATE TIMETABLE
  const handleAddTimetable = (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('title', newTimetable.title);
    formData.append('class_name', newTimetable.class_name);
    formData.append('type', newTimetable.type);
    formData.append('date', newTimetable.date);
    formData.append('schedule_details', newTimetable.schedule_details);
    formData.append('file_url', newTimetable.file_url || '');
    if (timetableFile) {
      formData.append('file', timetableFile);
    }

    const url = editingTimetableId ? `/api/admin/timetables/${editingTimetableId}` : '/api/admin/timetables';
    const method = editingTimetableId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'x-admin-token': token },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          showMsg(editingTimetableId ? "समय सारणी (Timetable) सफलतापूर्वक अपडेट हो गई!" : "समय सारणी (Timetable) सफलतापूर्वक प्रकाशित हो गई!");
          setNewTimetable({ title: '', class_name: 'All Classes', type: 'Exam', date: new Date().toISOString().split('T')[0], schedule_details: '', file_url: '' });
          setTimetableFile(null);
          setEditingTimetableId(null);
          loadAllData();
        } else {
          showMsg(data.error || "त्रुटि हुई", "error");
        }
      })
      .catch(err => {
        setUploading(false);
        showMsg("अपलोड में समस्या आई।", "error");
      });
  };

  const startEditTimetable = (t) => {
    setEditingTimetableId(t.id);
    setNewTimetable({
      title: t.title,
      class_name: t.class_name,
      type: t.type,
      date: t.date,
      schedule_details: t.schedule_details || '',
      file_url: t.file_url || ''
    });
    setTimetableFile(null);
    showMsg(`समय सारणी '${t.title}' संपादित कर रहे हैं।`, "info");
  };

  const cancelEditTimetable = () => {
    setEditingTimetableId(null);
    setNewTimetable({ title: '', class_name: 'All Classes', type: 'Exam', date: new Date().toISOString().split('T')[0], schedule_details: '', file_url: '' });
    setTimetableFile(null);
  };

  const handleDeleteTimetable = (id) => {
    if (!window.confirm("क्या आप इस समय सारणी को हटाना चाहते हैं?")) return;
    fetch(`/api/admin/timetables/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("समय सारणी हटा दी गई।");
        loadAllData();
      });
  };

  // 6. ADD / UPDATE SPORT EVENT
  const handleAddSport = (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('title', newSport.title);
    formData.append('sport_name', newSport.sport_name);
    formData.append('level', newSport.level);
    formData.append('date', newSport.date);
    formData.append('description', newSport.description);
    formData.append('image_url', newSport.image_url);
    if (sportFile) {
      formData.append('image_file', sportFile);
    }

    const url = editingSportId ? `/api/admin/sports/${editingSportId}` : '/api/admin/sports';
    const method = editingSportId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'x-admin-token': token },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          showMsg(editingSportId ? "खेलकूद रिकॉर्ड सफलतापूर्वक अपडेट हो गया!" : "खेलकूद गतिविधि / पदक विवरण सफलतापूर्वक जुड़ गया!");
          setNewSport({ title: '', sport_name: 'Kho-Kho', level: 'जिला स्तर', date: new Date().toISOString().split('T')[0], description: '', image_url: '' });
          setSportFile(null);
          setEditingSportId(null);
          loadAllData();
        } else {
          showMsg(data.error || "त्रुटि हुई", "error");
        }
      })
      .catch(err => {
        setUploading(false);
        showMsg("अपलोड में समस्या आई।", "error");
      });
  };

  const startEditSport = (s) => {
    setEditingSportId(s.id);
    setNewSport({
      title: s.title,
      sport_name: s.sport_name,
      level: s.level,
      date: s.date,
      description: s.description || '',
      image_url: s.image_url || ''
    });
    setSportFile(null);
    showMsg(`खेलकूद रिकॉर्ड '${s.title}' संपादित कर रहे हैं।`, "info");
  };

  const cancelEditSport = () => {
    setEditingSportId(null);
    setNewSport({ title: '', sport_name: 'Kho-Kho', level: 'जिला स्तर', date: new Date().toISOString().split('T')[0], description: '', image_url: '' });
    setSportFile(null);
  };

  const handleDeleteSport = (id) => {
    if (!window.confirm("क्या आप इस खेलकूद रिकॉर्ड को हटाना चाहते हैं?")) return;
    fetch(`/api/admin/sports/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("खेलकूद रिकॉर्ड हटा दिया गया।");
        loadAllData();
      });
  };

  // 7. ADD / UPDATE LIBRARY BOOK / RESOURCE
  const handleAddBook = (e) => {
    e.preventDefault();
    setUploading(true);

    const url = editingBookId ? `/api/admin/library/${editingBookId}` : '/api/admin/library';
    const method = editingBookId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-token': token 
      },
      body: JSON.stringify(newBook)
    })
      .then(res => res.json())
      .then(data => {
        setUploading(false);
        if (data.success) {
          showMsg(editingBookId ? "पुस्तक विवरण सफलतापूर्वक अपडेट हो गया!" : "पुस्तक / संदर्भ सामग्री सफलतापूर्वक पुस्तकालय में जुड़ गई!");
          setNewBook({ title: '', author: '', category: 'NCERT', total_copies: 1, digital_link: '', description: '' });
          setEditingBookId(null);
          loadAllData();
        } else {
          showMsg(data.error || "त्रुटि हुई", "error");
        }
      })
      .catch(err => {
        setUploading(false);
        showMsg("त्रुटि हुई।", "error");
      });
  };

  const startEditBook = (b) => {
    setEditingBookId(b.id);
    setNewBook({
      title: b.title,
      author: b.author || '',
      category: b.category,
      total_copies: b.total_copies,
      digital_link: b.digital_link || '',
      description: b.description || ''
    });
    showMsg(`पुस्तक '${b.title}' को संपादित कर रहे हैं।`, "info");
  };

  const cancelEditBook = () => {
    setEditingBookId(null);
    setNewBook({ title: '', author: '', category: 'NCERT', total_copies: 1, digital_link: '', description: '' });
  };

  const handleDeleteBook = (id) => {
    if (!window.confirm("क्या आप इस पुस्तक को पुस्तकालय से हटाना चाहते हैं?")) return;
    fetch(`/api/admin/library/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("पुस्तक हटा दी गई।");
        loadAllData();
      });
  };

  // 8. INQUIRIES & SUGGESTIONS ACTIONS
  const handleToggleInquiryStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    fetch(`/api/admin/inquiries/${id}/status`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-token': token 
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showMsg(newStatus === 'read' ? "संदेश को 'पढ़ा गया (Read)' मार्क किया गया।" : "संदेश को 'नया (Unread)' मार्क किया गया।");
          loadAllData();
        }
      });
  };

  const handleDeleteInquiry = (id) => {
    if (!window.confirm("क्या आप इस संदेश/पूछताछ को हटाना चाहते हैं?")) return;
    fetch(`/api/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        showMsg("संदेश हटा दिया गया।");
        loadAllData();
      });
  };

  // IF NOT AUTHENTICATED -> SHOW LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-blue-950">विद्यालय प्रशासक लॉग-इन</h2>
            <p className="text-xs text-slate-500">
              पीएम श्री रा.बा.उ.मा.वि. राजलदेसर — डेटा अपडेशन पोर्टल
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  प्रशासक पासवर्ड (Admin Password)
                </label>
                <button
                  type="button"
                  onClick={() => { setIsForgotModalOpen(true); setRecoveryStatus({ error: '', success: '' }); }}
                  className="text-[11px] font-bold text-blue-900 hover:text-orange-600 hover:underline"
                >
                  पासवर्ड भूल गए?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड दर्ज करें..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                <span>डिफ़ॉल्ट: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">admin@rajaldesar123</code></span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>लॉग-इन करें</span>
            </button>
          </form>
        </div>

        {/* Forgot Password Recovery Modal */}
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">पासवर्ड रिकवरी (Reset Password)</h3>
                    <p className="text-[11px] text-slate-500">विद्यालय सुरक्षा सत्यापन द्वारा नया पासवर्ड सेट करें</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {recoveryStatus.error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{recoveryStatus.error}</span>
                </div>
              )}

              {recoveryStatus.success && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{recoveryStatus.success}</span>
                </div>
              )}

              <form onSubmit={handleRecoverPassword} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">विद्यालय UDISE कोड *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: 08040700105"
                    value={recoveryForm.udise_code}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, udise_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">मास्टर सिक्योरिटी पिन (Recovery PIN) *</label>
                  <input
                    type="password"
                    required
                    placeholder="डिफ़ॉल्ट पिन: 987654"
                    value={recoveryForm.recovery_pin}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, recovery_pin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">डिफ़ॉल्ट मास्टर पिन: <code className="font-mono text-slate-600">987654</code></p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">नया पासवर्ड (New Password) *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="कम से कम 6 अक्षर"
                    value={recoveryForm.new_password}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, new_password: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">नए पासवर्ड की पुष्टि (Confirm) *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="नया पासवर्ड दोबारा दर्ज करें"
                    value={recoveryForm.confirm_password}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, confirm_password: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg transition"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition shadow"
                  >
                    पासवर्ड रीसेट करें
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Admin Top Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">विद्यालय प्रबंधन एवं नियंत्रण कक्ष (Admin Panel)</h2>
            <p className="text-xs text-amber-300 font-medium">पीएम श्री यूनियन क्लब रा.बा.उ.मा.वि. राजलदेसर (चूरू)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setIsPasswordModalOpen(true); setPwdStatus({ error: '', success: '' }); }}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
            title="एडमिन पासवर्ड बदलें"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>पासवर्ड बदलें</span>
          </button>

          <button
            onClick={loadAllData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>रिफ्रेश</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉग-आउट (Logout)</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">प्रशासक पासवर्ड बदलें</h3>
                  <p className="text-[11px] text-slate-500">सुरक्षा हेतु अपना नया एडमिन पासवर्ड सेट करें</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pwdStatus.error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pwdStatus.error}</span>
              </div>
            )}

            {pwdStatus.success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{pwdStatus.success}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">वर्तमान पासवर्ड (Current Password) *</label>
                <input
                  type="password"
                  required
                  placeholder="वर्तमान पासवर्ड दर्ज करें"
                  value={pwdForm.current}
                  onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">नया पासवर्ड (New Password) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="नया पासवर्ड (कम से कम 6 अक्षर)"
                  value={pwdForm.new_pwd}
                  onChange={(e) => setPwdForm({ ...pwdForm, new_pwd: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">नए पासवर्ड की पुष्टि (Confirm New Password) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="नया पासवर्ड दोबारा दर्ज करें"
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg transition shadow"
                >
                  पासवर्ड अपडेट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Alert Message */}
      {message.text && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-2 flex-wrap border-b border-slate-200 pb-2">
        {[
          { id: 'school_details', label: 'विद्यालय विवरण (Profile & Contact)', icon: Building },
          { id: 'inquiries', label: `संदेश व पूछताछ (${inquiries.length})`, icon: MessageSquare, badge: inquiries.filter(i => i.status === 'unread').length },
          { id: 'timetables', label: `समय सारणी (${timetables.length})`, icon: Calendar },
          { id: 'teachers', label: `शिक्षक (${teachers.length})`, icon: Users },
          { id: 'results', label: `परिणाम (${results.length})`, icon: Award },
          { id: 'gallery', label: `फोटो व वीडियो (${gallery.length})`, icon: ImageIcon },
          { id: 'sports', label: `खेलकूद (${sports.length})`, icon: Trophy },
          { id: 'library', label: `पुस्तकालय (${library.length})`, icon: BookOpen },
          { id: 'notices', label: `सूचना पट्ट (${notices.length})`, icon: Bell }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition relative ${
                activeTab === tab.id
                  ? 'bg-blue-950 text-amber-400 shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse shadow">
                  {tab.badge} नया
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* TAB 0: SCHOOL PROFILE & DETAILS MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'school_details' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-600" />
                <span>विद्यालय की मूल जानकारी संपादित करें (School Details & Settings)</span>
              </h3>
              <p className="text-xs text-slate-500">
                यहाँ से आप UDISE कोड, विद्यालय का सही पता, पिन कोड, फोन नंबर और ईमेल अपडेट कर सकते हैं। यह पूरी वेबसाइट पर स्वतः बदल जाएगा।
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full w-fit">
              लाइव डेटा नियंत्रण
            </span>
          </div>

          <form onSubmit={handleSaveSchoolDetails} className="space-y-6 text-xs">
            {/* Section 1: Names & UDISE */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm border-l-4 border-amber-500 pl-2">
                1. विद्यालय का नाम एवं UDISE कोड
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">विद्यालय का नाम (हिंदी में) *</label>
                  <input
                    type="text"
                    required
                    value={schoolForm.school_name_hi}
                    onChange={(e) => setSchoolForm({ ...schoolForm, school_name_hi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">UDISE कोड (UDISE Code) *</label>
                  <input
                    type="text"
                    required
                    value={schoolForm.udise_code}
                    onChange={(e) => setSchoolForm({ ...schoolForm, udise_code: e.target.value })}
                    placeholder="e.g. 08040700105"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-blue-950 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विद्यालय का नाम (अंग्रेजी में) *</label>
                <input
                  type="text"
                  required
                  value={schoolForm.school_name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, school_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            {/* Section 2: Address & Location */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm border-l-4 border-blue-600 pl-2">
                2. विद्यालय का पता एवं भौगोलिक स्थान
              </h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">पूरा पता (Full School Address) *</label>
                <input
                  type="text"
                  required
                  value={schoolForm.school_address}
                  onChange={(e) => setSchoolForm({ ...schoolForm, school_address: e.target.value })}
                  placeholder="पीएम श्री यूनियन क्लब रा.बा.उ.मा.वि., राजलदेसर..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">शहर / कस्बा / तहसील *</label>
                  <input
                    type="text"
                    value={schoolForm.city_tehsil}
                    onChange={(e) => setSchoolForm({ ...schoolForm, city_tehsil: e.target.value })}
                    placeholder="राजलदेसर (रतनगढ़)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">जिला (District) *</label>
                  <input
                    type="text"
                    value={schoolForm.district}
                    onChange={(e) => setSchoolForm({ ...schoolForm, district: e.target.value })}
                    placeholder="चूरू (Churu)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पिन कोड (PIN Code) *</label>
                  <input
                    type="text"
                    value={schoolForm.pin_code}
                    onChange={(e) => setSchoolForm({ ...schoolForm, pin_code: e.target.value })}
                    placeholder="331801"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">राज्य (State)</label>
                  <input
                    type="text"
                    value={schoolForm.state}
                    onChange={(e) => setSchoolForm({ ...schoolForm, state: e.target.value })}
                    placeholder="राजस्थान"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact & Timings */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">
                3. संपर्क सूत्र एवं कार्यालय समय
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मुख्य फोन / लैंडलाइन *</label>
                  <input
                    type="text"
                    value={schoolForm.contact_phone}
                    onChange={(e) => setSchoolForm({ ...schoolForm, contact_phone: e.target.value })}
                    placeholder="01564-220145"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">वैकल्पिक मोबाइल (Alt Phone)</label>
                  <input
                    type="text"
                    value={schoolForm.contact_phone_alt}
                    onChange={(e) => setSchoolForm({ ...schoolForm, contact_phone_alt: e.target.value })}
                    placeholder="+91 94140XXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">आधिकारिक ईमेल (Email) *</label>
                  <input
                    type="email"
                    value={schoolForm.contact_email}
                    onChange={(e) => setSchoolForm({ ...schoolForm, contact_email: e.target.value })}
                    placeholder="ggsss.rajaldesar@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">प्रधानाचार्य का नाम (Principal Name)</label>
                  <input
                    type="text"
                    value={schoolForm.principal_name}
                    onChange={(e) => setSchoolForm({ ...schoolForm, principal_name: e.target.value })}
                    placeholder="डॉ. सरोज शर्मा (Principal)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">विद्यालय शिक्षण समय (School Timing)</label>
                  <input
                    type="text"
                    value={schoolForm.school_timing}
                    onChange={(e) => setSchoolForm({ ...schoolForm, school_timing: e.target.value })}
                    placeholder="प्रातः 07:30 से अपराह्न 01:30 बजे तक"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">कार्यालय मिलने का समय (Office Timing)</label>
                  <input
                    type="text"
                    value={schoolForm.office_timing}
                    onChange={(e) => setSchoolForm({ ...schoolForm, office_timing: e.target.value })}
                    placeholder="प्रातः 08:00 से दोपहर 01:00 बजे तक"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition flex items-center gap-2 shadow-lg text-sm"
              >
                <Save className="w-4 h-4" />
                <span>{uploading ? "अपडेट हो रहा है..." : "सभी विवरण सुरक्षित करें (Save Details)"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB: INQUIRIES & SUGGESTIONS MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          {/* Header & KPI Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>प्राप्त संदेश, पूछताछ एवं सुझाव (Inquiries & Suggestions)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  वेबसाइट के 'About Us / संपर्क' फॉर्म द्वारा अभिभावकों, विद्यार्थियों व नागरिकों द्वारा भेजे गए संदेश।
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'All', label: `सभी संदेश (${inquiries.length})` },
                  { id: 'teacher', label: `👩‍🏫 शिक्षक अपडेट अनुरोध (${inquiries.filter(i => i.subject && i.subject.includes('[शिक्षक अपडेट')).length})` },
                  { id: 'unread', label: `नए/अपठित (${inquiries.filter(i => i.status === 'unread').length})` },
                  { id: 'read', label: `पढ़े गए (${inquiries.filter(i => i.status === 'read').length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setInquiryFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      inquiryFilter === tab.id
                        ? 'bg-blue-950 text-amber-400 shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-800 font-bold">कुल प्राप्त संदेश</p>
                  <p className="text-2xl font-black text-blue-950">{inquiries.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-300" />
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-800 font-bold">नए / अपठित संदेश</p>
                  <p className="text-2xl font-black text-amber-900">{inquiries.filter(i => i.status === 'unread').length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-800 font-bold">निपटारे किए गए / पढ़े गए</p>
                  <p className="text-2xl font-black text-emerald-950">{inquiries.filter(i => i.status === 'read').length}</p>
                </div>
                <CheckCheck className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Inquiries Cards List */}
          {inquiries.filter(item => {
            if (inquiryFilter === 'All') return true;
            if (inquiryFilter === 'teacher') return item.subject && item.subject.includes('[शिक्षक अपडेट');
            return item.status === inquiryFilter;
          }).length > 0 ? (
            <div className="space-y-4">
              {inquiries
                .filter(item => {
                  if (inquiryFilter === 'All') return true;
                  if (inquiryFilter === 'teacher') return item.subject && item.subject.includes('[शिक्षक अपडेट');
                  return item.status === inquiryFilter;
                })
                .map(item => {
                  const isTeacherReq = item.subject && item.subject.includes('[शिक्षक अपडेट');
                  return (
                    <div 
                      key={item.id} 
                      className={`bg-white rounded-2xl p-6 shadow-md border transition space-y-4 ${
                        isTeacherReq 
                          ? 'border-purple-300 bg-purple-50/20 shadow-md'
                          : (item.status === 'unread' ? 'border-amber-400 bg-amber-50/20 shadow-lg' : 'border-slate-200')
                      }`}
                    >
                      {/* Top Row: Sender Info & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isTeacherReq ? 'bg-purple-900 text-white' : (item.status === 'unread' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700')
                          }`}>
                            {item.name ? item.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                              {isTeacherReq && (
                                <span className="bg-purple-100 text-purple-900 border border-purple-300 font-black px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3 text-purple-700" />
                                  <span>शिक्षक अपडेट अनुरोध</span>
                                </span>
                              )}
                              {item.status === 'unread' ? (
                                <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                                  <span>नया संदेश</span>
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                                  <span>पढ़ा गया</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>प्राप्त हुआ: {item.date}</span>
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleToggleInquiryStatus(item.id, item.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              item.status === 'unread' 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>{item.status === 'unread' ? "पढ़ा गया मार्क करें" : "अपठित करें"}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteInquiry(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="संदेश हटाएं"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded">
                          विषय (Subject)
                        </span>
                        <h5 className="font-bold text-slate-900 text-sm mt-1">{item.subject}</h5>
                      </div>

                      {/* Message Body */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {item.message}
                      </div>

                      {/* Contact Quick Buttons & Teacher Tab Jump */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 mr-1">संपर्क करें:</span>
                          
                          {item.phone && (
                            <>
                              <a
                                href={`tel:${item.phone}`}
                                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-950 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 transition"
                              >
                                <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
                                <span>कॉल: {item.phone}</span>
                              </a>

                              <a
                                href={`https://wa.me/91${item.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                                <span>व्हाट्सएप संदेश</span>
                              </a>
                            </>
                          )}

                          {item.email && (
                            <a
                              href={`mailto:${item.email}`}
                              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 transition"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-600" />
                              <span>{item.email}</span>
                            </a>
                          )}
                        </div>

                        {isTeacherReq && (
                          <button
                            onClick={() => setActiveTab('teachers')}
                            className="inline-flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-950 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-purple-300 transition shadow-sm"
                          >
                            <Users className="w-3.5 h-3.5 text-purple-700" />
                            <span>शिक्षक प्रोफाइल संपादित करने जाएं →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">वर्तमान में इस श्रेणी में कोई संदेश या पूछताछ नहीं है।</p>
              <p className="text-xs text-slate-500">जब कोई विद्यार्थी या अभिभावक संपर्क फॉर्म भरेगा, वह यहाँ तुरंत दिखाई देगा।</p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 1: NOTICES MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add / Edit Notice Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                {editingNoticeId ? <Pencil className="w-4 h-4 text-orange-600" /> : <Plus className="w-4 h-4 text-orange-600" />}
                <span>{editingNoticeId ? "सूचना संपादित करें (Edit Notice)" : "नई सूचना जोड़ें (Add Notice)"}</span>
              </h3>
              {editingNoticeId && (
                <button
                  type="button"
                  onClick={cancelEditNotice}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" /> रद्द करें
                </button>
              )}
            </div>

            <form onSubmit={handleAddNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">सूचना का शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: कक्षा 11वीं में प्रवेश प्रारंभ"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विस्तृत विवरण</label>
                <textarea
                  rows={3}
                  placeholder="सूचना का पूरा विवरण लिखें..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="general">सामान्य (General)</option>
                    <option value="admission">प्रवेश (Admission)</option>
                    <option value="exam">परीक्षा (Exam)</option>
                    <option value="sports">खेलकूद (Sports)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">तारीख (Date)</label>
                  <input
                    type="date"
                    value={newNotice.date}
                    onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_flash"
                  checked={newNotice.is_flash}
                  onChange={(e) => setNewNotice({ ...newNotice, is_flash: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="is_flash" className="font-bold text-slate-800 cursor-pointer">
                  शीर्ष टिकर (Top Flash Notice) में दिखाएं
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg transition"
              >
                {editingNoticeId ? "बदलाव सुरक्षित करें (Update Notice)" : "सूचना पट्ट पर प्रकाशित करें"}
              </button>
            </form>
          </div>

          {/* Existing Notices List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-blue-950">वर्तमान सूचनाएं ({notices.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {notices.map(n => (
                <div key={n.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {n.is_flash === 1 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Flash
                        </span>
                      )}
                      <span className="font-bold text-blue-900 uppercase">[{n.category}]</span>
                      <span className="text-slate-400">{n.date}</span>
                    </div>
                    <p className="font-bold text-slate-900">{n.title}</p>
                    {n.content && <p className="text-slate-600 text-[11px]">{n.content}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditNotice(n)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Edit Notice"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(n.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition shrink-0"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: TEACHERS MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add / Edit Teacher Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                {editingTeacherId ? <Pencil className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                <span>{editingTeacherId ? "शिक्षक प्रोफाइल संपादित करें (Edit Teacher)" : "नया शिक्षक प्रोफाइल जोड़ें (Add Teacher)"}</span>
              </h3>
              {editingTeacherId && (
                <button
                  type="button"
                  onClick={cancelEditTeacher}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" /> रद्द करें
                </button>
              )}
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">शिक्षक का नाम (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: श्री रमेश कुमार शर्मा"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">पदनाम (Designation) *</label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: प्राध्यापक (जीव विज्ञान)"
                    value={newTeacher.designation}
                    onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">विभाग (Department) *</label>
                  <select
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Administration">Administration</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                    <option value="ICT">ICT / Computer</option>
                    <option value="Sports">Sports / PTI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">योग्यता (Qualification)</label>
                  <input
                    type="text"
                    placeholder="M.Sc., B.Ed."
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">अनुभव (Experience)</label>
                  <input
                    type="text"
                    placeholder="12 Years"
                    value={newTeacher.experience}
                    onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Photo Upload or URL */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">शिक्षक की फोटो अपलोड करें (Upload Photo)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTeacherFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 text-center">-- या फोटो URL दर्ज करें --</p>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newTeacher.photo_url}
                  onChange={(e) => setNewTeacher({ ...newTeacher, photo_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-2.5 rounded-lg transition"
              >
                {uploading ? "अपलोड हो रहा है..." : (editingTeacherId ? "बदलाव सुरक्षित करें (Update Profile)" : "शिक्षक प्रोफाइल सेव करें")}
              </button>
            </form>
          </div>

          {/* Existing Teachers List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-blue-950">शिक्षक सूची ({teachers.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
              {teachers.map(t => (
                <div key={t.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-300"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{t.name}</p>
                      <p className="text-[11px] text-blue-900">{t.designation}</p>
                      <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{t.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditTeacher(t)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Edit Teacher"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(t.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition shrink-0"
                      title="Delete Teacher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: GALLERY MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload / Edit Gallery Media */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                {editingGalleryId ? <Pencil className="w-4 h-4 text-emerald-600" /> : <Upload className="w-4 h-4 text-emerald-600" />}
                <span>{editingGalleryId ? "गैलरी विवरण संपादित करें (Edit Gallery)" : "गैलरी में नई तस्वीर जोड़ें (Upload Picture)"}</span>
              </h3>
              {editingGalleryId && (
                <button
                  type="button"
                  onClick={cancelEditGallery}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" /> रद्द करें
                </button>
              )}
            </div>

            <form onSubmit={handleAddGallery} className="space-y-3 text-xs">
              {/* Media Type Switch */}
              <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">अपलोड प्रकार:</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="media_type"
                    value="image"
                    checked={newGallery.media_type === 'image'}
                    onChange={() => setNewGallery({ ...newGallery, media_type: 'image' })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>📸 फोटो (Photo)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="media_type"
                    value="video"
                    checked={newGallery.media_type === 'video'}
                    onChange={() => setNewGallery({ ...newGallery, media_type: 'video' })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>🎥 वीडियो (YouTube/Video)</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {newGallery.media_type === 'video' ? "वीडियो का शीर्षक / कार्यक्रम नाम *" : "तस्वीर का शीर्षक / कार्यक्रम का नाम *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: वार्षिक उत्सव एवं सांस्कृतिक कार्यक्रम 2026"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">श्रेणी (Category) *</label>
                  <select
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="PM SHRI Campus">PM SHRI Campus</option>
                    <option value="Events">Events (राष्ट्रीय पर्व)</option>
                    <option value="Sports">Sports (खेलकूद)</option>
                    <option value="Science Fair">Science Fair (विज्ञान)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">तारीख (Date)</label>
                  <input
                    type="date"
                    value={newGallery.date}
                    onChange={(e) => setNewGallery({ ...newGallery, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विवरण / कैप्शन</label>
                <textarea
                  rows={2}
                  placeholder="कार्यक्रम के बारे में संक्षेप में लिखें..."
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              {/* Conditional Video URL or Photo File */}
              {newGallery.media_type === 'video' ? (
                <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 space-y-2">
                  <label className="block font-bold text-red-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>YouTube वीडियो लिंक या Video URL *</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... या https://youtu.be/..."
                    value={newGallery.video_url}
                    onChange={(e) => setNewGallery({ ...newGallery, video_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-red-300 text-xs focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    YouTube पर अपलोडेड स्कूल कार्यक्रम, सांस्कृतिक नृत्य, या खेलकूद का लिंक यहाँ पेस्ट करें।
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800">कंप्यूटर / मोबाइल से फोटो चुनें</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 text-center">-- या ऑनलाइन इमेज URL दें --</p>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newGallery.image_url}
                    onChange={(e) => setNewGallery({ ...newGallery, image_url: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg transition shadow flex items-center justify-center gap-2"
              >
                {editingGalleryId ? <Pencil className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                <span>{uploading ? "अपलोड हो रहा है..." : (editingGalleryId ? "बदलाव सुरक्षित करें (Update Media)" : (newGallery.media_type === 'video' ? "वीडियो गैलरी में जोड़ें" : "गैलरी में अपलोड करें"))}</span>
              </button>
            </form>
          </div>

          {/* Existing Gallery Grid */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-blue-950">गैलरी आइटम ({gallery.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
              {gallery.map(g => (
                <div key={g.id} className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 h-36">
                  {g.media_type === 'video' ? (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-2 text-center text-white">
                      <Video className="w-8 h-8 text-red-500 mb-1" />
                      <span className="text-[10px] line-clamp-1 font-semibold">{g.title}</span>
                      <span className="text-[9px] text-red-400 font-bold">YouTube Video</span>
                    </div>
                  ) : (
                    <img
                      src={g.image_url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80"}
                      alt={g.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-between text-white text-[11px]">
                    <p className="font-bold line-clamp-2">{g.title}</p>
                    <div className="self-end flex items-center gap-1">
                      <button
                        onClick={() => startEditGallery(g)}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: RESULTS MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add / Edit Result Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                {editingResultId ? <Pencil className="w-4 h-4 text-purple-600" /> : <Plus className="w-4 h-4 text-purple-600" />}
                <span>{editingResultId ? "परीक्षा परिणाम संपादित करें (Edit Result)" : "नया परीक्षा परिणाम दर्ज करें (Add Result)"}</span>
              </h3>
              {editingResultId && (
                <button
                  type="button"
                  onClick={cancelEditResult}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" /> रद्द करें
                </button>
              )}
            </div>

            <form onSubmit={handleAddResult} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">अनुक्रमांक (Roll No) *</label>
                  <input
                    type="text"
                    required
                    placeholder="260106"
                    value={newResult.roll_no}
                    onChange={(e) => setNewResult({ ...newResult, roll_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">कक्षा / संकाय *</label>
                  <select
                    value={newResult.class_name}
                    onChange={(e) => setNewResult({ ...newResult, class_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="12th Science">12th Science</option>
                    <option value="12th Arts">12th Arts</option>
                    <option value="12th Commerce">12th Commerce</option>
                    <option value="10th Board">10th Board</option>
                    <option value="9th Standard">9th Standard</option>
                    <option value="8th Board">8th Board</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">छात्रा का नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="छात्रा का पूरा नाम"
                    value={newResult.student_name}
                    onChange={(e) => setNewResult({ ...newResult, student_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पिता का नाम</label>
                  <input
                    type="text"
                    placeholder="श्री ..."
                    value={newResult.father_name}
                    onChange={(e) => setNewResult({ ...newResult, father_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">कुल प्रतिशत (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="94.5"
                    value={newResult.percentage}
                    onChange={(e) => setNewResult({ ...newResult, percentage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ग्रेड / डिवीजन</label>
                  <input
                    type="text"
                    placeholder="A+ / 1st Div"
                    value={newResult.grade}
                    onChange={(e) => setNewResult({ ...newResult, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Subject Marks Breakdown */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800">विषयवार अंक विवरण (Subject Breakdown):</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="विषय 1 (e.g. Hindi)"
                    value={newResult.sub1_name}
                    onChange={(e) => setNewResult({ ...newResult, sub1_name: e.target.value })}
                    className="px-2 py-1.5 rounded border border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="प्राप्तांक (e.g. 95/100)"
                    value={newResult.sub1_marks}
                    onChange={(e) => setNewResult({ ...newResult, sub1_marks: e.target.value })}
                    className="px-2 py-1.5 rounded border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="विषय 2 (e.g. English)"
                    value={newResult.sub2_name}
                    onChange={(e) => setNewResult({ ...newResult, sub2_name: e.target.value })}
                    className="px-2 py-1.5 rounded border border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="प्राप्तांक (e.g. 92/100)"
                    value={newResult.sub2_marks}
                    onChange={(e) => setNewResult({ ...newResult, sub2_marks: e.target.value })}
                    className="px-2 py-1.5 rounded border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-lg transition"
              >
                {editingResultId ? "बदलाव सुरक्षित करें (Update Result)" : "परिणाम रिकॉर्ड जोड़ें"}
              </button>
            </form>
          </div>

          {/* Existing Results List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-blue-950">रिकॉर्डेड परिणाम ({results.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto text-xs">
              {results.map(r => (
                <div key={r.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-950 bg-blue-100 px-2 py-0.5 rounded">
                        Roll: {r.roll_no}
                      </span>
                      <span className="font-bold text-slate-800">{r.student_name}</span>
                      <span className="text-slate-500">({r.class_name})</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      पिता: {r.father_name || "N/A"} | प्रतिशत: <strong className="text-orange-600">{r.percentage}%</strong> ({r.grade})
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditResult(r)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Edit Result"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResult(r.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition shrink-0"
                      title="Delete Result"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: TIMETABLES MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'timetables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add / Edit Timetable Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                {editingTimetableId ? <Pencil className="w-4 h-4 text-indigo-600" /> : <Calendar className="w-4 h-4 text-indigo-600" />}
                <span>{editingTimetableId ? "समय सारणी संपादित करें (Edit Timetable)" : "नई समय सारणी जोड़ें (Add Timetable)"}</span>
              </h3>
              {editingTimetableId && (
                <button
                  type="button"
                  onClick={cancelEditTimetable}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" /> रद्द करें
                </button>
              )}
            </div>

            <form onSubmit={handleAddTimetable} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">समय सारणी का शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: कक्षा 10वीं व 12वीं वार्षिक परीक्षा समय सारणी 2026"
                  value={newTimetable.title}
                  onChange={(e) => setNewTimetable({ ...newTimetable, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">कक्षा / वर्ग *</label>
                  <select
                    value={newTimetable.class_name}
                    onChange={(e) => setNewTimetable({ ...newTimetable, class_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="All Classes">सभी कक्षाएं (All Classes)</option>
                    <option value="Class 10 & 12">कक्षा 10वीं व 12वीं (Board)</option>
                    <option value="Class 9 & 11">कक्षा 9वीं व 11वीं</option>
                    <option value="Class 6 to 8">कक्षा 6 से 8</option>
                    <option value="Class 1 to 5">कक्षा 1 से 5 (Primary)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">प्रकार (Type)</label>
                  <select
                    value={newTimetable.type}
                    onChange={(e) => setNewTimetable({ ...newTimetable, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Exam">परीक्षा समय सारणी (Exam)</option>
                    <option value="Regular">दैनिक कालांश चक्र (Daily Bell)</option>
                    <option value="Activity">गतिविधि / खेलकूद चक्र</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">दिनांक (Date)</label>
                <input
                  type="date"
                  value={newTimetable.date}
                  onChange={(e) => setNewTimetable({ ...newTimetable, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विस्तृत समय सारणी (Schedule Details / Text) *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="उदा: 
20 मार्च: अनिवार्य हिंदी (8:30 AM - 11:45 AM)
23 मार्च: विज्ञान / इतिहास
26 मार्च: गणित / लेखाशास्त्र"
                  value={newTimetable.schedule_details}
                  onChange={(e) => setNewTimetable({ ...newTimetable, schedule_details: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <label className="block font-bold text-slate-800">टाइमटेबल फाइल या फोटो अपलोड (वैकल्पिक)</label>
                <input
                  type="file"
                  onChange={(e) => setTimetableFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-900 file:text-white hover:file:bg-indigo-800 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-lg transition"
              >
                {uploading ? "अपडेट हो रहा है..." : (editingTimetableId ? "बदलाव सुरक्षित करें (Update Timetable)" : "समय सारणी प्रकाशित करें")}
              </button>
            </form>
          </div>

          {/* Existing Timetables List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-blue-950">सक्रिय समय सारणियां ({timetables.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto text-xs">
              {timetables.map(t => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        {t.type}
                      </span>
                      <span className="font-bold text-blue-950 text-sm">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditTimetable(t)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTimetable(t.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    कक्षा: {t.class_name} | जारी दिनांक: {t.date}
                  </p>
                  <pre className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-mono whitespace-pre-wrap">
                    {t.schedule_details}
                  </pre>
                  {t.file_url && (
                    <a
                      href={t.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs font-bold text-indigo-700 hover:underline"
                    >
                      संलग्न टाइमटेबल फाइल देखें / डाउनलोड करें →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: SPORTS & ACHIEVEMENTS MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'sports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add / Edit Sport Event Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                {editingSportId ? <Pencil className="w-4 h-4 text-amber-600" /> : <Trophy className="w-4 h-4 text-amber-600" />}
                <span>{editingSportId ? "खेलकूद रिकॉर्ड संपादित करें (Edit Record)" : "नई खेल उपलब्धि / टूर्नामेंट जोड़ें (Add Sports Record)"}</span>
              </h3>
              {editingSportId && (
                <button
                  type="button"
                  onClick={cancelEditSport}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" /> रद्द करें
                </button>
              )}
            </div>

            <form onSubmit={handleAddSport} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">प्रतियोगिता या उपलब्धि का नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: 67वीं चूरू जिला स्तरीय खो-खो प्रतियोगिता में स्वर्ण पदक"
                  value={newSport.title}
                  onChange={(e) => setNewSport({ ...newSport, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">खेल का नाम *</label>
                  <select
                    value={newSport.sport_name}
                    onChange={(e) => setNewSport({ ...newSport, sport_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Kho-Kho">खो-खो (Kho-Kho)</option>
                    <option value="Kabaddi">कबड्डी (Kabaddi)</option>
                    <option value="Athletics">एथलेटिक्स (Athletics)</option>
                    <option value="Volleyball">वॉलीबॉल (Volleyball)</option>
                    <option value="Badminton">बैडमिंटन (Badminton)</option>
                    <option value="Yoga">योग एवं आत्मरक्षा</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">प्रतियोगिता स्तर (Level)</label>
                  <select
                    value={newSport.level}
                    onChange={(e) => setNewSport({ ...newSport, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="जिला स्तर">जिला स्तर (District Level)</option>
                    <option value="राज्य स्तर">राज्य स्तर (State Level)</option>
                    <option value="राष्ट्रीय स्तर">राष्ट्रीय स्तर (National Level)</option>
                    <option value="ब्लॉक स्तर">ब्लॉक स्तर (Block Level)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">दिनांक (Date)</label>
                <input
                  type="date"
                  value={newSport.date}
                  onChange={(e) => setNewSport({ ...newSport, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विवरण / पदक विजेता छात्राओं के नाम</label>
                <textarea
                  rows={3}
                  placeholder="विजेता छात्राओं के नाम और मैच का विवरण..."
                  value={newSport.description}
                  onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">खेलकूद फोटो अपलोड करें</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSportFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                />
                <input
                  type="url"
                  placeholder="या इमेज URL दर्ज करें..."
                  value={newSport.image_url}
                  onChange={(e) => setNewSport({ ...newSport, image_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg transition"
              >
                {uploading ? "अपलोड हो रहा है..." : (editingSportId ? "बदलाव सुरक्षित करें (Update Record)" : "खेलकूद रिकॉर्ड जोड़ें")}
              </button>
            </form>
          </div>

          {/* Existing Sports List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-blue-950">खेल उपलब्धियां ({sports.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto text-xs">
              {sports.map(s => (
                <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {s.image_url && (
                      <img
                        src={s.image_url}
                        alt={s.title}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-300 shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {s.sport_name} • {s.level}
                        </span>
                        <span className="text-slate-400">{s.date}</span>
                      </div>
                      <p className="font-bold text-slate-900">{s.title}</p>
                      {s.description && <p className="text-slate-600 text-[11px] leading-relaxed">{s.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditSport(s)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition shrink-0"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSport(s.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 7: LIBRARY BOOKS & RESOURCES MANAGER */}
      {/* ==================================================== */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add / Edit Book Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                {editingBookId ? <Pencil className="w-4 h-4 text-emerald-600" /> : <BookOpen className="w-4 h-4 text-emerald-600" />}
                <span>{editingBookId ? "पुस्तक विवरण संपादित करें (Edit Book)" : "पुस्तकालय में नई पुस्तक / संदर्भ जोड़ें"}</span>
              </h3>
              {editingBookId && (
                <button
                  type="button"
                  onClick={cancelEditBook}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" /> रद्द करें
                </button>
              )}
            </div>

            <form onSubmit={handleAddBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">पुस्तक का शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: एनसीईआरटी कक्षा 10 विज्ञान गाइड"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">लेखक / प्रकाशक</label>
                  <input
                    type="text"
                    placeholder="जैसे: NCERT / मुंशी प्रेमचंद"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">श्रेणी (Category) *</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="NCERT">पाठ्यपुस्तक (NCERT/RBSE)</option>
                    <option value="Competitive">प्रतियोगी परीक्षा (NEET/JEE/REET)</option>
                    <option value="Literature">साहित्य एवं उपन्यास</option>
                    <option value="General">सामान्य ज्ञान एवं संदर्भ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">उपलब्ध प्रतियां (Copies)</label>
                  <input
                    type="number"
                    min="1"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">डिजिटल ई-बुक लिंक (वैकल्पिक)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newBook.digital_link}
                    onChange={(e) => setNewBook({ ...newBook, digital_link: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">संक्षिप्त विवरण</label>
                <textarea
                  rows={2}
                  placeholder="पुस्तक की उपयोगिता या विषय का संक्षिप्त परिचय..."
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg transition"
              >
                {uploading ? "अपडेट हो रहा है..." : (editingBookId ? "बदलाव सुरक्षित करें (Update Book)" : "पुस्तक सूची में जोड़ें")}
              </button>
            </form>
          </div>

          {/* Existing Books List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-blue-950">पुस्तकालय संग्रह ({library.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto text-xs">
              {library.map(b => (
                <div key={b.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        {b.category}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{b.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      लेखक: {b.author || "N/A"} | कुल प्रतियां: <strong className="text-blue-950">{b.total_copies}</strong>
                      {b.digital_link && (
                        <a href={b.digital_link} target="_blank" rel="noreferrer" className="ml-2 text-emerald-700 font-bold hover:underline">
                          [ई-बुक लिंक ↗]
                        </a>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditBook(b)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition shrink-0"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(b.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
