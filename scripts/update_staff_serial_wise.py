import zipfile
import xml.etree.ElementTree as ET
import re
import sys
import datetime
import os
import shutil
import sqlite3

sys.stdout.reconfigure(encoding='utf-8')

# 1. Parse Excel file
with zipfile.ZipFile('staff/staff details.xlsx', 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            texts = [t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text]
            shared_strings.append(''.join(texts))
    
    sheet_xml = z.read('xl/worksheets/sheet1.xml')
    tree = ET.fromstring(sheet_xml)
    
    rows = []
    for row_el in tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
        row_cells = {}
        for c in row_el.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            r = c.get('r')
            col = re.match(r'([A-Z]+)', r).group(1)
            t = c.get('t')
            val_el = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = val_el.text if val_el is not None else ''
            if t == 's' and val:
                val = shared_strings[int(val)]
            row_cells[col] = val
        rows.append(row_cells)

# Ensure destinations exist
os.makedirs('server/uploads/staff', exist_ok=True)
os.makedirs('client/public/uploads/staff', exist_ok=True)

staff_files = os.listdir('staff')

# Copy all staff photo files into both server/uploads/staff and client/public/uploads/staff
for f in staff_files:
    if f.lower().endswith(('.jpeg', '.jpg', '.png', '.webp', '.svg')):
        src_path = os.path.join('staff', f)
        dest1 = os.path.join('server/uploads/staff', f)
        dest2 = os.path.join('client/public/uploads/staff', f)
        shutil.copy2(src_path, dest1)
        shutil.copy2(src_path, dest2)
        print(f"Copied photo: {f}")

# Also ensure blank-teacher avatar is in both locations
blank_src = 'server/uploads/staff/blank-teacher.png'
if os.path.exists(blank_src):
    shutil.copy2(blank_src, 'client/public/uploads/staff/blank-teacher.png')

staff_list = []
for r in rows[1:]:
    s_val = r.get('A', '').strip()
    if not s_val or not s_val.isdigit():
        continue
    serial = int(s_val)
    name = r.get('B', '').strip()
    post = r.get('C', '').strip()
    subject = r.get('D', '').strip()
    # clean placeholders like '......' or ''
    subject = re.sub(r'^[.…\s]+$', '', subject)
    joining = r.get('E', '').strip()
    study = r.get('F', '').strip()
    study = re.sub(r'^[.…\s]+$', '', study)
    mobile = r.get('G', '').strip()
    
    # Check photo matching serial
    photo_file = None
    for ext in ['.jpeg', '.jpg', '.png']:
        candidate = f"{serial}{ext}"
        if candidate in staff_files:
            photo_file = candidate
            break
            
    staff_list.append({
        'serial': serial,
        'name': name,
        'post': post,
        'subject': subject,
        'joining': joining,
        'study': study,
        'mobile': mobile,
        'photo_file': photo_file
    })

# Strictly sort by serial number: 1, 2, 3, ... 37
staff_list.sort(key=lambda x: x['serial'])

epoch = datetime.date(1899, 12, 30)
today = datetime.date(2026, 9, 29)

records = []
for s in staff_list:
    # 1. Experience from joining date to today
    exp_str = 'अनुभवी शिक्षक'
    joining_date_str = ''
    if s['joining'] and s['joining'].isdigit():
        j_date = epoch + datetime.timedelta(days=int(s['joining']))
        joining_date_str = j_date.strftime('%Y-%m-%d')
        total_months = (today.year - j_date.year) * 12 + (today.month - j_date.month)
        if total_months > 0:
            years = total_months // 12
            months = total_months % 12
            if years > 0 and months > 0:
                exp_str = f"{years} वर्ष {months} माह"
            elif years > 0:
                exp_str = f"{years} वर्ष"
            else:
                exp_str = f"{months} माह"

    # 2. Department logic
    dept = 'General'
    p_lower = s['post'].lower()
    subj_lower = s['subject'].lower()
    
    if 'principal' in p_lower:
        dept = 'Administration'
    elif 'computer' in p_lower or 'computer' in subj_lower:
        dept = 'ICT'
    elif 'physics' in subj_lower or 'chemistry' in subj_lower or 'biology' in subj_lower or 'science' in subj_lower or 'math' in subj_lower or 'lab' in p_lower:
        dept = 'Science'
    elif 'hindi' in subj_lower or 'sanskrit' in subj_lower or 'english' in subj_lower or 'urdu' in subj_lower or 'political' in subj_lower:
        dept = 'Arts'
    elif 'level-1' in p_lower or 'level-2' in p_lower:
        dept = 'Elementary'
    elif 'administrative' in p_lower or 'assistant' in p_lower or 'class iv' in p_lower:
        dept = 'Administration'

    # 3. Designation formatting
    if s['subject'] and s['subject'] not in s['post']:
        designation = f"{s['post']} ({s['subject']})"
    else:
        designation = s['post']

    # 4. Photo path
    if s['photo_file']:
        photo_path = f"/uploads/staff/{s['photo_file']}"
    else:
        photo_path = "/uploads/staff/blank-teacher.png"

    qualification = s['study'] if s['study'] else 'सुयोग्य'

    records.append({
        'id': s['serial'],
        'name': s['name'],
        'designation': designation,
        'department': dept,
        'qualification': qualification,
        'experience': exp_str,
        'photo': photo_path,
        'phone': s['mobile']
    })

print(f"\nPrepared {len(records)} staff records sorted by serial number:")
for r in records:
    print(f"#{r['id']:2} | {r['name']:25} | {r['designation']:35} | {r['department']:14} | {r['experience']:14} | {r['photo']}")

# 5. Update SQLite database
conn = sqlite3.connect('server/school.db')
cursor = conn.cursor()

# Replace all teachers with the newly sorted serial-wise records
cursor.execute("DELETE FROM teachers")

for r in records:
    cursor.execute("""
        INSERT INTO teachers (id, name, designation, department, qualification, experience, photo, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (r['id'], r['name'], r['designation'], r['department'], r['qualification'], r['experience'], r['photo'], r['phone']))

conn.commit()
print("\nSuccessfully updated 'teachers' table in server/school.db with all 37 teachers in serial order 1 to 37!")

# Verify count & order
cursor.execute("SELECT id, name, designation, photo FROM teachers ORDER BY id ASC")
saved_rows = cursor.fetchall()
print(f"Total rows in teachers table: {len(saved_rows)}")
for sr in saved_rows[:5]:
    print(" ", sr)
for sr in saved_rows[-5:]:
    print(" ", sr)

conn.close()
