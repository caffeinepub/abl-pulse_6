// ─────────────────────────────────────────────
// ABL PULSE – Section 4: Mind & Emotional Balance (Q1–Q10)
// Suggestion cards for all 3 categories.
// Rule: score 0-1 = needs_attention | 2 = building_zone | 3-4 = strong_area
// ─────────────────────────────────────────────

import type { QuestionSuggestions } from "./section1-water";

// ── Q1: Gratitude (आभार व्यक्त करना) ──
const e1: QuestionSuggestions = {
  label: "Gratitude (आभार व्यक्त करना)",
  needs_attention: {
    en: "Write down 1 good thing about your day before sleeping. This shifts your mind from lack to abundance.",
    hi: "सोने से पहले दिन की 1 अच्छी बात लिखें। यह आपके दिमाग को कमियों से हटाकर संतुष्टि की ओर ले जाता है।",
  },
  building_zone: {
    en: "Good! Express your thanks verbally to someone today. Expressing gratitude instantly strengthens relationships and mood.",
    hi: "बढ़िया! आज किसी को बोलकर धन्यवाद दें। आभार व्यक्त करने से रिश्ते और मूड तुरंत बेहतर होते हैं।",
  },
  strong_area: {
    en: "Excellent! Daily gratitude rewires your brain for lasting happiness and inner peace.",
    hi: "शानदार! रोज़ाना आभार व्यक्त करने से आपका दिमाग स्थायी खुशी और आंतरिक शांति के लिए प्रोग्राम हो जाता है।",
  },
};

// ── Q2: Avoiding Negativity (नकारात्मकता से दूरी) ──
const e2: QuestionSuggestions = {
  label: "Avoiding Negativity (नकारात्मकता से दूरी)",
  needs_attention: {
    en: "Limit your complaining to just 5 minutes a day. This stops mental drain and saves your daily energy.",
    hi: "दिन भर में शिकायत करने का समय सिर्फ 5 मिनट तक सीमित रखें। इससे मानसिक थकावट रुकती है और एनर्जी बचती है।",
  },
  building_zone: {
    en: "Good effort! Change the topic gently when negative gossip starts. This protects your mental peace and aura.",
    hi: "अच्छी कोशिश! जब नकारात्मक बातें शुरू हों, तो शांति से विषय बदल दें। यह आपकी मानसिक शांति की रक्षा करता है।",
  },
  strong_area: {
    en: "Outstanding! Staying away from negativity fosters a positive and highly productive mindset.",
    hi: "बेहतरीन! नकारात्मकता से दूर रहने से एक सकारात्मक और अत्यधिक प्रोडक्टिव माइंडसेट बनता है।",
  },
};

// ── Q3: Quality Family Time (परिवार के साथ समय) ──
const e3: QuestionSuggestions = {
  label: "Quality Family Time (परिवार के साथ समय)",
  needs_attention: {
    en: "Spend 15 mins daily with your family with all screens turned off. This builds basic emotional connection and trust.",
    hi: "रोज़ 15 मिनट बिना किसी स्क्रीन के परिवार के साथ बिताएं। यह बुनियादी भावनात्मक जुड़ाव और विश्वास बनाता है।",
  },
  building_zone: {
    en: "You're doing well! Try having at least one meal together without phones. This deepens your bond with loved ones.",
    hi: "आप अच्छा कर रहे हैं! बिना फोन के कम से कम एक वक्त का खाना साथ खाएं। यह अपनों के साथ आपके बंधन को गहरा करता है।",
  },
  strong_area: {
    en: "Superb! Giving undivided attention to family creates a strong, emotionally supportive environment.",
    hi: "शानदार! परिवार को पूरा ध्यान देने से एक मज़बूत और भावनात्मक रूप से सपोर्टिव माहौल बनता है।",
  },
};

// ── Q4: Positive Self-Talk (सकारात्मक सोच) ──
const e4: QuestionSuggestions = {
  label: "Positive Self-Talk (सकारात्मक सोच)",
  needs_attention: {
    en: "Stop criticizing your body. Say 'thank you' to it every morning. Loving your body is the first step to healing it.",
    hi: "अपने शरीर की कमियां निकालना बंद करें। हर सुबह इसे 'धन्यवाद' कहें। अपने शरीर से प्यार करना इसे हील करने का पहला कदम है।",
  },
  building_zone: {
    en: "Nice progress! Replace one negative thought with a positive affirmation daily. This boosts your self-esteem.",
    hi: "अच्छी प्रोग्रेस! रोज़ एक नकारात्मक विचार को सकारात्मक सोच से बदलें। यह आपके आत्मविश्वास को बढ़ाता है।",
  },
  strong_area: {
    en: "Brilliant! Positive self-talk signals your cells to thrive and boosts your immunity naturally.",
    hi: "बेहतरीन! सकारात्मक सोच आपके शरीर के सेल्स (कोशिकाओं) को स्वस्थ रहने का सिग्नल देती है और इम्युनिटी बढ़ाती है।",
  },
};

