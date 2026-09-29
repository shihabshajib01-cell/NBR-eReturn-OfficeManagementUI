import type { TableRow } from "../modulePageUtils";

export interface AuditExplanationSection {
  title: string;
  items: { label: string; value: string }[];
}

export interface AuditExplanation {
  title: string;
  category: string;
  definition: string;
  effect: string;
  nextStep?: string;
  important?: string;
  sections: AuditExplanationSection[];
}

type Localized = { en: string; bn: string };
type Lang = "en" | "bn";

const l = (en: string, bn: string): Localized => ({ en, bn });
const pick = (value: Localized, lang: Lang) => value[lang] || value.en;
const text = (value: unknown) => String(value ?? "—");

const COVERAGE: Record<string, {
  title: Localized;
  definition: Localized;
  available: Localized;
  eligible: string;
  unavailable: string;
}> = {
  DT0: {
    title: l("DT0 — Basic return coverage", "DT0 — বেসিক রিটার্ন কভারেজ"),
    definition: l("Return (Sl. 1–26) and TDS data are available. Only rules that do not require wealth, expenditure, history or external data may run.", "Return (Sl. 1–26) ও TDS data আছে। Wealth, expenditure, history বা external data দরকার এমন rule এখানে চলবে না।"),
    available: l("Return + TDS", "Return + TDS"),
    eligible: "R-A2, R-A3, F0, F1 (partial), F5 when its trigger is established",
    unavailable: "R-A1, R-B1, R-B2, R-C1–R-C4 and other checks requiring asset/expenditure data",
  },
  DT1: {
    title: l("DT1 — Wealth and expenditure coverage", "DT1 — Wealth ও expenditure কভারেজ"),
    definition: l("The return is supplemented by asset, liability, expenditure, receipt and previous-net-wealth information, allowing funds-flow reconciliation.", "Return-এর সাথে asset, liability, expenditure, receipt ও previous-net-wealth data আছে, তাই funds-flow reconciliation চালানো যায়।"),
    available: l("Return + TDS + IT-10B / IT-10BB totals", "Return + TDS + IT-10B / IT-10BB totals"),
    eligible: "R-A1, R-C1, R-C3, R-C4, F1, F2",
    unavailable: "R-B1, R-B2, R-C2, R-D1, R-D2 without linked history; E-group without legally permitted external data",
  },
  "DT1+H": {
    title: l("DT1+H — Coverage with linked history", "DT1+H — Linked history সহ কভারেজ"),
    definition: l("DT1 information is available together with one or more linked prior-year returns, enabling year-on-year and behavioural checks.", "DT1 data-এর সাথে আগের বছরের linked return আছে, তাই year-on-year ও behavioural check চালানো যায়।"),
    available: l("DT1 + HIST", "DT1 + HIST"),
    eligible: "R-B1, R-B2, R-C2, R-D1, R-D2, R-D3 in addition to DT1-eligible checks",
    unavailable: "E-group without legally permitted external data",
  },
  DT2: {
    title: l("DT2 — Component-level coverage", "DT2 — Component-level কভারেজ"),
    definition: l("Detailed expenditure, asset, Schedule 4/5 and source-coded TDS components are available for more specific checks and gap-driver analysis.", "Detailed expenditure, asset, Schedule 4/5 ও source-coded TDS component আছে, তাই আরও নির্দিষ্ট check ও gap-driver analysis করা যায়।"),
    available: l("Component-level IT-10BB, asset, Schedule 4/5 and source-coded TDS data", "Component-level IT-10BB, asset, Schedule 4/5 ও source-coded TDS data"),
    eligible: "F3, F4, more precise R-A3 and gap-driver analysis, plus lower-tier eligible rules",
    unavailable: "E-group without legally permitted external data",
  },
  DT3: {
    title: l("DT3 — External cross-check coverage", "DT3 — External cross-check কভারেজ"),
    definition: l("Legally permitted external data is available in addition to internal return data, enabling external cross-check rules.", "Internal return data-এর পাশাপাশি আইনগতভাবে অনুমোদিত external data আছে, তাই external cross-check rule চালানো যায়।"),
    available: l("Internal return data + legally permitted external sources", "Internal return data + আইনগতভাবে অনুমোদিত external source"),
    eligible: "R-E1, R-E2, R-E3 plus all otherwise eligible internal rules",
    unavailable: "No additional rule family is excluded solely by coverage",
  },
};

const RISK: Record<string, { definition: Localized; basis: Localized; handling: Localized }> = {
  Low: {
    definition: l("Routine review priority. Low is not a declaration that the taxpayer is compliant.", "Routine review priority। Low মানে taxpayer compliant—এমন সিদ্ধান্ত নয়।"),
    basis: l("No signal fired, or only one weak signal, when the relevant data is actually available.", "প্রাসঙ্গিক data সত্যিই available থাকলে কোনো signal fire করেনি, অথবা শুধু একটি weak signal আছে।"),
    handling: l("Routine queue.", "Routine queue।"),
  },
  Medium: {
    definition: l("Standard human-review priority.", "Standard human-review priority।"),
    basis: l("One meaningful signal, or two or more weaker non-overlapping signals.", "একটি meaningful signal, অথবা দুই বা ততোধিক weak কিন্তু non-overlapping signal।"),
    handling: l("Standard review.", "Standard review।"),
  },
  High: {
    definition: l("Higher review priority, not a finding or accusation.", "উচ্চতর review priority; Finding বা accusation নয়।"),
    basis: l("One strong signal, or two or more meaningful signals that remain genuinely independent after deduplication.", "একটি strong signal, অথবা deduplication-এর পর সত্যিকারের independent দুই বা ততোধিক meaningful signal।"),
    handling: l("Proposed target: 3 working days; formal approval is still required.", "প্রস্তাবিত target: ৩ working day; formal approval এখনো প্রয়োজন।"),
  },
  "Very High": {
    definition: l("Highest review priority in this framework, still not a finding or tax determination.", "এই framework-এর সর্বোচ্চ review priority; তবুও Finding বা tax determination নয়।"),
    basis: l("A strong signal plus an independent meaningful-or-stronger signal from a different evidence family.", "একটি strong signal-এর সাথে ভিন্ন evidence family থেকে independent meaningful-or-stronger signal।"),
    handling: l("Proposed target: 1 working day; formal approval is still required.", "প্রস্তাবিত target: ১ working day; formal approval এখনো প্রয়োজন।"),
  },
  "Not determined": {
    definition: l("The framework does not have enough eligible, usable data to assign a substantive Risk Level.", "Substantive Risk Level নির্ধারণের জন্য framework-এর কাছে পর্যাপ্ত eligible ও usable data নেই।"),
    basis: l("Incomplete or invalid data must remain visible as a coverage/data-quality issue rather than being converted to Low risk.", "Incomplete বা invalid data-কে Low risk-এ রূপান্তর করা যাবে না; coverage/data-quality issue হিসেবে দৃশ্যমান রাখতে হবে।"),
    handling: l("Resolve the data-quality or coverage limitation first.", "আগে data-quality বা coverage limitation সমাধান করুন।"),
  },
};

