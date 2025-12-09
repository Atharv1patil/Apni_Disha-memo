import React, { useState } from "react";

/**
 * Simple Career Guidance Test
 * - Pure frontend, no backend
 * - Four sets of questions (DAT, Interests, Preferences, Constraints)
 * - Scores user and recommends careers with explanations
 */

/* ---------- Question Data ---------- */

// 1) DAT-style aptitude questions (self-rated, Likert 1–5)
const datQuestions = [
  {
    id: "dat_vr_1",
    dimension: "VR",
    text: "I can quickly understand complex written passages or articles.",
    type: "likert",
  },
  {
    id: "dat_vr_2",
    dimension: "VR",
    text: "I can explain ideas clearly in words, both spoken and written.",
    type: "likert",
  },
  {
    id: "dat_na_1",
    dimension: "NA",
    text: "I am comfortable working with numbers, percentages, and formulas.",
    type: "likert",
  },
  {
    id: "dat_na_2",
    dimension: "NA",
    text: "I can solve numerical problems in my head without a calculator.",
    type: "likert",
  },
  {
    id: "dat_ar_1",
    dimension: "AR",
    text: "I enjoy solving puzzles, patterns, or logic problems.",
    type: "likert",
  },
  {
    id: "dat_ar_2",
    dimension: "AR",
    text: "I can quickly spot relationships between ideas or concepts.",
    type: "likert",
  },
  {
    id: "dat_mr_1",
    dimension: "MR",
    text: "I like understanding how machines, tools, or devices work.",
    type: "likert",
  },
  {
    id: "dat_sa_1",
    dimension: "SA",
    text: "I can easily imagine how objects look when rotated in space.",
    type: "likert",
  },
  {
    id: "dat_cs_1",
    dimension: "CS",
    text: "I can work accurately on tasks that require attention to small details.",
    type: "likert",
  },
  {
    id: "dat_ls_1",
    dimension: "LS",
    text: "I rarely make spelling or basic grammar mistakes when I write.",
    type: "likert",
  },
];

// 2) RIASEC-style interest questions (1–5)
const interestQuestions = [
  {
    id: "int_realistic_1",
    dimension: "realistic",
    text: "I enjoy working with tools, machines, or physical objects.",
    type: "likert",
  },
  {
    id: "int_investigative_1",
    dimension: "investigative",
    text: "I like researching, analysing, or figuring out how things work.",
    type: "likert",
  },
  {
    id: "int_artistic_1",
    dimension: "artistic",
    text: "I like drawing, designing, music, writing, or other creative work.",
    type: "likert",
  },
  {
    id: "int_social_1",
    dimension: "social",
    text: "I enjoy helping, teaching, or supporting other people.",
    type: "likert",
  },
  {
    id: "int_enterprising_1",
    dimension: "enterprising",
    text: "I like leading projects, persuading people, or doing business.",
    type: "likert",
  },
  {
    id: "int_conventional_1",
    dimension: "conventional",
    text: "I enjoy organising information, data, or documents.",
    type: "likert",
  },
  {
    id: "int_realistic_2",
    dimension: "realistic",
    text: "I would enjoy a job that is more hands-on than desk-based.",
    type: "likert",
  },
  {
    id: "int_investigative_2",
    dimension: "investigative",
    text: "I like solving abstract or scientific problems.",
    type: "likert",
  },
  {
    id: "int_artistic_2",
    dimension: "artistic",
    text: "I value freedom to express myself in my work.",
    type: "likert",
  },
  {
    id: "int_social_2",
    dimension: "social",
    text: "I enjoy collaborating and working closely with people.",
    type: "likert",
  },
];

