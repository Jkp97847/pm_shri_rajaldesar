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
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-sm font-medium py-2 px-4 shadow-inner flex items-center overflow-hidden border-b border-orange-700">
      <div className="flex items-center gap-2 bg-white text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm">
        <Bell className="w-3.5 h-3.5 animate-bounce" />
        <span>नवीनतम सूचनाएं</span>
      </div>

      <div className="relative w-full overflow-hidden ml-4">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 hover:[animation-play-state:paused] cursor-pointer">
          {notices.map((n, idx) => (
            <span key={n.id || idx} className="inline-flex items-center gap-2 text-amber-50 hover:text-white">
              <span className="w-2 h-2 rounded-full bg-yellow-300"></span>
              <span className="font-semibold">{n.title}</span>
              <span className="text-xs text-orange-200">({n.date})</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