const FLAGS: Record<string, { name: Localized; check: Localized; source: string; dependency: Localized }> = {
  F0: { name:l("Form arithmetic consistency","Form arithmetic consistency"), check:l("Checks the form's own arithmetic totals and internal calculations.","Form-এর নিজস্ব arithmetic total ও internal calculation মেলে কি না তা পরীক্ষা করে।"), source:"Return + IT-10B", dependency:l("Deterministic; no external dependency.","সম্পূর্ণ deterministic; external dependency নেই।") },
  F1: { name:l("Return ↔ wealth-statement consistency","Return ↔ wealth-statement consistency"), check:l("Checks whether Return Sl. 11 / Sl. 26 agree with IT-10B 1(a) / 1(b).","Return Sl. 11 / Sl. 26 এবং IT-10B 1(a) / 1(b) একে অন্যের সাথে মেলে কি না।"), source:"Return ↔ IT-10B", dependency:l("Both statements must be filed (DT1).","দুটি statement-ই দাখিল থাকতে হবে (DT1)।") },
  F2: { name:l("Surcharge consistency control","Surcharge consistency control"), check:l("Checks a high net-wealth condition against Return Sl. 17(a).","High net-wealth condition-এর সাথে Return Sl. 17(a) consistency পরীক্ষা করে।"), source:"IT-10B 5 ↔ Return 17(a)", dependency:l("The threshold and base require Finance Act confirmation.","Threshold ও base-এর জন্য Finance Act confirmation প্রয়োজন।") },
  F3: { name:l("Business drawing / capital consistency","Business drawing / capital consistency"), check:l("Checks Schedule 4 Drawing against IT-10BB and Closing Capital against IT-10B 8(a).","Schedule 4 Drawing বনাম IT-10BB এবং Closing Capital বনাম IT-10B 8(a) consistency পরীক্ষা করে।"), source:"Schedule 4 ↔ IT-10B / IT-10BB", dependency:l("Business return with DT2 component data.","Business return এবং DT2 component data প্রয়োজন।") },
  F4: { name:l("Investment reflection control","Investment reflection control"), check:l("Checks whether Schedule 5 Total Investment is reflected in the relevant financial asset or expenditure data.","Schedule 5 Total Investment সংশ্লিষ্ট financial asset বা expenditure data-তে reflect হয়েছে কি না।"), source:"Schedule 5 ↔ IT-10B 8(f)", dependency:l("DT2 component data; life-insurance premium is not treated as an asset.","DT2 component data; life-insurance premium asset হিসেবে ধরা হয় না।") },
  F5: { name:l("Required-statement control","Required-statement control"), check:l("Indicates that IT-10B / IT-10BB appears required but the statement is missing.","IT-10B / IT-10BB প্রয়োজন বলে মনে হলেও statement নেই—এটি নির্দেশ করে।"), source:"Form-described filing trigger", dependency:l("The source framework leaves the evidence for establishing this trigger unresolved.","এই trigger প্রতিষ্ঠার evidence কোথা থেকে আসবে—source framework-এ তা অমীমাংসিত।") },
};

