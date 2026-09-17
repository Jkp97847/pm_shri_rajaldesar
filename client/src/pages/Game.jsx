import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, Users, HeartHandshake, CheckCircle, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Game() {
  const [liveSports, setLiveSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(true);

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

  const sports = [
    {
      name: "खो-खो (Kho-Kho)",
      level: "जिला चैंपियन टीम (District Champions)",
      desc: "विद्यालय की खो-खो बालिका टीम चूरू जिला स्तरीय विद्यालयी खेलकूद प्रतियोगिता में लगातार 3 वर्षों से विजेता रही है।",
      image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&q=80",
      badge: "स्वर्ण पदक विजेता"
    },
    {
      name: "कबड्डी (Kabaddi)",
      level: "राज्य स्तर पर सहभागिता (State Level)",
      desc: "शारीरिक शक्ति, चपलता और रणनीति का उत्कृष्ट प्रदर्शन। 4 छात्राओं का चयन राज्य स्तरीय कबड्डी शिविर में हुआ।",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
      badge: "सिल्वर मेडलिस्ट"
    },
    {
      name: "एथलेटिक्स व धावक (Athletics)",
      level: "100m, 200m, रिले व लंबी कूद",
      desc: "ट्रैक एवं फील्ड इवेंट्स में बालिकाओं ने ब्लॉक एवं जिला स्तर पर व्यक्तिगत स्पर्धाओं में उत्कृष्ट रिकॉर्ड बनाए।",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
      badge: "उत्कृष्ट धाविका"
    },
    {
      name: "वॉलीबॉल व बैडमिंटन (Volleyball & Badminton)",
      level: "कोर्ट सुविधाएं उपलब्ध",
      desc: "विद्यालय प्रांगण में सुसज्जित आउटडोर वॉलीबॉल कोर्ट तथा बैडमिंटन कोर्ट छात्राओं के दैनिक अभ्यास हेतु उपलब्ध है।",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80",
      badge: "दैनिक प्रशिक्षण"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            खेलकूद एवं शारीरिक शिक्षा (Game & Sports Wing)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            खेलकूद, योग एवं आत्मरक्षा
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            "स्वस्थ शरीर में ही स्वस्थ मस्तिष्क का वास होता है।" हमारे विद्यालय में बालिकाओं के शारीरिक सामर्थ्य, खेल भावना और आत्मरक्षा पर विशेष ध्यान दिया जाता है।
          </p>
        </div>

        <Link
          to="/admin"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shrink-0 shadow"
        >
          <Trophy className="w-4 h-4" />
          <span>खेल रिकॉर्ड अपडेट करें (Admin)</span>
        </Link>
      </div>

      {/* Live Sports Events & Medalists from Admin */}
      {liveSports.length > 0 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Trophy className="w-6 h-6 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase">हालिया उपलब्धियां</span>
              <h3 className="text-xl sm:text-2xl font-black text-blue-950">
                नवीनतम खेलकूद प्रतियोगिताएं एवं पदक विजेता
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSports.map((evt) => (
              <div key={evt.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col justify-between">
                {evt.image_url ? (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={evt.image_url}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded shadow">
                      {evt.level}
                    </span>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
                    <span className="text-xs font-bold">{evt.sport_name}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">{evt.level}</span>
                  </div>
                )}

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-blue-950">{evt.sport_name}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {evt.date}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{evt.title}</h4>

                  {evt.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>

                <div className="px-5 pb-4 pt-2 border-t border-slate-200 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5" />
                  <span>प्रमाणित खेल उपलब्धि</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Sports Wings Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-950">प्रमुख खेल विधाएं एवं सुविधाएं</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sports.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition group">
              <div className="sm:w-1/2 h-52 sm:h-auto relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded shadow">
                  {item.badge}
                </span>
              </div>
              <div className="sm:w-1/2 p-6 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-blue-950">{item.name}</h3>
                  <p className="text-xs font-bold text-orange-600 mb-2">{item.level}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>नियमित दैनिक अभ्यास</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Highlights: Yoga & Self Defence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">दैनिक योग एवं प्राणायाम सत्र</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            प्रत्येक सुबह प्रार्थना सभा के पश्चात 15 मिनट का सामूहिक योगाभ्यास व सूर्य नमस्कार कराया जाता है, जिससे छात्राओं की एकाग्रता और मानसिक शांति में वृद्धि होती है।
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">रानी लक्ष्मीबाई आत्मरक्षा प्रशिक्षण</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            छात्राओं को आपातकालीन परिस्थितियों में अपनी सुरक्षा स्वयं करने हेतु प्रशिक्षित महिला प्रशिक्षकों द्वारा मार्शल आर्ट्स, कराटे एवं आत्मरक्षा की तकनीकें सिखाई जाती हैं।
          </p>
        </div>
      </div>

      {/* Sports Incharge Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
          alt="PTI Teacher"
          className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-md"
        />
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">शारीरिक शिक्षिका (Sports Incharge)</span>
          <h4 className="text-lg font-bold text-blue-950">श्रीमती कविता मेघवाल</h4>
          <p className="text-xs text-slate-600 font-semibold">M.P.Ed., NIS (Athletics Coach)</p>
          <p className="text-xs text-slate-500 max-w-xl">
            "हमारा उद्देश्य विद्यालय की प्रत्येक छात्रा में खेल भावना, अनुशासन और फिटनेस का संचार करना है ताकि वे राज्य और राष्ट्रीय स्तर पर तिरंगा लहराएं।"
          </p>
        </div>
      </div>

    </div>
  );
}
