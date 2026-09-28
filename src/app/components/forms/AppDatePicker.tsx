import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TextField, InputAdornment } from "@mui/material";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { muiFieldSx } from "./muiFieldSx";
import { ResponsiveOverlay } from "../shared/ResponsiveOverlay";

export interface AppDatePickerProps {
  id: string;
  label: string;
  /** Shorter label shown on screens ≤768px. Full label stays as accessible name. */
  mobileLabel?: string;
  value: string; // YYYY-MM-DD stored
  onChange: (v: string) => void;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxDate?: string; // YYYY-MM-DD
  /** Open calendar inside ResponsiveOverlay bottom sheet on mobile (≤1023px). */
  mobileSheet?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getDaysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

function getFirstDayOfMonth(y: number, m: number): number {
  return new Date(y, m - 1, 1).getDay();
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AppDatePicker({
  id, label, mobileLabel, value, onChange, helper, error, required, disabled, maxDate, mobileSheet,
}: AppDatePickerProps) {
  const { t } = useTranslation("forms");
  const [isOpen, setIsOpen] = useState(false);

  // Swap to shorter label on narrow screens; full label stays as accessible name
  const [isMobile768, setIsMobile768] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile768(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Breakpoint aligned with ResponsiveOverlay bottom-sheet breakpoint
  const [isMobile1023, setIsMobile1023] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile1023(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const visibleLabel = isMobile768 && mobileLabel ? mobileLabel : label;
  const useBottomSheet = mobileSheet && isMobile1023;

  const [view, setView] = useState<"days" | "months">("days");
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();

  const parsed = parseIso(value);
  const maxParsed = parseIso(maxDate ?? "");

  const [viewYear, setViewYear] = useState(parsed?.y ?? todayY);
  const [viewMonth, setViewMonth] = useState(parsed?.m ?? todayM);

  // Sync view to externally changed value
  useEffect(() => {
    if (parsed) { setViewYear(parsed.y); setViewMonth(parsed.m); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const computePopupStyle = (): React.CSSProperties => {
    if (!containerRef.current) return {};
    const rect = containerRef.current.getBoundingClientRect();
    const POPUP_W = 288;
    const POPUP_H = 340; // approximate
    const GAP = 4;

    // Horizontal: don't overflow right edge
    const left = Math.min(rect.left, window.innerWidth - POPUP_W - 8);

    // Vertical: prefer below, flip above if not enough room
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    if (spaceBelow >= POPUP_H || rect.top < POPUP_H) {
      return { position: "fixed", top: rect.bottom + GAP, left: Math.max(8, left) };
    }
    return { position: "fixed", bottom: window.innerHeight - rect.top + GAP, left: Math.max(8, left) };
  };

  // Close on outside click (floating popup only)
  useEffect(() => {
    if (!isOpen || useBottomSheet) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!containerRef.current?.contains(target)) {
        const popup = document.querySelector(".app-date-picker__popup");
        if (!popup?.contains(target)) setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, useBottomSheet]);

  // Close on ESC; close+reposition on scroll (floating popup only)
  useEffect(() => {
    if (!isOpen || useBottomSheet) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    const onScroll = () => setIsOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [isOpen, useBottomSheet]);

  const displayValue = parsed
    ? `${String(parsed.d).padStart(2, "0")}/${String(parsed.m).padStart(2, "0")}/${parsed.y}`
    : "";

  const monthsRaw = t("datePicker.months", { returnObjects: true });
  const weekdaysRaw = t("datePicker.weekdays", { returnObjects: true });
  const months: string[] = Array.isArray(monthsRaw)
    ? monthsRaw
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekdays: string[] = Array.isArray(weekdaysRaw)
    ? weekdaysRaw
    : ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const navigateMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const isDisabledDate = (y: number, m: number, d: number): boolean => {
    if (!maxParsed) return false;
    if (y > maxParsed.y) return true;
    if (y === maxParsed.y && m > maxParsed.m) return true;
    if (y === maxParsed.y && m === maxParsed.m && d > maxParsed.d) return true;
    return false;
  };

  const isMonthDisabled = (y: number, m: number): boolean => {
    if (!maxParsed) return false;
    if (y > maxParsed.y) return true;
    if (y === maxParsed.y && m > maxParsed.m) return true;
    return false;
  };

  const handleDayClick = (y: number, m: number, d: number) => {
    if (isDisabledDate(y, m, d)) return;
    onChange(toIso(y, m, d));
    setIsOpen(false);
    setView("days");
  };

  const handleMonthSelect = (m: number) => {
    setViewMonth(m);
    setView("days");
  };

  // Build 42-cell grid
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(
    viewMonth === 1 ? viewYear - 1 : viewYear,
    viewMonth === 1 ? 12 : viewMonth - 1,
  );

  type Cell = { y: number; m: number; d: number; current: boolean };
  const cells: Cell[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const pm = viewMonth === 1 ? 12 : viewMonth - 1;
    const py = viewMonth === 1 ? viewYear - 1 : viewYear;
    cells.push({ y: py, m: pm, d: prevMonthDays - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ y: viewYear, m: viewMonth, d, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = viewMonth === 12 ? 1 : viewMonth + 1;
    const ny = viewMonth === 12 ? viewYear + 1 : viewYear;
    cells.push({ y: ny, m: nm, d, current: false });
  }

  const todayDisabled = isDisabledDate(todayY, todayM, todayD);

  const open = () => {
    if (!disabled) {
      setPopupStyle(computePopupStyle());
      setView("days");
      setIsOpen(true);
    }
  };

  const toggle = () => {
    if (isOpen) { setIsOpen(false); setView("days"); }
    else open();
  };

  const closeCalendar = () => { setIsOpen(false); setView("days"); };

  // ── Calendar content (shared between popup and bottom sheet) ──────────────

  const calendarContent = (
    <>
      {view === "months" ? (
        /* ── Month picker view ─────────────────────────────────────────── */
        <>
          <div className="app-date-picker__header">
            <button
              type="button"
              className="app-date-picker__nav"
              onClick={() => setViewYear(y => y - 1)}
              aria-label={t("datePicker.prevYear")}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <span className="app-date-picker__month-label">{viewYear}</span>
            <button
              type="button"
              className="app-date-picker__nav"
              onClick={() => setViewYear(y => y + 1)}
              aria-label={t("datePicker.nextYear")}
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="app-date-picker__month-grid">
            {months.map((name, idx) => {
              const m = idx + 1;
              const dis = isMonthDisabled(viewYear, m);
              const sel = viewYear === (parsed?.y ?? todayY) && m === viewMonth;
              return (
                <button
                  key={m}
                  type="button"
                  className={[
                    "app-date-picker__month-btn",
                    sel ? "app-date-picker__month-btn--selected" : "",
                    dis ? "app-date-picker__month-btn--disabled" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => !dis && handleMonthSelect(m)}
                  disabled={dis}
                  aria-pressed={sel}
                >
                  {name.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* ── Day picker view ───────────────────────────────────────────── */
        <>
          <div className="app-date-picker__header">
            <button
              type="button"
              className="app-date-picker__nav"
              onClick={() => navigateMonth(-1)}
              aria-label={t("datePicker.prevMonth")}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="app-date-picker__month-label app-date-picker__month-label--btn"
              onClick={() => setView("months")}
              aria-label={t("datePicker.selectMonth")}
            >
              {months[viewMonth - 1]} {viewYear}
            </button>
            <button
              type="button"
              className="app-date-picker__nav"
              onClick={() => navigateMonth(1)}
              aria-label={t("datePicker.nextMonth")}
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="app-date-picker__grid">
            {weekdays.map(wd => (
              <div key={wd} className="app-date-picker__weekday">{wd}</div>
            ))}
            {cells.map((cell, idx) => {
              const sel = !!parsed && cell.y === parsed.y && cell.m === parsed.m && cell.d === parsed.d;
              const isToday = cell.y === todayY && cell.m === todayM && cell.d === todayD;
              const dis = isDisabledDate(cell.y, cell.m, cell.d);
              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "app-date-picker__day",
                    !cell.current ? "app-date-picker__day--other" : "",
                    sel ? "app-date-picker__day--selected" : "",
                    isToday && !sel ? "app-date-picker__day--today" : "",
                    dis ? "app-date-picker__day--disabled" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleDayClick(cell.y, cell.m, cell.d)}
                  disabled={dis}
                  tabIndex={!cell.current || dis ? -1 : 0}
                  aria-pressed={sel}
                  aria-label={`${cell.d} ${months[cell.m - 1]} ${cell.y}`}
                >
                  {cell.d}
                </button>
              );
            })}
          </div>

          <div className="app-date-picker__footer">
            <button
              type="button"
              className="app-date-picker__today-btn"
              disabled={todayDisabled}
              onClick={() => {
                if (!todayDisabled) {
                  onChange(toIso(todayY, todayM, todayD));
                  closeCalendar();
                }
              }}
            >
              {t("datePicker.today")}
            </button>
          </div>
        </>
      )}
    </>
  );

  // ── Floating popup (desktop / non-sheet mode) ─────────────────────────────

  const floatingPopup = (
    <div
      className="app-date-picker__popup"
      style={{ ...popupStyle, zIndex: 1500 }}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {calendarContent}
    </div>
  );

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <TextField
        id={id}
        label={visibleLabel}
        value={displayValue}
        placeholder="DD/MM/YYYY"
        onClick={toggle}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
          if (e.key === "Escape") { setIsOpen(false); setView("days"); }
        }}
        helperText={error || helper}
        error={!!error}
        required={required}
        disabled={disabled}
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: !!displayValue || isOpen || undefined }}
        inputProps={{
          readOnly: true,
          "aria-haspopup": "dialog",
          "aria-expanded": isOpen,
          "aria-label": label,
          "aria-required": required ? "true" : undefined,
          "aria-describedby": (error || helper) ? `${id}-helper` : undefined,
          "aria-invalid": !!error || undefined,
          style: { cursor: disabled ? "not-allowed" : "pointer" },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarDays size={18} color="var(--color-text-secondary)" style={{ pointerEvents: "none" }} />
            </InputAdornment>
          ),
        }}
        FormHelperTextProps={{ id: `${id}-helper` }}
        sx={muiFieldSx}
      />

      {/* Bottom sheet (mobile) */}
      {useBottomSheet && (
        <ResponsiveOverlay
          open={isOpen}
          onClose={closeCalendar}
          title={label}
          closeLabel={t("datePicker.close")}
          mobileMaxHeight="90dvh"
          className="app-date-picker-sheet"
        >
          <div className="app-date-picker__sheet-body">
            {calendarContent}
          </div>
        </ResponsiveOverlay>
      )}

      {/* Floating popup (desktop) */}
      {!useBottomSheet && isOpen && !disabled && typeof document !== "undefined"
        ? createPortal(floatingPopup, document.body)
        : null}
    </div>
  );
}
