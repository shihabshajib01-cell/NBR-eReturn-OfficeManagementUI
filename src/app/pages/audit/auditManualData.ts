export type ManualLanguage = "en" | "bn";

export interface LocalizedText {
  en: string;
  bn: string;
}

export interface AuditManualTopic {
  id: string;
  order: number;
  category: "overview" | "data" | "screening" | "controls" | "workflow" | "governance";
  type: "guide" | "rule" | "reference" | "workflow" | "governance";
  frameworkSections: string[];
  title: LocalizedText;
  summary: LocalizedText;
  keywords: string[];
  codes?: string[];
  details: LocalizedText[];
  guardrail?: LocalizedText;
  relatedRoute?: string;
  relatedLabel?: LocalizedText;
}

export const CATEGORY_LABELS: Record<AuditManualTopic["category"], LocalizedText> = {
  overview: { en: "Overview", bn: "ওভারভিউ" },
  data: { en: "Data & coverage", bn: "ডেটা ও কভারেজ" },
  screening: { en: "Screening & signals", bn: "স্ক্রিনিং ও সিগন্যাল" },
  controls: { en: "Controls & reconciliation", bn: "কন্ট্রোল ও রিকনসিলিয়েশন" },
  workflow: { en: "Verification & case workflow", bn: "ভেরিফিকেশন ও কেস ওয়ার্কফ্লো" },
  governance: { en: "Governance & assurance", bn: "গভর্ন্যান্স ও অ্যাস্যুরেন্স" },
};

export const TYPE_LABELS: Record<AuditManualTopic["type"], LocalizedText> = {
  guide: { en: "Guide", bn: "গাইড" },
  rule: { en: "Rule logic", bn: "রুল লজিক" },
  reference: { en: "Reference", bn: "রেফারেন্স" },
  workflow: { en: "Workflow", bn: "ওয়ার্কফ্লো" },
  governance: { en: "Governance", bn: "গভর্ন্যান্স" },
};

