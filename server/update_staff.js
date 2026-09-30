const XLSX = require('./node_modules/xlsx');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// 1. Ensure staff photos from staff/ are synced to server/uploads/staff/
const staffDir = path.join(__dirname, '..', 'staff');
const uploadsStaffDir = path.join(__dirname, 'uploads', 'staff');
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
console.log('Synchronized ' + photoFiles.length + ' staff photos.');

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

const inferFaculty = (post, subject, faculty) => {
  if (faculty && faculty !== 'General' && faculty !== '…………') return faculty;
  const p = (post || '').toLowerCase();
  const s = (subject || '').toLowerCase();
  if (p.includes('vice principal') || p.includes('principal') || p.includes('officer') || p.includes('assistant') || p.includes('class iv')) {
    return 'Administration';
  }
  if (p.includes('computer') || s.includes('computer')) return 'ICT';
  if (p.includes('level-1')) return 'Primary / Elementary';
  if (s.includes('physics') || s.includes('chemistry') || s.includes('biology') || s.includes('science') || s.includes('mathematics') || s.includes('math')) {
    return 'Science';
  }
  if (s.includes('hindi') || s.includes('english') || s.includes('sanskrit') || s.includes('urdu') || s.includes('political') || s.includes('history') || s.includes('arts')) {
    return 'Arts';
  }
  return 'General';
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
  let faculty = (r[4] && String(r[4]).trim() !== '…………') ? String(r[4]).trim() : '';
  const joining = formatExcelDate(r[5]);
  const currJoining = formatExcelDate(r[6]);
  const study = (r[7] && String(r[7]).trim() !== '…………') ? String(r[7]).trim() : '';
  const phone = r[8] ? String(r[8]).trim() : '';

  faculty = inferFaculty(post, subject, faculty);
  if (serial === 8) faculty = 'Arts'; // Rikha Ram faculty is Arts

  const expDate = currJoining || joining;
  const experience = calculateExp(expDate);
  const photo = findPhotoPath(serial);

  teachers.push({
    serial_no: serial,
    name,
    designation: post,
    subject,
    department: faculty,
    current_post: post,
    joining_date: joining,
    current_joining_date: currJoining,
    qualification: study,
    experience,
    phone,
    photo
  });
}

console.log(`Parsed ${teachers.length} teachers from Excel.`);

// 3. Login to server to get admin token
const loginBody = JSON.stringify({ password: 'admin@rajaldesar123' });
const loginReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginBody)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const loginRes = JSON.parse(data);
    if (!loginRes.success) {
      console.error('Login failed:', loginRes);
      process.exit(1);
    }
    const token = loginRes.token;
    console.log('Logged in successfully. Admin token acquired.');

    // 4. Send bulk teachers update
    const bulkBody = JSON.stringify({ teachers });
    const bulkReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/teachers/bulk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bulkBody),
        'x-admin-token': token
      }
    }, (bulkRes) => {
      let bData = '';
      bulkRes.on('data', chunk => bData += chunk);
      bulkRes.on('end', () => {
        const bResult = JSON.parse(bData);
        console.log('Bulk Update Result:', bResult);

        // 5. Verify by querying GET /api/teachers
        http.get('http://localhost:5000/api/teachers', (getRes) => {
          let gData = '';
          getRes.on('data', chunk => gData += chunk);
          getRes.on('end', () => {
            const getJson = JSON.parse(gData);
            console.log(`Verification: ${getJson.teachers.length} teachers retrieved.`);
            getJson.teachers.forEach(t => {
              console.log(`#${t.serial_no} ${t.name} | ${t.designation} (${t.subject || '-'}) | ${t.department} | ${t.experience} | ${t.phone} | Photo: ${t.photo}`);
            });
            process.exit(0);
          });
        });
      });
    });
    bulkReq.write(bulkBody);
    bulkReq.end();
  });
});
loginReq.write(loginBody);
loginReq.end();
