// jsPDF loaded via CDN (see index.html)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: Window & { jspdf: any };
const jsPDF =
  typeof window !== "undefined" && window.jspdf ? window.jspdf.jsPDF : null;
import {
  Activity,
  ArrowLeft,
  BedDouble,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  Facebook,
  Heart,
  Home,
  Image,
  Instagram,
  Leaf,
  Loader2,
  Menu,
  Phone,
  Search,
  Star,
  Trash2,
  Users,
  X,
  Youtube,
} from "lucide-react";
import {
  type CSSProperties,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  backendInterface as BackendFullInterface,
  HealthSeekerRecord,
} from "./backend.d";

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
   ADMIN DASHBOARD — helpers
───────────────────────────────────────────── */

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const d = new Date(ms);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getZoneLabel(category: string): string {
  if (category === "needs_attention") return "Needs Attention";
  if (category === "building_zone") return "Building Zone";
  if (category === "strong_area") return "Strong Area";
  if (category === "incomplete") return "Incomplete";
  return category;
}

function getZoneColors(category: string): {
  bg: string;
  color: string;
  border: string;
} {
  if (category === "needs_attention")
    return {
      bg: "rgba(220,38,38,0.1)",
      color: "#DC2626",
      border: "rgba(220,38,38,0.25)",
    };
  if (category === "building_zone")
    return {
      bg: "rgba(217,119,6,0.1)",
      color: "#D97706",
      border: "rgba(217,119,6,0.25)",
    };
  if (category === "strong_area")
    return {
      bg: "rgba(0,66,37,0.08)",
      color: "#004225",
      border: "rgba(0,66,37,0.2)",
    };
  // incomplete or unknown
  return {
    bg: "rgba(107,114,128,0.1)",
    color: "#6b7280",
    border: "rgba(107,114,128,0.25)",
  };
}

function getAdminSectionZone(score: number): string {
  if (score <= 20) return "needs_attention";
  if (score <= 30) return "building_zone";
  return "strong_area";
}

