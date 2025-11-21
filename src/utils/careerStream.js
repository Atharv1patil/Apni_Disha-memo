import {
  Users,
  AlertTriangle,
  Shield,
  TrendingUp,
  MapPin,
} from "lucide-react";
// ================================
// STREAMS
// ================================
export const STREAMS = [
  {
    id: "arts",
    label: {
      en: "Arts",
      hi: "आर्ट्स",
      ur: "آرٹس",
      dogri: "आर्ट्स",
      gojri: "آرٹس",
      pahari: "आर्ट्स",
      mi: "कला",
    },
  },
  {
    id: "science",
    label: {
      en: "Science",
      hi: "साइंस",
      ur: "سائنس",
      dogri: "साइंस",
      gojri: "سائنس",
      pahari: "साइंस",
      mi: "विज्ञान",
    },
  },
  {
    id: "commerce",
    label: {
      en: "Commerce",
      hi: "कॉमर्स",
      ur: "کامرس",
      dogri: "कॉमर्स",
      gojri: "کامرس",
      pahari: "कॉमर्स",
      mi: "वाणिज्य",
    },
  },
  {
    id: "vocational",
    label: {
      en: "Vocational",
      hi: "वोकेशनल",
      ur: "ووکیشنل",
      dogri: "वोकेशनल",
      gojri: "ووکیشنل",
      pahari: "वोकेशनल",
      mi: "व्यावसायिक",
    },
  },
];

// ================================
// COURSES
// ================================
export const COURSES = {
  arts: [
    {
      id: "ba",
      label: {
        en: "B.A.",
        hi: "बी.ए.",
        ur: "بی. اے.",
        dogri: "बी.ए.",
        gojri: "بی. اے.",
        pahari: "बी.ए.",
        mi: "बी.ए.",
      },
    },
    {
      id: "bfa",
      label: {
        en: "B.F.A.",
        hi: "बी.एफ.ए.",
        ur: "بی. ایف. اے.",
        dogri: "बी.एफ.ए.",
        gojri: "بی. ایف. اے.",
        pahari: "बी.एफ.ए.",
        mi: "बी.एफ.ए.",
      },
    },
  ],
  science: [
    {
      id: "bsc",
      label: {
        en: "B.Sc.",
        hi: "बी.एससी.",
        ur: "بی. ایس سی.",
        dogri: "बी.एससी.",
        gojri: "بی. ایس سی.",
        pahari: "बी.एससी.",
        mi: "बी.एस्सी.",
      },
    },
    {
      id: "btech",
      label: {
        en: "B.Tech",
        hi: "बी.टेक",
        ur: "بی. ٹیک",
        dogri: "बी.टेक",
        gojri: "بی. ٹیک",
        pahari: "बी.टेक",
        mi: "बी.टेक",
      },
    },
  ],
  commerce: [
    {
      id: "bcom",
      label: {
        en: "B.Com.",
        hi: "बी.कॉम.",
        ur: "بی. کام.",
        dogri: "बी.कॉम.",
        gojri: "بی. کام.",
        pahari: "बी.कॉम.",
        mi: "बी.कॉम.",
      },
    },
    {
      id: "bba",
      label: {
        en: "B.B.A.",
        hi: "बी.बी.ए.",
        ur: "بی. بی. اے.",
        dogri: "बी.बी.ए.",
        gojri: "بی. بی. اے.",
        pahari: "बी.बी.ए.",
        mi: "बी.बी.ए.",
      },
    },
  ],
  vocational: [
    {
      id: "diploma",
      label: {
        en: "Diploma",
        hi: "डिप्लोमा",
        ur: "ڈپلومہ",
        dogri: "डिप्लोमा",
        gojri: "ڈپلومہ",
        pahari: "डिप्लोमा",
        mi: "डिप्लोमा",
      },
    },
    {
      id: "certificate",
      label: {
        en: "Certificate Course",
        hi: "सर्टिफिकेट कोर्स",
        ur: "سرٹیفکیٹ کورس",
        dogri: "सर्टिफिकेट कोर्स",
        gojri: "سرٹیفکیٹ کورس",
        pahari: "सर्टिफिकेट कोर्स",
        mi: "प्रमाणपत्र अभ्यासक्रम",
      },
    },
  ],
};

