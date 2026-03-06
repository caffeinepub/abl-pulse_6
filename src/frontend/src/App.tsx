import {
  Activity,
  ArrowLeft,
  BedDouble,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Eye,
  EyeOff,
  Facebook,
  Heart,
  Home,
  Instagram,
  Leaf,
  Menu,
  Phone,
  Star,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Scroll utility
───────────────────────────────────────────── */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 72; // desktop navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

/* ─────────────────────────────────────────────
   Scroll reveal hook
───────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const el of els) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   Logo image with text fallback
───────────────────────────────────────────── */
function LogoImage({
  imgClassName = "",
  textClassName = "",
  textStyle = {},
  showText = true,
}: {
  imgClassName?: string;
  textClassName?: string;
  textStyle?: CSSProperties;
  showText?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex items-center gap-2.5">
      {!imgFailed ? (
        <img
          src="/assets/uploads/ABL-Pulse-Logo-1.png"
          alt="ABL PULSE"
          loading="eager"
          className={`object-contain flex-shrink-0 ${imgClassName}`}
          onError={() => setImgFailed(true)}
        />
      ) : (
        /* Fallback: styled heartbeat icon */
        <div
          className={`flex items-center justify-center rounded-full flex-shrink-0 ${imgClassName}`}
          style={{ background: "oklch(var(--abl-green))" }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="w-2/3 h-2/3"
            aria-hidden="true"
          >
            <polyline
              points="2,20 10,20 14,10 20,30 26,10 30,30 34,20 40,20"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {showText && (
        <span
          className={`font-display font-bold tracking-tight ${textClassName}`}
          style={textStyle}
        >
          ABL PULSE
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Leaf SVG decoration
───────────────────────────────────────────── */
function LeafDecor({
  className = "",
  size = 120,
  opacity = 0.08,
}: {
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={`absolute pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M60 10 C 90 10, 110 40, 60 110 C 10 40, 30 10, 60 10 Z"
        fill="oklch(var(--abl-green))"
      />
      <path
        d="M60 10 C 60 10, 60 60, 60 110"
        stroke="oklch(var(--abl-bg))"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   LOGIN MODAL
───────────────────────────────────────────── */
function LoginModal({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
      style={{
        background: "oklch(var(--abl-dark) / 0.75)",
        backdropFilter: "blur(6px)",
      }}
      data-ocid="login.dialog"
    >
      {/* Click-outside to close (accessible via button, keyboard ESC handled in effect above) */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
      />
      {/* Modal panel */}
      <dialog
        open
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-glow m-0 p-0 border-0"
        style={{ background: "white" }}
        aria-labelledby="login-title"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "oklch(var(--abl-green))" }}
        >
          <div className="flex items-center gap-3">
            <LogoImage
              imgClassName="h-8 w-8"
              textClassName="text-base"
              textStyle={{ color: "white" }}
            />
          </div>
          <button
            type="button"
            data-ocid="login.close_button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{
              color: "rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.12)",
            }}
            aria-label="Close login"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-6 pb-7 flex flex-col gap-5">
          <div>
            <h2
              id="login-title"
              className="font-display font-bold text-xl mb-1"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Welcome Back
            </h2>
            <p
              className="text-sm"
              style={{ color: "oklch(var(--abl-border))" }}
            >
              Sign in to your ABL PULSE account
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              data-ocid="login.email_input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1.5px solid oklch(var(--abl-border))",
                color: "oklch(var(--abl-green))",
                background: "oklch(var(--abl-bg))",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "oklch(var(--abl-green))";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px oklch(var(--abl-green) / 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "oklch(var(--abl-border))";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                data-ocid="login.password_input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid oklch(var(--abl-border))",
                  color: "oklch(var(--abl-green))",
                  background: "oklch(var(--abl-bg))",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "oklch(var(--abl-green))";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px oklch(var(--abl-green) / 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "oklch(var(--abl-border))";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "oklch(var(--abl-border))" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            data-ocid="login.submit_button"
            onClick={() => {
              // placeholder — no backend wired yet
            }}
            className="btn-green w-full py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase shadow-wellness mt-1"
          >
            Login to ABL PULSE
          </button>

          {/* Forgot note */}
          <p
            className="text-center text-xs"
            style={{ color: "oklch(var(--abl-border))" }}
          >
            Forgot Password?{" "}
            <button
              type="button"
              className="font-semibold hover:underline"
              style={{ color: "oklch(var(--abl-gold))" }}
              onClick={() => {
                onClose();
                scrollToSection("footer");
              }}
            >
              Contact Us
            </button>
          </p>
        </div>
      </dialog>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ASSESSMENT PAGE — Full form + Questionnaire + Done
───────────────────────────────────────────── */

import { useActor } from "./hooks/useActor";
import {
  ASSESSMENT_CONTENT,
  type Lang,
  type NeedsAttentionItem,
  type NeedsAttentionItem2,
  QUESTION_OPTIONS,
  SECTIONS,
  getSection1NeedsAttention,
  getSection2NeedsAttention,
} from "./logic/index";
import { type ScoreResult, calculateScore } from "./logic/scoring";

/* ─────────────────────────────────────────────
   QUESTIONNAIRE STEP
───────────────────────────────────────────── */
function QuestionnaireStep({
  lang,
  onLangToggle,
  onBackToForm,
  onDone,
}: {
  lang: Lang;
  onLangToggle: () => void;
  onBackToForm: () => void;
  onDone: (answers: Record<string, number>) => void;
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showPreview, setShowPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = SECTIONS[lang];
  const options = QUESTION_OPTIONS[lang];
  const section = sections[currentSection];

  // Count how many questions in current section are answered
  const answeredCount = section.questions.filter(
    (_, qi) => answers[`s${currentSection}-q${qi}`] !== undefined,
  ).length;
  const allAnswered = answeredCount === section.questions.length;

  // Fix 3: Scroll the fixed container itself to top (not window)
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const handleBack = () => {
    if (currentSection === 0) {
      onBackToForm();
    } else {
      setCurrentSection((s) => s - 1);
      scrollToTop();
    }
  };

  const handleNext = () => {
    if (!allAnswered) return;
    if (currentSection < 3) {
      setCurrentSection((s) => s + 1);
      scrollToTop();
    } else {
      onDone(answers);
    }
  };

  const setAnswer = (
    sectionIdx: number,
    questionIdx: number,
    optionIdx: number,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [`s${sectionIdx}-q${questionIdx}`]: optionIdx,
    }));
  };

  // Fix 4: Lang toggle uses stable ref to avoid stale closure issues
  const onLangToggleRef = useRef(onLangToggle);
  onLangToggleRef.current = onLangToggle;

  // Preview modal: show current section answers
  const PreviewModal = () => {
    const enOptions = QUESTION_OPTIONS.en;
    const hiOptions = QUESTION_OPTIONS.hi;
    const enSection = SECTIONS.en[currentSection];
    const hiSection = SECTIONS.hi[currentSection];
    return (
      <div
        className="fixed inset-0 z-[1200] flex items-start justify-center p-4 overflow-y-auto"
        style={{
          background: "oklch(var(--abl-dark) / 0.75)",
          backdropFilter: "blur(6px)",
        }}
        data-ocid="questionnaire.preview.dialog"
      >
        <div
          className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-glow my-6"
          style={{ background: "white" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: "oklch(var(--abl-green))" }}
          >
            <span className="font-bold text-white text-sm">
              {lang === "en"
                ? `Preview — Section ${currentSection + 1}`
                : `प्रीव्यू — भाग ${currentSection + 1}`}
            </span>
            <button
              type="button"
              data-ocid="questionnaire.preview.close_button"
              onClick={() => setShowPreview(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{
                color: "rgba(255,255,255,0.8)",
                background: "rgba(255,255,255,0.12)",
              }}
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>
          {/* Body */}
          <div className="px-5 py-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
            {section.questions.map((_, qi) => {
              const key = `s${currentSection}-q${qi}`;
              const selectedIdx = answers[key];
              const enQ = enSection.questions[qi];
              const hiQ = hiSection.questions[qi];
              const optLabel =
                selectedIdx !== undefined
                  ? `${enOptions[selectedIdx]} / ${hiOptions[selectedIdx]}`
                  : lang === "en"
                    ? "Not answered"
                    : "उत्तर नहीं दिया";
              return (
                <div
                  key={key}
                  className="rounded-xl p-3"
                  style={{
                    background:
                      selectedIdx !== undefined
                        ? "oklch(var(--abl-bg))"
                        : "oklch(var(--abl-border) / 0.08)",
                    border: "1px solid oklch(var(--abl-border) / 0.4)",
                  }}
                >
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    Q{qi + 1}. {lang === "en" ? enQ : hiQ}
                  </p>
                  <p
                    className="text-xs font-bold"
                    style={{
                      color:
                        selectedIdx !== undefined
                          ? "oklch(var(--abl-gold))"
                          : "#e53e3e",
                    }}
                  >
                    {optLabel}
                  </p>
                </div>
              );
            })}
          </div>
          <div
            className="px-5 py-4"
            style={{ borderTop: "1px solid oklch(var(--abl-border))" }}
          >
            <button
              type="button"
              data-ocid="questionnaire.preview.close_button"
              onClick={() => setShowPreview(false)}
              className="w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: "oklch(var(--abl-green))", color: "white" }}
            >
              {lang === "en" ? "Close Preview" : "प्रीव्यू बंद करें"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showPreview && <PreviewModal />}
      <div
        ref={containerRef}
        data-ocid="assessment.page"
        className="fixed inset-0 z-[900] flex flex-col overflow-y-auto"
        style={{ background: "oklch(var(--abl-bg))" }}
      >
        {/* Decorative background */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <LeafDecor className="top-0 right-0" size={200} opacity={0.05} />
          <LeafDecor
            className="bottom-40 left-0 rotate-180"
            size={160}
            opacity={0.04}
          />
        </div>

        {/* ── Sticky Top Bar ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{
            background: "white",
            borderBottom: "1px solid oklch(var(--abl-border))",
          }}
        >
          <button
            type="button"
            data-ocid="questionnaire.back_button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              color: "oklch(var(--abl-green))",
              background: "oklch(var(--abl-green) / 0.08)",
              border: "1px solid oklch(var(--abl-green) / 0.2)",
            }}
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">
              {currentSection === 0
                ? lang === "en"
                  ? "Back to Form"
                  : "फॉर्म पर वापस"
                : lang === "en"
                  ? "Previous Section"
                  : "पिछला भाग"}
            </span>
          </button>

          {/* Language toggles — Fix 4: use ref to avoid stale closure */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              data-ocid="questionnaire.lang_en_toggle"
              onClick={() => {
                if (lang !== "en") onLangToggleRef.current();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: lang === "en" ? "oklch(var(--abl-green))" : "white",
                color: lang === "en" ? "white" : "oklch(var(--abl-green))",
                border: `1.5px solid oklch(var(--abl-green) / ${lang === "en" ? "1" : "0.3"})`,
              }}
            >
              EN
            </button>
            <button
              type="button"
              data-ocid="questionnaire.lang_hi_toggle"
              onClick={() => {
                if (lang !== "hi") onLangToggleRef.current();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: lang === "hi" ? "oklch(var(--abl-green))" : "white",
                color: lang === "hi" ? "white" : "oklch(var(--abl-green))",
                border: `1.5px solid oklch(var(--abl-green) / ${lang === "hi" ? "1" : "0.3"})`,
              }}
            >
              हिं
            </button>
          </div>
        </div>

        {/* ── Progress Indicator ── */}
        <div
          className="sticky top-[57px] z-10 flex-shrink-0 px-4 py-3"
          style={{
            background: "white",
            borderBottom: "1px solid oklch(var(--abl-border))",
          }}
          data-ocid="questionnaire.progress_indicator"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-semibold"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {lang === "en"
                  ? `Section ${currentSection + 1} of 4`
                  : `भाग ${currentSection + 1} / 4`}
              </span>
              <span
                className="text-xs"
                style={{ color: "oklch(var(--abl-border))" }}
              >
                {answeredCount}/10 {lang === "en" ? "answered" : "उत्तर दिए"}
              </span>
            </div>
            {/* 4-segment progress bar */}
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="flex-1 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background:
                      idx < currentSection
                        ? "oklch(var(--abl-green))"
                        : idx === currentSection
                          ? "oklch(var(--abl-gold))"
                          : "oklch(var(--abl-border) / 0.4)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Section content ── */}
        <div className="relative z-10 flex-1 pb-32">
          <div className="max-w-2xl mx-auto px-4 pt-6">
            {/* Section header */}
            <div className="mb-6">
              <h2
                data-ocid="questionnaire.section_title"
                className="font-display font-bold text-lg sm:text-xl leading-snug mb-2"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {section.title}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                {section.subtitle}
              </p>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-6">
              {section.questions.map((question, qi) => {
                const key = `s${currentSection}-q${qi}`;
                const selectedOption = answers[key];
                return (
                  <div
                    key={key}
                    className="rounded-2xl p-4 sm:p-5"
                    style={{
                      background: "white",
                      border: "1.5px solid oklch(var(--abl-border) / 0.6)",
                      boxShadow: "0 2px 12px oklch(var(--abl-green) / 0.05)",
                    }}
                  >
                    {/* Question text */}
                    <div className="flex gap-3 mb-4">
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background:
                            selectedOption !== undefined
                              ? "oklch(var(--abl-green))"
                              : "oklch(var(--abl-green) / 0.1)",
                          color:
                            selectedOption !== undefined
                              ? "white"
                              : "oklch(var(--abl-green))",
                        }}
                      >
                        {String(qi + 1).padStart(2, "0")}
                      </span>
                      <p
                        className="text-sm sm:text-base font-medium leading-snug flex-1"
                        style={{ color: "oklch(var(--abl-green))" }}
                      >
                        {question}
                      </p>
                    </div>

                    {/* Options — 5 pills in a flex-wrap row */}
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt, oi) => {
                        const isSelected = selectedOption === oi;
                        return (
                          <button
                            key={opt}
                            type="button"
                            data-ocid={`questionnaire.option.${currentSection}-${qi}-${oi}`}
                            onClick={() => setAnswer(currentSection, qi, oi)}
                            className="flex-1 min-w-[calc(20%-0.5rem)] py-2.5 px-2 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              minHeight: "44px",
                              background: isSelected
                                ? "oklch(var(--abl-green))"
                                : "white",
                              color: isSelected
                                ? "white"
                                : "oklch(var(--abl-green))",
                              border: `1.5px solid ${isSelected ? "oklch(var(--abl-green))" : "oklch(var(--abl-green) / 0.3)"}`,
                              boxShadow: isSelected
                                ? "0 2px 8px oklch(var(--abl-green) / 0.25)"
                                : "none",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fix 2: Preview button — after questions list */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                data-ocid="questionnaire.preview_button"
                onClick={() => setShowPreview(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  color: "oklch(var(--abl-gold))",
                  background: "oklch(var(--abl-gold) / 0.08)",
                  border: "1.5px solid oklch(var(--abl-gold) / 0.35)",
                }}
              >
                <Eye size={15} />
                {lang === "en"
                  ? `Preview Section ${currentSection + 1} Answers`
                  : `भाग ${currentSection + 1} के उत्तर देखें`}
              </button>
            </div>
          </div>
        </div>

        {/* ── Sticky bottom CTA ── */}
        <div
          className="sticky bottom-0 z-10 flex-shrink-0"
          style={{
            background:
              "linear-gradient(to top, white 70%, rgba(255,255,255,0) 100%)",
            paddingTop: "1rem",
            paddingBottom: "env(safe-area-inset-bottom, 0.75rem)",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <button
              type="button"
              data-ocid={
                currentSection < 3
                  ? "questionnaire.next_button"
                  : "questionnaire.submit_button"
              }
              onClick={handleNext}
              disabled={!allAnswered}
              className="w-full py-4 rounded-2xl text-sm font-bold tracking-wide uppercase transition-all"
              style={{
                background: allAnswered
                  ? "oklch(var(--abl-green))"
                  : "oklch(var(--abl-border) / 0.4)",
                color: allAnswered ? "white" : "oklch(var(--abl-border))",
                cursor: allAnswered ? "pointer" : "not-allowed",
                boxShadow: allAnswered
                  ? "0 4px 16px oklch(var(--abl-green) / 0.3)"
                  : "none",
              }}
            >
              {!allAnswered
                ? lang === "en"
                  ? `Answer All Questions (${answeredCount}/10)`
                  : `सभी प्रश्नों का उत्तर दें (${answeredCount}/10)`
                : currentSection < 3
                  ? lang === "en"
                    ? "Next Section →"
                    : "अगला भाग →"
                  : lang === "en"
                    ? "Submit Assessment ✓"
                    : "मूल्यांकन जमा करें ✓"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SECTION 1 RESULT CARD (Sleep & Hydration)
───────────────────────────────────────────── */
function Section1ResultCard({
  answers,
  pillarScore,
  lang,
}: {
  answers: Record<string, number>;
  pillarScore: number;
  lang: Lang;
}) {
  const needsAttentionItems: NeedsAttentionItem[] =
    getSection1NeedsAttention(answers);
  const hasAlert = needsAttentionItems.length > 0;

  return (
    <div
      data-ocid="result.section1_card"
      className="w-full rounded-2xl overflow-hidden shadow-sm relative"
      style={{
        background: "white",
        border: "1.5px solid oklch(var(--abl-border) / 0.6)",
      }}
    >
      {/* Red Alert icon — top right corner — only when hasAlert */}
      {hasAlert && (
        <span
          className="absolute top-3 right-3 text-base leading-none"
          aria-label="Needs Attention Alert"
          title="Some habits need attention"
        >
          🔴
        </span>
      )}

      {/* Card Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid oklch(var(--abl-border) / 0.4)" }}
      >
        <p
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: "oklch(var(--abl-green-mid))" }}
        >
          {lang === "en" ? "Section 1" : "भाग 1"}
        </p>
        <h3
          className="font-display font-bold text-base pr-8"
          style={{ color: "oklch(var(--abl-green))" }}
        >
          {lang === "en" ? "Sleep & Hydration" : "नींद और हाइड्रेशन"}
        </h3>
        <p
          className="text-sm font-bold mt-1"
          style={{ color: "oklch(var(--abl-gold))" }}
        >
          {lang === "en"
            ? `Score: ${pillarScore}/40`
            : `स्कोर: ${pillarScore}/40`}
        </p>
      </div>

      {/* Needs Attention items — blank if none */}
      {hasAlert && (
        <div className="px-5 py-4 flex flex-col gap-3">
          <p
            className="text-xs font-bold tracking-wide uppercase flex items-center gap-1.5"
            style={{ color: "#DC2626" }}
          >
            <span aria-hidden="true">⚠</span>
            {lang === "en" ? "Needs Attention" : "ध्यान दें"}
          </p>
          <ul className="flex flex-col gap-3">
            {needsAttentionItems.map((item) => (
              <li key={item.questionIndex} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#DC2626", marginTop: "0.45rem" }}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    {lang === "en"
                      ? `Never / Rarely — ${item.label}`
                      : `कभी नहीं / शायद ही — ${item.label}`}
                  </span>
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {lang === "en" ? item.suggestion.en : item.suggestion.hi}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION 2 RESULT CARD (Gut Cleanse & Metabolic)
───────────────────────────────────────────── */
function Section2ResultCard({
  answers,
  pillarScore,
  lang,
}: {
  answers: Record<string, number>;
  pillarScore: number;
  lang: Lang;
}) {
  const needsAttentionItems: NeedsAttentionItem2[] =
    getSection2NeedsAttention(answers);
  const hasAlert = needsAttentionItems.length > 0;

  return (
    <div
      data-ocid="result.section2_card"
      className="w-full rounded-2xl overflow-hidden shadow-sm relative"
      style={{
        background: "white",
        border: "1.5px solid oklch(var(--abl-border) / 0.6)",
      }}
    >
      {/* Red Alert icon — top right corner — only when hasAlert */}
      {hasAlert && (
        <span
          className="absolute top-3 right-3 text-base leading-none"
          aria-label="Needs Attention Alert"
          title="Some habits need attention"
        >
          🔴
        </span>
      )}

      {/* Card Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid oklch(var(--abl-border) / 0.4)" }}
      >
        <p
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: "oklch(var(--abl-green-mid))" }}
        >
          {lang === "en" ? "Section 2" : "भाग 2"}
        </p>
        <h3
          className="font-display font-bold text-base pr-8"
          style={{ color: "oklch(var(--abl-green))" }}
        >
          {lang === "en" ? "Gut Cleanse & Metabolic" : "गट क्लींज और मेटाबोलिक"}
        </h3>
        <p
          className="text-sm font-bold mt-1"
          style={{ color: "oklch(var(--abl-gold))" }}
        >
          {lang === "en"
            ? `Score: ${pillarScore}/40`
            : `स्कोर: ${pillarScore}/40`}
        </p>
      </div>

      {/* Needs Attention items — blank if none */}
      {hasAlert && (
        <div className="px-5 py-4 flex flex-col gap-3">
          <p
            className="text-xs font-bold tracking-wide uppercase flex items-center gap-1.5"
            style={{ color: "#DC2626" }}
          >
            <span aria-hidden="true">⚠</span>
            {lang === "en" ? "Needs Attention" : "ध्यान दें"}
          </p>
          <ul className="flex flex-col gap-3">
            {needsAttentionItems.map((item) => (
              <li key={item.questionIndex} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: "#DC2626", marginTop: "0.45rem" }}
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    {lang === "en"
                      ? `Never / Rarely — ${item.label}`
                      : `कभी नहीं / शायद ही — ${item.label}`}
                  </span>
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {lang === "en" ? item.suggestion.en : item.suggestion.hi}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULT SCREEN
───────────────────────────────────────────── */
function ResultScreen({
  result,
  answers,
  lang,
  onBack,
}: {
  result: ScoreResult;
  answers: Record<string, number>;
  lang: Lang;
  onBack: () => void;
}) {
  // Category color tokens
  const categoryConfig = {
    needs_attention: {
      color: "#DC2626",
      bg: "rgba(220,38,38,0.08)",
      border: "rgba(220,38,38,0.25)",
    },
    building_zone: {
      color: "oklch(var(--abl-gold))",
      bg: "oklch(var(--abl-gold) / 0.08)",
      border: "oklch(var(--abl-gold) / 0.3)",
    },
    strong_area: {
      color: "oklch(var(--abl-green))",
      bg: "oklch(var(--abl-green) / 0.08)",
      border: "oklch(var(--abl-green) / 0.25)",
    },
  };

  const cfg = categoryConfig[result.category];

  return (
    <div
      data-ocid="result.page"
      className="fixed inset-0 z-[900] flex flex-col overflow-y-auto"
      style={{ background: "oklch(var(--abl-bg))" }}
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <LeafDecor className="top-0 right-0" size={220} opacity={0.05} />
        <LeafDecor
          className="bottom-0 left-0 rotate-180"
          size={180}
          opacity={0.04}
        />
      </div>

      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "white",
          borderBottom: "1px solid oklch(var(--abl-border))",
        }}
      >
        <button
          type="button"
          data-ocid="result.back_button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            color: "oklch(var(--abl-green))",
            background: "oklch(var(--abl-green) / 0.08)",
            border: "1px solid oklch(var(--abl-green) / 0.2)",
          }}
        >
          <ArrowLeft size={15} />
          <span>{lang === "en" ? "Back to Home" : "होम पर वापस जाएं"}</span>
        </button>

        <LogoImage
          imgClassName="h-8 w-8"
          textClassName="text-sm"
          textStyle={{ color: "oklch(var(--abl-green))" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 py-8 px-4 pb-20">
        <div className="max-w-md mx-auto flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <LogoImage
            imgClassName="h-12 w-12"
            textClassName="text-base"
            textStyle={{ color: "oklch(var(--abl-green))" }}
          />

          {/* Header label pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              background: "oklch(var(--abl-gold) / 0.1)",
              border: "1px solid oklch(var(--abl-gold) / 0.3)",
              color: "oklch(var(--abl-gold))",
            }}
          >
            {lang === "en"
              ? "Your Health Readiness Score"
              : "आपका हेल्थ रेडीनेस स्कोर"}
          </div>

          {/* Main Score Card */}
          <div
            data-ocid="result.card"
            className="w-full rounded-2xl overflow-hidden shadow-md"
            style={{
              background: "white",
              border: `2px solid ${cfg.border}`,
            }}
          >
            {/* Top: Score number */}
            <div className="py-8 px-6 flex flex-col items-center gap-1">
              <span
                className="font-display font-bold leading-none"
                style={{ fontSize: "4.5rem", color: cfg.color }}
              >
                {result.totalScore}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                {lang === "en" ? "out of 160" : "160 में से"}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: cfg.border }} />

            {/* Bottom: Category info */}
            <div
              className="py-6 px-6 flex flex-col items-center gap-2"
              style={{ background: cfg.bg }}
            >
              <span className="text-3xl" aria-hidden="true">
                {result.categoryEmoji}
              </span>
              <h2
                className="font-display font-bold text-xl"
                style={{ color: cfg.color }}
              >
                {result.categoryLabel}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                {result.summaryMessage}
              </p>
            </div>
          </div>

          {/* Section 1 Result Card */}
          <div className="w-full text-left">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              {lang === "en" ? "Section-wise Suggestions" : "भाग-वार सुझाव"}
            </p>
            <Section1ResultCard
              answers={answers}
              pillarScore={result.pillarScores.sleep}
              lang={lang}
            />
            <div className="mt-4">
              <Section2ResultCard
                answers={answers}
                pillarScore={result.pillarScores.gut}
                lang={lang}
              />
            </div>
          </div>

          {/* Tagline pill */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background: "oklch(var(--abl-green))" }}
          >
            {["Clarity", "Correction", "Consistency"].map((word, i) => (
              <span key={word} className="flex items-center gap-2">
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "white" }}
                >
                  {word}
                </span>
                {i < 2 && (
                  <span
                    style={{ color: "oklch(var(--abl-gold))" }}
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Back to Home button */}
          <button
            type="button"
            data-ocid="result.primary_button"
            onClick={onBack}
            className="btn-green w-full py-4 rounded-2xl text-sm font-bold tracking-wide uppercase inline-flex items-center justify-center gap-2 shadow-wellness"
          >
            <ArrowLeft size={14} />
            <span>{lang === "en" ? "Back to Home" : "होम पर वापस जाएं"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// assessmentContent is now imported from logic/index as ASSESSMENT_CONTENT
const assessmentContent = ASSESSMENT_CONTENT;

type AssessmentFormState = {
  name: string;
  gender: string;
  age: string;
  profession: string;
  weight: string;
  height: string;
  bp: string;
  sugar: string;
  thyroid: string;
  whatsapp: string;
  email: string;
};

type AssessmentErrors = Partial<Record<keyof AssessmentFormState, string>>;

function AssessmentPage({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const [step, setStep] = useState<"form" | "questionnaire" | "result">("form");
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, number>>({});
  const { actor } = useActor();
  const [form, setForm] = useState<AssessmentFormState>({
    name: "",
    gender: "",
    age: "",
    profession: "",
    weight: "",
    height: "",
    bp: "",
    sugar: "",
    thyroid: "",
    whatsapp: "",
    email: "",
  });
  const [errors, setErrors] = useState<AssessmentErrors>({});

  const c = assessmentContent[lang];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // (scroll-to-top on step change is handled inline in setStep calls)

  const setField = (field: keyof AssessmentFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: AssessmentErrors = {};
    if (!form.name.trim()) newErrors.name = c.required;
    if (!form.gender) newErrors.gender = c.required;
    if (!form.age.trim()) newErrors.age = c.required;
    if (!form.whatsapp.trim()) newErrors.whatsapp = c.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setStep("questionnaire");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const inputStyle = {
    border: "1.5px solid oklch(var(--abl-border))",
    color: "oklch(var(--abl-green))",
    background: "white",
    borderRadius: "0.5rem",
    padding: "0.45rem 0.75rem",
    fontSize: "0.8125rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
  } as const;

  const inputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = "oklch(var(--abl-green))";
    e.currentTarget.style.boxShadow =
      "0 0 0 3px oklch(var(--abl-green) / 0.12)";
  };
  const inputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = "oklch(var(--abl-border))";
    e.currentTarget.style.boxShadow = "none";
  };

  const YesNoToggle = ({
    value,
    field,
    ocid,
  }: {
    value: string;
    field: keyof AssessmentFormState;
    ocid: string;
  }) => (
    <div className="flex gap-2" data-ocid={ocid}>
      {[c.fields.yes, c.fields.no].map((opt, idx) => {
        const val = idx === 0 ? "yes" : "no";
        const active = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => setField(field, val)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: active ? "oklch(var(--abl-green))" : "white",
              color: active ? "white" : "oklch(var(--abl-green))",
              border: `1.5px solid oklch(var(--abl-green) / ${active ? "1" : "0.35"})`,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  /* ── QUESTIONNAIRE STEP ── */
  if (step === "questionnaire") {
    return (
      <QuestionnaireStep
        lang={lang}
        onLangToggle={() => setLang(lang === "en" ? "hi" : "en")}
        onBackToForm={() => {
          setStep("form");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDone={(answers) => {
          const result = calculateScore(answers);
          setScoreResult(result);
          setSavedAnswers(answers);
          setStep("result");
          // Fire-and-forget backend save
          const answersArray = Array.from({ length: 40 }, (_, i) => {
            const sectionIdx = Math.floor(i / 10);
            const questionIdx = i % 10;
            return BigInt(answers[`s${sectionIdx}-q${questionIdx}`] ?? 0);
          });
          if (actor) {
            actor
              .submitAssessment(
                form.name,
                form.gender,
                form.age,
                form.profession,
                form.weight,
                form.height,
                form.bp,
                form.sugar,
                form.thyroid,
                form.whatsapp,
                form.email || null,
                answersArray,
              )
              .catch(console.error);
          }
        }}
      />
    );
  }

  /* ── RESULT STEP ── */
  if (step === "result" && scoreResult) {
    return (
      <ResultScreen
        result={scoreResult}
        answers={savedAnswers}
        lang={lang}
        onBack={onBack}
      />
    );
  }

  /* ── FORM STEP ── */
  return (
    <div
      data-ocid="assessment.page"
      className="fixed inset-0 z-[900] flex flex-col overflow-y-auto"
      style={{ background: "oklch(var(--abl-bg))" }}
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <LeafDecor className="top-0 right-0" size={200} opacity={0.06} />
        <LeafDecor
          className="bottom-40 left-0 rotate-180"
          size={160}
          opacity={0.04}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-3xl"
          style={{ background: "oklch(var(--abl-green) / 0.05)" }}
        />
      </div>

      {/* ── Sticky Top Bar ── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "white",
          borderBottom: "1px solid oklch(var(--abl-border))",
        }}
      >
        {/* Back to Home */}
        <button
          type="button"
          data-ocid="assessment.back_button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            color: "oklch(var(--abl-green))",
            background: "oklch(var(--abl-green) / 0.08)",
            border: "1px solid oklch(var(--abl-green) / 0.2)",
          }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">{c.backHome}</span>
        </button>

        {/* Language toggles */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            data-ocid="assessment.lang_en_toggle"
            onClick={() => setLang("en")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: lang === "en" ? "oklch(var(--abl-green))" : "white",
              color: lang === "en" ? "white" : "oklch(var(--abl-green))",
              border: `1.5px solid oklch(var(--abl-green) / ${lang === "en" ? "1" : "0.3"})`,
            }}
          >
            EN
          </button>
          <button
            type="button"
            data-ocid="assessment.lang_hi_toggle"
            onClick={() => setLang("hi")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: lang === "hi" ? "oklch(var(--abl-green))" : "white",
              color: lang === "hi" ? "white" : "oklch(var(--abl-green))",
              border: `1.5px solid oklch(var(--abl-green) / ${lang === "hi" ? "1" : "0.3"})`,
            }}
          >
            हिं
          </button>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="relative z-10 flex-1 pb-16">
        {/* ── Section 1: Intro ── */}
        <section className="max-w-2xl mx-auto px-4 pt-8 pb-6 text-center flex flex-col items-center gap-5">
          <LogoImage
            imgClassName="h-12 w-12 sm:h-14 sm:w-14"
            textClassName="text-lg sm:text-xl"
            textStyle={{ color: "oklch(var(--abl-green))" }}
          />

          <h1
            className="font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight"
            style={{ color: "oklch(var(--abl-green))" }}
          >
            {c.headline}
          </h1>

          <p
            className="font-semibold text-base sm:text-lg leading-snug"
            style={{ color: "oklch(var(--abl-gold))" }}
          >
            {c.subheadline}
          </p>

          <p
            className="text-sm sm:text-base leading-relaxed max-w-xl"
            style={{ color: "oklch(var(--abl-green-mid))" }}
          >
            {c.description}
          </p>

          <p
            className="text-xs sm:text-sm italic"
            style={{ color: "oklch(var(--abl-green-mid))" }}
          >
            {c.hindiTagline}
          </p>

          {/* Benefits */}
          <ul className="flex flex-col gap-3 text-left w-full max-w-xl">
            {c.benefits.map((b) => (
              <li key={b.slice(0, 30)} className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: "oklch(var(--abl-green))" }}
                />
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Section 2: Basic Information Form ── */}
        <section className="max-w-lg mx-auto px-4 pb-10">
          <div
            className="rounded-2xl p-5 sm:p-7 flex flex-col gap-5"
            style={{
              background: "white",
              border: "1.5px solid oklch(var(--abl-green) / 0.15)",
              boxShadow: "0 4px 32px oklch(var(--abl-green) / 0.08)",
            }}
          >
            <h2
              className="font-display font-bold text-xl sm:text-2xl"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              {c.formTitle}
            </h2>

            {/* 1. Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="a-name"
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.name} <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                id="a-name"
                type="text"
                data-ocid="assessment.name_input"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder={
                  lang === "en" ? "Enter your full name" : "अपना पूरा नाम दर्ज करें"
                }
                autoComplete="name"
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
              {errors.name && (
                <span className="text-xs" style={{ color: "#e53e3e" }}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* 2. Gender */}
            <div
              className="flex flex-col gap-2"
              data-ocid="assessment.gender_radio"
            >
              <span
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.gender} <span style={{ color: "#e53e3e" }}>*</span>
              </span>
              <div className="flex gap-2 flex-wrap">
                {c.fields.genderOptions.map((opt, idx) => {
                  const val = ["male", "female", "other"][idx];
                  const active = form.gender === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setField("gender", val)}
                      className="flex-1 min-w-[70px] py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: active
                          ? "oklch(var(--abl-green))"
                          : "white",
                        color: active ? "white" : "oklch(var(--abl-green))",
                        border: `1.5px solid oklch(var(--abl-green) / ${active ? "1" : "0.3"})`,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {errors.gender && (
                <span className="text-xs" style={{ color: "#e53e3e" }}>
                  {errors.gender}
                </span>
              )}
            </div>

            {/* 3. Age */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="a-age"
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.age} <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                id="a-age"
                type="number"
                data-ocid="assessment.age_input"
                value={form.age}
                onChange={(e) => setField("age", e.target.value)}
                placeholder="25"
                min="1"
                max="120"
                autoComplete="age"
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
              {errors.age && (
                <span className="text-xs" style={{ color: "#e53e3e" }}>
                  {errors.age}
                </span>
              )}
            </div>

            {/* 4. Profession */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="a-profession"
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.profession}
              </label>
              <select
                id="a-profession"
                data-ocid="assessment.profession_select"
                value={form.profession}
                onChange={(e) => setField("profession", e.target.value)}
                style={{ ...inputStyle, appearance: "auto" }}
                onFocus={inputFocus}
                onBlur={inputBlur}
              >
                <option value="">
                  {lang === "en" ? "Select your profession" : "अपना पेशा चुनें"}
                </option>
                {c.fields.professionOptions.map((opt, idx) => {
                  const vals = [
                    "student",
                    "job",
                    "business",
                    "professional",
                    "others",
                  ];
                  return (
                    <option key={vals[idx]} value={vals[idx]}>
                      {opt}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 5 & 6. Weight + Height (row) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="a-weight"
                  className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  {c.fields.weight}
                </label>
                <input
                  id="a-weight"
                  type="number"
                  data-ocid="assessment.weight_input"
                  value={form.weight}
                  onChange={(e) => setField("weight", e.target.value)}
                  placeholder="70"
                  min="20"
                  max="300"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="a-height"
                  className="text-xs font-semibold tracking-wide uppercase"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  {c.fields.height}
                </label>
                <input
                  id="a-height"
                  type="number"
                  data-ocid="assessment.height_input"
                  value={form.height}
                  onChange={(e) => setField("height", e.target.value)}
                  placeholder="5.6"
                  min="1"
                  max="10"
                  step="0.1"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>
            </div>

            {/* 7. BP */}
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.bp}
              </span>
              <YesNoToggle
                value={form.bp}
                field="bp"
                ocid="assessment.bp_toggle"
              />
            </div>

            {/* 8. Sugar */}
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.sugar}
              </span>
              <YesNoToggle
                value={form.sugar}
                field="sugar"
                ocid="assessment.sugar_toggle"
              />
            </div>

            {/* 9. Thyroid */}
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.thyroid}
              </span>
              <YesNoToggle
                value={form.thyroid}
                field="thyroid"
                ocid="assessment.thyroid_toggle"
              />
            </div>

            {/* 10. WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="a-whatsapp"
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.whatsapp} <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                id="a-whatsapp"
                type="tel"
                data-ocid="assessment.whatsapp_input"
                value={form.whatsapp}
                onChange={(e) => setField("whatsapp", e.target.value)}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
              {errors.whatsapp && (
                <span className="text-xs" style={{ color: "#e53e3e" }}>
                  {errors.whatsapp}
                </span>
              )}
            </div>

            {/* 11. Email (optional) */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="a-email"
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                {c.fields.email}
              </label>
              <input
                id="a-email"
                type="email"
                data-ocid="assessment.email_input"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </div>

            {/* Required note */}
            <p
              className="text-xs"
              style={{ color: "oklch(var(--abl-border))" }}
            >
              <span style={{ color: "#e53e3e" }}>*</span>{" "}
              {lang === "en" ? "Required fields" : "अनिवार्य फ़ील्ड"}
            </p>

            {/* Submit button */}
            <button
              type="button"
              data-ocid="assessment.submit_button"
              onClick={handleSubmit}
              className="btn-gold w-full py-4 rounded-2xl text-sm font-bold tracking-wide uppercase shadow-wellness mt-1"
            >
              {c.submit}
            </button>

            {/* Tagline under button */}
            <p
              className="text-center text-xs font-semibold tracking-widest"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              Clarity · Correction · Consistency
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION 1 — Navbar
───────────────────────────────────────────── */
function Navbar({
  mobileMenuOpen,
  setMobileMenuOpen,
  onAssessment,
  onLogin,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  onAssessment: () => void;
  onLogin: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", id: "home", isAssessment: false },
    { label: "Assessment", id: "assessment", isAssessment: true },
    { label: "Services", id: "framework", isAssessment: false },
    { label: "About Us", id: "trust", isAssessment: false },
    { label: "Contact Us", id: "footer", isAssessment: false },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header
        className={`
          hidden md:flex fixed top-0 left-0 right-0 z-[800]
          items-center justify-between px-6 lg:px-10
          h-[68px] transition-all duration-300
          ${scrolled ? "bg-white/95 backdrop-blur-md shadow-wellness" : "bg-white/90 backdrop-blur-sm"}
        `}
        style={{
          borderBottom: scrolled
            ? "1px solid oklch(var(--abl-border))"
            : "none",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="focus-visible:outline-none"
          aria-label="ABL PULSE Home"
          data-ocid="nav.home_link"
        >
          <LogoImage
            imgClassName="h-11 w-11"
            textClassName="text-xl"
            textStyle={{ color: "oklch(var(--abl-green))" }}
          />
        </button>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {links.map((l) => (
            <button
              type="button"
              key={l.id}
              data-ocid={`nav.${l.id === "home" ? "home" : l.id === "assessment" ? "assessment" : l.id === "framework" ? "services" : l.id === "trust" ? "about" : "contact"}_link`}
              onClick={() => {
                if (l.isAssessment) {
                  onAssessment();
                } else {
                  scrollToSection(l.id);
                }
              }}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-abl-card"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              {l.label}
            </button>
          ))}
          <button
            type="button"
            data-ocid="nav.login_link"
            onClick={onLogin}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-abl-card"
            style={{ color: "oklch(var(--abl-green-mid))" }}
          >
            Login
          </button>
        </nav>

        {/* CTA */}
        <button
          type="button"
          onClick={onAssessment}
          className="btn-green px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-wellness"
          data-ocid="nav.assessment_button"
        >
          Get Your Score
        </button>
      </header>

      {/* Mobile top bar (minimal — main nav is bottom bar) */}
      <header
        className={`
          md:hidden fixed top-0 left-0 right-0 z-[800]
          flex items-center justify-between px-4 h-14
          bg-white/95 backdrop-blur-md
          ${scrolled ? "shadow-xs" : ""}
        `}
        style={{ borderBottom: "1px solid oklch(var(--abl-border))" }}
      >
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          aria-label="ABL PULSE Home"
        >
          <LogoImage
            imgClassName="h-9 w-9"
            textClassName="text-base"
            textStyle={{ color: "oklch(var(--abl-green))" }}
          />
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg"
          style={{ color: "oklch(var(--abl-green))" }}
          aria-label="Toggle menu"
          data-ocid="nav.mobile_menu_toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed top-14 left-0 right-0 z-[790] bg-white shadow-glow"
          style={{ borderBottom: "1px solid oklch(var(--abl-border))" }}
        >
          <nav className="flex flex-col py-3">
            {links.map((l) => (
              <button
                type="button"
                key={l.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (l.isAssessment) {
                    onAssessment();
                  } else {
                    scrollToSection(l.id);
                  }
                }}
                className="px-6 py-3.5 text-left text-sm font-medium hover:bg-abl-card transition-colors"
                style={{ color: "oklch(var(--abl-green))" }}
                data-ocid={`nav.mobile_${l.id}_link`}
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLogin();
              }}
              className="px-6 py-3.5 text-left text-sm font-medium hover:bg-abl-card transition-colors"
              style={{ color: "oklch(var(--abl-green-mid))" }}
              data-ocid="nav.mobile_login_link"
            >
              Login
            </button>
            <div className="px-4 pb-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAssessment();
                }}
                className="btn-green w-full py-3 rounded-xl text-sm font-semibold"
                data-ocid="nav.mobile_assessment_button"
              >
                Get Your Free Score
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   SECTION 2 — Hero
───────────────────────────────────────────── */
function HeroSection({ onAssessment }: { onAssessment: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center hero-gradient overflow-hidden pt-20 pb-28 md:pb-16"
    >
      {/* Decorative blobs */}
      <LeafDecor
        className="top-10 right-4 md:right-16"
        size={160}
        opacity={0.12}
      />
      <LeafDecor
        className="bottom-20 left-0 rotate-180"
        size={200}
        opacity={0.1}
      />
      <div
        className="absolute top-1/4 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(var(--abl-green) / 0.08)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(var(--abl-gold) / 0.10)" }}
        aria-hidden="true"
      />
      {/* Green radial glow behind headline */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(var(--abl-green) / 0.07)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 container max-w-3xl mx-auto px-5 text-center">
        {/* USP badge */}
        <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 mx-auto">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{
              color: "oklch(var(--abl-gold))",
              background: "oklch(var(--abl-gold) / 0.1)",
              padding: "0.375rem 1rem",
              borderRadius: "999px",
              border: "1px solid oklch(var(--abl-gold) / 0.25)",
            }}
          >
            Clarity. Correction. Consistency.
          </span>
        </div>

        {/* H1 */}
        <h1
          className="reveal reveal-delay-1 font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4"
          style={{ color: "oklch(var(--abl-green))" }}
        >
          Know Your{" "}
          <span style={{ color: "oklch(var(--abl-gold))" }}>
            Health Readiness
          </span>{" "}
          Score?
        </h1>

        {/* H2 */}
        <p
          className="reveal reveal-delay-2 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto"
          style={{ color: "oklch(var(--abl-green-mid))" }}
        >
          Discover the small daily habits affecting your health.
        </p>

        {/* Trust indicators */}
        <div className="reveal reveal-delay-3 flex flex-wrap items-center justify-center gap-4 mb-8">
          {["Free Assessment", "Takes 5 Minutes", "40+ Years Expertise"].map(
            (t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2
                  size={14}
                  style={{ color: "oklch(var(--abl-green))" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  {t}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Primary CTA */}
        <div className="reveal reveal-delay-4">
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={onAssessment}
            className="btn-gold w-full sm:w-auto px-8 py-4 rounded-2xl text-sm sm:text-base font-bold tracking-wide shadow-gold uppercase inline-flex items-center justify-center gap-2"
          >
            <span>Get Your Health Readiness Score (FREE)</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Heartbeat decoration */}
        <div className="mt-12 flex justify-center">
          <svg
            width="200"
            height="40"
            viewBox="0 0 200 40"
            fill="none"
            className="animate-pulse-soft opacity-30"
            aria-hidden="true"
          >
            <polyline
              points="0,20 30,20 45,5 60,35 75,5 90,35 105,5 120,35 135,20 200,20"
              stroke="oklch(var(--abl-green))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 3 — Problem Cards
───────────────────────────────────────────── */
const problems = [
  {
    icon: BedDouble,
    title: "Fragmented, Poor-Quality Sleep",
    copy: "Assess Your Current Sleep & Hydration Habits to Identify Areas for Improvement.",
    label: "Sleep & Hydration",
  },
  {
    icon: Leaf,
    title: "Persistent Gut Discomfort",
    copy: "You Understand The Current State of Your Digestion, Metabolism & Daily Food Habits.",
    label: "Gut & Metabolism",
  },
  {
    icon: Activity,
    title: "Sluggish Movement & Poor Circulation",
    copy: "You Understand Your Current Movement Habits, Circulation Level & Daily Physical Activity Pattern.",
    label: "Movement & Flow",
  },
  {
    icon: Brain,
    title: "Mental & Emotional Imbalance",
    copy: "You get a clear look at your stress, how emotionally balanced you feel, and how well you are getting along with others.",
    label: "Mind & Emotions",
  },
];

function ProblemSection() {
  return (
    <section
      id="problems"
      className="section-pad"
      style={{ background: "oklch(var(--abl-bg))" }}
    >
      <div className="container max-w-4xl mx-auto px-5">
        <div className="text-center mb-10">
          <span
            className="reveal inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{
              color: "oklch(var(--abl-gold))",
              background: "oklch(var(--abl-gold) / 0.1)",
            }}
          >
            Pain Points
          </span>
          <h2
            className="reveal reveal-delay-1 font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-tight"
            style={{ color: "oklch(var(--abl-green))" }}
          >
            Is Your Lifestyle{" "}
            <span style={{ color: "oklch(var(--abl-gold))" }}>
              Holding You Back?
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`wellness-card reveal reveal-delay-${i + 1} p-6 flex flex-col gap-4`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(var(--abl-green) / 0.12)" }}
                  >
                    <Icon
                      size={22}
                      style={{ color: "oklch(var(--abl-green))" }}
                    />
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold tracking-widest uppercase mb-1 block"
                      style={{ color: "oklch(var(--abl-green-mid))" }}
                    >
                      {p.label}
                    </span>
                    <h3
                      className="font-display font-bold text-base leading-snug"
                      style={{ color: "oklch(var(--abl-gold))" }}
                    >
                      {p.title}
                    </h3>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  {p.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4 — 3-Step Framework
───────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "CLARITY",
    subtitle: "Assessment",
    copy: "Understand your unique health baseline. Take our brief, interactive ABL Pulse assessment to generate your personalized Health Readiness Score.",
    icon: ClipboardList,
  },
  {
    num: "02",
    title: "CORRECTION",
    subtitle: "Expert Guidance",
    copy: "Book a detailed 1-on-1 consultation with our Certified Lifestyle Experts (Ayurveda & Naturopathy) to interpret your results and receive personalized guidance.",
    icon: Users,
  },
  {
    num: "03",
    title: "CONSISTENCY",
    subtitle: "Training Program, Webinar, Camps",
    copy: "Join our structured Lifestyle Readiness Program, beginning with a vital 7-Day Behavioral & Cultural Reset to build lasting, healthy habits.",
    icon: Star,
  },
];

function FrameworkSection() {
  return (
    <section
      id="framework"
      className="section-pad"
      style={{ background: "oklch(var(--abl-card))" }}
    >
      <div className="container max-w-5xl mx-auto px-5">
        <div className="text-center mb-12">
          <span
            className="reveal inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{
              color: "oklch(var(--abl-green))",
              background: "oklch(var(--abl-green) / 0.08)",
            }}
          >
            Our Process
          </span>
          <h2
            className="reveal reveal-delay-1 font-display font-bold text-2xl sm:text-3xl md:text-4xl leading-tight max-w-2xl mx-auto"
            style={{ color: "oklch(var(--abl-green))" }}
          >
            The ABL PULSE Framework
            <br />
            <span style={{ color: "oklch(var(--abl-gold))" }}>
              Clarity. Correction. Consistency.
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 md:gap-0 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="flex flex-col md:flex-row items-stretch flex-1"
              >
                {/* Step card */}
                <div
                  className={`reveal reveal-delay-${i + 1} flex-1 flex flex-col gap-4 p-6 md:p-8 rounded-2xl`}
                  style={{
                    background: i === 1 ? "oklch(var(--abl-green))" : "white",
                    border:
                      i !== 1 ? "1.5px solid oklch(var(--abl-border))" : "none",
                    boxShadow:
                      i === 1
                        ? "0 8px 32px oklch(var(--abl-green) / 0.35)"
                        : undefined,
                  }}
                >
                  {/* Number + icon */}
                  <div className="flex items-center gap-3">
                    <span
                      className="step-number"
                      style={{
                        color: i === 1 ? "rgba(255,255,255,0.2)" : undefined,
                      }}
                    >
                      {s.num}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          i === 1
                            ? "rgba(255,255,255,0.15)"
                            : "oklch(var(--abl-green) / 0.08)",
                      }}
                    >
                      <Icon
                        size={18}
                        style={{
                          color: i === 1 ? "white" : "oklch(var(--abl-green))",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold tracking-widest uppercase mb-0.5"
                      style={{
                        color:
                          i === 1
                            ? "rgba(255,255,255,0.6)"
                            : "oklch(var(--abl-border))",
                      }}
                    >
                      {s.subtitle}
                    </p>
                    <h3
                      className="font-display font-bold text-lg md:text-xl"
                      style={{
                        color: i === 1 ? "white" : "oklch(var(--abl-gold))",
                      }}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{
                      color:
                        i === 1
                          ? "rgba(255,255,255,0.85)"
                          : "oklch(var(--abl-green-mid))",
                    }}
                  >
                    {s.copy}
                  </p>
                </div>

                {/* Connector arrow (between cards) */}
                {i < 2 && (
                  <div className="flex md:flex-col items-center justify-center py-4 md:py-0 px-0 md:px-3">
                    <ChevronRight
                      size={20}
                      className="rotate-90 md:rotate-0"
                      style={{ color: "oklch(var(--abl-border))" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 5 — Trust / Expert
───────────────────────────────────────────── */
function TrustSection() {
  return (
    <section
      id="trust"
      className="section-pad green-section relative overflow-hidden"
    >
      {/* Decorative elements */}
      <LeafDecor
        className="top-0 right-0 opacity-10"
        size={200}
        opacity={0.08}
      />
      <LeafDecor
        className="bottom-0 left-0 rotate-90 opacity-10"
        size={160}
        opacity={0.06}
      />

      <div className="container max-w-4xl mx-auto px-5 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Photo */}
          <div className="reveal flex-shrink-0 flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden"
                style={{
                  border: "4px solid oklch(var(--abl-gold))",
                  boxShadow: "0 0 0 8px oklch(var(--abl-gold) / 0.15)",
                }}
              >
                <img
                  src="/assets/uploads/Dr-Suman-Lal-2.png"
                  alt="Dr. Suman Ma'am – Naturopathy Practitioner"
                  loading="eager"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center top" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.style.background = "oklch(var(--abl-green))";
                      parent.setAttribute("aria-label", "Dr. Suman Ma'am");
                    }
                  }}
                />
              </div>
              {/* Years badge */}
              <div
                className="absolute -bottom-3 -right-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-gold"
                style={{
                  background: "oklch(var(--abl-gold))",
                  color: "white",
                }}
              >
                40+ Years
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="reveal reveal-delay-1 flex flex-col gap-4 text-center md:text-left">
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full self-center md:self-start"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Expert Guidance You Can Trust
            </span>

            <div>
              <h2
                className="font-display font-bold text-2xl md:text-3xl mb-1"
                style={{ color: "white" }}
              >
                Dr. Suman Ma'am
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Naturopathy Practitioner | Doctorate in Psychology |{" "}
                <span style={{ color: "oklch(var(--abl-gold))" }}>
                  "Food As Medicine" Expert
                </span>
              </p>
            </div>

            {/* Quote */}
            <blockquote
              className="relative pl-4 italic text-sm md:text-base leading-relaxed"
              style={{
                color: "oklch(var(--abl-gold))",
                borderLeft: "3px solid oklch(var(--abl-gold))",
              }}
            >
              "Daily routine ko structure karna aur herbal tarike se body ko
              balance me lana hi asli healing hai."
            </blockquote>

            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              Dr. Suman Ma'am has dedicated her life to understanding the
              profound impact of food, water, and lifestyle on human health.
            </p>

            {/* Credentials row */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-1">
              {["Naturopathy", "Psychology PhD", "Food As Medicine"].map(
                (c) => (
                  <span
                    key={c}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {c}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 6 — Testimonials (Placeholder)
───────────────────────────────────────────── */
const socialCards = [
  {
    icon: Facebook,
    platform: "Facebook",
    color: "#1877F2",
    text: "Testimonials from our Facebook community will be featured here soon.",
    count: "10K+ Followers",
  },
  {
    icon: Youtube,
    platform: "YouTube",
    color: "#FF0000",
    text: "Watch real transformation stories from our YouTube channel, coming soon.",
    count: "5K+ Subscribers",
  },
  {
    icon: Instagram,
    platform: "Instagram",
    color: "#E1306C",
    text: "Follow our wellness journey on Instagram. Testimonials coming soon.",
    count: "8K+ Followers",
  },
];

function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="section-pad"
      style={{ background: "oklch(var(--abl-card))" }}
    >
      <div className="container max-w-4xl mx-auto px-5">
        <div className="text-center mb-10">
          <span
            className="reveal inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{
              color: "oklch(var(--abl-gold))",
              background: "oklch(var(--abl-gold) / 0.1)",
            }}
          >
            Community
          </span>
          <h2
            className="reveal reveal-delay-1 font-display font-bold text-2xl sm:text-3xl md:text-4xl"
            style={{ color: "oklch(var(--abl-green))" }}
          >
            What Our Community Says
          </h2>
          <p
            className="reveal reveal-delay-2 text-sm mt-2"
            style={{ color: "oklch(var(--abl-green-mid))" }}
          >
            Real stories from real people — links coming soon
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {socialCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.platform}
                className={`wellness-card reveal reveal-delay-${i + 1} p-6 flex flex-col items-center text-center gap-4`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "oklch(var(--abl-green) / 0.1)" }}
                >
                  <Icon
                    size={28}
                    style={{ color: "oklch(var(--abl-green))" }}
                  />
                </div>
                <div>
                  <h3
                    className="font-bold text-base mb-0.5"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {s.platform}
                  </h3>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "oklch(var(--abl-gold))" }}
                  >
                    {s.count}
                  </span>
                </div>
                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  {s.text}
                </p>
                <div
                  className="mt-auto flex gap-1"
                  aria-label={`${s.platform} stars`}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={12}
                      fill="oklch(var(--abl-gold))"
                      style={{ color: "oklch(var(--abl-gold))" }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 7 — Pre-Footer CTA
───────────────────────────────────────────── */
function PreFooterCTA({ onAssessment }: { onAssessment: () => void }) {
  return (
    <section
      id="prefooter-cta"
      className="section-pad relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(var(--abl-green)) 0%, oklch(var(--abl-green-mid)) 100%)",
      }}
    >
      <LeafDecor className="top-0 right-0" size={180} opacity={0.07} />
      <LeafDecor className="bottom-0 left-4" size={140} opacity={0.06} />

      <div className="container max-w-2xl mx-auto px-5 text-center relative z-10">
        <div className="reveal">
          <Heart
            size={36}
            className="mx-auto mb-6 animate-float"
            fill="oklch(var(--abl-gold))"
            style={{ color: "oklch(var(--abl-gold))" }}
          />
        </div>
        <h2
          className="reveal reveal-delay-1 font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-4"
          style={{ color: "white" }}
        >
          Stop Surviving.{" "}
          <span style={{ color: "oklch(var(--abl-gold))" }}>Start Thrive.</span>
        </h2>
        <p
          className="reveal reveal-delay-2 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Discover your personalized Health Readiness Score. It's free,
          interactive, and takes less than 5 minutes.
        </p>
        <div className="reveal reveal-delay-3">
          <button
            type="button"
            data-ocid="prefooter.primary_button"
            onClick={onAssessment}
            className="btn-gold w-full sm:w-auto px-8 py-4 rounded-2xl text-sm sm:text-base font-bold tracking-wide shadow-gold uppercase inline-flex items-center justify-center gap-2"
          >
            <span>Analyze My Lifestyle Readiness (FREE)</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="reveal reveal-delay-4 flex flex-wrap gap-4 justify-center mt-8">
          {["100% Free", "No Credit Card", "Instant Results"].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle2
                size={13}
                style={{ color: "rgba(255,255,255,0.7)" }}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 8 — Footer
───────────────────────────────────────────── */
function Footer({
  onAssessment,
  onLogin,
}: {
  onAssessment: () => void;
  onLogin: () => void;
}) {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", id: "home", isAssessment: false },
    { label: "Assessment", id: "assessment", isAssessment: true },
    { label: "Services", id: "framework", isAssessment: false },
    { label: "About Us", id: "trust", isAssessment: false },
  ];

  return (
    <footer
      id="footer"
      className="pb-24 md:pb-0"
      style={{ background: "oklch(var(--abl-dark))" }}
    >
      <div className="container max-w-5xl mx-auto px-5 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1 flex flex-col gap-4">
            <LogoImage
              imgClassName="h-10 w-10"
              textClassName="text-lg"
              textStyle={{ color: "white" }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              ABL Care – Structured Lifestyle Readiness Platform for Long-Term
              Health Balance.
            </p>
            <p
              className="text-xs font-semibold tracking-widest"
              style={{ color: "oklch(var(--abl-gold))" }}
            >
              Clarity. Correction. Consistency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (l.isAssessment) {
                        onAssessment();
                      } else {
                        scrollToSection(l.id);
                      }
                    }}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                    data-ocid={`footer.${l.id}_link`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <button
                  type="button"
                  data-ocid="footer.terms_link"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onClick={() => alert("Terms of Service coming soon!")}
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="footer.privacy_link"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onClick={() => alert("Privacy Policy coming soon!")}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="footer.dashboard_link"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onClick={onLogin}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="footer.contact_link"
                  onClick={() => scrollToSection("footer")}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t pt-6 mt-2 flex flex-col gap-4"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          {/* Medical disclaimer */}
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <strong style={{ color: "rgba(255,255,255,0.6)" }}>
              MEDICAL DISCLAIMER:
            </strong>{" "}
            ABL PULSE is a lifestyle guidance platform, not a medical facility.
            It provides Ayurvedic wisdom and natural lifestyle guidance for
            educational purposes only. Always consult a medical professional for
            clinical advice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              © {year} ABL Pvt Ltd. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Built with{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   BOTTOM APP BAR (Mobile)
───────────────────────────────────────────── */
const navItems = [
  {
    icon: Home,
    label: "Home",
    id: "home",
    ocid: "nav.mobile.home_link",
    isAssessment: false,
  },
  {
    icon: ClipboardList,
    label: "Assessment",
    id: "assessment",
    ocid: "nav.mobile.assessment_link",
    isAssessment: true,
  },
  {
    icon: Briefcase,
    label: "Services",
    id: "framework",
    ocid: "nav.mobile.services_link",
    isAssessment: false,
  },
  {
    icon: Users,
    label: "About",
    id: "trust",
    ocid: "nav.mobile.about_link",
    isAssessment: false,
  },
  {
    icon: Phone,
    label: "Contact",
    id: "footer",
    ocid: "nav.mobile.contact_link",
    isAssessment: false,
  },
];

function BottomAppBar({
  activeSection,
  onAssessment,
}: {
  activeSection: string;
  onAssessment: () => void;
}) {
  return (
    <nav className="bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="flex items-stretch justify-around h-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={item.ocid}
              onClick={() => {
                if (item.isAssessment) {
                  onAssessment();
                } else {
                  scrollToSection(item.id);
                }
              }}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors duration-150"
              style={{
                color: isActive
                  ? "oklch(var(--abl-green))"
                  : "oklch(var(--abl-border))",
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={isActive ? 22 : 20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{
                  transform: isActive ? "translateY(-1px)" : "none",
                  transition: "transform 0.2s",
                }}
              />
              <span
                className="text-[10px] font-medium tracking-tight"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: "oklch(var(--abl-green))" }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   WHATSAPP FLOAT
───────────────────────────────────────────── */
function WhatsAppFloat() {
  return (
    <a
      data-ocid="whatsapp.button"
      href="https://wa.me/"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contact us on WhatsApp"
      style={{
        // On mobile: above the 60px bottom nav
        bottom: "calc(60px + 16px)",
      }}
    >
      <span className="sr-only">WhatsApp</span>
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

/* ─────────────────────────────────────────────
   ACTIVE SECTION TRACKER
───────────────────────────────────────────── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("home");
  const ref = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const map = new Map<Element, string>();
    const visible = new Set<string>();

    ref.current?.disconnect();
    ref.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = map.get(e.target);
          if (!id) return;
          if (e.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        }
        // Pick the first visible section in DOM order
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { threshold: 0.3 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        map.set(el, id);
        ref.current?.observe(el);
      }
    }

    return () => ref.current?.disconnect();
  }, [ids]);

  return active;
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "assessment">("home");
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const sectionIds = [
    "home",
    "problems",
    "framework",
    "trust",
    "testimonials",
    "prefooter-cta",
    "footer",
  ];
  const activeSection = useActiveSection(sectionIds);

  useReveal();

  const goToAssessment = () => {
    setCurrentPage("assessment");
    setMobileMenuOpen(false);
  };

  const goHome = () => {
    setCurrentPage("home");
  };

  const openLogin = () => {
    setLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: "oklch(var(--abl-bg))" }}
    >
      {/* Assessment page (full-screen overlay) */}
      {currentPage === "assessment" && <AssessmentPage onBack={goHome} />}

      {/* Login modal (on top of everything) */}
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}

      {/* Main landing page — always rendered, hidden behind assessment overlay */}
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onAssessment={goToAssessment}
        onLogin={openLogin}
      />

      {/* Main content — top padding for sticky header */}
      <main className="pt-14 md:pt-[68px]">
        <HeroSection onAssessment={goToAssessment} />
        <ProblemSection />
        <FrameworkSection />
        <TrustSection />
        <TestimonialsSection />
        <PreFooterCTA onAssessment={goToAssessment} />
      </main>

      <Footer onAssessment={goToAssessment} onLogin={openLogin} />

      {/* Mobile bottom nav */}
      <BottomAppBar
        activeSection={activeSection}
        onAssessment={goToAssessment}
      />

      {/* WhatsApp float — on desktop bottom: 24px, on mobile above bottom bar */}
      <style>{`
        @media (min-width: 768px) {
          .whatsapp-float { bottom: 1.5rem !important; }
        }
      `}</style>
      <WhatsAppFloat />
    </div>
  );
}
