import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SR_DOCUMENT_SAMPLES, SRSampleCategory, SRSample } from "../../data/specialRegistrationSamples";
import { ResponsiveOverlay } from "../shared/ResponsiveOverlay";

// ── CSS-rendered document illustrations ──────────────────────────────────────

function IdCardIllustration() {
  return (
    <div className="sr-sample__doc sr-sample__doc--id-card" aria-hidden="true">
      <div className="sr-sample__doc-header">
        <div className="sr-sample__doc-flag">🇧🇩</div>
        <div>
          <div className="sr-sample__doc-title-line" />
          <div className="sr-sample__doc-sub-line" />
        </div>
      </div>
      <div className="sr-sample__doc-body">
        <div className="sr-sample__doc-photo" />
        <div className="sr-sample__doc-fields">
          <div className="sr-sample__doc-field">
            <span className="sr-sample__doc-field-label">Name</span>
            <div className="sr-sample__doc-field-value" />
          </div>
          <div className="sr-sample__doc-field">
            <span className="sr-sample__doc-field-label">NID No.</span>
            <div className="sr-sample__doc-field-value sr-sample__doc-field-value--short" />
          </div>
          <div className="sr-sample__doc-field">
            <span className="sr-sample__doc-field-label">DOB</span>
            <div className="sr-sample__doc-field-value sr-sample__doc-field-value--short" />
          </div>
          <div className="sr-sample__doc-field">
            <span className="sr-sample__doc-field-label">Address</span>
            <div className="sr-sample__doc-field-value" />
            <div className="sr-sample__doc-field-value sr-sample__doc-field-value--half" style={{ marginTop: 4 }} />
          </div>
        </div>
      </div>
      <div className="sr-sample__doc-footer">
        <div className="sr-sample__doc-barcode">
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} className={`sr-sample__doc-bar${i % 3 === 0 ? " sr-sample__doc-bar--wide" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PassportPageIllustration() {
  return (
    <div className="sr-sample__doc sr-sample__doc--passport" aria-hidden="true">
      <div className="sr-sample__doc-header sr-sample__doc-header--passport">
        <div className="sr-sample__doc-flag">🇧🇩</div>
        <div className="sr-sample__doc-passport-title">
          <div className="sr-sample__doc-title-line" />
          <div className="sr-sample__doc-sub-line" />
          <div className="sr-sample__doc-sub-line sr-sample__doc-sub-line--narrow" />
        </div>
        <div className="sr-sample__doc-crest" />
      </div>
      <div className="sr-sample__doc-body sr-sample__doc-body--passport">
        <div className="sr-sample__doc-photo sr-sample__doc-photo--passport" />
        <div className="sr-sample__doc-fields">
          {["Surname", "Given Names", "Nationality", "Date of Birth", "Sex", "Passport No."].map(label => (
            <div key={label} className="sr-sample__doc-field sr-sample__doc-field--sm">
              <span className="sr-sample__doc-field-label">{label}</span>
              <div className="sr-sample__doc-field-value sr-sample__doc-field-value--short" />
            </div>
          ))}
        </div>
      </div>
      <div className="sr-sample__doc-mrz">
        <div className="sr-sample__doc-mrz-line" />
        <div className="sr-sample__doc-mrz-line" />
      </div>
    </div>
  );
}

function VisaStampIllustration() {
  return (
    <div className="sr-sample__doc sr-sample__doc--visa" aria-hidden="true">
      <div className="sr-sample__doc-visa-stamp">
        <div className="sr-sample__doc-visa-border">
          <div className="sr-sample__doc-visa-inner">
            <div className="sr-sample__doc-visa-header">
              <div className="sr-sample__doc-title-line sr-sample__doc-title-line--sm" />
              <div className="sr-sample__doc-sub-line" />
            </div>
            <div className="sr-sample__doc-visa-grid">
              {["Type", "Port of Entry", "Valid Until", "Duration", "Entries"].map(label => (
                <div key={label} className="sr-sample__doc-field sr-sample__doc-field--sm">
                  <span className="sr-sample__doc-field-label">{label}</span>
                  <div className="sr-sample__doc-field-value sr-sample__doc-field-value--short" />
                </div>
              ))}
            </div>
            <div className="sr-sample__doc-visa-photo" />
          </div>
        </div>
      </div>
      <div className="sr-sample__doc-visa-note">
        Visa / Residence Permit — Current Country of Residence
      </div>
    </div>
  );
}

function DepartureSealIllustration() {
  return (
    <div className="sr-sample__doc sr-sample__doc--departure" aria-hidden="true">
      <div className="sr-sample__doc-body sr-sample__doc-body--passport">
        <div className="sr-sample__doc-photo sr-sample__doc-photo--passport" />
        <div className="sr-sample__doc-fields">
          {["Surname", "Given Names", "Nationality", "Date of Birth"].map(label => (
            <div key={label} className="sr-sample__doc-field sr-sample__doc-field--sm">
              <span className="sr-sample__doc-field-label">{label}</span>
              <div className="sr-sample__doc-field-value sr-sample__doc-field-value--short" />
            </div>
          ))}
        </div>
      </div>
      <div className="sr-sample__doc-seal-area">
        <div className="sr-sample__doc-seal">
          <div className="sr-sample__doc-seal-outer">
            <div className="sr-sample__doc-seal-inner">
              <span className="sr-sample__doc-seal-text">DEPARTURE</span>
              <div className="sr-sample__doc-seal-date" />
              <span className="sr-sample__doc-seal-text sr-sample__doc-seal-text--sm">BANGLADESH</span>
            </div>
          </div>
        </div>
        <div className="sr-sample__doc-seal-caption">Latest Bangladesh Departure Seal</div>
      </div>
    </div>
  );
}

const ILLUSTRATIONS: Record<SRSample["variant"], React.FC> = {
  "id-card": IdCardIllustration,
  "passport-page": PassportPageIllustration,
  "visa-stamp": VisaStampIllustration,
  "departure-seal": DepartureSealIllustration,
};

// ── Modal ─────────────────────────────────────────────────────────────────────

interface SRSampleModalProps {
  category: SRSampleCategory;
  onClose: () => void;
}

export function SRSampleModal({ category, onClose }: SRSampleModalProps) {
  const { t } = useTranslation("specialRegistration");
  const samples = SR_DOCUMENT_SAMPLES[category];
  const [idx, setIdx] = useState(0);

  // Mobile detection aligned with ResponsiveOverlay breakpoint
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const sample = samples[idx];
  const Illustration = ILLUSTRATIONS[sample.variant];
  const hasMultiple = samples.length > 1;

  const navControls = hasMultiple && (
    <div className="sr-sample__nav">
      <button
        type="button"
        className="sr-sample__nav-btn"
        onClick={() => setIdx(i => Math.max(0, i - 1))}
        disabled={idx === 0}
        aria-label={t("documents.prevSample")}
      >
        <ChevronLeft size={16} /> {t("documents.prevSample")}
      </button>
      <span className="sr-sample__nav-count">{idx + 1} / {samples.length}</span>
      <button
        type="button"
        className="sr-sample__nav-btn"
        onClick={() => setIdx(i => Math.min(samples.length - 1, i + 1))}
        disabled={idx === samples.length - 1}
        aria-label={t("documents.nextSample")}
      >
        {t("documents.nextSample")} <ChevronRight size={16} />
      </button>
    </div>
  );

  const bodyContent = (
    <>
      <Illustration />
      <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
        {t(sample.descriptionKey)}
      </p>
      {navControls}
    </>
  );

  // ── Mobile: ResponsiveOverlay bottom sheet ────────────────────────────────

  if (isMobile) {
    return (
      <ResponsiveOverlay
        open
        onClose={onClose}
        title={t(sample.titleKey)}
        closeLabel={t("documents.closeSample")}
        mobileMaxHeight="90dvh"
        className="sr-sample-sheet"
      >
        <div className="sr-sample-sheet__body">
          {bodyContent}
        </div>
      </ResponsiveOverlay>
    );
  }

  // ── Desktop: MUI Dialog ───────────────────────────────────────────────────

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      aria-labelledby="sr-sample-modal-title"
      PaperProps={{ className: "sr-sample-modal__paper", sx: { borderRadius: "14px", overflow: "hidden" } }}
    >
      <DialogTitle
        id="sr-sample-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--color-border-subtle)",
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          flexShrink: 0,
        }}
      >
        {t(sample.titleKey)}
        <IconButton
          size="small"
          onClick={onClose}
          aria-label={t("documents.closeSample")}
          sx={{ color: "var(--color-text-secondary)", flexShrink: 0, ml: 1 }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent className="sr-sample-modal__content" sx={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {bodyContent}
      </DialogContent>
    </Dialog>
  );
}
