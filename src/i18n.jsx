import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // General & Nav
    home: "Home",
    report: "Report",
    profile: "Profile",
    settings: "Settings",

    // Home
    goodMorning: "Good Morning,",
    citizen: "Citizen",
    searchPlaceholder: "Search reports by area or category...",
    liveUpdates: "Live updates near you",
    viewMap: "View Map",
    noIssues: "No issues reported yet. Check back soon.",
    details: "DETAILS",
    less: "LESS",
    justNow: "Just now",

    // Settings
    preferences: "Preferences",
    language: "Language",
    voiceToText: "Voice-to-Text",
    notifications: "Notifications",
    account: "Account",
    logOut: "Log Out",
    languageUpdated: "Language updated!",
    enabled: "enabled",
    disabled: "disabled",

    // Profile
    reports: "Reports",
    upvotes: "Upvotes",
    yourBadges: "Your Badges",
    activeReporter: "Active Reporter",
    communityHelper: "Community Helper",
    reportHistory: "Report History",
    emergencyHelpline: "Emergency Helpline (112)",
    viewedHistory: "You have viewed your report history",

    // ReportStepper
    newReport: "New Report",
    category: "Category",
    detailsTab: "Details",
    evidence: "Evidence",
    review: "Review",
    selectCategory: "Select Category",
    incidentDetails: "Incident Details",
    describeIssue: "Describe the issue clearly so officials understand.",
    descPlaceholder: "E.g., Huge pothole in the middle of the road...",
    uploadEvidence: "Upload Evidence",
    addPhotos: "Add photos or videos. Real visual proof speeds up action.",
    tapCamera: "Tap to use Camera",
    chooseGallery: "Or choose from Gallery (Max 5MB)",
    retake: "Retake",
    confirmLocation: "Confirm Location",
    pinpointArea: "Pinpoint the exact area of the issue.",
    autoDetectGPS: "Auto Detect GPS",
    detectedAddress: "Detected Address Output",
    back: "Back",
    next: "Next",
    submitReport: "Submit Report",

    // Alerts
    fileSizeError: "File size must be under 5MB",
    acquiringGPS: "Acquiring GPS fix...",
    gpsLocked: "Location locked successfully!",
    gpsError: "GPS Error: ",
    geoNotSupported: "Geolocation not supported by this browser.",
    completeFields: "Please ensure category and location are complete.",
    submitting: "Submitting report...",
    submitSuccess: "Report successfully added to database!",
    networkIssue: "Network issue. Saved offline, will sync later.",
    similarWarning: "Similar report already exists. Do you still want to submit?",

    // Categories
    "Roads": "Roads",
    "Sanitation": "Sanitation",
    "Electrical": "Electrical",
    "Water Supply": "Water Supply",
    "Public Safety": "Public Safety",
    "Other": "Other"
  },
  hi: {
    // General & Nav
    home: "मुख्य पृष्ठ",
    report: "रिपोर्ट",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",

    // Home
    goodMorning: "शुभ प्रभात,",
    citizen: "नागरिक",
    searchPlaceholder: "क्षेत्र या श्रेणी के अनुसार खोजें...",
    liveUpdates: "आपके पास लाइव अपडेट",
    viewMap: "नक्शा देखें",
    noIssues: "अभी तक कोई समस्या नहीं। वापस जांचें।",
    details: "विवरण",
    less: "कम करें",
    justNow: "अभी-अभी",

    // Settings
    preferences: "प्राथमिकताएं",
    language: "भाषा",
    voiceToText: "वॉइस-टू-टेक्स्ट",
    notifications: "सूचनाएं",
    account: "खाता",
    logOut: "लॉग आउट",
    languageUpdated: "भाषा अपडेट हो गई!",
    enabled: "चालू",
    disabled: "बंद",

    // Profile
    reports: "रिपोर्ट्स",
    upvotes: "अपवोट्स",
    yourBadges: "आपके बैज",
    activeReporter: "सक्रिय रिपोर्टर",
    communityHelper: "समुदाय सहायक",
    reportHistory: "रिपोर्ट इतिहास",
    emergencyHelpline: "आपातकालीन हेल्पलाइन (112)",
    viewedHistory: "आपने अपना रिपोर्ट इतिहास देखा है",

    // ReportStepper
    newReport: "नई रिपोर्ट",
    category: "श्रेणी",
    detailsTab: "विवरण",
    evidence: "प्रमाण",
    review: "समीक्षा",
    selectCategory: "श्रेणी चुनें",
    incidentDetails: "घटना का विवरण",
    describeIssue: "समस्या का स्पष्ट रूप से वर्णन करें...",
    descPlaceholder: "उदाहरण: सड़क के बीच में बड़ा गड्ढा...",
    uploadEvidence: "प्रमाण अपलोड करें",
    addPhotos: "तस्वीरें या वीडियो जोड़ें।",
    tapCamera: "कैमरा का उपयोग करें",
    chooseGallery: "या गैलरी से चुनें (अधिकतम 5MB)",
    retake: "पुनः प्रयास करें",
    confirmLocation: "स्थान की पुष्टि करें",
    pinpointArea: "समस्या का सटीक स्थान बताएं।",
    autoDetectGPS: "GPS स्वतः पता करें",
    detectedAddress: "पाया गया पता",
    back: "पीछे",
    next: "आगे",
    submitReport: "रिपोर्ट जमा करें",

    // Alerts
    fileSizeError: "फ़ाइल का आकार 5MB से कम होना चाहिए",
    acquiringGPS: "GPS स्थान प्राप्त कर रहा हूँ...",
    gpsLocked: "स्थान सफलतापूर्वक प्राप्त हुआ!",
    gpsError: "GPS त्रुटि: ",
    geoNotSupported: "इस ब्राउज़र में जियोलोकेशन समर्थित नहीं है।",
    completeFields: "कृपया सुनिश्चित करें कि श्रेणी और स्थान भरे हुए हैं।",
    submitting: "रिपोर्ट जमा कर रहा हूँ...",
    submitSuccess: "रिपोर्ट सफलतापूर्वक सहेजी गई!",
    networkIssue: "नेटवर्क समस्या। बाद में सिंक होगी।",
    similarWarning: "ऐसी रिपोर्ट पहले से मौजूद है। क्या आप फिर भी जमा करना चाहते हैं?",

    // Categories
    "Roads": "सड़कें",
    "Sanitation": "स्वच्छता",
    "Electrical": "विद्युत",
    "Water Supply": "जल आपूर्ति",
    "Public Safety": "सार्वजनिक सुरक्षा",
    "Other": "अन्य"
  },
  te: {
    // General & Nav
    home: "హోమ్",
    report: "రిపోర్ట్",
    profile: "ప్రొఫైల్",
    settings: "సెట్టింగులు",

    // Home
    goodMorning: "శుభోదయం,",
    citizen: "పౌరుడు",
    searchPlaceholder: "ప్రాంతం లేదా వర్గం ద్వారా శోధించండి...",
    liveUpdates: "మీ సమీపంలో ప్రత్యక్ష నవీకరణలు",
    viewMap: "మ్యాప్‌ను చూడండి",
    noIssues: "ఇంకా సమస్యలు నివేదించబడలేదు. మళ్లీ చూడండి.",
    details: "వివరాలు",
    less: "తక్కువ",
    justNow: "ఇప్పుడే",

    // Settings
    preferences: "ప్రాధాన్యతలు",
    language: "భాష",
    voiceToText: "వాయిస్-టు-టెక్స్ట్",
    notifications: "నోటిఫికేషన్లు",
    account: "ఖాతా",
    logOut: "లాగ్ అవుట్",
    languageUpdated: "భాష నవీకరించబడింది!",
    enabled: "ఆన్",
    disabled: "ఆఫ్",

    // Profile
    reports: "నివేదికలు",
    upvotes: "అప్‌వోట్లు",
    yourBadges: "మీ బ్యాడ్జీలు",
    activeReporter: "చురుకైన రిపోర్టర్",
    communityHelper: "కమ్యూనిటీ సహాయకుడు",
    reportHistory: "నివేదిక చరిత్ర",
    emergencyHelpline: "అత్యవసర హెల్ప్‌లైన్ (112)",
    viewedHistory: "మీరు మీ రిపోర్ట్ హిస్టరీని చూశారు",

    // ReportStepper
    newReport: "కొత్త నివేదిక",
    category: "వర్గం",
    detailsTab: "వివరాలు",
    evidence: "ఆధారం",
    review: "సమీక్ష",
    selectCategory: "వర్గాన్ని ఎంచుకోండి",
    incidentDetails: "సంఘటన వివరాలు",
    describeIssue: "సమస్యను స్పష్టంగా వివరించండి...",
    descPlaceholder: "ఉదా: రోడ్డు మధ్యలో పెద్ద గుంత...",
    uploadEvidence: "ఆధారాన్ని అప్‌లోడ్ చేయండి",
    addPhotos: "ఫోటోలు లేదా వీడియోలను జోడించండి.",
    tapCamera: "కెమెరాను ఉపయోగించండి",
    chooseGallery: "లేదా గ్యాలరీ నుండి ఎంచుకోండి (గరిష్టంగా 5MB)",
    retake: "మళ్లీ తీయండి",
    confirmLocation: "స్థానాన్ని నిర్ధారించండి",
    pinpointArea: "సమస్య ఉన్న ప్రాంతాన్ని గుర్తించండి.",
    autoDetectGPS: "ఆటో GPS",
    detectedAddress: "గుర్తించిన చిరునామా",
    back: "వెనుకకు",
    next: "తదుపరి",
    submitReport: "నివేదికను సమర్పించండి",

    // Alerts
    fileSizeError: "ఫైల్ పరిమాణం 5MB లోపు ఉండాలి",
    acquiringGPS: "GPS స్థానాన్ని స్వీకరిస్తోంది...",
    gpsLocked: "స్థానం విజయవంతంగా లాక్ చేయబడింది!",
    gpsError: "GPS లోపం: ",
    geoNotSupported: "ఈ బ్రౌజర్‌లో జియోలొకేషన్ మద్దతు లేదు.",
    completeFields: "దయచేసి వర్గం మరియు స్థానం పూర్తయ్యాయో లేదో నిర్ధారించుకోండి.",
    submitting: "నివేదికను సమర్పిస్తోంది...",
    submitSuccess: "నివేదిక విజయవంతంగా సేవ్ చేయబడింది!",
    networkIssue: "నెట్‌వర్క్ సమస్య. తర్వాత సింక్ చేయబడుతుంది.",
    similarWarning: "ఇలాంటి నివేదిక ఇప్పటికే ఉంది. మీరు ఇంకా సమర్పించాలనుకుంటున్నారా?",

    // Categories
    "Roads": "రోడ్లు",
    "Sanitation": "పారిశుద్ధ్యం",
    "Electrical": "విద్యుత్",
    "Water Supply": "నీటి సరఫరా",
    "Public Safety": "ప్రజా భద్రత",
    "Other": "ఇతర"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
