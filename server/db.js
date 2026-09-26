const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = path.join(__dirname, 'school.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      date TEXT NOT NULL,
      is_flash INTEGER DEFAULT 0,
      category TEXT DEFAULT 'general',
      link TEXT
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      department TEXT NOT NULL,
      qualification TEXT,
      experience TEXT,
      photo TEXT,
      phone TEXT
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      date TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roll_no TEXT NOT NULL UNIQUE,
      student_name TEXT NOT NULL,
      father_name TEXT,
      class_name TEXT NOT NULL,
      year TEXT DEFAULT '2025-2026',
      percentage REAL NOT NULL,
      grade TEXT NOT NULL,
      status TEXT DEFAULT 'PASS',
      marks_details TEXT
    );

    CREATE TABLE IF NOT EXISTS timetables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      class_name TEXT NOT NULL,
      type TEXT DEFAULT 'Exam',
      date TEXT NOT NULL,
      schedule_details TEXT,
      file_url TEXT
    );

    CREATE TABLE IF NOT EXISTS sports_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      sport_name TEXT NOT NULL,
      level TEXT DEFAULT 'जिला स्तर',
      date TEXT,
      description TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS library_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT,
      category TEXT NOT NULL,
      total_copies INTEGER DEFAULT 1,
      digital_link TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'unread'
    );
  `);

  // Migrate gallery columns for video support if not existing
  try { db.exec("ALTER TABLE gallery ADD COLUMN media_type TEXT DEFAULT 'image'"); } catch (e) {}
  try { db.exec("ALTER TABLE gallery ADD COLUMN video_url TEXT DEFAULT ''"); } catch (e) {}

  // Seed sample inquiries if empty
  const countInquiries = db.prepare('SELECT count(*) as count FROM inquiries').get().count;
  if (countInquiries === 0) {
    db.prepare(`
      INSERT INTO inquiries (name, phone, email, subject, message, date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'रमेश कुमार प्रजापत (अभिभावक)',
      '9829123456',
      'ramesh.prajapat@gmail.com',
      'कक्षा 11 विज्ञान संकाय में प्रवेश संबंधी जानकारी',
      'सादर प्रणाम, मेरी सुपुत्री ने 10वीं बोर्ड में 88% अंक प्राप्त किए हैं। क्या कक्षा 11वीं में बायोलॉजी संकाय में अभी प्रवेश चालू हैं? आवश्यक दस्तावेजों की जानकारी प्रदान करें।',
      '2026-09-12 11:30 AM',
      'unread'
    );

    db.prepare(`
      INSERT INTO inquiries (name, phone, email, subject, message, date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'सुनीता देवी (स्थानीय नागरिक / पूर्व छात्रा)',
      '9414567890',
      'sunita.churu@yahoo.com',
      'पुस्तकालय में प्रतियोगी परीक्षा कॉर्नर हेतु सुझाव',
      'नमस्कार, पीएम श्री बनने पर विद्यालय को हार्दिक बधाई। मेरा सुझाव है कि सीनियर छात्राओं के लिए RAS एवं CUET की नवीनतम गाइड बुक्स पुस्तकालय में और अधिक संख्या में उपलब्ध कराई जाएं।',
      '2026-09-13 04:15 PM',
      'unread'
    );
  }

  // Default Admin Password & School info
  const checkSettings = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_password');
  if (!checkSettings) {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('admin_password', 'admin@rajaldesar123');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('school_name', 'PM SHRI UNION CLUB GOVT GIRLS SENIOR SECONDARY SCHOOL');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('school_location', 'Rajaldesar, Churu, Rajasthan - 331801');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('udise_code', '08040700105');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('principal_name', 'Dr. Saroj Sharma (Principal)');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('contact_phone', '+91 1564 220145');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('contact_email', 'ggsss.rajaldesar@gmail.com');
  }

  // Seed Notices if empty
  const noticesCount = db.prepare('SELECT COUNT(*) as c FROM notices').get().c;
  if (noticesCount === 0) {
    const defaultNotices = [
      {
        title: "कक्षा 11वीं एवं 12वीं (कला, विज्ञान एवं वाणिज्य) में प्रवेश प्रक्रिया प्रारम्भ",
        content: "सत्र 2026-27 हेतु कक्षा 11 एवं 12 में सभी संकायों में बालिकाओं के लिए निःशुल्क प्रवेश फॉर्म विद्यालय कार्यालय से प्राप्त करें।",
        date: "2026-09-10",
        is_flash: 1,
        category: "admission",
        link: ""
      },
      {
        title: "पीएम श्री योजना के अंतर्गत अत्याधुनिक कंप्यूटर व रोबोटिक्स लैब का लोकार्पण",
        content: "भारत सरकार की पीएम श्री (PM SHRI) योजना के तहत बालिकाओं को 21वीं सदी के डिजिटल कौशल से लैस करने हेतु नई स्मार्ट लैब शुरू की गई।",
        date: "2026-09-05",
        is_flash: 1,
        category: "general",
        link: ""
      },
      {
        title: "राजस्थान बोर्ड परीक्षा परिणाम में विद्यालय की छात्राओं का उत्कृष्ट प्रदर्शन - 100% परिणाम",
        content: "कक्षा 10वीं व 12वीं में 15 से अधिक छात्राओं ने 90% से अधिक अंक प्राप्त कर विद्यालय व राजलदेसर क्षेत्र का नाम रोशन किया।",
        date: "2026-08-28",
        is_flash: 0,
        category: "exam",
        link: ""
      },
      {
        title: "वार्षिक खेलकूद प्रतियोगिता (खो-खो, कबड्डी व एथलेटिक्स) 20 से 22 सितम्बर",
        content: "विद्यालय प्रांगण में अंतर-सदनीय वार्षिक खेलकूद प्रतियोगिता आयोजित की जाएगी। सभी छात्राएं अपने शारीरिक शिक्षक से संपर्क करें।",
        date: "2026-09-08",
        is_flash: 0,
        category: "sports",
        link: ""
      }
    ];

    const insertNotice = db.prepare(`
      INSERT INTO notices (title, content, date, is_flash, category, link)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const n of defaultNotices) {
      insertNotice.run(n.title, n.content, n.date, n.is_flash, n.category, n.link);
    }
  }

  // Seed Teachers if empty
  const teachersCount = db.prepare('SELECT COUNT(*) as c FROM teachers').get().c;
  if (teachersCount === 0) {
    const defaultTeachers = [
      {
        name: "MOHAN LAL",
        designation: "प्रधानाचार्य (Principal)",
        department: "Administration",
        qualification: "B.A., M.A., BSTC, B.Ed, RSCIT",
        experience: "24+ वर्ष",
        photo: "/uploads/staff/1.jpeg",
        phone: "9414894845"
      },
      {
        name: "RIKHA RAM",
        designation: "प्राध्यापक (Lecturer I Gr.) - Political Science",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/2.jpeg",
        phone: "9950695755"
      },
      {
        name: "VIMLA CHOUDHARY",
        designation: "प्राध्यापक (Lecturer I Gr.) - Hindi Literature",
        department: "Arts",
        qualification: "स्नातकोत्तर (M.A./M.Sc.), बी.एड",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/3.jpeg",
        phone: ""
      },
      {
        name: "MAHESH KUMAR SANKHOLIA",
        designation: "प्राध्यापक (Lecturer I Gr.) - Sanskrit Literature",
        department: "Arts",
        qualification: "M.A., M.Phil., NET, RSCIT",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9024347777"
      },
      {
        name: "TILOKA RAM DUDI",
        designation: "प्राध्यापक (Lecturer I Gr.) - Hindi Literature",
        department: "Arts",
        qualification: "स्नातकोत्तर (M.A./M.Sc.), बी.एड",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/5.jpeg",
        phone: ""
      },
      {
        name: "RAMESH KUMAR",
        designation: "प्राध्यापक (Lecturer I Gr.) - Physics (Science Stream)",
        department: "Science",
        qualification: "B.Sc., M.Sc., B.Ed",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "8963892319"
      },
      {
        name: "SARITA SHARMA",
        designation: "प्राध्यापक (Lecturer I Gr.) - Hindi (Compulsary)",
        department: "Arts",
        qualification: "स्नातकोत्तर (M.A./M.Sc.), बी.एड",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: ""
      },
      {
        name: "INDER SINGH",
        designation: "उप-प्रधानाचार्य (Vice Principal)",
        department: "Administration",
        qualification: "B.A., M.A",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/8.jpeg",
        phone: "9057295392"
      },
      {
        name: "RAM KISHOR MEGHWAL",
        designation: "प्राध्यापक (Lecturer I Gr.) - Sanskrit Literature",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/9.jpeg",
        phone: "9929189014"
      },
      {
        name: "MANOJ KUMAR SARSWAT",
        designation: "प्राध्यापक (Lecturer I Gr.) - Biology (Science Stream)",
        department: "Science",
        qualification: "B.Sc., M.Sc., B.Ed",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/10.jpeg",
        phone: "9928267724"
      },
      {
        name: "RASHMI MAHARSHI",
        designation: "प्राध्यापक (Lecturer I Gr.) - Political Science",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/11.jpeg",
        phone: "9079682607"
      },
      {
        name: "KANHAIYA LAL SHARMA",
        designation: "प्राध्यापक (Lecturer I Gr.) - Chemistry (Science Stream)",
        department: "Science",
        qualification: "B.Sc., M.Sc., B.Ed., RSCIT",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/12.jpeg",
        phone: "9887653869"
      },
      {
        name: "LOHITA JHAJHARIA",
        designation: "प्राध्यापक (Lecturer I Gr.) - English",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed., RSCIT",
        experience: "12+ वर्ष",
        photo: "/uploads/staff/13.jpeg",
        phone: "9602203999"
      },
      {
        name: "ANAND SINGH",
        designation: "वरिष्ठ अध्यापक (Senior Teacher) - Mathematics",
        department: "Science",
        qualification: "B.Sc., M.A., B.Ed",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/14.jpeg",
        phone: "9829990632"
      },
      {
        name: "ANITA",
        designation: "वरिष्ठ अध्यापक (Senior Teacher) - Urdu",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/15.jpeg",
        phone: "9950361008"
      },
      {
        name: "SHISHPAL",
        designation: "वरिष्ठ अध्यापक (Senior Teacher) - Sanskrit",
        department: "Arts",
        qualification: "स्नातक, बी.एड",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: ""
      },
      {
        name: "JAGDISH PRAJAPAT",
        designation: "बेसिक कंप्यूटर अनुदेशक (Basic Computer Instructor)",
        department: "ICT",
        qualification: "BCA, MCA",
        experience: "7+ वर्ष",
        photo: "/uploads/staff/18.jpeg",
        phone: "9784730824"
      },
      {
        name: "MANISH SHARMA",
        designation: "वरिष्ठ कंप्यूटर अनुदेशक (Senior Computer Instructor)",
        department: "ICT",
        qualification: "BCA, MCA",
        experience: "7+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "8562868641"
      },
      {
        name: "ANITA MARU",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - ENGLISH",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/20.jpeg",
        phone: "9571894862"
      },
      {
        name: "ARTI SHARMA",
        designation: "प्रयोगशाला सहायक (Lab Assistant)",
        department: "Science",
        qualification: "B.A",
        experience: "8+ वर्ष",
        photo: "/uploads/staff/21.jpeg",
        phone: "7240106557"
      },
      {
        name: "ASHOK KUMAR JAT",
        designation: "कनिष्ठ सहायक (Junior Assistant)",
        department: "Administration",
        qualification: "B.A., RSCIT",
        experience: "8+ वर्ष",
        photo: "/uploads/staff/22.jpeg",
        phone: "7877845982"
      },
      {
        name: "DHARMPAL BUGALIA",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - Mathematics/ Science",
        department: "Science",
        qualification: "B.Sc., B.Ed",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9982823574"
      },
      {
        name: "DIPANKAR SHARMA",
        designation: "प्रयोगशाला सहायक (Lab Assistant)",
        department: "Science",
        qualification: "B.Sc., B.Ed",
        experience: "8+ वर्ष",
        photo: "/uploads/staff/24.jpeg",
        phone: "8619212002"
      },
      {
        name: "IFTEKHAR ALI",
        designation: "अतिरिक्त प्रशासनिक अधिकारी (Addl. Admin Officer)",
        department: "Administration",
        qualification: "स्नातक, बी.एड",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9887128681"
      },
      {
        name: "KANCHAN LATA PUROHIT",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "S.T.C",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "7568392031"
      },
      {
        name: "KANHAIYA LAL JANGID",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - HINDI",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9887340355"
      },
      {
        name: "KAPIL MEENA",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "B.Com., M.A., B.Ed",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9982845457"
      },
      {
        name: "MEENA KUMARI",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - HINDI",
        department: "Arts",
        qualification: "B.A., M.A., NET, B.Ed., RSCIT",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/29.jpeg",
        phone: "7737062475"
      },
      {
        name: "MONIKA BARUPAL",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "S.T.C",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/30.jpeg",
        phone: "9460505720"
      },
      {
        name: "MUNNI DEVI",
        designation: "चतुर्थ श्रेणी कर्मचारी (Class IV)",
        department: "Administration",
        qualification: "माध्यमिक (Secondary)",
        experience: "15+ वर्ष",
        photo: "/uploads/staff/31.jpeg",
        phone: "9145836326"
      },
      {
        name: "NANU RAM",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - Mathematics/ Science",
        department: "Science",
        qualification: "B.Sc., B.Ed",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9784431932"
      },
      {
        name: "RISHIKA SAHARAN",
        designation: "शिक्षक (Teacher)",
        department: "Primary / Elementary",
        qualification: "स्नातक, बी.एड",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: ""
      },
      {
        name: "ROSHANI",
        designation: "शिक्षक (Teacher)",
        department: "Primary / Elementary",
        qualification: "स्नातक, बी.एड",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/34.jpeg",
        phone: ""
      },
      {
        name: "SEEMA KAJLA",
        designation: "शिक्षक (Teacher)",
        department: "Primary / Elementary",
        qualification: "स्नातक, बी.एड",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/blank-teacher.png",
        phone: ""
      },
      {
        name: "YOGESHWERY SHARMA",
        designation: "शिक्षक (Teacher)",
        department: "Primary / Elementary",
        qualification: "स्नातक, बी.एड",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/36.jpeg",
        phone: ""
      },
      {
        name: "YOGITA PUROHIT",
        designation: "शिक्षक (Teacher)",
        department: "Primary / Elementary",
        qualification: "स्नातक, बी.एड",
        experience: "10+ वर्ष",
        photo: "/uploads/staff/37.png",
        phone: ""
      },
      {
        name: "DEVKI NANDAN SHARMA",
        designation: "चतुर्थ श्रेणी कर्मचारी (Class IV)",
        department: "Administration",
        qualification: "B.A",
        experience: "15+ वर्ष",
        photo: "/uploads/staff/38.jpeg",
        phone: "9887607170"
      }
    ];

    const insertTeacher = db.prepare(`
      INSERT INTO teachers (name, designation, department, qualification, experience, photo, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const t of defaultTeachers) {
      insertTeacher.run(t.name, t.designation, t.department, t.qualification, t.experience, t.photo, t.phone);
    }
  }

  // Seed Gallery if empty
  const galleryCount = db.prepare('SELECT COUNT(*) as c FROM gallery').get().c;
  if (galleryCount === 0) {
    const defaultGallery = [
      {
        title: "पीएम श्री योजना के अंतर्गत स्मार्ट क्लासरूम का सत्र",
        category: "PM SHRI Campus",
        image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
        date: "2026-08-15",
        description: "इंटरएक्टिव डिजिटल बोर्ड और आधुनिक तकनीकों द्वारा शिक्षण।"
      },
      {
        title: "गणतंत्र दिवस एवं स्वतंत्रता दिवस समारोह",
        category: "Events",
        image_url: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80",
        date: "2026-08-15",
        description: "विद्यालय प्रांगण में राष्ट्रीय ध्वजारोहण एवं छात्राओं द्वारा देशभक्ति सांस्कृतिक प्रस्तुति।"
      },
      {
        title: "अत्याधुनिक कंप्यूटर व कोडिंग लैब",
        category: "PM SHRI Campus",
        image_url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
        date: "2026-07-20",
        description: "छात्राओं के लिए समर्पित हाई-स्पीड इंटरनेट और 40 से अधिक कंप्यूटरों वाली आधुनिक लैब।"
      },
      {
        title: "वार्षिक खेलकूद प्रतियोगिता - खो-खो एवं कबड्डी विजेता",
        category: "Sports",
        image_url: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&q=80",
        date: "2026-02-12",
        description: "जिला स्तर पर प्रथम स्थान प्राप्त करने वाली विद्यालय की खो-खो टीम।"
      },
      {
        title: "जिला स्तरीय विज्ञान प्रदर्शनी एवं नवाचार",
        category: "Science Fair",
        image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
        date: "2026-01-25",
        description: "छात्राओं द्वारा सौर ऊर्जा व जल संरक्षण पर प्रस्तुत किए गए उत्कृष्ट साइंस मॉडल्स।"
      },
      {
        title: "समृद्ध विद्यालयी पुस्तकालय एवं वाचनालय",
        category: "PM SHRI Campus",
        image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
        date: "2026-06-18",
        description: "5000+ पुस्तकों और डिजिटल ई-बुक्स से सुसज्जित शांत वाचनालय।"
      }
    ];

    const insertGallery = db.prepare(`
      INSERT INTO gallery (title, category, image_url, date, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const g of defaultGallery) {
      insertGallery.run(g.title, g.category, g.image_url, g.date, g.description);
    }
  }

  // Seed Results if empty
  const resultsCount = db.prepare('SELECT COUNT(*) as c FROM results').get().c;
  if (resultsCount === 0) {
    const defaultResults = [
      {
        roll_no: "260101",
        student_name: "प्रिया शर्मा",
        father_name: "श्री रमेश शर्मा",
        class_name: "12th Science",
        year: "2025-2026",
        percentage: 96.8,
        grade: "A+ (Topper)",
        status: "PASS",
        marks_details: JSON.stringify({
          "Physics": "97/100",
          "Chemistry": "98/100",
          "Biology": "96/100",
          "Hindi Compulsory": "95/100",
          "English Compulsory": "98/100"
        })
      },
      {
        roll_no: "260102",
        student_name: "सुमन कस्वां",
        father_name: "श्री भागीरथ कस्वां",
        class_name: "12th Arts",
        year: "2025-2026",
        percentage: 95.4,
        grade: "A+ (Merit)",
        status: "PASS",
        marks_details: JSON.stringify({
          "History": "96/100",
          "Political Science": "98/100",
          "Geography": "94/100",
          "Hindi Compulsory": "94/100",
          "English Compulsory": "95/100"
        })
      },
      {
        roll_no: "260103",
        student_name: "कोमल सोनी",
        father_name: "श्री विनोद सोनी",
        class_name: "12th Commerce",
        year: "2025-2026",
        percentage: 94.2,
        grade: "A+ (Merit)",
        status: "PASS",
        marks_details: JSON.stringify({
          "Accountancy": "96/100",
          "Business Studies": "95/100",
          "Economics": "92/100",
          "Hindi Compulsory": "93/100",
          "English Compulsory": "95/100"
        })
      },
      {
        roll_no: "260104",
        student_name: "मनीषा प्रजापत",
        father_name: "श्री जगदीश प्रजापत",
        class_name: "10th Board",
        year: "2025-2026",
        percentage: 95.8,
        grade: "A+ (School Topper)",
        status: "PASS",
        marks_details: JSON.stringify({
          "Hindi": "96/100",
          "English": "94/100",
          "Science": "98/100",
          "Social Science": "97/100",
          "Mathematics": "95/100",
          "Sanskrit": "95/100"
        })
      },
      {
        roll_no: "260105",
        student_name: "आरती पारीक",
        father_name: "श्री सुरेन्द्र पारीक",
        class_name: "10th Board",
        year: "2025-2026",
        percentage: 92.6,
        grade: "A",
        status: "PASS",
        marks_details: JSON.stringify({
          "Hindi": "94/100",
          "English": "90/100",
          "Science": "94/100",
          "Social Science": "93/100",
          "Mathematics": "92/100",
          "Sanskrit": "93/100"
        })
      }
    ];

    const insertResult = db.prepare(`
      INSERT INTO results (roll_no, student_name, father_name, class_name, year, percentage, grade, status, marks_details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of defaultResults) {
      insertResult.run(r.roll_no, r.student_name, r.father_name, r.class_name, r.year, r.percentage, r.grade, r.status, r.marks_details);
    }
  }

  // Seed Timetables if empty
  const timetablesCount = db.prepare('SELECT COUNT(*) as c FROM timetables').get().c;
  if (timetablesCount === 0) {
    const insertTT = db.prepare(`
      INSERT INTO timetables (title, class_name, type, date, schedule_details, file_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertTT.run(
      "वार्षिक परीक्षा समय सारणी 2025-26 (कक्षा 9वीं एवं 11वीं)",
      "Class 9 & 11",
      "Exam",
      "2026-09-10",
      "प्रातः 08:30 से 11:45 बजे तक। प्रथम पारी में अनिवार्य विषय तथा द्वितीय पारी में ऐच्छिक विषयों की परीक्षाएं संपन्न होंगी।",
      ""
    );
    insertTT.run(
      "दैनिक कक्षा समय विभाग चक्र (Regular Class Bell Timetable)",
      "All Classes (1 to 12)",
      "Regular",
      "2026-09-01",
      "प्रार्थना सभा: 07:30 - 08:00 AM | प्रथम कालांश: 08:00 - 08:45 AM | मध्यांतर: 10:30 - 11:00 AM | अंतिम कालांश: 01:30 PM",
      ""
    );
  }

  // Seed Sports Events if empty
  const sportsCount = db.prepare('SELECT COUNT(*) as c FROM sports_events').get().c;
  if (sportsCount === 0) {
    const insertSport = db.prepare(`
      INSERT INTO sports_events (title, sport_name, level, date, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertSport.run(
      "67वीं चूरू जिला स्तरीय विद्यालयी खो-खो प्रतियोगिता",
      "Kho-Kho",
      "जिला स्तर",
      "2026-08-25",
      "विद्यालय की छात्रा टीम ने फाइनल मुकाबले में शानदार जीत दर्ज कर स्वर्ण पदक अपने नाम किया।",
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&q=80"
    );
    insertSport.run(
      "राज्य स्तरीय कबड्डी चयन शिविर",
      "Kabaddi",
      "राज्य स्तर",
      "2026-07-15",
      "विद्यालय की 4 प्रतिभावान छात्राओं का चयन राज्य स्तरीय प्रशिक्षण शिविर हेतु हुआ।",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"
    );
  }

  // Seed Library Items if empty
  const libCount = db.prepare('SELECT COUNT(*) as c FROM library_items').get().c;
  if (libCount === 0) {
    const insertLib = db.prepare(`
      INSERT INTO library_items (title, author, category, total_copies, digital_link, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertLib.run("NCERT कक्षा 10 विज्ञान एवं गणित संदर्भ", "NCERT New Delhi", "NCERT", 25, "https://ncert.nic.in/textbook.php", "बोर्ड परीक्षा तैयारी हेतु आवश्यक अभ्यास पुस्तकें");
    insertLib.run("NEET भौतिकी एवं रसायन विज्ञान गाइड", "Dr. H.C. Verma", "Competitive", 12, "https://ndl.iitkgp.ac.in", "चिकित्सा प्रवेश परीक्षा हेतु संदर्भ सामग्री");
    insertLib.run("गोदान एवं कर्मभूमि", "मुंशी प्रेमचंद", "Literature", 8, "", "हिंदी साहित्य के कालजयी उपन्यास");
    insertLib.run("अग्नि की उड़ान (Wings of Fire)", "डॉ. ए.पी.जे. अब्दुल कलाम", "Literature", 10, "", "छात्राओं के लिए प्रेरणादायी आत्मकथा");
  }

  console.log("Database initialized successfully with PM SHRI Rajaldesar data.");
}

initDB();

module.exports = db;