export const AUDIT_MANUAL_TOPICS: AuditManualTopic[] = [
  {
    id: "workspace-map",
    order: 1,
    category: "overview",
    type: "guide",
    frameworkSections: ["Audit workspace"],
    title: { en: "How the Audit workspace fits together", bn: "Audit workspace কীভাবে একসাথে কাজ করে" },
    summary: {
      en: "A practical map of Audit Overview, Candidates, taxpayer population, risk cases, controls, second review, governance, reconciliation and audit trail.",
      bn: "Audit Overview, Candidates, taxpayer population, risk cases, controls, second review, governance, reconciliation ও audit trail-এর ব্যবহারিক মানচিত্র।",
    },
    keywords: ["overview","candidates","taxpayer","risk cases","control","second review","rules","reconciliation","trail"],
    details: [
      { en: "Audit Overview is the operational summary: candidate volume, active cases, evidence workload, control work, second review and recent activity.", bn: "Audit Overview operational summary দেখায়: candidate volume, active case, evidence workload, control work, second review ও recent activity।" },
      { en: "Audit Candidates is the confirmed selection register. A selected candidate is not automatically a finding, assessment or demand.", bn: "Audit Candidates হলো confirmed selection register। Selected candidate নিজে থেকে finding, assessment বা demand নয়।" },
      { en: "All Taxpayers exposes the underlying return population and its Data Quality, Coverage, signals, Risk Level, control flags and audit state.", bn: "All Taxpayers underlying return population-এর Data Quality, Coverage, signal, Risk Level, control flag ও audit state দেখায়।" },
      { en: "Risk Cases handles substantive screening cases. Control & Data Quality stays on a separate queue. Second Review records the independent review step.", bn: "Risk Cases substantive screening case handle করে। Control & Data Quality আলাদা queue-তে থাকে। Second Review independent review step record করে।" },
      { en: "Rules & Governance manages rule/config lifecycle. Reconciliation checks expected cases against actual case creation. Audit Trail preserves immutable history.", bn: "Rules & Governance rule/config lifecycle manage করে। Reconciliation expected case বনাম actual case creation মিলায়। Audit Trail immutable history সংরক্ষণ করে।" },
    ],
  },
  {
    id: "candidate-selection",
    order: 2,
    category: "overview",
    type: "workflow",
    frameworkSections: ["Audit product workflow"],
    title: { en: "Candidate selection and funnel", bn: "Candidate selection ও funnel" },
    summary: {
      en: "The product-level journey used before a taxpayer becomes a confirmed Audit Candidate.",
      bn: "Taxpayer confirmed Audit Candidate হওয়ার আগে ব্যবহৃত product-level journey।",
    },
    keywords: ["initiate audit","population","readiness","criteria","preview","funnel","final list","batch"],
    details: [
      { en: "Start with Assessment Year and population scope, then apply Data Quality and Coverage readiness.", bn: "Assessment Year ও population scope দিয়ে শুরু করুন, তারপর Data Quality ও Coverage readiness প্রয়োগ করুন।" },
      { en: "Apply the selected track: population-based, risk-based, control/data-quality, or manual selection. Risk and control logic remain separate.", bn: "Selected track প্রয়োগ করুন: population-based, risk-based, control/data-quality অথবা manual selection। Risk ও control logic আলাদা থাকবে।" },
      { en: "Review the initial matched list before the funnel. The preview explains the current selection; it is not a hidden scoring stage.", bn: "Funnel-এর আগে initial matched list review করুন। Preview বর্তমান selection ব্যাখ্যা করে; এটি hidden scoring stage নয়।" },
      { en: "Apply a transparent funnel rule to control batch size, review the final list, then confirm the selection batch.", bn: "Batch size নিয়ন্ত্রণে transparent funnel rule প্রয়োগ করুন, final list review করুন, তারপর selection batch confirm করুন।" },
      { en: "The funnel preserves reviewed-list order and must not create a hidden risk score or undisclosed ranking.", bn: "Funnel reviewed-list order বজায় রাখে এবং hidden risk score বা undisclosed ranking তৈরি করবে না।" },
    ],
    relatedRoute: "/audit/audit-candidates",
    relatedLabel: { en: "Open Audit Candidates", bn: "Audit Candidates খুলুন" },
  },
  {
    id: "five-outputs",
    order: 3,
    category: "overview",
    type: "reference",
    frameworkSections: ["01", "02"],
    title: { en: "Keep the five audit outputs separate", bn: "পাঁচটি audit output আলাদা রাখুন" },
    summary: {
      en: "Data Quality, Coverage, Risk Level, Control Flags and Officer Outcome answer different questions and must never collapse into one score.",
      bn: "Data Quality, Coverage, Risk Level, Control Flags ও Officer Outcome ভিন্ন প্রশ্নের উত্তর দেয়; এগুলোকে এক score-এ মেশানো যাবে না।",
    },
    keywords: ["five outputs","data quality","coverage","risk level","control flags","officer outcome","reason"],
    codes: ["Data Quality","Coverage / Tier","Risk Level","Control Flags","Officer Outcome"],
    details: [
      { en: "Coverage answers what data exists and which rules are eligible to run.", bn: "Coverage বলে কোন data আছে এবং কোন rule চালানোর যোগ্য।" },
      { en: "Data Quality answers whether the available input is complete and valid enough for the intended calculation.", bn: "Data Quality বলে available input intended calculation-এর জন্য যথেষ্ট complete ও valid কি না।" },
      { en: "Risk Level is derived only from retained substantive A–E signals after deduplication and independence checks.", bn: "Risk Level শুধু deduplication ও independence check-এর পর retained substantive A–E signal থেকে আসে।" },
      { en: "Control Flags describe filing, arithmetic or internal-consistency issues and belong to a separate control queue.", bn: "Control Flag filing, arithmetic বা internal-consistency issue বোঝায় এবং আলাদা control queue-তে থাকে।" },
      { en: "Officer Outcome is a human record after verification and evidence; it must not be auto-generated from Risk Level.", bn: "Officer Outcome verification ও evidence-এর পর human record; Risk Level থেকে এটি auto-generate করা যাবে না।" },
    ],
    guardrail: {
      en: "Visual anomaly ≠ finding · Signal ≠ proof · Risk Level ≠ assessment or demand.",
      bn: "Visual anomaly ≠ finding · Signal ≠ প্রমাণ · Risk Level ≠ assessment বা demand।",
    },
  },
  {
    id: "data-quality",
    order: 4,
    category: "data",
    type: "rule",
    frameworkSections: ["03"],
    title: { en: "Data Quality gate and NULL handling", bn: "Data Quality gate ও NULL handling" },
    summary: {
      en: "Missing, empty, zero, invalid and arithmetic-error states must remain distinguishable before risk logic runs.",
      bn: "Risk logic চালানোর আগে missing, empty, zero, invalid ও arithmetic-error state আলাদা রাখতে হবে।",
    },
    keywords: ["null","zero","invalid","malformed","first filing","not required","arithmetic","data quality"],
    codes: ["NULL","0","INVALID","FIRST_FILING","NOT REQUIRED","F0"],
    details: [
      { en: "Missing or blank values are stored as NULL, never silently coerced to 0. Reconciliation does not run when required inputs are missing.", bn: "Missing বা blank value NULL হিসেবে থাকবে; নীরবে 0 করা যাবে না। Required input না থাকলে reconciliation চলবে না।" },
      { en: "A genuine taxpayer-entered 0 remains a valid numeric value with its own meaning.", bn: "Taxpayer-এর প্রকৃত 0 একটি valid numeric value এবং এর নিজস্ব অর্থ আছে।" },
      { en: "Negative asset/expenditure or malformed numeric input is preserved with INVALID status instead of being converted into a clean value.", bn: "Negative asset/expenditure বা malformed numeric input INVALID status-সহ সংরক্ষিত হবে; clean value-এ convert করা যাবে না।" },
      { en: "Arithmetic mismatch keeps the declared values but raises control flag F0. First filing with no previous wealth stays NULL, not zero.", bn: "Arithmetic mismatch declared value রাখে কিন্তু F0 control flag তোলে। First filing-এ previous wealth না থাকলে NULL থাকবে, zero নয়।" },
      { en: "When IT-10B is legally not required, Coverage is NOT REQUIRED rather than INCOMPLETE.", bn: "IT-10B আইনগতভাবে required না হলে Coverage হবে NOT REQUIRED, INCOMPLETE নয়।" },
    ],
    relatedRoute: "/audit/control-data-quality",
    relatedLabel: { en: "Open Control & Data Quality", bn: "Control & Data Quality খুলুন" },
  },
  {
    id: "coverage-tiers",
    order: 5,
    category: "data",
    type: "reference",
    frameworkSections: ["03"],
    title: { en: "Coverage and Data Tier eligibility", bn: "Coverage ও Data Tier eligibility" },
    summary: {
      en: "DT0–DT3 define what evidence is available and therefore which rules are eligible—not how risky the taxpayer is.",
      bn: "DT0–DT3 বলে কী evidence available এবং তাই কোন rule eligible—taxpayer কত risky তা নয়।",
    },
    keywords: ["dt0","dt1","dt1+h","dt2","dt3","coverage tier","eligible rules","history","external data"],
    codes: ["DT0","DT1","DT1+H","DT2","DT3"],
    details: [
      { en: "DT0: core return and TDS data. Asset/expenditure-dependent rules cannot run.", bn: "DT0: core return ও TDS data। Asset/expenditure-dependent rule চলবে না।" },
      { en: "DT1: adds IT-10B/IT-10BB totals and enables current-year asset/expenditure and reconciliation rules.", bn: "DT1: IT-10B/IT-10BB total যোগ করে এবং current-year asset/expenditure ও reconciliation rule চালাতে দেয়।" },
      { en: "DT1+H: adds a linked prior-year return so history and year-over-year rules become eligible.", bn: "DT1+H: linked prior-year return যোগ করে, ফলে history ও year-over-year rule eligible হয়।" },
      { en: "DT2: adds component-level expenditure, asset, schedule and source-coded TDS detail for precise driver analysis.", bn: "DT2: component-level expenditure, asset, schedule ও source-coded TDS detail যোগ করে precise driver analysis সম্ভব করে।" },
      { en: "DT3: adds external data only where a legal basis exists. External matching is not available below this tier.", bn: "DT3: legal basis থাকলে external data যোগ করে। এর নিচে external matching available নয়।" },
    ],
    guardrail: {
      en: "Coverage never increases Risk Level. Incomplete coverage must remain visible instead of looking artificially low-risk.",
      bn: "Coverage কখনো Risk Level বাড়ায় না। Incomplete coverage দৃশ্যমান থাকবে; artificially low-risk দেখানো যাবে না।",
    },
  },
  {
    id: "classification",
    order: 6,
    category: "data",
    type: "reference",
    frameworkSections: ["04"],
    title: { en: "Classification bands and Profile Code", bn: "Classification band ও Profile Code" },
    summary: {
      en: "Income, asset, expenditure and tax-payable bands support grouping. They are configuration, not findings.",
      bn: "Income, asset, expenditure ও tax-payable band grouping-এর জন্য। এগুলো configuration, finding নয়।",
    },
    keywords: ["profile code","income band","asset band","expenditure band","tax payable","configuration","effective date"],
    codes: ["I0–I5","A0–A5","E0–E5","T0–T1","I{n}-T{n}-A{n}"],
    details: [
      { en: "All band thresholds in the framework are configuration values and require calibration before production use.", bn: "Framework-এর সব band threshold configuration value; production-এর আগে calibration দরকার।" },
      { en: "Profile Code is system-generated, versioned and effective-dated. It is a grouping label, not a verdict.", bn: "Profile Code system-generated, versioned ও effective-dated। এটি grouping label, verdict নয়।" },
      { en: "Expenditure band stays a separate attribute unless management explicitly changes the classification version.", bn: "Management classification version পরিবর্তনের সিদ্ধান্ত না দিলে Expenditure band আলাদা attribute থাকবে।" },
    ],
    relatedRoute: "/audit/rules-governance",
    relatedLabel: { en: "Open Rules & Governance", bn: "Rules & Governance খুলুন" },
  },
  {
    id: "analytical-lenses",
    order: 7,
    category: "screening",
    type: "guide",
    frameworkSections: ["05", "06"],
    title: { en: "Income–asset and income–expenditure lenses", bn: "Income–asset ও income–expenditure lens" },
    summary: {
      en: "Analytical views help an officer see relationships in available data, but a colored cell is not itself a signal or finding.",
      bn: "Analytical view available data-এর relationship দেখায়, কিন্তু colored cell নিজে signal বা finding নয়।",
    },
    keywords: ["income asset","income expenditure","lens","screening priority","net wealth","it-10bb"],
    details: [
      { en: "Income × Asset requires DT1 or above because asset data comes from IT-10B.", bn: "Income × Asset-এর জন্য DT1 বা তার উপরে দরকার, কারণ asset data IT-10B থেকে আসে।" },
      { en: "Income × Expenditure uses IT-10BB total and distinguishes high expenditure where wealth did not fall from cases where wealth did fall.", bn: "Income × Expenditure IT-10BB total ব্যবহার করে এবং wealth না কমা বনাম wealth কমা—দুই পরিস্থিতি আলাদা করে।" },
      { en: "E0 receives no risk color: zero expenditure is usually a data-quality/coverage question unless a defined rule establishes otherwise.", bn: "E0 কোনো risk color পায় না: zero expenditure সাধারণত data-quality/coverage প্রশ্ন, defined rule না থাকলে risk নয়।" },
      { en: "Visual priority color never substitutes for fired signal strength or the Risk Level calculation.", bn: "Visual priority color fired signal strength বা Risk Level calculation-এর বিকল্প নয়।" },
    ],
  },
  {
    id: "funds-flow",
    order: 8,
    category: "controls",
    type: "rule",
    frameworkSections: ["07"],
    title: { en: "Funds-flow reconciliation", bn: "Funds-flow reconciliation" },
    summary: {
      en: "Recheck the IT-10B funds-flow arithmetic using declared sources, uses, wealth, liabilities and independently derived assets.",
      bn: "Declared sources, uses, wealth, liabilities ও independently derived asset দিয়ে IT-10B funds-flow arithmetic আবার যাচাই করুন।",
    },
    keywords: ["funds flow","reconciliation gap","sources","uses","gross wealth","total assets","line 10","line 7"],
    codes: ["Sources of Fund","Gross Wealth","Total Assets","Reconciliation Gap","R-C1","R-C3"],
    details: [
      { en: "Sources = total income + tax-exempt income + gift/other receipts. Gross Wealth = Net Wealth + personal liabilities outside business.", bn: "Sources = total income + tax-exempt income + gift/other receipts। Gross Wealth = Net Wealth + personal liabilities outside business।" },
      { en: "Reconciliation Gap = Total Assets (line 10) − Gross Wealth (line 7). Missing required components mean no gap is created.", bn: "Reconciliation Gap = Total Assets (line 10) − Gross Wealth (line 7)। Required component missing হলে gap তৈরি হবে না।" },
      { en: "Line 10 and line 7 must be independently derived. If one auto-fills the other, the gap becomes structurally zero and the control is meaningless.", bn: "Line 10 ও line 7 স্বাধীনভাবে derive হতে হবে। একটিকে অন্যটি auto-fill করলে gap structurally zero হয়ে যায় এবং control অর্থহীন হয়।" },
      { en: "Loans are not treated as Sources in this form logic; personal liabilities feed Gross Wealth through line 6. Previous net wealth should link to the prior return.", bn: "এই form logic-এ loan Source নয়; personal liability line 6 দিয়ে Gross Wealth-এ যায়। Previous net wealth prior return-এর সাথে link হওয়া উচিত।" },
    ],
    guardrail: {
      en: "Before production, verify how eReturn creates line 10 and line 2. The framework marks these as critical dependencies.",
      bn: "Production-এর আগে eReturn line 10 ও line 2 কীভাবে তৈরি করে তা verify করতে হবে। Framework এগুলোকে critical dependency হিসেবে চিহ্নিত করেছে।",
    },
    relatedRoute: "/audit/reconciliation",
    relatedLabel: { en: "Open Reconciliation", bn: "Reconciliation খুলুন" },
  },
  {
    id: "risk-signals",
    order: 9,
    category: "screening",
    type: "rule",
    frameworkSections: ["08"],
    title: { en: "Substantive Risk Signals A–E", bn: "Substantive Risk Signal A–E" },
    summary: {
      en: "Only the defined A–E substantive signals feed Risk Level. Each signal carries its fact and evidence family for deduplication.",
      bn: "শুধু defined A–E substantive signal Risk Level-এ যায়। Deduplication-এর জন্য প্রতিটি signal-এর fact ও evidence family থাকে।",
    },
    keywords: ["a-e","risk signal","fact key","evidence family","strength","external","history","behavior"],
    codes: ["A","B","C","D","E"],
    details: [
      { en: "A-group covers return/profile relationships; B-group uses historical movement; C-group covers reconciliation and internal financial relationships.", bn: "A-group return/profile relationship, B-group historical movement, C-group reconciliation ও internal financial relationship নিয়ে কাজ করে।" },
      { en: "D-group captures defined behavioral/version events. E-group relies on external matching and therefore requires DT3 plus legal basis.", bn: "D-group defined behavioral/version event ধরে। E-group external matching-এর উপর নির্ভর করে, তাই DT3 ও legal basis দরকার।" },
      { en: "Every fired signal must expose rule ID/version, the actual values used, data source and the fact/evidence-family metadata.", bn: "প্রতিটি fired signal rule ID/version, ব্যবহৃত actual value, data source এবং fact/evidence-family metadata দেখাবে।" },
      { en: "Data validation problems are not A–E risk signals; negative/malformed input and arithmetic issues belong to Data Quality/F0.", bn: "Data validation problem A–E risk signal নয়; negative/malformed input ও arithmetic issue Data Quality/F0-তে যায়।" },
    ],
    guardrail: {
      en: "A signal is a screening hypothesis. It is not proof and does not by itself create a finding.",
      bn: "Signal একটি screening hypothesis। এটি প্রমাণ নয় এবং নিজে থেকে finding তৈরি করে না।",
    },
    relatedRoute: "/audit/risk-cases",
    relatedLabel: { en: "Open Risk Cases", bn: "Risk Cases খুলুন" },
  },
  {
    id: "control-flags",
    order: 10,
    category: "controls",
    type: "rule",
    frameworkSections: ["09"],
    title: { en: "Control Flags F0–F5 stay on a separate path", bn: "Control Flag F0–F5 আলাদা path-এ থাকবে" },
    summary: {
      en: "F-flags cover form consistency and filing-obligation controls; they do not automatically raise substantive Risk Level.",
      bn: "F-flag form consistency ও filing-obligation control কভার করে; এগুলো substantive Risk Level নিজে থেকে বাড়ায় না।",
    },
    keywords: ["f0","f1","f2","f3","f4","f5","control flag","arithmetic","filing obligation"],
    codes: ["F0","F1","F2","F3","F4","F5"],
    details: [
      { en: "F0 is deterministic arithmetic integrity across the return and IT-10B totals and should ideally be prevented at source by hard validation.", bn: "F0 return ও IT-10B total-এর deterministic arithmetic integrity check; সম্ভব হলে source-এ hard validation দিয়ে এটি prevent করা উচিত।" },
      { en: "Other F-flags cover carry-forward, threshold, component consistency and filing-obligation controls subject to their dependencies.", bn: "অন্য F-flag carry-forward, threshold, component consistency ও filing-obligation control কভার করে এবং নিজ নিজ dependency-এর অধীন।" },
      { en: "A written, versioned policy rule would be required before any control condition could influence substantive Risk Level.", bn: "কোনো control condition substantive Risk Level-এ প্রভাব ফেলতে চাইলে written, versioned policy rule লাগবে।" },
    ],
    guardrail: {
      en: "Control issue ≠ substantive risk signal. Keep the Control/Data Quality queue operationally separate.",
      bn: "Control issue ≠ substantive risk signal। Control/Data Quality queue operationally আলাদা রাখুন।",
    },
    relatedRoute: "/audit/control-data-quality",
    relatedLabel: { en: "Open Control & Data Quality", bn: "Control & Data Quality খুলুন" },
  },
  {
    id: "deduplication",
    order: 11,
    category: "screening",
    type: "rule",
    frameworkSections: ["10"],
    title: { en: "Deduplication and signal independence", bn: "Deduplication ও signal independence" },
    summary: {
      en: "Count the same underlying fact once. Only genuinely independent facts from different evidence families can strengthen the level.",
      bn: "একই underlying fact একবার গণনা করুন। শুধু ভিন্ন fact ও ভিন্ন evidence family-এর স্বাধীন corroboration level শক্তিশালী করতে পারে।",
    },
    keywords: ["deduplication","factkey","evidence family","independent","same family","context"],
    details: [
      { en: "Same fact: retain the strongest relevant expression once, even if multiple rule IDs describe it.", bn: "Same fact: একাধিক rule ID থাকলেও strongest relevant expression একবার রাখুন।" },
      { en: "Context: a less precise view of the same fact remains visible but is not counted independently when a precise measure exists.", bn: "Context: একই fact-এর কম precise view দৃশ্যমান থাকবে, কিন্তু precise measure থাকলে independent count হবে না।" },
      { en: "Independent corroboration requires both a different fact and a different evidence family.", bn: "Independent corroboration-এর জন্য ভিন্ন fact এবং ভিন্ন evidence family—দুটিই দরকার।" },
      { en: "Different facts from the same evidence family do not automatically increase the level.", bn: "একই evidence family-এর ভিন্ন fact স্বয়ংক্রিয়ভাবে level বাড়ায় না।" },
    ],
  },
  {
    id: "risk-level",
    order: 12,
    category: "screening",
    type: "rule",
    frameworkSections: ["11"],
    title: { en: "Risk Level and SLA", bn: "Risk Level ও SLA" },
    summary: {
      en: "The framework uses no numeric risk score: detect, deduplicate, evaluate strength and independence, assign level, then route for review.",
      bn: "Framework কোনো numeric risk score ব্যবহার করে না: detect, deduplicate, strength ও independence evaluate, level assign, তারপর review route।",
    },
    keywords: ["risk level","sla","no numeric score","strong signal","high","very high","escalation"],
    details: [
      { en: "Risk Level is computed after deduplication from retained substantive signal strength and independence.", bn: "Risk Level deduplication-এর পর retained substantive signal-এর strength ও independence থেকে compute হয়।" },
      { en: "One strong signal alone is High, not Very High, under the framework logic.", bn: "Framework logic অনুযায়ী একটি strong signal একা High, Very High নয়।" },
      { en: "Coverage and Control Flags do not increase Risk Level.", bn: "Coverage ও Control Flag Risk Level বাড়ায় না।" },
      { en: "SLA day counts are configuration rather than legal obligations. An overdue milestone should create an escalation event, not silently change the risk.", bn: "SLA day count configuration, legal obligation নয়। Overdue milestone escalation event তৈরি করবে; risk নীরবে বদলাবে না।" },
    ],
    relatedRoute: "/audit/risk-cases",
    relatedLabel: { en: "Open Risk Cases", bn: "Risk Cases খুলুন" },
  },
  {
    id: "verification",
    order: 13,
    category: "workflow",
    type: "workflow",
    frameworkSections: ["13"],
    title: { en: "Verification-first audit workflow", bn: "Verification-first audit workflow" },
    summary: {
      en: "Detect first, verify before deciding. Verification is signal-by-signal and findings must link to verified signals and evidence.",
      bn: "আগে detect, সিদ্ধান্তের আগে verify। Verification signal-by-signal এবং finding verified signal ও evidence-এর সাথে link হবে।",
    },
    keywords: ["verify","evidence","finding","second officer","closure","signal status","review"],
    codes: ["Verified","Partially verified","Not verified","Refuted","Unable to verify"],
    details: [
      { en: "Identify the exact return version and data snapshot, validate Data Quality/Coverage, then expose each fired rule with its actual trigger values.", bn: "Exact return version ও data snapshot identify করুন, Data Quality/Coverage validate করুন, তারপর প্রতিটি fired rule-এর actual trigger value দেখান।" },
      { en: "Verify independence before finalizing Risk Level. Verification status does not itself raise or lower that level.", bn: "Risk Level final করার আগে independence verify করুন। Verification status নিজে level বাড়ায় বা কমায় না।" },
      { en: "Evidence requests must be rule-based. Do not ask for generic documents merely because a case is labelled high risk.", bn: "Evidence request rule-based হবে। শুধু case high risk বলে generic document চাওয়া যাবে না।" },
      { en: "Each signal has its own verification status and linked evidence. One verified signal does not verify the rest of the case.", bn: "প্রতিটি signal-এর নিজস্ব verification status ও linked evidence থাকবে। একটি verified signal পুরো case verify করে না।" },
      { en: "A human finding must state which verified signal and evidence support it. Second-officer review names the signals/evidence reviewed, and closure always records a reason.", bn: "Human finding কোন verified signal ও evidence-এর উপর দাঁড়িয়েছে তা বলবে। Second-officer review reviewed signal/evidence-এর নাম দেবে, এবং closure সবসময় reason record করবে।" },
    ],
    guardrail: {
      en: "Pending or refuted signals cannot be silently converted into a finding.",
      bn: "Pending বা refuted signal নীরবে finding-এ convert করা যাবে না।",
    },
    relatedRoute: "/audit/second-review",
    relatedLabel: { en: "Open Second Review", bn: "Second Review খুলুন" },
  },
  {
    id: "testing",
    order: 14,
    category: "governance",
    type: "reference",
    frameworkSections: ["12"],
    title: { en: "Test cases and self-test discipline", bn: "Test case ও self-test discipline" },
    summary: {
      en: "Expected levels should come from the same level function used by the framework, while incomplete coverage remains explicitly incomplete.",
      bn: "Expected level framework-এর একই level function থেকে আসবে, আর incomplete coverage স্পষ্টভাবে incomplete থাকবে।",
    },
    keywords: ["test cases","self test","expected result","incomplete coverage","regression"],
    details: [
      { en: "Test cases should exercise rule firing, deduplication, level calculation, control flags and evidence expectations together.", bn: "Test case rule firing, deduplication, level calculation, control flag ও evidence expectation একসাথে exercise করবে।" },
      { en: "Do not hard-code a displayed expected level separately from the actual level function.", bn: "Actual level function থেকে আলাদা করে displayed expected level hard-code করবেন না।" },
      { en: "When Coverage is INCOMPLETE, do not create a gap by treating missing input as zero.", bn: "Coverage INCOMPLETE হলে missing input-কে zero ধরে gap তৈরি করবেন না।" },
    ],
  },
  {
    id: "loophole-controls",
    order: 15,
    category: "controls",
    type: "reference",
    frameworkSections: ["14"],
    title: { en: "Loophole-to-control matrix", bn: "Loophole-to-control matrix" },
    summary: {
      en: "Critical controls protect independent asset totals, NULL handling, opening wealth, required statements, revisions, case creation, evidence closure and access logging.",
      bn: "Critical control independent asset total, NULL handling, opening wealth, required statement, revision, case creation, evidence closure ও access logging সুরক্ষিত করে।",
    },
    keywords: ["loophole","line 10","opening wealth","revision","case reconciliation","access log","closure"],
    details: [
      { en: "Do not allow line 10 to become a plug for line 7; persist component-derived assets independently.", bn: "Line 10-কে line 7-এর plug হতে দেবেন না; component-derived asset independently persist করুন।" },
      { en: "Preserve NULL ≠ 0 and protect previous wealth continuity so missing or restated opening values cannot erase gaps.", bn: "NULL ≠ 0 বজায় রাখুন এবং previous wealth continuity রক্ষা করুন, যাতে missing বা restated opening value gap মুছে না দেয়।" },
      { en: "A revised return creates a new version; the original and earlier signal events remain immutable.", bn: "Revised return নতুন version তৈরি করবে; original ও আগের signal event immutable থাকবে।" },
      { en: "Reconcile high-level cases against actual case creation, require documented evidence/sign-off for closure where policy requires it, and log data access as well as edits.", bn: "High-level case বনাম actual case creation reconcile করুন, policy অনুযায়ী closure-এ documented evidence/sign-off রাখুন, এবং edit-এর পাশাপাশি data access-ও log করুন।" },
    ],
    relatedRoute: "/audit/reconciliation",
    relatedLabel: { en: "Open Reconciliation", bn: "Reconciliation খুলুন" },
  },
  {
    id: "unresolved-dependencies",
    order: 16,
    category: "governance",
    type: "governance",
    frameworkSections: ["15"],
    title: { en: "Unresolved dependencies before production", bn: "Production-এর আগে unresolved dependency" },
    summary: {
      en: "Some rules cannot safely move to production until form behavior, legal basis, policy thresholds and data ownership are confirmed.",
      bn: "Form behavior, legal basis, policy threshold ও data ownership নিশ্চিত না হওয়া পর্যন্ত কিছু rule production-এ নিরাপদ নয়।",
    },
    keywords: ["unresolved","line 10","line 2","legal basis","surcharge","expenditure floor","tds rate","versioning"],
    details: [
      { en: "Confirm how eReturn creates line 10, line 2/opening wealth and current-year tax mappings before relying on reconciliation continuity.", bn: "Reconciliation continuity-এর উপর নির্ভর করার আগে eReturn line 10, line 2/opening wealth ও current-year tax mapping কীভাবে তৈরি করে তা confirm করুন।" },
      { en: "Confirm IT-10B/IT-10BB obligation detection, surcharge threshold/base and source-coded TDS schema with the responsible policy/data owners.", bn: "Responsible policy/data owner-এর সাথে IT-10B/IT-10BB obligation detection, surcharge threshold/base ও source-coded TDS schema confirm করুন।" },
      { en: "External data matching needs source-specific legal authority. C4 expenditure floor is a policy decision, not a technical default.", bn: "External data matching-এর জন্য source-specific legal authority দরকার। C4 expenditure floor policy decision, technical default নয়।" },
      { en: "Production architecture must separate return, classification and rule/config versions so old decisions remain reproducible.", bn: "Production architecture-এ return, classification ও rule/config version আলাদা রাখতে হবে, যাতে পুরনো decision reproduce করা যায়।" },
    ],
    relatedRoute: "/audit/rules-governance",
    relatedLabel: { en: "Open Rules & Governance", bn: "Rules & Governance খুলুন" },
  },
  {
    id: "audit-trail",
    order: 17,
    category: "governance",
    type: "governance",
    frameworkSections: ["16"],
    title: { en: "Immutable Audit Trail and versioning", bn: "Immutable Audit Trail ও versioning" },
    summary: {
      en: "Production history is server-side, append-only and access-controlled. Nothing is overwritten; corrections create new events.",
      bn: "Production history server-side, append-only ও access-controlled। কিছু overwrite হবে না; correction নতুন event তৈরি করবে।",
    },
    keywords: ["audit trail","append only","event","access log","return version","classification version","rule config version"],
    codes: ["Return Version","Classification Version","Rule / Config Version"],
    details: [
      { en: "Record identity, event sequence/timestamp, actor/role, action, data state, assessment state, human records and access records.", bn: "Identity, event sequence/timestamp, actor/role, action, data state, assessment state, human record ও access record সংরক্ষণ করুন।" },
      { en: "No role gets delete permission for audit history. A correction is a new event with previous → new value where relevant.", bn: "Audit history delete করার permission কোনো role পাবে না। Correction হলো নতুন event এবং প্রযোজ্য হলে previous → new value record করবে।" },
      { en: "System assessment events and later human review are distinct events with distinct actors.", bn: "System assessment event এবং পরের human review আলাদা actor-এর আলাদা event।" },
      { en: "Keep Return Version, Classification Version and Rule/Config Version separate so the system can answer why a historical signal fired.", bn: "Return Version, Classification Version ও Rule/Config Version আলাদা রাখুন, যাতে historical signal কেন fire করেছিল তা system বলতে পারে।" },
    ],
    relatedRoute: "/audit/audit-trail",
    relatedLabel: { en: "Open Audit Trail", bn: "Audit Trail খুলুন" },
  },
  {
    id: "architecture",
    order: 18,
    category: "governance",
    type: "governance",
    frameworkSections: ["17"],
    title: { en: "Production architecture principles", bn: "Production architecture principle" },
    summary: {
      en: "Use declarative rules, effective-dated configuration, explicit data lineage, separate queues, immutable events and controlled access.",
      bn: "Declarative rule, effective-dated configuration, explicit data lineage, separate queue, immutable event ও controlled access ব্যবহার করুন।",
    },
    keywords: ["rule engine","configuration","versioning","lineage","case management","batch scoring","security","shadow mode"],
    details: [
      { en: "Rule engine evaluations should return fired, not fired or not eligible—with reasons. Not eligible is not the same as not fired.", bn: "Rule engine evaluation fired, not fired অথবা not eligible—reason-সহ return করবে। Not eligible এবং not fired এক নয়।" },
      { en: "Bands, materiality, floors, rates and thresholds belong in an effective-dated maker-checker configuration store.", bn: "Band, materiality, floor, rate ও threshold effective-dated maker-checker configuration store-এ থাকবে।" },
      { en: "Persist data lineage for every signal: field, value, source and version/snapshot.", bn: "প্রতিটি signal-এর data lineage persist করুন: field, value, source ও version/snapshot।" },
      { en: "Keep Risk and Control/Data Quality queues separate, with reconciliation for cases that should exist but do not.", bn: "Risk এবং Control/Data Quality queue আলাদা রাখুন; expected কিন্তু missing case-এর জন্য reconciliation রাখুন।" },
      { en: "Use batch scoring after submission rather than live UI computation, and protect taxpayer data with role-based access, purpose logging, masking and export control.", bn: "Submission-এর পর batch scoring ব্যবহার করুন, live UI computation নয়; role-based access, purpose logging, masking ও export control দিয়ে taxpayer data সুরক্ষিত করুন।" },
    ],
  },
  {
    id: "end-to-end",
    order: 19,
    category: "workflow",
    type: "workflow",
    frameworkSections: ["18"],
    title: { en: "End-to-end audit flow", bn: "End-to-end audit flow" },
    summary: {
      en: "The complete chain runs from immutable return submission through data readiness, screening, verification, review, closure and immutable history.",
      bn: "সম্পূর্ণ chain immutable return submission থেকে data readiness, screening, verification, review, closure এবং immutable history পর্যন্ত যায়।",
    },
    keywords: ["end to end","submitted","data quality","coverage","classification","signals","verification","finding","closure"],
    details: [
      { en: "Return submitted → Data Quality gate → Coverage/Data Tier → versioned classification → reconciliation where eligible.", bn: "Return submitted → Data Quality gate → Coverage/Data Tier → versioned classification → eligible হলে reconciliation।" },
      { en: "A–E signals → deduplication → Risk Level with reason → reconciled case selection.", bn: "A–E signal → deduplication → reason-সহ Risk Level → reconciled case selection।" },
      { en: "Evidence request → signal-level verification → supported human finding → second-officer review where required → reasoned closure.", bn: "Evidence request → signal-level verification → supported human finding → প্রযোজ্য হলে second-officer review → reasoned closure।" },
      { en: "F0–F5 run on a side branch into the separate Control/Compliance queue and do not touch Risk Level.", bn: "F0–F5 side branch দিয়ে separate Control/Compliance queue-তে যায় এবং Risk Level স্পর্শ করে না।" },
      { en: "New rules should begin in shadow mode so hit rate and false positives can be measured before live routing.", bn: "নতুন rule shadow mode-এ শুরু হওয়া উচিত, যাতে live routing-এর আগে hit rate ও false positive মাপা যায়।" },
    ],
  },
  {
    id: "management-decisions",
    order: 20,
    category: "governance",
    type: "governance",
    frameworkSections: ["01", "19"],
    title: { en: "What is ready, what needs calibration, what must not be automated", bn: "কী ready, কী calibration চায়, কী automate করা যাবে না" },
    summary: {
      en: "The framework separates build-ready controls from policy-dependent configuration and legally unresolved automation.",
      bn: "Framework build-ready control, policy-dependent configuration ও legally unresolved automation আলাদা করে।",
    },
    keywords: ["build","modify","do not automate","management decision","calibration","shadow mode","legal validation"],
    details: [
      { en: "Build-ready: Data Quality gate, NULL ≠ 0, Coverage/Data Tier, deterministic F0/F1 controls, append-only history and verification workflow.", bn: "Build-ready: Data Quality gate, NULL ≠ 0, Coverage/Data Tier, deterministic F0/F1 control, append-only history ও verification workflow।" },
      { en: "Needs calibration/confirmation: band and materiality thresholds, SLA/escalation, A2 category/minimum-tax logic, A3 rate/source coding, and C1 after line-10 independence is verified.", bn: "Calibration/confirmation দরকার: band ও materiality threshold, SLA/escalation, A2 category/minimum-tax logic, A3 rate/source coding, এবং line-10 independence verify করার পর C1।" },
      { en: "Do not automate yet: E-group external matching without source-specific legal basis, unresolved surcharge logic, policy-defined expenditure floor, unresolved obligation detection.", bn: "এখনো automate নয়: source-specific legal basis ছাড়া E-group external matching, unresolved surcharge logic, policy-defined expenditure floor, unresolved obligation detection।" },
      { en: "Never automate the final assessment, demand or Officer Outcome from screening logic alone.", bn: "Screening logic থেকে final assessment, demand বা Officer Outcome কখনো automate করবেন না।" },
    ],
    guardrail: {
      en: "The framework is a screening and control framework. Human verification and accountable decision-making remain mandatory.",
      bn: "Framework screening ও control framework। Human verification ও accountable decision-making বাধ্যতামূলক থাকে।",
    },
    relatedRoute: "/audit/rules-governance",
    relatedLabel: { en: "Open Rules & Governance", bn: "Rules & Governance খুলুন" },
  },
];

export function localText(value: LocalizedText, language: string | undefined): string {
  return language?.toLowerCase().startsWith("bn") ? value.bn : value.en;
}