function downloadCSV(records: HealthSeekerRecord[]) {
  const header =
    "Name,Age,Gender,WhatsApp,Email,Date,Total Score,Zone,Sleep,Gut,Movement,Mind";
  const rows = records.map((r) => {
    const cols = [
      r.name,
      r.age,
      r.gender,
      r.whatsapp,
      r.email ?? "",
      formatDate(r.submittedAt),
      String(Number(r.totalScore)),
      getZoneLabel(r.category),
      String(Number(r.sleepScore)),
      String(Number(r.gutScore)),
      String(Number(r.movementScore)),
      String(Number(r.mindScore)),
    ];
    return cols.map((c) => `"${c.replace(/"/g, '""')}"`).join(",");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ABL-PULSE-Records-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────
   ADMIN DETAIL MODAL
───────────────────────────────────────────── */
function AdminDetailModal({
  record,
  onClose,
}: {
  record: HealthSeekerRecord;
  onClose: () => void;
}) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateAdminPDF(record);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sections = [
    { label: "Sleep & Hydration", score: Number(record.sleepScore) },
    { label: "Gut Cleanse & Metabolic", score: Number(record.gutScore) },
    { label: "Movement & Circulation", score: Number(record.movementScore) },
    { label: "Mind & Emotional Balance", score: Number(record.mindScore) },
  ];

  return (
    <div
      data-ocid="admin.detail_modal"
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{
          background: "white",
          maxHeight: "90vh",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,66,37,0.08)" }}
        >
          <div>
            <h3
              className="font-display font-bold text-base"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              {record.name}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              Submitted: {formatDate(record.submittedAt)}
            </p>
          </div>
          <button
            type="button"
            data-ocid="admin.detail.close_button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
            style={{ background: "oklch(var(--abl-bg))" }}
          >
            <X size={16} style={{ color: "oklch(var(--abl-green))" }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          {/* Personal Info */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2.5"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              Personal Details
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Age", record.age],
                ["Gender", record.gender],
                ["Profession", record.profession],
                ["Weight", record.weight],
                ["Height", record.height],
                ["BP", record.bp],
                ["Sugar", record.sugar],
                ["Thyroid", record.thyroid],
                ["WhatsApp", record.whatsapp],
                ["Email", record.email ?? "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl p-2.5"
                  style={{ background: "oklch(var(--abl-bg))" }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-sm font-semibold mt-0.5 truncate"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Score */}
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ background: "oklch(var(--abl-green))" }}
          >
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Overall Score
              </p>
              <p className="text-2xl font-bold text-white mt-0.5">
                {Number(record.totalScore)}
                <span className="text-sm font-normal opacity-70">/160</span>
              </p>
            </div>
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "rgba(255,255,255,0.18)",
                color: "white",
              }}
            >
              {getZoneLabel(record.category)}
            </span>
          </div>

          {/* Section Scores */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2.5"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              Section Scores
            </p>
            <div className="flex flex-col gap-2">
              {sections.map(({ label, score }) => {
                const zone = getAdminSectionZone(score);
                const zc = getZoneColors(zone);
                return (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5"
                    style={{ background: "oklch(var(--abl-bg))" }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: "oklch(var(--abl-green))" }}
                    >
                      {label}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "oklch(var(--abl-green))" }}
                      >
                        {score}
                        <span className="text-xs font-normal opacity-60">
                          /40
                        </span>
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: zc.bg,
                          color: zc.color,
                          border: `1px solid ${zc.border}`,
                        }}
                      >
                        {getZoneLabel(zone)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Answer Summary */}
          {Number(record.answers.length) === 40 && (
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2.5"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                Answer Summary
              </p>
              {[
                { label: "Sleep & Hydration", start: 0 },
                { label: "Gut & Metabolic", start: 10 },
                { label: "Movement & Circulation", start: 20 },
                { label: "Mind & Emotional Balance", start: 30 },
              ].map(({ label, start }) => (
                <div key={label} className="mb-3">
                  <p
                    className="text-xs font-semibold mb-1.5"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => {
                      const val = Number(record.answers[start + i]);
                      const color =
                        val <= 1
                          ? "#DC2626"
                          : val === 2
                            ? "#D97706"
                            : "#004225";
                      return (
                        <span
                          key={`${label}-q${i + 1}`}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                          style={{
                            background: `${color}18`,
                            color,
                            border: `1px solid ${color}44`,
                          }}
                          title={`Q${i + 1}: ${val}`}
                        >
                          {val}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Download PDF Button */}
          <button
            type="button"
            data-ocid="admin.detail.pdf_button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: isGeneratingPDF
                ? "rgba(0,66,37,0.6)"
                : "oklch(var(--abl-green))",
              color: "white",
              opacity: isGeneratingPDF ? 0.8 : 1,
            }}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating PDF…
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DELETE CONFIRMATION DIALOG
───────────────────────────────────────────── */
function DeleteConfirmDialog({
  onConfirm,
  onCancel,
  isDeleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel, isDeleting]);

  return (
    <div
      data-ocid="admin.delete.dialog"
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-xs rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(220,38,38,0.12)" }}
        >
          <h3
            className="font-display font-bold text-base mb-1"
            style={{ color: "#DC2626" }}
          >
            Delete Record?
          </h3>
          <p
            className="text-sm"
            style={{ color: "oklch(var(--abl-green-mid))" }}
          >
            This action cannot be undone. The record will be permanently
            removed.
          </p>
        </div>
        <div className="flex gap-2 p-4">
          <button
            type="button"
            data-ocid="admin.delete.cancel_button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "oklch(var(--abl-bg))",
              color: "oklch(var(--abl-green))",
              border: "1.5px solid oklch(var(--abl-green) / 0.2)",
              opacity: isDeleting ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="admin.delete.confirm_button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: "#DC2626",
              color: "white",
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   generateAdminPDF — generate branded PDF from a HealthSeekerRecord
─────────────────────────────────────────────── */
async function generateAdminPDF(record: HealthSeekerRecord): Promise<void> {
  // Map record answers (bigint[]) → Record<string, number>
  const answers: Record<string, number> = {};
  const secOffsets = [0, 10, 20, 30];
  for (let si = 0; si < 4; si++) {
    for (let qi = 0; qi < 10; qi++) {
      const idx = secOffsets[si] + qi;
      answers[`s${si}-q${qi}`] = Number(record.answers[idx] ?? 0);
    }
  }

  // Helper: load image URL → base64 data URL
  const loadImageAsDataURL = async (url: string): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) return "";
      const blob = await response.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  };

  const [logoDataURL, drSumanDataURL] = await Promise.all([
    loadImageAsDataURL("/assets/uploads/ABL-Pulse-Logo-1.png"),
    loadImageAsDataURL("/assets/uploads/Dr-Suman-Lal-2.png"),
  ]);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  const s1Items = getSection1NeedsAttention(answers);
  const s2Items = getSection2NeedsAttention(answers);
  const s3Items = getSection3NeedsAttention(answers);
  const s4Items = getSection4NeedsAttention(answers);

  const sectionNames = [
    "Sleep & Hydration",
    "Gut Cleanse & Metabolic",
    "Movement & Circulation",
    "Mind & Emotional Balance",
  ];

  const sectionScoreArr = [
    Number(record.sleepScore),
    Number(record.gutScore),
    Number(record.movementScore),
    Number(record.mindScore),
  ];

  const sectionNeedsAttention = [s1Items, s2Items, s3Items, s4Items];
  const allSuggestionsData = [
    SECTION1_SUGGESTIONS,
    SECTION2_SUGGESTIONS,
    SECTION3_SUGGESTIONS,
    SECTION4_SUGGESTIONS,
  ] as const;

  const getSectionZoneLabelColor = (score: number) => {
    if (score <= 20) return { label: "Needs Attention", color: "#DC2626" };
    if (score <= 30) return { label: "Building Zone", color: "#D97706" };
    return { label: "Strong Area", color: "#004225" };
  };

  const getSectionAllZoneSuggestions = (secIdx: number) => {
    const suggestions = allSuggestionsData[
      secIdx
    ] as typeof SECTION1_SUGGESTIONS;
    const buildingZoneItems: { label: string; text: string }[] = [];
    const strongAreaItems: { label: string; text: string }[] = [];
    for (let qi = 0; qi < 10; qi++) {
      const score = answers[`s${secIdx}-q${qi}`] ?? 0;
      const sugg = suggestions[qi];
      if (score === 2) {
        buildingZoneItems.push({
          label: sugg.label,
          text: sugg.building_zone.en,
        });
      } else if (score >= 3) {
        strongAreaItems.push({ label: sugg.label, text: sugg.strong_area.en });
      }
    }
    return { buildingZoneItems, strongAreaItems };
  };

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  const pageW = 210;
  const pageH = 297;
  const ml = 18;
  const mr = 18;
  const mt = 15;
  const mb = 18;
  const contentW = pageW - ml - mr;
  let y = mt;

  const green = "#004225";
  const gold = "#9E6B3D";
  const gray = "#6b7280";
  const red = "#DC2626";
  const amber = "#D97706";

  const addHeader = () => {
    y = mt;
    if (logoDataURL) {
      try {
        doc.addImage(logoDataURL, "PNG", ml, y, 14, 14);
      } catch {
        /* skip */
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(green);
    doc.text("ABL PULSE", ml + 17, y + 5);
    doc.setFontSize(9);
    doc.setTextColor(gold);
    doc.setFont("helvetica", "bold");
    doc.text("Ayurved Banaye Life", ml + 17, y + 10);
    doc.setFontSize(7.5);
    doc.setTextColor(gray);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Old Museum South Wall, Dak-bangla Churaha, Near Kotwali Thana, Patna 1",
      ml + 17,
      y + 14,
    );
    doc.setFontSize(8);
    doc.setTextColor(green);
    doc.setFont("helvetica", "bold");
    doc.text("WhatsApp / Call: +91 9199434365", ml + 17, y + 18);
    y += 22;
    doc.setDrawColor(green);
    doc.setLineWidth(0.7);
    doc.line(ml, y, ml + contentW, y);
    y += 6;
  };

  const sectionLabel = (label: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(green);
    doc.text(label.toUpperCase(), ml, y);
    y += 1.5;
    doc.setDrawColor("#e5e7eb");
    doc.setLineWidth(0.3);
    doc.line(ml, y, ml + contentW, y);
    y += 5;
  };

  const newPage = () => {
    doc.addPage();
    addHeader();
  };

  const checkPage = (needed: number) => {
    if (y + needed > pageH - mb) {
      newPage();
    }
  };

  // PAGE 1
  addHeader();

  sectionLabel("Health Seeker Details");
  const fields = [
    ["Name", record.name || "—"],
    ["Age", record.age || "—"],
    ["Gender", record.gender || "—"],
    ["Date", dateStr],
  ];
  const fieldW = contentW / 4;
  fields.forEach(([label, value], i) => {
    const fx = ml + i * fieldW;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(gold);
    doc.text(String(label).toUpperCase(), fx, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(green);
    doc.text(String(value), fx, y + 4.5);
  });
  y += 12;

  checkPage(28);
  sectionLabel("Overall Health Readiness Score");
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(green);
  doc.setLineWidth(0.5);
  doc.roundedRect(ml, y, contentW, 22, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(green);
  const totalScoreStr = String(Number(record.totalScore));
  doc.text(totalScoreStr, ml + 8, y + 15);
  doc.setFontSize(12);
  doc.setTextColor(gray);
  doc.setFont("helvetica", "normal");
  doc.text("/160", ml + 8 + doc.getTextWidth(totalScoreStr) + 1, y + 15);
  const zc2 =
    record.category === "needs_attention"
      ? red
      : record.category === "building_zone"
        ? amber
        : green;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(zc2);
  doc.setLineWidth(0.5);
  doc.roundedRect(ml + contentW - 48, y + 6, 44, 10, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(zc2);
  const zoneText2 =
    record.category === "needs_attention"
      ? "Needs Attention"
      : record.category === "building_zone"
        ? "Building Zone"
        : "Strong Area";
  doc.text(zoneText2, ml + contentW - 26, y + 12.5, { align: "center" });
  y += 28;

  checkPage(35);
  sectionLabel("Section-wise Summary");
  const colW = [contentW * 0.5, contentW * 0.25, contentW * 0.25];
  doc.setFillColor(249, 250, 251);
  doc.rect(ml, y, contentW, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(gray);
  doc.text("Section", ml + 2, y + 4.8);
  doc.text("Score", ml + colW[0] + colW[1] / 2, y + 4.8, { align: "center" });
  doc.text("Zone", ml + colW[0] + colW[1] + colW[2] / 2, y + 4.8, {
    align: "center",
  });
  y += 7;
  for (const i of [0, 1, 2, 3]) {
    const sc = sectionScoreArr[i];
    const { label: zl, color: zcol } = getSectionZoneLabelColor(sc);
    doc.setDrawColor("#e5e7eb");
    doc.setLineWidth(0.2);
    doc.rect(ml, y, contentW, 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor("#1f2937");
    doc.text(sectionNames[i], ml + 2, y + 4.8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(green);
    doc.text(`${sc}/40`, ml + colW[0] + colW[1] / 2, y + 4.8, {
      align: "center",
    });
    doc.setTextColor(zcol);
    doc.text(zl, ml + colW[0] + colW[1] + colW[2] / 2, y + 4.8, {
      align: "center",
    });
    y += 7;
  }
  y += 6;

  checkPage(20);
  sectionLabel("What You Are Doing Well");
  let hasDoingWell = false;
  for (let secIdx = 0; secIdx < 4; secIdx++) {
    const { buildingZoneItems, strongAreaItems } =
      getSectionAllZoneSuggestions(secIdx);
    if (buildingZoneItems.length === 0 && strongAreaItems.length === 0)
      continue;
    hasDoingWell = true;
    checkPage(18);
    const startY = y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(green);
    doc.text(sectionNames[secIdx], ml + 3, y + 5);
    y += 8;
    if (buildingZoneItems.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(amber);
      doc.text("Building Zone", ml + 3, y + 3.5);
      y += 6;
      for (const item of buildingZoneItems) {
        checkPage(8);
        const lines = doc.splitTextToSize(`• ${item.text}`, contentW - 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#374151");
        doc.text(lines, ml + 3, y);
        y += lines.length * 4 + 1;
      }
    }
    if (strongAreaItems.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(green);
      doc.text("Strong Area", ml + 3, y + 3.5);
      y += 6;
      for (const item of strongAreaItems) {
        checkPage(8);
        const lines = doc.splitTextToSize(`• ${item.text}`, contentW - 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#374151");
        doc.text(lines, ml + 3, y);
        y += lines.length * 4 + 1;
      }
    }
    doc.setFillColor(250, 255, 254);
    doc.setDrawColor("#e5e7eb");
    doc.setLineWidth(0.3);
    doc.roundedRect(ml, startY, contentW, y - startY + 2, 2, 2);
    y += 5;
  }
  if (!hasDoingWell) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(gray);
    doc.text(
      "Keep building consistent habits to see your strong areas grow!",
      ml,
      y,
    );
    y += 8;
  }

  // PAGE 2
  newPage();
  sectionLabel("Areas to Focus On");
  for (let i = 0; i < 4; i++) {
    const secScore = sectionScoreArr[i];
    const { label: secZoneLabel, color: secZoneColor } =
      getSectionZoneLabelColor(secScore);
    const naItems = sectionNeedsAttention[i];
    const blockH = Math.max(20, 16 + naItems.length * 12) + 10;
    checkPage(blockH);
    const cardStartY = y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(green);
    doc.text(sectionNames[i], ml + 3, y + 5);
    doc.setFontSize(8);
    doc.setTextColor(gray);
    doc.text(`Score: ${secScore}/40`, ml + 3, y + 9.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(secZoneColor);
    doc.text(secZoneLabel, ml + contentW - 3, y + 5, { align: "right" });
    y += 13;
    if (naItems.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(red);
      doc.text("Needs Attention:", ml + 3, y);
      y += 5;
      for (const item of naItems) {
        checkPage(8);
        const text = item.suggestion.en;
        const lines = doc.splitTextToSize(`• ${text}`, contentW - 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#374151");
        doc.text(lines, ml + 3, y);
        y += lines.length * 4 + 1;
      }
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(gray);
      doc.text("All habits on track – no attention needed.", ml + 3, y);
      y += 6;
    }
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor("#e5e7eb");
    doc.setLineWidth(0.3);
    doc.roundedRect(ml, cardStartY, contentW, y - cardStartY + 2, 2, 2);
    y += 5;
  }

  // Expert CTA
  checkPage(28);
  doc.setFillColor(0, 66, 37);
  doc.roundedRect(ml, y, contentW, 26, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#ffffff");
  doc.text("1-on-1 Expert Consultation with Dr. Suman Lal", ml + 5, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 220, 220);
  const ctaLines = doc.splitTextToSize(
    "Apne Readiness Gap ko samajhne ke liye Dr. Suman Lal se 1-on-1 consultation book karein.",
    contentW - 10,
  );
  doc.text(ctaLines, ml + 5, y + 13);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#fcd34d");
  doc.text("WhatsApp / Call: +91 9199434365", ml + 5, y + 23);
  y += 32;

  // Footer
  const footerY = pageH - mb - 14;
  doc.setDrawColor(green);
  doc.setLineWidth(0.6);
  doc.line(ml, footerY, ml + contentW, footerY);
  if (drSumanDataURL) {
    try {
      doc.addImage(drSumanDataURL, "PNG", ml, footerY + 3, 12, 12);
    } catch {
      /* skip */
    }
  }
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(10);
  doc.setTextColor(green);
  doc.text("Dr. Suman Lal", ml + 15, footerY + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(gray);
  doc.text(
    "Naturopathy Practitioner | Doctorate in Psychology",
    ml + 15,
    footerY + 11,
  );
  doc.setFontSize(7);
  doc.setTextColor("#9b9b9b");
  doc.text("Authorized Signature", ml + 15, footerY + 14.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(green);
  doc.text("ABL PULSE", ml + contentW, footerY + 7, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(gold);
  doc.text("Ayurved Banaye Life", ml + contentW, footerY + 11, {
    align: "right",
  });
  doc.setFontSize(7);
  doc.setTextColor("#9b9b9b");
  doc.text(`Generated: ${dateStr}`, ml + contentW, footerY + 14.5, {
    align: "right",
  });

  const safeName = record.name.replace(/[^a-zA-Z0-9]/g, "-");
  doc.save(`ABL-PULSE-Report-${safeName}.pdf`);
}

/* ─────────────────────────────────────────────
   ADMIN DASHBOARD
─────────────────────────────────────────────── */
function AdminDashboard({
  onLogout,
  role,
}: { onLogout: () => void; role: "admin" | "hc" }) {
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState<
    "pipeline" | "contacts" | "analytics" | "brand_assets" | "settings"
  >("pipeline");

  // HC role: redirect away from admin-only tabs
  const safeSetActiveTab = (tab: typeof activeTab) => {
    if (role === "hc" && (tab === "analytics" || tab === "settings")) {
      setActiveTab("pipeline");
    } else {
      setActiveTab(tab);
    }
  };
  const [records, setRecords] = useState<HealthSeekerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState<
    "all" | "needs_attention" | "building_zone" | "strong_area"
  >("all");
  const [selectedRecord, setSelectedRecord] =
    useState<HealthSeekerRecord | null>(null);
  // Delete confirmation state
  const [pendingDeleteId, setPendingDeleteId] = useState<bigint | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Auto-retry state for backend restarting
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  // Fetch records
  const fetchRecords = useCallback(async () => {
    if (!actor) {
      setError("Backend not available. Please refresh and try again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await actor.getSubmissions();
      // Sort newest first
      const sorted = [...data].sort((a, b) =>
        Number(b.submittedAt - a.submittedAt),
      );
      setRecords(sorted);
      // Reset retry count on success
      retryCountRef.current = 0;
      setIsConnecting(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const isRestarting =
        msg.includes("stopped") ||
        msg.includes("IC0508") ||
        msg.includes("canister") ||
        msg.includes("replica");
      if (isRestarting) {
        setIsConnecting(true);
        setError("");
        // Auto-retry up to 10 times, every 3 seconds
        if (retryCountRef.current < 10) {
          retryCountRef.current += 1;
          retryTimerRef.current = setTimeout(() => {
            fetchRecords();
          }, 3000);
        } else {
          setIsConnecting(false);
          setError("Unable to connect to server. Please refresh the page.");
        }
      } else {
        setIsConnecting(false);
        setError("Failed to load records. Please try again.");
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = records.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchZone = zoneFilter === "all" || r.category === zoneFilter;
    return matchSearch && matchZone;
  });

  // Zone counts
  const needsAttentionCount = records.filter(
    (r) => r.category === "needs_attention",
  ).length;
  const buildingZoneCount = records.filter(
    (r) => r.category === "building_zone",
  ).length;
  const strongAreaCount = records.filter(
    (r) => r.category === "strong_area",
  ).length;

  const recentRecords = records.slice(0, 5);

  // Request delete: show confirmation dialog
  const requestDelete = (id: bigint, e: MouseEvent) => {
    e.stopPropagation();
    setPendingDeleteId(id);
  };

  // Confirm delete: call backend, then refresh
  const confirmDelete = async () => {
    if (!pendingDeleteId || !actor) return;
    setIsDeleting(true);
    try {
      await actor.deleteSubmission(BigInt(pendingDeleteId));
      // Close detail modal if this record was open
      if (selectedRecord?.id === pendingDeleteId) setSelectedRecord(null);
      setPendingDeleteId(null);
      // Reload records from backend
      await fetchRecords();
    } catch (e: unknown) {
      console.error("Delete failed:", e);
      setError("Failed to delete record. Please try again.");
      setPendingDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Shared card style
  const cardStyle: CSSProperties = {
    background: "white",
    border: "1.5px solid oklch(var(--abl-green) / 0.1)",
    boxShadow: "0 2px 8px rgba(0,66,37,0.06)",
    borderRadius: "16px",
  };

  // Analytics helpers
  const incompleteCount = records.filter(
    (r) => r.category === "incomplete",
  ).length;
  const completedRecords = records.filter((r) => r.category !== "incomplete");
  const avgScore =
    completedRecords.length > 0
      ? Math.round(
          completedRecords.reduce((acc, r) => acc + Number(r.totalScore), 0) /
            completedRecords.length,
        )
      : 0;

  // Last 7 days submissions
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const count = records.filter((r) => {
      const rd = new Date(Number(r.submittedAt) / 1_000_000);
      return (
        rd.getDate() === d.getDate() &&
        rd.getMonth() === d.getMonth() &&
        rd.getFullYear() === d.getFullYear()
      );
    }).length;
    return { day: dayStr, count };
  });
  const maxDayCount = Math.max(...last7Days.map((d) => d.count), 1);

  // Sidebar nav items
  const sidebarItems = [
    {
      id: "pipeline" as const,
      label: "Pipeline",
      Icon: Activity,
      ocid: "admin.sidebar.pipeline_link",
    },
    {
      id: "contacts" as const,
      label: "Contacts",
      Icon: Users,
      ocid: "admin.sidebar.contacts_link",
    },
    {
      id: "analytics" as const,
      label: "Analytics",
      Icon: ClipboardList,
      ocid: "admin.sidebar.analytics_link",
    },
    {
      id: "brand_assets" as const,
      label: "Brand Assets",
      Icon: Image,
      ocid: "admin.sidebar.brand_assets_link",
    },
    {
      id: "settings" as const,
      label: "Settings",
      Icon: Briefcase,
      ocid: "admin.sidebar.settings_link",
    },
  ];

  return (
    <div
      data-ocid="admin.dashboard_page"
      className="fixed inset-0 z-[900] flex flex-col"
      style={{ background: "oklch(var(--abl-bg))" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "oklch(var(--abl-green))",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <LogoImage
          imgClassName="h-8 w-8"
          textClassName="text-base"
          textStyle={{ color: "white" }}
        />
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {role === "hc" ? "Health Coach" : "Admin"} Dashboard
          </span>
        </div>
        <button
          type="button"
          data-ocid="admin.logout_button"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <X size={14} />
          Logout
        </button>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className="flex-shrink-0 flex flex-col pt-3 pb-4 gap-1 w-14 md:w-48"
          style={{
            background: "white",
            borderRight: "1.5px solid oklch(var(--abl-green) / 0.1)",
          }}
        >
          {/* Desktop sidebar: icon + label; mobile: icon only */}
          <div className="md:hidden flex flex-col gap-1 px-1.5">
            {sidebarItems
              .filter(
                (item) =>
                  role === "admin" ||
                  !["analytics", "settings"].includes(item.id),
              )
              .map(({ id, Icon, ocid }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-ocid={ocid}
                    onClick={() => safeSetActiveTab(id)}
                    className="flex items-center justify-center w-full h-11 rounded-xl transition-all"
                    style={{
                      background: isActive
                        ? "oklch(var(--abl-green))"
                        : "transparent",
                      color: isActive ? "white" : "oklch(var(--abl-green-mid))",
                    }}
                    title={id.charAt(0).toUpperCase() + id.slice(1)}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
          </div>
          <div className="hidden md:flex flex-col gap-1 px-2">
            {sidebarItems
              .filter(
                (item) =>
                  role === "admin" ||
                  !["analytics", "settings"].includes(item.id),
              )
              .map(({ id, label, Icon, ocid }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-ocid={ocid}
                    onClick={() => safeSetActiveTab(id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                    style={{
                      background: isActive
                        ? "oklch(var(--abl-green))"
                        : "transparent",
                      color: isActive ? "white" : "oklch(var(--abl-green-mid))",
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div
              data-ocid="admin.loading_state"
              className="flex flex-col items-center justify-center gap-3 py-16"
            >
              <Loader2
                size={32}
                className="animate-spin"
                style={{ color: "oklch(var(--abl-green))" }}
              />
              <p
                className="text-sm"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                Loading records…
              </p>
            </div>
          )}

          {/* Connecting / Silent Retry */}
          {isConnecting && !error && (
            <div
              className="m-4 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: "rgba(0,66,37,0.06)",
                border: "1px solid rgba(0,66,37,0.15)",
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                style={{
                  borderColor: "oklch(var(--abl-green-dark))",
                  borderTopColor: "transparent",
                }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: "oklch(var(--abl-green-dark))" }}
              >
                Connecting to server… please wait
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && !isConnecting && (
            <div
              data-ocid="admin.error_state"
              className="m-4 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.2)",
              }}
            >
              <X size={18} color="#DC2626" />
              <p
                className="text-sm font-medium flex-1"
                style={{ color: "#DC2626" }}
              >
                {error}
              </p>
              <button
                type="button"
                data-ocid="admin.retry_button"
                onClick={() => {
                  retryCountRef.current = 0;
                  if (retryTimerRef.current)
                    clearTimeout(retryTimerRef.current);
                  fetchRecords();
                }}
                className="ml-auto text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
                style={{
                  background: "#DC2626",
                  color: "white",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ─── PIPELINE TAB (was Overview) ─── */}
          {!loading && !error && activeTab === "pipeline" && (
            <div className="p-4 flex flex-col gap-4">
              {/* Total */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center justify-between"
                style={cardStyle}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Total Submissions
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  {records.length}
                </p>
              </div>

              {/* Zone stat cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div
                  className="rounded-2xl p-3 flex flex-col items-center gap-1"
                  style={{
                    background: "rgba(220,38,38,0.08)",
                    border: "1.5px solid rgba(220,38,38,0.18)",
                  }}
                >
                  <span className="text-xl">🔴</span>
                  <p className="text-lg font-bold" style={{ color: "#DC2626" }}>
                    {needsAttentionCount}
                  </p>
                  <p
                    className="text-xs font-semibold text-center leading-tight"
                    style={{ color: "#DC2626" }}
                  >
                    Needs
                    <br />
                    Attention
                  </p>
                </div>
                <div
                  className="rounded-2xl p-3 flex flex-col items-center gap-1"
                  style={{
                    background: "rgba(217,119,6,0.08)",
                    border: "1.5px solid rgba(217,119,6,0.18)",
                  }}
                >
                  <span className="text-xl">🟡</span>
                  <p className="text-lg font-bold" style={{ color: "#D97706" }}>
                    {buildingZoneCount}
                  </p>
                  <p
                    className="text-xs font-semibold text-center leading-tight"
                    style={{ color: "#D97706" }}
                  >
                    Building
                    <br />
                    Zone
                  </p>
                </div>
                <div
                  className="rounded-2xl p-3 flex flex-col items-center gap-1"
                  style={{
                    background: "rgba(0,66,37,0.07)",
                    border: "1.5px solid rgba(0,66,37,0.16)",
                  }}
                >
                  <span className="text-xl">🟢</span>
                  <p className="text-lg font-bold" style={{ color: "#004225" }}>
                    {strongAreaCount}
                  </p>
                  <p
                    className="text-xs font-semibold text-center leading-tight"
                    style={{ color: "#004225" }}
                  >
                    Strong
                    <br />
                    Area
                  </p>
                </div>
              </div>

              {/* Recent Submissions */}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2.5 px-1"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Recent Submissions (Last 5)
                </p>
                {recentRecords.length === 0 ? (
                  <div
                    className="rounded-2xl p-6 text-center"
                    style={cardStyle}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "oklch(var(--abl-green-mid))" }}
                    >
                      No submissions yet.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recentRecords.map((r, i) => {
                      const zc = getZoneColors(r.category);
                      return (
                        <button
                          type="button"
                          key={String(r.id)}
                          data-ocid={`admin.records.row.${i + 1}`}
                          className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all active:scale-[0.99]"
                          style={cardStyle}
                          onClick={() => setSelectedRecord(r)}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                            style={{
                              background: "oklch(var(--abl-green) / 0.1)",
                              color: "oklch(var(--abl-green))",
                            }}
                          >
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold truncate"
                              style={{ color: "oklch(var(--abl-green))" }}
                            >
                              {r.name}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: "oklch(var(--abl-green-mid))" }}
                            >
                              {r.whatsapp} · {formatDate(r.submittedAt)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <p
                              className="text-sm font-bold"
                              style={{ color: "oklch(var(--abl-green))" }}
                            >
                              {Number(r.totalScore)}
                              <span className="text-xs font-normal opacity-60">
                                /160
                              </span>
                            </p>
                            <span
                              className="text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                              style={{
                                background: zc.bg,
                                color: zc.color,
                                border: `1px solid ${zc.border}`,
                              }}
                            >
                              {getZoneLabel(r.category)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── CONTACTS TAB (was Records) ─── */}
          {!loading && !error && activeTab === "contacts" && (
            <div className="p-4 flex flex-col gap-3">
              {/* Search + CSV */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  />
                  <input
                    type="text"
                    data-ocid="admin.search_input"
                    placeholder="Search by name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl outline-none"
                    style={{
                      background: "white",
                      border: "1.5px solid oklch(var(--abl-green) / 0.2)",
                      color: "oklch(var(--abl-green))",
                    }}
                  />
                </div>
                <button
                  type="button"
                  data-ocid="admin.csv_download_button"
                  onClick={() => downloadCSV(filteredRecords)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all active:scale-[0.97]"
                  style={{
                    background: "oklch(var(--abl-green))",
                    color: "white",
                  }}
                >
                  <Download size={14} />
                  CSV
                </button>
              </div>

              {/* Zone Filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {(
                  [
                    {
                      id: "all",
                      label: "All",
                      ocid: "admin.zone_filter_all_button",
                    },
                    {
                      id: "needs_attention",
                      label: "🔴 Needs Attention",
                      ocid: "admin.zone_filter_na_button",
                    },
                    {
                      id: "building_zone",
                      label: "🟡 Building Zone",
                      ocid: "admin.zone_filter_bz_button",
                    },
                    {
                      id: "strong_area",
                      label: "🟢 Strong Area",
                      ocid: "admin.zone_filter_sa_button",
                    },
                  ] as const
                ).map(({ id, label, ocid }) => {
                  const isActive = zoneFilter === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      data-ocid={ocid}
                      onClick={() => setZoneFilter(id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                      style={{
                        background: isActive
                          ? "oklch(var(--abl-green))"
                          : "white",
                        color: isActive ? "white" : "oklch(var(--abl-green))",
                        border: `1.5px solid oklch(var(--abl-green) / ${isActive ? "1" : "0.25"})`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Records List */}
              {filteredRecords.length === 0 ? (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={cardStyle}
                  data-ocid="admin.records.empty_state"
                >
                  <p
                    className="text-sm"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    {search || zoneFilter !== "all"
                      ? "No matching records found."
                      : "No submissions yet."}
                  </p>
                </div>
              ) : (
                <div
                  data-ocid="admin.records_table"
                  className="flex flex-col gap-2"
                >
                  {filteredRecords.map((r, i) => {
                    const zc = getZoneColors(r.category);
                    return (
                      <div
                        key={String(r.id)}
                        data-ocid={`admin.records.row.${i + 1}`}
                        className="rounded-2xl p-3.5 flex items-center gap-3 transition-all"
                        style={cardStyle}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{
                            background: "oklch(var(--abl-bg))",
                            color: "oklch(var(--abl-green-mid))",
                          }}
                        >
                          {i + 1}
                        </div>
                        <button
                          type="button"
                          className="flex-1 min-w-0 cursor-pointer text-left"
                          onClick={() => setSelectedRecord(r)}
                        >
                          <p
                            className="text-sm font-semibold truncate"
                            style={{ color: "oklch(var(--abl-green))" }}
                          >
                            {r.name}
                          </p>
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: "oklch(var(--abl-green-mid))" }}
                          >
                            {r.age}y · {r.gender} · {r.whatsapp}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "oklch(var(--abl-border))" }}
                          >
                            {formatDate(r.submittedAt)}
                          </p>
                        </button>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <p
                            className="text-sm font-bold"
                            style={{ color: "oklch(var(--abl-green))" }}
                          >
                            {Number(r.totalScore)}
                            <span className="text-xs font-normal opacity-60">
                              /160
                            </span>
                          </p>
                          <span
                            className="text-xs font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                            style={{
                              background: zc.bg,
                              color: zc.color,
                              border: `1px solid ${zc.border}`,
                            }}
                          >
                            {getZoneLabel(r.category)}
                          </span>
                        </div>
                        {role === "admin" && (
                          <button
                            type="button"
                            data-ocid={`admin.delete_button.${i + 1}`}
                            onClick={(e) => requestDelete(r.id, e)}
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                            style={{
                              background: "rgba(220,38,38,0.08)",
                              border: "1px solid rgba(220,38,38,0.18)",
                            }}
                            title="Delete record"
                          >
                            <Trash2 size={14} color="#DC2626" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── ANALYTICS TAB ─── */}
          {!loading && !error && activeTab === "analytics" && (
            <div
              data-ocid="admin.analytics_section"
              className="p-4 flex flex-col gap-4"
            >
              {/* Key stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl p-4 flex flex-col gap-1"
                  style={cardStyle}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    Total Submissions
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {records.length}
                  </p>
                </div>
                <div
                  className="rounded-2xl p-4 flex flex-col gap-1"
                  style={cardStyle}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    Avg Score
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {completedRecords.length > 0 ? avgScore : "—"}
                    {completedRecords.length > 0 && (
                      <span className="text-sm font-normal opacity-60">
                        /160
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Zone distribution */}
              <div className="rounded-2xl p-4" style={cardStyle}>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Zone Distribution
                </p>
                {records.length === 0 ? (
                  <p
                    className="text-sm text-center py-4"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    No data yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        label: "🔴 Needs Attention",
                        count: needsAttentionCount,
                        color: "#DC2626",
                        bg: "rgba(220,38,38,0.15)",
                      },
                      {
                        label: "🟡 Building Zone",
                        count: buildingZoneCount,
                        color: "#D97706",
                        bg: "rgba(217,119,6,0.15)",
                      },
                      {
                        label: "🟢 Strong Area",
                        count: strongAreaCount,
                        color: "#004225",
                        bg: "rgba(0,66,37,0.15)",
                      },
                      {
                        label: "⬜ Incomplete",
                        count: incompleteCount,
                        color: "#6b7280",
                        bg: "rgba(107,114,128,0.12)",
                      },
                    ].map(({ label, count, color, bg }) => {
                      const pct =
                        records.length > 0
                          ? Math.round((count / records.length) * 100)
                          : 0;
                      return (
                        <div key={label}>
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="text-xs font-semibold"
                              style={{ color }}
                            >
                              {label}
                            </span>
                            <span
                              className="text-xs font-bold"
                              style={{ color }}
                            >
                              {count}{" "}
                              <span className="font-normal opacity-70">
                                ({pct}%)
                              </span>
                            </span>
                          </div>
                          <div
                            className="h-2 rounded-full overflow-hidden"
                            style={{ background: "oklch(var(--abl-bg))" }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: bg,
                                border: `1px solid ${color}55`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Last 7 days bar chart */}
              <div className="rounded-2xl p-4" style={cardStyle}>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Submissions — Last 7 Days
                </p>
                {records.length === 0 ? (
                  <p
                    className="text-sm text-center py-4"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    No data yet.
                  </p>
                ) : (
                  <div className="flex items-end gap-2 h-24">
                    {last7Days.map(({ day, count }) => {
                      const heightPct = Math.round((count / maxDayCount) * 100);
                      return (
                        <div
                          key={day}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color: "oklch(var(--abl-green))" }}
                          >
                            {count > 0 ? count : ""}
                          </span>
                          <div
                            className="w-full rounded-t-lg overflow-hidden"
                            style={{
                              height: "64px",
                              background: "oklch(var(--abl-bg))",
                              display: "flex",
                              alignItems: "flex-end",
                            }}
                          >
                            <div
                              className="w-full rounded-t-lg transition-all"
                              style={{
                                height: `${Math.max(heightPct, count > 0 ? 8 : 0)}%`,
                                background:
                                  count > 0
                                    ? "oklch(var(--abl-green))"
                                    : "transparent",
                                opacity: 0.85,
                              }}
                            />
                          </div>
                          <span
                            className="text-xs"
                            style={{
                              color: "oklch(var(--abl-green-mid))",
                              fontSize: "10px",
                            }}
                          >
                            {day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── SETTINGS TAB ─── */}
          {!loading && !error && activeTab === "settings" && (
            <div
              data-ocid="admin.settings_section"
              className="p-4 flex flex-col gap-4"
            >
              {/* Role badge */}
              <div className="rounded-2xl p-4" style={cardStyle}>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Account Role
                </p>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    background:
                      role === "admin"
                        ? "rgba(220,38,38,0.1)"
                        : "oklch(var(--abl-gold) / 0.12)",
                    color:
                      role === "admin" ? "#DC2626" : "oklch(var(--abl-gold))",
                    border: `1.5px solid ${role === "admin" ? "rgba(220,38,38,0.25)" : "oklch(var(--abl-gold) / 0.3)"}`,
                  }}
                >
                  {role === "admin" ? "Admin" : "Health Coach"}
                </span>
              </div>

              {/* Account info */}
              <div className="rounded-2xl p-4" style={cardStyle}>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Account
                </p>
                <div className="flex flex-col gap-2">
                  <div
                    className="rounded-xl p-2.5"
                    style={{ background: "oklch(var(--abl-bg))" }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "oklch(var(--abl-green-mid))" }}
                    >
                      Email
                    </p>
                    <p
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: "oklch(var(--abl-green))" }}
                    >
                      {role === "admin"
                        ? "admin@ablpulse.in"
                        : "hc@ablpulse.in"}
                    </p>
                  </div>
                </div>
              </div>

              {/* App info */}
              <div className="rounded-2xl p-4" style={cardStyle}>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  App Info
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    ["Version", "v1.0"],
                    ["WhatsApp", "+91 9199434365"],
                    ["Support", "support@ablpulse.com"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl p-2.5"
                      style={{ background: "oklch(var(--abl-bg))" }}
                    >
                      <p
                        className="text-xs"
                        style={{ color: "oklch(var(--abl-green-mid))" }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-sm font-semibold mt-0.5"
                        style={{ color: "oklch(var(--abl-green))" }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <button
                type="button"
                data-ocid="admin.settings.logout_button"
                onClick={onLogout}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                style={{
                  background: "rgba(220,38,38,0.08)",
                  color: "#DC2626",
                  border: "1.5px solid rgba(220,38,38,0.2)",
                }}
              >
                <X size={16} />
                Logout
              </button>
            </div>
          )}

          {/* ── Brand Assets Tab ── */}
          {!loading && !error && activeTab === "brand_assets" && (
            <div
              data-ocid="admin.brand_assets_section"
              className="p-4 flex flex-col gap-4"
            >
              <div>
                <p
                  className="text-base font-bold mb-1"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  Brand Assets
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Read-only preview of all brand files used in the app.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  {
                    file: "ABL-Pulse-Logo-1.png",
                    label: "App Logo",
                    usedIn: "Header, PDF Report",
                    path: "/assets/uploads/ABL-Pulse-Logo-1.png",
                  },
                  {
                    file: "App-sample-4.png",
                    label: "Hero Section Image",
                    usedIn: "Landing Page Hero",
                    path: "/assets/uploads/App-sample-4.png",
                  },
                  {
                    file: "Dr-Suman-Lal-2.png",
                    label: "Dr. Suman Lal Photo",
                    usedIn: "About Us Page",
                    path: "/assets/uploads/Dr-Suman-Lal-2.png",
                  },
                  {
                    file: "ABL-Pulse-Branding-3.png",
                    label: "Branding Kit",
                    usedIn: "Reference",
                    path: "/assets/uploads/ABL-Pulse-Branding-3.png",
                  },
                ].map((asset) => (
                  <div
                    key={asset.file}
                    data-ocid="admin.brand_assets.item"
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: "1.5px solid oklch(var(--abl-border))",
                      background: "oklch(var(--abl-bg))",
                    }}
                  >
                    <div
                      className="w-full flex items-center justify-center"
                      style={{
                        background: "oklch(var(--abl-card))",
                        minHeight: "80px",
                        maxHeight: "120px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={asset.path}
                        alt={asset.label}
                        style={{
                          maxHeight: "110px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          padding: "8px",
                        }}
                      />
                    </div>
                    <div className="px-3 py-2.5 flex flex-col gap-0.5">
                      <p
                        className="text-sm font-bold"
                        style={{ color: "oklch(var(--abl-green))" }}
                      >
                        {asset.label}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(var(--abl-green-mid))" }}
                      >
                        Used in: {asset.usedIn}
                      </p>
                      <p
                        className="text-xs font-mono mt-0.5"
                        style={{
                          color: "oklch(var(--abl-gold))",
                          wordBreak: "break-all",
                        }}
                      >
                        {asset.file}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <AdminDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {pendingDeleteId !== null && (
        <DeleteConfirmDialog
          onConfirm={confirmDelete}
          onCancel={() => {
            if (!isDeleting) setPendingDeleteId(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGIN MODAL
───────────────────────────────────────────── */
type LoginRole = "hs" | "admin" | "hc";

function LoginModal({
  onClose,
  onAdminLogin,
}: {
  onClose: () => void;
  onAdminLogin?: (role: "admin" | "hc") => void;
}) {
  const { actor } = useActor();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<LoginRole>("hs");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

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

  // Role config
  const ROLE_CONFIG = {
    hs: {
      label: "Health Seeker",
      badgeBg: "oklch(var(--abl-green) / 0.1)",
      badgeBorder: "oklch(var(--abl-green) / 0.25)",
      badgeColor: "oklch(var(--abl-green))",
    },
    admin: {
      label: "Admin",
      badgeBg: "rgba(220,38,38,0.08)",
      badgeBorder: "rgba(220,38,38,0.22)",
      badgeColor: "#DC2626",
    },
    hc: {
      label: "Health Coach",
      badgeBg: "oklch(var(--abl-gold) / 0.1)",
      badgeBorder: "oklch(var(--abl-gold) / 0.28)",
      badgeColor: "oklch(var(--abl-gold))",
    },
  } as const;

  const roleCfg = ROLE_CONFIG[selectedRole];

  const DUMMY_CREDS = {
    admin: { email: "admin@ablpulse.in", password: "ABLAdmin@2025" },
    hc: { email: "hc@ablpulse.in", password: "ABLHC@2025" },
  } as const;

  const handleLogin = async () => {
    setLoginError("");
    if (selectedRole === "admin") {
      if (
        email === DUMMY_CREDS.admin.email &&
        password === DUMMY_CREDS.admin.password
      ) {
        onClose();
        onAdminLogin?.("admin");
      } else {
        setLoginError(
          "Invalid admin credentials. Please check email & password.",
        );
      }
    } else if (selectedRole === "hc") {
      if (!actor) {
        setLoginError("Connecting to server, please try again.");
        return;
      }
      setIsLoggingIn(true);
      try {
        const fullActor = actor as unknown as BackendFullInterface;
        const result = await fullActor.loginHC(email, password);
        if ("ok" in result) {
          onClose();
          onAdminLogin?.("hc");
        } else {
          const errCode = result.err;
          if (errCode === "PENDING") {
            setLoginError("PENDING");
          } else if (errCode === "REJECTED") {
            setLoginError("REJECTED");
          } else {
            setLoginError(
              "Invalid credentials. Please check your email and password.",
            );
          }
        }
      } catch {
        setLoginError("Unable to connect. Please try again.");
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      // HS — close modal (placeholder)
      onClose();
    }
  };

  const inputBaseStyle = {
    border: "1.5px solid oklch(var(--abl-border))",
    color: "oklch(var(--abl-green))",
    background: "oklch(var(--abl-bg))",
  };

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
      {/* Click-outside to close */}
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
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          {/* Title + Role Badge */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2
                id="login-title"
                className="font-display font-bold text-xl mb-0.5"
                style={{ color: "oklch(var(--abl-green))" }}
              >
                Welcome Back
              </h2>
              <p
                className="text-xs"
                style={{ color: "oklch(var(--abl-border))" }}
              >
                Sign in to your ABL PULSE account
              </p>
            </div>
            {/* Role badge */}
            <span
              className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full mt-0.5"
              style={{
                background: roleCfg.badgeBg,
                border: `1px solid ${roleCfg.badgeBorder}`,
                color: roleCfg.badgeColor,
              }}
            >
              {roleCfg.label}
            </span>
          </div>

          {/* ── Role Selector Tabs ── */}
          <div
            className="flex gap-1.5 p-1 rounded-xl"
            style={{
              background: "oklch(var(--abl-bg))",
              border: "1px solid oklch(var(--abl-border) / 0.5)",
            }}
          >
            {(
              [
                { key: "hs", label: "HS", ocid: "login.role_hs_tab" },
                { key: "admin", label: "Admin", ocid: "login.role_admin_tab" },
                { key: "hc", label: "HC", ocid: "login.role_hc_tab" },
              ] as const
            ).map((r) => {
              const isActive = selectedRole === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  data-ocid={r.ocid}
                  onClick={() => {
                    setSelectedRole(r.key);
                    setEmail("");
                    setPassword("");
                    setLoginError("");
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: isActive
                      ? "oklch(var(--abl-green))"
                      : "transparent",
                    color: isActive ? "white" : "oklch(var(--abl-green))",
                    border: isActive
                      ? "none"
                      : "1px solid oklch(var(--abl-green) / 0.25)",
                  }}
                >
                  {r.label}
                </button>
              );
            })}
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
              data-ocid="login.input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={inputBaseStyle}
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
                data-ocid="login.textarea"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-11 rounded-xl text-sm outline-none transition-all"
                style={inputBaseStyle}
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

          {/* Error message / Status messages */}
          {loginError === "PENDING" && (
            <div
              className="text-xs rounded-lg px-3 py-2.5 flex flex-col gap-1"
              style={{
                color: "oklch(var(--abl-gold))",
                background: "oklch(var(--abl-gold) / 0.08)",
                border: "1px solid oklch(var(--abl-gold) / 0.3)",
              }}
              data-ocid="hc_login.pending_state"
            >
              <span className="font-bold">⏳ Awaiting Approval</span>
              <span>
                Your registration is under review. Please wait for Admin
                approval.
              </span>
            </div>
          )}
          {loginError === "REJECTED" && (
            <div
              className="text-xs rounded-lg px-3 py-2.5 flex flex-col gap-1"
              style={{
                color: "#DC2626",
                background: "rgba(220,38,38,0.07)",
                border: "1px solid rgba(220,38,38,0.2)",
              }}
              data-ocid="hc_login.rejected_state"
            >
              <span className="font-bold">❌ Application Not Approved</span>
              <span>
                Your application was not approved. Please contact
                support@ablpulse.com
              </span>
            </div>
          )}
          {loginError &&
            loginError !== "PENDING" &&
            loginError !== "REJECTED" && (
              <p
                className="text-xs rounded-lg px-3 py-2"
                style={{
                  color: "#DC2626",
                  background: "rgba(220,38,38,0.07)",
                  border: "1px solid rgba(220,38,38,0.2)",
                }}
                data-ocid="login.error_state"
              >
                {loginError}
              </p>
            )}

          {/* Submit */}
          <button
            type="button"
            data-ocid="login.submit_button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="btn-green w-full py-3 rounded-xl text-sm font-bold tracking-wide uppercase shadow-wellness flex items-center justify-center gap-2"
            style={isLoggingIn ? { opacity: 0.7 } : {}}
          >
            {isLoggingIn && <Loader2 size={16} className="animate-spin" />}
            {isLoggingIn ? "Logging in..." : "Login to ABL PULSE"}
          </button>

          {/* Dummy Credentials Info Box — Admin */}
          {selectedRole === "admin" && (
            <div
              data-ocid="login.credentials_info"
              className="rounded-xl p-3 flex flex-col gap-2"
              style={{
                background: "oklch(var(--abl-gold) / 0.07)",
                border: "1px solid oklch(var(--abl-gold) / 0.28)",
              }}
            >
              <p
                className="text-xs font-bold flex items-center gap-1.5"
                style={{ color: "oklch(var(--abl-gold))" }}
              >
                🔑 Admin Demo Credentials
              </p>
              <div className="flex flex-col gap-0.5">
                <p
                  className="text-[11px]"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  <span className="font-semibold">Email:</span>{" "}
                  {DUMMY_CREDS.admin.email}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  <span className="font-semibold">Password:</span>{" "}
                  {DUMMY_CREDS.admin.password}
                </p>
              </div>
              <button
                type="button"
                data-ocid="login.use_credentials_button"
                onClick={() => {
                  setEmail(DUMMY_CREDS.admin.email);
                  setPassword(DUMMY_CREDS.admin.password);
                  setLoginError("");
                }}
                className="text-xs font-bold py-1.5 rounded-lg transition-all"
                style={{
                  background: "oklch(var(--abl-gold))",
                  color: "white",
                  border: "none",
                }}
              >
                Use These Credentials
              </button>
            </div>
          )}

          {/* Register as HC link */}
          {selectedRole === "hc" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-px"
                  style={{ background: "oklch(var(--abl-border) / 0.4)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "oklch(var(--abl-border))" }}
                >
                  New here?
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "oklch(var(--abl-border) / 0.4)" }}
                />
              </div>
              <button
                type="button"
                data-ocid="hc_register.open_modal_button"
                onClick={() => setShowRegisterForm(true)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "oklch(var(--abl-gold) / 0.1)",
                  color: "oklch(var(--abl-gold))",
                  border: "1.5px solid oklch(var(--abl-gold) / 0.35)",
                }}
              >
                Register as Health Coach
              </button>
            </div>
          )}

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
              support@ablpulse.com
            </button>
          </p>
        </div>
      </dialog>

      {/* HC Registration Form Modal */}
      {showRegisterForm && (
        <HCRegistrationForm
          onClose={() => setShowRegisterForm(false)}
          onBackToLogin={() => setShowRegisterForm(false)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HC REGISTRATION FORM
───────────────────────────────────────────── */
const HC_EXPERIENCE_OPTIONS = [
  "0 - 6 Months",
  "6 - 12 Months",
  "1 - 2 Years",
  "2 - 3 Years",
  "3 - 4 Years",
  "4 - 5 Years",
  "5+ Years",
];

function HCRegistrationForm({
  onClose,
  onBackToLogin,
}: {
  onClose: () => void;
  onBackToLogin: () => void;
}) {
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    experience: "",
    expertise: "",
    currentWorking: "",
    socialMedia: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputStyle: CSSProperties = {
    border: "1.5px solid oklch(var(--abl-border))",
    color: "oklch(var(--abl-green))",
    background: "oklch(var(--abl-bg))",
    width: "100%",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle: CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "oklch(var(--abl-green))",
    marginBottom: "4px",
    display: "block",
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = "oklch(var(--abl-green))";
    e.currentTarget.style.boxShadow =
      "0 0 0 3px oklch(var(--abl-green) / 0.12)";
  };
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = "oklch(var(--abl-border))";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async () => {
    setError("");
    if (
      !form.name ||
      !form.mobile ||
      !form.email ||
      !form.password ||
      !form.experience ||
      !form.expertise ||
      !form.currentWorking
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!actor) {
      setError("Connecting to server, please try again.");
      return;
    }
    setSubmitting(true);
    try {
      const fullActor = actor as unknown as BackendFullInterface;
      const result = await fullActor.registerHC(
        form.name,
        form.mobile,
        form.email,
        form.password,
        form.experience,
        form.expertise,
        form.currentWorking,
        form.socialMedia,
      );
      if ("ok" in result) {
        setSuccess(true);
      } else {
        if (result.err === "Email already registered.") {
          setError(
            "This email is already registered. Please use a different email or login.",
          );
        } else {
          setError(result.err || "Registration failed. Please try again.");
        }
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
      style={{
        background: "oklch(var(--abl-dark) / 0.8)",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Click-outside */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={onClose}
        aria-label="Close"
        tabIndex={-1}
      />
      <dialog
        open
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-glow m-0 p-0 border-0"
        style={{ background: "white", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ background: "oklch(var(--abl-green))" }}
        >
          <div>
            <p className="text-base font-bold text-white">
              Register as Health Coach
            </p>
            <p className="text-xs text-white/70">
              Submit your details for admin review
            </p>
          </div>
          <button
            type="button"
            data-ocid="hc_register.cancel_button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-3.5">
          {success ? (
            /* Success Screen */
            <div
              data-ocid="hc_register.success_state"
              className="flex flex-col items-center gap-4 py-4 text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "oklch(var(--abl-green) / 0.1)" }}
              >
                <CheckCircle2
                  size={32}
                  style={{ color: "oklch(var(--abl-green))" }}
                />
              </div>
              <div>
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  Registration Submitted!
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Your registration has been submitted successfully. Our Admin
                  will review and approve your account. Please check back in
                  24–48 hours.
                </p>
              </div>
              <button
                type="button"
                data-ocid="hc_register.back_button"
                onClick={onBackToLogin}
                className="btn-green px-6 py-2.5 rounded-xl text-sm font-bold"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Full Name */}
              <div>
                <label htmlFor="hc-reg-name" style={labelStyle}>
                  Full Name <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  id="hc-reg-name"
                  data-ocid="hc_register.name_input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Dr. Rahul Sharma"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="hc-reg-mobile" style={labelStyle}>
                  Mobile Number <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="tel"
                  id="hc-reg-mobile"
                  data-ocid="hc_register.mobile_input"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, mobile: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="hc-reg-email" style={labelStyle}>
                  Email ID <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="email"
                  id="hc-reg-email"
                  data-ocid="hc_register.email_input"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="hc-reg-password" style={labelStyle}>
                  Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="hc-reg-password"
                    data-ocid="hc_register.password_input"
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    placeholder="Min. 8 characters"
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: "oklch(var(--abl-border))" }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Experience Dropdown */}
              <div>
                <label htmlFor="hc-reg-experience" style={labelStyle}>
                  Experience <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <select
                  id="hc-reg-experience"
                  data-ocid="hc_register.experience_select"
                  value={form.experience}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, experience: e.target.value }))
                  }
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    cursor: "pointer",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Select experience</option>
                  {HC_EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Expertise */}
              <div>
                <label htmlFor="hc-reg-expertise" style={labelStyle}>
                  Field Expertise <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  id="hc-reg-expertise"
                  data-ocid="hc_register.expertise_input"
                  value={form.expertise}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, expertise: e.target.value }))
                  }
                  placeholder="e.g. Yoga, Naturopathy, Ayurveda"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Current Working */}
              <div>
                <label htmlFor="hc-reg-working" style={labelStyle}>
                  Current Working (Organization/Clinic){" "}
                  <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  id="hc-reg-working"
                  data-ocid="hc_register.working_input"
                  value={form.currentWorking}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, currentWorking: e.target.value }))
                  }
                  placeholder="e.g. ABL Wellness Centre"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Social Media (Optional) */}
              <div>
                <label htmlFor="hc-reg-social" style={labelStyle}>
                  Social Media Page{" "}
                  <span
                    style={{
                      color: "oklch(var(--abl-border))",
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (Optional)
                  </span>
                </label>
                <input
                  type="url"
                  id="hc-reg-social"
                  data-ocid="hc_register.social_input"
                  value={form.socialMedia}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, socialMedia: e.target.value }))
                  }
                  placeholder="https://instagram.com/yourhandle"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  className="text-xs rounded-lg px-3 py-2"
                  style={{
                    color: "#DC2626",
                    background: "rgba(220,38,38,0.07)",
                    border: "1px solid rgba(220,38,38,0.2)",
                  }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="button"
                data-ocid="hc_register.submit_button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-green w-full py-3 rounded-xl text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-2 mt-1"
                style={submitting ? { opacity: 0.7 } : {}}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>

              <p
                className="text-center text-xs"
                style={{ color: "oklch(var(--abl-border))" }}
              >
                Already registered?{" "}
                <button
                  type="button"
                  className="font-semibold hover:underline"
                  style={{ color: "oklch(var(--abl-green))" }}
                  onClick={onBackToLogin}
                >
                  Back to Login
                </button>
              </p>
            </>
          )}
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
  QUESTION_OPTIONS,
  type QuestionSuggestions,
  SECTION1_SUGGESTIONS,
  SECTION2_SUGGESTIONS,
  SECTION3_SUGGESTIONS,
  SECTION4_SUGGESTIONS,
  SECTIONS,
  getSection1NeedsAttention,
  getSection2NeedsAttention,
  getSection3NeedsAttention,
  getSection4NeedsAttention,
} from "./logic/index";
import { type ScoreResult, calculateScore } from "./logic/scoring";

/* ─────────────────────────────────────────────
   QUESTIONNAIRE STEP
───────────────────────────────────────────── */
const ANSWERS_DRAFT_KEY = "ablpulse_answers_draft";

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
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    // Restore saved answers from localStorage on mount
    try {
      const raw = localStorage.getItem(ANSWERS_DRAFT_KEY);
      if (raw) return JSON.parse(raw) as Record<string, number>;
    } catch {
      /* ignore */
    }
    return {};
  });
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

  // Auto-save answers to localStorage on every change
  useEffect(() => {
    try {
      if (Object.keys(answers).length > 0) {
        localStorage.setItem(ANSWERS_DRAFT_KEY, JSON.stringify(answers));
      }
    } catch {
      /* ignore */
    }
  }, [answers]);

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
        data-ocid="assessment.page"
        className="fixed inset-0 z-[900] flex flex-col overflow-hidden"
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
        <div
          ref={containerRef}
          className="relative z-10 flex-1 overflow-y-auto pb-[220px] md:pb-32"
        >
          <div className="max-w-2xl mx-auto px-4 pt-4">
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

                    {/* Options — 5 pills in a grid row */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {options.map((opt, oi) => {
                        const isSelected = selectedOption === oi;
                        return (
                          <button
                            key={opt}
                            type="button"
                            data-ocid={`questionnaire.option.${currentSection}-${qi}-${oi}`}
                            onClick={() => setAnswer(currentSection, qi, oi)}
                            className="py-2 px-1 rounded-xl text-[10px] sm:text-xs font-semibold transition-all text-center leading-tight"
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
          className="sticky bottom-0 z-[950] flex-shrink-0"
          style={{
            background:
              "linear-gradient(to top, white 80%, rgba(255,255,255,0) 100%)",
            paddingTop: "1rem",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 pb-[72px] md:pb-3">
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
   GAUGE METER — Semicircular SVG gauge
───────────────────────────────────────────── */
function GaugeMeter({
  value,
  max,
  size = 200,
}: {
  value: number;
  max: number;
  size?: number;
}) {
  // Semicircle: center at (cx, cy), radius r
  // Arc goes from left (-180deg) to right (0deg) in standard SVG coords
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.09;
  const halfStroke = strokeWidth / 2;

  // The arc spans 180 degrees (π radians), flat at bottom

  // Zone thresholds as fraction of arc
  // needs_attention: 0–65 (40.625%), building_zone: 66–116 (72.5%), strong_area: 117–160
  // Zone thresholds: dynamic based on max (40 for section, 160 for total)
  const z1 = max === 40 ? 20 / 40 : 65 / 160;
  const z2 = max === 40 ? 30 / 40 : 116 / 160;

  // Convert polar angle (0=left, 180=right on bottom semicircle) to SVG path
  // Angle 0 = leftmost point, Angle 180 = rightmost point
  // In SVG: left = (cx - r, cy), right = (cx + r, cy), top = (cx, cy - r)
  function polarToSVG(angleDeg: number): { x: number; y: number } {
    // 0deg = left side, 180deg = right side, 90deg = top
    const rad = ((angleDeg - 180) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Arc path from startAngle to endAngle (0=left, 180=right)
  function arcPath(startDeg: number, endDeg: number): string {
    const start = polarToSVG(startDeg);
    const end = polarToSVG(endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  // Needle angle: 0 (left) to 180 (right) based on value/max
  const fraction = Math.min(Math.max(value / max, 0), 1);
  const needleAngle = fraction * 180; // degrees: 0=left, 180=right

  // Needle tip (rotated from center)
  const needleRad = ((needleAngle - 180) * Math.PI) / 180;
  const needleLen = r * 0.85;
  const needleTipX = cx + needleLen * Math.cos(needleRad);
  const needleTipY = cy + needleLen * Math.sin(needleRad);

  // Zone colors
  const red = "#DC2626";
  const amber = "#D97706";
  const green = "#004225";

  // Determine current zone color for score text
  let scoreColor = red;
  if (fraction >= z2) scoreColor = green;
  else if (fraction >= z1) scoreColor = amber;

  // Extend viewBox height to show score text below needle pivot
  const viewH = cy + halfStroke + size * 0.38;

  // End-cap label font size
  const capFontSize = size * 0.07;

  return (
    <svg
      width={size}
      height={viewH}
      viewBox={`0 0 ${size} ${viewH}`}
      aria-hidden="true"
      style={{ display: "block", margin: "0 auto", overflow: "visible" }}
    >
      {/* Background track */}
      <path
        d={arcPath(0, 180)}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
      />

      {/* Zone 1: Red (0–33.125% of 180deg = 0–59.6deg) */}
      <path
        d={arcPath(0, z1 * 180)}
        fill="none"
        stroke={red}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        opacity={0.9}
      />

      {/* Zone 2: Amber (33.125%–66.25% = 59.6–119.25deg) */}
      <path
        d={arcPath(z1 * 180, z2 * 180)}
        fill="none"
        stroke={amber}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        opacity={0.9}
      />

      {/* Zone 3: Green (66.25%–100% = 119.25–180deg) */}
      <path
        d={arcPath(z2 * 180, 180)}
        fill="none"
        stroke={green}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        opacity={0.9}
      />

      {/* End-cap label: "0" at left arc end */}
      <text
        x={cx - r - halfStroke - 3}
        y={cy + capFontSize * 0.9}
        textAnchor="end"
        fontSize={capFontSize}
        fontWeight="700"
        fill={red}
        fontFamily="system-ui, sans-serif"
      >
        0
      </text>

      {/* End-cap label: max value at right arc end */}
      <text
        x={cx + r + halfStroke + 3}
        y={cy + capFontSize * 0.9}
        textAnchor="start"
        fontSize={capFontSize}
        fontWeight="700"
        fill={green}
        fontFamily="system-ui, sans-serif"
      >
        {max}
      </text>

      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleTipX}
        y2={needleTipY}
        stroke="#1f2937"
        strokeWidth={size * 0.018}
        strokeLinecap="round"
      />

      {/* Needle pivot circle */}
      <circle cx={cx} cy={cy} r={size * 0.045} fill="#1f2937" />
      <circle cx={cx} cy={cy} r={size * 0.025} fill="white" />

      {/* Score text well below needle pivot — no overlap */}
      <text
        x={cx}
        y={cy + size * 0.2}
        textAnchor="middle"
        fontSize={size * 0.145}
        fontWeight="800"
        fill={scoreColor}
        fontFamily="'Fraunces', Georgia, serif"
      >
        {value}
      </text>
      <text
        x={cx}
        y={cy + size * 0.32}
        textAnchor="middle"
        fontSize={size * 0.07}
        fontWeight="600"
        fill="#6b7280"
        fontFamily="system-ui, sans-serif"
      >
        /{max}
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ZONE HELPERS
───────────────────────────────────────────── */
type ZoneKey = "needs_attention" | "building_zone" | "strong_area";

function getSectionZone(score: number): ZoneKey {
  if (score <= 20) return "needs_attention";
  if (score <= 30) return "building_zone";
  return "strong_area";
}

const ZONE_CONFIG: Record<
  ZoneKey,
  {
    color: string;
    bg: string;
    border: string;
    emoji: string;
    labelEN: string;
    labelHI: string;
  }
> = {
  needs_attention: {
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.25)",
    emoji: "🔴",
    labelEN: "Needs Attention",
    labelHI: "ध्यान दें",
  },
  building_zone: {
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.28)",
    emoji: "🟡",
    labelEN: "Building Zone",
    labelHI: "निर्माण क्षेत्र",
  },
  strong_area: {
    color: "#004225",
    bg: "rgba(0,66,37,0.08)",
    border: "rgba(0,66,37,0.22)",
    emoji: "🟢",
    labelEN: "Strong Area",
    labelHI: "मजबूत क्षेत्र",
  },
};

/* ─────────────────────────────────────────────
   COMPACT SECTION CARD (R2)
───────────────────────────────────────────── */
const SECTION_META = [
  {
    numEN: "Section 1",
    numHI: "भाग 1",
    nameEN: "Sleep & Hydration",
    nameHI: "नींद और हाइड्रेशन",
  },
  {
    numEN: "Section 2",
    numHI: "भाग 2",
    nameEN: "Gut Cleanse & Metabolic",
    nameHI: "गट क्लींज और मेटाबोलिक",
  },
  {
    numEN: "Section 3",
    numHI: "भाग 3",
    nameEN: "Movement & Circulation",
    nameHI: "मूवमेंट और सर्कुलेशन",
  },
  {
    numEN: "Section 4",
    numHI: "भाग 4",
    nameEN: "Mind & Emotional Balance",
    nameHI: "माइंड और भावनात्मक संतुलन",
  },
] as const;

const SECTION_OCIDS = [
  "result.section1_card",
  "result.section2_card",
  "result.section3_card",
  "result.section4_card",
] as const;

function CompactSectionCard({
  sectionIndex,
  sectionScore,
  lang,
  suggestionsData,
}: {
  sectionIndex: 0 | 1 | 2 | 3;
  sectionScore: number;
  lang: Lang;
  suggestionsData: QuestionSuggestions[];
}) {
  const zone = getSectionZone(sectionScore);

  // Red Alert only when zone itself is needs_attention (score 0-13)
  const hasAlert = zone === "needs_attention";
  const zoneCfg = ZONE_CONFIG[zone];
  const meta = SECTION_META[sectionIndex];
  const ocid = SECTION_OCIDS[sectionIndex];

  // Representative suggestion: first question's suggestion for the current zone
  const repSuggestion =
    suggestionsData.length > 0
      ? lang === "en"
        ? suggestionsData[0][zone].en
        : suggestionsData[0][zone].hi
      : "";

  return (
    <div
      data-ocid={ocid}
      className="rounded-2xl overflow-hidden relative flex flex-col"
      style={{
        background: "white",
        border: `1.5px solid ${zoneCfg.border}`,
        boxShadow: "0 2px 12px rgba(0,66,37,0.06)",
      }}
    >
      {/* Alert badge */}
      {hasAlert && (
        <span
          className="absolute top-2.5 right-3 text-sm leading-none"
          aria-label="Needs Attention"
          title="Some habits need attention"
        >
          🔴
        </span>
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
          style={{ color: "oklch(var(--abl-green-mid))" }}
        >
          {lang === "en" ? meta.numEN : meta.numHI}
        </p>
        <h3
          className="font-display font-bold text-sm leading-tight pr-6"
          style={{ color: "oklch(var(--abl-green))" }}
        >
          {lang === "en" ? meta.nameEN : meta.nameHI}
        </h3>
      </div>

      {/* Mini Gauge */}
      <div className="flex flex-col items-center py-2">
        <GaugeMeter value={sectionScore} max={40} size={130} />
        <p
          className="text-xs font-bold -mt-1"
          style={{ color: "oklch(var(--abl-gold))" }}
        >
          {lang === "en"
            ? `Score: ${sectionScore}/40`
            : `स्कोर: ${sectionScore}/40`}
        </p>
      </div>

      {/* Zone suggestion box */}
      <div
        className="mx-4 mb-4 rounded-xl px-3 py-2.5 flex flex-col gap-1"
        style={{
          background: zoneCfg.bg,
          border: `1px solid ${zoneCfg.border}`,
        }}
      >
        <p
          className="text-xs font-bold flex items-center gap-1"
          style={{ color: zoneCfg.color }}
        >
          <span aria-hidden="true">{zoneCfg.emoji}</span>
          {lang === "en" ? zoneCfg.labelEN : zoneCfg.labelHI}
        </p>
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: "oklch(var(--abl-green))" }}
        >
          {repSuggestion}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULT SCREEN (R1 + R2 + R3 + R4 + R5 + R6 + R7)
───────────────────────────────────────────── */
function ResultScreen({
  result,
  answers,
  lang,
  onLangToggle,
  onBack,
  userName,
  userAge,
  userGender,
}: {
  result: ScoreResult;
  answers: Record<string, number>;
  lang: Lang;
  onLangToggle: () => void;
  onBack: () => void;
  userName?: string;
  userAge?: string;
  userGender?: string;
}) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const totalZone = result.category as ZoneKey;
  const totalZoneCfg = ZONE_CONFIG[totalZone];

  // Section scores
  const sectionScores: [number, number, number, number] = [
    result.pillarScores.sleep,
    result.pillarScores.gut,
    result.pillarScores.movement,
    result.pillarScores.mind,
  ];

  const sectionSuggestions = [
    SECTION1_SUGGESTIONS,
    SECTION2_SUGGESTIONS,
    SECTION3_SUGGESTIONS,
    SECTION4_SUGGESTIONS,
  ] as const;

  /* ── R3 + R4: PDF Generation via jsPDF (direct download) ── */
  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    // Helper: load image URL → base64 data URL with timeout
    const loadImageAsDataURL = async (url: string): Promise<string> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) return "";
        const blob = await response.blob();
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(blob);
        });
      } catch {
        return "";
      }
    };

    // Load images in parallel (non-blocking — failures handled gracefully)
    const [logoDataURL, drSumanDataURL] = await Promise.all([
      loadImageAsDataURL("/assets/uploads/ABL-Pulse-Logo-1.png"),
      loadImageAsDataURL("/assets/uploads/Dr-Suman-Lal-2.png"),
    ]);

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const s1Items = getSection1NeedsAttention(answers);
    const s2Items = getSection2NeedsAttention(answers);
    const s3Items = getSection3NeedsAttention(answers);
    const s4Items = getSection4NeedsAttention(answers);

    const sectionNames = [
      "Sleep & Hydration",
      "Gut Cleanse & Metabolic",
      "Movement & Circulation",
      "Mind & Emotional Balance",
    ];

    const sectionScoreArr = [
      result.pillarScores.sleep,
      result.pillarScores.gut,
      result.pillarScores.movement,
      result.pillarScores.mind,
    ];

    const sectionNeedsAttention = [s1Items, s2Items, s3Items, s4Items];
    const allSuggestionsData = [
      SECTION1_SUGGESTIONS,
      SECTION2_SUGGESTIONS,
      SECTION3_SUGGESTIONS,
      SECTION4_SUGGESTIONS,
    ] as const;

    const getSectionZoneLabelColor = (score: number) => {
      if (score <= 20) return { label: "Needs Attention", color: "#DC2626" };
      if (score <= 30) return { label: "Building Zone", color: "#D97706" };
      return { label: "Strong Area", color: "#004225" };
    };

    // Helper: get all zones suggestions for a section
    const getSectionAllZoneSuggestions = (secIdx: number) => {
      const suggestions = allSuggestionsData[
        secIdx
      ] as typeof SECTION1_SUGGESTIONS;
      const buildingZoneItems: { label: string; text: string }[] = [];
      const strongAreaItems: { label: string; text: string }[] = [];
      for (let qi = 0; qi < 10; qi++) {
        const score = answers[`s${secIdx}-q${qi}`] ?? 0;
        const sugg = suggestions[qi];
        if (score === 2) {
          buildingZoneItems.push({
            label: sugg.label,
            text: sugg.building_zone.en,
          });
        } else if (score >= 3) {
          strongAreaItems.push({
            label: sugg.label,
            text: sugg.strong_area.en,
          });
        }
      }
      return { buildingZoneItems, strongAreaItems };
    };

    // ── Build jsPDF document ──
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = 210;
      const pageH = 297;
      const ml = 18; // margin left
      const mr = 18; // margin right
      const mt = 15; // margin top
      const mb = 18; // margin bottom
      const contentW = pageW - ml - mr;
      let y = mt;

      const green = "#004225";
      const gold = "#9E6B3D";
      const gray = "#6b7280";
      const red = "#DC2626";
      const amber = "#D97706";

      // Helper: add page header
      const addHeader = () => {
        y = mt;
        // Logo
        if (logoDataURL) {
          try {
            doc.addImage(logoDataURL, "PNG", ml, y, 14, 14);
          } catch {
            /* skip */
          }
        }
        // Title block
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(green);
        doc.text("ABL PULSE", ml + 17, y + 5);
        doc.setFontSize(9);
        doc.setTextColor(gold);
        doc.setFont("helvetica", "bold");
        doc.text("Ayurved Banaye Life", ml + 17, y + 10);
        doc.setFontSize(7.5);
        doc.setTextColor(gray);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Old Museum South Wall, Dak-bangla Churaha, Near Kotwali Thana, Patna 1",
          ml + 17,
          y + 14,
        );
        doc.setFontSize(8);
        doc.setTextColor(green);
        doc.setFont("helvetica", "bold");
        doc.text("WhatsApp / Call: +91 9199434365", ml + 17, y + 18);
        // Divider line
        y += 22;
        doc.setDrawColor(green);
        doc.setLineWidth(0.7);
        doc.line(ml, y, ml + contentW, y);
        y += 6;
      };

      // Helper: section label
      const sectionLabel = (label: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(green);
        doc.text(label.toUpperCase(), ml, y);
        y += 1.5;
        doc.setDrawColor("#e5e7eb");
        doc.setLineWidth(0.3);
        doc.line(ml, y, ml + contentW, y);
        y += 5;
      };

      // Helper: add new page
      const newPage = () => {
        doc.addPage();
        addHeader();
      };

      // Helper: check page overflow
      const checkPage = (needed: number) => {
        if (y + needed > pageH - mb) {
          newPage();
        }
      };

      // ── PAGE 1 ──
      addHeader();

      // Health Seeker Details
      sectionLabel("Health Seeker Details");
      const fields = [
        ["Name", userName || "—"],
        ["Age", userAge || "—"],
        ["Gender", userGender || "—"],
        ["Date", dateStr],
      ];
      const fieldW = contentW / 4;
      fields.forEach(([label, value], i) => {
        const fx = ml + i * fieldW;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(gold);
        doc.text(label.toUpperCase(), fx, y);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(green);
        doc.text(value, fx, y + 4.5);
      });
      y += 12;

      // Overall Score
      checkPage(28);
      sectionLabel("Overall Health Readiness Score");
      // Score box background
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(green);
      doc.setLineWidth(0.5);
      doc.roundedRect(ml, y, contentW, 22, 3, 3, "FD");
      // Score number
      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.setTextColor(green);
      doc.text(String(result.totalScore), ml + 8, y + 15);
      doc.setFontSize(12);
      doc.setTextColor(gray);
      doc.setFont("helvetica", "normal");
      doc.text(
        "/160",
        ml + 8 + doc.getTextWidth(String(result.totalScore)) + 1,
        y + 15,
      );
      // Zone pill
      const zc =
        result.category === "needs_attention"
          ? red
          : result.category === "building_zone"
            ? amber
            : green;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(zc);
      doc.setLineWidth(0.5);
      doc.roundedRect(ml + contentW - 48, y + 6, 44, 10, 2, 2, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(zc);
      const zoneText =
        result.category === "needs_attention"
          ? "Needs Attention"
          : result.category === "building_zone"
            ? "Building Zone"
            : "Strong Area";
      doc.text(zoneText, ml + contentW - 26, y + 12.5, { align: "center" });
      y += 28;

      // Section Summary Table
      checkPage(35);
      sectionLabel("Section-wise Summary");
      const colW = [contentW * 0.5, contentW * 0.25, contentW * 0.25];
      // Table header
      doc.setFillColor(249, 250, 251);
      doc.rect(ml, y, contentW, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(gray);
      doc.text("Section", ml + 2, y + 4.8);
      doc.text("Score", ml + colW[0] + colW[1] / 2, y + 4.8, {
        align: "center",
      });
      doc.text("Zone", ml + colW[0] + colW[1] + colW[2] / 2, y + 4.8, {
        align: "center",
      });
      y += 7;
      // PDF always uses English section names (font limitation)
      const secNamesForTable = sectionNames;
      for (const i of [0, 1, 2, 3]) {
        const sc = sectionScoreArr[i];
        const { label: zl, color: zcol } = getSectionZoneLabelColor(sc);
        doc.setDrawColor("#e5e7eb");
        doc.setLineWidth(0.2);
        doc.rect(ml, y, contentW, 7);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor("#1f2937");
        doc.text(secNamesForTable[i], ml + 2, y + 4.8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(green);
        doc.text(`${sc}/40`, ml + colW[0] + colW[1] / 2, y + 4.8, {
          align: "center",
        });
        doc.setTextColor(zcol);
        doc.text(zl, ml + colW[0] + colW[1] + colW[2] / 2, y + 4.8, {
          align: "center",
        });
        y += 7;
      }
      y += 6;

      // What You Are Doing Well
      checkPage(20);
      sectionLabel("What You Are Doing Well");

      let hasDoingWell = false;
      for (let secIdx = 0; secIdx < 4; secIdx++) {
        const { buildingZoneItems, strongAreaItems } =
          getSectionAllZoneSuggestions(secIdx);
        if (buildingZoneItems.length === 0 && strongAreaItems.length === 0)
          continue;
        hasDoingWell = true;
        // PDF always uses English (Helvetica can't render Devanagari)
        const secName = sectionNames[secIdx];

        checkPage(18);
        // Card background
        doc.setFillColor(250, 255, 254);
        doc.setDrawColor("#e5e7eb");
        doc.setLineWidth(0.3);
        const startY = y;
        // Section name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(green);
        doc.text(secName, ml + 3, y + 5);
        y += 8;

        if (buildingZoneItems.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(amber);
          doc.text("Building Zone", ml + 3, y + 3.5);
          y += 6;
          for (const item of buildingZoneItems) {
            checkPage(8);
            const lines = doc.splitTextToSize(`• ${item.text}`, contentW - 6);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor("#374151");
            doc.text(lines, ml + 3, y);
            y += lines.length * 4 + 1;
          }
        }
        if (strongAreaItems.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(green);
          doc.text("Strong Area", ml + 3, y + 3.5);
          y += 6;
          for (const item of strongAreaItems) {
            checkPage(8);
            const lines = doc.splitTextToSize(`• ${item.text}`, contentW - 6);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor("#374151");
            doc.text(lines, ml + 3, y);
            y += lines.length * 4 + 1;
          }
        }

        // Draw card border around the section block
        doc.setFillColor(250, 255, 254);
        doc.setDrawColor("#e5e7eb");
        doc.setLineWidth(0.3);
        doc.roundedRect(ml, startY, contentW, y - startY + 2, 2, 2);
        y += 5;
      }
      if (!hasDoingWell) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(gray);
        doc.text(
          "Keep building consistent habits to see your strong areas grow!",
          ml,
          y,
        );
        y += 8;
      }

      // ── PAGE 2 ──
      newPage();

      // Areas to Focus On
      sectionLabel("Areas to Focus On");

      for (let i = 0; i < 4; i++) {
        const secScore = sectionScoreArr[i];
        const { label: secZoneLabel, color: secZoneColor } =
          getSectionZoneLabelColor(secScore);
        const naItems = sectionNeedsAttention[i];
        // PDF always English (Helvetica limitation)
        const secName = sectionNames[i];

        const blockH = Math.max(20, 16 + naItems.length * 12) + 10;
        checkPage(blockH);

        const cardStartY = y;
        // Section header row
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(green);
        doc.text(secName, ml + 3, y + 5);
        doc.setFontSize(8);
        doc.setTextColor(gray);
        doc.text(`Score: ${secScore}/40`, ml + 3, y + 9.5);
        // Zone pill
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(secZoneColor);
        doc.text(secZoneLabel, ml + contentW - 3, y + 5, { align: "right" });
        y += 13;

        if (naItems.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(red);
          doc.text("Needs Attention:", ml + 3, y);
          y += 5;
          for (const item of naItems) {
            checkPage(8);
            // PDF always uses English text (Devanagari not supported in helvetica)
            const text = item.suggestion.en;
            const lines = doc.splitTextToSize(`• ${text}`, contentW - 6);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor("#374151");
            doc.text(lines, ml + 3, y);
            y += lines.length * 4 + 1;
          }
        } else {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(gray);
          doc.text("All habits on track – no attention needed.", ml + 3, y);
          y += 6;
        }

        // Card border
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor("#e5e7eb");
        doc.setLineWidth(0.3);
        doc.roundedRect(ml, cardStartY, contentW, y - cardStartY + 2, 2, 2);
        y += 5;
      }

      // Expert CTA
      checkPage(28);
      doc.setFillColor(0, 66, 37);
      doc.roundedRect(ml, y, contentW, 26, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor("#ffffff");
      doc.text("1-on-1 Expert Consultation with Dr. Suman Lal", ml + 5, y + 7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(220, 220, 220);
      const ctaLines = doc.splitTextToSize(
        "Apne Readiness Gap ko samajhne ke liye Dr. Suman Lal se 1-on-1 consultation book karein. Aapki assessment report ke basis par personalized guidance milegi.",
        contentW - 10,
      );
      doc.text(ctaLines, ml + 5, y + 13);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor("#fcd34d");
      doc.text("WhatsApp / Call: +91 9199434365", ml + 5, y + 23);
      y += 32;

      // Footer
      const footerY = pageH - mb - 14;
      doc.setDrawColor(green);
      doc.setLineWidth(0.6);
      doc.line(ml, footerY, ml + contentW, footerY);

      // Dr. Suman photo
      if (drSumanDataURL) {
        try {
          doc.addImage(drSumanDataURL, "PNG", ml, footerY + 3, 12, 12);
        } catch {
          /* skip */
        }
      }
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(10);
      doc.setTextColor(green);
      doc.text("Dr. Suman Lal", ml + 15, footerY + 7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(gray);
      doc.text(
        "Naturopathy Practitioner | Doctorate in Psychology",
        ml + 15,
        footerY + 11,
      );
      doc.setFontSize(7);
      doc.setTextColor("#9b9b9b");
      doc.text("Authorized Signature", ml + 15, footerY + 14.5);

      // Right side
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(green);
      doc.text("ABL PULSE", ml + contentW, footerY + 7, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(gold);
      doc.text("Ayurved Banaye Life", ml + contentW, footerY + 11, {
        align: "right",
      });
      doc.setFontSize(7);
      doc.setTextColor("#9b9b9b");
      doc.text(`Generated: ${dateStr}`, ml + contentW, footerY + 14.5, {
        align: "right",
      });

      // Save directly
      doc.save("ABL-PULSE-Report.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div
      data-ocid="result.page"
      className="fixed inset-0 z-[900] flex flex-col overflow-hidden"
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

      {/* ── Sticky top bar ── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0 gap-2"
        style={{
          background: "white",
          borderBottom: "1px solid oklch(var(--abl-border))",
        }}
      >
        {/* Back button */}
        <button
          type="button"
          data-ocid="result.back_button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0"
          style={{
            color: "oklch(var(--abl-green))",
            background: "oklch(var(--abl-green) / 0.08)",
            border: "1px solid oklch(var(--abl-green) / 0.2)",
          }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">
            {lang === "en" ? "Home" : "होम"}
          </span>
        </button>

        {/* Language toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            data-ocid="result.lang_en_toggle"
            onClick={() => lang !== "en" && onLangToggle()}
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
            data-ocid="result.lang_hi_toggle"
            onClick={() => lang !== "hi" && onLangToggle()}
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

        {/* Logo */}
        <LogoImage
          imgClassName="h-8 w-8"
          textClassName="text-sm hidden sm:block"
          textStyle={{ color: "oklch(var(--abl-green))" }}
        />
      </div>

      {/* ── Main scrollable content ── */}
      <div className="relative z-10 flex-1 overflow-y-auto py-5 px-4 pb-24">
        <div className="max-w-lg mx-auto flex flex-col gap-6">
          {/* Header pill */}
          <div className="flex justify-center">
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
          </div>

          {/* User greeting */}
          {userName && (
            <p
              className="text-center font-display font-bold text-xl"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              {lang === "en" ? `Namaste, ${userName}!` : `नमस्ते, ${userName}!`}
            </p>
          )}

          {/* ── R1: Main 3D Score Card + Full Gauge ── */}
          <div
            data-ocid="result.main_score_card"
            className="w-full rounded-3xl overflow-hidden"
            style={{
              background: "white",
              border: `2.5px solid ${totalZoneCfg.border}`,
              boxShadow:
                "0 4px 6px rgba(0,0,0,0.04), 0 10px 30px rgba(0,66,37,0.10), 0 20px 60px rgba(0,66,37,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Card inner top gradient for 3D feel */}
            <div
              className="w-full"
              style={{
                background: `linear-gradient(180deg, ${totalZoneCfg.bg} 0%, white 40%)`,
                padding: "1.5rem 1.5rem 0.5rem",
              }}
            >
              {/* Category badge top */}
              <div className="flex justify-center mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: totalZoneCfg.bg,
                    border: `1px solid ${totalZoneCfg.border}`,
                    color: totalZoneCfg.color,
                  }}
                >
                  <span aria-hidden="true">{totalZoneCfg.emoji}</span>
                  {lang === "en" ? totalZoneCfg.labelEN : totalZoneCfg.labelHI}
                </span>
              </div>

              {/* Large Gauge Meter */}
              <GaugeMeter value={result.totalScore} max={160} size={240} />
            </div>

            {/* Bottom info */}
            <div
              className="px-6 py-5 flex flex-col items-center gap-2 text-center"
              style={{
                borderTop: `1px solid ${totalZoneCfg.border}`,
                background: totalZoneCfg.bg,
              }}
            >
              <p
                className="text-sm leading-relaxed font-medium"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                {result.summaryMessage}
              </p>
              {/* Zone label zones legend */}
              <div className="flex items-center gap-3 mt-1">
                {(
                  [
                    "needs_attention",
                    "building_zone",
                    "strong_area",
                  ] as ZoneKey[]
                ).map((z) => (
                  <div key={z} className="flex items-center gap-1">
                    <span className="text-xs" aria-hidden="true">
                      {ZONE_CONFIG[z].emoji}
                    </span>
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: ZONE_CONFIG[z].color }}
                    >
                      {lang === "en"
                        ? ZONE_CONFIG[z].labelEN
                        : ZONE_CONFIG[z].labelHI}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── R2: Section Compact Cards ── */}
          <div className="w-full">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              {lang === "en" ? "Section-wise Scores" : "भाग-वार स्कोर"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {([0, 1, 2, 3] as const).map((idx) => (
                <CompactSectionCard
                  key={idx}
                  sectionIndex={idx}
                  sectionScore={sectionScores[idx]}
                  lang={lang}
                  suggestionsData={
                    sectionSuggestions[idx] as QuestionSuggestions[]
                  }
                />
              ))}
            </div>
          </div>

          {/* ── R5: CTA Buttons ── */}
          <div className="flex flex-col gap-3 pt-2">
            {/* R4: PDF Generate + WhatsApp Share button */}
            <button
              type="button"
              data-ocid="result.pdf_button"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="w-full py-4 rounded-2xl text-sm font-bold tracking-wide uppercase inline-flex items-center justify-center gap-2 transition-all"
              style={{
                background: isGeneratingPDF
                  ? "oklch(var(--abl-green) / 0.7)"
                  : "oklch(var(--abl-green))",
                color: "white",
                boxShadow: "0 4px 16px rgba(0,66,37,0.3)",
                cursor: isGeneratingPDF ? "not-allowed" : "pointer",
              }}
            >
              {isGeneratingPDF ? (
                /* Spinner */
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                  style={{
                    animation: "spin 1s linear infinite",
                  }}
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              ) : (
                /* PDF document icon */
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6zm2-6h8v1.5H8V14zm0-3h8v1.5H8V11zm0 6h5v1.5H8V17z" />
                </svg>
              )}
              <span>
                {isGeneratingPDF
                  ? lang === "en"
                    ? "Generating PDF..."
                    : "PDF बन रही है..."
                  : lang === "en"
                    ? "Get My Full Report (PDF)"
                    : "पूरी रिपोर्ट प्राप्त करें (PDF)"}
              </span>
            </button>

            {/* Consultation button */}
            <button
              type="button"
              data-ocid="result.consultation_button"
              onClick={() => {
                const msg = encodeURIComponent(
                  "Namaste, mujhe Dr. Suman Lal se 1-on-1 health consultation book karni hai.",
                );
                window.open(`https://wa.me/919199434365?text=${msg}`, "_blank");
              }}
              className="w-full py-4 rounded-2xl text-sm font-bold tracking-wide uppercase inline-flex items-center justify-center gap-2 transition-all"
              style={{
                background: "oklch(var(--abl-gold))",
                color: "white",
                boxShadow: "0 4px 16px rgba(158,107,61,0.3)",
              }}
            >
              {/* WhatsApp SVG logo */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              <span>
                {lang === "en"
                  ? "Book 1-on-1 Consultation"
                  : "1-on-1 परामर्श बुक करें"}
              </span>
            </button>
          </div>
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

const DRAFT_KEY = "ablpulse_assessment_draft";

function AssessmentPage({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const [step, setStep] = useState<"form" | "questionnaire" | "result">("form");
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, number>>({});
  const [showResumeBanner, setShowResumeBanner] = useState(false);
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
  const [recordId, setRecordId] = useState<bigint | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as {
          form: AssessmentFormState;
          lang: Lang;
          savedAt: string;
        };
        if (draft.form?.name || draft.form?.whatsapp) {
          setShowResumeBanner(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-save form to localStorage whenever form changes
  useEffect(() => {
    if (form.name || form.whatsapp) {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ form, lang, savedAt: new Date().toISOString() }),
        );
      } catch {
        // ignore
      }
    }
  }, [form, lang]);

  const resumeDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as {
          form: AssessmentFormState;
          lang: Lang;
        };
        if (draft.form) setForm(draft.form);
        if (draft.lang) setLang(draft.lang);
      }
    } catch {
      // ignore
    }
    setShowResumeBanner(false);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(ANSWERS_DRAFT_KEY);
    setShowResumeBanner(false);
  };

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
      // Fire-and-forget: save basic info to backend immediately
      if (actor) {
        actor
          .saveBasicInfo(
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
          )
          .then((id) => {
            setRecordId(id);
          })
          .catch(console.error);
      }
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
          // Clear both drafts on completion
          localStorage.removeItem(DRAFT_KEY);
          localStorage.removeItem(ANSWERS_DRAFT_KEY);
          setStep("result");
          // Fire-and-forget backend save
          const answersArray = Array.from({ length: 40 }, (_, i) => {
            const sectionIdx = Math.floor(i / 10);
            const questionIdx = i % 10;
            return BigInt(answers[`s${sectionIdx}-q${questionIdx}`] ?? 0);
          });
          if (actor) {
            if (recordId !== null) {
              // Update existing partial record with full answers + scores
              actor
                .updateAssessmentResult(recordId, answersArray)
                .catch(console.error);
            } else {
              // Fallback: full submission if saveBasicInfo was not called
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
        onLangToggle={() => setLang(lang === "en" ? "hi" : "en")}
        onBack={onBack}
        userName={form.name}
        userAge={form.age}
        userGender={form.gender}
      />
    );
  }

  /* ── FORM STEP ── */
  return (
    <div
      data-ocid="assessment.page"
      className="fixed inset-0 z-[900] flex flex-col overflow-hidden"
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
      <div className="relative z-10 flex-1 overflow-y-auto pb-16">
        {/* ── Resume Draft Banner ── */}
        {showResumeBanner && (
          <div
            className="mx-4 mt-3 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            style={{
              background: "oklch(var(--abl-gold) / 0.1)",
              border: "1.5px solid oklch(var(--abl-gold) / 0.4)",
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-bold"
                style={{ color: "oklch(var(--abl-gold))" }}
              >
                {lang === "en" ? "Draft Saved" : "ड्राफ्ट सेव है"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                {lang === "en"
                  ? "Continue your previous assessment?"
                  : "पिछला आकलन जारी रखें?"}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={clearDraft}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                style={{
                  background: "oklch(var(--abl-bg))",
                  color: "oklch(var(--abl-border))",
                  border: "1px solid oklch(var(--abl-border) / 0.5)",
                }}
              >
                {lang === "en" ? "Clear" : "हटाएं"}
              </button>
              <button
                type="button"
                onClick={resumeDraft}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg"
                style={{
                  background: "oklch(var(--abl-gold))",
                  color: "white",
                }}
              >
                {lang === "en" ? "Resume" : "जारी करें"}
              </button>
            </div>
          </div>
        )}

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
  onServices,
  onAbout,
  onContact,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  onAssessment: () => void;
  onLogin: () => void;
  onServices: () => void;
  onAbout: () => void;
  onContact: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    {
      label: "Home",
      id: "home",
      isAssessment: false,
      isServices: false,
      isAbout: false,
      isContact: false,
    },
    {
      label: "Assessment",
      id: "assessment",
      isAssessment: true,
      isServices: false,
      isAbout: false,
      isContact: false,
    },
    {
      label: "Services",
      id: "framework",
      isAssessment: false,
      isServices: true,
      isAbout: false,
      isContact: false,
    },
    {
      label: "About Us",
      id: "trust",
      isAssessment: false,
      isServices: false,
      isAbout: true,
      isContact: false,
    },
    {
      label: "Contact Us",
      id: "contact",
      isAssessment: false,
      isServices: false,
      isAbout: false,
      isContact: true,
    },
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
                } else if (l.isServices) {
                  onServices();
                } else if (l.isAbout) {
                  onAbout();
                } else if (l.isContact) {
                  onContact();
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
                  } else if (l.isServices) {
                    onServices();
                  } else if (l.isAbout) {
                    onAbout();
                  } else if (l.isContact) {
                    onContact();
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
          className="reveal reveal-delay-1 font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 tracking-wide sm:tracking-tight"
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
          className="reveal reveal-delay-2 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto whitespace-nowrap sm:whitespace-normal overflow-hidden text-ellipsis"
          style={{ color: "oklch(var(--abl-green-mid))" }}
        >
          Discover the small daily habits affecting your health.
        </p>

        {/* Trust indicators */}
        <div className="reveal reveal-delay-3 flex flex-nowrap sm:flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 overflow-x-auto sm:overflow-visible">
          {["Free Assessment", "Takes 5 Minutes", "40+ Years Expertise"].map(
            (t) => (
              <div
                key={t}
                className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
              >
                <CheckCircle2
                  size={13}
                  style={{ color: "oklch(var(--abl-green))" }}
                />
                <span
                  className="text-xs font-medium whitespace-nowrap"
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
            className="btn-gold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-bold tracking-wide shadow-gold uppercase inline-flex items-center justify-center gap-2"
          >
            <span>Get Your Health Readiness Score</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Heartbeat decoration — desktop only */}
        <div className="hidden sm:flex mt-12 justify-center">
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
  onServices,
  onAbout,
  onContact,
}: {
  onAssessment: () => void;
  onLogin: () => void;
  onServices: () => void;
  onAbout: () => void;
  onContact: () => void;
}) {
  const year = new Date().getFullYear();

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
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("home")}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  data-ocid="footer.home_link"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onAssessment}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  data-ocid="footer.assessment_link"
                >
                  Assessment
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onServices}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  data-ocid="footer.services_link"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onAbout}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  data-ocid="footer.about_link"
                >
                  About Us
                </button>
              </li>
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
                  onClick={onContact}
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
   SERVICES PAGE
───────────────────────────────────────────── */
function ServicesPage({
  onAssessment,
  onBack,
}: {
  onAssessment: () => void;
  onBack: () => void;
}) {
  const WHATSAPP_LINK = `https://wa.me/919199434365?text=${encodeURIComponent("Namaste, I would like to book a One-on-One Report Reading session.")}`;

  const services = [
    {
      title: "Health Readiness Score",
      badge: "Live",
      badgeLive: true,
      description:
        "Quick 5–7 minute assessment to identify your lifestyle gap.",
      cta: "Start Free Assessment",
      ctaAction: "assessment" as const,
    },
    {
      title: "One-on-One Report Reading Support",
      badge: "Live",
      badgeLive: true,
      description:
        "15–20 minute expert session to explain your readiness gap and suggest your next step.",
      cta: "Book Clarity Session",
      ctaAction: "whatsapp" as const,
    },
    {
      title: "Awareness Webinar",
      badge: "Coming Soon",
      badgeLive: false,
      description:
        "Understand lifestyle gaps and how small corrections create big impact.",
      cta: "Coming Soon",
      ctaAction: "coming_soon" as const,
    },
    {
      title: "Structured Health Programs",
      badge: "Coming Soon",
      badgeLive: false,
      description:
        "Guided weekly improvement program for long-term lifestyle balance.",
      cta: "Coming Soon",
      ctaAction: "coming_soon" as const,
    },
    {
      title: "7-Day Health Engagement Camp",
      badge: "Coming Soon",
      badgeLive: false,
      description:
        "Community-based health activation and habit reset real experience.",
      cta: "Coming Soon",
      ctaAction: "coming_soon" as const,
    },
  ] as const;

  return (
    <div
      data-ocid="services.page"
      className="fixed inset-0 z-[900] flex flex-col overflow-hidden"
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

      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "white",
          borderBottom: "1px solid oklch(var(--abl-border))",
        }}
      >
        <button
          type="button"
          data-ocid="services.back_button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            color: "oklch(var(--abl-green))",
            background: "oklch(var(--abl-green) / 0.08)",
            border: "1px solid oklch(var(--abl-green) / 0.2)",
          }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <LogoImage
          imgClassName="h-8 w-8"
          textClassName="text-sm"
          textStyle={{ color: "oklch(var(--abl-green))" }}
        />
        <div className="w-[68px]" aria-hidden="true" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-[80px] md:pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
          {/* Page Heading */}
          <div className="text-center mb-8">
            <h1
              className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-3"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Our Health Readiness Services
            </h1>
            <p
              className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              Structured lifestyle clarity and guided support to help you
              understand and improve your health step by step.
            </p>
          </div>

          {/* Service Cards */}
          <div className="flex flex-col gap-4 mb-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "white",
                  border: `1.5px solid ${service.badgeLive ? "oklch(var(--abl-green) / 0.2)" : "oklch(var(--abl-border) / 0.4)"}`,
                  boxShadow: service.badgeLive
                    ? "0 2px 16px oklch(var(--abl-green) / 0.07)"
                    : "none",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2
                    className="font-display font-bold text-base leading-snug flex-1"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {service.title}
                  </h2>
                  <span
                    className="flex-shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={
                      service.badgeLive
                        ? {
                            background: "oklch(var(--abl-green) / 0.1)",
                            color: "oklch(var(--abl-green))",
                            border: "1px solid oklch(var(--abl-green) / 0.3)",
                          }
                        : {
                            background: "oklch(var(--abl-border) / 0.15)",
                            color: "oklch(var(--abl-border))",
                            border: "1px solid oklch(var(--abl-border) / 0.4)",
                          }
                    }
                  >
                    {service.badge}
                  </span>
                </div>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  {service.description}
                </p>

                {service.ctaAction === "assessment" && (
                  <button
                    type="button"
                    data-ocid="services.start_assessment_button"
                    onClick={onAssessment}
                    className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all"
                    style={{
                      background: "oklch(var(--abl-green))",
                      color: "white",
                      boxShadow: "0 4px 12px oklch(var(--abl-green) / 0.25)",
                    }}
                  >
                    {service.cta}
                  </button>
                )}

                {service.ctaAction === "whatsapp" && (
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="services.book_clarity_button"
                    className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all inline-flex items-center justify-center gap-2"
                    style={{
                      background: "#25D366",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
                      textDecoration: "none",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    {service.cta}
                  </a>
                )}

                {service.ctaAction === "coming_soon" && (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl text-sm font-bold tracking-wide cursor-not-allowed"
                    style={{
                      background: "oklch(var(--abl-bg))",
                      color: "oklch(var(--abl-border))",
                      border: "1.5px solid oklch(var(--abl-border) / 0.4)",
                    }}
                  >
                    {service.cta}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div
            className="rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center gap-4"
            style={{
              background: "oklch(var(--abl-green))",
              boxShadow: "0 8px 32px oklch(var(--abl-green) / 0.25)",
            }}
          >
            <h2 className="font-display font-bold text-xl sm:text-2xl leading-tight text-white">
              Ready to Understand Your Health Gap?
            </h2>
            <p
              className="text-sm leading-relaxed max-w-md"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Start with a simple assessment and get clear guidance on your next
              small step toward better lifestyle balance.
            </p>
            <button
              type="button"
              data-ocid="services.bottom_assessment_button"
              onClick={onAssessment}
              className="px-8 py-3.5 rounded-2xl text-sm font-bold tracking-wide uppercase transition-all"
              style={{
                background: "oklch(var(--abl-gold))",
                color: "white",
                boxShadow: "0 4px 16px rgba(158,107,61,0.4)",
              }}
            >
              Start Free Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT US PAGE
───────────────────────────────────────────── */
function AboutUsPage({ onBack }: { onBack: () => void }) {
  const coreValues = [
    {
      title: "Education First",
      description:
        "Before suggesting any correction, we help you understand your health gap. Awareness creates direction.",
    },
    {
      title: "Structured Improvement",
      description:
        "We don't give random advice. Every step is based on your readiness category — High, Moderate, or Low.",
    },
    {
      title: "Sustainable Lifestyle Design",
      description:
        "No crash changes. Only practical, small corrections that fit your real routine.",
    },
    {
      title: "Accessible First Step",
      description:
        "Your Health Readiness Score is free — Because understanding your body should not be complicated.",
    },
  ];

  return (
    <div
      data-ocid="about.page"
      className="fixed inset-0 z-[900] flex flex-col overflow-hidden"
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

      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "white",
          borderBottom: "1px solid oklch(var(--abl-border))",
        }}
      >
        <button
          type="button"
          data-ocid="about.back_button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            color: "oklch(var(--abl-green))",
            background: "oklch(var(--abl-green) / 0.08)",
            border: "1px solid oklch(var(--abl-green) / 0.2)",
          }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <LogoImage
          imgClassName="h-8 w-8"
          textClassName="text-sm"
          textStyle={{ color: "oklch(var(--abl-green))" }}
        />
        <div className="w-[68px]" aria-hidden="true" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-[80px] md:pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
          {/* Page Heading */}
          <div className="text-center mb-8">
            <h1
              className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-3"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              About ABL Pulse
            </h1>
            <p
              className="text-base sm:text-lg font-semibold leading-snug"
              style={{ color: "oklch(var(--abl-gold))" }}
            >
              ABL Care is a Structured Lifestyle Readiness Platform.
            </p>
          </div>

          {/* Intro paragraphs */}
          <div
            className="rounded-2xl p-5 mb-6 flex flex-col gap-3"
            style={{
              background: "white",
              border: "1.5px solid oklch(var(--abl-green) / 0.15)",
              boxShadow: "0 2px 12px oklch(var(--abl-green) / 0.06)",
            }}
          >
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              We help individuals understand their Health Readiness Score and
              identify the small daily habits that may be silently affecting
              their body.
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed font-medium"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Our focus is not quick fixes — It is clarity, correction, and
              consistency.
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              We believe lifestyle imbalance happens gradually. Correction must
              also begin gradually — but with structure.
            </p>
          </div>

          {/* Philosophy Section */}
          <div
            data-ocid="about.philosophy_section"
            className="rounded-2xl p-5 mb-6"
            style={{
              background: "oklch(var(--abl-green) / 0.06)",
              borderLeft: "4px solid oklch(var(--abl-green))",
              border: "1.5px solid oklch(var(--abl-green) / 0.2)",
              borderLeftWidth: "4px",
            }}
          >
            <h2
              className="font-display font-bold text-base sm:text-lg mb-3"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Our Philosophy (Clarity. Correction. Consistency.)
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              At ABL Pulse, we believe that the human body has an immense
              capacity to heal itself. However, modern lifestyle, incorrect
              dietary habits, and stress have suppressed this natural ability.
            </p>
          </div>

          {/* Dr. Suman Lal Block */}
          <div
            data-ocid="about.doctor_section"
            className="rounded-2xl p-5 mb-6 flex flex-col items-center gap-4"
            style={{
              background: "white",
              border: "1.5px solid oklch(var(--abl-green) / 0.15)",
              boxShadow: "0 2px 12px oklch(var(--abl-green) / 0.06)",
            }}
          >
            {/* Square photo */}
            <div className="flex flex-col items-center gap-2">
              <img
                src="/assets/uploads/Dr-Suman-Lal-2.png"
                alt="Dr. Suman Lal – Founder, ABL Pulse"
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover object-top"
                style={{
                  border: "3px solid oklch(var(--abl-green) / 0.2)",
                  boxShadow: "0 4px 16px oklch(var(--abl-green) / 0.12)",
                }}
              />
              <p
                className="text-sm font-bold tracking-wide"
                style={{ color: "oklch(var(--abl-gold))" }}
              >
                Founder, Dr. Suman Lal
              </p>
            </div>

            {/* Paragraphs after photo */}
            <div className="flex flex-col gap-3 w-full">
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                Our approach is not about suppressing symptoms with temporary
                fixes. Instead, we focus on Root Cause Healing. By correcting
                your food, water intake, and daily routine, we align your body
                back with nature's rhythm.
              </p>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "oklch(var(--abl-green-mid))" }}
              >
                Guided by Dr. Suman Lal's 40+ years of experience, we bring you
                the essence of Indian Naturopathy and Ayurveda in a practical,
                modern format.
              </p>
            </div>
          </div>

          {/* Core Values Section */}
          <div data-ocid="about.core_values_section">
            <h2
              className="font-display font-bold text-xl sm:text-2xl mb-4 text-center"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreValues.map((value, idx) => (
                <div
                  key={value.title}
                  data-ocid={`about.core_value.${idx + 1}`}
                  className="rounded-2xl p-5 flex flex-col gap-2"
                  style={{
                    background: "oklch(var(--abl-gold) / 0.08)",
                    border: "1.5px solid oklch(var(--abl-gold) / 0.3)",
                  }}
                >
                  <h3
                    className="font-display font-bold text-base"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(var(--abl-green-mid))" }}
                  >
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTACT US PAGE
─────────────────────────────────────────── */
function ContactUsPage({ onBack }: { onBack: () => void }) {
  const WHATSAPP_LINK = "https://wa.me/919199434365";

  return (
    <div
      data-ocid="contact.page"
      className="fixed inset-0 z-[900] flex flex-col overflow-hidden"
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

      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "white",
          borderBottom: "1px solid oklch(var(--abl-border))",
        }}
      >
        <button
          type="button"
          data-ocid="contact.back_button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            color: "oklch(var(--abl-green))",
            background: "oklch(var(--abl-green) / 0.08)",
            border: "1px solid oklch(var(--abl-green) / 0.2)",
          }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <LogoImage
          imgClassName="h-8 w-8"
          textClassName="text-sm"
          textStyle={{ color: "oklch(var(--abl-green))" }}
        />
        <div className="w-[68px]" aria-hidden="true" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-[80px] md:pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
          {/* Page Heading */}
          <div className="text-center mb-8">
            <h1
              className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-3"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Contact Us
            </h1>
            <p
              className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto"
              style={{ color: "oklch(var(--abl-green-mid))" }}
            >
              We'd love to hear from you.
            </p>
          </div>

          {/* Get in Touch Card */}
          <div
            className="rounded-2xl p-6 mb-5"
            style={{
              background: "white",
              border: "1.5px solid oklch(var(--abl-green) / 0.15)",
              boxShadow: "0 2px 16px oklch(var(--abl-green) / 0.07)",
            }}
          >
            <h2
              className="font-display font-bold text-lg mb-5"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Get in Touch
            </h2>

            <div className="flex flex-col gap-5">
              {/* Phone / WhatsApp */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(var(--abl-green) / 0.08)" }}
                >
                  <Phone
                    size={18}
                    style={{ color: "oklch(var(--abl-green))" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "oklch(var(--abl-border))" }}
                  >
                    Phone / WhatsApp
                  </p>
                  <a
                    href="tel:+919199434365"
                    data-ocid="contact.phone_link"
                    className="text-base font-semibold hover:underline"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    +91 9199434365
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(var(--abl-gold) / 0.1)" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "oklch(var(--abl-gold))" }}
                    aria-hidden="true"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "oklch(var(--abl-border))" }}
                  >
                    Email Address
                  </p>
                  <a
                    href="mailto:support@ablpulse.com"
                    data-ocid="contact.email_link"
                    className="text-base font-semibold hover:underline break-all"
                    style={{ color: "oklch(var(--abl-gold))" }}
                  >
                    support@ablpulse.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(var(--abl-green) / 0.08)" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "oklch(var(--abl-green))" }}
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "oklch(var(--abl-border))" }}
                  >
                    Location
                  </p>
                  <p
                    className="text-base font-semibold leading-snug"
                    style={{ color: "oklch(var(--abl-green))" }}
                  >
                    Old Museum, Patna,
                    <br />
                    Bihar – 800001, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Hours Card */}
          <div
            className="rounded-2xl p-6 mb-5"
            style={{
              background: "white",
              border: "1.5px solid oklch(var(--abl-border) / 0.3)",
            }}
          >
            <h2
              className="font-display font-bold text-lg mb-4"
              style={{ color: "oklch(var(--abl-green))" }}
            >
              Office Hours
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Monday - Saturday
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(var(--abl-green))" }}
                >
                  10:00 AM - 7:00 PM
                </span>
              </div>
              <div
                className="border-t pt-2 flex items-center justify-between"
                style={{ borderColor: "oklch(var(--abl-border) / 0.2)" }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "oklch(var(--abl-green-mid))" }}
                >
                  Sunday
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#DC2626" }}
                >
                  Closed
                </span>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div
            className="rounded-3xl p-6 text-center flex flex-col items-center gap-4"
            style={{
              background: "oklch(var(--abl-green))",
              boxShadow: "0 8px 32px oklch(var(--abl-green) / 0.25)",
            }}
          >
            <p className="text-base font-bold text-white">
              Need immediate assistance?
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.whatsapp_button"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all"
              style={{
                background: "#25D366",
                color: "white",
                boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
                textDecoration: "none",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Chat on WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOTTOM APP BAR (Mobile)
─────────────────────────────────────────── */
const navItems = [
  {
    icon: Home,
    label: "Home",
    id: "home",
    ocid: "nav.mobile.home_link",
    isAssessment: false,
    isContact: false,
  },
  {
    icon: ClipboardList,
    label: "Assessment",
    id: "assessment",
    ocid: "nav.mobile.assessment_link",
    isAssessment: true,
    isContact: false,
  },
  {
    icon: Briefcase,
    label: "Services",
    id: "framework",
    ocid: "nav.mobile.services_link",
    isAssessment: false,
    isContact: false,
  },
  {
    icon: Users,
    label: "About",
    id: "trust",
    ocid: "nav.mobile.about_link",
    isAssessment: false,
    isContact: false,
  },
  {
    icon: Phone,
    label: "Contact",
    id: "contact",
    ocid: "nav.mobile.contact_link",
    isAssessment: false,
    isContact: true,
  },
];

function BottomAppBar({
  activeSection,
  onAssessment,
  onGoHome,
  onGoServices,
  onGoAbout,
  onGoContact,
  currentPage,
}: {
  activeSection: string;
  onAssessment: () => void;
  onGoHome: () => void;
  onGoServices: () => void;
  onGoAbout: () => void;
  onGoContact: () => void;
  currentPage: "home" | "assessment" | "services" | "about" | "contact";
}) {
  return (
    <nav className="bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="flex items-stretch justify-around h-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Determine active state based on currentPage
          let isActive = false;
          if (currentPage === "assessment") {
            isActive = item.isAssessment;
          } else if (currentPage === "services") {
            isActive = item.id === "framework";
          } else if (currentPage === "about") {
            isActive = item.id === "trust";
          } else if (currentPage === "contact") {
            isActive = item.isContact;
          } else {
            isActive = item.id === (activeSection || "home");
          }
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={item.ocid}
              onClick={() => {
                if (item.id === "home") {
                  // Home always goes to landing page
                  onGoHome();
                  scrollToSection("home");
                } else if (item.isAssessment) {
                  onAssessment();
                } else if (item.id === "framework") {
                  onGoServices();
                } else if (item.id === "trust") {
                  onGoAbout();
                } else if (item.isContact) {
                  onGoContact();
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
      href="https://wa.me/919199434365"
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
  const [currentPage, setCurrentPage] = useState<
    "home" | "assessment" | "services" | "about" | "contact"
  >("home");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminRole, setAdminRole] = useState<"admin" | "hc">("admin");

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

  const goToServices = () => {
    setCurrentPage("services");
    setMobileMenuOpen(false);
  };

  const goToAbout = () => {
    setCurrentPage("about");
    setMobileMenuOpen(false);
  };

  const goToContact = () => {
    setCurrentPage("contact");
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

      {/* Services page (full-screen overlay) */}
      {currentPage === "services" && (
        <ServicesPage onAssessment={goToAssessment} onBack={goHome} />
      )}

      {/* About Us page (full-screen overlay) */}
      {currentPage === "about" && <AboutUsPage onBack={goHome} />}

      {/* Contact Us page (full-screen overlay) */}
      {currentPage === "contact" && <ContactUsPage onBack={goHome} />}

      {/* Admin Dashboard (full-screen overlay) */}
      {showAdminDashboard && (
        <AdminDashboard
          onLogout={() => setShowAdminDashboard(false)}
          role={adminRole}
        />
      )}

      {/* Login modal (on top of everything) */}
      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          onAdminLogin={(role) => {
            setAdminRole(role);
            setLoginModalOpen(false);
            setShowAdminDashboard(true);
          }}
        />
      )}

      {/* Main landing page — always rendered, hidden behind assessment overlay */}
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onAssessment={goToAssessment}
        onLogin={openLogin}
        onServices={goToServices}
        onAbout={goToAbout}
        onContact={goToContact}
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

      <Footer
        onAssessment={goToAssessment}
        onLogin={openLogin}
        onServices={goToServices}
        onAbout={goToAbout}
        onContact={goToContact}
      />

      {/* Mobile bottom nav */}
      <BottomAppBar
        activeSection={activeSection}
        onAssessment={goToAssessment}
        onGoHome={goHome}
        onGoServices={goToServices}
        onGoAbout={goToAbout}
        onGoContact={goToContact}
        currentPage={currentPage}
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
