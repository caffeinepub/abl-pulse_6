// ─────────────────────────────────────────────
// ABL PULSE – Section 2: Gut Cleanse & Metabolic (Q1–Q10)
// Suggestion cards for all 3 categories.
// Rule: score 0-1 = needs_attention | 2 = building_zone | 3-4 = strong_area
// ─────────────────────────────────────────────

import type { QuestionSuggestions } from "./section1-water";

// ── Q1: Mindful Chewing (चबाकर खाना) ──
const g1: QuestionSuggestions = {
  label: "Mindful Chewing (चबाकर खाना)",
  needs_attention: {
    en: "Start chewing each bite at least 20 times. Digestion begins in the mouth, and this saves your gut's energy.",
    hi: "हर निवाले को कम से कम 20 बार चबाना शुरू करें। पाचन मुंह से ही शुरू हो जाता है, और इससे आपके पेट की एनर्जी बचती है।",
  },
  building_zone: {
    en: "Good effort! Try counting your chews to reach 30. Better chewing directly prevents gas and bloating.",
    hi: "अच्छी कोशिश! 30 तक पहुंचने के लिए चबाते समय गिनती करें। अच्छी तरह चबाने से गैस और भारीपन नहीं होता।",
  },
  strong_area: {
    en: "Excellent mindful eating! Thorough chewing maximizes nutrient absorption in your body.",
    hi: "शानदार! भोजन को अच्छी तरह चबाने से आपका शरीर पोषक तत्वों (nutrients) को पूरी तरह सोख पाता है।",
  },
};

// ── Q2: Morning Drink (खाली पेट की आदत) ──
const g2: QuestionSuggestions = {
  label: "Morning Drink (खाली पेट की आदत)",
  needs_attention: {
    en: "Swap morning tea/coffee with warm water. This flushes out overnight toxins and kickstarts your metabolism.",
    hi: "सुबह चाय/कॉफी की जगह गुनगुना पानी पिएं। यह रात भर के टॉक्सिन्स बाहर निकालता है और मेटाबॉलिज़्म को किकस्टार्ट करता है।",
  },
  building_zone: {
    en: "Delay your tea by 1 hour and start your day with water. This protects your stomach lining from morning acidity.",
    hi: "चाय 1 घंटे टालें और दिन की शुरुआत पानी से करें। यह आपके पेट की लाइनिंग को सुबह की एसिडिटी से बचाता है।",
  },
  strong_area: {
    en: "Perfect start! Hydrating your gut first thing sets a healthy metabolic tone for the entire day.",
    hi: "परफेक्ट शुरुआत! सुबह सबसे पहले गट को हाइड्रेट करने से पूरे दिन का मेटाबॉलिज़्म सही रहता है।",
  },
};

// ── Q3: Gut Lubrication (देसी घी) ──
const g3: QuestionSuggestions = {
  label: "Gut Lubrication (देसी घी)",
  needs_attention: {
    en: "Add 1 tsp of pure Desi Ghee to your lunch. It lubricates the gut lining and naturally prevents constipation.",
    hi: "लंच में 1 चम्मच शुद्ध देसी घी शामिल करें। यह आंतों में चिकनाई लाता है और कब्ज को प्राकृतिक रूप से रोकता है।",
  },
  building_zone: {
    en: "Great! Ensure you are using pure A2 or homemade ghee. Good fats are essential for joint health and smooth digestion.",
    hi: "बढ़िया! सुनिश्चित करें कि घी शुद्ध हो। गुड फैट्स जोड़ों की सेहत और आसान पाचन के लिए ज़रूरी हैं।",
  },
  strong_area: {
    en: "Fantastic! Consuming Ghee as your 'Gut Dost' maintains a healthy microbiome and reduces inflammation.",
    hi: "शानदार! घी को 'गट दोस्त' की तरह खाने से आपका गट माइक्रोबायोम हेल्दी रहता है और सूजन (inflammation) कम होती है।",
  },
};

// ── Q4: Fasting Window (12 घंटे का गैप) ──
const g4: QuestionSuggestions = {
  label: "Fasting Window (12 घंटे का गैप)",
  needs_attention: {
    en: "Aim for a 12-hour gap between dinner and breakfast. This fasting window gives your digestive system time to heal and repair.",
    hi: "डिनर और ब्रेकफास्ट में 12 घंटे का गैप रखें। यह फास्टिंग विंडो आपके पाचन तंत्र को हील और रिपेयर होने का समय देती है।",
  },
  building_zone: {
    en: "You are close! Try to delay your breakfast by 30 mins. A longer fasting window enhances natural fat burn.",
    hi: "आप करीब हैं! ब्रेकफास्ट 30 मिनट देरी से करें। लंबा गैप शरीर में नेचुरल फैट बर्न की प्रक्रिया को तेज़ करता है।",
  },
  strong_area: {
    en: "Brilliant! A strict 12-hour fast keeps your metabolism strong and ensures daily cellular detox.",
    hi: "बेहतरीन! 12 घंटे का सख्त नियम आपके मेटाबॉलिज़्म को मजबूत रखता है और रोज़ाना सेल्युलर डिटॉक्स करता है।",
  },
};

