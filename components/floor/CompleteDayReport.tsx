import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { TextLinkButton } from '@/components/TextLinkButton';
import { exportFloorDayReport } from '@/lib/floorReportExport';
import { spacing } from '@/constants/theme';
import type { FloorSession } from '@/types/floor';

type CompleteDayReportProps = {
  session: FloorSession;
  clientName: string;
  disabled?: boolean;
};

/** Generate and share the end-of-day Floor Summary PDF. */
export function CompleteDayReport({
  session,
  clientName,
  disabled = false,
}: CompleteDayReportProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handlePress() {
    if (session.completed.length === 0) {
      Alert.alert(
        'No completed interactions',
        'Complete at least one customer interaction before generating the day summary.',
      );
      return;
    }

    setIsExporting(true);
    try {
      await exportFloorDayReport(session, clientName);
    } catch {
      Alert.alert(
        'Report unavailable',
        'Could not generate the Floor Summary. Please try again.',
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <TextLinkButton
      label={isExporting ? 'Generating report…' : 'Complete the day →'}
      onPress={() => {
        void handlePress();
      }}
      disabled={disabled || isExporting}
      style={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
  },
});