// ================================
// COLLEGE TYPES
// ================================
export const COLLEGE_TYPES = [
  {
    id: "govt",
    label: {
      en: "Government",
      hi: "सरकारी",
      ur: "حکومتی",
      dogri: "सरकारी",
      gojri: "حکومتی",
      pahari: "सरकारी",
      mi: "सरकारी",
    },
  },
  {
    id: "private",
    label: {
      en: "Private",
      hi: "निजी",
      ur: "نجی",
      dogri: "निजी",
      gojri: "نجی",
      pahari: "निजी",
      mi: "खाजगी",
    },
  },
];

// ================================
// COLLEGES
// ================================
export const COLLEGES = {
  govt: [
    {
      id: "govt1",
      label: {
        en: "Govt College A",
        hi: "सरकारी कॉलेज ए",
        ur: "حکومتی کالج اے",
        dogri: "सरकारी कॉलेज ए",
        gojri: "حکومتی کالج اے",
        pahari: "सरकारी कॉलेज ए",
        mi: "सरकारी महाविद्यालय ए",
      },
      location: "Delhi",
    },
    {
      id: "govt2",
      label: {
        en: "Govt College B",
        hi: "सरकारी कॉलेज बी",
        ur: "حکومتی کالج بی",
        dogri: "सरकारी कॉलेज बी",
        gojri: "حکومتی کالج بی",
        pahari: "सरकारी कॉलेज बी",
        mi: "सरकारी महाविद्यालय बी",
      },
      location: "Mumbai",
    },
  ],
  private: [
    {
      id: "priv1",
      label: {
        en: "Private College X",
        hi: "निजी कॉलेज एक्स",
        ur: "نجی کالج ایکس",
        dogri: "निजी कॉलेज एक्स",
        gojri: "نجی کالج ایکس",
        pahari: "निजी कॉलेज एक्स",
        mi: "खाजगी महाविद्यालय एक्स",
      },
      location: "Bengaluru",
    },
    {
      id: "priv2",
      label: {
        en: "Private College Y",
        hi: "निजी कॉलेज वाई",
        ur: "نجی کالج وائی",
        dogri: "निजी कॉलेज वाई",
        gojri: "نجی کالج وائی",
        pahari: "निजी कॉलेज वाई",
        mi: "खाजगी महाविद्यालय वाई",
      },
      location: "Chennai",
    },
  ],
};

// ================================
// SKILLS
// ================================
export const SKILLS = [
  {
    id: "communication",
    label: {
      en: "Communication",
      hi: "संचार",
      ur: "مواصلات",
      dogri: "संचार",
      gojri: "مواصلات",
      pahari: "संचार",
      mi: "संनाद",
    },
  },
  {
    id: "coding",
    label: {
      en: "Coding",
      hi: "कोडिंग",
      ur: "کوڈنگ",
      dogri: "कोडिंग",
      gojri: "کوڈنگ",
      pahari: "कोडिंग",
      mi: "कोडिंग",
    },
  },
  {
    id: "management",
    label: {
      en: "Management",
      hi: "प्रबंधन",
      ur: "مینجمنٹ",
      dogri: "प्रबंधन",
      gojri: "مینجمنٹ",
      pahari: "प्रबंधन",
      mi: "व्यवस्थापन",
    },
  },
];