// 3) Work-environment preference questions
const preferenceQuestions = [
  {
    id: "pref_in_out",
    key: "indoorOutdoor",
    text: "Which work environment do you prefer?",
    type: "singleChoice",
    options: [
      { value: "indoor", label: "Mostly indoors (office / lab)" },
      { value: "outdoor", label: "Mostly outdoors / field work" },
      { value: "either", label: "Either is fine" },
    ],
  },
  {
    id: "pref_people_data_things",
    key: "peopleDataThings",
    text: "What do you enjoy working with the most?",
    type: "singleChoice",
    options: [
      { value: "people", label: "People" },
      { value: "data", label: "Data / information" },
      { value: "things", label: "Physical things / tools / machines" },
      { value: "mixed", label: "A mix of these" },
    ],
  },
  {
    id: "pref_travel",
    key: "travel",
    text: "How much travel would you prefer in your work?",
    type: "singleChoice",
    options: [
      { value: "none", label: "Little to no travel" },
      { value: "occasional", label: "Occasional travel" },
      { value: "frequent", label: "Frequent travel" },
    ],
  },
  {
    id: "pref_remote",
    key: "remote",
    text: "Do you want the option to work remotely (from home)?",
    type: "singleChoice",
    options: [
      { value: "no", label: "No, mostly on-site" },
      { value: "hybrid", label: "Hybrid (mix of office and home)" },
      { value: "yes", label: "Yes, mostly remote is preferred" },
    ],
  },
  {
    id: "pref_teamwork",
    key: "teamwork",
    text: "How much do you enjoy working in teams?",
    type: "likert",
  },
  {
    id: "pref_routine",
    key: "routine",
    text: "I prefer clear routines over constantly changing tasks.",
    type: "likert",
  },
  {
    id: "pref_stress",
    key: "stress",
    text: "I am comfortable handling high-pressure or deadline-heavy work.",
    type: "likert",
  },
  {
    id: "pref_creative",
    key: "creativeFreedom",
    text: "Having creative freedom in my work is important to me.",
    type: "likert",
  },
  {
    id: "pref_structure",
    key: "structure",
    text: "I like having clear rules, processes, and structure in my work.",
    type: "likert",
  },
  {
    id: "pref_leadership",
    key: "leadership",
    text: "I like taking charge and leading people or projects.",
    type: "likert",
  },
];

// 4) Constraints questions
const constraintQuestions = [
  {
    id: "con_education",
    key: "educationLevel",
    text: "What is the highest level of education you are realistically planning for?",
    type: "singleChoice",
    options: [
      { value: "school", label: "School level / up to 12th" },
      { value: "diploma", label: "Diploma / vocational" },
      { value: "bachelor", label: "Bachelor's degree" },
      { value: "master", label: "Master's degree" },
      { value: "phd", label: "PhD or higher" },
    ],
  },
  {
    id: "con_budget",
    key: "maxFeesPerYear",
    text: "Approximate maximum fees per year you/your family can afford (in INR, rough number).",
    type: "number",
  },
  {
    id: "con_location",
    key: "locationRegion",
    text: "Where do you prefer to study/work (broadly)?",
    type: "singleChoice",
    options: [
      { value: "local", label: "Within my current city/region" },
      { value: "national", label: "Anywhere in my country" },
      { value: "global", label: "Open to going abroad" },
    ],
  },
  {
    id: "con_family_expectation",
    key: "familyExpectations",
    text: "Does your family strongly expect a specific type of career?",
    type: "singleChoice",
    options: [
      { value: "none", label: "No strong expectations" },
      { value: "science", label: "Prefer science/engineering" },
      { value: "government", label: "Government job preferred" },
      { value: "business", label: "Business/family business preferred" },
    ],
  },
  {
    id: "con_start_earning",
    key: "startEarningSoon",
    text: "I need to start earning as soon as possible (within 1–2 years).",
    type: "likert",
  },
  {
    id: "con_years_study",
    key: "yearsWillingToStudy",
    text: "How many more years are you willing to study full-time? (roughly)",
    type: "number",
  },
  {
    id: "con_english",
    key: "englishComfort",
    text: "I am comfortable studying and working primarily in English.",
    type: "likert",
  },
  {
    id: "con_internet",
    key: "internetAccess",
    text: "I have reliable internet and a personal computer / laptop.",
    type: "likert",
  },
  {
    id: "con_city_vs_town",
    key: "cityOrTown",
    text: "Where would you prefer to live for work?",
    type: "singleChoice",
    options: [
      { value: "metro", label: "Metro / big city" },
      { value: "tier2", label: "Tier-2 / Tier-3 city" },
      { value: "rural", label: "Smaller town / rural area" },
      { value: "noPreference", label: "No strong preference" },
    ],
  },
  {
    id: "con_remote_need",
    key: "needsRemoteFriendly",
    text: "Because of personal reasons (health, family etc.), a remote-friendly career is important to me.",
    type: "likert",
  },
];

