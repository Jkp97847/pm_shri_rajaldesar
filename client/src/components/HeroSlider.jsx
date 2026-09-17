import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, Sparkles, BookOpen, Monitor, Shield, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: "पीएम श्री यूनियन क्लब रा.बा.उ.मा. विद्यालय, राजलदेसर",
    subtitle: "PM SHRI SCHOOL - भविष्य के भारत के निर्माण हेतु आधुनिक एवं संस्कारयुक्त बालिका शिक्षा",
    tag: "राष्ट्रीय शिक्षा नीति (NEP 2020) के अनुरूप चयनित",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&q=80",
    linkText: "हमारे बारे में जानें",
    linkUrl: "/about",
    color: "from-blue-950/90 via-blue-900/70 to-transparent"
  },
  {
    title: "21वीं सदी का आधुनिक आईसीटी व कंप्यूटर लैब",
    subtitle: "प्रत्येक छात्रा को कोडिंग, डिजिटल साक्षरता और आधुनिक कंप्यूटर तकनीकों का निःशुल्क प्रशिक्षण",
    tag: "स्मार्ट क्लासरूम एवं डिजिटल शिक्षा",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1600&q=80",
    linkText: "कंप्यूटर लैब देखें",
    linkUrl: "/computer-lab",
    color: "from-slate-950/90 via-slate-900/75 to-transparent"
  },
  {
    title: "बोर्ड परीक्षाओं में 100% उत्कृष्ट परीक्षा परिणाम",
    subtitle: "सत्र 2025-26 में 15 से अधिक बालिकाओं ने 90%+ अंक हासिल कर रचा नया इतिहास",
    tag: "शैक्षणिक उत्कृष्टता एवं मेरिट रिकॉर्ड",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80",
    linkText: "परिणाम एवं टॉपर्स देखें",
    linkUrl: "/result",
    color: "from-amber-950/90 via-amber-900/70 to-transparent"
  },
  {
    title: "खेलकूद एवं सर्वांगीण व्यक्तित्व विकास",
    subtitle: "खो-खो, कबड्डी, एथलेटिक्स व वॉलीबॉल में जिला व राज्य स्तर पर पदकों की भरमार",
    tag: "फिट इंडिया & स्पोर्ट्स एक्सीलेंस",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1600&q=80",
    linkText: "खेलकूद उपलब्धियां",
    linkUrl: "/game",
    color: "from-emerald-950/90 via-emerald-900/70 to-transparent"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] md:h-[580px] overflow-hidden bg-slate-900 shadow-xl">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
          />

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`}></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
              <div className="max-w-2xl space-y-4">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs sm:text-sm font-black shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>{slide.tag}</span>
                </div>

                {/* Main Heading */}
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-lg text-slate-200 font-medium leading-relaxed drop-shadow">
                  {slide.subtitle}
                </p>

                {/* Call to action buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to={slide.linkUrl}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-lg text-sm sm:text-base shadow-lg transition flex items-center gap-2 group"
                  >
                    <span>{slide.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/classes"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold px-5 py-3 rounded-lg text-sm sm:text-base border border-white/40 transition flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>निःशुल्क प्रवेश विवरण</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/20"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current ? "w-8 h-2.5 bg-amber-400" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