// ── Q5: Nature Connection (प्रकृति से जुड़ाव) ──
const e5: QuestionSuggestions = {
  label: "Nature Connection (प्रकृति से जुड़ाव)",
  needs_attention: {
    en: "Spend 10 mins near a plant or an open window today. Fresh air instantly lowers cortisol (stress hormone).",
    hi: "आज 10 मिनट किसी पौधे या खुली खिड़की के पास बिताएं। ताज़ी हवा तुरंत कॉर्टिसोल (तनाव का हार्मोन) कम करती है।",
  },
  building_zone: {
    en: "Good! Visit a local park at least once a week. Greenery helps reset your nervous system from screen fatigue.",
    hi: "बढ़िया! हफ्ते में कम से कम एक बार पार्क जाएं। हरियाली आपके नर्वस सिस्टम को स्क्रीन की थकान से रिलैक्स करती है।",
  },
  strong_area: {
    en: "Perfect! Staying close to nature grounds your energy and keeps you mentally vibrant.",
    hi: "परफेक्ट! प्रकृति के करीब रहने से आपकी ऊर्जा ग्राउंडेड रहती है और आप मानसिक रूप से जीवंत (vibrant) रहते हैं।",
  },
};

// ── Q6: Resilience/Optimism (सकारात्मक नज़रिया) ──
const e6: QuestionSuggestions = {
  label: "Resilience/Optimism (सकारात्मक नज़रिया)",
  needs_attention: {
    en: "Ask yourself 'What can I learn from this?' when facing a problem. This stops the victim mindset.",
    hi: "परेशानी आने पर खुद से पूछें 'मैं इससे क्या सीख सकता हूँ?' यह आपको हार मानने वाली सोच से बाहर निकालता है।",
  },
  building_zone: {
    en: "Getting better! Try to find the hidden blessing in small setbacks. This builds your mental toughness.",
    hi: "बेहतर हो रहा है! छोटी नाकामियों में छिपी हुई अच्छी बात (blessing) ढूंढें। यह आपकी मानसिक मज़बूती (toughness) बढ़ाता है।",
  },
  strong_area: {
    en: "Fantastic! This optimistic mindset turns every challenge into a stepping stone for growth.",
    hi: "शानदार! यह सकारात्मक नज़रिया हर चुनौती को विकास की सीढ़ी में बदल देता है।",
  },
};

// ── Q7: Emotional Stability (भावनात्मक स्थिरता) ──
const e7: QuestionSuggestions = {
  label: "Emotional Stability (भावनात्मक स्थिरता)",
  needs_attention: {
    en: "When upset, pause and take 3 deep breaths before reacting. This prevents instant emotional outbursts.",
    hi: "जब परेशान हों, तो रिएक्ट करने से पहले रुकें और 3 गहरी सांसें लें। यह अचानक आने वाले गुस्से या रोने से बचाता है।",
  },
  building_zone: {
    en: "Good step! Start tracking what triggers your bad moods. Awareness helps you respond instead of reacting.",
    hi: "अच्छा कदम! अपने मूड खराब होने के कारणों (triggers) को ट्रैक करें। जागरूकता आपको बिना सोचे रिएक्ट करने से रोकती है।",
  },
  strong_area: {
    en: "Great maturity! Inner calmness on most days is the true indicator of a balanced and healthy life.",
    hi: "बहुत अच्छी मैच्योरिटी! ज़्यादातर दिन शांत रहना एक संतुलित और स्वस्थ जीवन का सबसे बड़ा संकेत है।",
  },
};

