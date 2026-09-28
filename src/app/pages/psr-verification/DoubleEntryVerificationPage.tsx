import { GenPage } from "../../components/pages/GeneratedTablePage";
import type { PageCfg } from "../modulePageUtils";
import { deVerifRows, TIN_NAME, fc, BADGE, BASE_FILTERS } from "../modulePageUtils";
import { ROW_VIEW, VERIFY } from "../../data/modulePageConfigs";

export function DoubleEntryVerificationPage() {
  const cfg: PageCfg = {
    title: "Double Entry Verification",
    titleKey: "doubleEntryVerification.title",
    desc: "Verify duplicate entries and resolve conflicting records.",
    descKey: "doubleEntryVerification.desc",
    cols: [...TIN_NAME, fc("entry_no", "Entry No.", { headerKey: "headers.entryNo" }), fc("amount", "Amount", { headerKey: "headers.amount" }), BADGE("verif_status", "Verif. Status"), fc("verif_date", "Verif. Date", { headerKey: "headers.verifDate" })],
    mobileCardMapping: { primary: "name", identifier: "tin", meta: ["entry_no"], status: "verif_status", date: "verif_date", amount: "amount" },
    filters: BASE_FILTERS,
    actions: ROW_VIEW,
    drawerActions: VERIFY,
    rows: deVerifRows,
  };
  return <GenPage cfg={cfg} />;
}
