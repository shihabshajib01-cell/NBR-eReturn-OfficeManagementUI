import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/max";

export type { CountryCode };

export interface CountryOption {
  iso2: CountryCode;
  localizedName: string;
  englishName: string;
  dialCode: string;
  flag: string;
}

function isoToFlag(iso2: string): string {
  return [...iso2.toUpperCase()]
    .map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function getDisplayName(iso2: string, language: string): string {
  try {
    const dn = new Intl.DisplayNames([language], { type: "region" });
    return dn.of(iso2) ?? iso2;
  } catch {
    return iso2;
  }
}

function getEnglishName(iso2: string): string {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    return dn.of(iso2) ?? iso2;
  } catch {
    return iso2;
  }
}

export function buildCountryOptions(language: "en" | "bn"): CountryOption[] {
  const codes = getCountries();
  const collator = new Intl.Collator(language === "bn" ? "bn" : "en");

  const options: CountryOption[] = codes.map(iso2 => {
    const localizedName = getDisplayName(iso2, language === "bn" ? "bn" : "en") || getEnglishName(iso2) || iso2;
    const englishName = getEnglishName(iso2) || iso2;
    let dialCode = "";
    try {
      dialCode = "+" + getCountryCallingCode(iso2);
    } catch {
      dialCode = "";
    }
    return {
      iso2,
      localizedName,
      englishName,
      dialCode,
      flag: isoToFlag(iso2),
    };
  });

  return options.sort((a, b) => collator.compare(a.localizedName, b.localizedName));
}

export function findCountryOption(
  iso2: CountryCode | "",
  language: "en" | "bn"
): CountryOption | null {
  if (!iso2) return null;
  const all = buildCountryOptions(language);
  return all.find(c => c.iso2 === iso2) ?? null;
}

export function countryNameToIso2(englishName: string): CountryCode | "" {
  const all = buildCountryOptions("en");
  const match = all.find(
    c => c.englishName.toLowerCase() === englishName.toLowerCase()
  );
  return match ? match.iso2 : "";
}
