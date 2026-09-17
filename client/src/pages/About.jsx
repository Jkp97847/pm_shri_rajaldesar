import React, { useState } from 'react';
import { Building, Award, Target, Eye, Users2, MapPin, Phone, Mail, Clock, Send, CheckCircle2, UserCheck, MessageSquare, GraduationCap } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export default function About() {
  const { settings } = useSchool();
  const [formType, setFormType] = useState('general'); // 'general' | 'teacher'

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    designation: '',
    phone: '',
    email: '',
    update_type: 'शैक्षणिक योग्यता (Qualification)',
    details: ''
  });

  const [status, setStatus] = useState({ submitting: false, success: false, message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, message: '' });

    let payload;
    if (formType === 'teacher') {
      payload = {
        name: teacherForm.name,
        phone: teacherForm.phone,
        email: teacherForm.email,
        subject: `[शिक्षक अपडेट अनुरोध] ${teacherForm.name} (${teacherForm.designation}) - ${teacherForm.update_type}`,
        message: `शिक्षक का नाम: ${teacherForm.name}\nपद व विषय: ${teacherForm.designation}\nअपडेट प्रकार: ${teacherForm.update_type}\nसंपर्क मोबाइल: ${teacherForm.phone}\n\nअपेक्षित सुधार/अपडेट विवरण:\n${teacherForm.details}`
      };
    } else {
      payload = formData;
    }

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setStatus({
          submitting: false,
          success: true,
          message: formType === 'teacher' 
            ? "आपका शिक्षक प्रोफाइल अपडेट अनुरोध विद्यालय प्रशासन को भेज दिया गया है। एडमिन द्वारा सत्यापन कर इसे शीघ्र अपडेट किया जाएगा।"
            : (data.message || "आपका संदेश सफलतापूर्वक प्राप्त हुआ।")
        });
        if (formType === 'teacher') {
          setTeacherForm({ name: '', designation: '', phone: '', email: '', update_type: 'शैक्षणिक योग्यता (Qualification)', details: '' });
        } else {
          setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
        }
      })
      .catch(err => {
        setStatus({
          submitting: false,
          success: false,
          message: "संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
        });
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            विद्यालय का परिचय एवं इतिहास (About School)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            गौरवमयी इतिहास एवं प्रेरणादायी यात्रा
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {settings.school_name_hi || "पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर"} — बालिका शिक्षा, संस्कृति और नवाचार की पावन स्थली।
          </p>
        </div>
      </div>

      {/* History & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">
            ऐतिहासिक विरासत (Heritage)
          </div>
          <h3 className="text-2xl font-black text-blue-950">
            'यूनियन क्लब' की स्थापना से 'पीएम श्री' तक का स्वर्णिम सफर
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            राजलदेसर की पावन भूमि पर बालिकाओं की शिक्षा और उनके उत्थान हेतु स्थानीय दानदाताओं एवं प्रबुद्ध नागरिकों द्वारा ऐतिहासिक <strong>'यूनियन क्लब'</strong> की नींव रखी गई थी। कालान्तर में यह संस्थान राजस्थान सरकार के शिक्षा विभाग द्वारा संचालित राजकीय बालिका उच्च माध्यमिक विद्यालय के रूप में विकसित हुआ।
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            हाल ही में भारत सरकार द्वारा राष्ट्रीय शिक्षा नीति (NEP 2020) के अंतर्गत विद्यालय के उत्कृष्ट परीक्षा परिणामों, अनुकरणीय अनुशासन और भव्य आधारभूत ढांचे को देखते हुए इसे प्रतिष्ठित <strong>पीएम श्री (PM SHRI) योजना</strong> के तहत जिले के आदर्श बालिका विद्यालय के रूप में चयनित किया गया है।
          </p>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl border border-slate-200 h-80">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&q=80"
            alt="School Campus"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-t-4 border-amber-500 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-blue-950">हमारा दृष्टिकोण (Our Vision)</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ग्रामीण एवं अर्ध-शहरी अंचल की प्रत्येक बालिका को आधुनिक, संस्कारयुक्त, तकनीकी रूप से समृद्ध और सुरक्षित वातावरण में उच्च स्तरीय शिक्षा प्रदान कर उन्हें आत्मनिर्भर, जिम्मेदार और राष्ट्र-निर्माण में अग्रणी नागरिक बनाना।
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-t-4 border-blue-600 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-blue-950">हमारा लक्ष्य (Our Mission)</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            • 100% साक्षरता और शून्य ड्रॉप-आउट दर सुनिश्चित करना।<br />
            • आधुनिक स्मार्ट क्लासरूम, कंप्यूटर व विज्ञान प्रयोगशालाओं का शत-प्रतिशत उपयोग।<br />
            • खेलकूद, आत्मरक्षा एवं नैतिक शिक्षा द्वारा बालिकाओं का सर्वांगीण विकास।
          </p>
        </div>
      </div>

      {/* Contact & Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase">सम्पर्क कार्यालय</span>
            <h3 className="text-xl font-bold">विद्यालय कार्यालय से सीधा सम्पर्क</h3>
            <p className="text-xs text-slate-400">किसी भी जानकारी, प्रवेश फॉर्म या पूछताछ हेतु पधारें</p>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">पता (School Address):</p>
                <p>{settings.school_address || "पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर, तहसील - रतनगढ़, जिला - चूरू (राजस्थान)"} {settings.pin_code && `पिन - ${settings.pin_code}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">दूरभाष (Phone):</p>
                <p>{settings.contact_phone} {settings.contact_phone_alt && `/ ${settings.contact_phone_alt}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <p className="font-bold text-white">ईमेल (Email):</p>
                <p>{settings.contact_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">विद्यालय समय (Timings):</p>
                <p>{settings.school_timing || "प्रातः 07:30 बजे से दोपहर 01:30 बजे तक (सोमवार - शनिवार)"}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-[11px] text-amber-400 font-bold">शाला दर्पण एवं UDISE कोड</p>
            <p className="text-sm font-mono font-bold text-white">UDISE: {settings.udise_code || "08040700105"}</p>
          </div>
        </div>

        {/* Interactive Contact & Teacher Update Request Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
          
          {/* Segmented Tab Switch */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => { setFormType('general'); setStatus({ submitting: false, success: false, message: '' }); }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                formType === 'general'
                  ? 'bg-blue-950 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>सामान्य संदेश / पूछताछ</span>
            </button>
            <button
              type="button"
              onClick={() => { setFormType('teacher'); setStatus({ submitting: false, success: false, message: '' }); }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                formType === 'teacher'
                  ? 'bg-purple-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>शिक्षक प्रोफाइल अपडेट अनुरोध</span>
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-950 mb-1">
              {formType === 'teacher' ? "शिक्षक प्रोफाइल सुधार व अपडेट अनुरोध" : "संदेश या पूछताछ भेजें (Online Inquiry)"}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {formType === 'teacher' 
                ? "विद्यालय के सम्मानीय शिक्षक/शिक्षिकाएं अपने प्रोफाइल में किसी भी विवरण (योग्यता, अनुभव, फोटो, पद आदि) के सुधार हेतु यहाँ से अनुरोध भेज सकते हैं।"
                : "विद्यालय प्रशासन को अपना सवाल या सुझाव प्रेषित करें"}
            </p>
          </div>

          {status.message && (
            <div className={`p-4 rounded-xl mb-6 text-xs flex items-center gap-2 ${
              status.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          {formType === 'teacher' ? (
            /* TEACHER PROFILE UPDATE FORM */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">शिक्षक / शिक्षिका का नाम *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    placeholder="जैसे: श्री रमेश कुमार शर्मा"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">पदनाम व विषय *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.designation}
                    onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                    placeholder="जैसे: प्राध्यापक (भौतिक विज्ञान)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर (Phone) *</label>
                  <input
                    type="tel"
                    required
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">अपडेट / सुधार का प्रकार *</label>
                  <select
                    value={teacherForm.update_type}
                    onChange={(e) => setTeacherForm({ ...teacherForm, update_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900 font-semibold"
                  >
                    <option value="शैक्षणिक योग्यता (Qualification)">शैक्षणिक योग्यता / नई डिग्री</option>
                    <option value="शिक्षण अनुभव (Experience)">शिक्षण अनुभव में वृद्धि</option>
                    <option value="प्रोफाइल फोटो बदलाव (Photo Update)">नवीनतम पासपोर्ट फोटो बदलाव</option>
                    <option value="पदनाम या विभाग सुधार (Designation)">पदनाम या विभाग संशोधन</option>
                    <option value="मोबाइल/संपर्क सुधार (Phone Correction)">मोबाइल / संपर्क विवरण सुधार</option>
                    <option value="स्थानांतरण या अन्य विवरण (Transfer/Other)">स्थानांतरण / अन्य विवरण</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ईमेल (वैकल्पिक)</label>
                <input
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  placeholder="teacher@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">क्या सुधार या अपडेट करना है? (विस्तृत विवरण) *</label>
                <textarea
                  rows={4}
                  required
                  value={teacherForm.details}
                  onChange={(e) => setTeacherForm({ ...teacherForm, details: e.target.value })}
                  placeholder="उदा: कृपया मेरी योग्यता M.Sc., B.Ed. के साथ Ph.D. जोड़ें, या फोटो अपडेट हेतु लिंक..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-900 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className="bg-purple-900 hover:bg-purple-950 text-white font-bold px-6 py-3 rounded-lg text-xs transition flex items-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>{status.submitting ? "भेज रहे हैं..." : "शिक्षक अपडेट अनुरोध भेजें"}</span>
              </button>
            </form>
          ) : (
            /* GENERAL INQUIRY FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">आपका नाम (Full Name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="अपना नाम दर्ज करें"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर (Phone) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ईमेल (Email ID)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">विषय (Subject) *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="जैसे: प्रवेश संबंधी, टीसी संबंधी"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">संदेश या विवरण (Message) *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="अपना संदेश यहाँ विस्तार से लिखें..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-lg text-xs transition flex items-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>{status.submitting ? "भेज रहे हैं..." : "संदेश प्रेषित करें"}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
