import { mt, type ManualBlock, type ManualSection } from "./auditManualTypes";

const same = (v: string) => mt(v, v);

export const AUDIT_MANUAL_RULE_SECTIONS: ManualSection[] = [
  {
    id: "s08",
    number: "08",
    area: "screening",
    sourceOrder: "Analyze",
    title: mt("Risk Signals A–E", "Risk Signals A–E"),
    description: mt(
      "These are the only substantive signals that determine Risk Level. Each signal carries a fact/factKey and evidence family for deduplication.",
      "এগুলোই একমাত্র substantive signal যা Risk Level নির্ধারণ করে। প্রতিটির fact/factKey ও evidence family deduplication-এ ব্যবহৃত হয়।"
    ),
    keywords: ["risk signals","r-a1","r-a2","r-a3","r-b1","r-b2","r-c1","r-c2","r-c3","r-c4","r-d1","r-d2","r-d3","r-e1","r-e2","r-e3","factkey","evidence family","false positive"],
    blocks: [
      {
        kind: "table",
        title: mt("Rule register — trigger and metadata", "Rule register — trigger ও metadata"),
        columns: [
          same("Rule"), mt("Group","Group"), mt("Signal","Signal"), mt("Condition","Condition"),
          mt("Strength","Strength"), mt("Requires","Requires"), mt("Fact / family","Fact / family"),
          mt("FP risk","FP risk"), mt("Source markers","Source marker")
        ],
        rows: [
          [same("R-A1"),mt("A — Basic anomaly","A — Basic anomaly"),mt("Zero income + declared asset","Zero income + declared asset"),same("Sl. 11 = 0, Sl. 16 = 0, IT-10B 10 > 0"),mt("weak → strong (by asset band)","weak → strong (asset band অনুযায়ী)"),same("RET + ASSET (DT1)"),mt("zero-income — শূন্য আয়ের বিপরীতে সম্পদ · internal-level","zero-income — শূন্য আয়ের বিপরীতে সম্পদ · internal-level"),same("High"),mt("Context when reconciliation runs","Reconciliation চললে context")],
          [same("R-A2"),mt("A — Basic anomaly","A — Basic anomaly"),mt("Income exists, Tax Payable is zero","Income আছে, Tax Payable শূন্য"),same("Sl. 11 > 0 and Sl. 16 = 0"),mt("weak → meaningful at higher band","weak → meaningful (উঁচু band-এ)"),same("RET"),mt("tax-zero — আয় আছে, tax payable শূন্য · internal-tax","tax-zero — আয় আছে, tax payable শূন্য · internal-tax"),same("High"),same("Configuration · Legal validation")],
          [same("R-A3"),mt("A — Basic anomaly","A — Basic anomaly"),mt("TDS-implied income floor","TDS-implied income floor"),mt("Source-wise declared income < TDS ÷ applicable rate (Sl. 20 versus Sl. 1–10)","Source-wise declared income < TDS ÷ প্রযোজ্য rate (Sl. 20 বনাম Sl. 1–10)"),same("meaningful"),mt("RET + TDS; precise with DT2 source code","RET + TDS (precise: DT2 source code)"),mt("tds-floor — TDS অনুযায়ী ন্যূনতম আয় · internal-tax","tds-floor — TDS অনুযায়ী ন্যূনতম আয় · internal-tax"),same("Medium"),same("Configuration")],
          [same("R-B1"),mt("B — Year-on-Year Change","B — Year-on-Year Change"),mt("Large asset increase","বড় asset বৃদ্ধি"),mt("IT-10B 10 increases ≥ X% or ≥ Y BDT from prior year","IT-10B 10 আগের বছরের তুলনায় ≥ X% বা ≥ Y টাকা বৃদ্ধি"),same("meaningful"),same("ASSET + HIST"),mt("asset-growth — সম্পদের বৃদ্ধি · internal-change","asset-growth — সম্পদের বৃদ্ধি · internal-change"),same("High"),same("Context · Configuration")],
          [same("R-B2"),mt("B — Year-on-Year Change","B — Year-on-Year Change"),mt("Income falls while asset rises","Income কমছে, asset বাড়ছে"),mt("Income falls materially while asset rises in the same year","Income উল্লেখযোগ্য হারে কমেছে, একই বছরে asset বেড়েছে"),same("meaningful"),same("RET + ASSET + HIST"),mt("asset-growth — সম্পদের বৃদ্ধি · internal-change","asset-growth — সম্পদের বৃদ্ধি · internal-change"),same("Medium"),same("Context · Configuration")],
          [same("R-C1"),mt("C — Funds-flow Reconciliation","C — Funds-flow Reconciliation"),mt("Reconciliation gap","Reconciliation gap"),same("| IT-10B 10 − 7 | > materiality"),mt("meaningful → strong when > 3× materiality","meaningful → strong (> ৩× materiality)"),mt("Complete IT-10B set (DT1)","সম্পূর্ণ IT-10B set (DT1)"),mt("funds-gap — Funds-flow gap · funds-flow","funds-gap — Funds-flow gap · funds-flow"),same("Medium"),same("Configuration")],
          [same("R-C2"),mt("C — Funds-flow Reconciliation","C — Funds-flow Reconciliation"),mt("Multi-year cumulative gap","Multi-year cumulative gap"),mt("3–5 year cumulative gap > materiality, or ≥2 years in same direction","৩–৫ বছরের cumulative gap > materiality, বা ≥ ২ বছর একই দিকে"),same("strong"),mt("DT1 + HIST across multiple years","DT1 + HIST (একাধিক বছর)"),mt("funds-gap-multi — বহু-বছরের funds-flow gap · funds-flow","funds-gap-multi — বহু-বছরের funds-flow gap · funds-flow"),same("Medium"),same("Configuration")],
          [same("R-C3"),mt("C — Funds-flow Reconciliation","C — Funds-flow Reconciliation"),mt("Opening wealth continuity break","Opening wealth continuity break"),same("IT-10B 2 ≠ prior-year IT-10B 5"),same("meaningful"),same("PREVNW + HIST"),mt("continuity — Opening wealth ধারাবাহিকতা · funds-flow","continuity — Opening wealth ধারাবাহিকতা · funds-flow"),same("High"),same("—")],
          [same("R-C4"),mt("C — Funds-flow Reconciliation","C — Funds-flow Reconciliation"),mt("Unrealistically low expenditure","অবাস্তব রকম কম expenditure"),mt("IT-10BB Total below defined household floor, or sharp fall despite unchanged household","IT-10BB Total < নির্ধারিত household floor, বা household অপরিবর্তিত থেকেও তীব্র পতন"),same("meaningful"),same("EXP (+HIST)"),mt("expenditure-level — ঘোষিত খরচের মাত্রা · funds-flow","expenditure-level — ঘোষিত খরচের মাত্রা · funds-flow"),same("High"),same("Configuration · Legal validation")],
          [same("R-D1"),mt("D — Behavioural Pattern","D — Behavioural Pattern"),mt("Persistent zero income / zero tax","ধারাবাহিক zero income / zero tax"),mt("≥3 years Sl. 11 = 0, or Sl. 11 > 0 while Sl. 16 = 0","≥ ৩ বছর Sl. 11 = 0, বা Sl. 11 > 0 সত্ত্বেও Sl. 16 = 0"),mt("weak → meaningful","weak → meaningful"),same("RET + HIST"),mt("zero-income — শূন্য আয়ের বিপরীতে সম্পদ · behavioural","zero-income — শূন্য আয়ের বিপরীতে সম্পদ · behavioural"),same("High"),same("—")],
          [same("R-D2"),mt("D — Behavioural Pattern","D — Behavioural Pattern"),mt("Alternating declaration pattern","পর্যায়ক্রমিক declaration pattern"),mt("Large asset / low expenditure in low-income year, then back to prior pattern","কম-income বছরে বড় asset/কম expenditure, পরের বছর আগের অবস্থায়"),same("meaningful"),same("HIST (3+ years)"),mt("pattern — বহু-বছরের declaration pattern · behavioural","pattern — বহু-বছরের declaration pattern · behavioural"),same("Medium"),same("Configuration")],
          [same("R-D3"),mt("D — Behavioural Pattern","D — Behavioural Pattern"),mt("Revision after trigger","Trigger-এর পরে সংশোধন"),mt("Revised return within X days after flag or review opens","Flag বা review খোলার X দিনের মধ্যে revised return"),mt("weak → meaningful","weak → meaningful"),same("HIST + event log"),mt("amendment — Trigger-এর পরে সংশোধন · behavioural","amendment — Trigger-এর পরে সংশোধন · behavioural"),same("Medium"),same("Configuration")],
          [same("R-E1"),mt("E — External Cross-check","E — External Cross-check"),mt("Payroll / third-party income mismatch","Payroll / third-party income mismatch"),mt("External source indicates more income than declared","External উৎস declared-এর চেয়ে বেশি income নির্দেশ করে"),same("strong"),same("EXT (legal basis)"),mt("payroll — External payroll তথ্য · external","payroll — External payroll তথ্য · external"),same("Medium"),same("Legal validation")],
          [same("R-E2"),mt("E — External Cross-check","E — External Cross-check"),mt("Asset registry mismatch","Asset registry mismatch"),mt("Registry contains more asset than declared","Registry-তে declared-এর চেয়ে বেশি asset"),same("strong"),same("EXT (legal basis)"),mt("registry — External registry তথ্য · external","registry — External registry তথ্য · external"),same("Medium"),same("Legal validation")],
          [same("R-E3"),mt("E — External Cross-check","E — External Cross-check"),mt("VAT turnover mismatch","VAT turnover mismatch"),mt("VAT turnover is inconsistent with declared business income","VAT turnover declared business income-এর তুলনায় অসামঞ্জস্যপূর্ণ"),same("strong"),same("EXT (legal basis)"),mt("vat — External VAT turnover · external","vat — External VAT turnover · external"),same("Medium"),same("Legal validation")],
        ],
      },
      {
        kind: "table",
        title: mt("Rule register — explanation, legitimate explanation and note", "Rule register — explanation, বৈধ ব্যাখ্যা ও note"),
        columns: [same("Rule"), mt("What it detects","কী detect করে"), mt("Why important","কেন গুরুত্বপূর্ণ"), mt("Legitimate explanations","বৈধ ব্যাখ্যা"), same("Note")],
        rows: [
          [same("R-A1"),mt("Severity rises with asset band: A1 weak, A2 meaningful, A3+ strong.","Asset band অনুযায়ী severity বাড়ে: A1 weak, A2 meaningful, A3+ strong।"),mt("A coarse funding proxy at DT1.","DT1-এ funding প্রশ্নের একটি মোটা proxy।"),mt("Retiree, homemaker, student, loss year, joint ownership.","অবসরভোগী, গৃহিণী, শিক্ষার্থী, loss year, যৌথ মালিকানা।"),mt("When reconciliation runs, this becomes context because C1 answers the same question more precisely. It cannot run at DT0.","Reconciliation চললে context — C1 একই প্রশ্নের নির্ভুল উত্তর দেয়। Asset ছাড়া DT0-তে চলে না।")],
          [same("R-A2"),mt("Sl. 16 is higher of Sl. 14 and 15, so zero may be unusual when minimum tax applies.","Sl. 16 = higher of (14,15); minimum tax প্রযোজ্য হলে zero হওয়ার কথা নয়।"),mt("Zero tax at high income band is unusual.","উঁচু income band-এ zero tax অস্বাভাবিক।"),mt("Threshold, special category in Sl. 8, Schedule 5 rebate, exempt income, minimum tax not applicable.","Threshold, Sl. 8 special category, Schedule 5 rebate, exempt income, minimum tax অপ্রযোজ্য।"),mt("Without taxpayer category Sl. 8 and residential status Sl. 6, false positives are inevitable.","Taxpayer category Sl. 8 ও residential status Sl. 6 ছাড়া false positive অনিবার্য।")],
          [same("R-A3"),mt("Derives implied gross income from tax withheld and the applicable rate, then compares with declared income.","কাটা কর ও rate থেকে implied gross income; declared তার নিচে হলে gap।"),mt("TDS is NBR's own data, not external.","TDS NBR-এর নিজস্ব data — external নয়।"),mt("Wrong TIN, final-settlement income, multiple rates, period mismatch.","ভুল TIN, final-settlement income, একাধিক rate, period mismatch।"),mt("Rate table and section code are not established by this form; they are configuration dependencies.","Rate table ও section code এই form থেকে established নয় — configuration dependency।")],
          [same("R-B1"),mt("Change in asset without considering liabilities/expenditure.","Liability ও expenditure বিবেচনা ছাড়া asset-এর পরিবর্তন।"),mt("A proxy when history exists but IT-10B is incomplete.","History আছে কিন্তু IT-10B অসম্পূর্ণ হলে proxy।"),mt("Loan-funded purchase, inheritance, gift, reinvestment of sale proceeds.","Loan-funded ক্রয়, উত্তরাধিকার, উপহার, asset বিক্রির অর্থ পুনর্বিনিয়োগ।"),mt("When reconciliation runs it becomes context; otherwise valid loan-funded purchases can false-positive.","Reconciliation চললে context; নইলে বৈধ loan-funded purchase false positive।")],
          [same("R-B2"),mt("Income and asset move in opposite directions.","দুটি সূচক বিপরীত দিকে।"),mt("Proxy for income smoothing.","Income-smoothing-এর proxy।"),mt("Retirement + gratuity, job loss + inheritance.","অবসর + gratuity, চাকরি হারানো + উত্তরাধিকার।"),mt("Same fact as B1; the two are not two independent signals.","B1-এর সাথে একই fact — একসাথে দুটি signal নয়।")],
          [same("R-C1"),mt("Declared asset versus gross wealth derived from funds-flow. Positive gap = unexplained asset; negative gap = unexplained expense/shortfall at lower strength.","Declared asset বনাম funds-flow gross wealth। Positive = unexplained asset; negative = unexplained expense/shortfall (কম strength)।"),mt("More precise than A1/B1/B2; valid loan and declared gift fall out automatically.","A1/B1/B2-এর চেয়ে নির্ভুল; বৈধ loan ও declared gift নিজে থেকেই বাদ পড়ে।"),mt("Undeclared but legitimate gift, cost/market-value mix, arithmetic error, genuine loss.","অঘোষিত কিন্তু বৈধ gift, cost বনাম market value, হিসাব ভুল, genuine loss।"),mt("If line 10 is not independent, this rule measures nothing. Gap driver belongs in the reason, not a separate rule.","Line 10 স্বাধীন না হলে rule কিছুই মাপে না। Gap driver reason-এ যায়, আলাদা rule নয়।")],
          [same("R-C2"),mt("Small annual gaps that accumulate or persist in the same direction.","প্রতি বছর সামান্য, কিন্তু জমে বড়।"),mt("Smooths one-year noise.","একক বছরের noise smooth করে।"),mt("Consistent valuation error, long-term family support.","ধারাবাহিক valuation ভুল, দীর্ঘমেয়াদি family support।"),mt("For a single-year gap it is the same fact as C1 and is counted once.","এক বছরের gap হলে C1-এর সাথে একই fact — একবার গণনা।")],
          [same("R-C3"),mt("Prior closing wealth and current opening wealth do not continue.","গত বছরের শেষ wealth এ বছর ভিন্ন অঙ্কে শুরু।"),mt("Opening wealth can be increased to erase the current gap.","Opening wealth বাড়িয়ে current gap মুছে ফেলা যায়।"),mt("Data migration, revised prior return, cost correction.","Data migration, গত বছরের revised return, cost correction।"),mt("Resolve Data Quality first; it becomes a signal only when the continuity break occurs after a risk trigger. Not applicable to first filing: NULL, not zero.","প্রথমে Data Quality; risk trigger-এর পরে ঘটলে তবেই signal। First filing-এ প্রযোজ্য নয়: NULL, zero নয়।")],
          [same("R-C4"),mt("Declared lifestyle expenditure is implausibly low, often making reconciliation easier to game.","Declared lifestyle expenditure বাস্তবসম্মত নয় — gap মেলাতে সাহায্য করতে পারে।"),mt("Without a floor reconciliation can be gamed.","Floor ছাড়া reconciliation সহজে gamed।"),mt("Another household member pays, rural living, much of year abroad.","অন্য সদস্য খরচ বহন করেন, গ্রামে বসবাস, বছরের বড় অংশ বিদেশে।"),mt("The floor is a policy decision. Zero/blank IT-10BB is Coverage, not this rule.","Floor policy decision। Zero/blank IT-10BB Coverage, এই rule নয়।")],
          [same("R-D1"),mt("Persistence across years even when each year may be ordinary by itself.","প্রতি বছর আলাদাভাবে সাধারণ, কিন্তু ধারাবাহিকতা লক্ষণীয়।"),mt("Persistence increases confidence.","Persistence confidence বাড়ায়।"),mt("Retiree, homemaker, consistently below threshold.","অবসরভোগী, গৃহিণী, স্থায়ীভাবে threshold-এর নিচে।"),mt("Same zero-income fact as A1, so not independently counted. Exempt income keeps strength weak.","A1-এর একই zero-income fact — আলাদা গণনা নয়। Exempt income থাকলে strength weak।")],
          [same("R-D2"),mt("Alternating declarations that may avoid thresholds.","Threshold এড়াতে পর্যায়ক্রমিক ঘোষণা।"),mt("Visible only as a multi-year pattern.","শুধু multi-year pattern হিসেবে দৃশ্যমান।"),mt("Seasonal or project-based income.","Seasonal বা project-based income।"),mt("Requires longer history; source marks it as later phase.","বড় history দরকার — source-এ later phase।")],
          [same("R-D3"),mt("Declaration changes after a signal/review opens.","Signal-এর পরে declaration পরিবর্তন।"),mt("Timing is the signal, not the correction itself.","Timing নিজেই signal — correction নয়।"),mt("Simple error corrected after notice.","Notice পেয়ে সরল ভুল correction।"),mt("Prior return version and prior signal remain immutable; revision never automatically closes the signal.","আগের version ও signal অক্ষত; revision signal বন্ধ করে না।")],
          [same("R-E1"),mt("Mismatch between independent payroll/third-party source and declared income.","Independent source বনাম declared income mismatch।"),mt("Different evidence family, useful as corroboration.","ভিন্ন evidence family — corroboration মূল্যবান।"),mt("Employer reporting error, wrong TIN, period mismatch.","Employer ভুল reporting, ভুল TIN, period mismatch।"),mt("External data is not proof. Record confidence and snapshot date.","External data ≠ proof। Confidence ও snapshot date record করতে হবে।")],
          [same("R-E2"),mt("Registered asset missing or understated in IT-10B.","Registered asset IT-10B-তে নেই বা কম।"),mt("Tests reconciliation's weakest assumption: declared asset truth.","Reconciliation-এর দুর্বলতম assumption — declared asset — যাচাই করে।"),mt("Joint ownership, cost versus registered value, stale registry data.","Joint ownership, cost বনাম registered value, পুরনো registry data।"),mt("Same external family as E1, so E1+E2 alone do not create Very High.","E1-এর একই external family; E1+E2 একা Very High নয়।")],
          [same("R-E3"),mt("VAT turnover grows while declared business income stays inconsistent.","VAT turnover বনাম declared business income অসঙ্গতি।"),mt("Coordinates income tax and VAT information.","IT ও VAT তথ্য সমন্বয়।"),mt("Low margin, different period, group registration.","কম margin, ভিন্ন period, group registration।"),mt("Requires an institutional joint-review process.","Joint review-এর institutional process দরকার।")],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: mt(
          "Data Validation is not a Risk Signal. Negative values, malformed numeric input and arithmetic errors belong to Section 03 / F0. Income > 0 but Asset = 0 alone is a wealth-statement completeness question, not a substantive signal.",
          "Data Validation risk rule নয়। Negative, malformed ও arithmetic error Section 03/F0-তে। Income > 0 কিন্তু Asset = 0 একা substantive signal নয়; wealth-statement completeness প্রশ্ন।"
        ),
      },
    ],
  },

  {
    id: "s13",
    number: "13",
    area: "workflow",
    sourceOrder: "Reference",
    title: mt("Verification-First Audit Workflow", "Verification-First Audit Workflow"),
    description: mt(
      "Detect first, verify before deciding. A signal does not become a Finding by itself, and verification does not create a second score or change Risk Level.",
      "আগে detect, সিদ্ধান্তের আগে verify। Signal নিজে Finding হয় না; Verification নতুন score নয় এবং Risk Level বাড়ায়/কমায় না।"
    ),
    keywords: ["verification","evidence","finding","second officer","closure","sla milestone","external gate","verified","refuted"],
    blocks: [
      {
        kind: "flow",
        title: mt("Source sequence","Source sequence"),
        steps: [
          {label:same("Detect")},{label:same("Validate")},{label:same("Verify")},{label:same("Deduplicate")},
          {label:same("Assess")},{label:same("Evidence")},{label:same("Second review")},{label:same("Close")}
        ],
      },
      {
        kind: "table",
        title: mt("Ten-step verification workflow","দশ ধাপের verification workflow"),
        columns: [same("#"), mt("Step","ধাপ"), mt("What to do","কী করতে হবে"), mt("System records","System যা record করে")],
        rows: [
          [same("1"),same("Identify"),mt("Confirm TIN, assessment year, return version and the data snapshot used.","TIN, assessment year, return version ও data snapshot নিশ্চিত।"),same("Return ID + version + snapshot hash")],
          [same("2"),same("Validate source data"),mt("Check completeness, validity, rule eligibility and correct source linkage.","ঘর পূরণ, মান valid, rule চালানোর মতো data, source linkage যাচাই।"),same("Data Quality status + Coverage / Tier")],
          [same("3"),same("Verify the trigger"),mt("Show each fired signal's rule ID/version, condition, actual values used, source of each value, snapshot date, and whether source is internal/external.","প্রতিটি fired signal-এর rule ID/version, condition, actual value, প্রতিটি value-এর source, snapshot date, internal/external সব দৃশ্যমান।"),same("Signal event + data lineage")],
          [same("4"),same("Verify independence"),mt("Before final Level, decide whether facts/families are truly different or alternate expressions of the same information.","Final Level-এর আগে fact/family ভিন্ন নাকি একই তথ্যের অন্য রূপ নির্ধারণ।"),mt("Dedup decision + reason","Dedup সিদ্ধান্ত ও কারণ")],
          [same("5"),same("Assign Risk Level"),mt("Use the same no-weight logic. Verification status does not alter Level.","একই no-weight logic; verification status Level বদলায় না।"),same("Level + reason + rule version")],
          [same("6"),same("Evidence request"),mt("For Medium/High/Very High, request rule-based items; never generic documents merely because the case is high-risk.","Medium/High/Very High-এ rule-based checklist; শুধু high-risk বলে generic document নয়।"),mt("Requested items + date","Requested items + তারিখ")],
          [same("7"),mt("Independent verification — each signal separately","Independent verification — প্রতিটি signal আলাদা"),mt("For each fired signal select Verified / Partially verified / Not verified / Refuted / Unable to verify, with reason and evidence linked to that signal. C1 Verified, E2 Refuted and D3 Pending may coexist.","প্রতিটি fired signal-এর জন্য Verified / Partially verified / Not verified / Refuted / Unable to verify + reason + linked evidence। C1 Verified, E2 Refuted, D3 Pending পাশাপাশি থাকতে পারে।"),mt("Signal verification event: signal, status, reason, evidence","Signal verification event: signal, status, reason, evidence")],
          [same("8"),same("Human finding"),mt("Finding must identify the verified signal and linked evidence: Signal verified → Evidence linked → Finding. Pending or Refuted signals cannot support a Finding.","Finding verified signal ও linked evidence উল্লেখ করবে: Signal verified → Evidence linked → Finding। Pending/Refuted signal থেকে Finding নয়।"),same("Finding ID + supportedBy(signal) + evidence ID")],
          [same("9"),same("Second-officer review"),mt("Name the signals and evidence actually reviewed. Generic 'Reviewed and approved' is not acceptable.","কোন signal/evidence review হয়েছে নাম ধরে বলতে হবে; generic 'Reviewed and approved' নয়।"),same("Case ID, signal ID, evidence ref, basis, officer ID, sequence/timestamp")],
          [same("10"),same("Closure"),mt("Closure requires a reason and must be compatible with verification state. Verified → explanation accepted / further action. Refuted → no inconsistency established. Partial/Not verified → further action or evidence insufficient, never 'explanation accepted'. Unable → evidence insufficient / further action.","Closure reason বাধ্যতামূলক এবং verification-এর সাথে compatible: Verified → explanation accepted/আরও ব্যবস্থা; Refuted → no inconsistency; Partial/Not verified → আরও ব্যবস্থা বা evidence insufficient, কখনো explanation accepted নয়; Unable → evidence insufficient/আরও ব্যবস্থা।"),same("Level + signals + verification + evidence + decision + sign-off + time")],
        ],
      },
      {
        kind: "table",
        title: mt("Verification and closure states","Verification ও closure state"),
        columns: [mt("Type","Type"), mt("Values / precedence","Value / precedence"), mt("Source rule","Source rule")],
        rows: [
          [same("Verification states"),same("Pending · Verified · Partially verified · Not verified · Refuted · Unable to verify"),mt("A Finding is permitted only from Verified signals.","Finding শুধু Verified signal থেকে।")],
          [same("Closure states"),mt("Closed — no inconsistency established · Closed — explanation accepted · Further action required · Evidence insufficient to decide","Closed — কোনো অসঙ্গতি প্রতিষ্ঠিত হয়নি · Closed — ব্যাখ্যা গৃহীত · আরও ব্যবস্থা প্রয়োজন · প্রাপ্ত প্রমাণে সিদ্ধান্তে আসা যায়নি"),mt("Closure state must be compatible with the governing verification status.","Closure governing verification status-এর সাথে compatible হতে হবে।")],
          [same("Status precedence"),same("Verified → Partially verified → Not verified → Unable to verify → Refuted"),mt("Used to determine governing status when signals have mixed outcomes.","Mixed outcome case-এ governing status নির্ধারণে।")],
        ],
      },
      {
        kind: "table",
        title: mt("Rule-based evidence checklist","Rule-ভিত্তিক evidence checklist"),
        columns: [same("Signal"), mt("Evidence requested","যে প্রমাণ চাওয়া হবে")],
        rows: [
          [same("R-A1"),mt("Source of assets · proof of income type (pension / exempt / taxable) · joint-ownership deed","সম্পদের উৎস · income type (pension/exempt/taxable) proof · যৌথ মালিকানা দলিল")],
          [same("R-A2"),mt("Rebate calculation basis (Schedule 5) · exemption or special-category proof (Sl. 8)","Rebate calculation basis (Schedule 5) · exemption/special category proof (Sl. 8)")],
          [same("R-A3"),mt("TDS certificate · source and section code · basis of applicable rate","TDS certificate · source ও section code · applicable rate basis")],
          [same("R-B1"),mt("Acquisition document and value · financing source (loan / gift / sale)","অধিগ্রহণ দলিল ও value · financing source (ঋণ/উপহার/বিক্রয়)")],
          [same("R-B2"),mt("Proof of employment/business change · documents supporting income decline","চাকরি/ব্যবসা change proof · income decline document")],
          [same("R-C1"),mt("According to gap driver: undeclared receipt document, loan agreement and lender identity, or asset valuation basis · bank statement for the relevant period","Gap driver অনুযায়ী: undeclared receipt দলিল, loan agreement+lender identity, অথবা asset valuation basis · relevant period bank statement")],
          [same("R-C2"),mt("Multi-year reconciliation statement · explanation of consistent valuation method","Multi-year reconciliation statement · ধারাবাহিক valuation method explanation")],
          [same("R-C3"),mt("Prior-year return and IT-10B line 5 · proof of migration or revision","Prior-year return ও IT-10B line 5 · migration/revision proof")],
          [same("R-C4"),mt("Household composition and who bears expenditure · proof of residence/location","পরিবারের গঠন ও কে খরচ বহন করেন · বসবাসের অবস্থান proof")],
          [same("R-D1"),mt("Description of income type and source","Income type ও source description")],
          [same("R-D2"),mt("Multi-year continuity of income and assets","Multi-year income ও asset continuity")],
          [same("R-D3"),mt("Reason for amendment and supporting documents","Amendment reason ও supporting document")],
          [same("R-E1"),mt("Employer record and TIN linkage · salary statement / TDS certificate","Employer record ও TIN linkage · salary statement/TDS certificate")],
          [same("R-E2"),mt("Ownership share and deed · registry extract and date","Ownership share ও deed · registry extract ও date")],
          [same("R-E3"),mt("VAT return and turnover details · BIN ↔ TIN linkage proof","VAT return ও turnover detail · BIN ↔ TIN linkage proof")],
        ],
      },
      {
        kind: "table",
        title: mt("External data verification gate — E-group","External data verification gate — E-group"),
        columns: [same("Source"), mt("Snapshot date","Snapshot date"), mt("Matching key","Matching key"), mt("Match confidence","Match confidence"), mt("Verification status","Verification status")],
        rows: [
          [same("Payroll / withholding"),mt("Date data was pulled","ডেটা টানার তারিখ"),same("TIN + employer ID + period"),same("High / Medium / Low"),same("Pending → Verified / Refuted")],
          [same("Property / vehicle registry"),mt("Registry extract date","Registry extract-এর তারিখ"),mt("TIN / NID + deed or registration no.","TIN/NID + দলিল বা registration নম্বর"),same("High / Medium / Low"),same("Pending → Verified / Refuted")],
          [same("VAT turnover"),mt("Return-period end","Return period শেষ"),same("BIN ↔ TIN linkage"),same("High / Medium / Low"),same("Pending → Verified / Refuted")],
        ],
        note: mt("A wrong external match refutes only that signal. The original signal event remains immutable and the later outcome is a separate event.","ভুল external match শুধু সেই signal-কে Refuted করে। Original signal event মুছে যায় না; পরের outcome আলাদা event।"),
      },
      {
        kind: "table",
        title: mt("SLA milestones","SLA milestone"),
        columns: [same("Milestone"), mt("What is recorded","কী record হয়")],
        rows: [
          [same("Case opened"),mt("Time, opener, Level and originating signal","সময়, কে খুলেছে, কোন Level ও কোন signal থেকে")],
          [same("Verification started"),mt("Officer identity and time","Officer পরিচয় ও সময়")],
          [same("Evidence requested"),mt("Rule-based checklist and sent time","Rule-based checklist ও পাঠানোর সময়")],
          [same("Evidence received"),mt("Each item, source and date","প্রতিটি item, source ও date")],
          [same("Verification completed"),same("Verified / Partially / Not / Refuted / Unable + reason")],
          [same("Second-officer review completed"),mt("Identity, written basis and time","পরিচয়, written basis, সময়")],
          [same("Case closed"),mt("Closure state and reason","Closure state ও কারণ")],
        ],
      },
      {
        kind: "list",
        title: mt("Case-model behaviour enforced by the source engine","Source engine-এর case-model behaviour"),
        items: [
          mt("Case, Signal, Evidence, Verification Outcome and Finding are separate objects/concepts.","Case ≠ Signal ≠ Evidence ≠ Verification Outcome ≠ Finding।"),
          mt("Evidence must be linked to one or more specific signals; missing/invalid data is not accepted as evidence.","Evidence নির্দিষ্ট signal-এর সাথে linked; missing/invalid data evidence নয়।"),
          mt("A signal cannot be verified with evidence linked only to another signal.","অন্য signal-এর evidence দিয়ে verification নয়।"),
          mt("Verification requires a non-Pending valid status, a reason and at least one linked evidence reference.","Verification-এ valid non-Pending status, reason, linked evidence দরকার।"),
          mt("Refuting an external signal never deletes the signal or the case-opening event.","External signal refute হলেও original signal/case-opening event অক্ষত।"),
          mt("A Finding requires at least one Verified signal plus linked evidence and records supportedBy signal IDs and evidence IDs.","Finding-এর জন্য Verified signal + linked evidence; supportedBy signal/evidence ID record।"),
          mt("Second-officer sign-off requires a different officer, named signals, named linked evidence and a meaningful written basis; generic approval text is rejected.","Second-officer sign-off: আলাদা officer, named signals, linked evidence, meaningful basis; generic approval reject।"),
          mt("High/Very High cases cannot close while any signal is Pending; closure needs evidence and second-officer sign-off.","High/Very High case-এ Pending signal থাকলে closure নয়; evidence + second-officer sign-off দরকার।"),
          mt("One case has one SLA clock; a breach escalation event is created once and reused on later checks.","Case-এ এক SLA clock; breach escalation event একবারই।"),
          mt("Events are append-only with sequence numbers in the prototype; production requires server UTC timestamps.","Prototype event append-only seq number; production-এ server UTC timestamp দরকার।"),
        ],
      },
    ],
  },
];

export const AUDIT_MANUAL_SUPPLEMENT_BLOCKS: Record<string, ManualBlock[]> = {
  s09: [
    {
      kind: "table",
      title: mt("Complete Control Flag register","সম্পূর্ণ Control Flag register"),
      columns: [same("Flag"), mt("Check","Check"), mt("Source","Source"), mt("Queue","Queue"), mt("Dependency","Dependency")],
      rows: [
        [same("F0"),same("Form arithmetic: Sl. 11 = Σ(1–10); 14 = 12 − 13; 16 = max(14,15); 19 = 16+17+18; 24 = Σ(20–23); IT-10B 3 = 1+2; 5 = 3−4; 7 = 5+6; 10 = 8+9"),same("Return + IT-10B"),same("Data Quality / Control"),mt("No dependency — fully deterministic","কোনো dependency নেই — fully deterministic")],
        [same("F1"),same("Return Sl. 11 ≠ IT-10B 1(a), or Sl. 26 ≠ IT-10B 1(b)"),same("Return ↔ IT-10B"),same("Control"),mt("Both statements must be filed (DT1)","দুটি statement-ই দাখিল হতে হবে (DT1)")],
        [same("F2"),same("IT-10B 5 Net Wealth exceeds surcharge threshold but Sl. 17(a) = 0"),same("IT-10B 5 ↔ Return 17(a)"),same("Control"),mt("Threshold and base are not established by the form; Finance Act required","Threshold ও base form থেকে established নয় — Finance Act দরকার")],
        [same("F3"),same("Schedule 4 Drawing (13) inconsistent with IT-10BB Total; Closing Capital (14) ↔ IT-10B 8(a)"),same("Schedule 4 ↔ IT-10B/IT-10BB"),same("Control"),mt("Business return; DT2 component data","Business return; DT2 component data")],
        [same("F4"),same("Schedule 5 Total Investment (11) not reflected in IT-10B financial asset or expenditure"),same("Schedule 5 ↔ IT-10B 8(f)"),same("Control"),mt("DT2 component data; life-insurance premium is not an asset","DT2 component data; life insurance premium asset নয়")],
        [same("F5"),same("IT-10B/IT-10BB filing obligation applies but statement is missing"),mt("Trigger described in the form","Form-এ বর্ণিত trigger"),same("Compliance"),mt("Source of trigger evidence is unresolved — circularity in Section 15","Trigger-এর evidence source unresolved — Section 15 circularity")],
      ],
      note: mt("F flags are a separate path. No F flag automatically increases substantive Risk Level.","F flag আলাদা path। কোনো F flag substantive Risk Level নিজে থেকে বাড়ায় না।"),
    },
  ],
  s10: [
    {
      kind: "table",
      title: mt("Dependency / deduplication combinations","Dependency / deduplication combination"),
      columns: [mt("Combination","Combination"), mt("Decision","Decision"), mt("Why","কেন")],
      rows: [
        [same("A1 + B1 + B2"),mt("Count once","একবার"),mt("All ask the same underlying question about unexplained declared asset. With reconciliation they are context; otherwise count the strongest once.","তিনটিই unexplained declared asset-এর মূল প্রশ্ন। Reconciliation হলে context; না হলে strongest একবার।")],
        [same("A1 + D1"),mt("Once — same fact","একবার — একই fact"),mt("Both use factKey zero-income. D1 adds persistence and may increase strength, not count.","দুটির factKey zero-income। D1 persistence যোগ করে; strength বাড়তে পারে, count নয়।")],
        [same("C1 + A1/B1/B2"),same("Context"),mt("C1 measures the question more precisely; proxies remain in reason, not score/level counting.","C1 একই প্রশ্ন নির্ভুলভাবে মাপে; proxy reason-এ থাকে, count-এ নয়।")],
        [same("C1 + C4"),mt("Usually once","সাধারণত একবার"),mt("Low expenditure can shrink the same gap. C4 becomes independent only when gap is zero while expenditure remains below the floor, revealing a different fact.","কম expenditure একই gap ছোট করে। Gap zero অথচ expenditure floor-এর নিচে হলে C4 ভিন্ন fact হিসেবে independent।")],
        [same("C1 + C3"),mt("Not independent, but both shown","স্বাধীন নয়, দুটোই দেখানো"),mt("Changing opening wealth changes the gap. C3 must be resolved first; initially Data Quality.","Opening wealth বদলালে gap বদলে যায়। C3 আগে resolve; প্রথমে Data Quality।")],
        [same("C1 + E1"),same("Independent corroboration"),mt("Different fact and family: internal funds-flow vs external payroll; Very High can become possible.","ভিন্ন fact/family: internal funds-flow বনাম external payroll; Very High সম্ভব।")],
        [same("C1 + E2"),same("Independent corroboration"),mt("Registry tests the truth of the declared asset assumption behind reconciliation.","Registry reconciliation-এর declared-asset assumption যাচাই করে।")],
        [same("E1 + E2"),mt("Not independent","স্বাধীন নয়"),mt("Same external evidence family. Together they do not create Very High; maximum High under this logic.","একই external family; একসাথে Very High নয়, সর্বোচ্চ High।")],
        [same("F1 + C1"),same("Separate path"),mt("F1 is a form inconsistency and makes the C1 input suspect; mark C1 provisional while F1 is open.","F1 form inconsistency; C1 input suspect, তাই F1 open থাকলে C1 provisional।")],
        [same("F5 + A1"),same("Separate queue"),mt("F5 says the statement is missing; A1 needs asset data, so A1 cannot run. Together they do not mean high risk.","F5 statement missing; A1 asset data চায়, তাই A1 চলবে না। একসাথে high risk নয়।")],
        [same("C2 + C1 — same year"),mt("Count once","একবার"),mt("That year's C1 gap is already part of the multi-year C2 gap.","ঐ বছরের C1 gap C2 multi-year gap-এর অংশ।")],
        [same("D3 + any signal"),mt("Context; may be meaningful by policy","Context; policy অনুযায়ী meaningful"),mt("Timing of revision may be suspicious but never cancels or confirms the prior signal.","Revision timing সন্দেহজনক হতে পারে, prior signal cancel/confirm করে না।")],
      ],
    },
  ],
  s11: [
    {
      kind: "table",
      title: mt("Combination tests — direct riskLevel() output","Combination test — riskLevel() direct output"),
      columns: [mt("Fired signals","Fired signals"), mt("Expected level","Expected Level"), mt("Source interpretation","Source interpretation")],
      rows: [
        [mt("None","কিছুই নয়"),same("Low"),mt("No substantive signal.","Substantive signal নেই।")],
        [same("A2 weak"),same("Low"),mt("One weak signal.","একটি weak signal।")],
        [mt("A1 meaningful + B1 meaningful — source label says 'same fact-group, no reconciliation'","A1 meaningful + B1 meaningful — source label: 'same fact-গোত্র, recon নেই'"),same("High"),mt("The actual test data uses different factKeys and different families; the source's displayed label is preserved even though it is semantically awkward.","Actual test data ভিন্ন factKey/family ব্যবহার করে; source-এর label হুবহু preserve করা হয়েছে।")],
        [same("A1 + D1 — same fact"),same("Medium"),mt("Dedup leaves one meaningful fact.","Dedup-এর পর এক meaningful fact।")],
        [mt("C1 strong alone","C1 strong একা"),same("High"),mt("One strong signal is High, not Very High.","এক strong signal = High, Very High নয়।")],
        [same("C1 strong + E2 meaningful"),same("Very High"),mt("Strong plus independent meaningful signal from different family.","Strong + ভিন্ন family independent meaningful।")],
        [mt("E1 strong + E2 strong — same family","E1 strong + E2 strong — একই family"),same("High"),mt("Same external family is not independent corroboration.","একই external family independent corroboration নয়।")],
        [mt("C1 meaningful + C4 meaningful — same family","C1 meaningful + C4 meaningful — একই family"),same("Medium"),mt("Different facts but same family do not independently raise the level.","ভিন্ন fact হলেও same family level বাড়ায় না।")],
        [mt("C1 meaningful + D2 meaningful — different family","C1 meaningful + D2 meaningful — ভিন্ন family"),same("High"),mt("Two independent meaningful signals.","দুটি independent meaningful signal।")],
        [same("C1 strong + D3 weak"),same("High"),mt("Weak corroboration does not make the strong signal Very High.","Weak corroboration strong signal-কে Very High করে না।")],
        [mt("Only F flag; no A–E","শুধু F-flag; A–E নেই"),same("Low + Control queue"),mt("Control Flags do not create substantive Risk Level.","Control Flag substantive Risk Level তৈরি করে না।")],
      ],
    },
    {
      kind: "formula",
      title: mt("Risk-level algorithm in plain language","Risk-level algorithm — সহজ ভাষায়"),
      lines: [
        mt("1. Deduplicate by factKey before assessing independence.","১. Independence-এর আগে factKey দিয়ে deduplicate।"),
        mt("2. If no substantive rule can run: Level = 'Undetermined'.","২. কোনো substantive rule eligible না হলে Level = 'নির্ণয় হয়নি'।"),
        mt("3. No retained signal → Low.","৩. Retained signal নেই → Low।"),
        mt("4. Primary strong + independent meaningful/strong from a different family → Very High; otherwise one strong → High.","৪. Primary strong + ভিন্ন family independent meaningful/strong → Very High; নইলে one strong → High।"),
        mt("5. Primary meaningful + independent meaningful → High; otherwise → Medium.","৫. Primary meaningful + independent meaningful → High; নইলে Medium।"),
        mt("6. Primary weak + another independent signal → Medium; otherwise → Low.","৬. Primary weak + অন্য independent signal → Medium; নইলে Low।"),
      ],
    },
  ],
};
