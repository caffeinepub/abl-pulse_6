// ─────────────────────────────────────────────
// ABL PULSE – Section 1: Water Questions (Q1–Q5)
// Suggestion cards for all 3 categories.
// Rule: score 0-1 = needs_attention | 2 = building_zone | 3-4 = strong_area
// ─────────────────────────────────────────────

export type SuggestionCategory =
  | "needs_attention"
  | "building_zone"
  | "strong_area";

export interface SuggestionCard {
  en: string;
  hi: string;
}

export interface QuestionSuggestions {
  label: string; // short name for the rule/habit
  needs_attention: SuggestionCard;
  building_zone: SuggestionCard;
  strong_area: SuggestionCard;
}

// ── Q1: Morning Ritual (उषापान) ──
const q1: QuestionSuggestions = {
  label: "Morning Ritual (उषापान)",
  needs_attention: {
    en: "Start tomorrow: 1–2 glasses of warm water before rinsing. Detox your gut!",
    hi: "कल सुबह से शुरू करें: बिना कुल्ला किए 1-2 गिलास गुनगुना पानी। गट को डिटॉक्स करें!",
  },
  building_zone: {
    en: "Stay consistent! Detox your gut and feel better every day.",
    hi: "नियम बनाए रखें, शरीर को डिटॉक्स करें! निरंतरता ही जीत है।",
  },
  strong_area: {
    en: "Mastering 'Usha Paan'—a core Ayurvedic habit. Keep going!",
    hi: "शानदार! आप 'उषा पान' का पालन कर रहे हैं। इसे जारी रखें!",
  },
};

// ── Q2: Drinking Posture (Sit & Sip) ──
const q2: QuestionSuggestions = {
  label: "Drinking Posture (Sit & Sip)",
  needs_attention: {
    en: "Drinking water quickly while standing up can really mess with your digestion and joints. Make it a rule: Whenever you drink water, sit down and take small sips.",
    hi: "खड़े होकर और जल्दी-जल्दी पानी पीने से डाइजेशन और जोड़ों में दिक्कत हो सकती है। एक नियम बना लें: 'जब भी पानी पियूँगा, आराम से बैठकर और घूँट-घूँट करके पियूँगा'।",
  },
  building_zone: {
    en: "Keep it up! Just remember: sit first, then drink water. Relief Joint Pain.",
    hi: "इसे जारी रखें! बस याद रखें: पहले बैठें, फिर पानी पिएँ। जोड़ों के दर्द में राहत मिलेगी।",
  },
  strong_area: {
    en: "Excellent! Drinking water sitting down and sip-by-sip is keeping your digestion and kidney function optimal.",
    hi: "शानदार! बैठकर घूंट-घूंट करके पानी पीना आपके पाचन (डाइजेशन) और किडनी के कार्य को बेहतरीन बना रहा है।",
  },
};

// ── Q3: Meal Gap Rule (45-Min Gap) ──
const q3: QuestionSuggestions = {
  label: "Meal Gap Rule (45-Min Gap)",
  needs_attention: {
    en: "Drinking water immediately after eating extinguishes Jatharagni (digestive fire). It is absolutely necessary to keep a gap of 45 minutes after eating.",
    hi: "खाने के तुरंत बाद पानी पीने से जठराग्नि (digestive fire) बुझ जाती है। खाने के बाद 45 मिनट का गैप ज़रूर रखें।",
  },
  building_zone: {
    en: "You have understood the concept (digestive fire), now all you need is consistency. Start setting a 45-minute timer on your phone after eating.",
    hi: "आपने कॉन्सेप्ट (जठराग्नि) समझ लिया है, अब बस निरंतरता (consistency) चाहिए। खाना खाने के बाद फ़ोन में 45 मिनट का टाइमर लगाना शुरू करें।",
  },
  strong_area: {
    en: "Brilliant! Keeping a gap between your meal and water intake allows your body to absorb 100% of the nutrients.",
    hi: "शानदार! भोजन और पानी के बीच अंतर रखने से आपका शरीर पोषक तत्वों को 100% अवशोषित कर पा रहा है।",
  },
};

// ── Q4: Pre-Sleep Mgmt (Raat ka Paani) ──
const q4: QuestionSuggestions = {
  label: "Pre-Sleep Mgmt (Raat ka Paani)",
  needs_attention: {
    en: "Drinking too much water right before sleeping causes sleep interruption for washroom breaks at night. Reduce your water intake 1-2 hours before sleeping.",
    hi: "सोने से ठीक पहले ज़्यादा पानी पीने से रात में वॉशरूम के लिए नींद टूटती है। सोने से 1-2 घंटे पहले पानी का इनटेक कम कर दें।",
  },
  building_zone: {
    en: "Focus a little more. If you feel thirsty at night, instead of drinking a full glass, just take a small sip of water.",
    hi: "थोड़ा और फोकस करें। अगर रात में प्यास लगे, तो गिलास भर के पीने के बजाय, सिर्फ एक छोटा घूंट (sip) पानी लें।",
  },
  strong_area: {
    en: "Great job! Following this rule ensures your night's 'Deep Sleep' is completed without any interruption.",
    hi: "शानदार! इस नियम का पालन करने से आपकी रात की 'गहरी नींद' बिना किसी रुकावट के पूरी हो रही है।",
  },
};