const SIGNALS: Record<string, { name: Localized; family: Localized; condition: Localized; strength: string; requires: string; legitimate: Localized; evidence: Localized }> = {
  "R-A1": { name:l("Zero income + declared asset","Zero income + declared asset"), family:l("A — Basic anomaly","A — Basic anomaly"), condition:l("Sl. 11 = 0, Sl. 16 = 0 and IT-10B 10 > 0.","Sl. 11 = 0, Sl. 16 = 0 এবং IT-10B 10 > 0।"), strength:"weak → strong", requires:"RET + ASSET (DT1)", legitimate:l("Retirement, homemaker/student status, loss year or joint ownership may explain it.","Retirement, homemaker/student status, loss year বা joint ownership বৈধ ব্যাখ্যা হতে পারে।"), evidence:l("Source of assets, income-type evidence and joint-ownership documents where relevant.","Asset source, income-type evidence এবং প্রযোজ্য হলে joint-ownership document।") },
  "R-A2": { name:l("Income declared, tax payable zero","Income declared, tax payable zero"), family:l("A — Basic anomaly","A — Basic anomaly"), condition:l("Sl. 11 > 0 while Sl. 16 = 0.","Sl. 11 > 0 কিন্তু Sl. 16 = 0।"), strength:"weak → meaningful", requires:"RET", legitimate:l("Threshold, special category, rebate, exempt income or minimum-tax inapplicability may explain it.","Threshold, special category, rebate, exempt income বা minimum-tax অপ্রযোজ্যতা ব্যাখ্যা হতে পারে।"), evidence:l("Rebate basis and exemption / special-category evidence.","Rebate basis এবং exemption / special-category evidence।") },
  "R-A3": { name:l("TDS-implied income floor","TDS-implied income floor"), family:l("A — Basic anomaly","A — Basic anomaly"), condition:l("Source-wise declared income is below the gross income implied by TDS and the applicable rate.","Source-wise declared income, TDS ও applicable rate থেকে implied gross income-এর নিচে।"), strength:"meaningful", requires:"RET + TDS; precise source code at DT2", legitimate:l("Wrong TIN, final-settlement income, multiple rates or period mismatch may explain it.","Wrong TIN, final-settlement income, multiple rate বা period mismatch ব্যাখ্যা হতে পারে।"), evidence:l("TDS certificate, source/section code and applicable-rate basis.","TDS certificate, source/section code এবং applicable-rate basis।") },
  "R-B1": { name:l("Large asset growth","Large asset growth"), family:l("B — Year-on-year change","B — Year-on-year change"), condition:l("Assets increase by a configured percentage or amount compared with the prior year.","আগের বছরের তুলনায় asset configured percentage বা amount-এর বেশি বাড়ে।"), strength:"meaningful", requires:"ASSET + HIST", legitimate:l("Loan-funded purchase, inheritance, gift or reinvestment of sale proceeds may explain it.","Loan-funded purchase, inheritance, gift বা sale proceeds reinvestment ব্যাখ্যা হতে পারে।"), evidence:l("Acquisition documents/value and source of financing.","Acquisition document/value এবং financing source।") },
  "R-B2": { name:l("Income falls while assets grow","Income falls while assets grow"), family:l("B — Year-on-year change","B — Year-on-year change"), condition:l("Income falls materially while assets rise in the same year.","একই বছরে income উল্লেখযোগ্যভাবে কমে কিন্তু asset বাড়ে।"), strength:"meaningful", requires:"RET + ASSET + HIST", legitimate:l("Retirement plus gratuity, job loss plus inheritance and similar events may explain it.","Retirement + gratuity, job loss + inheritance ইত্যাদি ব্যাখ্যা হতে পারে।"), evidence:l("Employment/business-change and income-reduction evidence.","Employment/business-change এবং income-reduction evidence।") },
  "R-C1": { name:l("Reconciliation gap","Reconciliation gap"), family:l("C — Funds-flow reconciliation","C — Funds-flow reconciliation"), condition:l("The absolute difference between independently declared assets and funds-flow closing wealth exceeds materiality.","Independently declared asset ও funds-flow closing wealth-এর absolute difference materiality অতিক্রম করে।"), strength:"meaningful → strong", requires:"Complete IT-10B set (DT1)", legitimate:l("Undeclared but legitimate gift, valuation-basis mismatch, accounting error or genuine loss may explain it.","Undeclared কিন্তু legitimate gift, valuation-basis mismatch, accounting error বা genuine loss ব্যাখ্যা হতে পারে।"), evidence:l("Gap-driver documents and bank statement for the relevant period.","Gap-driver document এবং সংশ্লিষ্ট সময়ের bank statement।") },
  "R-C2": { name:l("Multi-year cumulative gap","Multi-year cumulative gap"), family:l("C — Funds-flow reconciliation","C — Funds-flow reconciliation"), condition:l("A material cumulative gap appears across 3–5 years, or the gap persists in the same direction for at least two years.","৩–৫ বছরে material cumulative gap, অথবা অন্তত দুই বছর একই দিকে gap থাকে।"), strength:"strong", requires:"DT1 + HIST (multiple years)", legitimate:l("Consistent valuation error or long-term family support may explain it.","Consistent valuation error বা long-term family support ব্যাখ্যা হতে পারে।"), evidence:l("Multi-year reconciliation and explanation of consistent valuation method.","Multi-year reconciliation এবং consistent valuation method-এর ব্যাখ্যা।") },
  "R-C3": { name:l("Opening wealth continuity break","Opening wealth continuity break"), family:l("C — Funds-flow reconciliation","C — Funds-flow reconciliation"), condition:l("Current IT-10B opening wealth does not equal the previous year's closing net wealth.","Current IT-10B opening wealth আগের বছরের closing net wealth-এর সাথে মেলে না।"), strength:"meaningful", requires:"PREVNW + HIST", legitimate:l("Data migration, a revised prior return or valuation correction may explain it.","Data migration, revised prior return বা valuation correction ব্যাখ্যা হতে পারে।"), evidence:l("Previous return/IT-10B and migration or revision evidence.","Previous return/IT-10B এবং migration বা revision evidence।") },
  "R-C4": { name:l("Implausibly low expenditure","Implausibly low expenditure"), family:l("C — Funds-flow reconciliation","C — Funds-flow reconciliation"), condition:l("Household expenditure is below a configured floor or drops sharply despite an otherwise stable household.","Household expenditure configured floor-এর নিচে, অথবা household একই থাকলেও তীব্রভাবে কমে।"), strength:"meaningful", requires:"EXP (+ HIST)", legitimate:l("Another household member pays expenses, rural living or long periods abroad may explain it.","অন্য household member খরচ বহন করা, rural living বা দীর্ঘ সময় বিদেশে থাকা ব্যাখ্যা হতে পারে।"), evidence:l("Household composition, who bears expenses and residence evidence.","Household composition, কে খরচ বহন করেন এবং residence evidence।") },
  "R-D1": { name:l("Persistent zero income / zero tax","Persistent zero income / zero tax"), family:l("D — Behavioural pattern","D — Behavioural pattern"), condition:l("Zero income or zero tax repeats for at least three years under the configured condition.","Configured condition অনুযায়ী অন্তত তিন বছর zero income বা zero tax পুনরাবৃত্ত হয়।"), strength:"weak → meaningful", requires:"RET + HIST", legitimate:l("Retirement, homemaker status or remaining below threshold may explain it.","Retirement, homemaker status বা threshold-এর নিচে থাকা ব্যাখ্যা হতে পারে।"), evidence:l("Evidence of income type and source.","Income type ও source-এর evidence।") },
  "R-D2": { name:l("Alternating declaration pattern","Alternating declaration pattern"), family:l("D — Behavioural pattern","D — Behavioural pattern"), condition:l("A multi-year pattern alternates low income with large assets / low expenditure before returning to the prior pattern.","Multi-year pattern-এ low income-এর সাথে large asset / low expenditure দেখা যায়, পরে আগের pattern-এ ফিরে যায়।"), strength:"meaningful", requires:"HIST (3+ years)", legitimate:l("Seasonal or project-based income may explain it.","Seasonal বা project-based income ব্যাখ্যা হতে পারে।"), evidence:l("Multi-year income and asset continuity evidence.","Multi-year income ও asset continuity evidence।") },
  "R-D3": { name:l("Amendment after trigger","Amendment after trigger"), family:l("D — Behavioural pattern","D — Behavioural pattern"), condition:l("A revised return is filed within the configured period after a flag or review is opened.","Flag বা review খোলার পর configured period-এর মধ্যে revised return দাখিল হয়।"), strength:"weak → meaningful", requires:"HIST + event log", legitimate:l("A simple error corrected after notice may explain it.","Notice পাওয়ার পর simple error correction ব্যাখ্যা হতে পারে।"), evidence:l("Reason for amendment and supporting documents.","Amendment-এর কারণ ও supporting document।") },
  "R-E1": { name:l("Payroll / third-party income mismatch","Payroll / third-party income mismatch"), family:l("E — External cross-check","E — External cross-check"), condition:l("A legally permitted external source indicates more income than was declared.","আইনগতভাবে অনুমোদিত external source declared income-এর চেয়ে বেশি income নির্দেশ করে।"), strength:"strong", requires:"EXT (legal basis)", legitimate:l("Employer reporting error, wrong TIN or period mismatch may explain it.","Employer reporting error, wrong TIN বা period mismatch ব্যাখ্যা হতে পারে।"), evidence:l("Employer record/TIN linkage and salary statement or TDS certificate.","Employer record/TIN linkage এবং salary statement বা TDS certificate।") },
  "R-E2": { name:l("Asset registry mismatch","Asset registry mismatch"), family:l("E — External cross-check","E — External cross-check"), condition:l("A legally permitted registry indicates assets not declared, or at a higher amount than declared.","আইনগতভাবে অনুমোদিত registry-তে declared-এর বাইরে বা বেশি asset দেখা যায়।"), strength:"strong", requires:"EXT (legal basis)", legitimate:l("Joint ownership, cost-versus-registered value or stale registry data may explain it.","Joint ownership, cost বনাম registered value বা stale registry data ব্যাখ্যা হতে পারে।"), evidence:l("Ownership share/documents and registry extract with date.","Ownership share/document এবং date-সহ registry extract।") },
  "R-E3": { name:l("VAT turnover mismatch","VAT turnover mismatch"), family:l("E — External cross-check","E — External cross-check"), condition:l("VAT turnover is inconsistent with declared business income.","VAT turnover declared business income-এর সাথে অসামঞ্জস্যপূর্ণ।"), strength:"strong", requires:"EXT (legal basis)", legitimate:l("Low margin, period mismatch or group registration may explain it.","Low margin, period mismatch বা group registration ব্যাখ্যা হতে পারে।"), evidence:l("VAT return/turnover detail and BIN ↔ TIN linkage evidence.","VAT return/turnover detail এবং BIN ↔ TIN linkage evidence।") },
};

