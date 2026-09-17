import React from 'react';
import { Monitor, Cpu, Wifi, ShieldAlert, Code, Sparkles, CheckCircle, Terminal } from 'lucide-react';

export default function ComputerLab() {
  const labHighlights = [
    {
      title: "40+ आधुनिक कंप्यूटर सिस्टम्स",
      desc: "इंटेल कोर आई-5 प्रोसेसर, 16GB रैम और एसएसडी युक्त तेज गति वाले डेस्कटॉप सिस्टम्स।",
      icon: Monitor
    },
    {
      title: "हाई-स्पीड ऑप्टिक फाइबर इंटरनेट",
      desc: "प्रत्येक सिस्टम पर 100 Mbps ब्रॉडबैंड वाई-फाई कनेक्टिविटी ऑनलाइन ई-लर्निंग हेतु।",
      icon: Wifi
    },
    {
      title: "इंटरएक्टिव स्मार्ट फ्लैट पैनल (IFP)",
      desc: "75 इंच का 4K टचस्क्रीन डिजिटल बोर्ड लाइव कोडिंग और विजुअल लर्निंग के लिए।",
      icon: Cpu
    },
    {
      title: "अखंडित विद्युत आपूर्ति (Online UPS)",
      desc: "पावर बैकअप सिस्टम जिससे बिजली जाने पर भी छात्राओं का प्रैक्टिकल निर्बाध चलता रहे।",
      icon: Sparkles
    }
  ];

  const syllabus = [
    {
      title: "1. कंप्यूटर फंडामेंटल्स एवं टाइपिंग",
      topics: "कंप्यूटर की कार्यप्रणाली, हार्डवेयर-सॉफ्टवेयर, हिंदी (रेमिंगटन गेल/कृतिदेव) एवं अंग्रेजी टाइपिंग।"
    },
    {
      title: "2. ऑफिस टूल्स एवं डेटा एंट्री",
      topics: "MS Word (दस्तावेजीकरण), MS Excel (अंक तालिका व स्प्रेडशीट), MS PowerPoint (प्रेजेंटेशन)।"
    },
    {
      title: "3. कोडिंग एवं वेब डिजाइनिंग (Coding)",
      topics: "Scratch ब्लॉक प्रोग्रामिंग, Python लैंग्वेज के मूल सिद्धांत, HTML एवं CSS द्वारा वेब पेज बनाना।"
    },
    {
      title: "4. साइबर सुरक्षा एवं डिजिटल साक्षरता",
      topics: "ऑनलाइन धोखाधड़ी से बचाव, सुरक्षित पासवर्ड निर्माण, सोशल मीडिया प्राइवेसी एवं डिजिटल पेमेंट।"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            पीएम श्री स्मार्ट आईसीटी पहल (ICT Lab)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            अत्याधुनिक कंप्यूटर एवं रोबोटिक्स लैब
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            21वीं सदी के डिजिटल युग में बालिकाओं को आत्मनिर्भर, तकनीकी रूप से दक्ष और कोडिंग में पारंगत बनाने हेतु समर्पित आधुनिक स्मार्ट लैब।
          </p>
        </div>
      </div>

      {/* Lab Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {labHighlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-3 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Lab Images & Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl border border-slate-200 h-80">
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80"
            alt="Students in Lab"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">प्रैक्टिकल लर्निंग दृष्टिकोण</span>
          <h3 className="text-2xl font-black text-blue-950">
            प्रत्येक छात्रा को अलग सिस्टम पर व्यक्तिगत अभ्यास
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            हमारे विद्यालय में 'एक छात्रा - एक कंप्यूटर' का सिद्धांत अपनाया गया है। थ्योरी के साथ-साथ छात्राओं को प्रतिदिन हैंड्स-ऑन प्रैक्टिकल कराया जाता है ताकि वे टेक्नोलॉजी को केवल पढ़ें नहीं बल्कि खुद बनाकर सीखें।
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>कक्षा 6 से 12 तक के लिए नियमित कंप्यूटर प्रैक्टिकल कालांश</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>प्रोजेक्ट बेस्ड लर्निंग एवं राष्ट्रीय कंप्यूटर प्रतियोगिताओं में सहभागिता</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>शाला दर्पण एवं डिजिटल शिक्षण सामग्री का सुगम उपयोग</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Curriculum */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">कंप्यूटर लैब पाठ्यक्रम एवं कौशल (Curriculum)</h3>
            <p className="text-xs text-slate-400">कक्षावार चरणबद्ध कंप्यूटर प्रशिक्षण योजना</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabus.map((item, idx) => (
            <div key={idx} className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-2">
              <h4 className="text-sm font-bold text-amber-400">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.topics}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Incharge */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"
          alt="Lab Incharge"
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-900 shadow-md"
        />
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">आईसीटी प्रभारी (ICT Lab Incharge)</span>
          <h4 className="text-lg font-bold text-blue-950">सुश्री पूजा सेठी</h4>
          <p className="text-xs text-slate-600 font-semibold">MCA, B.Tech (Computer Science)</p>
          <p className="text-xs text-slate-500 max-w-xl">
            "हमारा संकल्प है कि राजलदेसर की हर बालिका डिजिटल रूप से सक्षम बने और सॉफ्टवेयर, कोडिंग एवं आर्टिफिशियल इंटेलिजेंस जैसे आधुनिक क्षेत्रों में अपना भविष्य संवारे।"
          </p>
        </div>
      </div>

    </div>
  );
}
