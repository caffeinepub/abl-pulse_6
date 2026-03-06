// ─────────────────────────────────────────────
// ABL PULSE – Section 3: Movement & Circulation (Q1–Q10)
// Suggestion cards for all 3 categories.
// Rule: score 0-1 = needs_attention | 2 = building_zone | 3-4 = strong_area
// ─────────────────────────────────────────────

import type { QuestionSuggestions } from "./section1-water";

// ── Q1: Morning Sunlight (सुबह की धूप) ──
const m1: QuestionSuggestions = {
  label: "Morning Sunlight (सुबह की धूप)",
  needs_attention: {
    en: "Spend 15 mins in the morning sun before 9 AM. It naturally boosts Vitamin D and sets your sleep-wake cycle.",
    hi: "सुबह 9 बजे से पहले 15 मिनट धूप में बिताएं। यह प्राकृतिक रूप से विटामिन डी बढ़ाता है और आपके स्लीप साइकिल को सेट करता है।",
  },
  building_zone: {
    en: "Good effort! Try doing light stretches in the sun. Sunlight triggers serotonin, keeping you happy all day.",
    hi: "अच्छी कोशिश! धूप में हल्की स्ट्रेचिंग करें। धूप से सेरोटोनिन हार्मोन बनता है, जो आपको दिन भर खुश रखता है।",
  },
  strong_area: {
    en: "Excellent! Daily morning sunlight is the best natural medicine for strong bones and high immunity.",
    hi: "शानदार! मज़बूत हड्डियों और हाई इम्युनिटी के लिए रोज़ाना सुबह की धूप सबसे अच्छी प्राकृतिक दवा है।",
  },
};

// ── Q2: Daily Steps (सैर या कदम) ──
const m2: QuestionSuggestions = {
  label: "Daily Steps (सैर या कदम)",
  needs_attention: {
    en: "Start with a simple 15-minute walk today. Walking improves blood circulation and prevents stiffness in the body.",
    hi: "आज ही 15 मिनट की साधारण सैर शुरू करें। चलने से ब्लड सर्कुलेशन सुधरता है और शरीर में अकड़न नहीं होती।",
  },
  building_zone: {
    en: "You're close to 5,000 steps! Take stairs instead of the lift. Walking daily prevents unhealthy fat accumulation.",
    hi: "आप 5,000 कदम के करीब हैं! लिफ्ट की जगह सीढ़ियां लें। रोज़ चलने से शरीर में अनहेल्दी फैट जमा नहीं होता।",
  },
  strong_area: {
    en: "Perfect! Achieving your daily step goal keeps your joints lubricated and metabolism highly active.",
    hi: "परफेक्ट! रोज़ाना अपना स्टेप गोल पूरा करने से आपके जोड़ों में चिकनाई बनी रहती है और मेटाबॉलिज़्म एक्टिव रहता है।",
  },
};

// ── Q3: Digital Detox Walk (बिना फोन के सैर) ──
const m3: QuestionSuggestions = {
  label: "Digital Detox Walk (बिना फोन के सैर)",
  needs_attention: {
    en: "Leave your phone at home during your next walk. Walking mindfully reduces eye strain and mental fatigue.",
    hi: "अगली सैर पर अपना फोन घर छोड़ दें। माइंडफुल वॉक करने से आंखों का तनाव और मानसिक थकान कम होती है।",
  },
  building_zone: {
    en: "Good progress! Focus on your surroundings and breath. This connects your mind with your body and reduces anxiety.",
    hi: "अच्छी प्रोग्रेस! अपने आस-पास और सांसों पर ध्यान दें। यह आपके मन को शरीर से जोड़ता है और घबराहट कम करता है।",
  },
  strong_area: {
    en: "Outstanding! Walking without a screen acts as a powerful active meditation for your brain.",
    hi: "बेहतरीन! बिना स्क्रीन के सैर करना आपके दिमाग के लिए एक बहुत ही पावरफुल एक्टिव मेडिटेशन का काम करता है।",
  },
};

// ── Q4: Flexibility Stretches (बटरफ्लाई पोज़) ──
const m4: QuestionSuggestions = {
  label: "Flexibility Stretches (बटरफ्लाई पोज़)",
  needs_attention: {
    en: "Sit in the Butterfly Pose for 2 minutes daily. It opens up tight hips and improves pelvic blood flow.",
    hi: "रोज़ 2 मिनट 'बटरफ्लाई पोज़' (तितली आसन) में बैठें। यह हिप्स की जकड़न खोलता है और पेल्विक एरिया में ब्लड फ्लो सुधारता है।",
  },
  building_zone: {
    en: "Keep practicing! Flap your legs gently. This relieves lower back stiffness caused by long sitting hours.",
    hi: "अभ्यास जारी रखें! पैरों को धीरे-धीरे हिलाएं। इससे लंबे समय तक बैठने के कारण होने वाला कमर दर्द दूर होता है।",
  },
  strong_area: {
    en: "Brilliant! Daily lower body stretching keeps you flexible and prevents joint injuries as you age.",
    hi: "शानदार! निचले शरीर की रोज़ स्ट्रेचिंग आपको फ्लेक्सिबल रखती है और उम्र के साथ होने वाली चोटों से बचाती है।",
  },
};