// ── Q8: Stress Management (तनाव प्रबंधन) ──
const e8: QuestionSuggestions = {
  label: "Stress Management (तनाव प्रबंधन)",
  needs_attention: {
    en: "Step away from a stressful situation for just 5 minutes. Physical distance calms the immediate panic in the brain.",
    hi: "तनावपूर्ण स्थिति से सिर्फ 5 मिनट के लिए दूर हट जाएं। शारीरिक दूरी दिमाग की तुरंत होने वाली घबराहट को शांत करती है।",
  },
  building_zone: {
    en: "Almost there! Write down your worries on a piece of paper. This releases pent-up mental tension safely.",
    hi: "आप करीब हैं! अपनी चिंताओं को एक कागज़ पर लिखें। यह दिमाग में जमा हुए तनाव को सुरक्षित तरीके से बाहर निकालता है।",
  },
  strong_area: {
    en: "Excellent control! Handling stress calmly protects your heart health and balances your hormones.",
    hi: "शानदार नियंत्रण! तनाव को शांति से संभालने से आपके दिल की सेहत बढ़ती है और हार्मोन्स बैलेंस रहते हैं।",
  },
};

// ── Q9: Open Communication (खुलकर बात करना) ──
const e9: QuestionSuggestions = {
  label: "Open Communication (खुलकर बात करना)",
  needs_attention: {
    en: "Practice listening without interrupting for 2 minutes today. Listening is the foundation of building trust.",
    hi: "आज 2 मिनट तक बिना बीच में टोके सिर्फ सुनने की प्रैक्टिस करें। सुनना विश्वास (trust) बनाने की नींव है।",
  },
  building_zone: {
    en: "Good effort! Share your feelings using 'I feel' instead of blaming. This avoids conflicts and solves problems.",
    hi: "अच्छी कोशिश! इल्ज़ाम लगाने के बजाय 'मुझे ऐसा लगता है' कहकर अपनी भावनाएं बताएं। यह झगड़ों से बचाता है।",
  },
  strong_area: {
    en: "Outstanding! Open and respectful communication creates profound emotional security in your relationships.",
    hi: "बेहतरीन! खुलकर और सम्मान से बात करना आपके रिश्तों में एक गहरी भावनात्मक सुरक्षा (emotional security) बनाता है।",
  },
};

// ── Q10: Mindful Silence (शांत समय) ──
const e10: QuestionSuggestions = {
  label: "Mindful Silence (शांत समय)",
  needs_attention: {
    en: "Sit quietly with your eyes closed for 2 minutes every morning. Silence clears morning mental fog and confusion.",
    hi: "हर सुबह 2 मिनट के लिए आँखें बंद करके शांति से बैठें। मौन (Silence) सुबह के मानसिक कोहरे और उलझन को साफ करता है।",
  },
  building_zone: {
    en: "You're on track! Gradually increase your silent time to 5-10 mins. This deeply enhances focus and self-awareness.",
    hi: "आप सही रास्ते पर हैं! अपना शांत समय धीरे-धीरे 5-10 मिनट तक बढ़ाएं। यह फोकस और आत्म-जागरूकता (self-awareness) को गहरा करता है।",
  },
  strong_area: {
    en: "Supreme! Daily 10 minutes of silence or meditation brings profound clarity and recharges your soul.",
    hi: "सर्वोत्तम! रोज़ाना 10 मिनट का मौन या ध्यान गहरी क्लैरिटी लाता है और आपकी आत्मा को रिचार्ज करता है।",
  },
};

// ── Section 4: All 10 questions (index 0–9) ──
export const SECTION4_SUGGESTIONS: QuestionSuggestions[] = [
  e1, // Q1 – Gratitude
  e2, // Q2 – Avoiding Negativity
  e3, // Q3 – Quality Family Time
  e4, // Q4 – Positive Self-Talk
  e5, // Q5 – Nature Connection
  e6, // Q6 – Resilience/Optimism
  e7, // Q7 – Emotional Stability
  e8, // Q8 – Stress Management
  e9, // Q9 – Open Communication
  e10, // Q10 – Mindful Silence
];

/**
 * Get all Needs Attention items for Section 4
 * based on the user's answers for section index 3 (s3-q0 … s3-q9).
 */
export interface NeedsAttentionItem4 {
  questionIndex: number;
  label: string;
  suggestion: { en: string; hi: string };
}

export function getSection4NeedsAttention(
  answers: Record<string, number>,
): NeedsAttentionItem4[] {
  const items: NeedsAttentionItem4[] = [];
  for (let qi = 0; qi < 10; qi++) {
    const score = answers[`s3-q${qi}`] ?? 0;
    if (score <= 1) {
      const suggestion = SECTION4_SUGGESTIONS[qi];
      items.push({
        questionIndex: qi,
        label: suggestion.label,
        suggestion: suggestion.needs_attention,
      });
    }
  }
  return items;
}
