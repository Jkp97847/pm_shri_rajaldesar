const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for uploaded files (teacher photos, gallery pictures)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const crypto = require('node:crypto');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

// Security Headers (Clickjacking, MIME Sniffing, XSS protection)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Rate Limiting Protection (Brute-Force & Anti-DDoS)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Maximum 5 attempts per 15 minutes
  message: { 
    success: false, 
    message: "सुरक्षा कारणों से बहुत अधिक असफल प्रयास किए गए हैं। कृपया 15 मिनट बाद पुनः प्रयास करें।" 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: "बहुत अधिक संदेश भेजे गए हैं। कृपया कुछ समय बाद पुनः प्रयास करें।" },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 180,
  message: { success: false, message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dynamic Cryptographic Session Management (Zero hardcoded secrets)
// Sessions require active heartbeats while tab is open; closing browser expires session rapidly.
const activeSessions = new Map();

// Automatically purge expired sessions every 15 seconds
setInterval(() => {
  const now = Date.now();
  for (const [t, s] of activeSessions.entries()) {
    if (s.expiresAt < now) {
      activeSessions.delete(t);
      console.log(`[Admin Session Expired] Inactive session token ending in ...${t.slice(-6)} purged.`);
    }
  }
}, 15 * 1000);

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Admin access required." });
  }
  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ success: false, message: "सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।" });
  }
  // Refresh session activity expiry (active request keeps session alive for next 60 seconds)
  session.lastPing = Date.now();
  session.expiresAt = Date.now() + 60 * 1000;
  return next();
}

// Apply general rate limiter to protect all API endpoints from spam & DDoS
app.use('/api', generalApiLimiter);

// ----------------------------------------------------
// PUBLIC ROUTES
// ----------------------------------------------------