// ── Q5: Sugar Detox (चीनी से परहेज) ──
const g5: QuestionSuggestions = {
  label: "Sugar Detox (चीनी से परहेज)",
  needs_attention: {
    en: "Replace white sugar with healthier options like jaggery. Refined sugar causes gut inflammation and energy crashes.",
    hi: "सफेद चीनी की जगह गुड़ जैसे विकल्प चुनें। रिफाइंड चीनी गट में सूजन और अचानक थकान (energy crash) का कारण बनती है।",
  },
  building_zone: {
    en: "Good effort! Try to cut out hidden sugars from packaged snacks. Reducing sugar stabilizes your energy all day.",
    hi: "अच्छी कोशिश! पैकेट वाले स्नैक्स से छिपी हुई चीनी को कम करें। चीनी कम करने से पूरे दिन एनर्जी स्थिर रहती है।",
  },
  strong_area: {
    en: "Outstanding! A sugar-free gut prevents bloating and protects you from major metabolic lifestyle diseases.",
    hi: "शानदार! शुगर-फ्री गट आपको ब्लोटिंग से बचाता है और लाइफस्टाइल से जुड़ी बड़ी बीमारियों से सुरक्षित रखता है।",
  },
};

// ── Q6: Early Dinner (रात का खाना) ──
const g6: QuestionSuggestions = {
  label: "Early Dinner (रात का खाना)",
  needs_attention: {
    en: "Shift your dinner time to 2-3 hours before bed. This prevents acid reflux and helps you sleep deeper.",
    hi: "अपना डिनर सोने से 2-3 घंटे पहले कर लें। इससे एसिड रिफ्लक्स (खट्टी डकारें) नहीं होता और गहरी नींद आती है।",
  },
  building_zone: {
    en: "Keep it up! If you have to eat late, keep the meal very light. A light stomach at night boosts morning energy.",
    hi: "इसे जारी रखें! अगर लेट खाना पड़े, तो बहुत हल्का खाएं। रात में हल्का पेट सुबह की एनर्जी को बढ़ाता है।",
  },
  strong_area: {
    en: "Perfect routine! Early digestion means your body focuses purely on recovery and healing while you sleep.",
    hi: "परफेक्ट रूटीन! जल्दी पचने का मतलब है कि सोते समय आपका शरीर सिर्फ रिकवरी और हीलिंग पर फोकस कर रहा है।",
  },
};

// ── Q7: Gut Fiber (सलाद/फल) ──
const g7: QuestionSuggestions = {
  label: "Gut Fiber (सलाद/फल)",
  needs_attention: {
    en: "Add a bowl of fresh salad to your lunch daily. Fiber acts as a broom to clean your intestines naturally.",
    hi: "रोज़ लंच में एक कटोरी ताज़ा सलाद शामिल करें। फाइबर आपकी आंतों को साफ करने के लिए 'झाड़ू' का काम करता है।",
  },
  building_zone: {
    en: "Good start! Add seasonal fruits to your daily snacks. Fiber feeds the good gut bacteria and boosts immunity.",
    hi: "अच्छी शुरुआत! स्नैक्स में मौसमी फल शामिल करें। फाइबर गट के गुड बैक्टीरिया को खाना देता है और इम्युनिटी बढ़ाता है।",
  },
  strong_area: {
    en: "Excellent fiber intake! This ensures smooth, effortless bowel movements and steady blood sugar levels.",
    hi: "शानदार फाइबर इनटेक! यह बिना मेहनत के पेट साफ होने और ब्लड शुगर को स्थिर रखने में मदद करता है।",
  },
};

