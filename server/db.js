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

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sr_no TEXT,
      roll_no TEXT,
      name TEXT NOT NULL,
      father_name TEXT,
      mother_name TEXT,
      class_name TEXT NOT NULL,
      section TEXT DEFAULT 'A',
      gender TEXT NOT NULL,
      category TEXT DEFAULT 'GEN',
      dob TEXT,
      phone TEXT,
      address TEXT,
      admission_date TEXT,
      status TEXT DEFAULT 'Active'
    );
  `);

  // Migrate gallery columns for video support if not existing
  try { db.exec("ALTER TABLE gallery ADD COLUMN media_type TEXT DEFAULT 'image'"); } catch (e) {}
  try { db.exec("ALTER TABLE gallery ADD COLUMN video_url TEXT DEFAULT ''"); } catch (e) {}

  // Migrate sports_events columns for winner details, news, and video
  try { db.exec("ALTER TABLE sports_events ADD COLUMN winner_details TEXT DEFAULT ''"); } catch (e) {}
  try { db.exec("ALTER TABLE sports_events ADD COLUMN news_content TEXT DEFAULT ''"); } catch (e) {}
  try { db.exec("ALTER TABLE sports_events ADD COLUMN video_url TEXT DEFAULT ''"); } catch (e) {}

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
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('principal_name', 'MOHAN LAL (Principal)');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('contact_phone', '+91 1564 220145');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('contact_email', 'ggsss.rajaldesar@gmail.com');
  }

  // Default Library Settings
  const defaultLibrarySettings = [
    ['library_photo', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&q=80'],
    ['librarian_name', 'श्रीमती विमला शर्मा (Librarian / पुस्तकालयाध्यक्ष)'],
    ['librarian_photo', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80'],
    ['librarian_message', 'पुस्तकालय ज्ञान और विद्या का जीवंत स्रोत है। अध्ययन और स्वाध्याय की आदत छात्राओं के दृष्टिकोण को व्यापक बनाकर उन्हें जीवन के प्रत्येक क्षेत्र में आत्मनिर्भर और सफल बनाती है। हमारे विद्यालय का समृद्ध वाचनालय एवं डिजिटल लाइब्रेरी सभी बालिकाओं के सर्वांगीण विकास हेतु सदैव तत्पर है।'],
    ['library_total_books', '5,420+ पुस्तकें']
  ];
  for (const [k, v] of defaultLibrarySettings) {
    const ex = db.prepare('SELECT value FROM settings WHERE key = ?').get(k);
    if (!ex) {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(k, v);
    }
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
        experience: "24+ वर्ष (वर्तमान पदभार: 3 वर्ष 5 माह)",
        photo: "/uploads/staff/1.jpeg",
        phone: "9414894845"
      },
      {
        name: "RIKHA RAM",
        designation: "प्राध्यापक (Lecturer I Gr.) - Political Science",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "8 वर्ष 3 माह (पदभार: 11/06/2018)",
        photo: "/uploads/staff/2.jpeg",
        phone: "9950695755"
      },
      {
        name: "VIMLA CHOUDHARY",
        designation: "उप-प्रधानाचार्य (Vice Principal)",
        department: "Administration",
        qualification: "B.A., M.A., B.Ed.BSTC",
        experience: "14+ वर्ष (वरिष्ठ उप-प्रधानाचार्य)",
        photo: "/uploads/staff/3.jpeg",
        phone: "9460927989"
      },
      {
        name: "MAHESH KUMAR SANKHOLIA",
        designation: "प्राध्यापक (Lecturer I Gr.) - Sanskrit Literature",
        department: "Arts",
        qualification: "M.A., M.P, NET, RSCIT",
        experience: "10 वर्ष (पदभार: 03/09/2016)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9024347777"
      },
      {
        name: "TILOKA RAM DUDI",
        designation: "प्राध्यापक (Lecturer I Gr.) - Hindi",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed",
        experience: "9 माह (पदभार: 18/12/2025)",
        photo: "/uploads/staff/5.jpeg",
        phone: "9610817102"
      },
      {
        name: "RAMESH KUMAR",
        designation: "प्राध्यापक (Lecturer I Gr.) - Physics (Science Stream)",
        department: "Science",
        qualification: "B.Sc., M.Sc., B.Ed",
        experience: "9 वर्ष 3 माह (पदभार: 28/06/2017)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "8963892319"
      },
      {
        name: "SARITA SHARMA",
        designation: "प्राध्यापक (Lecturer I Gr.) - Hindi",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed., RSCIT",
        experience: "9 वर्ष 2 माह (पदभार: 04/07/2017)",
        photo: "/uploads/staff/7.jpeg",
        phone: "8118893102"
      },
      {
        name: "INDER SINGH",
        designation: "उप-प्रधानाचार्य (Vice Principal)",
        department: "Administration",
        qualification: "B.A., M.A",
        experience: "10 वर्ष 2 माह (पदभार: 30/07/2016)",
        photo: "/uploads/staff/8.jpeg",
        phone: "9057295392"
      },
      {
        name: "RAM KISHOR MEGHWAL",
        designation: "प्राध्यापक (Lecturer I Gr.) - Sanskrit Literature",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed",
        experience: "1 वर्ष 9 माह (पदभार: 18/12/2024)",
        photo: "/uploads/staff/9.jpeg",
        phone: "9929189014"
      },
      {
        name: "MANOJ KUMAR SARSWAT",
        designation: "प्राध्यापक (Lecturer I Gr.) - Biology (Science Stream)",
        department: "Science",
        qualification: "B.Sc., M.Sc., B.Ed",
        experience: "1 वर्ष 4 माह (पदभार: 05/05/2025)",
        photo: "/uploads/staff/10.jpeg",
        phone: "9928267724"
      },
      {
        name: "RASHMI MAHARSHI",
        designation: "प्राध्यापक (Lecturer I Gr.) - Political Science",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed",
        experience: "9 वर्ष 8 माह (पदभार: 21/01/2017)",
        photo: "/uploads/staff/11.jpeg",
        phone: "9079682607"
      },
      {
        name: "KANHAIYA LAL SHARMA",
        designation: "प्राध्यापक (Lecturer I Gr.) - Chemistry (Science Stream)",
        department: "Science",
        qualification: "B.Sc., M.Sc., B.Ed., RSCIT",
        experience: "5 वर्ष 7 माह (पदभार: 10/02/2021)",
        photo: "/uploads/staff/12.jpeg",
        phone: "9887653869"
      },
      {
        name: "LOHITA JHAJHARIA",
        designation: "प्राध्यापक (Lecturer I Gr.) - English",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed., RSCIT",
        experience: "5 वर्ष 6 माह (पदभार: 20/03/2021)",
        photo: "/uploads/staff/13.jpeg",
        phone: "9602203999"
      },
      {
        name: "ANAND SINGH",
        designation: "वरिष्ठ अध्यापक (Senior Teacher) - Mathematics",
        department: "Science",
        qualification: "B.Sc., M.A., B.Ed",
        experience: "7 वर्ष 2 माह (पदभार: 05/07/2019)",
        photo: "/uploads/staff/14.jpeg",
        phone: "9829990632"
      },
      {
        name: "ANITA",
        designation: "वरिष्ठ अध्यापक (Senior Teacher) - Urdu",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "9 वर्ष 8 माह (पदभार: 25/01/2017)",
        photo: "/uploads/staff/15.jpeg",
        phone: "9950361008"
      },
      {
        name: "SHISHPAL",
        designation: "वरिष्ठ अध्यापक (Senior Teacher) - Sanskrit",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "8 वर्ष 3 माह (पदभार: 05/06/2018)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9950541321"
      },
      {
        name: "JAGDISH PRAJAPAT",
        designation: "बेसिक कंप्यूटर अनुदेशक (Basic Computer Instructor)",
        department: "ICT",
        qualification: "BCA, MCA",
        experience: "3 वर्ष 5 माह (पदभार: 18/04/2023)",
        photo: "/uploads/staff/18.jpeg",
        phone: "9784730824"
      },
      {
        name: "MANISH SHARMA",
        designation: "वरिष्ठ कंप्यूटर अनुदेशक (Senior Computer Instructor)",
        department: "ICT",
        qualification: "BCA, MCA",
        experience: "3 वर्ष 7 माह (पदभार: 24/02/2023)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "8562868641"
      },
      {
        name: "ANITA MARU",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - ENGLISH",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "18 वर्ष 8 माह (पदभार: 18/01/2008)",
        photo: "/uploads/staff/20.jpeg",
        phone: "9571894862"
      },
      {
        name: "ARTI SHARMA",
        designation: "प्रयोगशाला सहायक (Lab Assistant)",
        department: "Science",
        qualification: "B.A",
        experience: "4 वर्ष 12 माह (पदभार: 29/09/2021)",
        photo: "/uploads/staff/21.jpeg",
        phone: "7240106557"
      },
      {
        name: "ASHOK KUMAR JAT",
        designation: "कनिष्ठ सहायक (Junior Assistant)",
        department: "Administration",
        qualification: "B.A., RSCIT",
        experience: "4 वर्ष 3 माह (पदभार: 21/06/2022)",
        photo: "/uploads/staff/22.jpeg",
        phone: "7877845982"
      },
      {
        name: "DHARMPAL BUGALIA",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - Mathematics/ Science",
        department: "Science",
        qualification: "B.Sc., B.Ed",
        experience: "21 वर्ष 6 माह (पदभार: 28/03/2005)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9982823574"
      },
      {
        name: "DIPANKAR SHARMA",
        designation: "प्रयोगशाला सहायक (Lab Assistant)",
        department: "Science",
        qualification: "B.Sc., B.Ed",
        experience: "4 वर्ष (पदभार: 24/09/2022)",
        photo: "/uploads/staff/24.jpeg",
        phone: "8619212002"
      },
      {
        name: "IFTEKHAR ALI",
        designation: "अतिरिक्त प्रशासनिक अधिकारी (Addl. Admin Officer)",
        department: "Administration",
        qualification: "स्नातक, बी.एड.",
        experience: "11 वर्ष 11 माह (पदभार: 31/10/2014)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9887128681"
      },
      {
        name: "KANCHAN LATA PUROHIT",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "S.T.C",
        experience: "33 वर्ष (पदभार: 20/09/1993)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "7568392031"
      },
      {
        name: "KANHAIYA LAL JANGID",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - HINDI",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed",
        experience: "30 वर्ष 8 माह (पदभार: 02/02/1996)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9887340355"
      },
      {
        name: "KAPIL MEENA",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "B.Com., M.A., B.Ed",
        experience: "20 वर्ष 3 माह (पदभार: 03/07/2006)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9982845457"
      },
      {
        name: "MEENA KUMARI",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - HINDI",
        department: "Arts",
        qualification: "B.A., M.A., NET, B.Ed., RSCIT",
        experience: "29 वर्ष 3 माह (पदभार: 03/07/1997)",
        photo: "/uploads/staff/29.jpeg",
        phone: "7737062475"
      },
      {
        name: "MONIKA BARUPAL",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "S.T.C",
        experience: "33 वर्ष 6 माह (पदभार: 31/03/1993)",
        photo: "/uploads/staff/30.jpeg",
        phone: "9460505720"
      },
      {
        name: "MUNNI DEVI",
        designation: "चतुर्थ श्रेणी कर्मचारी (Class IV)",
        department: "Administration",
        qualification: "माध्यमिक (Secondary)",
        experience: "21 वर्ष 2 माह (पदभार: 28/07/2005)",
        photo: "/uploads/staff/31.jpeg",
        phone: "9145836326"
      },
      {
        name: "NANU RAM",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - Mathematics/ Science",
        department: "Science",
        qualification: "B.Sc., B.Ed",
        experience: "18 वर्ष 1 माह (पदभार: 02/08/2008)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9784431932"
      },
      {
        name: "RISHIKA SAHARAN",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - ENGLISH",
        department: "Arts",
        qualification: "B.A., B.Ed",
        experience: "19 वर्ष 5 माह (पदभार: 26/04/2007)",
        photo: "/uploads/staff/blank-teacher.png",
        phone: "9887124545"
      },
      {
        name: "ROSHANI",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "B.A., BSTC",
        experience: "11 वर्ष 6 माह (पदभार: 23/03/2015)",
        photo: "/uploads/staff/34.jpeg",
        phone: "8094023875"
      },
      {
        name: "SEEMA KAJLA",
        designation: "अध्यापक लेवल-1 (Teacher Level-1)",
        department: "Primary / Elementary",
        qualification: "B.A., M.A., BSTC",
        experience: "11 वर्ष 6 माह (पदभार: 23/03/2015)",
        photo: "/uploads/staff/35.jpeg",
        phone: "9950731013"
      },
      {
        name: "YOGESHWERY SHARMA",
        designation: "अध्यापक लेवल-2 (Teacher Level-2) - Sanskrit",
        department: "Arts",
        qualification: "B.A., M.A., B.Ed., RSCIT",
        experience: "21 वर्ष 5 माह (पदभार: 05/04/2005)",
        photo: "/uploads/staff/36.jpeg",
        phone: "9928511626"
      },
      {
        name: "YOGITA PUROHIT",
        designation: "प्रयोगशाला सहायक (Lab Assistant)",
        department: "Science",
        qualification: "B.Sc., M.Sc",
        experience: "3 वर्ष 4 माह (पदभार: 23/05/2023)",
        photo: "/uploads/staff/37.png",
        phone: "8290730037"
      },
      {
        name: "DEVKI NANDAN SHARMA",
        designation: "चतुर्थ श्रेणी कर्मचारी (Class IV)",
        department: "Administration",
        qualification: "B.A",
        experience: "4 वर्ष 3 माह (पदभार: 21/06/2022)",
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

  // Update existing sports_events with winner details, news, and video if empty
  try {
    db.prepare(`
      UPDATE sports_events 
      SET winner_details = ?, news_content = ?, video_url = ?
      WHERE sport_name = 'Kho-Kho' AND (winner_details IS NULL OR winner_details = '')
    `).run(
      'स्वर्ण पदक विजेता टीम (जिला चैंपियन): मनीषा प्रजापत (कप्तान), पूजा कंवर, सरिता मेघवाल, सुमन शर्मा, रेखा चौधरी, कोमल सैनी, वर्षा पारीक',
      'चूरू जिला विद्यालयी क्रीड़ा प्रतियोगिता में पीएम श्री विद्यालय राजलदेसर की टीम ने सरदारशहर को रोमांचक मुकाबले में 14-8 अंकों से हराकर जिला खिताब अपने नाम किया।',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );
    db.prepare(`
      UPDATE sports_events 
      SET winner_details = ?, news_content = ?, video_url = ?
      WHERE sport_name = 'Kabaddi' AND (winner_details IS NULL OR winner_details = '')
    `).run(
      'रजत पदक विजेता एवं राज्य चयन: प्रियंका पारीक, अनीता जाट, खुशबू शेखावत, ज्योति स्वामी',
      'राज्य स्तरीय 67वीं शालेय कबड्डी चयन ट्रायल में उत्कृष्ट प्रदर्शन पर विद्यालय की 4 बालिकाओं का चयन राज्य स्तरीय प्रशिक्षण शिविर हेतु किया गया।',
      ''
    );
  } catch (e) {}

  // Seed Students if empty
  const studentsCount = db.prepare('SELECT COUNT(*) as c FROM students').get().c;
  if (studentsCount === 0) {
    const defaultStudents = [
      // Nursery
      { sr_no: 'SR-1001', roll_no: 'NUR-01', name: 'आरव प्रजापत', father_name: 'सुरेश कुमार प्रजापत', mother_name: 'कमला देवी', class_name: 'Nursery', section: 'A', gender: 'Boy', category: 'OBC', dob: '2022-04-12', phone: '9829100101', address: 'वार्ड 12, राजलदेसर' },
      { sr_no: 'SR-1002', roll_no: 'NUR-02', name: 'दीया शर्मा', father_name: 'राकेश शर्मा', mother_name: 'सुनीता देवी', class_name: 'Nursery', section: 'A', gender: 'Girl', category: 'GEN', dob: '2022-06-25', phone: '9414200202', address: 'स्टेशन रोड, राजलदेसर' },
      // LKG
      { sr_no: 'SR-1003', roll_no: 'LKG-01', name: 'लक्ष्य मेघवाल', father_name: 'ओमप्रकाश मेघवाल', mother_name: 'शांति देवी', class_name: 'LKG', section: 'A', gender: 'Boy', category: 'SC', dob: '2021-03-15', phone: '9950300303', address: 'वार्ड 05, राजलदेसर' },
      { sr_no: 'SR-1004', roll_no: 'LKG-02', name: 'अनाया बानो', father_name: 'मोहम्मद आरिफ', mother_name: 'शबाना', class_name: 'LKG', section: 'A', gender: 'Girl', category: 'OBC', dob: '2021-07-20', phone: '9784400404', address: 'किला बास, राजलदेसर' },
      // UKG
      { sr_no: 'SR-1005', roll_no: 'UKG-01', name: 'खुशी कंवर', father_name: 'भंवर सिंह', mother_name: 'मंजू कंवर', class_name: 'UKG', section: 'A', gender: 'Girl', category: 'GEN', dob: '2020-05-10', phone: '9460500505', address: 'राजपूत मौहल्ला, राजलदेसर' },
      { sr_no: 'SR-1006', roll_no: 'UKG-02', name: 'रोहित मीणा', father_name: 'रामलाल मीणा', mother_name: 'सीता देवी', class_name: 'UKG', section: 'A', gender: 'Boy', category: 'ST', dob: '2020-09-08', phone: '9610600606', address: 'वार्ड 18, राजलदेसर' },
      // Class 1
      { sr_no: 'SR-1007', roll_no: '101', name: 'प्रिया प्रजापत', father_name: 'जगदीश प्रसाद', mother_name: 'संतोष देवी', class_name: 'Class 1', section: 'A', gender: 'Girl', category: 'OBC', dob: '2019-02-14', phone: '9784730824', address: 'कुम्हार बास, राजलदेसर' },
      { sr_no: 'SR-1008', roll_no: '102', name: 'अमन खान', father_name: 'फारूक खान', mother_name: 'नसीमा', class_name: 'Class 1', section: 'A', gender: 'Boy', category: 'OBC', dob: '2019-08-19', phone: '9828800808', address: 'मदीना मस्जिद रोड, राजलदेसर' },
      // Class 2
      { sr_no: 'SR-1009', roll_no: '201', name: 'कविता स्वामी', father_name: 'महावीर प्रसाद स्वामी', mother_name: 'सुमन देवी', class_name: 'Class 2', section: 'A', gender: 'Girl', category: 'OBC', dob: '2018-03-22', phone: '9413900909', address: 'वार्ड 08, राजलदेसर' },
      { sr_no: 'SR-1010', roll_no: '202', name: 'राहुल गुर्जर', father_name: 'धर्मपाल गुर्जर', mother_name: 'कौशल्या', class_name: 'Class 2', section: 'A', gender: 'Boy', category: 'MBC', dob: '2018-11-05', phone: '9461100110', address: 'गुर्जर बस्ती, राजलदेसर' },
      // Class 3
      { sr_no: 'SR-1011', roll_no: '301', name: 'आरती पारीक', father_name: 'घनश्याम पारीक', mother_name: 'भगवती देवी', class_name: 'Class 3', section: 'A', gender: 'Girl', category: 'EWS', dob: '2017-01-30', phone: '9928120120', address: 'ब्राह्मण बास, राजलदेसर' },
      { sr_no: 'SR-1012', roll_no: '302', name: 'विकास नायक', father_name: 'कालूराम नायक', mother_name: 'रतन देवी', class_name: 'Class 3', section: 'A', gender: 'Boy', category: 'SC', dob: '2017-07-11', phone: '9672130130', address: 'नायक मौहल्ला, राजलदेसर' },
      // Class 4
      { sr_no: 'SR-1013', roll_no: '401', name: 'संगीता जाट', father_name: 'हनुमान राम जाट', mother_name: 'कृष्णा देवी', class_name: 'Class 4', section: 'A', gender: 'Girl', category: 'OBC', dob: '2016-04-18', phone: '9414140140', address: 'वार्ड 14, राजलदेसर' },
      { sr_no: 'SR-1014', roll_no: '402', name: 'सुमित टेलर', father_name: 'बाबूलाल टेलर', mother_name: 'विमला देवी', class_name: 'Class 4', section: 'A', gender: 'Boy', category: 'OBC', dob: '2016-10-09', phone: '9783150150', address: 'बाजार रोड, राजलदेसर' },
      // Class 5
      { sr_no: 'SR-1015', roll_no: '501', name: 'मनीषा सैनी', father_name: 'गजानंद सैनी', mother_name: 'तारा देवी', class_name: 'Class 5', section: 'A', gender: 'Girl', category: 'OBC', dob: '2015-05-25', phone: '9462160160', address: 'सैनी बास, राजलदेसर' },
      { sr_no: 'SR-1016', roll_no: '502', name: 'योगेश कुमार', father_name: 'विनोद कुमार', mother_name: 'सविता देवी', class_name: 'Class 5', section: 'A', gender: 'Boy', category: 'GEN', dob: '2015-12-14', phone: '9829170170', address: 'वार्ड 02, राजलदेसर' },
      // Class 6
      { sr_no: 'SR-1017', roll_no: '601', name: 'पूजा कंवर', father_name: 'सज्जन सिंह', mother_name: 'पार्वती देवी', class_name: 'Class 6', section: 'A', gender: 'Girl', category: 'GEN', dob: '2014-06-03', phone: '9982180180', address: 'वार्ड 07, राजलदेसर' },
      { sr_no: 'SR-1018', roll_no: '602', name: 'अंजलि मेघवाल', father_name: 'मदनलाल मेघवाल', mother_name: 'गीता देवी', class_name: 'Class 6', section: 'A', gender: 'Girl', category: 'SC', dob: '2014-09-17', phone: '9785190190', address: 'वार्ड 11, राजलदेसर' },
      // Class 7
      { sr_no: 'SR-1019', roll_no: '701', name: 'भावना दाधीच', father_name: 'सत्यनारायण दाधीच', mother_name: 'उमा देवी', class_name: 'Class 7', section: 'A', gender: 'Girl', category: 'GEN', dob: '2013-03-28', phone: '9414200210', address: 'दाधीच मौहल्ला, राजलदेसर' },
      { sr_no: 'SR-1020', roll_no: '702', name: 'सुरभि शर्मा', father_name: 'पवन कुमार शर्मा', mother_name: 'गायत्री देवी', class_name: 'Class 7', section: 'A', gender: 'Girl', category: 'EWS', dob: '2013-11-12', phone: '9610210220', address: 'स्टेशन रोड, राजलदेसर' },
      // Class 8
      { sr_no: 'SR-1021', roll_no: '801', name: 'रितिका प्रजापत', father_name: 'भगवानाराम प्रजापत', mother_name: 'विद्या देवी', class_name: 'Class 8', section: 'A', gender: 'Girl', category: 'OBC', dob: '2012-01-19', phone: '9460220230', address: 'वार्ड 15, राजलदेसर' },
      { sr_no: 'SR-1022', roll_no: '802', name: 'मुस्कान बानो', father_name: 'सलीम अहमद', mother_name: 'रुकसाना', class_name: 'Class 8', section: 'A', gender: 'Girl', category: 'OBC', dob: '2012-08-04', phone: '9929230240', address: 'वार्ड 03, राजलदेसर' },
      // Class 9
      { sr_no: 'SR-1023', roll_no: '901', name: 'सुमन चौधरी', father_name: 'रामेश्वरलाल चौधरी', mother_name: 'कमलेश देवी', class_name: 'Class 9', section: 'A', gender: 'Girl', category: 'OBC', dob: '2011-04-09', phone: '9828240250', address: 'वार्ड 21, राजलदेसर' },
      { sr_no: 'SR-1024', roll_no: '902', name: 'मोनिका सोनी', father_name: 'कैलाश चंद सोनी', mother_name: 'सरोज देवी', class_name: 'Class 9', section: 'A', gender: 'Girl', category: 'OBC', dob: '2011-10-23', phone: '9784250260', address: 'सोनी बास, राजलदेसर' },
      // Class 10
      { sr_no: 'SR-1025', roll_no: '1001', name: 'तन्वी पारीक', father_name: 'राजेन्द्र कुमार पारीक', mother_name: 'मंजू देवी', class_name: 'Class 10', section: 'A', gender: 'Girl', category: 'GEN', dob: '2010-02-15', phone: '9413260270', address: 'वार्ड 09, राजलदेसर' },
      { sr_no: 'SR-1026', roll_no: '1002', name: 'पूजा कंवर शेखावत', father_name: 'विजय सिंह शेखावत', mother_name: 'सुमन कंवर', class_name: 'Class 10', section: 'A', gender: 'Girl', category: 'GEN', dob: '2010-07-29', phone: '9672270280', address: 'वार्ड 16, राजलदेसर' },
      { sr_no: 'SR-1027', roll_no: '1003', name: 'किरण मेघवाल', father_name: 'सुरेंद्र कुमार', mother_name: 'लक्ष्मी देवी', class_name: 'Class 10', section: 'A', gender: 'Girl', category: 'SC', dob: '2010-11-11', phone: '9461280290', address: 'वार्ड 04, राजलदेसर' },
      // Class 11 Arts
      { sr_no: 'SR-1028', roll_no: '1101', name: 'अनिता बिश्नोई', father_name: 'भागीरथ बिश्नोई', mother_name: 'शांति देवी', class_name: 'Class 11 Arts', section: 'A', gender: 'Girl', category: 'OBC', dob: '2009-03-05', phone: '9950290300', address: 'वार्ड 13, राजलदेसर' },
      { sr_no: 'SR-1029', roll_no: '1102', name: 'नेहा सैन', father_name: 'सुरेश सैन', mother_name: 'लीला देवी', class_name: 'Class 11 Arts', section: 'A', gender: 'Girl', category: 'OBC', dob: '2009-08-16', phone: '9829300310', address: 'वार्ड 01, राजलदेसर' },
      // Class 11 Science
      { sr_no: 'SR-1030', roll_no: '1111', name: 'प्रियंका शर्मा', father_name: 'दिनेश कुमार शर्मा', mother_name: 'सुनीता शर्मा', class_name: 'Class 11 Science', section: 'A', gender: 'Girl', category: 'GEN', dob: '2009-01-20', phone: '9414310320', address: 'स्टेशन रोड, राजलदेसर' },
      { sr_no: 'SR-1031', roll_no: '1112', name: 'दिव्या प्रजापत', father_name: 'गोपाल राम प्रजापत', mother_name: 'कृष्णा देवी', class_name: 'Class 11 Science', section: 'A', gender: 'Girl', category: 'OBC', dob: '2009-06-30', phone: '9784320330', address: 'वार्ड 10, राजलदेसर' },
      // Class 11 Commerce
      { sr_no: 'SR-1032', roll_no: '1121', name: 'खुशबू अग्रवाल', father_name: 'अनिल अग्रवाल', mother_name: 'रेखा अग्रवाल', class_name: 'Class 11 Commerce', section: 'A', gender: 'Girl', category: 'GEN', dob: '2009-05-14', phone: '9460330340', address: 'मुख्य बाजार, राजलदेसर' },
      { sr_no: 'SR-1033', roll_no: '1122', name: 'मीनाक्षी सारस्वत', father_name: 'नरेश सारस्वत', mother_name: 'अनुराधा देवी', class_name: 'Class 11 Commerce', section: 'A', gender: 'Girl', category: 'EWS', dob: '2009-12-08', phone: '9610340350', address: 'वार्ड 17, राजलदेसर' },
      // Class 12 Arts
      { sr_no: 'SR-1034', roll_no: '1201', name: 'मोनिका कंवर', father_name: 'भेरू सिंह', mother_name: 'कमलेश कंवर', class_name: 'Class 12 Arts', section: 'A', gender: 'Girl', category: 'GEN', dob: '2008-04-10', phone: '9928350360', address: 'वार्ड 20, राजलदेसर' },
      { sr_no: 'SR-1035', roll_no: '1202', name: 'सीमा नायक', father_name: 'भंवरलाल नायक', mother_name: 'धापू देवी', class_name: 'Class 12 Arts', section: 'A', gender: 'Girl', category: 'SC', dob: '2008-09-24', phone: '9783360370', address: 'नायक बास, राजलदेसर' },
      // Class 12 Science
      { sr_no: 'SR-1036', roll_no: '260101', name: 'पूजा स्वामी', father_name: 'सुरेश कुमार स्वामी', mother_name: 'सरोज देवी', class_name: 'Class 12 Science', section: 'A', gender: 'Girl', category: 'OBC', dob: '2008-02-18', phone: '9414370380', address: 'वार्ड 06, राजलदेसर' },
      { sr_no: 'SR-1037', roll_no: '260102', name: 'मनीषा शर्मा', father_name: 'रमेश चंद्र शर्मा', mother_name: 'प्रेमलता देवी', class_name: 'Class 12 Science', section: 'A', gender: 'Girl', category: 'GEN', dob: '2008-07-07', phone: '9828380390', address: 'स्टेशन रोड, राजलदेसर' },
      // Class 12 Commerce
      { sr_no: 'SR-1038', roll_no: '1221', name: 'रिया सिंघल', father_name: 'सुभाष सिंघल', mother_name: 'रंजना सिंघल', class_name: 'Class 12 Commerce', section: 'A', gender: 'Girl', category: 'GEN', dob: '2008-05-12', phone: '9462390400', address: 'बाजार चौक, राजलदेसर' },
      { sr_no: 'SR-1039', roll_no: '1222', name: 'सलोनी भाटी', father_name: 'प्रहलाद भाटी', mother_name: 'संतोष भाटी', class_name: 'Class 12 Commerce', section: 'A', gender: 'Girl', category: 'OBC', dob: '2008-11-20', phone: '9672400410', address: 'वार्ड 19, राजलदेसर' }
    ];

    const insertStudent = db.prepare(`
      INSERT INTO students (sr_no, roll_no, name, father_name, mother_name, class_name, section, gender, category, dob, phone, address, admission_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of defaultStudents) {
      insertStudent.run(
        s.sr_no, s.roll_no, s.name, s.father_name, s.mother_name, s.class_name,
        s.section || 'A', s.gender, s.category || 'GEN', s.dob || '', s.phone || '',
        s.address || 'राजलदेसर', '2025-07-01', 'Active'
      );
    }
  }

  console.log("Database initialized successfully with PM SHRI Rajaldesar data.");
}

initDB();

module.exports = db;
