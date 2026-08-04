import { buildFloorDayReport } from '@/lib/floorReport';
import { buildFloorReportHtml } from '@/lib/floorReportHtml';
import { nextFloorReportId } from '@/lib/floorReportId';
import type { FloorSession } from '@/types/floor';

/** Web — open the editorial report and trigger the browser print/save dialog. */
export async function exportFloorDayReport(
  session: FloorSession,
  clientName: string,
): Promise<void> {
  const generatedAt = new Date();
  const reportId = await nextFloorReportId(session.date);
  const report = buildFloorDayReport(session, clientName, {
    reportId,
    generatedAt,
  });
  const html = buildFloorReportHtml(report);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open the report window. Allow pop-ups and try again.');
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
