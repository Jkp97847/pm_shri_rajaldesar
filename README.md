# PM SHRI UNION CLUB GOVT GIRLS SENIOR SECONDARY SCHOOL, RAJALDESAR (CHURU)
### पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय, राजलदेसर (चूरू, राजस्थान)

A full-stack, responsive, and modern website tailored specifically for PM SHRI Union Club Govt Girls Senior Secondary School, Rajaldesar.

---

## 🌟 Key Features & Pages

1. **मुख्य पृष्ठ (Home)**:
   - Dynamic top announcement ticker with latest news.
   - National & PM SHRI branding with Indian Tricolor accents & school motto *"सा विद्या या विमुक्तये"*.
   - Responsive hero slider showcasing smart classrooms, girl child education, sports, and board exam results.
   - School statistics counters (1,150+ Girls Enrolled, 100% Board Pass Rate, 35+ Staff, 20+ Smart Labs).
   - Principal Desk message (Dr. Saroj Sharma).
   - Live Notice Board with categorized tabs (All, Admission, Exam, Sports).
   - Key facilities showcase (ICT Lab, Library, Science Labs, Sports Field).
   - Academic board exam toppers and star student wall.

2. **शिक्षक वृंद (Faculty / Teachers)**:
   - Complete faculty directory with photos, designations, qualifications, and experience.
   - Filter by department: Administration, Science, Arts, Commerce, ICT, Sports.
   - Live search by teacher name or subject.

3. **परीक्षा परिणाम पोर्टल (Result Portal)**:
   - Roll number search with instant printable marksheet layout.
   - Test roll numbers: `260101`, `260102`, `260103`, `260104`, `260105`.
   - Subject-wise marks breakdown, percentage, division, and pass status.
   - Board exam merit list and school toppers showcase.

4. **कक्षाएं एवं संकाय (Classes & Academics)**:
   - Primary Wing (Class 1 to 5), Upper Primary (Class 6 to 8), Secondary (Class 9 & 10), and Senior Secondary (Class 11 & 12).
   - Government welfare schemes for girls (Gargi Puraskar, Balika Protsahan, Free Uniforms/Textbooks, Transport Voucher, Mid-day meal, Self Defence).

5. **पुस्तकालय एवं ई-वाचनालय (Library)**:
   - 5,000+ books catalog (NCERT/RBSE, Literature, NEET/JEE/CUET competitive exam prep).
   - Direct integration links to National Digital Library of India (NDLI) and DIKSHA portal.
   - Reading room guidelines.

6. **खेलकूद एवं शारीरिक शिक्षा (Game & Sports)**:
   - Kho-Kho (District Champions), Kabaddi, Athletics, Volleyball & Badminton.
   - Daily Yoga & Surya Namaskar sessions.
   - Rani Laxmibai Self Defence (मार्शल आर्ट्स) training.

7. **कंप्यूटर व रोबोटिक्स लैब (Computer Lab & ICT)**:
   - 40+ Core i5 networked systems, optic fiber internet, interactive 75-inch flat panel display, online UPS backup.
   - Practical curriculum: Computer fundamentals, typing, MS Office, Scratch coding, Python, HTML/CSS web design, cyber security.

8. **पाठ्यक्रम एवं व्यावसायिक कौशल (Courses & Vocational Skills)**:
   - Senior Secondary streams: Science (Bio/Maths), Arts (Literature/Humanities), Commerce.
   - PM SHRI NEP 2020 Vocational trades: IT & Computer Applications, Apparel & Tailoring, Beauty & Wellness, Healthcare Basics.

9. **छायाचित्र दीर्घा (Photo Gallery)**:
   - Filterable categories: PM SHRI Campus, Events, Sports, Science Fair.
   - Modal Lightbox viewer for full-screen inspection.
   - Live photo uploads from Admin panel.

10. **विद्यालय परिचय एवं संपर्क (About School & Contact)**:
    - History of 'Union Club' heritage in Rajaldesar and upgrade to PM SHRI model school.
    - Vision and Mission.
    - Interactive inquiry form that submits directly to `/api/contact`.
    - School address, phone, email, UDISE code (`08040700105`), and office hours.

11. **विद्यालय प्रबंधन एवं नियंत्रण कक्ष (Admin Panel - `/admin`)**:
    - Protected by password authentication.
    - **Notices Manager**: Add/Delete flash notices and announcements.
    - **Teacher Profile Manager**: Add new teacher with details and direct photo file upload (Multer).
    - **Gallery Manager**: Upload new photos with category, title, description directly to `/uploads`.
    - **Result Manager**: Record student roll number, name, class, marks, percentage, and grade.

---

## 🔐 Admin Credentials

- **Admin Portal URL**: `http://localhost:5000/admin`
- **Default Password**: `admin@rajaldesar123`
*(Password can be updated from the admin panel)*

---

## 🚀 How to Run

### Quick Start (Double Click)
Double-click `start.bat` in the project root directory. It will start the server and automatically launch the website in your browser!

### Manual Start via Terminal
1. Open PowerShell or Command Prompt.
2. Run:
   ```powershell
   cd "C:\Users\pc\.gemini\antigravity\scratch\pm-shri-rajaldesar-school\server"
   node server.js
   ```
3. Open `http://localhost:5000` in your web browser.
