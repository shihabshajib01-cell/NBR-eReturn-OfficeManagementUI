export type FontId = "inter" | "poppins" | "noto-sans" | "google-sans";

export interface FontConfig {
  id: FontId;
  name: string;
  family: string;
  preview: string;
}

export type FontSizeId = "compact" | "standard" | "large";

export interface FontSizeConfig {
  id: FontSizeId;
  name: string;
  preview: string;
  description: string;
}

export interface FontSizeTokens {
  h1: [string, string];
  h2: [string, string];
  h3: [string, string];
  bodyLg: [string, string];
  bodyMd: [string, string];
  bodySm: [string, string];
  labelMd: [string, string];
  labelSm: [string, string];
  button: [string, string];
  input: [string, string];
  tableHeader: [string, string];
  tableBody: [string, string];
  caption: [string, string];
  badge: [string, string];
  tooltip: [string, string];
  navLabel: [string, string];
}

export const FONTS: Record<FontId, FontConfig> = {
  inter: {
    id: "inter",
    name: "Inter",
    family: "Inter, 'Noto Sans Bengali', 'Noto Sans', sans-serif",
    preview: "The quick brown fox jumps",
  },
  poppins: {
    id: "poppins",
    name: "Poppins",
    family: "Poppins, 'Noto Sans Bengali', 'Noto Sans', sans-serif",
    preview: "The quick brown fox jumps",
  },
  "noto-sans": {
    id: "noto-sans",
    name: "Noto Sans",
    family: "'Noto Sans', 'Noto Sans Bengali', sans-serif",
    preview: "The quick brown fox jumps",
  },
  "google-sans": {
    id: "google-sans",
    name: "Google Sans",
    family: "'DM Sans', 'Google Sans', 'Noto Sans Bengali', 'Noto Sans', sans-serif",
    preview: "The quick brown fox jumps",
  },
};

export const FONT_ORDER: FontId[] = ["inter", "poppins", "noto-sans", "google-sans"];

export const FONT_SIZES: Record<FontSizeId, FontSizeConfig> = {
  compact: {
    id: "compact",
    name: "Compact",
    preview: "Aa",
    description: "Smaller text for dense work",
  },
  standard: {
    id: "standard",
    name: "Standard",
    preview: "Aa",
    description: "Balanced text for daily use",
  },
  large: {
    id: "large",
    name: "Large",
    preview: "Aa",
    description: "Larger text for easier reading",
  },
};

export const FONT_SIZE_ORDER: FontSizeId[] = ["compact", "standard", "large"];

// [size, line-height] pairs
// Updated to match reference design typography (Inter font, modern sizing)
export const FONT_SIZE_TOKENS: Record<FontSizeId, FontSizeTokens> = {
  compact: {
    h1: ["42px", "52px"],        // Reference: 48px (scaled down)
    h2: ["32px", "40px"],        // Reference: 40px (scaled down)
    h3: ["26px", "34px"],        // Reference: 34px (scaled down)
    bodyLg: ["18px", "27px"],    // Reference: 20px (scaled down)
    bodyMd: ["15px", "23px"],    // Reference: 18px (scaled down)
    bodySm: ["14px", "20px"],    // Reference: 16px (scaled down)
    labelMd: ["14px", "20px"],   // Reference: 16px (scaled down)
    labelSm: ["12px", "16px"],   // Reference: 14px (scaled down)
    button: ["18px", "26px"],    // Reference: 20px (scaled down)
    input: ["14px", "22px"],     // Reference: 16px (scaled down)
    tableHeader: ["12px", "18px"],
    tableBody: ["13px", "19px"],
    caption: ["11px", "15px"],
    badge: ["11px", "15px"],
    tooltip: ["12px", "16px"],
    navLabel: ["12px", "1.25"],
  },
  standard: {
    h1: ["48px", "1"],           // Reference: 48px Bold
    h2: ["40px", "1"],           // Reference: 40px Semi Bold
    h3: ["34px", "37px"],        // Reference: 34px Bold
    bodyLg: ["20px", "1.5"],     // Reference: 20px Regular
    bodyMd: ["18px", "27px"],    // Reference: 18px Regular
    bodySm: ["16px", "24px"],    // Reference: 16px Regular/Medium
    labelMd: ["16px", "20px"],   // Reference: 16px Medium
    labelSm: ["14px", "20px"],   // Reference: 14px Medium
    button: ["20px", "28px"],    // Reference: 20px Semi Bold
    input: ["16px", "20px"],     // Reference: 16px Regular
    tableHeader: ["14px", "20px"],
    tableBody: ["14px", "20px"],
    caption: ["12px", "16px"],
    badge: ["12px", "16px"],
    tooltip: ["12px", "16px"],
    navLabel: ["14px", "1.25"],
  },
  large: {
    h1: ["56px", "1"],           // Reference: 48px (scaled up)
    h2: ["48px", "1"],           // Reference: 40px (scaled up)
    h3: ["40px", "44px"],        // Reference: 34px (scaled up)
    bodyLg: ["24px", "1.5"],     // Reference: 20px (scaled up)
    bodyMd: ["20px", "30px"],    // Reference: 18px (scaled up)
    bodySm: ["18px", "27px"],    // Reference: 16px (scaled up)
    labelMd: ["18px", "24px"],   // Reference: 16px (scaled up)
    labelSm: ["16px", "22px"],   // Reference: 14px (scaled up)
    button: ["22px", "32px"],    // Reference: 20px (scaled up)
    input: ["18px", "24px"],     // Reference: 16px (scaled up)
    tableHeader: ["16px", "24px"],
    tableBody: ["16px", "24px"],
    caption: ["14px", "20px"],
    badge: ["14px", "20px"],
    tooltip: ["14px", "20px"],
    navLabel: ["16px", "1.25"],
  },
};