const WORKFLOW: Record<string, { definition: Localized; next: Localized }> = {
  "Not Started": { definition:l("No formal audit case has been opened for this return in this prototype workspace.","এই return-এর জন্য prototype workspace-এ formal audit case খোলা হয়নি।"), next:l("The officer may inspect the return and, once the formal selection policy is defined, start an audit with a recorded reason.","Officer return inspect করতে পারবেন; formal selection policy নির্ধারিত হলে recorded reason দিয়ে audit শুরু করা যাবে।") },
  Assigned: { definition:l("The case is assigned and waiting for the caseworker to begin verification.","Case assigned হয়েছে এবং caseworker verification শুরু করবেন।"), next:l("Open the case and validate identity, return version, data snapshot and source data.","Case খুলে identity, return version, data snapshot ও source data validate করুন।") },
  Verifying: { definition:l("Signal-by-signal verification is in progress.","Signal-by-signal verification চলছে।"), next:l("Verify each fired signal against linked evidence and record a reason.","প্রতিটি fired signal linked evidence দিয়ে verify করে reason record করুন।") },
  "Evidence Pending": { definition:l("The case is waiting for requested evidence.","Case requested evidence-এর অপেক্ষায় আছে।"), next:l("Resume verification when the requested evidence is available.","Requested evidence পাওয়া গেলে verification আবার শুরু করুন।") },
  "Ready for Review": { definition:l("Caseworker verification is complete enough to move to supervisory review.","Caseworker verification supervisory review-এ যাওয়ার জন্য প্রস্তুত।"), next:l("Submit the specific signal/evidence trail for second review.","Specific signal/evidence trail second review-এ submit করুন।") },
  "Second Review": { definition:l("A supervising reviewer is examining the verification trail and Finding basis.","Supervising reviewer verification trail ও Finding basis পরীক্ষা করছেন।"), next:l("Reviewer must name the signal and evidence reviewed, then sign off or request rework.","Reviewer-কে reviewed signal ও evidence উল্লেখ করে sign off বা request rework করতে হবে।") },
  "Rework Requested": { definition:l("The reviewer returned the case for additional or corrected verification.","Reviewer additional বা corrected verification-এর জন্য case ফেরত পাঠিয়েছেন।"), next:l("Address the stated review gap and resubmit the specific verification trail.","Review gap সমাধান করে specific verification trail আবার submit করুন।") },
  Closed: { definition:l("The case has been closed with a recorded reason consistent with the verification outcome.","Verification outcome-এর সাথে সামঞ্জস্যপূর্ণ recorded reason দিয়ে case বন্ধ হয়েছে।"), next:l("The full history remains in the append-only audit trail.","সম্পূর্ণ history append-only audit trail-এ থাকবে।") },
};