/* ---------- Career Profiles & Matching ---------- */

const careerProfiles = [
  {
    id: "software_engineer",
    name: "Software Engineer / Developer",
    requiredAptitudes: {
      VR: 0.6,
      NA: 0.7,
      AR: 1.0,
      MR: 0.2,
      SA: 0.4,
      CS: 0.4,
      LS: 0.3,
    },
    idealInterests: {
      realistic: 30,
      investigative: 80,
      artistic: 40,
      social: 30,
      enterprising: 40,
      conventional: 50,
    },
    environment: {
      indoorOutdoor: "indoor",
      peopleDataThings: "data",
      travel: "occasional",
      remote: "hybrid",
    },
    constraints: {
      minEducation: "bachelor",
      typicalFeesRange: [60000, 300000],
      locationTags: ["metros", "global"],
    },
    notes: [
      "Strong logical and abstract reasoning helps with problem-solving and coding.",
      "Comfort with numbers and structured thinking makes learning algorithms easier.",
    ],
  },
  {
    id: "mechanical_engineer",
    name: "Mechanical Engineer",
    requiredAptitudes: {
      VR: 0.4,
      NA: 0.7,
      AR: 0.7,
      MR: 1.0,
      SA: 0.8,
      CS: 0.3,
      LS: 0.3,
    },
    idealInterests: {
      realistic: 80,
      investigative: 70,
      artistic: 20,
      social: 30,
      enterprising: 40,
      conventional: 40,
    },
    environment: {
      indoorOutdoor: "mixed",
      peopleDataThings: "things",
      travel: "occasional",
      remote: "no",
    },
    constraints: {
      minEducation: "bachelor",
      typicalFeesRange: [60000, 250000],
      locationTags: ["metros", "industrial"],
    },
    notes: [
      "High mechanical and spatial ability helps in understanding machines and designs.",
      "Enjoyment of realistic, hands-on work fits well with lab and field work.",
    ],
  },
  {
    id: "graphic_designer",
    name: "Graphic / UI Designer",
    requiredAptitudes: {
      VR: 0.4,
      NA: 0.2,
      AR: 0.6,
      MR: 0.1,
      SA: 1.0,
      CS: 0.3,
      LS: 0.4,
    },
    idealInterests: {
      realistic: 30,
      investigative: 30,
      artistic: 90,
      social: 40,
      enterprising: 40,
      conventional: 30,
    },
    environment: {
      indoorOutdoor: "indoor",
      peopleDataThings: "data",
      travel: "none",
      remote: "yes",
    },
    constraints: {
      minEducation: "diploma",
      typicalFeesRange: [40000, 200000],
      locationTags: ["metros", "remote"],
    },
    notes: [
      "Strong artistic and spatial interests fit creative, design-oriented work.",
      "Work is often project-based, with good remote and freelance possibilities.",
    ],
  },
  {
    id: "teacher",
    name: "Teacher / Trainer",
    requiredAptitudes: {
      VR: 0.8,
      NA: 0.4,
      AR: 0.5,
      MR: 0.1,
      SA: 0.2,
      CS: 0.4,
      LS: 0.8,
    },
    idealInterests: {
      realistic: 30,
      investigative: 60,
      artistic: 40,
      social: 90,
      enterprising: 40,
      conventional: 50,
    },
    environment: {
      indoorOutdoor: "indoor",
      peopleDataThings: "people",
      travel: "none",
      remote: "hybrid",
    },
    constraints: {
      minEducation: "bachelor",
      typicalFeesRange: [30000, 150000],
      locationTags: ["anywhere"],
    },
    notes: [
      "Strong verbal and language skills help in explaining ideas clearly.",
      "High social interest fits working closely with students and people every day.",
    ],
  },
  {
    id: "business_sales",
    name: "Business / Sales / Marketing",
    requiredAptitudes: {
      VR: 0.7,
      NA: 0.4,
      AR: 0.5,
      MR: 0.1,
      SA: 0.3,
      CS: 0.4,
      LS: 0.5,
    },
    idealInterests: {
      realistic: 30,
      investigative: 40,
      artistic: 40,
      social: 70,
      enterprising: 90,
      conventional: 40,
    },
    environment: {
      indoorOutdoor: "mixed",
      peopleDataThings: "people",
      travel: "frequent",
      remote: "hybrid",
    },
    constraints: {
      minEducation: "bachelor",
      typicalFeesRange: [40000, 200000],
      locationTags: ["metros", "business hubs"],
    },
    notes: [
      "High enterprising and social interests fit negotiation, networking, and leadership.",
      "Good verbal skills are important for influencing and communication-heavy roles.",
    ],
  },
];

