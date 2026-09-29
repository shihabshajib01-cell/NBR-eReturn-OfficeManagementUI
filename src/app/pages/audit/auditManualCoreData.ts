import { mt, type ManualSection } from "./auditManualTypes";

const same = (v: string) => mt(v, v);

export const AUDIT_MANUAL_CORE_SECTIONS: ManualSection[] = [
  {
    id: "source-metadata",
    number: "00",
    area: "overview",
    sourceOrder: "Source metadata",
    title: mt("Source metadata and reading rules", "Source metadata ও পড়ার নিয়ম"),
    description: mt(
      "Preserves the source file's own version labels, scope and interpretation boundaries before any framework rule is read.",
      "কোনো framework rule পড়ার আগে source file-এর নিজস্ব version label, scope ও interpretation boundary সংরক্ষণ করে।"
    ),
    keywords: ["source","version","v5","v7","scope","disclaimer","validated data"],
    blocks: [
      {
        kind: "table",
        title: mt("Source identity", "Source পরিচয়"),
        columns: [mt("Item","আইটেম"), mt("Source value","Source value")],
        rows: [
          [mt("Uploaded file name","Uploaded file name"), same("risk_framework_v7.html")],
          [mt("Embedded document title","Embedded document title"), mt("Return Risk Screening, Control Flags and Audit Trail — Decision Framework v5","Return Risk Screening, Control Flags ও Audit Trail — Decision Framework v5")],
          [mt("View-layer comment","View-layer comment"), mt("v7 view layer — no new rule is created in this layer","v7 view layer — এই স্তর কোনো নতুন rule তৈরি করে না")],
          [mt("Prototype decision storage key","Prototype decision storage key"), same("nbr-rsf-v5-decisions")],
          [mt("Primary form basis","Primary form basis"), mt("IT-11Ga (2023): Return Sl. 1–26, Schedule 1–5, IT-10B, IT-10BB","IT-11Ga (2023): Return Sl. 1–26, Schedule 1–5, IT-10B, IT-10BB")],
        ],
        note: mt(
          "The file name says v7 while the embedded title and localStorage key still say v5. The manual preserves that mismatch instead of silently renaming it.",
          "File name v7 হলেও embedded title ও localStorage key এখনো v5 বলে। Manual এটি নীরবে rename না করে mismatch হিসেবে সংরক্ষণ করে।"
        ),
      },
      {
        kind: "callout",
        tone: "warning",
        title: mt("Interpretation boundary","Interpretation boundary"),
        text: mt(
          "Visual anomaly is not a finding. A signal is not proof. High Risk Level is not an assessment, demand or allegation. Coverage only answers which data exists and which rules can run.",
          "Visual anomaly ≠ Finding · Signal ≠ প্রমাণ · High Risk Level ≠ assessment, demand বা অভিযোগ। Coverage শুধু বলে কোন data আছে এবং কোন rule চালানো যায়।"
        ),
      },
      {
        kind: "list",
        title: mt("How to read the framework dashboard","Framework dashboard কীভাবে পড়বেন"),
        items: [
          mt("Coverage determines which rules are eligible to run.","Coverage বলে কোন rule আদৌ চালানো যায়।"),
          mt("Analytical visuals show which relationship deserves attention.","Analytical visual দেখায় কোন সম্পর্কটি মনোযোগ দাবি করে।"),
          mt("A Signal is created only from a defined rule.","Signal কেবল সংজ্ঞায়িত rule থেকেই তৈরি হয়।"),
          mt("Deduplication prevents the same fact being counted multiple times.","Deduplication একই তথ্যের একাধিক signal বাদ দেয়।"),
          mt("Risk Level comes from the retained signals, not from a numeric score.","Risk Level অবশিষ্ট signal থেকে আসে — কোনো numeric score নয়।"),
          mt("Verification determines whether a signal is supported by evidence.","Verification ঠিক করে signal-টি প্রমাণিত কিনা।"),
          mt("Human Outcome is created only by an officer.","Human Outcome কেবল officer তৈরি করেন।"),
        ],
      },
      {
        kind: "table",
        title: mt("Source inconsistencies that must remain visible","Source-এর যে inconsistency দৃশ্যমান রাখতে হবে"),
        columns: [mt("Topic","বিষয়"), mt("Source statement A","Source statement A"), mt("Source statement B","Source statement B"), mt("Handling in this manual","Manual-এ handling")],
        rows: [
          [
            mt("Version label","Version label"),
            mt("File name: risk_framework_v7.html","File name: risk_framework_v7.html"),
            mt("Document title/localStorage key: v5","Document title/localStorage key: v5"),
            mt("Both are shown; no silent correction.","দুটিই দেখানো হয়; নীরবে correction নয়।"),
          ],
          [
            mt("SLA example","SLA example"),
            mt("Section 02 example: Detailed review, SLA 30 days","Section 02 example: Detailed review, SLA 30 দিন"),
            mt("Section 11/CONFIG: High 3 working days, Very High 1 working day","Section 11/CONFIG: High 3 কার্যদিবস, Very High 1 কার্যদিবস"),
            mt("The 30-day value is preserved as an example, while the configured 3/1-day values are separately labelled configuration.","30 দিনের value example হিসেবে থাকে; configured 3/1 দিনের value আলাদাভাবে Configuration হিসেবে দেখানো হয়।"),
          ],
        ],
      },
    ],
  },

  {
    id: "dashboard-operate",
    number: "D",
    area: "demo",
    sourceOrder: "Dashboard / Operate",
    title: mt("Dashboard and operator-view reference", "Dashboard ও operator-view reference"),
    description: mt(
      "The source includes an illustrative dashboard and operator view. Their purpose is explanatory, not a separate risk model.",
      "Source-এ illustrative dashboard ও operator view আছে। এগুলোর কাজ ব্যাখ্যা করা, আলাদা risk model তৈরি করা নয়।"
    ),
    keywords: ["dashboard","operator","coverage signal why verify outcome","money flow","radar","trend","composition"],
    blocks: [
      {
        kind: "flow",
        title: mt("Operator sequence","Operator sequence"),
        steps: [
          { label: same("COVERAGE") },
          { label: same("SIGNAL") },
          { label: same("WHY") },
          { label: same("VERIFY") },
          { label: same("OUTCOME") },
        ],
      },
      {
        kind: "table",
        title: mt("Dashboard analytical panels","Dashboard analytical panel"),
        columns: [mt("Panel","Panel"), mt("What it shows","কী দেখায়"), mt("Guardrail","Guardrail")],
        rows: [
          [mt("Money flow — Sources → Uses → Wealth → Assets","Money flow — Sources → Uses → Wealth → Assets"), mt("Where money came from and where it went using IT-10B lines 1–10.","IT-10B 1–10 ব্যবহার করে টাকা কোথা থেকে এলো এবং কোথায় গেল।"), mt("Unavailable data must be shown as unavailable, never as zero.","Unavailable data-কে unavailable দেখাতে হবে, zero নয়।")],
          [mt("Reconciliation bridge","Reconciliation bridge"), mt("Reported Assets (10) versus derived Gross Wealth (7); the difference is the gap.","Reported Assets (10) বনাম derived Gross Wealth (7); পার্থক্যই gap।"), mt("Line 10 and line 7 must be independent.","Line 10 ও line 7 স্বাধীন হতে হবে।")],
          [mt("Mismatch radar","Mismatch radar"), mt("Only relationships supported by the case data; bar length is an actual ratio, not a discovered score.","Case data-তে থাকা সম্পর্ক; bar length প্রকৃত ratio, invented score নয়।"), mt("No numeric risk score is created.","কোনো numeric risk score তৈরি হয় না।")],
          [mt("Anomaly view","Anomaly view"), mt("Each observation links to a defined rule and the values used.","প্রতিটি observation নির্দিষ্ট rule ও ব্যবহৃত মানের সাথে linked।"), mt("Observation ≠ finding.","Observation ≠ finding।")],
          [mt("Income ↔ Asset","Income ↔ Asset"), mt("Declared income and total assets on a common band scale.","Declared income ও total assets common band scale-এ।"), mt("The lens is not itself a finding.","Lens নিজে finding নয়।")],
          [mt("Income ↔ Expenditure ↔ Net Wealth","Income ↔ Expenditure ↔ Net Wealth"), mt("Distinguishes high expenditure with unchanged wealth from high expenditure funded by falling wealth.","বেশি খরচ + wealth না কমা বনাম wealth কমে খরচ হওয়া আলাদা করে।"), mt("Interpret with reconciliation, not color alone.","শুধু color নয়, reconciliation দিয়ে ব্যাখ্যা করতে হবে।")],
          [mt("Return trend","Return trend"), mt("Year-over-year Income, Tax, Expenditure, Net Wealth, Gross Wealth and Assets; optional index view sets first year = 100.","Year-over-year Income, Tax, Expenditure, Net Wealth, Gross Wealth ও Assets; index view প্রথম বছর = 100।"), mt("Missing history produces an unavailable message, not a fabricated series.","History না থাকলে unavailable, fabricated series নয়।")],
          [mt("Asset composition","Asset composition"), mt("Current versus previous year for IT-10B 8(a)–8(k) and 9.","IT-10B 8(a)–8(k), 9: চলতি বনাম গত বছর।"), mt("Component movement helps find drivers; it is not automatically a rule.","Component movement driver খুঁজতে সাহায্য করে; নিজে rule নয়।")],
          [mt("Expenditure composition","Expenditure composition"), mt("Pareto view of IT-10BB categories; Sl. 8 already includes TDS and prior-year tax.","IT-10BB category Pareto view; Sl. 8-এ TDS ও prior-year tax আছে।"), mt("Do not subtract tax a second time.","Tax দ্বিতীয়বার বাদ দেওয়া যাবে না।")],
        ],
      },
      {
        kind: "table",
        title: mt("Operator panels","Operator panel"),
        columns: [mt("Panel","Panel"), mt("Source rule","Source rule")],
        rows: [
          [mt("Coverage","Coverage"), mt("Show eligible and unavailable rules according to Data Tier; lower coverage means lower visibility, not lower risk.","Data Tier অনুযায়ী eligible/unavailable rule দেখায়; কম coverage মানে কম visibility, কম risk নয়।")],
          [mt("Risk result","Risk result"), mt("Level, explanation, strong-signal count, independent corroboration and configured SLA.","Level, reason, strong-signal count, independent corroboration ও configured SLA।")],
          [mt("Signal set","Signal set"), mt("Raw → retained → independent cluster; context signals remain visible.","Raw → retained → independent cluster; context signal দৃশ্যমান থাকে।")],
          [mt("Control review","Control review"), mt("F flags stay on a separate path and do not change substantive Risk Level.","F flag আলাদা path-এ থাকে এবং substantive Risk Level বদলায় না।")],
          [mt("Verification and Human Outcome","Verification ও Human Outcome"), mt("Each signal is verified separately; evidence is linked to the specific signal.","প্রতিটি signal আলাদাভাবে verify হয়; evidence নির্দিষ্ট signal-এর সাথে linked।")],
        ],
      },
    ],
  },

  {
    id: "s01",
    number: "01",
    area: "overview",
    sourceOrder: "Management",
    title: mt("Executive Decision Summary", "Executive Decision Summary"),
    keywords: ["problem","solution","main inputs","outputs","limitation","technical risk","build","modify","do not automate"],
    blocks: [
      {
        kind: "table",
        columns: [mt("Question","প্রশ্ন"), mt("Source answer","Source উত্তর")],
        rows: [
          [same("Problem"), mt("Check consistently and explainably whether declared Income, Tax, Expenditure and Asset are mutually consistent, without harassing legitimate taxpayers.","Declared Income, Tax, Expenditure ও Asset পরস্পর সামঞ্জস্যপূর্ণ কিনা, তা ধারাবাহিক ও ব্যাখ্যাযোগ্যভাবে যাচাই করা — বৈধ taxpayer-কে হয়রানি না করে।")],
          [same("Solution"), mt("Mechanically test IT-10B's own funds-flow; use 15 A–E risk signals and 6 F control flags; determine rule eligibility from coverage; assign a simple explainable Risk Level.","IT-10B-র নিজস্ব funds-flow হিসাব যান্ত্রিকভাবে পরীক্ষা করা; ১৫টি A–E risk signal ও ৬টি F control flag; coverage অনুযায়ী rule eligibility; সহজ ও ব্যাখ্যাযোগ্য Risk Level।")],
          [same("Main inputs"), mt("Return Sl. 11, 16, 20–24, 26; IT-10B 1(a–c), 2, 4(a–b), 6, 8, 9, 10; IT-10BB Total; Schedule 1–5; filing history; external data where a legal basis exists.","Return Sl. 11, 16, 20–24, 26; IT-10B 1(a–c), 2, 4(a–b), 6, 8, 9, 10; IT-10BB Total; Schedule 1–5; filing history; আইনগত ভিত্তি থাকলে external data।")],
          [same("Outputs"), mt("Five separate fields: Data Quality status · Coverage/Tier · Risk Level + reason · Control Flags · Officer Outcome.","পাঁচটি আলাদা field: Data Quality status · Coverage/Tier · Risk Level + reason · Control Flags · Officer Outcome।")],
          [same("Key limitation"), mt("IT-10B is not mandatory for everyone and reconciliation measures only the internal consistency of declared values. If all values are understated together, the gap may still be zero. Cash-based activity remains invisible without external data.","IT-10B সবার জন্য বাধ্যতামূলক নয় এবং reconciliation কেবল declared অঙ্কের internal consistency মাপে। সব অঙ্ক একসাথে কম দেখালে gap শূন্যই থাকবে। Cash-ভিত্তিক অর্থনীতি external data ছাড়া অদৃশ্য।")],
          [mt("Largest technical risk","সবচেয়ে বড় প্রযুক্তিগত ঝুঁকি"), mt("If eReturn auto-fills IT-10B line 10 (Total Assets) from line 7 (Gross Wealth), the gap is structurally zero and reconciliation becomes meaningless. This must be verified before development.","eReturn যদি IT-10B line 10 (Total Assets)-কে line 7 (Gross Wealth) থেকে auto-fill করে, তবে gap কাঠামোগতভাবে শূন্য এবং পুরো reconciliation অর্থহীন। Development শুরুর আগে এটিই প্রথম যাচাই।")],
        ],
      },
      {
        kind: "table",
        title: mt("Decision required — proposed management classification","Decision Required — ব্যবস্থাপনার জন্য প্রস্তাবিত শ্রেণিবিভাগ"),
        columns: [mt("Class","Class"), mt("Meaning","অর্থ"), mt("Items","Items")],
        rows: [
          [same("BUILD"), mt("Mature enough to implement now","এখনই implement করার মতো পরিপক্ব"), mt("Data Quality gate and NULL ≠ 0 storage · Coverage/Data Tier · F0 arithmetic integrity · F1 carry-forward cross-check · append-only Audit Trail, return versioning and access logging · C1 reconciliation in shadow mode after line-10 independence is confirmed.","Data Quality gate ও NULL ≠ 0 storage · Coverage / Data Tier · F0 arithmetic integrity · F1 carry-forward cross-check · Append-only Audit Trail, return versioning, access logging · line 10-এর স্বাধীনতা নিশ্চিত হওয়ার পর C1 reconciliation shadow mode-এ।")],
          [same("MODIFY BEFORE BUILD"), mt("Policy/data/rule must be clarified first","Policy/data/rule আগে স্পষ্ট করতে হবে"), mt("Calibrate band thresholds · calibrate materiality percentage and absolute floor from historical gaps · define A2 taxpayer category and minimum-tax logic · define A3 TDS rate/source code · define second-officer sign-off rule for High/Very High closure.","Band threshold calibration · historical gap থেকে materiality % ও absolute floor · A2 taxpayer category ও minimum tax logic · A3 TDS rate/source code · High/Very High closure-এ second-officer sign-off rule।")],
          [same("DO NOT AUTOMATE YET"), mt("Needs further data or legal validation","আরও data বা আইনি যাচাই প্রয়োজন"), mt("E-group external matching without source-specific legal basis · F2 surcharge threshold/base until Finance Act confirmation · C4 expenditure floor as a policy decision · F5 obligation detection while trigger evidence remains unresolved · any automated Final Outcome.","উৎসভিত্তিক legal basis ছাড়া Group E external matching · Finance Act confirm না হওয়া পর্যন্ত F2 surcharge threshold/base · C4 expenditure floor policy decision · F5 obligation detection trigger evidence unresolved · যেকোনো automated Final Outcome।")],
        ],
      },
    ],
  },

  {
    id: "s02",
    number: "02",
    area: "overview",
    sourceOrder: "Reference",
    title: mt("Five separate outputs and first-screen questions", "পাঁচটি আলাদা Output — এবং প্রথম স্ক্রিনের প্রশ্ন"),
    description: mt("These must never be collapsed into one number on the officer screen.","Officer-এর screen-এ এগুলো কখনো একটি সংখ্যায় মিলিয়ে দেখানো যাবে না।"),
    keywords: ["five outputs","coverage","data quality","risk signal","risk level","control flag","routing","evidence","disclaimer"],
    blocks: [
      {
        kind: "table",
        columns: [mt("Question","প্রশ্ন"), mt("Output / source","কোন output থেকে"), mt("Source example","Source উদাহরণ")],
        rows: [
          [mt("What data is available?","কোন data পাওয়া গেছে?"), same("Coverage"), mt("DT1 · IT-10B exists · IT-10BB exists · first year, so no history","DT1 · IT-10B আছে, IT-10BB আছে, প্রথম বছর বলে history নেই")],
          [mt("Is the data reliable?","Data নির্ভরযোগ্য কিনা?"), same("Data Quality"), mt("OK / INCOMPLETE (4a blank) / INVALID (negative asset)","OK / INCOMPLETE (4a ফাঁকা) / INVALID (negative asset)")],
          [mt("What was detected?","কী detect হয়েছে?"), same("Risk Signal"), mt("C1: Gap 47.5 lakh, asset-driven","C1: Gap 47.5 lakh, asset-driven")],
          [mt("Why was it detected?","কেন detect হয়েছে?"), mt("Plain-language reason + rule version + values used","Plain language + rule version + যে অঙ্কগুলো ব্যবহৃত"), mt("Declared asset 82L, funds-flow says 34.5L","declared asset 82L, funds-flow অনুযায়ী 34.5L")],
          [mt("How strong is the signal?","Signal কতটা শক্তিশালী?"), mt("Risk Level + strength and independence","Risk Level + strength ও independence"), mt("High — one strong signal, no independent corroboration","High — একটি strong signal, স্বাধীন corroboration নেই")],
          [mt("Is this risk or a form problem?","এটি কি risk, নাকি form-এর সমস্যা?"), mt("Control Flag shown separately","Control Flag আলাদাভাবে"), mt("F1: Sl. 11 ≠ IT-10B 1(a) — control queue","F1: Sl. 11 ≠ IT-10B 1(a) — control queue")],
          [mt("What happens next?","এরপর কী হবে?"), same("Case routing"), mt("Detailed review, SLA 30 days — source example","Detailed review, SLA 30 দিন — source example")],
          [mt("What evidence is needed?","কী প্রমাণ দরকার?"), mt("Rule-based evidence checklist","Evidence checklist (rule-ভিত্তিক)"), mt("Gift deed, loan agreement, bank statement","Gift deed, ঋণচুক্তি, bank statement")],
          [mt("What is the system not claiming?","System কী দাবি করছে না?"), mt("Persistent disclaimer","স্থায়ী disclaimer"), mt("This is a screening hypothesis; not an assessment, demand or allegation.","এটি screening hypothesis; কোনো assessment, demand বা অভিযোগ নয়।")],
        ],
        note: mt("The 30-day SLA above is a source example and conflicts with the separate configured High=3 / Very High=1 working-day values in Section 11. Both are preserved.","উপরের 30 দিনের SLA source example; Section 11-এর configured High=3 / Very High=1 কার্যদিবসের সাথে conflict করে। দুটিই সংরক্ষিত।"),
      },
    ],
  },

  {
    id: "s03",
    number: "03",
    area: "data",
    sourceOrder: "Analyze",
    title: mt("Data Quality → Coverage / Data Tier", "Data Quality → Coverage / Data Tier"),
    description: mt("First determine data state, then coverage, and only then risk.","প্রথমে data-র অবস্থা, তারপর coverage, তারপরই কেবল risk।"),
    keywords: ["data quality","coverage","dt0","dt1","dt1+h","dt2","dt3","null","invalid","first filing","not required"],
    blocks: [
      {
        kind: "table",
        title: mt("Data Quality decision table — field state","Data Quality decision table — প্রতিটি field-এর অবস্থা"),
        columns: [mt("Input state","Input অবস্থা"), mt("Stored as","সংরক্ষণ"), mt("Reconciliation","Reconciliation"), mt("Result","ফল")],
        rows: [
          [mt("NULL — field absent / not filed","NULL (ঘর নেই / দাখিল হয়নি)"), mt("NULL — never 0","NULL — কখনো 0 নয়"), mt("Does not run","চলবে না"), mt("Coverage: INCOMPLETE + DQ task","Coverage: INCOMPLETE + DQ task")],
          [mt("Empty string / whitespace","খালি string / শুধু space"), same("NULL"), mt("Does not run","চলবে না"), mt("Same — INCOMPLETE","একই — INCOMPLETE")],
          [mt("Actual 0 entered by taxpayer","প্রকৃত 0 (taxpayer 0 লিখেছেন)"), same("0"), mt("Runs","চলবে"), mt("Valid value; 0 has its own meaning","বৈধ মান; 0-এর নিজস্ব অর্থ আছে")],
          [mt("Negative asset / expenditure","Negative asset / expenditure"), mt("Value + INVALID flag","মান + INVALID flag"), mt("Does not run","চলবে না"), mt("Data Quality: INVALID","Data Quality: INVALID")],
          [mt("Malformed numeric input","Malformed (অক্ষর, একাধিক dot)"), mt("Raw text + INVALID","raw text + INVALID"), mt("Does not run","চলবে না"), mt("INVALID — never coerce to 0","INVALID — 0 হিসেবে coerce করা যাবে না")],
          [mt("Arithmetic mismatch","Arithmetic ভুল (যোগফল মেলে না)"), mt("Keep declared values unchanged","মান অপরিবর্তিত"), mt("Runs with flag","চলবে, তবে flag সহ"), same("Control Flag F0")],
          [mt("First filing — no previous net wealth","প্রথম বছর — প্রাক্তন net wealth নেই"), same("NULL + FIRST_FILING"), mt("Does not run; never assume 0","চলবে না; 0 ধরা হবে না"), mt("INCOMPLETE — history rules ineligible","INCOMPLETE — history rule অযোগ্য")],
          [mt("IT-10B legally not required","IT-10B বাধ্যতামূলক নয়"), same("—"), mt("Not applicable","প্রযোজ্য নয়"), mt("Coverage: NOT REQUIRED — not an error","Coverage: NOT REQUIRED — ত্রুটি নয়")],
        ],
      },
      {
        kind: "table",
        title: mt("Coverage / Data Tier — rule eligibility","Coverage / Data Tier — কোন rule চালানোর যোগ্য"),
        columns: [same("Tier"), mt("Available data elements","উপস্থিত data element"), mt("Eligible rules","Eligible rules"), mt("Cannot run","যা চলতে পারে না")],
        rows: [
          [same("DT0"), same("RET (Sl. 1–26) + TDS"), mt("R-A2 · R-A3 · F0 · F1 partial · F5 if trigger exists","R-A2 · R-A3 · F0 · F1(আংশিক) · F5(trigger থাকলে)"), mt("A1, B1, B2, C1–C4: asset/expenditure data not available","A1, B1, B2, C1–C4 — asset/expenditure লাগে, DT0-তে নেই")],
          [same("DT1"), same("+ ASSET LIAB EXP RECEIPT PREVNW (IT-10B + IT-10BB total)"), same("+ A1 · C1 · C3 · C4 · F1 · F2"), mt("B1, B2, C2, D1–D2 without history","B1, B2, C2, D1–D2 — history ছাড়া নয়")],
          [same("DT1+H"), mt("+ HIST — linked previous-year return","+ HIST (পূর্ববর্তী বছরের linked return)"), same("+ B1 · B2 · C2 · D1 · D2 · D3"), same("E-group")],
          [same("DT2"), mt("+ component-level IT-10BB 1–9, assets 8a–8k, cash in hand, Schedule 4/5, source-coded TDS","+ component-level IT-10BB 1–9, asset 8a–8k, cash in hand, Sch 4 ও 5, source-coded TDS"), mt("+ F3 · F4 · precise A3 · gap-driver analysis","+ F3 · F4 · A3 (precise) · gap driver বিশ্লেষণ"), same("E-group")],
          [same("DT3"), mt("+ external data with legal basis","+ আইনি ভিত্তিসহ external data"), same("+ E1 · E2 · E3"), same("—")],
        ],
        note: mt("Coverage never converts into Risk Level. Incomplete cases remain visibly incomplete. Low is meaningful only when the relevant data is actually present.","Coverage কখনো Risk Level-এ রূপান্তরিত হয় না। INCOMPLETE case আলাদাভাবে দৃশ্যমান থাকে; প্রাসঙ্গিক data উপস্থিত থাকলেই Low অর্থবহ।"),
      },
    ],
  },

  {
    id: "s04",
    number: "04",
    area: "data",
    sourceOrder: "Analyze",
    title: mt("Classification Bands and Profile Code", "Classification Bands ও Profile Code"),
    description: mt("Every threshold is configuration, not established by the supplied form, so production requires calibration.","সব threshold Configuration — supplied form থেকে প্রতিষ্ঠিত নয়; production-এর আগে calibration দরকার।"),
    keywords: ["classification","bands","income band","asset band","expenditure band","tax payable","profile code"],
    blocks: [
      {
        kind: "table",
        title: mt("Income — Return Sl. 11","Income — Sl. 11"),
        columns: [same("Band"), mt("Range","Range")],
        rows: [[same("I0"),same("= 0")],[same("I1"),same("> 0 – 3L")],[same("I2"),same("3 – 5L")],[same("I3"),same("5 – 10L")],[same("I4"),same("10 – 25L")],[same("I5"),same("> 25L")]],
      },
      {
        kind: "table",
        title: mt("Asset — IT-10B 10","Asset — IT-10B 10"),
        columns: [same("Band"), mt("Range","Range")],
        rows: [[same("A0"),same("= 0")],[same("A1"),same("> 0 – 5L")],[same("A2"),same("5 – 25L")],[same("A3"),same("25 – 50L")],[same("A4"),same("50L – 1Cr")],[same("A5"),same("> 1Cr")]],
      },
      {
        kind: "table",
        title: mt("Expenditure — IT-10BB Total","Expenditure — IT-10BB Total"),
        columns: [same("Band"), mt("Range","Range")],
        rows: [[same("E0"),mt("= 0 — often NULL","= 0 — প্রায়ই NULL")],[same("E1"),same("> 0 – 3L")],[same("E2"),same("3 – 6L")],[same("E3"),same("6 – 12L")],[same("E4"),same("12 – 30L")],[same("E5"),same("> 30L")]],
      },
      {
        kind: "table",
        title: mt("Tax Payable — Return Sl. 16","Tax Payable — Sl. 16"),
        columns: [same("Band"), mt("Range / source note","Range / source note")],
        rows: [
          [same("T0"),same("= 0")],
          [same("T1"),same("> 0")],
          [mt("Source rule","Source rule"), mt("Sl. 16 is the higher of Sl. 14 Net Tax after Rebate and Sl. 15 Minimum Tax. If minimum tax applies, T0 should be impossible; check F0 first.","Sl. 16 = higher of Sl. 14 Net Tax after Rebate ও Sl. 15 Minimum Tax। Minimum tax প্রযোজ্য হলে T0 অসম্ভব; প্রথমে F0 arithmetic check।")],
        ],
      },
      {
        kind: "callout",
        title: same("Profile Code"),
        text: mt(
          "I{n}-T{n}-A{n} is system-generated, not manually editable, versioned and effective-dated. Expenditure band remains a separate attribute. Adding E to the Profile Code changes classification version. Profile Code is a grouping label, not a verdict.",
          "I{n}-T{n}-A{n} system-generated, manually edit করা যায় না, versioned এবং effective-dated। Expenditure band (E) আলাদা attribute। E যোগ করলে classification version বদলাবে। Profile Code রায় নয়, grouping label।"
        ),
      },
    ],
  },

  {
    id: "s05",
    number: "05",
    area: "analysis",
    sourceOrder: "Analyze",
    title: mt("Income × Asset Lens", "Income × Asset Lens"),
    description: mt("Available only at DT1 or above because assets come from IT-10B. Color means screening priority, not guilt or signal strength.","শুধু DT1 বা তার উপরে; asset আসে IT-10B থেকে। রং screening priority, অপরাধ বা signal strength নয়।"),
    keywords: ["income asset","matrix","priority","tax payable 0","tax payable >0"],
    blocks: [
      {
        kind: "matrix",
        title: mt("Priority matrix","Priority matrix"),
        modeLabels: [mt("Tax Payable = 0","Tax Payable = 0"), mt("Tax Payable > 0","Tax Payable > 0")],
        rowLabels: ["I0 = 0","I1 ≤ 3L","I2 3–5L","I3 5–10L","I4 10–25L","I5 >25L"],
        columnLabels: ["A0 = 0","A1 ≤5L","A2 5–25L","A3 25–50L","A4 50L–1Cr","A5 >1Cr"],
        values: [
          [
            ["P0","P0","P1","P2","P3","P3"],
            ["P0","P0","P0","P1","P2","P2"],
            ["P0","P0","P0","P1","P2","P2"],
            ["P1","P1","P1","P1","P2","P2"],
            ["P2","P2","P2","P2","P2","P3"],
            ["P2","P2","P2","P2","P3","P3"],
          ],
          [
            ["P1","P1","P1","P1","P2","P2"],
            ["P0","P0","P0","P1","P1","P2"],
            ["P0","P0","P0","P0","P1","P2"],
            ["P0","P0","P0","P0","P1","P1"],
            ["P1","P0","P0","P0","P0","P0"],
            ["P1","P0","P0","P0","P0","P0"],
          ],
        ],
        legend: {
          P0: mt("Ordinary","Ordinary"),
          P1: mt("Attention","Attention"),
          P2: mt("Elevated","Elevated"),
          P3: mt("Strong screening priority","Strong screening priority"),
        },
        note: mt("This matrix is analytical priority only. Risk Level is calculated from fired signals in Section 11.","Matrix শুধু analytical priority। Risk Level fired signal থেকে Section 11 অনুযায়ী আসে।"),
      },
      {
        kind: "table",
        title: mt("Source interpretation rules for the matrix","Matrix-এর source interpretation rule"),
        columns: [mt("Situation","Situation"), mt("Relevant source logic","Relevant source logic"), mt("Typical treatment","Typical treatment")],
        rows: [
          [mt("Income=0 and Asset=0 with Tax=0","Income=0, Asset=0, Tax=0"), mt("No standalone anomaly.","কোনো standalone anomaly নয়।"), mt("No action.","কোনো পদক্ষেপ নয়।")],
          [mt("Income=0, Tax=0, Asset>0","Income=0, Tax=0, Asset>0"), mt("R-A1 proxy; asset band increases severity; if reconciliation runs, C1 is the more precise answer and A1 becomes context.","R-A1 proxy; asset band অনুযায়ী severity; reconciliation চললে C1 নির্ভুল এবং A1 context।"), mt("Review reconciliation first; valid explanations include retirement, homemaker/student status, joint ownership, inheritance.","Reconciliation আগে; retirement, homemaker/student, joint ownership, inheritance বৈধ ব্যাখ্যা হতে পারে।")],
          [mt("Income>0 but Tax Payable=0","Income>0 কিন্তু Tax Payable=0"), mt("R-A2; higher income bands make it more unusual, but category, minimum tax, rebate and exempt income must be checked.","R-A2; higher band-এ বেশি অস্বাভাবিক, তবে category, minimum tax, rebate, exempt income দেখতে হবে।"), mt("Verify rebate/exemption/category basis before escalation.","Escalation-এর আগে rebate/exemption/category verify।")],
          [mt("Tax Payable>0 but Income=0","Tax Payable>0 কিন্তু Income=0"), mt("Usually missing income source or F0 arithmetic issue; then R-A3 may be relevant.","সাধারণত missing income source বা F0 arithmetic; তারপর R-A3।"), mt("Check form arithmetic first.","প্রথমে form arithmetic।")],
          [mt("High income with Asset=0","High income, Asset=0"), mt("Potential statement completeness issue, not automatically a substantive risk signal.","Wealth statement completeness question; substantive risk signal নয়।"), mt("Check Coverage/F5 if the statement is required.","Statement required হলে Coverage/F5।")],
          [mt("Asset band far above income band","Asset income-এর তুলনায় অনেক বড়"), mt("Question proportionality; C1 at DT1, B1 as history context.","Proportionality প্রশ্ন; DT1-এ C1, history থাকলে B1 context।"), mt("Review reconciliation and multi-year movement.","Reconciliation ও multi-year review।")],
        ],
      },
    ],
  },

  {
    id: "s06",
    number: "06",
    area: "analysis",
    sourceOrder: "Analyze",
    title: mt("Income × Expenditure Lens", "Income × Expenditure Lens"),
    description: mt("Expenditure is IT-10BB Total, and Sl. 8 already includes current-year TDS plus prior-year return-based tax/surcharge.","Expenditure = IT-10BB Total; Sl. 8-এ চলতি বছরের TDS এবং গত বছরের tax/surcharge আগেই আছে।"),
    keywords: ["income expenditure","net wealth","matrix","expenditure floor","c4"],
    blocks: [
      {
        kind: "callout",
        tone: "warning",
        title: mt("E0 is not a risk color","E0 কোনো risk রং পায় না"),
        text: mt("Zero expenditure is usually missing/unfiled data and belongs to Data Quality/Coverage. R-C4 handles genuinely but unusually low expenditure, and its floor is a policy decision.","শূন্য expenditure সাধারণত অদাখিল/ফাঁকা data — Data Quality/Coverage। বাস্তব কিন্তু অস্বাভাবিক কম খরচ R-C4; floor policy decision।"),
      },
      {
        kind: "table",
        title: mt("Lens logic — when net wealth increased or stayed flat","Lens logic — Net Wealth বেড়েছে / অপরিবর্তিত"),
        columns: [mt("Condition","Condition"), mt("Priority / rule meaning","Priority / rule meaning"), mt("Treatment","Treatment")],
        rows: [
          [same("E0"), mt("Coverage/Data Quality — no risk rule.","Coverage/Data Quality — risk rule নয়।"), mt("Correct DQ; reconciliation does not run.","DQ correction; reconciliation চলবে না।")],
          [mt("Income=0 and expenditure exists","Income=0 কিন্তু expenditure আছে"), mt("P2/P3 depending on expenditure; C1 expenditure-driven, A1 context.","Expenditure অনুযায়ী P2/P3; C1 expenditure-driven, A1 context।"), mt("Check exempt income and gifts/receipts first.","1(b) exempt income ও 1(c) gift/receipt আগে।")],
          [mt("Expenditure > income","Expenditure > income"), mt("P2; P3 if expenditure ≥2× income. C1 meaningful/possibly strong.","P2; expenditure ≥2× income হলে P3। C1 meaningful/সম্ভাব্য strong।"), mt("Check liabilities and declared receipts; then review remaining gap.","Liability ও declared receipt দেখে gap review।")],
          [mt("Expenditure ≥60% of income while wealth rises","Expenditure ≥60% of income, wealth rises"), mt("P1; C1 depends on materiality.","P1; C1 materiality-নির্ভর।"), mt("Compute the actual gap before any decision.","Decision-এর আগে actual gap হিসাব।")],
          [mt("High income with very low expenditure","High income, খুব কম expenditure"), mt("P1; R-C4 subject to policy floor.","P1; policy floor সাপেক্ষে R-C4।"), mt("Check household composition and living context.","Household composition ও living context যাচাই।")],
        ],
      },
      {
        kind: "table",
        title: mt("Lens logic — when net wealth decreased","Lens logic — Net Wealth কমেছে"),
        columns: [mt("Condition","Condition"), mt("Priority / rule meaning","Priority / rule meaning"), mt("Treatment","Treatment")],
        rows: [
          [same("E0"), mt("Coverage/Data Quality — no risk rule.","Coverage/Data Quality — risk rule নয়।"), mt("Correct DQ.","DQ correction।")],
          [mt("Expenditure > income","Expenditure > income"), mt("Usually P1; P2 if extreme. Falling wealth may validly fund expenditure.","সাধারণত P1; extreme হলে P2। Wealth কমে খরচ fund হওয়া বৈধ হতে পারে।"), mt("Compare the fall in wealth with the gap.","Wealth হ্রাস বনাম gap মিলান।")],
          [mt("High income, low expenditure, but wealth also falls","High income, low expenditure, wealth falls"), mt("R-C4 + negative-gap C1 may both need explanation.","R-C4 + negative-gap C1 ব্যাখ্যা দরকার হতে পারে।"), mt("Check IT-10B 4(b) for undeclared gift/loss.","IT-10B 4(b)-তে gift/loss দেখুন।")],
          [mt("Expenditure within income and wealth falls slightly","Expenditure income-এর মধ্যে, wealth সামান্য কমেছে"), mt("No signal in this lens.","এই lens-এ signal নেই।"), mt("No action from this lens.","এই lens থেকে পদক্ষেপ নয়।")],
        ],
      },
    ],
  },

  {
    id: "s07",
    number: "07",
    area: "controls",
    sourceOrder: "Analyze",
    title: mt("Funds-flow Reconciliation — IT-10B's own arithmetic", "Funds-flow Reconciliation — IT-10B যা ইতিমধ্যেই করে"),
    description: mt("The system rechecks the form's own funds-flow; it does not invent a new legal concept.","System form-এর নিজস্ব funds-flow আবার যাচাই করে; নতুন আইনি ধারণা তৈরি করে না।"),
    keywords: ["reconciliation","line 10","line 7","gross wealth","sources","uses","materiality","calculator"],
    blocks: [
      {
        kind: "formula",
        title: mt("Exact source formulas","Exact source formula"),
        lines: [
          same("Sources of Fund = IT-10B 1(a) Total Income (Return Sl. 11) + 1(b) Tax Exempted Income (Sl. 26) + 1(c) Receipt of Gift and Others"),
          same("3 = 1 + 2 (Net Wealth as on Last Date of Previous Income Year)"),
          same("4. Total Expense and Loss = 4(a) IT-10BB Total + 4(b) Gift / Expenses / Loss not in IT-10BB"),
          same("5. Net Wealth = 3 − 4"),
          same("7. Gross Wealth = 5 + 6 (Personal Liabilities Outside Business)"),
          same("Reconciliation Gap = 10 (Total Assets) − 7 (Gross Wealth)"),
          mt("Equivalent form: Gap = (Assets − Liabilities − Previous NW) − (Sources − Uses) = ΔNet Wealth − (Sources − Uses)","সমতুল্য: Gap = (Assets − Liabilities − Previous NW) − (Sources − Uses) = ΔNet Wealth − (Sources − Uses)"),
        ],
      },
      {
        kind: "callout",
        tone: "critical",
        title: mt("Critical independence requirement","Critical independence requirement"),
        text: mt("Lines 10 and 7 must be independently derived. If eReturn fills one from the other, the gap is always zero. Line 10 should be recorded as the sum of 8(a–k)+9 and compared with line 7.","Line 10 ও 7 স্বাধীনভাবে নির্ণীত হতে হবে। একটিকে অন্যটি থেকে পূরণ করলে gap সর্বদা zero। Line 10 = 8(a–k)+9 হিসেবে আলাদাভাবে record করে line 7-এর সাথে compare করতে হবে।"),
      },
      {
        kind: "table",
        title: mt("Design rules from the form","Design rules — form থেকে, অনুমান থেকে নয়"),
        columns: [mt("Rule","নিয়ম"), mt("Source basis","ভিত্তি")],
        rows: [
          [mt("Do not subtract tax separately","Tax আলাদাভাবে বাদ যাবে না"), mt("IT-10BB Sl. 8 already includes current-year TDS/collected tax plus prior-year return tax/surcharge. Return Sl. 23 belongs to the current return and should not be double-counted in the current IT-10BB.","IT-10BB Sl. 8-এ চলতি বছরের TDS/collected tax + গত বছরের tax/surcharge আছে। Return Sl. 23 চলতি IT-10BB-তে নেই; double count করা যাবে না।")],
          [mt("Loan is not a Source","Loan কোনো Source নয়"), mt("Loans do not appear in Sources of Fund; personal liabilities enter Gross Wealth through line 6.","Loan Sources of Fund-এ নেই; personal liability line 6 হয়ে Gross Wealth-এ যায়।")],
          [mt("Assets use cost basis","Asset cost basis-এ"), mt("The form uses acquisition/cost value with legal/registration expense for relevant asset lines.","Form relevant asset line-এ acquisition/cost value with legal/registration expense ব্যবহার করে।")],
          [mt("8(a) is already net","8(a) ইতিমধ্যেই net"), mt("Total Asset of Business less Business Liabilities; business liabilities must not be added again in line 6.","Total Asset of Business less Business Liabilities; business liability line 6-এ আবার যোগ নয়।")],
          [mt("Previous NW comes from the system","Previous NW system থেকে"), mt("Line 2 should equal prior-year line 5; mismatch is R-C3. First filing is NULL, not zero.","Line 2 গত বছরের line 5; mismatch হলে R-C3। First filing-এ NULL, zero নয়।")],
          [mt("IT-10B is not mandatory for everyone","IT-10B সবার জন্য নয়"), mt("Source triggers include public servant, total asset above 40 lakh, or below that with motor car, city-corporation house/apartment, foreign asset, or shareholder-director status. IT-10BB filing obligation is not separately established by this form and needs legal validation.","Trigger: public servant; মোট asset ৪০ lakh-এর বেশি; অথবা কম হলেও motor car, city corporation house/apartment, foreign asset, shareholder director। IT-10BB obligation আলাদাভাবে established নয় — legal validation।")],
        ],
      },
      {
        kind: "table",
        title: mt("Reconciliation calculator fields and defaults","Reconciliation calculator field ও default"),
        columns: [mt("Field","Field"), mt("Meaning / default","Meaning / default")],
        rows: [
          [same("1(a)"),same("Total Income (Sl. 11)")],
          [same("1(b)"),same("Tax Exempted Income (Sl. 26)")],
          [same("1(c)"),same("Receipt of Gift & Others")],
          [same("2"),same("Previous Year Net Wealth")],
          [mt("Previous line 5","গত বছরের line 5"),mt("Optional continuity check","Optional continuity check")],
          [same("4(a)"),same("IT-10BB Total")],
          [same("4(b)"),same("Other Gift / Expense / Loss")],
          [same("6"),same("Personal Liabilities")],
          [same("10"),mt("Total Assets — independently declared","Total Assets — স্বাধীনভাবে ঘোষিত")],
          [mt("Materiality %","Materiality %"),same("10%")],
          [mt("Materiality minimum","Materiality minimum"),same("2 lakh BDT")],
        ],
        note: mt("Materiality = max(Sources × 10%, 2 lakh) in the source configuration. It is configuration, not statutory.","Source configuration-এ Materiality = max(Sources × 10%, 2 lakh)। এটি Configuration, statutory নয়।"),
      },
    ],
  },

  {
    id: "s09",
    number: "09",
    area: "controls",
    sourceOrder: "Analyze",
    title: mt("Control Flags F — separate path", "Control Flags F — সম্পূর্ণ আলাদা path"),
    description: mt("Form-consistency and filing-obligation controls are not substantive risk. No F flag raises Risk Level without a separately approved versioned policy rule.","Form consistency ও filing-obligation control substantive risk নয়। আলাদা approved versioned policy rule ছাড়া F flag Risk Level বাড়ায় না।"),
    keywords: ["control flags","f0","f1","f2","f3","f4","f5","arithmetic"],
    blocks: [
      {
        kind: "callout",
        tone: "info",
        title: mt("F0 is the cheapest and safest control","F0 সবচেয়ে সস্তা ও নিরাপদ control"),
        text: mt("F0 is fully deterministic: Sl. 11=Σ1–10; 14=12−13; 16=max(14,15); 19=16+17+18; 24=Σ20–23; IT-10B 3=1+2; 5=3−4; 7=5+6; 10=8+9. The source says its false-positive rate is near zero and recommends hard validation at input.","F0 সম্পূর্ণ deterministic: Sl. 11=Σ1–10; 14=12−13; 16=max(14,15); 19=16+17+18; 24=Σ20–23; IT-10B 3=1+2; 5=3−4; 7=5+6; 10=8+9। Source বলছে FP rate প্রায় শূন্য; input-এ hard validation ভালো।"),
      },
    ],
  },

  {
    id: "s10",
    number: "10",
    area: "screening",
    sourceOrder: "Reference",
    title: mt("Deduplication — count the same fact once", "Deduplication — একই তথ্য একবারই গোনা হয়"),
    description: mt("Same fact is counted once. Different fact plus different evidence family can become independent corroboration.","একই fact একবার গণনা। ভিন্ন fact + ভিন্ন evidence family = independent corroboration।"),
    keywords: ["dedup","factkey","evidence family","context","same family","independent"],
    blocks: [
      {
        kind: "table",
        columns: [mt("Rule","নিয়ম"), mt("Meaning","অর্থ"), mt("Effect on Risk Level","Risk Level-এ প্রভাব")],
        rows: [
          [same("Same fact"), mt("Multiple rules arise from the same underlying number/event.","একই সংখ্যা বা ঘটনা থেকে একাধিক rule।"), mt("Count the strongest once.","সবচেয়ে শক্তিশালীটি একবার গণনা।")],
          [same("Context"), mt("A less precise form of the same fact when a more precise measure exists.","নির্ভুল measure থাকলে একই fact-এর কম নির্ভুল রূপ।"), mt("Visible, but not independently counted.","দৃশ্যমান, আলাদা গণনা নয়।")],
          [same("Independent"), mt("Different fact and different evidence family.","ভিন্ন fact এবং ভিন্ন evidence family।"), mt("May increase the level.","Level বাড়াতে পারে।")],
          [same("Same-family"), mt("Different fact but same evidence family.","ভিন্ন fact, একই evidence family।"), mt("Not independent; does not raise the level by itself.","স্বাধীন নয়; নিজে level বাড়ায় না।")],
          [same("Control Flag (F)"), mt("Form/filing issue.","Form বা দাখিল-সংক্রান্ত ত্রুটি।"), mt("Separate queue; no level effect without approved policy rule.","আলাদা queue; approved policy rule ছাড়া Level স্পর্শ করে না।")],
        ],
      },
    ],
  },

  {
    id: "s11",
    number: "11",
    area: "screening",
    sourceOrder: "Reference",
    title: mt("Risk Level and SLA", "Risk Level ও SLA"),
    description: mt("No numeric score: Detect → Deduplicate → strength and independence → Level → SLA → human review.","কোনো numeric score নেই: Detect → Deduplicate → strength ও independence → Level → SLA → human review।"),
    keywords: ["risk level","sla","low","medium","high","very high","configuration"],
    blocks: [
      {
        kind: "table",
        title: mt("Level logic from CONFIG","CONFIG থেকে Level logic"),
        columns: [same("Risk Level"), mt("Trigger","Trigger"), mt("Officer action","Officer action"), mt("Configured SLA","Configured SLA")],
        rows: [
          [same("Low"), mt("No signal, or one weak signal.","কোনো signal নেই, বা একটিমাত্র weak signal।"), mt("No action.","কোনো পদক্ষেপ নয়।"), same("—")],
          [same("Medium"), mt("One meaningful signal, or at least two independent weak signals.","একটি meaningful signal, বা ≥2 independent weak signal।"), same("Review queue"), same("—")],
          [same("High"), mt("One strong signal, or at least two independent meaningful signals.","একটি strong signal, বা ≥2 independent meaningful signal।"), mt("Detailed review + verification","Detailed review + verification"), mt("3 working days — configuration","3 কার্যদিবস — configuration")],
          [same("Very High"), mt("Strong signal plus an independent meaningful/strong signal from a different evidence family.","Strong signal + ভিন্ন evidence family থেকে independent meaningful/strong signal।"), mt("Priority review + verification","Priority review + verification"), mt("1 working day — configuration","1 কার্যদিবস — configuration")],
        ],
        note: mt("One strong signal alone = High, not Very High. Coverage and Control Flags never raise Risk Level. SLA day counts are configuration, not statutory.","একটি strong signal একা = High, Very High নয়। Coverage ও Control Flag Risk Level বাড়ায় না। SLA day count Configuration, statutory নয়।"),
      },
    ],
  },

  {
    id: "s14",
    number: "14",
    area: "controls",
    sourceOrder: "Reference",
    title: mt("Loophole → Control Matrix", "Loophole → Control Matrix"),
    keywords: ["loophole","mandatory control","critical","important","known limitation"],
    blocks: [
      {
        kind: "table",
        columns: [same("#"), mt("Loophole","Loophole"), mt("How it happens","কীভাবে ঘটে"), mt("Mandatory control","Mandatory control"), mt("Class","Class")],
        rows: [
          [same("1"),same("Line 10 = line 7 plug"),mt("eReturn or taxpayer fills Total Assets from Gross Wealth.","eReturn বা taxpayer Total Assets-কে Gross Wealth থেকে পূরণ করে।"),mt("Line 10 must be summed from 8(a–k)+9; store and compare both paths independently.","10 অবশ্যই 8(a–k)+9 থেকে যোগ হবে; উভয় পথ আলাদাভাবে সংরক্ষণ ও তুলনা।"),same("Critical")],
          [same("2"),same("Missing treated as zero"),mt("Blank input silently becomes 0.","ফাঁকা ঘর নীরবে 0।"),mt("NULL ≠ 0 storage; do not create a gap when a component is missing.","NULL ≠ 0 storage; component missing হলে gap নয়।"),same("Critical")],
          [same("3"),same("Opening wealth restated"),mt("Increase line 2 to erase the gap.","Line 2 বাড়িয়ে gap মুছে ফেলা।"),mt("System-populate/read-only line 2 from prior-year line 5; mismatch → R-C3.","Line 2 prior-year line 5 থেকে system-populated/read-only; mismatch → R-C3।"),same("Critical")],
          [same("4"),mt("Statement not filed","Statement না দেওয়া"),mt("IT-10B/IT-10BB missing although obligation applies.","বাধ্যবাধকতা থাকা সত্ত্বেও statement অনুপস্থিত।"),mt("F5 control queue; distinguish NOT REQUIRED from INCOMPLETE.","F5 control queue; NOT REQUIRED বনাম INCOMPLETE আলাদা।"),same("Critical")],
          [same("5"),same("Cash in hand balancing figure"),mt("Unexplained amount placed in 8(k)(ii).","অব্যাখ্যাত অর্থ 8(k)(ii)-তে জমা।"),mt("Show cash-in-hand separately; large increase becomes a visible gap driver at DT2.","Cash in hand আলাদা line; বড় বৃদ্ধি gap driver হিসেবে visible (DT2)।"),same("Important")],
          [same("6"),mt("Fictitious liability","কাল্পনিক liability"),mt("Fake loan in line 6 raises Gross Wealth.","Line 6-এ অস্তিত্বহীন ঋণ দেখিয়ে Gross Wealth বাড়ানো।"),mt("For large new liability capture lender identity/document and cross-check lender return.","বড় নতুন liability-তে lender identity/document; lender return cross-check।"),same("Important")],
          [same("7"),mt("Understated expenditure","Expenditure কম দেখানো"),mt("Lower IT-10BB to make the gap reconcile.","IT-10BB কমিয়ে gap মেলানো।"),mt("R-C4 floor (policy) + year-over-year fall + household composition.","R-C4 floor (policy) + YoY পতন + household composition।"),same("Important")],
          [same("8"),mt("Understated asset","Asset কম দেখানো"),mt("Self-declared values have no independent check.","Self-declared মূল্য; independent check নেই।"),mt("Registry cross-check R-E2, subject to legal basis.","Registry cross-check R-E2 — legal basis সাপেক্ষে।"),same("Important")],
          [same("9"),mt("Revision after trigger","Trigger-এর পরে সংশোধন"),mt("Revised return after flag/review.","Flag হওয়ার পর revised return।"),mt("Keep original immutable, create new version, keep prior signal open; R-D3.","Original অক্ষত; new version; prior signal বন্ধ নয়; R-D3।"),same("Critical")],
          [same("10"),mt("High-risk case suppressed","High-risk case চাপা পড়া"),mt("High/Very High result never gets a case.","High/Very High case কখনো খোলা হয়নি।"),mt("Every High+ result must have a matching case; reconciliation report and alert.","প্রতিটি High+ result-এর matching case; reconciliation report ও alert।"),same("Critical")],
          [same("11"),mt("Closure without evidence","প্রমাণ ছাড়া closure"),mt("No minimum evidence rule.","ন্যূনতম evidence নিয়ম নেই।"),mt("High+ closure requires documented review and second-officer sign-off.","High+ closure-এ documented review + second-officer sign-off।"),same("Critical")],
          [same("12"),mt("Unlogged data access","লগবিহীন data access"),mt("Only edits are logged, not views.","শুধু edit log, view নয়।"),mt("Log every access/query; role-based access.","প্রতিটি access/query log; role-based access।"),same("Critical")],
          [same("13"),mt("Assets in family member's name","সম্পদ পরিবারের নামে"),mt("Asset held by taxpayer spouse or adult child.","Spouse (taxpayer) বা adult child-এর নামে asset।"),mt("Instruction (6) already captures non-taxpayer spouse/minor/dependant; taxpayer spouse requires TIN linkage subject to legal basis.","Instruction (6) অনুযায়ী non-taxpayer spouse/minor/dependant IT-10B-তে; taxpayer spouse-এ TIN linkage — legal basis সাপেক্ষে।"),same("Known limitation")],
          [same("14"),mt("Cash-based activity","নগদ-ভিত্তিক কার্যক্রম"),mt("All rules depend on declared/recorded data.","সব rule declared/recorded data-নির্ভর।"),mt("Recognize the limitation; Low does not mean clean; use external/field audit.","স্বীকৃত limitation; Low মানে clean নয়; external ও field audit।"),same("Known limitation")],
        ],
      },
    ],
  },

  {
    id: "s15",
    number: "15",
    area: "governance",
    sourceOrder: "Management",
    title: mt("Unresolved Questions — blockers before development", "Unresolved Questions — development-এর আগে blocker"),
    description: mt("Each row is an explicit dependency. The source does not guess an answer.","প্রতিটি সারি explicit dependency। Source কোনো উত্তর অনুমান করেনি।"),
    keywords: ["unresolved","dependency","line 10","line 2","tax paid","obligation","surcharge","external","expenditure floor","household","tds","liability","versioning"],
    blocks: [
      {
        kind: "table",
        columns: [mt("Question","প্রশ্ন"), mt("Why important","কেন গুরুত্বপূর্ণ"), mt("Current assumption","বর্তমান অনুমান"), mt("Evidence needed","যে প্রমাণ দরকার"), mt("Owner","কে নিশ্চিত করবে"), mt("What breaks if wrong","ভুল হলে কী ভাঙে")],
        rows: [
          [mt("How is line 10 created in eReturn?","eReturn-এ line 10 কীভাবে তৈরি হয়?"),mt("The existence of the gap depends on it.","Gap-এর অস্তিত্বই এর উপর নির্ভরশীল।"),mt("Assumed independently declared.","স্বাধীনভাবে ঘোষিত ধরা হয়েছে।"),mt("eReturn form logic, DB schema, sample return.","eReturn form logic, DB schema, নমুনা return।"),same("eReturn dev team / IT wing"),mt("C1 always zero; reconciliation fails.","C1 সর্বদা zero; reconciliation অকার্যকর।")],
          [mt("Where does line 2 opening wealth come from?","Line 2 opening wealth কোথা থেকে আসে?"),mt("Continuity and manipulation control.","Continuity ও manipulation control।"),mt("Should be system-populated.","System-populated হওয়া উচিত।"),mt("Current behavior and edit permission.","বর্তমান behavior ও edit permission।"),same("eReturn dev team"),mt("C3 becomes meaningless; opening wealth can erase the gap.","C3 অর্থহীন; opening wealth দিয়ে gap মোছা যাবে।")],
          [mt("Where is current-year tax paid mapped?","চলতি বছরের tax paid কোথায় mapped?"),mt("IT-10BB Sl. 8 contains prior-year tax; double-count risk.","IT-10BB Sl. 8-এ prior-year tax; double-count risk।"),mt("Sl. 23 is not in current IT-10BB.","Sl. 23 চলতি IT-10BB-তে নেই।"),mt("Temporal check on a sample return.","নমুনা return-এ temporal যাচাই।"),same("Tax policy + eReturn"),mt("Artificial gap on every return.","প্রতিটি return-এ artificial gap।")],
          [mt("How does the system know IT-10B obligation?","IT-10B obligation system কীভাবে বুঝবে?"),mt("Needed for F5 and NOT REQUIRED coverage.","F5 ও Coverage NOT REQUIRED-এর ভিত্তি।"),mt("Assumes trigger data exists somewhere.","Trigger data কোথাও আছে ধরা হয়েছে।"),mt("Source for car/property/director data; prior IT-10B.","গাড়ি/সম্পত্তি/director data source; prior IT-10B।"),same("NBR data owner + Legal"),mt("Circularity: if statement is missing, trigger may also be unknown.","Statement missing হলে trigger-ও জানা যাবে না।")],
          [mt("What is IT-10BB filing obligation?","IT-10BB-র দাখিল-বাধ্যবাধকতা কী?"),mt("Basis for Coverage and C4.","Coverage ও C4-এর ভিত্তি।"),mt("Unknown; not assumed identical to IT-10B.","IT-10B-এর মতো ধরা হয়নি — অজানা।"),mt("Relevant Act/Rules provision.","Act/Rules-এর ধারা।"),same("Legal branch"),mt("Non-filers may be wrongly treated as defective.","Non-filer-কে ভুলভাবে defective দেখানো।")],
          [mt("Net wealth surcharge threshold and base","Net wealth surcharge threshold ও base"),mt("Entire basis of F2.","F2-এর সম্পূর্ণ ভিত্তি।"),mt("Base assumed line 5; threshold unknown.","Base = line 5 net wealth; threshold unknown।"),mt("Relevant Finance Act.","প্রাসঙ্গিক Finance Act।"),same("Tax policy wing"),mt("Widespread false flags and legal risk.","ব্যাপক false flag; legal risk।")],
          [mt("Legal basis for external data","External data-র আইনি ভিত্তি"),mt("Determines whether E1–E3 may run.","E1–E3 চালানো যাবে কিনা।"),mt("None yet; shadow only.","এখনো নেই — shadow only।"),mt("Source-specific agreements and legal approval.","প্রতিটি source-এর agreement ও legal approval।"),same("Legal + data owner"),mt("Unlawful use and litigation.","অবৈধ ব্যবহার; মামলা।")],
          [mt("Expenditure floor","Expenditure floor"),mt("Condition for C4.","C4 চালানোর শর্ত।"),mt("Not defined.","নির্ধারিত নয়।"),mt("Household benchmark and policy approval.","Household benchmark + policy approval।"),same("Management + policy"),mt("Technology team effectively sets an enforcement threshold.","Technology team enforcement threshold ঠিক করে ফেলবে।")],
          [mt("Where is household composition?","Household composition কোথায়?"),mt("Controls C4 false positives.","C4 false positive control।"),mt("Not in return except spouse/dependant asset context.","Return-এ নেই, spouse/dependant asset ছাড়া।"),mt("Decision whether to add a field.","Field যোগ হবে কিনা।"),same("Form owner"),mt("C4 false-positive rate may become unacceptable.","C4 FP rate অগ্রহণযোগ্য।")],
          [same("Source-coded TDS"),mt("Needed for precise A3.","A3 precision-এর জন্য।"),mt("Assumes section code and rate table exist.","Section code ও rate table আছে ধরা হয়েছে।"),mt("Withholding system schema.","Withholding system schema।"),same("eTDS team"),mt("A3 remains coarse; implied income may be wrong.","A3 coarse; implied income ভুল হতে পারে।")],
          [mt("Liability verification","Liability যাচাই"),mt("Controls fictitious loan.","কাল্পনিক ঋণ control।"),mt("No lender information assumed.","Lender তথ্য নেই।"),mt("Check whether form/schema has lender fields.","Form/schema-তে lender field আছে কিনা।"),same("Form owner"),mt("Gap can be easily erased.","Gap সহজে মোছা যাবে।")],
          [same("Versioning model"),mt("Historical results must remain explainable.","পুরনো ফল explainable থাকা।"),mt("Separate return / rule / classification versions.","Return / rule / classification আলাদা version।"),mt("Architecture decision.","Architecture সিদ্ধান্ত।"),same("Solution architect"),mt("System can no longer answer why a flag fired.","কেন flag হয়েছিল উত্তর দেওয়া যাবে না।")],
        ],
      },
    ],
  },

  {
    id: "s16",
    number: "16",
    area: "governance",
    sourceOrder: "Reference",
    title: mt("Audit Trail — prototype versus production", "Audit Trail — prototype বনাম production"),
    keywords: ["audit trail","append only","identity","event","assessment","human","access","version"],
    blocks: [
      {
        kind: "callout",
        tone: "critical",
        title: mt("Prototype warning","Prototype warning"),
        text: mt("The HTML decision panel stores selections in browser localStorage. That is not an audit record. Production must be server-side, append-only and access-controlled.","HTML decision panel browser localStorage-এ selection রাখে। এটি audit record নয়। Production server-side, append-only ও access-controlled হতে হবে।"),
      },
      {
        kind: "table",
        title: mt("Required audit-trail fields","Audit-trail field"),
        columns: [mt("Group","Group"), mt("Fields","Fields")],
        rows: [
          [same("Identity"),same("Return ID · TIN · Assessment Year · Return Version")],
          [same("Event"),mt("Event ID · Sequence no. (prototype) · Timestamp — server UTC (production) · Actor ID · Role · Action","Event ID · Sequence no. (prototype) · Timestamp — server UTC (production) · Actor ID · Role · Action")],
          [same("Data state"),same("Data Quality status · Coverage / Tier · Input snapshot hash · Previous → New value")],
          [same("Assessment"),same("Rule ID + version · Signal strength · Dedup decision · Risk Level · Control Flags · Reason code")],
          [same("Human"),same("Signal-wise verification · Evidence ID → signal link · Finding → supportedBy[] · Sign-off: signals + evidence + basis · Closure state + reason")],
          [same("Access"),same("View / query log · Export log · Purpose code")],
        ],
      },
      {
        kind: "callout",
        title: mt("Nothing is overwritten","Nothing is overwritten"),
        text: mt("No role gets delete permission. A correction creates a new event. System assessment and later human review remain separate events with separate actors.","কোনো role delete permission পাবে না। Correction মানে নতুন event। System assessment এবং human review আলাদা event, আলাদা actor।"),
      },
      {
        kind: "table",
        title: mt("Three separate versions","তিন ধরনের version"),
        columns: [mt("Version","Version"), mt("Records","কী record করে"), mt("Why","কেন")],
        rows: [
          [same("Return Version"),mt("Every original/revised submission","প্রতিটি original/revised submission"),mt("What was originally filed?","মূলত কী দাখিল হয়েছিল?")],
          [same("Classification Version"),mt("Band definition and effective date","Band definition ও effective date"),mt("Changing thresholds must not change the meaning of historical A2.","Threshold বদলালেও historical A2-এর অর্থ বদলাবে না।")],
          [same("Rule / Config Version"),mt("Rule logic, materiality, floor, rate table","Rule logic, materiality, floor, rate table"),mt("Reconstruct mechanically why a flag fired.","কেন flag হয়েছিল mechanically reconstruct।")],
        ],
      },
    ],
  },

  {
    id: "s17",
    number: "17",
    area: "governance",
    sourceOrder: "Reference",
    title: mt("Production Architecture — source recommendations", "Production Architecture — source recommendation"),
    keywords: ["architecture","rule engine","configuration","versioning","audit trail","data lineage","case management","scale","security"],
    blocks: [
      {
        kind: "table",
        columns: [mt("Layer","স্তর"), mt("Recommendation","সুপারিশ"), mt("Reason","কারণ")],
        rows: [
          [same("Rule engine"),mt("Declarative rule definition: required data elements, condition, strength, fact, family, version; each evaluation returns fired / not-fired / not-eligible with reason.","Declarative rule definition: data requirement, condition, strength, fact, family, version; evaluation fired / not-fired / not-eligible + reason।"),mt("Not eligible and not fired are different; this keeps Coverage separate from Risk.","not eligible ও not fired আলাদা; Coverage risk থেকে আলাদা থাকে।")],
          [same("Configuration"),mt("Effective-dated config store for bands, materiality, floors, rate table and surcharge threshold, with maker-checker approval.","Band, materiality, floor, rate table, surcharge threshold effective-dated config store + maker-checker।"),mt("Law changes by year; old results must remain reproducible.","আইন বছরে বদলায়; পুরনো ফল reproducible থাকতে হবে।")],
          [same("Versioning"),mt("Separate Return, Classification and Rule/Config versions; every assessment references all three.","Return, Classification, Rule/Config আলাদা version; assessment তিনটিকেই reference করবে।"),mt("Explainability and reproducibility.","Explainability ও reproducibility।")],
          [same("Audit trail"),mt("Append-only event store; WORM/hash-chain; no delete permission; separate access log.","Append-only event store; WORM/hash-chain; delete permission নয়; separate access log।"),mt("Neither officer nor DBA can rewrite history.","Officer বা DBA ইতিহাস বদলাতে পারবে না।")],
          [same("Data lineage"),mt("Persist every signal's fields, values and source version/external snapshot.","Signal-এর field, value, source version/external snapshot persist।"),mt("Officer can see the exact numbers without recomputing.","Officer exact number দেখতে পারবেন; recompute দরকার নেই।")],
          [same("Case management"),mt("Separate Risk case and Control/DQ queues; SLA, sign-off, override reason; daily reconciliation for score-without-case mismatches.","Risk case ও Control/DQ case আলাদা queue; SLA, sign-off, override reason; score আছে কিন্তু case নেই — daily reconciliation।"),mt("Prevents loophole 10.","Loophole 10 ঠেকায়।")],
          [same("Scale"),mt("Batch scoring once after submission; pre-computed bands; external matches in a separate asynchronous pipeline.","Submission-এর পর batch scoring; pre-computed band; external match async pipeline।"),mt("Designed for very large return volume; do not compute live in UI.","লক্ষাধিক return; UI-তে live calculation নয়।")],
          [same("Security"),mt("Role-based access, purpose code, masked TIN in lists, export approval.","Role-based access, purpose code, list-এ masked TIN, export approval।"),mt("Taxpayer data is sensitive; logs are essential to detect snooping.","Taxpayer data sensitive; snooping ধরতে log দরকার।")],
        ],
      },
    ],
  },

  {
    id: "s18",
    number: "18",
    area: "workflow",
    sourceOrder: "Reference",
    title: mt("End-to-End Flow", "End-to-End Flow"),
    keywords: ["flow","return submitted","data quality","coverage","classification","reconciliation","signals","case selection","verification","finding","closure","audit trail","shadow mode"],
    blocks: [
      {
        kind: "flow",
        steps: [
          {label: mt("Return Submitted","Return Submitted"),note: same("immutable v1")},
          {label: mt("Data Quality gate","Data Quality gate"),note: same("NULL / invalid / F0")},
          {label: mt("Coverage / Data Tier","Coverage / Data Tier"),note: same("DT0–DT3")},
          {label: mt("Classification and Profile Code","Classification ও Profile Code"),note: same("versioned")},
          {label: same("Funds-flow Reconciliation"),note: same("DT1+")},
          {label: mt("A–E Signals → dedup → Risk Level","A–E Signals → dedup → Risk Level"),note: mt("with reason","reason সহ")},
          {label: same("Case Selection"),note: same("reconciled")},
          {label: mt("Evidence request → Verification","Evidence request → Verification"),note: same("Verified / Refuted / …")},
          {label: mt("Finding + Second-officer sign-off","Finding + Second-officer sign-off"),note: same("High / Very High")},
          {label: mt("Closure with reason","Closure (কারণসহ)"),note: mt("Only place for a Finding","একমাত্র Finding-এর স্থান")},
          {label: same("Immutable Audit Trail"),note: mt("event at every step","প্রতিটি ধাপে event")},
        ],
        sideNote: mt("F0–F5 Control Flags branch to a separate Control/Compliance queue and never touch Risk Level.","F0–F5 Control Flags আলাদা Control/Compliance queue-তে যায় এবং Risk Level স্পর্শ করে না।"),
      },
      {
        kind: "callout",
        title: mt("Data Quality side branch","Data Quality side branch"),
        text: mt("Blank or invalid fields move the return out of scoring into DQ status. A correction creates a new Return Version and the chain restarts. Bad data never becomes a compliance finding.","ফাঁকা/invalid field return-কে scoring থেকে DQ status-এ সরায়। Correction-এ new Return Version এবং chain restart। খারাপ data compliance finding হয় না।"),
      },
      {
        kind: "list",
        title: mt("Four separate activities","চারটি আলাদা কার্যক্রম"),
        items: [same("Screening"),same("Verification"),same("Audit"),same("Final Determination")],
      },
      {
        kind: "callout",
        title: same("Shadow mode"),
        text: mt("New rules first record only. Live routing begins after hit-rate and false-positive-rate measurement.","নতুন rule প্রথমে শুধু record করবে; hit rate ও false positive rate মাপার পর live routing।"),
      },
    ],
  },

  {
    id: "s19",
    number: "19",
    area: "governance",
    sourceOrder: "Management",
    title: mt("Management Decision Panel", "Management Decision Panel"),
    description: mt("What is ready, what needs calibration, and what must not yet be automated.","কী প্রস্তুত, কী calibration চায়, কী এখনো automate করা যাবে না।"),
    keywords: ["management","decision","ready","calibration","not automated","agree","modify","defer"],
    blocks: [
      {
        kind: "table",
        title: mt("Management classification","Management classification"),
        columns: [mt("Class","Class"), mt("Items","Items")],
        rows: [
          [mt("Ready","প্রস্তুত"),mt("Data Quality gate and NULL ≠ 0 · Coverage/Data Tier · F0 arithmetic and F1 carry-forward · append-only audit trail, return versioning, access logging · verification workflow and rule-based evidence checklist.","Data Quality gate ও NULL ≠ 0 · Coverage/Data Tier · F0 arithmetic ও F1 carry-forward · append-only audit trail, return versioning, access logging · verification workflow ও rule-based evidence checklist।")],
          [mt("Needs calibration","Calibration দরকার"),mt("Band/materiality thresholds · SLA days and escalation path · A2 category/minimum-tax · A3 rate/source code · C1 after line-10 independence then shadow mode.","Band/materiality threshold · SLA day ও escalation · A2 category/minimum tax · A3 rate/source code · line-10 independence-এর পর C1 shadow mode।")],
          [mt("Not automated yet","এখনো স্বয়ংক্রিয় নয়"),mt("E-group without legal basis · F2 surcharge threshold/base · C4 expenditure floor · F5 obligation trigger source · automated assessment, demand or Final Outcome.","Legal basis ছাড়া E-group · F2 surcharge threshold/base · C4 expenditure floor · F5 obligation trigger source · automated assessment, demand বা Final Outcome।")],
        ],
      },
      {
        kind: "table",
        title: mt("Decisions required in the meeting","সভায় সিদ্ধান্ত"),
        columns: [mt("Decision","Decision"), mt("Still unknown","যা এখনো জানা নেই"), mt("Prototype choices","Prototype choice")],
        rows: [
          [mt("Is IT-10B line 10 independently declared?","IT-10B line 10 কি independently declared?"),mt("eReturn form logic and sample return unresolved.","eReturn form logic ও sample return unresolved।"),same("Agree / Modify first / Defer / more evidence")],
          [mt("Adopt the policy of keeping five outputs separate?","পাঁচটি output আলাদা রাখার নীতি গৃহীত?"),mt("Officer workflow review pending.","Officer workflow review বাকি।"),same("Agree / Modify first / Defer / more evidence")],
          [mt("Can Control Flag ever raise Risk Level?","Control Flag কি কখনো Risk Level বাড়াবে?"),mt("Proposal: no, unless a written policy rule says so.","প্রস্তাব: না — written policy rule ছাড়া নয়।"),same("Agree / Modify first / Defer / more evidence")],
          [mt("Approve SLA: High 3 / Very High 1 working days?","SLA High 3 / Very High 1 কার্যদিবস অনুমোদিত?"),mt("Verification capacity and staffing.","Verification সক্ষমতা ও জনবল।"),same("Agree / Modify first / Defer / more evidence")],
          [mt("Mandatory second-officer sign-off for High/Very High?","High/Very High-এ second-officer sign-off বাধ্যতামূলক?"),mt("Role matrix and segregation of duties.","Role matrix ও দায়িত্ব বিভাজন।"),same("Agree / Modify first / Defer / more evidence")],
          [mt("Is external data legally usable?","External data কি আইনত ব্যবহারযোগ্য?"),mt("Source-specific legal basis unresolved.","উৎসভিত্তিক legal basis unresolved।"),same("Agree / Modify first / Defer / more evidence")],
          [mt("Shadow-mode pilot before production?","Production-এর আগে shadow-mode pilot?"),mt("Pilot scope and acceptable false-positive threshold.","Pilot scope ও acceptable false-positive limit।"),same("Agree / Modify first / Defer / more evidence")],
        ],
        note: mt("In the source prototype these choices exist only in browser localStorage and are explicitly not official records.","Source prototype-এ selection browser localStorage-এ থাকে এবং official record নয়।"),
      },
      {
        kind: "text",
        title: mt("Source basis note","Source basis note"),
        text: mt("IT-11Ga (2023) — Return Sl. 1–26, Schedule 1–5, IT-10B, IT-10BB. Threshold, strength, materiality and SLA are illustrative configuration where the form itself does not establish them; some items require legal validation.","IT-11Ga (2023) — Return Sl. 1–26, Schedule 1–5, IT-10B, IT-10BB। Threshold, strength, materiality ও SLA illustrative configuration; form থেকে ভিত্তি না থাকলে legal validation/configuration হিসেবে চিহ্নিত।"),
      },
    ],
  },
];