// ── Q8: Micro-Nutrients (नट्स/सीड्स) ──
const g8: QuestionSuggestions = {
  label: "Micro-Nutrients (नट्स/सीड्स)",
  needs_attention: {
    en: "Soak 5 almonds and some pumpkin seeds overnight to eat in the morning. This provides essential micronutrients and healthy fats.",
    hi: "रात में 5 बादाम और कद्दू के बीज भिगोकर सुबह खाएं। यह शरीर को ज़रूरी माइक्रोन्यूट्रिएंट्स और हेल्दी फैट्स देता है।",
  },
  building_zone: {
    en: "You're doing well! Add variety like sunflower or flax seeds. These tiny powerhouses boost brain health and energy.",
    hi: "आप अच्छा कर रहे हैं! सूरजमुखी या अलसी के बीज भी जोड़ें। ये छोटे बीज ब्रेन हेल्थ और एनर्जी के पावरहाउस हैं।",
  },
  strong_area: {
    en: "Superb! Eating soaked nuts and seeds ensures they are fully bio-available and easily absorbed by your gut.",
    hi: "शानदार! भीगे हुए नट्स और बीज खाने से पेट उन्हें आसानी से और पूरी तरह सोख (absorb) पाता है।",
  },
};

// ── Q9: Bio-Feedback (खाने के बाद की फीलिंग) ──
const g9: QuestionSuggestions = {
  label: "Bio-Feedback (खाने के बाद की फीलिंग)",
  needs_attention: {
    en: "Eat only up to 80% of your stomach's capacity. Overeating extinguishes your digestive fire and causes immediate lethargy.",
    hi: "अपनी भूख का सिर्फ 80% ही खाएं। ज़रूरत से ज़्यादा खाने से जठराग्नि बुझ जाती है और तुरंत आलस आता है।",
  },
  building_zone: {
    en: "Almost there! Take a 10-minute gentle walk after meals. This aids quick digestion and reduces any heavy feeling.",
    hi: "आप करीब हैं! खाने के बाद 10 मिनट की हल्की सैर करें। इससे खाना जल्दी पचता है और भारीपन कम होता है।",
  },
  strong_area: {
    en: "Great self-awareness! Feeling light and energetic after meals means your digestive fire (Jatharagni) is working perfectly.",
    hi: "शानदार! खाने के बाद हल्का और ऊर्जावान महसूस करने का मतलब है कि आपकी जठराग्नि एकदम सही काम कर रही है।",
  },
};

// ── Q10: Bowel Movement (पेट साफ होना) ──
const g10: QuestionSuggestions = {
  label: "Bowel Movement (पेट साफ होना)",
  needs_attention: {
    en: "Increase your warm water and fiber intake today. This will soften the stool and help regulate morning clearance naturally.",
    hi: "आज ही गुनगुना पानी और फाइबर बढ़ाएं। यह मल को मुलायम करेगा और सुबह प्राकृतिक रूप से पेट साफ होने में मदद करेगा।",
  },
  building_zone: {
    en: "Good! Try using an Indian toilet posture (squatting) for effortless clearance. This aligns the colon for complete emptying.",
    hi: "बढ़िया! बिना मेहनत पेट साफ करने के लिए उकड़ू (squatting) बैठने की कोशिश करें। इससे आंतें पूरी तरह खाली होने के लिए सही पोज़िशन में आती हैं।",
  },
  strong_area: {
    en: "The ultimate sign of health! A naturally clear, effortless stomach means your entire digestive tract is beautifully detoxified.",
    hi: "सेहत की सबसे बड़ी निशानी! प्राकृतिक रूप से आसानी से पेट साफ होने का मतलब है कि आपका पूरा पाचन तंत्र एकदम डिटॉक्सिफाइड है।",
  },
};

// ── Section 2: All 10 questions (index 0–9) ──
export const SECTION2_SUGGESTIONS: QuestionSuggestions[] = [
  g1, // Q1 – Mindful Chewing
  g2, // Q2 – Morning Drink
  g3, // Q3 – Gut Lubrication
  g4, // Q4 – Fasting Window
  g5, // Q5 – Sugar Detox
  g6, // Q6 – Early Dinner
  g7, // Q7 – Gut Fiber
  g8, // Q8 – Micro-Nutrients
  g9, // Q9 – Bio-Feedback
  g10, // Q10 – Bowel Movement
];

/**
 * Get all Needs Attention items for Section 2
 * based on the user's answers for section index 1 (s1-q0 … s1-q9).
 */
export interface NeedsAttentionItem2 {
  questionIndex: number;
  label: string;
  suggestion: { en: string; hi: string };
}

export function getSection2NeedsAttention(
  answers: Record<string, number>,
): NeedsAttentionItem2[] {
  const items: NeedsAttentionItem2[] = [];
  for (let qi = 0; qi < 10; qi++) {
    const score = answers[`s1-q${qi}`] ?? 0;
    if (score <= 1) {
      const suggestion = SECTION2_SUGGESTIONS[qi];
      items.push({
        questionIndex: qi,
        label: suggestion.label,
        suggestion: suggestion.needs_attention,
      });
    }
  }
  return items;
}