// ================================
// UPSKILLS
// ================================
export const UPSKILLS = [
  {
    id: "cert1",
    label: {
      en: "Certification 1",
      hi: "प्रमाणपत्र 1",
      ur: "سرٹیفیکیشن 1",
      dogri: "प्रमाणपत्र 1",
      gojri: "سرٹیفیکیشن 1",
      pahari: "प्रमाणपत्र 1",
      mi: "प्रमाणपत्र १",
    },
  },
  {
    id: "cert2",
    label: {
      en: "Certification 2",
      hi: "प्रमाणपत्र 2",
      ur: "سرٹیفیکیشن 2",
      dogri: "प्रमाणपत्र 2",
      gojri: "سرٹیفیکیشن 2",
      pahari: "प्रमाणपत्र 2",
      mi: "प्रमाणपत्र २",
    },
  },
];

// ================================
// SCHOLARSHIPS
// ================================
export const SCHOLARSHIPS = [
  {
    id: "sch1",
    label: {
      en: "Merit Scholarship",
      hi: "मेरिट छात्रवृत्ति",
      ur: "میرٹ سکالرشپ",
      dogri: "मेरिट छात्रवृत्ति",
      gojri: "میرٹ سکالرشپ",
      pahari: "मेरिट छात्रवृत्ति",
      mi: "गुणवत्ता शिष्यवृत्ती",
    },
  },
  {
    id: "sch2",
    label: {
      en: "Need-based Scholarship",
      hi: "आवश्यकता आधारित छात्रवृत्ति",
      ur: "ضرورت پر مبنی سکالرشپ",
      dogri: "आवश्यकता आधारित छात्रवृत्ति",
      gojri: "ضرورت پر مبنی سکالرشپ",
      pahari: "आवश्यकता आधारित छात्रवृत्ति",
      mi: "आवश्यकता आधारित शिष्यवृत्ती",
    },
  },
];

// ================================
// SAMPLE SCENARIOS
// ================================
export const SAMPLE_SCENARIOS = [
  {
    id: "sc1",
    name: "engineeringGovt",
    stream: "science",
    course: "btech",
    collegeType: "govt",
    college: "govt1",
    skills: ["coding"],
    upskill: ["cert1"],
    scholarship: "sch1",
    npv: 1200000,
    roi: 1.5,
    employmentProb: 0.85,
    startingSalary: 600000,
    timeToJob: 6,
    scholarshipOdds: 0.7,
  },
  {
    id: "sc2",
    name: "commercePrivate",
    stream: "commerce",
    course: "bcom",
    collegeType: "private",
    college: "priv1",
    skills: ["management"],
    upskill: ["cert2"],
    scholarship: "sch2",
    npv: 900000,
    roi: 1.2,
    employmentProb: 0.75,
    startingSalary: 450000,
    timeToJob: 8,
    scholarshipOdds: 0.5,
  },
];
export const PERKS = {
  jobSecurity: {
    icon: Shield,
    label: { en: "JobSecurity", hi: "नौकरीकीसुरक्षा", ur: "ملازمتکیسلامتی" },
    score: 8,
  },
  competition: {
    icon: Users,
    label: { en: "Competition", hi: "प्रतिस्पर्धा", ur: "مسابقت" },
    ratio: "1:50",
  },
  pension: {
    icon: TrendingUp,
    label: { en: "Pension", hi: "पेंशन", ur: "پنشن" },
    coverage: "80%",
  },
  startupRisk: {
    icon: AlertTriangle,
    label: { en: "StartupRisk", hi: "स्टार्टअपजोखिम", ur: "اسٹارٹاپخطرہ" },
    volatility: "High",
  },
  postings: {
    icon: MapPin,
    label: { en: "Postings", hi: "तैनाती", ur: "تعیناتی" },
    variety: "Nationwide/Global",
  },
};
// ================================
// HELPERS
// ================================
export function getLabel(item, lang = "en") {
  if (!item) return "";
  return item.label?.[lang] ?? item.label?.en ?? "";
}

export function currency(x) {
  return `₹${Number(x || 0).toLocaleString()}`;
}