/* ---------- Scoring Helpers ---------- */

const eduOrder = ["school", "diploma", "bachelor", "master", "phd"];

function passesConstraints(userConstraints = {}, career) {
  const { educationLevel, maxFeesPerYear } = userConstraints;

  // 1) Education filter only if user actually chose something
  if (educationLevel) {
    const userEduIndex = eduOrder.indexOf(educationLevel);
    const careerEduIndex = eduOrder.indexOf(career.constraints.minEducation);

    if (
      userEduIndex !== -1 &&
      careerEduIndex !== -1 &&
      userEduIndex < careerEduIndex
    ) {
      return false;
    }
  }

  // 2) Budget filter only if budget is a valid positive number
  if (
    maxFeesPerYear !== undefined &&
    maxFeesPerYear !== null &&
    maxFeesPerYear !== ""
  ) {
    const budget = Number(maxFeesPerYear);
    if (
      !Number.isNaN(budget) &&
      career.constraints.typicalFeesRange &&
      career.constraints.typicalFeesRange[0] > budget
    ) {
      return false;
    }
  }

  return true;
}

// Convert Likert 1–5 to 0–100
function likertToPercent(value) {
  const v = Number(value || 0);
  if (!v) return 0;
  return ((v - 1) / 4) * 100;
}

function computeDatScores(datAnswers) {
  const dims = ["VR", "NA", "AR", "MR", "SA", "CS", "LS"];
  const scores = {};
  dims.forEach((dim) => {
    const relevant = datQuestions.filter((q) => q.dimension === dim);
    if (!relevant.length) {
      scores[dim] = 50;
      return;
    }
    let sum = 0;
    relevant.forEach((q) => {
      sum += likertToPercent(datAnswers[q.id]);
    });
    scores[dim] = sum / relevant.length;
  });
  return scores;
}

function computeInterestScores(interestAnswers) {
  const dims = [
    "realistic",
    "investigative",
    "artistic",
    "social",
    "enterprising",
    "conventional",
  ];
  const scores = {};
  dims.forEach((dim) => {
    const relevant = interestQuestions.filter((q) => q.dimension === dim);
    if (!relevant.length) {
      scores[dim] = 50;
      return;
    }
    let sum = 0;
    relevant.forEach((q) => {
      sum += likertToPercent(interestAnswers[q.id]);
    });
    scores[dim] = sum / relevant.length;
  });
  return scores;
}

function computeEnvScore(preferences, careerEnv) {
  let score = 50;
  if (preferences.indoorOutdoor && careerEnv.indoorOutdoor) {
    if (
      preferences.indoorOutdoor === careerEnv.indoorOutdoor ||
      preferences.indoorOutdoor === "either"
    ) {
      score += 10;
    } else {
      score -= 10;
    }
  }
  if (preferences.peopleDataThings && careerEnv.peopleDataThings) {
    if (
      preferences.peopleDataThings === careerEnv.peopleDataThings ||
      preferences.peopleDataThings === "mixed"
    ) {
      score += 10;
    } else {
      score -= 10;
    }
  }
  if (preferences.travel && careerEnv.travel) {
    if (preferences.travel === careerEnv.travel) {
      score += 10;
    } else {
      score -= 10;
    }
  }
  if (preferences.remote && careerEnv.remote) {
    if (preferences.remote === careerEnv.remote) {
      score += 10;
    } else {
      score -= 10;
    }
  }
  // clamp 0–100
  return Math.max(0, Math.min(100, score));
}