// ── Q5: Daily Volume (2.5–3 Liters) ──
const q5: QuestionSuggestions = {
  label: "Daily Volume (2.5–3 Liters)",
  needs_attention: {
    en: "Your body is currently in dehydration mode. Start keeping a 1-liter bottle with you and set a target to finish it 3 times a day.",
    hi: "आपकी बॉडी अभी डिहाइड्रेशन मोड में है। एक 1-लीटर की बोतल अपने साथ रखना शुरू करें और दिन में उसे 3 बार खत्म करने का टारगेट बनाएँ।",
  },
  building_zone: {
    en: "You are almost reaching the target! To remember to drink water during the day's busy schedule, set a water reminder on your phone.",
    hi: "आप लगभग लक्ष्य तक पहुँच रहे हैं! दिन के व्यस्त शेड्यूल में पानी याद रखने के लिए अपने फोन में वॉटर रिमाइंडर सेट करें।",
  },
  strong_area: {
    en: "Superb! Your daily hydration level is absolutely accurate. It is keeping your skin, energy, and gut all three healthy.",
    hi: "शानदार! आपका दैनिक हाइड्रेशन स्तर एकदम सटीक है। यह आपकी त्वचा (skin), ऊर्जा (energy) और पेट (gut) तीनों को स्वस्थ रख रहा है।",
  },
};

// ── Q6: Bedtime Consistency (सोने-जागने का निश्चित समय) ──
const q6: QuestionSuggestions = {
  label: "Bedtime Consistency (सोने-जागने का निश्चित समय)",
  needs_attention: {
    en: "Set a fixed bedtime and wake-up time. This will set your biological clock (Circadian Rhythm) and keep your energy levels high throughout the day.",
    hi: "सोने और जागने का एक फिक्स टाइम बनाएं। इससे आपकी बायोलॉजिकल क्लॉक (सर्केडियन रिदम) सेट होगी और दिन भर एनर्जी बनी रहेगी।",
  },
  building_zone: {
    en: "Good effort! Set a wind-down alarm 30 minutes before bed. Consistency will naturally lower your stress hormone (Cortisol).",
    hi: "अच्छी कोशिश! सोने से 30 मिनट पहले का अलार्म लगाएं। कंसिस्टेंसी से आपका स्ट्रेस हार्मोन (कॉर्टिसोल) नेचुरल तरीके से कम होगा।",
  },
  strong_area: {
    en: "Excellent! Going to bed at the same time every day keeps your body's recovery mode 100% active.",
    hi: "शानदार! रोज़ एक समय पर सोने से आपकी बॉडी का रिकवरी मोड 100% एक्टिव रहता है।",
  },
};

// ── Q7: Sleep Duration (7-8 Hours Rest) ──
const q7: QuestionSuggestions = {
  label: "Sleep Duration (7-8 Hours Rest)",
  needs_attention: {
    en: "Make a target of getting 7-8 hours of sleep starting today. This detoxifies your brain and increases focus for the upcoming day.",
    hi: "आज से 7-8 घंटे की नींद का टारगेट बनाएं। यह आपके ब्रेन को डिटॉक्स करता है और आने वाले दिन के लिए फोकस बढ़ाता है।",
  },
  building_zone: {
    en: "You are close to your goal! Try sleeping 15-20 minutes extra tonight. Full sleep is essential for muscle repair and immunity.",
    hi: "आप लक्ष्य के करीब हैं! 15-20 मिनट एक्स्ट्रा सोने की कोशिश करें। पूरी नींद आपके मसल रिपेयर और इम्यूनिटी के लिए ज़रूरी है।",
  },
  strong_area: {
    en: "Perfect! 7-8 hours of sleep is giving your body the full opportunity to repair and heal overnight.",
    hi: "परफेक्ट! 7-8 घंटे की नींद आपकी बॉडी को रात भर में रिपेयर और हील होने का पूरा मौका दे रही है।",
  },
};

// ── Q8: Wake-up Refreshment (सुबह की ताज़गी) ──
const q8: QuestionSuggestions = {
  label: "Wake-up Refreshment (सुबह की ताज़गी)",
  needs_attention: {
    en: "To eliminate morning fatigue, finish your dinner by 7:30 PM. A light stomach will help you wake up completely fresh and energetic.",
    hi: "सुबह थकान दूर करने के लिए शाम 7:30 बजे तक डिनर कर लें। हल्का पेट आपको सुबह एकदम फ्रेश और ऊर्जावान उठने में मदद करेगा।",
  },
  building_zone: {
    en: "Very good! Keep your bedroom cool and dark. This will induce deep sleep and you will wake up without any fatigue.",
    hi: "बहुत बढ़िया! अपने बेडरूम को ठंडा और अंधेरा रखें। इससे डीप स्लीप आएगी और आप सुबह बिना थकान के उठेंगे।",
  },
  strong_area: {
    en: "Superb! Waking up fresh is proof that your body and mind have fully recharged overnight.",
    hi: "शानदार! फ्रेश उठना इस बात का सबूत है कि आपकी बॉडी और माइंड रात भर में पूरी तरह रिचार्ज हो चुके हैं।",
  },
};

