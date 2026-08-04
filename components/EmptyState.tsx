import { StyleSheet, Text, View } from 'react-native';

import { typeScale, typography } from '@/constants/typography';
import { colors, fonts, spacing } from '@/constants/theme';

type EmptyStateProps = {
  title: string;
  message: string;
};

/** Friendly placeholder when a list has no items yet. */
export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.fieldInput,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
