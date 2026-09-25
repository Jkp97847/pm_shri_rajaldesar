import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NoticeTicker() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotices(data.notices);
        }
      })
      .catch(err => console.error("Error fetching notices:", err));
  }, []);

  if (notices.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white text-sm font-medium py-2 px-4 shadow-inner flex items-center overflow-hidden border-b border-emerald-800">
      <div className="flex items-center gap-1.5 bg-white text-blue-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shrink-0 shadow-md border border-orange-400">
        <Bell className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
        <span className="text-orange-600">नवीन</span>
        <span className="text-blue-950">सूचनाएं</span>
      </div>

      <div className="relative w-full overflow-hidden ml-4">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 hover:[animation-play-state:paused] cursor-pointer">
          {notices.map((n, idx) => (
            <span key={n.id || idx} className="inline-flex items-center gap-2 text-white hover:text-amber-200">
              <span className="w-2 h-2 rounded-full bg-white border border-orange-400"></span>
              <span className="font-bold">{n.title}</span>
              <span className="text-xs text-orange-100 font-medium">({n.date})</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-80 text-amber-200" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