// ── Q9: Sleep Interruptions (गहरी नींद) ──
const q9: QuestionSuggestions = {
  label: "Sleep Interruptions (गहरी नींद)",
  needs_attention: {
    en: "To prevent sleep interruptions, avoid caffeine (tea/coffee) after sunset. Uninterrupted sleep is highly essential for cell regeneration.",
    hi: "रात में नींद न टूटे इसके लिए सूर्यास्त के बाद कैफीन (चाय/कॉफी) छोड़ दें। बिना रुकावट की नींद सेल रीजनरेशन के लिए सबसे ज़रूरी है।",
  },
  building_zone: {
    en: "Very close! Practice deep breathing before sleeping. This will calm your nervous system and help you get long, deep sleep.",
    hi: "बहुत करीब! सोने से पहले डीप ब्रीदिंग करें। इससे नर्वस सिस्टम शांत होगा और आप लंबी, गहरी नींद सो पाएंगे।",
  },
  strong_area: {
    en: "Brilliant! Uninterrupted deep sleep keeps your digestion, mood, and hormones perfectly balanced.",
    hi: "बेहतरीन! बिना रुकावट वाली गहरी नींद से आपका डाइजेशन, मूड और हार्मोन्स एकदम बैलेंस में रहते हैं।",
  },
};

// ── Q10: Pre-sleep Rituals (डिजिटल डिटॉक्स) ──
const q10: QuestionSuggestions = {
  label: "Pre-sleep Rituals (डिजिटल डिटॉक्स)",
  needs_attention: {
    en: "Keep your phone away 1 hour before sleeping. This helps produce Melatonin (sleep hormone) naturally and helps you fall asleep faster.",
    hi: "सोने से 1 घंटा पहले फोन दूर रख दें। इससे मेलाटोनिन (स्लीप हार्मोन) नेचुरल तरीके से बनेगा और आपको जल्दी नींद आएगी।",
  },
  building_zone: {
    en: "Good progress! Read a book instead of using your phone. This habit relaxes your mind and prevents overthinking.",
    hi: "अच्छी प्रोग्रेस! फोन की जगह किताब पढ़ें। यह आदत आपके माइंड को रिलैक्स करती है और ओवरथिंकिंग को रोकती है।",
  },
  strong_area: {
    en: "Outstanding! This 1-hour digital detox rule is making your mental clarity and sleep quality excellent.",
    hi: "शानदार! डिजिटल डिटॉक्स का यह नियम आपकी मेंटल क्लैरिटी और नींद की क्वालिटी को बेहतरीन बना रहा है।",
  },
};

// ── Section 1: All 10 questions (index 0–9) ──
export const SECTION1_SUGGESTIONS: QuestionSuggestions[] = [
  q1, // Q1 – Morning Ritual (Water)
  q2, // Q2 – Drinking Posture (Water)
  q3, // Q3 – Meal Gap Rule (Water)
  q4, // Q4 – Pre-Sleep Mgmt (Water)
  q5, // Q5 – Daily Volume (Water)
  q6, // Q6 – Bedtime Consistency (Sleep)
  q7, // Q7 – Sleep Duration (Sleep)
  q8, // Q8 – Wake-up Refreshment (Sleep)
  q9, // Q9 – Sleep Interruptions (Sleep)
  q10, // Q10 – Pre-sleep Rituals (Sleep)
];

/**
 * Get suggestion category from answer score.
 * Score 0-1 → needs_attention
 * Score 2   → building_zone
 * Score 3-4 → strong_area
 */
export function getSuggestionCategory(score: number): SuggestionCategory {
  if (score <= 1) return "needs_attention";
  if (score === 2) return "building_zone";
  return "strong_area";
}

/**
 * Get all Needs Attention items for Section 1
 * based on the user's answers (array of 10 answer indices for section 0).
 */
export interface NeedsAttentionItem {
  questionIndex: number;
  label: string;
  suggestion: SuggestionCard;
}

export function getSection1NeedsAttention(
  answers: Record<string, number>,
): NeedsAttentionItem[] {
  const items: NeedsAttentionItem[] = [];
  for (let qi = 0; qi < 10; qi++) {
    const score = answers[`s0-q${qi}`] ?? 0;
    if (score <= 1) {
      const suggestion = SECTION1_SUGGESTIONS[qi];
      items.push({
        questionIndex: qi,
        label: suggestion.label,
        suggestion: suggestion.needs_attention,
      });
    }
  }
  return items;
}