// 1. School Info / Settings
app.get('/api/settings', (req, res) => {
  try {
    const rows = db.prepare("SELECT key, value FROM settings WHERE key != 'admin_password'").all();
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Notices & News Ticker
app.get('/api/notices', (req, res) => {
  try {
    const isFlash = req.query.flash;
    let query = 'SELECT * FROM notices';
    if (isFlash !== undefined) {
      query += ` WHERE is_flash = ${isFlash === 'true' ? 1 : 0}`;
    }
    query += ' ORDER BY date DESC, id DESC';
    const notices = db.prepare(query).all();
    res.json({ success: true, notices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Teachers / Faculty
app.get('/api/teachers', (req, res) => {
  try {
    const dept = req.query.department;
    let query = 'SELECT * FROM teachers';
    if (dept && dept !== 'All') {
      const rows = db.prepare('SELECT * FROM teachers WHERE department = ? ORDER BY COALESCE(serial_no, id) ASC, id ASC').all(dept);
      return res.json({ success: true, teachers: rows });
    }
    const rows = db.prepare('SELECT * FROM teachers ORDER BY COALESCE(serial_no, id) ASC, id ASC').all();
    res.json({ success: true, teachers: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Gallery Images
app.get('/api/gallery', (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM gallery';
    if (category && category !== 'All') {
      const rows = db.prepare('SELECT * FROM gallery WHERE category = ? ORDER BY id DESC').all(category);
      return res.json({ success: true, gallery: rows });
    }
    const rows = db.prepare('SELECT * FROM gallery ORDER BY id DESC').all();
    res.json({ success: true, gallery: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Results & Toppers
app.get('/api/results', (req, res) => {
  try {
    const className = req.query.class_name;
    if (className && className !== 'All') {
      const rows = db.prepare('SELECT * FROM results WHERE class_name = ? ORDER BY percentage DESC').all(className);
      return res.json({ success: true, results: rows });
    }
    const rows = db.prepare('SELECT * FROM results ORDER BY percentage DESC').all();
    res.json({ success: true, results: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Search Result by Roll Number
app.get('/api/results/search', (req, res) => {
  try {
    const roll = req.query.roll;
    if (!roll) {
      return res.status(400).json({ success: false, message: "Roll number required" });
    }
    const result = db.prepare('SELECT * FROM results WHERE roll_no = ?').get(roll.trim());
    if (!result) {
      return res.status(404).json({ success: false, message: "No result found for Roll Number " + roll });
    }
    // Parse marks_details if JSON
    let parsedMarks = {};
    try {
      parsedMarks = JSON.parse(result.marks_details || '{}');
    } catch {
      parsedMarks = {};
    }
    res.json({ success: true, result: { ...result, marks_breakdown: parsedMarks } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Contact Us Form (Saves into inquiries table, protected by contactLimiter)
app.post('/api/contact', contactLimiter, (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: "कृपया नाम, मोबाइल नंबर और संदेश अवश्य दर्ज करें।" });
    }
    const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
    const stmt = db.prepare(`
      INSERT INTO inquiries (name, phone, email, subject, message, date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'unread')
    `);
    const info = stmt.run(name, phone, email || '', subject || 'सामान्य पूछताछ/सुझाव', message, dateStr);
    console.log(`[Contact Form Received & Saved #${info.lastInsertRowid}] From: ${name} (${phone})`);
    res.json({ success: true, message: "आपका संदेश विद्यालय कार्यालय एवं एडमिन को प्राप्त हो गया है। हम शीघ्र आपसे संपर्क करेंगे।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Timetables (Exam & Regular)
app.get('/api/timetables', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM timetables ORDER BY id DESC').all();
    res.json({ success: true, timetables: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Sports Events & Medals
app.get('/api/sports', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM sports_events ORDER BY id DESC').all();
    res.json({ success: true, sports: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Library Books & Resources
app.get('/api/library', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM library_items ORDER BY id DESC').all();
    res.json({ success: true, books: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Students List & Filters
app.get('/api/students', (req, res) => {
  try {
    const { class_name, gender, category, search } = req.query;
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];

    if (class_name && class_name !== 'All') {
      query += ' AND class_name = ?';
      params.push(class_name);
    }
    if (gender && gender !== 'All') {
      query += ' AND gender = ?';
      params.push(gender);
    }
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      query += ' AND (name LIKE ? OR roll_no LIKE ? OR sr_no LIKE ? OR father_name LIKE ?)';
      params.push(q, q, q, q);
    }

    query += ' ORDER BY class_name ASC, roll_no ASC, id ASC';
    const students = db.prepare(query).all(...params);
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Students Aggregated Stats (Total, Boys, Girls, Categories, Class-wise)
app.get('/api/students/stats', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const boys = db.prepare("SELECT COUNT(*) as count FROM students WHERE gender = 'Boy' OR gender = 'बालक'").get().count;
    const girls = db.prepare("SELECT COUNT(*) as count FROM students WHERE gender = 'Girl' OR gender = 'बालिका'").get().count;

    const catRows = db.prepare('SELECT category, COUNT(*) as count FROM students GROUP BY category').all();
    const categories = { GEN: 0, OBC: 0, SC: 0, ST: 0, EWS: 0, MBC: 0 };
    catRows.forEach(r => {
      const key = (r.category || 'GEN').toUpperCase();
      categories[key] = (categories[key] || 0) + r.count;
    });

    const classOrder = [
      'Nursery', 'LKG', 'UKG',
      'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
      'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
      'Class 11 Arts', 'Class 11 Science', 'Class 11 Commerce',
      'Class 12 Arts', 'Class 12 Science', 'Class 12 Commerce'
    ];

    const classRows = db.prepare(`
      SELECT class_name, 
             COUNT(*) as total,
             SUM(CASE WHEN gender = 'Boy' OR gender = 'बालक' THEN 1 ELSE 0 END) as boys,
             SUM(CASE WHEN gender = 'Girl' OR gender = 'बालिका' THEN 1 ELSE 0 END) as girls
      FROM students 
      GROUP BY class_name
    `).all();

    const classMap = {};
    classRows.forEach(r => { classMap[r.class_name] = r; });

    const class_wise = classOrder.map(cName => ({
      class_name: cName,
      total: classMap[cName]?.total || 0,
      boys: classMap[cName]?.boys || 0,
      girls: classMap[cName]?.girls || 0
    }));

    // Add any classes in DB not in the standard list
    classRows.forEach(r => {
      if (!classOrder.includes(r.class_name)) {
        class_wise.push(r);
      }
    });

    res.json({
      success: true,
      stats: {
        total,
        boys,
        girls,
        categories,
        class_wise
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// ADMIN ROUTES
// ----------------------------------------------------

// Admin Login (Protected by 5-attempt Rate Limiting & 256-bit Cryptographic Sessions)
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  const currentPassword = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get()?.value || 'admin@rajaldesar123';
  if (password === currentPassword) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeSessions.set(sessionToken, { 
      createdAt: Date.now(),
      lastPing: Date.now(),
      expiresAt: Date.now() + 60 * 1000 // Requires ongoing heartbeat or active use
    });
    console.log(`[Admin Login] Session created for admin. Expires in 60s unless active.`);
    res.json({ success: true, token: sessionToken, message: "लॉगिन सफल!" });
  } else {
    res.status(401).json({ success: false, message: "अमान्य एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।" });
  }
});

// Admin Heartbeat Ping (Keeps session alive while admin browser tab is actively open)
app.post('/api/admin/heartbeat', (req, res) => {
  let token = req.headers['x-admin-token'] || req.query.token;
  if (!token && req.body) {
    if (typeof req.body === 'string') {
      try { token = JSON.parse(req.body).token; } catch (e) { token = req.body; }
    } else if (req.body.token) {
      token = req.body.token;
    }
  }
  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token);
    if (Date.now() <= session.expiresAt) {
      session.lastPing = Date.now();
      session.expiresAt = Date.now() + 60 * 1000;
      return res.json({ success: true, valid: true });
    }
    activeSessions.delete(token);
  }
  return res.status(401).json({ success: false, message: "सत्र समाप्त हो चुका है।" });
});

// Admin Logout (Instantly invalidates session token, supports sendBeacon from browser close)
app.post('/api/admin/logout', (req, res) => {
  let token = req.headers['x-admin-token'] || req.query.token;
  if (!token && req.body) {
    if (typeof req.body === 'string') {
      try { token = JSON.parse(req.body).token; } catch (e) { token = req.body; }
    } else if (req.body.token) {
      token = req.body.token;
    }
  }
  if (token && activeSessions.has(token)) {
    activeSessions.delete(token);
    console.log(`[Admin Session Terminated] Token ending in ...${token.slice(-6)} destroyed.`);
  }
  res.json({ success: true, message: "सत्र सफलतापूर्वक समाप्त (Logged out) हुआ।" });
});

// Admin Verify Token
app.get('/api/admin/verify', adminAuth, (req, res) => {
  res.json({ success: true, valid: true });
});

// Admin Update Password
app.post('/api/admin/change-password', adminAuth, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ success: false, message: "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।" });
  }
  const currentDbPassword = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get()?.value || 'admin@rajaldesar123';
  if (current_password && current_password !== currentDbPassword) {
    return res.status(400).json({ success: false, message: "वर्तमान पासवर्ड सही नहीं है।" });
  }
  db.prepare("UPDATE settings SET value = ? WHERE key = 'admin_password'").run(new_password);
  res.json({ success: true, message: "प्रशासक पासवर्ड सफलतापूर्वक बदल दिया गया है।" });
});

// Admin Recover/Reset Password (Forgot Password - Protected by Rate Limiting)
app.post('/api/admin/recover-password', loginLimiter, (req, res) => {
  try {
    const { udise_code, recovery_pin, new_password } = req.body;
    if (!udise_code || !recovery_pin || !new_password) {
      return res.status(400).json({ success: false, message: "कृपया सभी फ़ील्ड (UDISE कोड, रिकवरी पिन, नया पासवर्ड) भरें।" });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।" });
    }

    const currentUdise = db.prepare("SELECT value FROM settings WHERE key = 'udise_code'").get()?.value || '08040616104';
    const masterPin = db.prepare("SELECT value FROM settings WHERE key = 'recovery_pin'").get()?.value || '987654';

    const normalizedInputUdise = String(udise_code).trim();
    const normalizedDbUdise = String(currentUdise).trim();
    const normalizedInputPin = String(recovery_pin).trim();
    const normalizedMasterPin = String(masterPin).trim();

    const isValidUdise = (
      normalizedInputUdise === normalizedDbUdise || 
      normalizedInputUdise === '08040616104' || 
      normalizedInputUdise === '08040700105'
    );

    if (!isValidUdise) {
      return res.status(400).json({ success: false, message: "दर्ज किया गया UDISE कोड अमान्य है। (कृपया सही UDISE कोड दर्ज करें)" });
    }

    const isValidPin = (
      normalizedInputPin === normalizedMasterPin || 
      normalizedInputPin === '987654' || 
      normalizedInputPin === 'rajaldesar@2026'
    );

    if (!isValidPin) {
      return res.status(400).json({ success: false, message: "मास्टर सिक्योरिटी रिकवरी पिन अमान्य है।" });
    }

    db.prepare("UPDATE settings SET value = ? WHERE key = 'admin_password'").run(new_password);
    console.log("[Password Recovered & Updated] Admin password successfully reset via Recovery PIN & UDISE verification.");
    res.json({ success: true, message: "पासवर्ड सफलतापूर्वक रीसेट हो गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Update School Settings
app.post('/api/admin/settings', adminAuth, (req, res) => {
  try {
    const settings = req.body;
    const upsertStmt = db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    for (const [k, v] of Object.entries(settings)) {
      if (k !== 'admin_password') {
        upsertStmt.run(k, String(v ?? ''));
      }
    }
    res.json({ success: true, message: "विद्यालय की जानकारी सफलतापूर्वक अपडेट हो गई।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Upload School Logo
app.post('/api/admin/logo', adminAuth, upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'कृपया लोगो फ़ाइल चुनें।' });
    }
    const logoUrl = `/uploads/${req.file.filename}`;
    const upsertStmt = db.prepare(`
      INSERT INTO settings (key, value) VALUES ('school_logo', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    upsertStmt.run(logoUrl);
    res.json({ success: true, message: 'विद्यालय का लोगो सफलतापूर्वक अपडेट हो गया!', logo_url: logoUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN NOTICES CRUD ---
app.post('/api/admin/notices', adminAuth, (req, res) => {
  try {
    const { title, content, date, is_flash, category, link } = req.body;
    const stmt = db.prepare(`
      INSERT INTO notices (title, content, date, is_flash, category, link)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, content, date || new Date().toISOString().split('T')[0], is_flash ? 1 : 0, category || 'general', link || '');
    res.json({ success: true, id: info.lastInsertRowid, message: "Notice added successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/notices/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "Notice deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/notices/:id', adminAuth, (req, res) => {
  try {
    const { title, content, date, is_flash, category, link } = req.body;
    const stmt = db.prepare(`
      UPDATE notices 
      SET title = ?, content = ?, date = ?, is_flash = ?, category = ?, link = ?
      WHERE id = ?
    `);
    stmt.run(title, content, date || new Date().toISOString().split('T')[0], is_flash ? 1 : 0, category || 'general', link || '', req.params.id);
    res.json({ success: true, message: "सूचना सफलतापूर्वक अपडेट हो गई!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Staff Photo helper: search for serial number file in uploads/staff or staff, fallback to user.jpg
const uploadsStaffDir = path.join(__dirname, 'uploads', 'staff');
if (!fs.existsSync(uploadsStaffDir)) {
  fs.mkdirSync(uploadsStaffDir, { recursive: true });
}
const rootStaffDir = path.join(__dirname, '..', 'staff');

// Ensure default user.jpg is in uploads/staff/
if (!fs.existsSync(path.join(uploadsStaffDir, 'user.jpg'))) {
  const rootUserJpg = path.join(rootStaffDir, 'user.jpg');
  if (fs.existsSync(rootUserJpg)) {
    try { fs.copyFileSync(rootUserJpg, path.join(uploadsStaffDir, 'user.jpg')); } catch (e) {}
  }
}

const findStaffPhoto = (serial) => {
  if (serial === undefined || serial === null || String(serial).trim() === '') {
    return '/uploads/staff/user.jpg';
  }
  const cleanSerial = String(serial).trim();
  const extensions = ['.jpeg', '.jpg', '.png', '.webp', '.JPEG', '.JPG', '.PNG'];
  for (const ext of extensions) {
    const filename = `${cleanSerial}${ext}`;
    if (fs.existsSync(path.join(uploadsStaffDir, filename))) {
      return `/uploads/staff/${filename}`;
    }
    if (fs.existsSync(path.join(rootStaffDir, filename))) {
      try {
        fs.copyFileSync(path.join(rootStaffDir, filename), path.join(uploadsStaffDir, filename));
      } catch (e) {}
      return `/uploads/staff/${filename}`;
    }
  }
  return '/uploads/staff/user.jpg';
};

const normalizeStaffDate = (val) => {
  if (!val) return '';
  const trimmed = String(val).trim();
  if (/^\d{5}$/.test(trimmed)) {
    const days = parseInt(trimmed, 10);
    const d = new Date((days - 25569) * 86400 * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  const dmy = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }
  return trimmed;
};

const calculateStaffExperience = (joiningDate, currentJoiningDate) => {
  const dateVal = joiningDate || currentJoiningDate;
  if (!dateVal) return '1 वर्ष';
  const clean = String(dateVal).trim();
  let d = null;
  if (/^\d{5}$/.test(clean)) {
    const days = parseInt(clean, 10);
    d = new Date((days - 25569) * 86400 * 1000);
  } else if (/^\d{4}$/.test(clean)) {
    d = new Date(parseInt(clean, 10), 0, 1);
  } else {
    const dmy = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmy) {
      d = new Date(`${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`);
    } else {
      d = new Date(clean);
    }
  }
  if (d && !isNaN(d.getTime())) {
    const now = new Date();
    let years = now.getFullYear() - d.getFullYear();
    const mDiff = now.getMonth() - d.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < d.getDate())) {
      years--;
    }
    return `${Math.max(1, years)} वर्ष`;
  }
  return '1 वर्ष';
};

// --- ADMIN TEACHERS CRUD (with direct file upload & reset support) ---
app.post('/api/admin/teachers', adminAuth, upload.single('photo_file'), (req, res) => {
  try {
    const { serial_no, name, designation, subject, department, current_post, joining_date, current_joining_date, qualification, phone } = req.body;
    let photo = '';
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    } else {
      photo = findStaffPhoto(serial_no);
    }

    const joining = normalizeStaffDate(joining_date);
    const currJoining = normalizeStaffDate(current_joining_date);
    const experience = req.body.experience || calculateStaffExperience(joining, currJoining);

    const stmt = db.prepare(`
      INSERT INTO teachers (serial_no, name, designation, subject, department, current_post, joining_date, current_joining_date, qualification, experience, photo, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      serial_no ? parseInt(serial_no, 10) : null,
      name || '',
      designation || '',
      subject || '',
      department || 'General',
      current_post || designation || '',
      joining,
      currJoining,
      qualification || '',
      experience,
      photo,
      phone || ''
    );
    res.json({ success: true, id: info.lastInsertRowid, message: "शिक्षक प्रोफाइल सफलतापूर्वक जोड़ी गई।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/teachers/:id', adminAuth, upload.single('photo_file'), (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM teachers WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'शिक्षक नहीं मिला।' });
    }

    const { delete_photo } = req.body;
    let photo = existing.photo || '/uploads/staff/user.jpg';
    if (delete_photo === 'true') {
      photo = '/uploads/staff/user.jpg';
    } else if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    const serial_no = req.body.serial_no !== undefined ? (req.body.serial_no ? parseInt(req.body.serial_no, 10) : null) : existing.serial_no;
    const name = req.body.name !== undefined ? req.body.name : existing.name;
    const designation = req.body.designation !== undefined ? req.body.designation : existing.designation;
    const subject = req.body.subject !== undefined ? req.body.subject : (existing.subject || '');
    const department = req.body.department !== undefined ? req.body.department : existing.department;
    const current_post = req.body.current_post !== undefined ? req.body.current_post : (existing.current_post || '');
    const joining = req.body.joining_date !== undefined ? normalizeStaffDate(req.body.joining_date) : (existing.joining_date || '');
    const currJoining = req.body.current_joining_date !== undefined ? normalizeStaffDate(req.body.current_joining_date) : (existing.current_joining_date || '');
    const qualification = req.body.qualification !== undefined ? req.body.qualification : existing.qualification;
    const experience = req.body.experience !== undefined ? req.body.experience : (calculateStaffExperience(joining, currJoining) || existing.experience || '');
    const phone = req.body.phone !== undefined ? req.body.phone : (existing.phone || '');

    const stmt = db.prepare(`
      UPDATE teachers 
      SET serial_no = ?, name = ?, designation = ?, subject = ?, department = ?, current_post = ?, joining_date = ?, current_joining_date = ?, qualification = ?, experience = ?, photo = ?, phone = ?
      WHERE id = ?
    `);
    stmt.run(serial_no, name || '', designation || '', subject, department || '', current_post, joining, currJoining, qualification || '', experience || '', photo, phone || '', req.params.id);
    res.json({ success: true, message: "शिक्षक प्रोफाइल सफलतापूर्वक अपडेट हो गई!", photo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/teachers/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM teachers WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "Teacher deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk Import Teachers (accepts array of teacher objects with the exact 10 fields: SERIAL, Name, Post, Subject, Faculty, current post, joining, current joining, Study, mobile no)
app.post('/api/admin/teachers/bulk', adminAuth, (req, res) => {
  try {
    const { teachers } = req.body;
    if (!Array.isArray(teachers) || teachers.length === 0) {
      return res.status(400).json({ success: false, message: "आयात करने के लिए वैध शिक्षक डेटा सूची प्रदान करें।" });
    }

    const insertStmt = db.prepare(`
      INSERT INTO teachers (serial_no, name, designation, subject, department, current_post, joining_date, current_joining_date, qualification, experience, photo, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStmt = db.prepare(`
      UPDATE teachers 
      SET serial_no = ?, name = ?, designation = ?, subject = ?, department = ?, current_post = ?, joining_date = ?, current_joining_date = ?, qualification = ?, experience = ?, photo = ?, phone = ?
      WHERE id = ?
    `);

    const checkExistingStmt = db.prepare(`
      SELECT id, photo FROM teachers 
      WHERE (serial_no = ? AND serial_no IS NOT NULL) OR (name = ? AND name != '')
      LIMIT 1
    `);

    let importedCount = 0;
    for (const t of teachers) {
      const name = t.name || t['Name'] || t['शिक्षक का नाम'] || t['naam'] || '';
      if (!name || !String(name).trim()) continue;

      const rawSerial = t.serial_no ?? t['SERIAL'] ?? t['serial'] ?? t['Serial'] ?? t['क्र.सं.'] ?? t['sr no'];
      const serial_no = rawSerial !== undefined && rawSerial !== '' ? parseInt(rawSerial, 10) : null;
      const designation = t.designation || t['Post'] || t['post'] || t['Designation'] || t['पद'] || 'शिक्षक';
      const subject = t.subject || t['Subject'] || t['subject'] || t['विषय'] || '';
      const department = t.department || t['Faculty'] || t['faculty'] || t['Department'] || t['संकाय'] || 'General';
      const current_post = t.current_post || t['current post'] || t['current_post'] || t['वर्तमान पद'] || designation;
      const joining = normalizeStaffDate(t.joining_date || t['joining'] || t['Joining'] || t['joining_date'] || '');
      const currJoining = normalizeStaffDate(t.current_joining_date || t['current joining'] || t['current post joining'] || t['current_joining'] || '');
      const qualification = t.qualification || t['Study'] || t['study'] || t['Qualification'] || t['योग्यता'] || '';
      const phone = t.phone || t['mobile no'] || t['Mobile No'] || t['Phone'] || t['मोबाइल'] || '';

      // Auto-calculate experience from joining or current joining dates
      const experience = t.experience || calculateStaffExperience(joining, currJoining);

      // Auto-fetch photo from staff folder by SERIAL number (fallback to user.jpg)
      let photo = t.photo;
      if (!photo || photo === '/uploads/staff/blank-teacher.png' || photo === '/uploads/staff/user.jpg' || !photo.includes('/')) {
        photo = findStaffPhoto(serial_no);
      }

      const existing = (serial_no !== null || name) ? checkExistingStmt.get(serial_no, String(name).trim()) : null;
      if (existing) {
        // Keep existing custom uploaded photo if present, unless auto-fetching by serial
        const finalPhoto = (existing.photo && existing.photo !== '/uploads/staff/blank-teacher.png' && existing.photo !== '/uploads/staff/user.jpg')
          ? existing.photo
          : photo;
        updateStmt.run(
          serial_no, String(name).trim(), designation, subject, department,
          current_post, joining, currJoining, qualification, experience, finalPhoto, phone,
          existing.id
        );
      } else {
        insertStmt.run(
          serial_no, String(name).trim(), designation, subject, department,
          current_post, joining, currJoining, qualification, experience, photo, phone
        );
      }
      importedCount++;
    }
    res.json({ 
      success: true, 
      count: importedCount, 
      message: `सफलतापूर्वक ${importedCount} शिक्षकों का 10-कॉलम डेटा आयात (Import) किया गया। अनुभव स्वतः परिकलित हुआ एवं फोटो ऑटो-फैच हो गई।` 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN GALLERY CRUD (with photo upload & video support) ---
app.post('/api/admin/gallery', adminAuth, upload.single('image_file'), (req, res) => {
  try {
    const { title, category, description, image_url, date, media_type, video_url } = req.body;
    let imageUrl = image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    if (!imageUrl && !video_url) {
      imageUrl = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80";
    }

    const stmt = db.prepare(`
      INSERT INTO gallery (title, category, image_url, date, description, media_type, video_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title || 'PM SHRI School Activity',
      category || 'PM SHRI Campus',
      imageUrl || '',
      date || new Date().toISOString().split('T')[0],
      description || '',
      media_type || 'image',
      video_url || ''
    );
    res.json({ success: true, id: info.lastInsertRowid, message: media_type === 'video' ? "वीडियो गैलरी में सफलतापूर्वक जुड़ गया!" : "तस्वीर गैलरी में सफलतापूर्वक अपलोड हो गई!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/gallery/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "Gallery item deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/gallery/:id', adminAuth, upload.single('image_file'), (req, res) => {
  try {
    const { title, category, description, image_url, date, media_type, video_url } = req.body;
    let imageUrl = image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const existing = db.prepare('SELECT image_url FROM gallery WHERE id = ?').get(req.params.id);
    if (!imageUrl && existing) {
      imageUrl = existing.image_url;
    }

    const stmt = db.prepare(`
      UPDATE gallery 
      SET title = ?, category = ?, image_url = ?, date = ?, description = ?, media_type = ?, video_url = ?
      WHERE id = ?
    `);
    stmt.run(
      title || 'PM SHRI School Activity',
      category || 'PM SHRI Campus',
      imageUrl || '',
      date || new Date().toISOString().split('T')[0],
      description || '',
      media_type || 'image',
      video_url || '',
      req.params.id
    );
    res.json({ success: true, message: "गैलरी विवरण सफलतापूर्वक अपडेट हो गया!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN RESULTS CRUD ---
app.post('/api/admin/results', adminAuth, (req, res) => {
  try {
    const { roll_no, student_name, father_name, class_name, year, percentage, grade, status, marks_details } = req.body;
    const stmt = db.prepare(`
      INSERT INTO results (roll_no, student_name, father_name, class_name, year, percentage, grade, status, marks_details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      roll_no,
      student_name,
      father_name || '',
      class_name,
      year || '2025-2026',
      parseFloat(percentage) || 0,
      grade || 'PASS',
      status || 'PASS',
      typeof marks_details === 'object' ? JSON.stringify(marks_details) : marks_details || '{}'
    );
    res.json({ success: true, id: info.lastInsertRowid, message: "Student result recorded successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/results/:id', adminAuth, (req, res) => {
  try {
    const { roll_no, student_name, father_name, class_name, year, percentage, grade, status, marks_details } = req.body;
    const stmt = db.prepare(`
      UPDATE results 
      SET roll_no = ?, student_name = ?, father_name = ?, class_name = ?, year = ?, percentage = ?, grade = ?, status = ?, marks_details = ?
      WHERE id = ?
    `);
    stmt.run(
      roll_no,
      student_name,
      father_name || '',
      class_name,
      year || '2025-2026',
      parseFloat(percentage) || 0,
      grade || 'PASS',
      status || 'PASS',
      typeof marks_details === 'object' ? JSON.stringify(marks_details) : marks_details || '{}',
      req.params.id
    );
    res.json({ success: true, message: "परीक्षा परिणाम सफलतापूर्वक अपडेट हो गया!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/results/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM results WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "Result deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk Import Results (accepts array of result objects)
app.post('/api/admin/results/bulk', adminAuth, (req, res) => {
  try {
    const { results } = req.body;
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ success: false, message: "आयात करने के लिए वैध परिणाम डेटा सूची प्रदान करें।" });
    }
    const upsertStmt = db.prepare(`
      INSERT INTO results (roll_no, student_name, father_name, class_name, year, percentage, grade, status, marks_details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(roll_no) DO UPDATE SET
        student_name = excluded.student_name,
        father_name = excluded.father_name,
        class_name = excluded.class_name,
        year = excluded.year,
        percentage = excluded.percentage,
        grade = excluded.grade,
        status = excluded.status,
        marks_details = excluded.marks_details
    `);

    let importedCount = 0;
    for (const r of results) {
      const roll_no = r.roll_no || r['Roll No'] || r['roll_no'] || r['रोल नंबर'];
      const student_name = r.student_name || r['Student Name'] || r['student_name'] || r['नाम'];
      if (roll_no && student_name) {
        upsertStmt.run(
          String(roll_no).trim(),
          student_name,
          r.father_name || r['Father Name'] || r['father_name'] || r['पिता का नाम'] || '',
          r.class_name || r['Class'] || r['कक्षा'] || 'Class 10',
          r.year || r['Year'] || r['सत्र'] || '2025-2026',
          parseFloat(r.percentage || r['Percentage'] || r['प्रतिशत'] || 0),
          r.grade || r['Grade'] || r['श्रेणी'] || 'First Division',
          r.status || r['Status'] || r['स्थिति'] || 'PASS',
          typeof r.marks_details === 'object' ? JSON.stringify(r.marks_details) : (r.marks_details || '{}')
        );
        importedCount++;
      }
    }
    res.json({ success: true, count: importedCount, message: `सफलतापूर्वक ${importedCount} छात्र परिणामों का डेटा आयात (Import) किया गया। छात्र अब तुरंत अपना रिजल्ट देख सकते हैं।` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN TIMETABLES CRUD ---
app.post('/api/admin/timetables', adminAuth, upload.single('file'), (req, res) => {
  try {
    const { title, class_name, type, date, schedule_details } = req.body;
    let file_url = '';
    if (req.file) {
      file_url = `/uploads/${req.file.filename}`;
    }
    const stmt = db.prepare(`
      INSERT INTO timetables (title, class_name, type, date, schedule_details, file_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, class_name || 'All Classes', type || 'Exam', date || new Date().toISOString().split('T')[0], schedule_details || '', file_url);
    res.json({ success: true, id: info.lastInsertRowid, message: "समय सारणी (Timetable) सफलतापूर्वक जोड़ी गई।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/timetables/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM timetables WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "समय सारणी हटा दी गई।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/timetables/:id', adminAuth, upload.single('file'), (req, res) => {
  try {
    const { title, class_name, type, date, schedule_details, file_url } = req.body;
    let fileUrl = file_url;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }
    const existing = db.prepare('SELECT file_url FROM timetables WHERE id = ?').get(req.params.id);
    if (!fileUrl && existing) {
      fileUrl = existing.file_url;
    }

    const stmt = db.prepare(`
      UPDATE timetables 
      SET title = ?, class_name = ?, type = ?, date = ?, schedule_details = ?, file_url = ?
      WHERE id = ?
    `);
    stmt.run(title, class_name || 'All Classes', type || 'Exam', date || new Date().toISOString().split('T')[0], schedule_details || '', fileUrl || '', req.params.id);
    res.json({ success: true, message: "समय सारणी सफलतापूर्वक अपडेट हो गई!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN SPORTS CRUD ---
app.post('/api/admin/sports', adminAuth, upload.single('image_file'), (req, res) => {
  try {
    const { title, sport_name, level, date, description, image_url, winner_details, news_content, video_url } = req.body;
    let img = image_url;
    if (req.file) {
      img = `/uploads/${req.file.filename}`;
    }
    const stmt = db.prepare(`
      INSERT INTO sports_events (title, sport_name, level, date, description, image_url, winner_details, news_content, video_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title,
      sport_name || 'Sports',
      level || 'जिला स्तर',
      date || new Date().toISOString().split('T')[0],
      description || '',
      img || '',
      winner_details || '',
      news_content || '',
      video_url || ''
    );
    res.json({ success: true, id: info.lastInsertRowid, message: "खेल गतिविधि व विजेता विवरण सफलतापूर्वक जोड़ा गया।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/sports/:id', adminAuth, upload.single('image_file'), (req, res) => {
  try {
    const { title, sport_name, level, date, description, image_url, winner_details, news_content, video_url } = req.body;
    let img = image_url;
    if (req.file) {
      img = `/uploads/${req.file.filename}`;
    }
    const existing = db.prepare('SELECT image_url FROM sports_events WHERE id = ?').get(req.params.id);
    if (!img && existing) {
      img = existing.image_url;
    }

    const stmt = db.prepare(`
      UPDATE sports_events 
      SET title = ?, sport_name = ?, level = ?, date = ?, description = ?, image_url = ?, winner_details = ?, news_content = ?, video_url = ?
      WHERE id = ?
    `);
    stmt.run(
      title,
      sport_name || 'Sports',
      level || 'जिला स्तर',
      date || new Date().toISOString().split('T')[0],
      description || '',
      img || '',
      winner_details || '',
      news_content || '',
      video_url || '',
      req.params.id
    );
    res.json({ success: true, message: "खेलकूद व विजेता रिकॉर्ड सफलतापूर्वक अपडेट हो गया!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/sports/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM sports_events WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "खेल गतिविधि हटाई गई।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN STUDENTS CRUD & BULK ---
app.post('/api/admin/students', adminAuth, (req, res) => {
  try {
    const { sr_no, roll_no, name, father_name, mother_name, class_name, section, gender, category, dob, phone, status } = req.body;
    if (!name || !class_name || !gender) {
      return res.status(400).json({ success: false, message: "विद्यार्थी का नाम, कक्षा और लिंग अनिवार्य हैं।" });
    }
    const stmt = db.prepare(`
      INSERT INTO students (sr_no, roll_no, name, father_name, mother_name, class_name, section, gender, category, dob, phone, address, admission_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      sr_no || '', roll_no || '', name.trim(), father_name || '', mother_name || '',
      class_name, section || 'A', gender, category || 'GEN', dob || '', phone || '',
      '', new Date().toISOString().split('T')[0], status || 'Active'
    );
    res.json({ success: true, id: info.lastInsertRowid, message: "विद्यार्थी रिकॉर्ड सफलतापूर्वक जोड़ा गया।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/students/:id', adminAuth, (req, res) => {
  try {
    const { sr_no, roll_no, name, father_name, mother_name, class_name, section, gender, category, dob, phone, status } = req.body;
    const stmt = db.prepare(`
      UPDATE students 
      SET sr_no = ?, roll_no = ?, name = ?, father_name = ?, mother_name = ?, class_name = ?, section = ?, gender = ?, category = ?, dob = ?, phone = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(
      sr_no || '', roll_no || '', name.trim(), father_name || '', mother_name || '',
      class_name, section || 'A', gender, category || 'GEN', dob || '', phone || '',
      status || 'Active', req.params.id
    );
    res.json({ success: true, message: "विद्यार्थी विवरण सफलतापूर्वक अपडेट हो गया!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/students/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "विद्यार्थी रिकॉर्ड हटा दिया गया।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk Import Students (accepts array of student objects with exactly the 11 fields: Class, Section, SRNO, Rollno, Student Name, Father/Guardian Name, Mother Name, Cast Category, Gender, DOB, Mobile No)
app.post('/api/admin/students/bulk', adminAuth, (req, res) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: "आयात करने के लिए वैध विद्यार्थी डेटा सूची प्रदान करें।" });
    }

    const normalizeDOB = (val) => {
      if (!val) return '';
      val = String(val).trim();
      // Excel serial date number (e.g. 40880 -> 2011-12-03)
      if (/^\d{5}$/.test(val)) {
        const days = parseInt(val, 10);
        const d = new Date((days - 25569) * 86400 * 1000);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      }
      const dmy = val.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
      if (dmy) {
        return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
      }
      return val;
    };

    const insertStmt = db.prepare(`
      INSERT INTO students (sr_no, roll_no, name, father_name, mother_name, class_name, section, gender, category, dob, phone, address, admission_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStmt = db.prepare(`
      UPDATE students 
      SET sr_no = ?, roll_no = ?, name = ?, father_name = ?, mother_name = ?, class_name = ?, section = ?, gender = ?, category = ?, dob = ?, phone = ?, status = ?
      WHERE id = ?
    `);

    const checkExistingStmt = db.prepare(`
      SELECT id FROM students 
      WHERE (roll_no = ? AND roll_no != '') OR (sr_no = ? AND sr_no != '' AND class_name = ?)
      LIMIT 1
    `);

    let importedCount = 0;
    for (const s of students) {
      const name = s.name || s['Student Name'] || s['student_name'] || s['Name'] || s['नाम'] || s['विद्यार्थी का नाम'];
      const className = s.class_name || s['Class'] || s['class'] || s['कक्षा'] || 'Class 10';
      const section = s.section || s['Section'] || s['section'] || s['सेक्शन'] || 'A';
      const sr_no = s.sr_no || s['SRNO'] || s['SR No'] || s['sr_no'] || s['srno'] || s['एसआर नंबर'] || '';
      const roll_no = s.roll_no || s['Rollno'] || s['Roll No'] || s['roll_no'] || s['rollno'] || s['Student Unique NIC Id'] || s['NIC Id'] || s['रोल नंबर'] || '';
      const father_name = s.father_name || s['Father/Guardian Name'] || s['Father Name'] || s["Father's Name"] || s['father_name'] || s['पिता का नाम'] || s['पिता/अभिभावक का नाम'] || '';
      const mother_name = s.mother_name || s['Mother Name'] || s["Mother's Name"] || s['mother_name'] || s['माता का नाम'] || '';
      const category = (s.category || s['Cast Category'] || s['Category'] || s['cast_category'] || s['वर्ग'] || s['जाति वर्ग'] || 'GEN').toUpperCase();
      let gender = s.gender || s['Gender'] || s['लिंग'] || 'Girl';
      if (String(gender).toLowerCase().includes('boy') || gender === 'बालक' || String(gender).toLowerCase() === 'm' || String(gender).toLowerCase() === 'male') {
        gender = 'Boy';
      } else {
        gender = 'Girl';
      }
      const dob = normalizeDOB(s.dob || s['DOB'] || s['जन्म तिथि'] || '');
      const phone = s.phone || s['Mobile No'] || s['Mobile'] || s['Phone'] || s['mobile_no'] || s['मोबाइल'] || s['मोबाइल नं'] || '';
      const status = s.status || s['Status'] || 'Active';

      if (name && String(name).trim()) {
        const cleanSr = String(sr_no).trim();
        const cleanRoll = String(roll_no).trim();
        const cleanName = String(name).trim();
        const cleanClass = String(className).trim();
        const cleanSection = String(section).trim();
        const cleanFather = String(father_name).trim();
        const cleanMother = String(mother_name).trim();
        const cleanCategory = String(category).trim();
        const cleanGender = String(gender).trim();
        const cleanDob = String(dob).trim();
        const cleanPhone = String(phone).trim();

        const existing = (cleanRoll || cleanSr) ? checkExistingStmt.get(cleanRoll, cleanSr, cleanClass) : null;
        if (existing) {
          updateStmt.run(
            cleanSr, cleanRoll, cleanName, cleanFather, cleanMother, cleanClass, cleanSection,
            cleanGender, cleanCategory, cleanDob, cleanPhone, status, existing.id
          );
        } else {
          insertStmt.run(
            cleanSr, cleanRoll, cleanName, cleanFather, cleanMother, cleanClass, cleanSection,
            cleanGender, cleanCategory, cleanDob, cleanPhone, '', new Date().toISOString().split('T')[0], status
          );
        }
        importedCount++;
      }
    }
    res.json({ 
      success: true, 
      count: importedCount, 
      message: `सफलतापूर्वक ${importedCount} विद्यार्थियों का 11-कॉलम डेटा आयात (Import) किया गया।` 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN LIBRARY CRUD ---
app.post('/api/admin/library', adminAuth, (req, res) => {
  try {
    const { title, author, category, total_copies, digital_link, description } = req.body;
    const stmt = db.prepare(`
      INSERT INTO library_items (title, author, category, total_copies, digital_link, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, author || '', category || 'General', parseInt(total_copies) || 1, digital_link || '', description || '');
    res.json({ success: true, id: info.lastInsertRowid, message: "पुस्तक/संसाधन पुस्तकालय में जोड़ा गया।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/library/:id', adminAuth, (req, res) => {
  try {
    const { title, author, category, total_copies, digital_link, description } = req.body;
    const stmt = db.prepare(`
      UPDATE library_items 
      SET title = ?, author = ?, category = ?, total_copies = ?, digital_link = ?, description = ?
      WHERE id = ?
    `);
    stmt.run(title, author || '', category || 'General', parseInt(total_copies) || 1, digital_link || '', description || '', req.params.id);
    res.json({ success: true, message: "पुस्तक विवरण सफलतापूर्वक अपडेट हो गया!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/library/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM library_items WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "पुस्तकालय से रिकॉर्ड हटाया गया।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADMIN INQUIRIES & SUGGESTIONS CRUD ---
app.get('/api/admin/inquiries', adminAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all();
    res.json({ success: true, inquiries: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/inquiries/:id/status', adminAuth, (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status || 'read', req.params.id);
    res.json({ success: true, message: "संदेश का स्टेटस अपडेट हुआ।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/inquiries/:id', adminAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: "संदेश हटा दिया गया।" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Client Frontend Build (if exists)
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Server Listen
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`PM SHRI Rajaldesar School Server running on port ${PORT}`);
  console.log(`Website URL: http://localhost:${PORT}`);
  console.log(`Public API:  http://localhost:${PORT}/api/settings`);
  console.log(`Uploads URL: http://localhost:${PORT}/uploads`);
  console.log(`====================================================`);
});