function computeAptitudeMatch(datScores, career) {
  const weights = career.requiredAptitudes || {};
  let sum = 0;
  let weightSum = 0;
  Object.keys(weights).forEach((k) => {
    const w = weights[k];
    const s = datScores[k] ?? 0;
    sum += s * w;
    weightSum += w;
  });
  if (!weightSum) return 50;
  return sum / weightSum;
}

function computeInterestMatch(interestScores, career) {
  const keys = [
    "realistic",
    "investigative",
    "artistic",
    "social",
    "enterprising",
    "conventional",
  ];
  let dot = 0,
    userNorm = 0,
    careerNorm = 0;
  keys.forEach((k) => {
    const u = interestScores[k] ?? 0;
    const c = career.idealInterests[k] ?? 0;
    dot += u * c;
    userNorm += u * u;
    careerNorm += c * c;
  });
  if (!userNorm || !careerNorm) return 50;
  const cosine = dot / (Math.sqrt(userNorm) * Math.sqrt(careerNorm)); // -1..1
  return ((cosine + 1) / 2) * 100; // -> 0..100
}

function buildUserProfile(answers) {
  const datScores = computeDatScores(answers.dat || {});
  const interestScores = computeInterestScores(answers.interests || {});

  const preferences = {
    indoorOutdoor: answers.preferences["pref_in_out"],
    peopleDataThings: answers.preferences["pref_people_data_things"],
    travel: answers.preferences["pref_travel"],
    remote: answers.preferences["pref_remote"],
  };

  const rawBudget = answers.constraints["con_budget"];
  const numericBudget = rawBudget ? Number(rawBudget) : undefined;

  const constraints = {
    educationLevel: answers.constraints["con_education"],
    maxFeesPerYear: Number.isNaN(numericBudget) ? undefined : numericBudget,
    locationRegion: answers.constraints["con_location"],
    familyExpectations: answers.constraints["con_family_expectation"],
    yearsWillingToStudy: answers.constraints["con_years_study"],
    needsRemoteFriendly: answers.constraints["con_remote_need"],
  };

  return {
    aptitudes: datScores,
    interests: interestScores,
    preferences,
    constraints,
  };
}

function rankCareers(userProfile) {
  const { aptitudes, interests, preferences, constraints } = userProfile;

  const allWithScores = careerProfiles.map((career) => {
    const aptitudeFit = computeAptitudeMatch(aptitudes, career);
    const interestFit = computeInterestMatch(interests, career);
    const envFit = computeEnvScore(preferences, career.environment);
    const overall = 0.45 * aptitudeFit + 0.35 * interestFit + 0.2 * envFit;

    const allowed = passesConstraints(constraints, career);

    return {
      career,
      overall,
      breakdown: { aptitudeFit, interestFit, envFit },
      allowed,
    };
  });

  const allowed = allWithScores
    .filter((m) => m.allowed)
    .sort((a, b) => b.overall - a.overall);

  if (allowed.length > 0) return allowed;

  // fallback: show top 3 ignoring constraints, mark as "stretch"
  return allWithScores
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 3)
    .map((m) => ({ ...m, isStretch: true }));
}

