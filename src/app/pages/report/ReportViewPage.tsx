import { ReportPage } from "../../components/reports/ReportPage";

export function ReportViewPage({ reportId }: { reportId: string }) {
  return <ReportPage reportId={reportId} />;
}
