// ─────────────────────────────────────────────
// ABL PULSE – English Questions Data
// Section: Assessment Questionnaire
// DO NOT change question wording or sequence.
// ─────────────────────────────────────────────

export const OPTIONS_EN = [
  "Never",
  "Rarely",
  "Sometimes",
  "Often",
  "Daily",
] as const;

export const SECTIONS_EN = [
  {
    title: "Section 1 – Sleep & Hydration Routine Assessment",
    subtitle:
      "Assess Your Current Sleep & Hydration Habits to Identify Areas for Improvement.",
    questions: [
      "Do You Drink 1–2 Glasses of Warm Water Immediately After Waking Up?",
      "Drink water sitting down and sipping slowly?",
      "Do you wait about 45 minutes after eating before you have any water?",
      "Avoid heavy water intake before bed?",
      "Drinking 2.5–3 liters of water daily?",
      "Do you get a full 7 to 8 hours of continuous sleep each night?",
      "Wake up feeling fresh and energetic?",
      "Do You Sleep Soundly Through The Night Without Waking Up Often?",
      "Do You Avoid Screens (Phone/TV) At Least One Hour Before Sleeping?",
      "Do You Fall Asleep Within 15–20 Minutes After Going to Bed?",
    ],
  },
  {
    title: "Section 2 – Gut Cleanse & Metabolic",
    subtitle:
      "This Section Helps You Understand The Current State of Your Digestion, Metabolism & Daily Food Habits.",
    questions: [
      "Do You Chew Your Food At Least 20–30 Times Before Swallowing?",
      "Do You Drink Warm Water or Herbal Drink Instead of Tea/Coffee on an empty stomach?",
      "Do You Include a Small Amount of Pure Ghee in Your Daily Meals?",
      "Do You Keep a Gap of At Least 12 Hours Between Dinner and the Next Day's Breakfast?",
      "Do You Completely Avoid Refined White Sugar in Your Daily Diet?",
      "Do You Finish Your Dinner At Least 2 to 3 Hours Before Going to Sleep?",
      "Do You Include Fresh Salads or Seasonal Fruits in Your Daily Diet for Better Digestion?",
      "Do You Include Soaked Seeds (Like Pumpkin/Sunflower) or Nuts in Your Diet?",
      "Do You Feel Light and Energetic (Instead of Heavy/Sleepy) After Finishing Your Meals?",
      "Do You Have a Clear, Effortless Bowel Movement Every Morning Soon After Waking Up?",
    ],
  },
  {
    title: "Section 3 – Movement & Circulation Flow",
    subtitle:
      "This Section Helps You Understand Your Current Movement Habits, Circulation Level & Daily Physical Activity Pattern.",
    questions: [
      "Do You Get 15–20 Minutes of Morning Sunlight Daily?",
      "Do You Go for A Walk or Complete At Least 5,000 Steps Daily?",
      "Do You Go for Walks Without Your Phone?",
      "Do You Practice Stretches that Improve Lower Body Flexibility (Such As Butterfly Pose)?",
      "Do You Take Short Movement Breaks if You Sit for Long Hours?",
      "Do You Engage in Physical Activity that Makes You Sweat Lightly At Least Once A Day?",
      "Do You Do Strength Training or Work Out Regularly?",
      "Do You Practice Deep Breathing Exercises Daily?",
      "Do You Practice Relaxation Postures (Such As Legs-Up-The-Wall) Before Sleep?",
      "Do You Feel Active & Energetic During Most of The Day?",
    ],
  },
  {
    title: "Section 4 – Mind & Emotional Balance",
    subtitle:
      "This part helps you get a clear look at your stress, how emotionally balanced you feel, and how well you are getting along with others.",
    questions: [
      "Do You Practice Gratitude by Thinking About the Good Things and People in Your Life?",
      "Do You Try to Stay Away From Complaining or Negative Talks?",
      "Do You Spend Quality Time with Your Family Without Distractions Like Phones or TV?",
      "Do You Say Positive Things About Your Health and Your Body?",
      "Do You Take Time for Activities Like Visiting a Park or Caring for Plants?",
      "Do You Believe that Difficult Situations can Lead to Something Positive?",
      "Do You Feel Emotionally Steady and Calm on Most Days?",
      "Do You Handle Stressful Situations Calmly Without Overreacting?",
      "Do You Talk Openly and Respectfully with Your Family/Loved Ones?",
      "Do You Spend at Least 10 Minutes in Silence or Meditation Daily to clear your mind?",
    ],
  },
] as const;

export const ASSESSMENT_CONTENT_EN = {
  headline: "Get Your Health Readiness Score",
  subheadline: "Difference Between Current Habits & Optimal Health Lifestyle",
  description:
    "Discover The Current Condition of Your Body & Understand What kind of Care, Correction & Routine Adjustment it Needs — and when.",
  hindiTagline: "आपकी आज की आदतों और आपकी सबसे बेहतरीन सेहत के बीच का फासला।",
  benefits: [
    "You'll Get to Know Your Health More Closely & Find Out How Ready You are for a Change.",
    "Through Guided Questions, You will Recognize What Healthy Habits You are Missing.",
    "You will Identify Small Daily Routine Mistakes that may be Creating Long-Term Health Problems.",
  ],
  formTitle: "Your Basic Information",
  fields: {
    name: "Full Name",
    gender: "Gender",
    genderOptions: ["Male", "Female", "Other"],
    age: "Age (Years)",
    profession: "Profession",
    professionOptions: ["Student", "Job", "Business", "Professional", "Others"],
    weight: "Weight (Kg)",
    height: "Height (Feet)",
    bp: "Blood Pressure (BP)",
    sugar: "Sugar / Diabetes",
    thyroid: "Thyroid",
    whatsapp: "WhatsApp Number (Report will be sent here)",
    email: "Email ID (Optional)",
    yes: "Yes",
    no: "No",
  },
  submit: "Preview and Take Assessment →",
  backHome: "Back to Home",
  required: "This field is required",
  comingSoonBadge: "Coming Soon",
  comingSoonHeadline: "Questionnaire Coming Soon",
  comingSoonSub:
    "The full Health Readiness Assessment questionnaire is being developed. Check back soon!",
  backToForm: "← Back to Form",
} as const;
