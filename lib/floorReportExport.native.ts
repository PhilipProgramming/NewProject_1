import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { buildFloorDayReport } from '@/lib/floorReport';
import { buildFloorReportHtml } from '@/lib/floorReportHtml';
import { nextFloorReportId } from '@/lib/floorReportId';
import type { FloorSession } from '@/types/floor';

/** iOS/Android — generate a PDF file and open the native share sheet. */
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

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: 'Floor Summary',
  });
}
