import { StyleSheet, Text, View } from 'react-native';

import {
  sectionLabelSpacing,
  typography,
} from '@/constants/typography';
import { spacing } from '@/constants/theme';

type RotationListProps = {
  names: string[];
};

/** Remaining available associates after the current "up" person. */
export function RotationList({ names }: RotationListProps) {
  if (names.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Available</Text>
      {names.map((name) => (
        <Text key={name} style={styles.name}>
          {name}
        </Text>
      ))}
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
  name: {
    ...typography.displayMedium,
    lineHeight: 32,
    paddingVertical: spacing.xs,
  },
});