function buildExplanation(userProfile, match) {
  const { aptitudes, interests, preferences } = userProfile;
  const { career, breakdown } = match;

  // Top 2 aptitude strengths that align with the career
  const alignedApts = Object.keys(career.requiredAptitudes || [])
    .map((k) => ({
      dim: k,
      userScore: aptitudes[k] ?? 0,
      importance: career.requiredAptitudes[k] ?? 0,
    }))
    .sort((a, b) => b.importance * b.userScore - a.importance * a.userScore)
    .slice(0, 2);

  const topAptStrings = alignedApts
    .map((a) => {
      const names = {
        VR: "Verbal reasoning",
        NA: "Numerical ability",
        AR: "Abstract reasoning",
        MR: "Mechanical reasoning",
        SA: "Spatial ability",
        CS: "Clerical accuracy",
        LS: "Language / spelling",
      };
      return names[a.dim] || a.dim;
    })
    .join(" and ");

  // Top interest
  const interestNames = {
    realistic: "Realistic (hands-on / practical)",
    investigative: "Investigative (analytical / curious)",
    artistic: "Artistic (creative / design-oriented)",
    social: "Social (helping / teaching)",
    enterprising: "Enterprising (business / leadership)",
    conventional: "Conventional (organising / detail-oriented)",
  };
  const topInterest = Object.keys(interests)
    .map((k) => ({ dim: k, value: interests[k] }))
    .sort((a, b) => b.value - a.value)[0];

  const envBits = [];
  if (preferences.indoorOutdoor) {
    envBits.push(
      `a ${
        preferences.indoorOutdoor === "indoor"
          ? "mostly indoor"
          : preferences.indoorOutdoor === "outdoor"
          ? "more outdoor"
          : "flexible"
      } environment`
    );
  }
  if (preferences.peopleDataThings) {
    envBits.push(
      `working mainly with ${
        preferences.peopleDataThings === "people"
          ? "people"
          : preferences.peopleDataThings === "data"
          ? "data"
          : preferences.peopleDataThings === "things"
          ? "things/machines"
          : "a mix of people, data, and things"
      }`
    );
  }

  return {
    summary: `This career scores well overall for you (approx. ${Math.round(
      match.overall
    )} / 100).`,
    details: [
      topAptStrings &&
        `Your strengths in ${topAptStrings} line up with what ${career.name} typically needs.`,
      topInterest &&
        `Your interest profile shows a strong tilt towards ${
          interestNames[topInterest.dim]
        }, which fits many tasks in ${career.name}.`,
      envBits.length
        ? `You prefer ${envBits.join(
            " and "
          )}, which matches the common work environment for this career.`
        : null,
      `Breakdown → Aptitude fit: ${Math.round(
        breakdown.aptitudeFit
      )}/100, Interest fit: ${Math.round(
        breakdown.interestFit
      )}/100, Environment fit: ${Math.round(breakdown.envFit)}/100.`,
    ].filter(Boolean),
  };
}

/* ---------- UI Components ---------- */

const LikertOptions = [
  { value: 1, label: "1 - Strongly disagree" },
  { value: 2, label: "2 - Disagree" },
  { value: 3, label: "3 - Neutral" },
  { value: 4, label: "4 - Agree" },
  { value: 5, label: "5 - Strongly agree" },
];