// ── Q5: Movement Breaks (बीच में ब्रेक) ──
const m5: QuestionSuggestions = {
  label: "Movement Breaks (बीच में ब्रेक)",
  needs_attention: {
    en: "Set a timer to stand up every 1 hour. Continuous sitting blocks blood circulation to your legs.",
    hi: "हर 1 घंटे में खड़े होने का अलार्म लगाएं। लगातार बैठे रहने से पैरों का ब्लड सर्कुलेशन रुक जाता है।",
  },
  building_zone: {
    en: "Good start! Do some shoulder rolls during your break. It relieves neck tension and postural strain.",
    hi: "अच्छी शुरुआत! ब्रेक में कंधों को गोल घुमाएं (Shoulder rolls)। इससे गर्दन का तनाव और पोस्चर का दर्द दूर होता है।",
  },
  strong_area: {
    en: "Great habit! Taking frequent movement breaks keeps your spine healthy and prevents backaches.",
    hi: "बहुत अच्छी आदत! बीच-बीच में ब्रेक लेने से आपकी रीढ़ की हड्डी (Spine) स्वस्थ रहती है और कमर दर्द नहीं होता।",
  },
};

// ── Q6: Light Cardio (हल्का पसीना) ──
const m6: QuestionSuggestions = {
  label: "Light Cardio (हल्का पसीना)",
  needs_attention: {
    en: "Do any brisk activity for 10 mins to break a sweat. Sweating is the body's natural way to flush out toxins.",
    hi: "10 मिनट कोई भी तेज़ एक्टिविटी करें जिससे पसीना आए। पसीना आना शरीर से टॉक्सिन्स बाहर निकालने का प्राकृतिक तरीका है।",
  },
  building_zone: {
    en: "You're on track! Increase the intensity slightly. A raised heart rate strengthens your cardiovascular health.",
    hi: "आप सही रास्ते पर हैं! अपनी एक्टिविटी थोड़ी और तेज़ करें। दिल की धड़कन बढ़ने से आपकी कार्डियोवैस्कुलर सेहत मज़बूत होती है।",
  },
  strong_area: {
    en: "Superb! Daily light sweating keeps your skin glowing and your heart pumping efficiently.",
    hi: "बेहतरीन! रोज़ हल्का पसीना आने से आपकी त्वचा चमकती है और दिल सही से काम करता है।",
  },
};

// ── Q7: Strength/Workout (स्ट्रेंथ ट्रेनिंग) ──
const m7: QuestionSuggestions = {
  label: "Strength/Workout (स्ट्रेंथ ट्रेनिंग)",
  needs_attention: {
    en: "Start with basic squats or push-ups at home. Muscle training is essential to prevent bone density loss.",
    hi: "घर पर बेसिक स्क्वाट्स या पुश-अप्स से शुरुआत करें। हड्डियों की कमज़ोरी रोकने के लिए मसल ट्रेनिंग बहुत ज़रूरी है।",
  },
  building_zone: {
    en: "Consistent effort is key! Schedule your workout 3 days a week. Building muscle increases your resting metabolism.",
    hi: "निरंतरता ज़रूरी है! हफ्ते में 3 दिन वर्कआउट फिक्स करें। मांसपेशियां (Muscle) बढ़ने से आपका रेस्टिंग मेटाबॉलिज़्म तेज़ होता है।",
  },
  strong_area: {
    en: "Fantastic! Regular strength training keeps your body young, strong, and highly resistant to injuries.",
    hi: "शानदार! नियमित स्ट्रेंथ ट्रेनिंग आपके शरीर को जवान, मज़बूत और चोटों से सुरक्षित रखती है।",
  },
};

