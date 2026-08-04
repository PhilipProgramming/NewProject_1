import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { buildFloorDayReport } from '@/lib/floorReport';
import { buildFloorReportHtml } from '@/lib/floorReportHtml';
import type { FloorSession } from '@/types/floor';

export async function exportFloorDayReport(
  session: FloorSession,
  clientName: string,
): Promise<void> {
  const report = buildFloorDayReport(session, clientName);
  const html = buildFloorReportHtml(report);
  const fileName = `floor-summary-${session.date}.pdf`;

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  if (Platform.OS === 'web') {
    const link = document.createElement('a');
    link.href = uri;
    link.download = fileName;
    link.click();
    return;
  }

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