function QuestionBlock({ question, value, onChange }) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "0.75rem 1rem",
        borderRadius: 8,
        border: "1px solid #eee",
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 500 }}>{question.text}</div>
      {question.type === "likert" && (
        <select
          value={value || ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          style={{ padding: "0.35rem 0.5rem", minWidth: 220 }}
        >
          <option value="">Select an option</option>
          {LikertOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {question.type === "singleChoice" && (
        <select
          value={value || ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          style={{ padding: "0.35rem 0.5rem", minWidth: 220 }}
        >
          <option value="">Select an option</option>
          {question.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {question.type === "number" && (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(question.id, e.target.value)}
          style={{ padding: "0.35rem 0.5rem", minWidth: 220 }}
        />
      )}
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function NewQuiz() {
  const [step, setStep] = useState("dat"); // 'dat' | 'interests' | 'preferences' | 'constraints' | 'results'
  const [answers, setAnswers] = useState({
    dat: {},
    interests: {},
    preferences: {},
    constraints: {},
  });
  const [results, setResults] = useState(null);

  const handleAnswerChange = (section) => (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [id]: value,
      },
    }));
  };

  const handleNext = () => {
    if (step === "dat") setStep("interests");
    else if (step === "interests") setStep("preferences");
    else if (step === "preferences") setStep("constraints");
  };

  const handleBack = () => {
    if (step === "constraints") setStep("preferences");
    else if (step === "preferences") setStep("interests");
    else if (step === "interests") setStep("dat");
  };

  const handleSubmit = () => {
    const userProfile = buildUserProfile(answers);
    const ranked = rankCareers(userProfile);
    const withExplanations = ranked.map((match) => ({
      ...match,
      explanation: buildExplanation(userProfile, match),
    }));
    setResults({
      profile: userProfile,
      matches: withExplanations,
    });
    setStep("results");
  };

  const sectionTitleMap = {
    dat: "Aptitude (DAT-style) Self-Assessment",
    interests: "Interests (RIASEC-style)",
    preferences: "Work Environment Preferences",
    constraints: "Real-World Constraints",
  };

  const currentQuestions =
    step === "dat"
      ? datQuestions
      : step === "interests"
      ? interestQuestions
      : step === "preferences"
      ? preferenceQuestions
      : constraintQuestions;

  const currentSectionKey = step;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: 12,
        border: "1px solid #ddd",
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>Career Guidance Test</h1>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        This is a simplified, self-report version combining aptitude, interests,
        preferences, and constraints. Use it as a starting point for thinking
        about your career options — not as a final verdict.
      </p>

      {step !== "results" && (
        <>
          <h2 style={{ marginBottom: "0.75rem" }}>{sectionTitleMap[step]}</h2>
          <div style={{ marginBottom: "1rem", fontSize: 14, color: "#777" }}>
            Step{" "}
            {step === "dat"
              ? "1 of 4"
              : step === "interests"
              ? "2 of 4"
              : step === "preferences"
              ? "3 of 4"
              : "4 of 4"}
          </div>

          {currentQuestions.map((q) => (
            <QuestionBlock
              key={q.id}
              question={q}
              value={answers[currentSectionKey][q.id]}
              onChange={handleAnswerChange(currentSectionKey)}
            />
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={handleBack}
              disabled={step === "dat"}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#f8f8f8",
                cursor: step === "dat" ? "not-allowed" : "pointer",
              }}
            >
              Back
            </button>

            {step !== "constraints" ? (
              <button
                onClick={handleNext}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: "0.5rem 1.2rem",
                  borderRadius: 8,
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                See Career Suggestions
              </button>
            )}
          </div>
        </>
      )}

      {step === "results" && results && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ marginBottom: "0.75rem" }}>Suggested Careers</h2>
          {results.matches.length === 0 && (
            <p>
              No careers matched your current constraints. Try adjusting
              education or budget, or talk to a human counsellor for more
              nuanced guidance.
            </p>
          )}
          {results.matches.slice(0, 5).map((match) => (
            <div
              key={match.career.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: 10,
                border: "1px solid #eee",
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <h3 style={{ margin: 0 }}>{match.career.name}</h3>
                <span
                  style={{
                    fontSize: 14,
                    padding: "0.2rem 0.5rem",
                    borderRadius: 999,
                    background: "#e0f2fe",
                    color: "#0369a1",
                  }}
                >
                  Score: {Math.round(match.overall)} / 100
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#555",
                  marginBottom: 6,
                }}
              >
                Aptitude fit:{" "}
                <strong>{Math.round(match.breakdown.aptitudeFit)}</strong> •
                Interest fit:{" "}
                <strong>{Math.round(match.breakdown.interestFit)}</strong> •
                Environment fit:{" "}
                <strong>{Math.round(match.breakdown.envFit)}</strong>
              </div>
              <p style={{ fontSize: 14, margin: "0.3rem 0" }}>
                {match.explanation.summary}
              </p>
              <ul style={{ margin: "0.2rem 0 0.4rem 1.1rem", fontSize: 14 }}>
                {match.explanation.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
              {match.career.notes && (
                <p style={{ fontSize: 13, color: "#777", marginTop: 4 }}>
                  Typical requirements: {match.career.notes.join(" ")}
                </p>
              )}
            </div>
          ))}

          <button
            onClick={() => setStep("dat")}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#f8f8f8",
              cursor: "pointer",
            }}
          >
            Retake / Adjust Answers
          </button>
        </div>
      )}
    </div>
  );
}
