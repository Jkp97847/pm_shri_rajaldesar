import React, { useState, useEffect } from 'react';
import { Bell, X, Calendar, Sparkles, CheckCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DailyNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.notices && data.notices.length > 0) {
          const latest = data.notices[0];
          const today = new Date().toISOString().split('T')[0];
          const lastSeenDate = localStorage.getItem('pm_shri_daily_notice_seen_date');
          const lastSeenId = localStorage.getItem('pm_shri_last_seen_notice_id');

          // If user hasn't seen today's popup OR a newer notice ID was added
          if (lastSeenDate !== today || String(lastSeenId) !== String(latest.id)) {
            setNotice(latest);
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 800);
            return () => clearTimeout(timer);
          }
        }
      })
      .catch(err => console.error("Error checking daily notice:", err));
  }, []);

  const handleDontShowToday = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('pm_shri_daily_notice_seen_date', today);
    if (notice) {
      localStorage.setItem('pm_shri_last_seen_notice_id', String(notice.id));
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-500/30">
        
        {/* Tricolor Govt Header Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>PM SHRI विद्यालय दैनिक सूचना</span>
              </div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                आज का मुख्य अपडेट एवं घोषणा
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white transition"
            title="बंद करें (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {notice.is_flash === 1 && (
              <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase text-[10px] tracking-wider animate-pulse">
                ★ FLASH NOTICE
              </span>
            )}
            <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded uppercase text-[11px]">
              {notice.category || 'General'}
            </span>
            <span className="text-slate-500 flex items-center gap-1 font-medium text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>दिनांक: {notice.date}</span>
            </span>
          </div>

          {/* Title */}
          <h4 className="text-lg font-bold text-blue-950 leading-snug">
            {notice.title}
          </h4>

          {/* Detailed Content */}
          {notice.content ? (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {notice.content}
            </div>
          ) : (
            <p className="text-sm text-slate-600 italic">
              उपरोक्त विषय से संबंधित सभी छात्र-छात्राएं एवं अभिभावक ध्यान दें। अधिक जानकारी हेतु विद्यालय कार्यालय में संपर्क करें।
            </p>
          )}

          {/* School Contact Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-semibold text-slate-700">पीएम श्री रा.बा.उ.मा.वि. राजलदेसर (चूरू)</span>
            <span className="text-[11px] text-blue-900 font-bold">हेल्पलाइन: 01564-222045</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDontShowToday}
            className="w-full sm:w-auto text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200 transition"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>आज दोबारा न दिखाएं (Don't show again today)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              to="/classes"
              onClick={handleDontShowToday}
              className="w-full sm:w-auto bg-blue-950 hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow"
            >
              <span>अन्य सूचनाएं देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            
            <button
              onClick={handleClose}
              className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-lg text-xs transition"
            >
              बंद करें
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
