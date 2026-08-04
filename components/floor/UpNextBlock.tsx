import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import {
  sectionLabelSpacing,
  typography,
} from '@/constants/typography';
import { colors, spacing } from '@/constants/theme';

type UpNextBlockProps = {
  upName: string | null;
  onAssign: () => void;
  isSaving?: boolean;
};

/** Current "up" associate and the primary assign action. */
export function UpNextBlock({ upName, onAssign, isSaving }: UpNextBlockProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Up next</Text>
      {upName ? (
        <Text style={styles.upName}>▶ {upName}</Text>
      ) : (
        <Text style={styles.empty}>No one available</Text>
      )}
      <PrimaryButton
        label={isSaving ? 'Assigning…' : 'Assign customer'}
        onPress={onAssign}
        disabled={!upName || isSaving}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    ...sectionLabelSpacing,
  },
  upName: {
    ...typography.displayMedium,
    marginBottom: spacing.lg,
  },
  empty: {
    ...typography.displaySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
