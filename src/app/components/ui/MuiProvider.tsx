import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

const _origError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  if (args.some(a => typeof a === "string" && (a.includes("data-fg") || a.includes("data-fgid")))) return;
  _origError(...args);
};

const muiTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid var(--color-border)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-primary)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { marginTop: "4px" },
        list: { padding: "4px" },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          color: "var(--color-text-primary)",
          borderRadius: "var(--radius-sm)",
          minHeight: "36px",
          "&:hover": {
            backgroundColor: "var(--color-primary-alpha-6)",
            color: "var(--color-primary)",
          },
          "&.Mui-selected": {
            backgroundColor: "var(--color-primary-alpha-10)",
            color: "var(--color-primary)",
            fontWeight: 600,
            "&:hover": { backgroundColor: "var(--color-primary-alpha-12)" },
          },
          "&.Mui-focused": { backgroundColor: "var(--color-primary-alpha-6)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-primary)",
          fontSize: "14px",
        },
        notchedOutline: {
          borderColor: "var(--color-border)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--color-text-secondary)",
          fontSize: "14px",
          "&.Mui-focused": { color: "var(--color-primary)" },
          "&.Mui-error": { color: "var(--color-error)" },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          marginLeft: 0,
          color: "var(--color-text-secondary)",
          "&.Mui-error": { color: "var(--color-error)" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: "var(--color-text-secondary)" },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          border: "1px solid var(--color-border)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiCssBaseline: { styleOverrides: "" },
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.04)",
    "0 2px 6px rgba(0,0,0,0.06)",
    "0 4px 12px rgba(0,0,0,0.08)",
    "0 4px 16px rgba(0,0,0,0.08)",
    ...Array(20).fill("0 4px 20px rgba(0,0,0,0.10)"),
  ] as Parameters<typeof createTheme>[0]["shadows"],
});

export function MuiProvider({ children, ...rest }: { children: ReactNode; [key: string]: unknown }) {
  void rest;
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