function contextSection(row: TableRow, fields: [string, string][]): AuditExplanationSection {
  return {
    title: "For this record",
    items: fields
      .filter(([key]) => row[key] !== undefined && row[key] !== null && row[key] !== "")
      .map(([key, label]) => ({ label, value: text(row[key]) })),
  };
}

function signalsFrom(value: string): string[] {
  return Array.from(new Set(value.match(/R-[A-E]\d/g) ?? []));
}

function flagsFrom(value: string): string[] {
  return Array.from(new Set(value.match(/F[0-5]/g) ?? []));
}

export function resolveAuditExplanation(
  field: string,
  rawValue: unknown,
  row: TableRow,
  language?: string,
): AuditExplanation | null {
  const lang: Lang = language?.toLowerCase().startsWith("bn") ? "bn" : "en";
  const value = text(rawValue);

  if (field === "candidate_record") {
    const taxpayerName = text(row.taxpayer_name);
    const riskLevel = text(row.risk_level);
    const coverageTier = text(row.coverage_tier);
    const dataQuality = text(row.data_quality);
    const signalIds = signalsFrom(text(row.signals));
    const flagIds = flagsFrom(text(row.control_flags));
    const risk = RISK[riskLevel];
    const coverage = COVERAGE[coverageTier];

    const dataQualityExplanation = dataQuality.toLowerCase().includes("invalid")
      ? pick(l("One or more values are unusable for affected checks. Invalid values must not be silently converted to zero.", "এক বা একাধিক value affected check-এর জন্য unusable। Invalid value নীরবে zero করা যাবে না।"), lang)
      : dataQuality.toLowerCase().includes("incomplete")
        ? pick(l("One or more required values are missing. Missing values remain missing rather than being treated as zero.", "এক বা একাধিক required value missing। Missing value-কে zero ধরা হবে না।"), lang)
        : pick(l("The available values passed the current data-quality gate for the checks shown.", "Available value current data-quality gate pass করেছে।"), lang);

    const explanationSections: AuditExplanationSection[] = [
      {
        title: pick(l("Candidate information", "Candidate information"), lang),
        items: [
          ["Taxpayer", taxpayerName],
          ["TIN", text(row.tin)],
          ["Return ID", text(row.return_id)],
          ["Assessment Year", text(row.assessment_year)],
          ["Return Version", text(row.return_version)],
          ["Circle", text(row.circle)],
        ].filter(([, itemValue]) => itemValue !== "—").map(([label, itemValue]) => ({ label, value:itemValue })),
      },
      {
        title: pick(l("Screening context", "Screening context"), lang),
        items: [
          ["Data Quality", dataQuality],
          ["Coverage Tier", coverageTier],
          ["Available data", text(row.available_data)],
          ["Risk Level", riskLevel],
          ["Signals", text(row.signals)],
          ["Control Flags", text(row.control_flags)],
          ["Audit state", text(row.audit_state)],
          ["Reason / basis", text(row.reason_code)],
        ].filter(([, itemValue]) => itemValue !== "—").map(([label, itemValue]) => ({ label, value:itemValue })),
      },
      {
        title: pick(l("Data readiness explanation", "Data readiness explanation"), lang),
        items: [
          { label: pick(l("Data Quality", "Data Quality"), lang), value:dataQualityExplanation },
          ...(coverage ? [{
            label: coverageTier,
            value: `${pick(coverage.definition, lang)} ${pick(l("Available:", "Available:"), lang)} ${pick(coverage.available, lang)}.`,
          }] : []),
        ],
      },
      ...(risk ? [{
        title: pick(l("Risk Level explanation", "Risk Level explanation"), lang),
        items: [
          { label:riskLevel, value:`${pick(risk.definition, lang)} ${pick(risk.basis, lang)} ${pick(l("Handling:", "Handling:"), lang)} ${pick(risk.handling, lang)}` },
        ],
      }] : []),
      ...(signalIds.length ? [{
        title: pick(l("Risk signal explanations", "Risk signal explanations"), lang),
        items: signalIds.map((id) => {
          const signal = SIGNALS[id];
          return {
            label:`${id} · ${pick(signal.name, lang)}`,
            value:`${pick(signal.condition, lang)} ${pick(l("Strength:", "Strength:"), lang)} ${signal.strength}. ${pick(l("Requires:", "Requires:"), lang)} ${signal.requires}. ${pick(l("Evidence:", "Evidence:"), lang)} ${pick(signal.evidence, lang)}`,
          };
        }),
      }] : []),
      ...(flagIds.length ? [{
        title: pick(l("Control flag explanations", "Control flag explanations"), lang),
        items: flagIds.map((id) => {
          const flag = FLAGS[id];
          return {
            label:`${id} · ${pick(flag.name, lang)}`,
            value:`${pick(flag.check, lang)} ${pick(l("Source:", "Source:"), lang)} ${flag.source}. ${pick(flag.dependency, lang)}`,
          };
        }),
      }] : []),
    ].filter((section) => section.items.length > 0);

    return {
      title: taxpayerName,
      category: pick(l("Audit candidate preview", "Audit candidate preview"), lang),
      definition: pick(
        l("This is the taxpayer's current screening context at Candidate Preview. It combines the record details with explanations of the risk, coverage and control concepts shown.", "এটি Candidate Preview-এ taxpayer-এর current screening context। এখানে record detail-এর সাথে দেখানো risk, coverage ও control concept-এর explanation একসাথে আছে।"),
        lang,
      ),
      effect: pick(
        l("The record has reached Candidate Preview after the selected population, readiness, criteria and funnel steps. This does not create a Finding, accusation or tax determination.", "Selected population, readiness, criteria ও funnel step-এর পর record Candidate Preview-এ এসেছে। এটি Finding, accusation বা tax determination তৈরি করে না।"),
        lang,
      ),
      nextStep: pick(
        l("Keep the candidate or exclude it with a recorded reason, then continue to final review.", "Candidate রাখুন অথবা recorded reason দিয়ে exclude করুন, তারপর final review-এ যান।"),
        lang,
      ),
      important: pick(
        l("TIN remains masked in this preview. Risk Level is a review priority, and Control Flags remain separate from substantive Risk Signals.", "এই preview-এ TIN masked থাকে। Risk Level review priority, এবং Control Flag substantive Risk Signal থেকে আলাদা থাকে।"),
        lang,
      ),
      sections: explanationSections,
    };
  }

  if (field === "coverage_tier" && COVERAGE[value]) {
    const c = COVERAGE[value];
    return {
      title: pick(c.title, lang),
      category: pick(l("Coverage / Data Tier", "Coverage / Data Tier"), lang),
      definition: pick(c.definition, lang),
      effect: pick(l("Coverage controls which rules are eligible to run. It never becomes a Risk Level by itself.", "Coverage কোন rule চালানোর যোগ্য তা নির্ধারণ করে। এটি নিজে কখনো Risk Level হয়ে যায় না।"), lang),
      nextStep: pick(l("Review unavailable data before interpreting a low-visibility case.", "Low-visibility case interpret করার আগে unavailable data review করুন।"), lang),
      important: pick(l("Low visibility is not the same as Low risk.", "Low visibility এবং Low risk এক জিনিস নয়।"), lang),
      sections: [
        { title: pick(l("Tier capability", "Tier capability"), lang), items: [
          { label: pick(l("Available data", "Available data"), lang), value: pick(c.available, lang) },
          { label: pick(l("Eligible rules", "Eligible rules"), lang), value: c.eligible },
          { label: pick(l("Unavailable rules", "Unavailable rules"), lang), value: c.unavailable },
        ]},
        contextSection(row, [["return_id","Return ID"],["circle","Circle"],["data_quality","Data Quality"],["signals","Signals"],["risk_level","Risk Level"]]),
      ].filter(s => s.items.length > 0),
    };
  }

  if (field === "risk_level" && RISK[value]) {
    const r = RISK[value];
    return {
      title: `${pick(l("Risk Level", "Risk Level"), lang)} — ${value}`,
      category: pick(l("Review priority", "Review priority"), lang),
      definition: pick(r.definition, lang),
      effect: pick(r.basis, lang),
      nextStep: pick(r.handling, lang),
      important: pick(l("Risk Level is a sorting priority. It is not a Finding, accusation, assessment or demand.", "Risk Level কেবল sorting priority। এটি Finding, accusation, assessment বা demand নয়।"), lang),
      sections: [
        contextSection(row, [["case_id","Case ID"],["return_id","Return ID"],["coverage_tier","Coverage Tier"],["signals","Signals"],["reason_code","Reason / basis"],["sla","Handling / SLA"]]),
      ].filter(s => s.items.length > 0),
    };
  }

  if (field === "flag_id" || field === "control_flags") {
    const ids = flagsFrom(value);
    if (ids.length === 0 && FLAGS[value]) ids.push(value);
    if (ids.length > 0) {
      return {
        title: ids.length === 1 ? `${ids[0]} — ${pick(FLAGS[ids[0]].name, lang)}` : pick(l("Control flags", "Control flag"), lang),
        category: pick(l("Control / Data Quality", "Control / Data Quality"), lang),
        definition: pick(l("Control flags identify filing, consistency or paperwork issues. They are handled separately from substantive risk signals.", "Control flag filing, consistency বা paperwork issue চিহ্নিত করে। এগুলো substantive risk signal থেকে আলাদা পথে handle হয়।"), lang),
        effect: pick(l("A control flag does not automatically increase Risk Level.", "Control flag নিজে থেকে Risk Level বাড়ায় না।"), lang),
        nextStep: pick(l("Inspect the underlying values and resolve the control or data-quality issue.", "Underlying value পরীক্ষা করে control বা data-quality issue সমাধান করুন।"), lang),
        important: pick(l("Do not merge F0–F5 into the substantive Risk Case logic.", "F0–F5-কে substantive Risk Case logic-এর সাথে merge করবেন না।"), lang),
        sections: [
          { title: pick(l("Flag definitions", "Flag definition"), lang), items: ids.map(id => ({
            label: id,
            value: `${pick(FLAGS[id].name, lang)} — ${pick(FLAGS[id].check, lang)} Source: ${FLAGS[id].source}. ${pick(FLAGS[id].dependency, lang)}`,
          }))},
          contextSection(row, [["return_id","Return ID"],["coverage_tier","Coverage Tier"],["check","Triggered check"],["source","Source"],["dependency","Dependency"],["control_status","Status"]]),
        ].filter(s => s.items.length > 0),
      };
    }
  }

  if (field === "signals" || field === "primary_signal" || field === "rule_id") {
    const ids = signalsFrom(value);
    if (ids.length === 0 && SIGNALS[value]) ids.push(value);
    if (ids.length > 0) {
      return {
        title: ids.length === 1 ? `${ids[0]} — ${pick(SIGNALS[ids[0]].name, lang)}` : pick(l("Risk signals in this record", "এই record-এর Risk signal"), lang),
        category: pick(l("Substantive risk signal", "Substantive risk signal"), lang),
        definition: pick(l("A risk signal is a named question worth checking. It is not a Finding of wrongdoing.", "Risk signal হলো নির্দিষ্ট একটি প্রশ্ন যা যাচাই করা দরকার। এটি wrongdoing-এর Finding নয়।"), lang),
        effect: pick(l("Signals are deduplicated by underlying fact before Risk Level is assigned. Independent evidence families matter for escalation.", "Risk Level দেওয়ার আগে underlying fact অনুযায়ী signal deduplicate হয়। Escalation-এর জন্য independent evidence family গুরুত্বপূর্ণ।"), lang),
        nextStep: pick(l("Verify each signal separately and link evidence to that exact signal.", "প্রতিটি signal আলাদাভাবে verify করুন এবং evidence সেই নির্দিষ্ট signal-এর সাথে link করুন।"), lang),
        important: pick(l("A Pending or Refuted signal cannot support a Finding.", "Pending বা Refuted signal কোনো Finding support করতে পারে না।"), lang),
        sections: [
          { title: pick(l("Signal definitions", "Signal definition"), lang), items: ids.map(id => {
            const s = SIGNALS[id];
            return {
              label: `${id} · ${pick(s.name, lang)}`,
              value: `${pick(s.family, lang)}. Condition: ${pick(s.condition, lang)} Strength: ${s.strength}. Requires: ${s.requires}. Possible legitimate explanation: ${pick(s.legitimate, lang)} Evidence: ${pick(s.evidence, lang)}`,
            };
          })},
          contextSection(row, [["case_id","Case ID"],["return_id","Return ID"],["coverage_tier","Coverage Tier"],["risk_level","Risk Level"],["verification_summary","Verification"],["evidence_refs","Linked evidence"]]),
        ].filter(s => s.items.length > 0),
      };
    }
  }

  if (["case_status","review_status","control_status","audit_state","queue_status","reconciliation_status"].includes(field)) {
    const w = WORKFLOW[value];
    const definition = w
      ? pick(w.definition, lang)
      : pick(l("This status describes the record's current place in its operational workflow.", "এই status record-এর operational workflow-এর বর্তমান অবস্থান বোঝায়।"), lang);
    const next = w
      ? pick(w.next, lang)
      : pick(l("Use the record detail and audit trail to see who owns the next action and what is blocking progress.", "পরবর্তী action কার এবং কী progress আটকে রেখেছে তা record detail ও audit trail থেকে দেখুন।"), lang);
    return {
      title: `${pick(l("Workflow status", "Workflow status"), lang)} — ${value}`,
      category: pick(l("Case / control workflow", "Case / control workflow"), lang),
      definition,
      effect: pick(l("Workflow status does not change the underlying Risk Level.", "Workflow status underlying Risk Level পরিবর্তন করে না।"), lang),
      nextStep: next,
      sections: [
        contextSection(row, [["case_id","Case ID"],["return_id","Return ID"],["assigned_to","Assigned to"],["risk_level","Risk Level"],["evidence_status","Evidence"],["finding_status","Finding"]]),
      ].filter(s => s.items.length > 0),
    };
  }

  if (field === "data_quality") {
    const normalized = value.toLowerCase();
    const invalid = normalized.includes("invalid");
    const incomplete = normalized.includes("incomplete");
    return {
      title: `${pick(l("Data Quality", "Data Quality"), lang)} — ${value}`,
      category: pick(l("Data readiness", "Data readiness"), lang),
      definition: invalid
        ? pick(l("One or more values are unusable for the affected calculation/rule and must not be silently coerced to zero.", "এক বা একাধিক value affected calculation/rule-এর জন্য unusable; এগুলোকে silently zero করা যাবে না।"), lang)
        : incomplete
          ? pick(l("Required information for one or more checks is missing. Missing values remain NULL, not zero.", "এক বা একাধিক check-এর প্রয়োজনীয় তথ্য missing। Missing value NULL থাকবে, zero নয়।"), lang)
          : pick(l("Available values passed the prototype's basic data-quality gate for the checks shown.", "Available value prototype-এর basic data-quality gate pass করেছে।"), lang),
      effect: pick(l("Data Quality is separate from Coverage, Risk Signal, Risk Level and Control Flag.", "Data Quality, Coverage, Risk Signal, Risk Level ও Control Flag আলাদা dimension।"), lang),
      nextStep: invalid || incomplete
        ? pick(l("Resolve the affected data state before relying on rules that need those fields.", "যে rule ওই field চায়, তার ওপর নির্ভর করার আগে data state সমাধান করুন।"), lang)
        : pick(l("Continue to coverage eligibility and screening.", "Coverage eligibility ও screening-এ এগিয়ে যান।"), lang),
      sections: [
        contextSection(row, [["return_id","Return ID"],["coverage_tier","Coverage Tier"],["available_data","Available data"],["risk_level","Risk Level"]]),
      ].filter(s => s.items.length > 0),
    };
  }

  if (field === "circle" || field === "scope") {
    return {
      title: `${pick(l("Operational scope", "Operational scope"), lang)} — ${value}`,
      category: pick(l("Circle / organizational context", "Circle / organizational context"), lang),
      definition: pick(l("Circle identifies the taxpayer or case's operational tax-office context.", "Circle taxpayer বা case-এর operational tax-office context চিহ্নিত করে।"), lang),
      effect: pick(l("In this configured Audit workspace, Circle is a filter and grouping dimension; it does not restrict this officer's ability to inspect taxpayers across Circles.", "এই configured Audit workspace-এ Circle filter ও grouping dimension; এই officer-এর cross-Circle taxpayer inspect করার ক্ষমতা সীমাবদ্ধ করে না।"), lang),
      nextStep: pick(l("Use Circle filters to narrow the global population when needed.", "প্রয়োজনে global population narrow করতে Circle filter ব্যবহার করুন।"), lang),
      sections: [contextSection(row, [["tin","TIN"],["return_id","Return ID"],["assessment_year","Assessment Year"],["risk_level","Risk Level"]])].filter(s => s.items.length > 0),
    };
  }

  if (field === "sla") {
    return {
      title: pick(l("Review handling / SLA", "Review handling / SLA"), lang),
      category: pick(l("Time handling", "Time handling"), lang),
      definition: pick(l("The framework proposes review targets for High and Very High cases, but these values are not yet formally approved.", "Framework High ও Very High case-এর জন্য review target প্রস্তাব করে, তবে এগুলো এখনো formally approved নয়।"), lang),
      effect: pick(l("An SLA breach creates an escalation event; it must not silently change Risk Level.", "SLA breach escalation event তৈরি করবে; Risk Level নীরবে পরিবর্তন করবে না।"), lang),
      nextStep: pick(l("Treat the displayed target as proposed until formal policy approval is recorded.", "Formal policy approval record না হওয়া পর্যন্ত displayed target-কে proposed হিসেবে ধরুন।"), lang),
      sections: [contextSection(row, [["risk_level","Risk Level"],["sla","Displayed handling"],["case_status","Case status"],["assigned_to","Assigned to"]])].filter(s => s.items.length > 0),
    };
  }

  if (field === "version" || field === "return_version" || field === "classification_version" || field === "rule_config_version") {
    const label = field === "return_version" ? "Return Version"
      : field === "classification_version" ? "Classification Version"
      : field === "rule_config_version" ? "Rule/Config Version"
      : "Rule Version";
    return {
      title: `${label} — ${value}`,
      category: pick(l("Versioned audit record", "Versioned audit record"), lang),
      definition: pick(l("Versions preserve the exact return, classification bands and rule/configuration logic used when an assessment event occurred.", "Assessment event-এর সময় ব্যবহৃত exact return, classification band ও rule/configuration logic version দিয়ে সংরক্ষিত থাকে।"), lang),
      effect: pick(l("A later correction or rule change creates a new event/version; it does not rewrite the original assessment history.", "পরে correction বা rule change হলে নতুন event/version তৈরি হবে; original assessment history rewrite হবে না।"), lang),
      nextStep: pick(l("Use the audit trail to compare versions and reconstruct why a rule fired at that time.", "কেন ওই সময় rule fire করেছিল তা reconstruct করতে audit trail-এ version compare করুন।"), lang),
      sections: [contextSection(row, [["return_id","Return ID"],["return_version","Return Version"],["classification_version","Classification Version"],["rule_config_version","Rule/Config Version"],["rule_id","Rule ID"]])].filter(s => s.items.length > 0),
    };
  }

  if (field === "mode") {
    const modes: Record<string, Localized> = {
      Draft:l("The rule is being prepared and is not active for routing.","Rule প্রস্তুত হচ্ছে; routing-এর জন্য active নয়।"),
      Shadow:l("The rule runs against live data and records results, but does not route cases.","Rule live data-তে run করে result record করে, কিন্তু case route করে না।"),
      Staged:l("The approved rule is active only for a controlled percentage or region.","Approved rule controlled percentage বা region-এ সীমিতভাবে active।"),
      Live:l("The approved rule is active for its approved production scope.","Approved rule তার approved production scope-এ active।"),
      Superseded:l("This historical version is retained but has been replaced by a newer version.","এই historical version retained, কিন্তু newer version দ্বারা replaced।"),
    };
    return {
      title: `${pick(l("Rule mode", "Rule mode"), lang)} — ${value}`,
      category: pick(l("Rule governance", "Rule governance"), lang),
      definition: pick(modes[value] ?? l("Current operational state of the rule version.","Rule version-এর current operational state।"), lang),
      effect: pick(l("Rules are versioned and superseded rather than edited destructively in place.", "Rule destructive in-place edit না করে versioned ও superseded হয়।"), lang),
      nextStep: pick(l("Review dry-run, endorsement/approval and rollout scope before changing operational mode.", "Operational mode পরিবর্তনের আগে dry-run, endorsement/approval ও rollout scope review করুন।"), lang),
      sections: [contextSection(row, [["rule_id","Rule ID"],["version","Version"],["dry_run_status","Dry run"],["governance_status","Governance status"],["rollout_scope","Rollout scope"]])].filter(s => s.items.length > 0),
    };
  }

  if (field === "governance_status" || field === "dry_run_status") {
    return {
      title: `${pick(l("Rule governance state", "Rule governance state"), lang)} — ${value}`,
      category: pick(l("Rule governance", "Rule governance"), lang),
      definition: pick(l("Rule changes follow a governed sequence with a mandatory historical dry-run before submission, followed by endorsement and final approval under the current design assumption.", "Rule change governed sequence অনুসরণ করে: submit করার আগে mandatory historical dry-run, তারপর current design assumption অনুযায়ী endorsement ও final approval।"), lang),
      effect: pick(l("A new/changed rule should not silently route live cases before its approved rollout state.", "Approved rollout state-এর আগে new/changed rule নীরবে live case route করবে না।"), lang),
      nextStep: pick(l("Follow the recorded governance state and inspect the dry-run impact before endorsement or approval.", "Endorsement বা approval-এর আগে recorded governance state ও dry-run impact দেখুন।"), lang),
      sections: [contextSection(row, [["rule_id","Rule ID"],["version","Version"],["dry_run_status","Dry run"],["governance_status","Governance status"],["mode","Mode"]])].filter(s => s.items.length > 0),
    };
  }

  return null;
}