// ================================
// MAIN NARRATIVE GENERATOR
// ================================
export function generateNarrative(scenario, lang = "en") {
  const streamLabel = getLabel(
    STREAMS.find((s) => s.id === scenario.stream),
    lang
  );

  const courseLabel = getLabel(
    (COURSES[scenario.stream] || []).find((c) => c.id === scenario.course),
    lang
  );

  const collegeLabel = getLabel(
    (COLLEGES[scenario.collegeType] || []).find((cl) => cl.id === scenario.college),
    lang
  );

  const skillLabels = (scenario.skills || [])
    .map((sk) => getLabel(SKILLS.find((skl) => skl.id === sk), lang))
    .join(", ");

  const upskillLabels = (scenario.upskill || [])
    .map((u) => getLabel(UPSKILLS.find((up) => up.id === u), lang))
    .join(", ");

  const scholarshipLabel = getLabel(
    SCHOLARSHIPS.find((sch) => sch.id === scenario.scholarship),
    lang
  );

  const narratives = {
    en: () =>
      `You've selected ${streamLabel} with ${courseLabel} at ${collegeLabel}. With your skills in ${skillLabels}${upskillLabels ? ` and upskilling in ${upskillLabels}` : ""}, and with a ${scholarshipLabel}, your total investment will be around ${currency(scenario.npv)}. Your expected return on investment is ${scenario.roi}. You have an ${((scenario.employmentProb || 0) * 100).toFixed(0)}% employment probability with a starting salary of ${currency(scenario.startingSalary)}. On average, it takes about ${scenario.timeToJob} months to land a job. Your scholarship odds are ${Math.round((scenario.scholarshipOdds || 0) * 100)}%. This path offers strong career prospects with quality returns on your educational investment.`,
    hi: () =>
      `आपने ${streamLabel} के साथ ${courseLabel} को ${collegeLabel} में चुना है। ${skillLabels} कौशल और ${upskillLabels ? `${upskillLabels} में अपस्किलिंग के साथ` : ""}, और ${scholarshipLabel} के साथ, आपका कुल निवेश लगभग ${currency(scenario.npv)} होगा। आपकी प्रत्याशित निवेश पर रिटर्न ${scenario.roi} है। आपके पास ${((scenario.employmentProb || 0) * 100).toFixed(0)}% रोजगार संभावना है जिसमें ${currency(scenario.startingSalary)} का शुरुआती वेतन है। औसतन नौकरी पाने में लगभग ${scenario.timeToJob} महीने लगते हैं। आपकी छात्रवृत्ति की संभावना ${Math.round((scenario.scholarshipOdds || 0) * 100)}% है। यह पथ मजबूत कैरियर संभावनाएं प्रदान करता है।`,
    ur: () =>
      `آپ نے ${streamLabel} کے ساتھ ${courseLabel} کو ${collegeLabel} میں منتخب کیا ہے۔ ${skillLabels} میں مہارت اور ${upskillLabels ? `${upskillLabels} میں اپ اسکلنگ کے ساتھ` : ""}, اور ${scholarshipLabel} کے ساتھ، آپ کی کل سرمایہ کاری تقریباً ${currency(scenario.npv)} ہوگی۔ آپ کی متوقع سرمایہ کاری پر واپسی ${scenario.roi} ہے۔ آپ کے پاس ${((scenario.employmentProb || 0) * 100).toFixed(0)}% روزگار کی امکانات ہے جس میں ${currency(scenario.startingSalary)} کی شروعاتی تنخواہ ہے۔ اوسطاً نوکری حاصل کرنے میں تقریباً ${scenario.timeToJob} مہینے لگتے ہیں۔ آپ کی وظیفہ کی امکانات ${Math.round((scenario.scholarshipOdds || 0) * 100)}% ہے۔ یہ راستہ مضبوط کیریئر کی آگے بڑھنے کی صلاحیت فراہم کرتا ہے۔`,
  };

  return narratives[lang] ? narratives[lang]() : narratives.en();
}
