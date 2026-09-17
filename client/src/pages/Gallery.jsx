import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Calendar, X, ZoomIn, UploadCloud, Video, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const categories = ['All', 'PM SHRI Campus', 'Events', 'Sports', 'Science Fair', 'Videos'];

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.success) setItems(data.gallery);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = selectedCategory === 'All'
    ? items
    : selectedCategory === 'Videos'
      ? items.filter(p => p.media_type === 'video' || (p.video_url && p.video_url.length > 0))
      : items.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            यादगार पल एवं गतिविधियां (Photo & Video Gallery)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            विद्यालय छायाचित्र एवं वीडियो दीर्घा
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            पीएम श्री विद्यालय परिसर, राष्ट्रीय पर्व, खेलकूद, विज्ञान प्रदर्शनी, सांस्कृतिक आयोजनों के जीवंत छायाचित्र एवं वीडियो क्लिप्स।
          </p>
        </div>

        <Link
          to="/admin"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shrink-0 shadow"
        >
          <UploadCloud className="w-4 h-4" />
          <span>तस्वीर/वीडियो अपलोड करें (Admin)</span>
        </Link>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedCategory === cat
                ? 'bg-blue-950 text-amber-400 shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat === 'Videos' && <Video className="w-3.5 h-3.5" />}
            <span>{cat === 'All' ? 'सभी मीडिया (All)' : cat === 'Videos' ? 'वीडियो (Videos)' : cat}</span>
          </button>
        ))}
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-semibold">गैलरी लोड हो रही है...</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isVideo = item.media_type === 'video' || (item.video_url && item.video_url.length > 0);
            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-60 overflow-hidden relative bg-slate-900 flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white p-4 text-center">
                      <Video className="w-12 h-12 text-amber-400 mb-2" />
                      <p className="text-xs font-bold text-slate-200">{item.title}</p>
                    </div>
                  )}

                  {isVideo ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                      <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </div>
                      <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>VIDEO</span>
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <div className="bg-white/90 text-blue-950 p-2.5 rounded-full shadow-lg">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 pt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.date || "2026"}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium">इस श्रेणी में कोई सामग्री उपलब्ध नहीं है।</p>
        </div>
      )}

      {/* Modal / Lightbox for viewing image or playing video */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              {activeModalItem.media_type === 'video' || activeModalItem.video_url ? (
                (() => {
                  const ytEmbed = getYouTubeEmbedUrl(activeModalItem.video_url);
                  if (ytEmbed) {
                    return (
                      <iframe
                        src={`${ytEmbed}?autoplay=1`}
                        title={activeModalItem.title}
                        className="w-full h-[60vh] border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <video
                      controls
                      autoPlay
                      src={activeModalItem.video_url || activeModalItem.image_url}
                      className="max-h-[70vh] w-full"
                    >
                      आपका ब्राउज़र वीडियो सपोर्ट नहीं करता।
                    </video>
                  );
                })()
              ) : (
                <img
                  src={activeModalItem.image_url}
                  alt={activeModalItem.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              )}
            </div>

            <div className="p-6 space-y-2 bg-white">
              <div className="flex items-center justify-between gap-4">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded">
                  {activeModalItem.category}
                </span>
                <span className="text-xs text-slate-400">{activeModalItem.date}</span>
              </div>
              <h3 className="text-lg font-bold text-blue-950">{activeModalItem.title}</h3>
              {activeModalItem.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeModalItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
