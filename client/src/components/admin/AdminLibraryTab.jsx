import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Save, RefreshCw, Upload, Image as ImageIcon, 
  User, Quote, CheckCircle2, AlertCircle, Library as LibIcon, Sparkles 
} from 'lucide-react';

export default function AdminLibraryTab({ settings, refreshSettings, token, showMsg }) {
  const [formData, setFormData] = useState({
    library_photo: '',
    librarian_name: '',
    librarian_photo: '',
    librarian_message: '',
    library_total_books: ''
  });
  const [saving, setSaving] = useState(false);
  const [libraryPhotoFile, setLibraryPhotoFile] = useState(null);
  const [librarianPhotoFile, setLibrarianPhotoFile] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        library_photo: settings.library_photo || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&q=80',
        librarian_name: settings.librarian_name || 'श्रीमती विमला शर्मा (Librarian / पुस्तकालयाध्यक्ष)',
        librarian_photo: settings.librarian_photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
        librarian_message: settings.librarian_message || 'पुस्तकालय ज्ञान और विद्या का जीवंत स्रोत है। अध्ययन और स्वाध्याय की आदत छात्राओं के दृष्टिकोण को व्यापक बनाकर उन्हें जीवन के प्रत्येक क्षेत्र में आत्मनिर्भर और सफल बनाती है। हमारे विद्यालय का समृद्ध वाचनालय एवं डिजिटल लाइब्रेरी सभी बालिकाओं के सर्वांगीण विकास हेतु सदैव तत्पर है।',
        library_total_books: settings.library_total_books || '5,420+ पुस्तकें'
      });
    }
  }, [settings]);

  const handleUploadPhoto = async (file) => {
    const data = new FormData();
    data.append('photo_file', file);
    data.append('name', 'Library_Asset');
    data.append('designation', 'Library');
    data.append('department', 'Library');
    
    // We can use the existing /api/admin/teachers upload endpoint to get the file saved in /uploads/
    const res = await fetch('/api/admin/teachers', {
      method: 'POST',
      headers: { 'x-admin-token': token },
      body: data
    });
    const result = await res.json();
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let updatedPhoto = formData.library_photo;
      let updatedLibrarianPhoto = formData.librarian_photo;

      // Handle library photo file upload if provided
      if (libraryPhotoFile) {
        const up1 = await handleUploadPhoto(libraryPhotoFile);
        if (up1.success) {
          // fetch uploaded teacher record to extract photo url
          const tRes = await fetch('/api/teachers');
          const tData = await tRes.json();
          const lastTeacher = tData.teachers[tData.teachers.length - 1];
          if (lastTeacher && lastTeacher.photo) {
            updatedPhoto = lastTeacher.photo;
            // Clean up temporary teacher record
            await fetch(`/api/admin/teachers/${lastTeacher.id}`, {
              method: 'DELETE',
              headers: { 'x-admin-token': token }
            });
          }
        }
      }

      // Handle librarian photo file upload if provided
      if (librarianPhotoFile) {
        const up2 = await handleUploadPhoto(librarianPhotoFile);
        if (up2.success) {
          const tRes = await fetch('/api/teachers');
          const tData = await tRes.json();
          const lastTeacher = tData.teachers[tData.teachers.length - 1];
          if (lastTeacher && lastTeacher.photo) {
            updatedLibrarianPhoto = lastTeacher.photo;
            await fetch(`/api/admin/teachers/${lastTeacher.id}`, {
              method: 'DELETE',
              headers: { 'x-admin-token': token }
            });
          }
        }
      }

      const payload = {
        library_photo: updatedPhoto,
        librarian_name: formData.librarian_name,
        librarian_photo: updatedLibrarianPhoto,
        librarian_message: formData.librarian_message,
        library_total_books: formData.library_total_books
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSaving(false);

      if (data.success) {
        showMsg("पुस्तकालय की समस्त जानकारी व फोटो सफलतापूर्वक अपडेट हो गई!");
        refreshSettings();
        setLibraryPhotoFile(null);
        setLibrarianPhotoFile(null);
      } else {
        showMsg(data.message || "त्रुटि हुई", "error");
      }
    } catch (err) {
      setSaving(false);
      showMsg("सर्वर से संपर्क करने में समस्या आई।", "error");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
            <LibIcon className="w-5 h-5 text-emerald-700" />
            <span>पुस्तकालय एवं वाचनालय विवरण संपादक (Library Settings)</span>
          </h3>
          <p className="text-xs text-slate-500">
            यहाँ से आप पुस्तकालय की फोटो, लाइब्रेरियन की फोटो, नाम, संदेश और कुल पुस्तकों की संख्या बदल सकते हैं। यह सीधे पुस्तकालय टैब में दिखाई देगा।
          </p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full w-fit">
          लाइब्रेरी लाइव संपादक
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Library Photo & Books Count */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">
            1. पुस्तकालय कक्ष की फोटो एवं पुस्तकों की संख्या
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                कुल पुस्तकों की संख्या (Total Number of Books) *
              </label>
              <input
                type="text"
                required
                placeholder="जैसे: 5,420+ पुस्तकें"
                value={formData.library_total_books}
                onChange={(e) => setFormData({ ...formData, library_total_books: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-blue-950"
              />
              <p className="text-[10px] text-slate-400 mt-1">यह संख्या पुस्तकालय के मुख्य बैनर पर बड़े अक्षरों में प्रदर्शित होगी।</p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                पुस्तकालय कक्ष की फोटो (Library Photo URL या File Upload)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.library_photo}
                onChange={(e) => setFormData({ ...formData, library_photo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLibraryPhotoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Library Photo Preview */}
          {formData.library_photo && (
            <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
              <img
                src={formData.library_photo}
                alt="Library Preview"
                className="w-28 h-20 object-cover rounded-lg border border-slate-300 shadow-sm"
              />
              <div>
                <p className="font-bold text-slate-800 text-xs">पुस्तकालय फोटो पूर्वावलोकन (Current Library Image)</p>
                <p className="text-[11px] text-slate-500 truncate max-w-md">{formData.library_photo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Librarian Details (Photo, Name, Message) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-sm border-l-4 border-emerald-600 pl-2">
            2. पुस्तकालयाध्यक्ष विवरण (Librarian Details & Message)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                पुस्तकालयाध्यक्ष का नाम व पदनाम (Librarian Name) *
              </label>
              <input
                type="text"
                required
                placeholder="जैसे: श्रीमती विमला शर्मा (Librarian)"
                value={formData.librarian_name}
                onChange={(e) => setFormData({ ...formData, librarian_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                लाइब्रेरियन की फोटो (Photo URL या File Upload)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.librarian_photo}
                onChange={(e) => setFormData({ ...formData, librarian_photo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLibrarianPhotoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Librarian Photo Preview */}
          {formData.librarian_photo && (
            <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
              <img
                src={formData.librarian_photo}
                alt="Librarian Preview"
                className="w-16 h-20 object-contain bg-slate-800 rounded-lg border border-slate-300 shadow-sm"
              />
              <div>
                <p className="font-bold text-slate-800 text-xs">लाइब्रेरियन फोटो पूर्वावलोकन</p>
                <p className="text-[11px] text-slate-500">{formData.librarian_name}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              पुस्तकालयाध्यक्ष का प्रेरक संदेश (Librarian Message) *
            </label>
            <textarea
              rows={4}
              required
              placeholder="पुस्तकालय के महत्व एवं छात्राओं के अध्ययन से संबंधित संदेश..."
              value={formData.librarian_message}
              onChange={(e) => setFormData({ ...formData, librarian_message: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "सुरक्षित किया जा रहा है..." : "पुस्तकालय की जानकारी सुरक्षित करें (Save Changes)"}</span>
          </button>

          <span className="text-[11px] text-slate-400">
            सेव करने पर वेबसाइट के पुस्तकालय पेज पर तुरंत अपडेट हो जाएगा।
          </span>
        </div>

      </form>
    </div>
  );
}
