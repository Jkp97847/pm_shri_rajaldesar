import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Award, Flame, Users, Calendar, Video, Newspaper, 
  ExternalLink, Sparkles, CheckCircle2, ZoomIn, X, PlayCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Game() {
  const [liveSports, setLiveSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(true);
  const [photoModal, setPhotoModal] = useState(null);

  useEffect(() => {
    fetch('/api/sports')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sports) {
          setLiveSports(data.sports);
        }
        setLoadingSports(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingSports(false);
      });
  }, []);

  // Helper to extract YouTube video ID if URL is from YouTube
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 tiranga-bar"></div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow">
            <Trophy className="w-3.5 h-3.5" />
            <span>खेलकूद एवं शारीरिक शिक्षा (Sports & Games Wing)</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            खेल प्रतियोगिताएं, विजेता विवरण एवं उपलब्धियां
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            "स्वस्थ शरीर में ही स्वस्थ मस्तिष्क का वास होता है।" हमारे विद्यालय की बालिकाओं द्वारा जिला एवं राज्य स्तर पर अर्जित की गई खेलकूद उपलब्धियां, विजेता विवरण, समाचार एवं वीडियो।
          </p>
        </div>

        <Link
          to="/admin"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-md"
        >
          <Trophy className="w-4 h-4" />
          <span>खेल रिकॉर्ड व विजेता जोड़ें (Admin)</span>
        </Link>
      </div>

      {/* 2. Admin Live Sports & Winner List (Strictly only Admin data) */}
      {loadingSports ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow text-slate-500 font-semibold">
          खेलकूद विवरण लोड हो रहा है...
        </div>
      ) : liveSports.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">वर्तमान में कोई खेलकूद रिकॉर्ड उपलब्ध नहीं है</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            विद्यालय प्रशासन द्वारा खेल प्रतियोगिताओं, विजेताओं की सूची, समाचार कतरन एवं वीडियो अपलोड किए जाने के बाद वे यहाँ प्रदर्शित होंगे।
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 bg-blue-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow hover:bg-blue-900 transition"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>एडमिन पैनल में खेल रिकॉर्ड जोड़ें</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-blue-950">
                  प्रतियोगिताएं, पदक विजेता एवं समाचार
                </h3>
                <p className="text-xs text-slate-500">विद्यालय की खेलकूद उपलब्धियों का प्रामाणिक विवरण</p>
              </div>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
              कुल {liveSports.length} खेल रिकॉर्ड
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {liveSports.map((evt) => {
              const youtubeEmbed = getYouTubeEmbedUrl(evt.video_url);

              return (
                <div 
                  key={evt.id} 
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xl transition"
                >
                  <div>
                    {/* Top Media: Photo or Video Embed */}
                    {evt.image_url ? (
                      <div 
                        className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden group cursor-pointer"
                        onClick={() => setPhotoModal({ url: evt.image_url, title: evt.title })}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center filter blur-md opacity-35 scale-105"
                          style={{ backgroundImage: `url(${evt.image_url})` }}
                        ></div>
                        <img
                          src={evt.image_url}
                          alt={evt.title}
                          className="relative w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow flex items-center gap-1">
                          <Medal className="w-3.5 h-3.5" />
                          <span>{evt.level || "जिला स्तर"}</span>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-amber-700 to-orange-700 text-white flex items-center justify-between">
                        <span className="text-sm font-bold flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-amber-300" />
                          <span>{evt.sport_name}</span>
                        </span>
                        <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                          {evt.level || "खेल प्रतियोगिता"}
                        </span>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      
                      {/* Meta Tags */}
                      <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-950 font-bold px-2.5 py-1 rounded-lg">
                          खेल: {evt.sport_name}
                        </span>
                        {evt.date && (
                          <span className="flex items-center gap-1 text-slate-600 font-semibold font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.date}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-lg sm:text-xl font-black text-blue-950 leading-snug">
                        {evt.title}
                      </h4>

                      {/* Description */}
                      {evt.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {evt.description}
                        </p>
                      )}

                      {/* 1. WINNER DETAILS (विजेता छात्राएं / टीम का विवरण) */}
                      {evt.winner_details && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-500 space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                            <Award className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>विजेता छात्राएं / टीम का विवरण (Winners)</span>
                          </div>
                          <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line pl-5">
                            {evt.winner_details}
                          </p>
                        </div>
                      )}

                      {/* 2. NEWS CONTENT (समाचार विवरण व प्रेस विज्ञप्ति) */}
                      {evt.news_content && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
                          <div className="flex items-center gap-1.5 text-blue-950 font-bold text-xs">
                            <Newspaper className="w-4 h-4 text-blue-900 shrink-0" />
                            <span>समाचार एवं मीडिया कवरेज (News & Press)</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed pl-5 whitespace-pre-line">
                            {evt.news_content}
                          </p>
                        </div>
                      )}

                      {/* 3. VIDEO CONTENT (वीडियो लिंक या YouTube एम्बेड) */}
                      {evt.video_url && (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                            <Video className="w-4 h-4 shrink-0" />
                            <span>प्रतियोगिता का वीडियो (Competition Video)</span>
                          </div>

                          {youtubeEmbed ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow">
                              <iframe
                                src={youtubeEmbed}
                                title={evt.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <a
                              href={evt.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow"
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>वीडियो देखें (Watch Video)</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Card Footer Badge */}
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>प्रमाणित खेल उपलब्धि</span>
                    </span>
                    <span className="text-slate-400 font-medium">पीएम श्री विद्यालय राजलदेसर</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Lightbox Zoom Modal for Sports Photos */}
      {photoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          onClick={() => setPhotoModal(null)}
        >
          <div 
            className="bg-slate-900 text-white rounded-2xl overflow-hidden max-w-4xl w-full border border-slate-700 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200">{photoModal.title}</h3>
              <button
                onClick={() => setPhotoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh] bg-black">
              <img
                src={photoModal.url}
                alt={photoModal.title}
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
