import React, { useState, useEffect } from 'react';
import { Bell, X, Calendar, Sparkles, CheckCheck, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';

export default function DailyNoticeModal() {
  const { isNoticeModalOpen, closeNoticeModal } = useSchool();
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNoticeModalOpen) {
      setLoading(true);
      fetch('/api/notices')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.notices && data.notices.length > 0) {
            setNotices(data.notices);
            setSelectedNotice(data.notices[0]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching notices for modal:", err);
          setLoading(false);
        });
    }
  }, [isNoticeModalOpen]);

  if (!isNoticeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-500/40 animate-scaleUp">
        
        {/* Tricolor Govt Header Line */}
        <div className="h-2 w-full tiranga-bar"></div>

        {/* Modal Header (Ashoka Chakra Navy Blue with Saffron & Gold accents) */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-orange-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>पीएम श्री विद्यालय - नवीनतम विद्यालयी सूचनाएं</span>
              </div>
              <h3 className="text-base sm:text-lg font-black leading-tight text-white">
                नवीन सूचना एवं मुख्य घोषणाएं (Notice Board)
              </h3>
            </div>
          </div>

          <button
            onClick={closeNoticeModal}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white transition hover:scale-105"
            title="बंद करें (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">सूचनाएं लोड हो रही हैं...</div>
        ) : notices.length === 0 ? (
          <div className="p-8 text-center text-slate-600 text-xs">वर्तमान में कोई नई सूचना उपलब्ध नहीं है।</div>
        ) : (
          <div className="flex flex-col md:flex-row max-h-[70vh]">
            
            {/* Notices List Sidebar (if multiple) */}
            {notices.length > 1 && (
              <div className="w-full md:w-5/12 bg-slate-50 border-r border-slate-200 overflow-y-auto p-3 space-y-2 border-b md:border-b-0 max-h-48 md:max-h-[70vh]">
                <p className="text-[11px] font-bold text-slate-500 uppercase px-1">सभी सूचनाएं ({notices.length})</p>
                {notices.map((n, idx) => {
                  const isSelected = selectedNotice && selectedNotice.id === n.id;
                  return (
                    <button
                      key={n.id || idx}
                      onClick={() => setSelectedNotice(n)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition border flex flex-col gap-1 ${
                        isSelected 
                          ? 'bg-white border-orange-500 shadow-sm text-blue-950 font-bold ring-1 ring-orange-400' 
                          : 'bg-white/60 hover:bg-white border-slate-200 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded uppercase ${
                          n.is_flash === 1 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {n.category || 'General'}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <p className="line-clamp-2 leading-snug">{n.title}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Notice Detailed View */}
            <div className={`p-6 space-y-4 overflow-y-auto ${notices.length > 1 ? 'w-full md:w-7/12' : 'w-full'}`}>
              {selectedNotice && (
                <>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {selectedNotice.is_flash === 1 && (
                      <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded uppercase text-[10px] tracking-wider animate-pulse">
                        ★ महत्वपूर्ण FLASH NOTICE
                      </span>
                    )}
                    <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded uppercase text-[11px]">
                      {selectedNotice.category || 'सामान्य'}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 font-medium text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>दिनांक: {selectedNotice.date}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-bold text-blue-950 leading-snug">
                    {selectedNotice.title}
                  </h4>

                  {/* Body Content */}
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-inner">
                    {selectedNotice.content || 'उपरोक्त विषय से संबंधित सभी छात्र-छात्राएं एवं अभिभावक ध्यान दें। अधिक जानकारी हेतु विद्यालय कार्यालय में संपर्क करें।'}
                  </div>

                  {/* School Contact Note */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-slate-700">पीएम श्री रा.बा.उ.मा.वि. राजलदेसर (चूरू)</span>
                    <span className="text-[11px] text-blue-900 font-bold">हेल्पलाइन: 01564-220145</span>
                  </div>
                </>
              )}
            </div>

          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-medium">
            विद्यालय विकास एवं प्रबंधन समिति (SDMC)
          </span>

          <button
            onClick={closeNoticeModal}
            className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