// ── Q8: Deep Breathing (गहरी सांसें) ──
const m8: QuestionSuggestions = {
  label: "Deep Breathing (गहरी सांसें)",
  needs_attention: {
    en: "Take 10 deep belly breaths right now. Deep breathing instantly lowers cortisol (stress hormone) levels.",
    hi: "अभी 10 गहरी सांसें (पेट से) लें। गहरी सांस लेने से कॉर्टिसोल (तनाव का हार्मोन) तुरंत कम होता है।",
  },
  building_zone: {
    en: "Nice progress. Practice Anulom Vilom for 5 minutes. It balances the oxygen flow to both sides of the brain.",
    hi: "अच्छी प्रोग्रेस। 5 मिनट अनुलोम-विलोम का अभ्यास करें। यह दिमाग के दोनों हिस्सों में ऑक्सीजन का फ्लो बैलेंस करता है।",
  },
  strong_area: {
    en: "Excellent! Daily Pranayama maximizes your lung capacity and keeps your mind extremely calm.",
    hi: "परफेक्ट! रोज़ाना प्राणायाम करने से फेफड़ों की क्षमता बढ़ती है और दिमाग एकदम शांत रहता है।",
  },
};

// ── Q9: Relaxation Postures (लेग्स-अप-द-वॉल) ──
const m9: QuestionSuggestions = {
  label: "Relaxation Postures (लेग्स-अप-द-वॉल)",
  needs_attention: {
    en: "Try 'Legs-up-the-wall' pose for 5 mins in bed. It reverses blood flow and relieves tired leg muscles.",
    hi: "बिस्तर पर 5 मिनट 'लेग्स-अप-द-वॉल' पोज़ करें। यह ब्लड फ्लो को उल्टा करता है और पैरों की थकान मिटाता है।",
  },
  building_zone: {
    en: "Almost a habit! Focus on relaxing your breath in this pose. It signals the nervous system to prepare for sleep.",
    hi: "यह आदत बन रही है! इस पोज़ में अपनी सांसों को रिलैक्स करें। यह नर्वस सिस्टम को सोने का संकेत देता है।",
  },
  strong_area: {
    en: "Perfect recovery! This posture drains lymphatic fluids and ensures deep, restorative sleep.",
    hi: "परफेक्ट रिकवरी! यह आसन पैरों की सूजन कम करता है और एक गहरी, आरामदायक नींद सुनिश्चित करता है।",
  },
};

// ── Q10: Active & Energetic (दिन भर की एनर्जी) ──
const m10: QuestionSuggestions = {
  label: "Active & Energetic (दिन भर की एनर्जी)",
  needs_attention: {
    en: "Your body lacks movement. Start with morning stretches. Moving your body instantly generates fresh energy.",
    hi: "आपके शरीर में मूवमेंट की कमी है। सुबह की स्ट्रेचिंग से शुरुआत करें। शरीर को हिलाने से तुरंत नई एनर्जी बनती है।",
  },
  building_zone: {
    en: "You're getting there! Stay hydrated to maintain your energy. Water acts as fuel for your muscles during the day.",
    hi: "आप सही जा रहे हैं! एनर्जी बनाए रखने के लिए पानी पीते रहें। दिन भर में पानी आपकी मांसपेशियों के लिए ईंधन (fuel) का काम करता है।",
  },
  strong_area: {
    en: "Ultimate fitness sign! Feeling naturally energetic all day means your circulation and metabolism are at their peak.",
    hi: "फिटनेस की असली निशानी! दिन भर ऊर्जावान महसूस करने का मतलब है कि आपका सर्कुलेशन और मेटाबॉलिज़्म टॉप पर है।",
  },
};

// ── Section 3: All 10 questions (index 0–9) ──
export const SECTION3_SUGGESTIONS: QuestionSuggestions[] = [
  m1, // Q1 – Morning Sunlight
  m2, // Q2 – Daily Steps
  m3, // Q3 – Digital Detox Walk
  m4, // Q4 – Flexibility Stretches
  m5, // Q5 – Movement Breaks
  m6, // Q6 – Light Cardio
  m7, // Q7 – Strength/Workout
  m8, // Q8 – Deep Breathing
  m9, // Q9 – Relaxation Postures
  m10, // Q10 – Active & Energetic
];

/**
 * Get all Needs Attention items for Section 3
 * based on the user's answers for section index 2 (s2-q0 … s2-q9).
 */
export interface NeedsAttentionItem3 {
  questionIndex: number;
  label: string;
  suggestion: { en: string; hi: string };
}

export function getSection3NeedsAttention(
  answers: Record<string, number>,
): NeedsAttentionItem3[] {
  const items: NeedsAttentionItem3[] = [];
  for (let qi = 0; qi < 10; qi++) {
    const score = answers[`s2-q${qi}`] ?? 0;
    if (score <= 1) {
      const suggestion = SECTION3_SUGGESTIONS[qi];
      items.push({
        questionIndex: qi,
        label: suggestion.label,
        suggestion: suggestion.needs_attention,
      });
    }
  }
  return items;
}
