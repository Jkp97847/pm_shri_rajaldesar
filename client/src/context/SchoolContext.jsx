import React, { createContext, useContext, useState, useEffect } from 'react';

const SchoolContext = createContext(null);

export function SchoolProvider({ children }) {
  const [settings, setSettings] = useState({
    school_name: "PM SHRI UNION CLUB GOVT GIRLS SENIOR SECONDARY SCHOOL",
    school_name_hi: "पीएम श्री यूनियन क्लब राजकीय बालिका उच्च माध्यमिक विद्यालय",
    school_location: "Rajaldesar, Churu, Rajasthan - 331801",
    school_address: "पीएम श्री यूनियन क्लब रा.बा.उ.मा.वि., राजलदेसर, तहसील - रतनगढ़, जिला - चूरू (राजस्थान)",
    pin_code: "331801",
    district: "चूरू (Churu)",
    state: "राजस्थान (Rajasthan)",
    udise_code: "08040700105",
    principal_name: "डॉ. सरोज शर्मा (Principal)",
    contact_phone: "01564-220145",
    contact_phone_alt: "+91 94140XXXXX",
    contact_email: "ggsss.rajaldesar@gmail.com",
    school_timing: "सोमवार से शनिवार: प्रातः 07:30 से अपराह्न 01:30",
    office_timing: "प्रातः 08:00 से दोपहर 01:00 बजे तक"
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching school settings:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SchoolContext.Provider value={{ settings, setSettings, refreshSettings, loading }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  return useContext(SchoolContext);
}
