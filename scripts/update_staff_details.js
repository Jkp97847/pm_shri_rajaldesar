const fs = require('fs');
const path = require('path');
const XLSX = require('../server/node_modules/xlsx');
const db = require('../server/db');

// 1. Ensure staff photos from staff/ are synced to server/uploads/staff/
const staffDir = path.join(__dirname, '..', 'staff');
const uploadsStaffDir = path.join(__dirname, '..', 'server', 'uploads', 'staff');
if (!fs.existsSync(uploadsStaffDir)) {
  fs.mkdirSync(uploadsStaffDir, { recursive: true });
}

const photoFiles = fs.readdirSync(staffDir).filter(f => !f.endsWith('.xlsx'));
for (const f of photoFiles) {
  try {
    fs.copyFileSync(path.join(staffDir, f), path.join(uploadsStaffDir, f));
  } catch (e) {
    console.error('Error copying photo:', f, e);
  }
}
console.log(`Synchronized ${photoFiles.length} staff photos to ${uploadsStaffDir}`);

// 2. Read staff details Excel
const excelPath = path.join(staffDir, 'staff details.xlsx');
const wb = XLSX.readFile(excelPath);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });

const formatExcelDate = (val) => {
  if (!val) return '';
  const num = parseInt(val, 10);
  if (!isNaN(num) && num > 20000 && num < 60000) {
    const d = new Date((num - 25569) * 86400 * 1000);
    return d.toISOString().split('T')[0];
  }
  return String(val).trim();
};

const calculateExp = (dStr) => {
  if (!dStr) return '1 वर्ष';
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return '1 वर्ष';
  const now = new Date();
  let years = now.getFullYear() - d.getFullYear();
  let months = now.getMonth() - d.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years > 0 && months > 0) return `${years} वर्ष ${months} माह`;
  if (years > 0) return `${years} वर्ष`;
  return `${months || 1} माह`;
};

// "art sciecne admistrator ye sab factly me h to hi rakho nhi to show mat karo"
const getCleanFaculty = (serial, post, subject, excelFaculty) => {
  // If Excel specifies an explicit faculty, use it if it's Arts/Science/Administration
  if (excelFaculty && excelFaculty !== '…………' && excelFaculty !== 'General') {
    const ef = String(excelFaculty).trim().toLowerCase();
    if (ef.includes('art') || ef.includes('कला')) return 'Arts';
    if (ef.includes('sci') || ef.includes('विज्ञान')) return 'Science';
    if (ef.includes('admin') || ef.includes('प्रशासन')) return 'Administration';
  }

  const p = (post || '').toLowerCase();
  const s = (subject || '').toLowerCase();

  // 1. Administration (प्रशासन): Vice Principals, Administrative Officer, Junior Assistant
  if (p.includes('vice principal') || p.includes('administrative officer') || p.includes('junior assistant')) {
    return 'Administration';
  }

  // 2. Arts / Science only for School Lecturers (I Grade):
  if (p.includes('lecturer')) {
    if (s.includes('physics') || s.includes('chemistry') || s.includes('biology')) {
      return 'Science';
    }
    if (s.includes('sanskrit') || s.includes('political') || s.includes('hindi') || s.includes('english') || s.includes('history') || s.includes('geography')) {
      return 'Arts';
    }
  }

  // Everyone else has NO faculty (Senior Teachers, Computer, Level-1, Level-2, Lab Assistant, Class IV)
  return '';
};

const findPhotoPath = (serial) => {
  if (!serial) return '/uploads/staff/user.jpg';
  const extensions = ['.jpeg', '.jpg', '.png', '.webp', '.JPEG', '.JPG', '.PNG'];
  for (const ext of extensions) {
    const filename = `${serial}${ext}`;
    if (fs.existsSync(path.join(uploadsStaffDir, filename))) {
      return `/uploads/staff/${filename}`;
    }
  }
  return '/uploads/staff/user.jpg';
};

const teachers = [];
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || !r[1]) continue;
  const serial = parseInt(r[0], 10);
  const name = String(r[1]).trim();
  const post = String(r[2] || '').trim();
  const subject = (r[3] && String(r[3]).trim() !== '…………') ? String(r[3]).trim() : '';
  const excelFaculty = (r[4] && String(r[4]).trim() !== '…………') ? String(r[4]).trim() : '';
  const joining = formatExcelDate(r[5]);
  const currJoining = formatExcelDate(r[6]);
  const study = (r[7] && String(r[7]).trim() !== '…………') ? String(r[7]).trim() : '';
  const phone = r[8] ? String(r[8]).trim() : '';

  const faculty = getCleanFaculty(serial, post, subject, excelFaculty);
  const expDate = currJoining || joining;
  const experience = calculateExp(expDate);
  const photo = findPhotoPath(serial);

  teachers.push({
    serial_no: serial,
    name,
    designation: post,
    department: faculty, // Only 'Arts', 'Science', 'Administration' or ''
    qualification: study,
    experience,
    photo,
    phone,
    subject,
    current_post: post,
    joining_date: joining,
    current_joining_date: currJoining
  });
}

console.log(`Parsed ${teachers.length} teachers from Excel.`);

// 3. Update database table
db.exec('BEGIN TRANSACTION;');
db.exec('DELETE FROM teachers;');

const insertStmt = db.prepare(`
  INSERT INTO teachers (
    name, designation, department, qualification, experience, photo, phone,
    serial_no, subject, current_post, joining_date, current_joining_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const t of teachers) {
  insertStmt.run(
    t.name,
    t.designation,
    t.department,
    t.qualification,
    t.experience,
    t.photo,
    t.phone,
    t.serial_no,
    t.subject,
    t.current_post,
    t.joining_date,
    t.current_joining_date
  );
}
db.exec('COMMIT;');

console.log(`Successfully updated database with ${teachers.length} staff records!`);

// 4. Verify from DB
const dbRows = db.prepare('SELECT serial_no, name, designation, subject, department, experience, phone, photo FROM teachers ORDER BY serial_no ASC').all();
console.log('\n--- VERIFICATION FROM DATABASE ---');
dbRows.forEach(r => {
  const facTag = r.department ? `[Faculty: ${r.department}]` : '[No Faculty - Non-faculty Staff]';
  console.log(`#${r.serial_no} ${r.name} | ${r.designation} (${r.subject || '-'}) | ${facTag} | Exp: ${r.experience} | Phone: ${r.phone} | Photo: ${r.photo}`);
});

const artsCount = dbRows.filter(r => r.department === 'Arts').length;
const sciCount = dbRows.filter(r => r.department === 'Science').length;
const adminCount = dbRows.filter(r => r.department === 'Administration').length;
const noFacCount = dbRows.filter(r => !r.department).length;
console.log(`\nSummary: Total: ${dbRows.length} | Arts: ${artsCount} | Science: ${sciCount} | Administration: ${adminCount} | Without Faculty: ${noFacCount}`);
