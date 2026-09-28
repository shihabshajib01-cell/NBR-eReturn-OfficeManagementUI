export type SRSampleCategory = "nid" | "passport" | "visa" | "departure";

export interface SRSample {
  titleKey: string;
  descriptionKey: string;
  variant: "id-card" | "passport-page" | "visa-stamp" | "departure-seal";
}

export const SR_DOCUMENT_SAMPLES: Record<SRSampleCategory, SRSample[]> = {
  nid: [
    {
      titleKey: "documents.nid.label",
      descriptionKey: "documents.nid.helper",
      variant: "id-card",
    },
  ],
  passport: [
    {
      titleKey: "documents.passport.label",
      descriptionKey: "documents.passport.helper",
      variant: "passport-page",
    },
  ],
  visa: [
    {
      titleKey: "documents.visa.label",
      descriptionKey: "documents.visa.helper",
      variant: "visa-stamp",
    },
  ],
  departure: [
    {
      titleKey: "documents.departure.label",
      descriptionKey: "documents.departure.helper",
      variant: "departure-seal",
    },
  ],
};
