import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WALK_REASONS } from '@/constants/floorDefaults';
import {
  buttonStyles,
  sectionLabelSpacing,
  typography,
} from '@/constants/typography';
import { colors, spacing } from '@/constants/theme';
import { useElapsedLabel } from '@/hooks/useElapsedLabel';
import type { ActiveInteraction } from '@/types/floor';

type ActiveInteractionsListProps = {
  interactions: ActiveInteraction[];
  getName: (associateId: string) => string;
  onSale: (interactionId: string) => void;
  onWalk: (interactionId: string, reason: string) => void;
  isSaving?: boolean;
};

function ActiveRow({
  interaction,
  name,
  onSale,
  onWalkStart,
  isSaving,
  isWalkPending,
  onWalkReason,
  onWalkCancel,
}: {
  interaction: ActiveInteraction;
  name: string;
  onSale: () => void;
  onWalkStart: () => void;
  isSaving?: boolean;
  isWalkPending: boolean;
  onWalkReason: (reason: string) => void;
  onWalkCancel: () => void;
}) {
  const elapsed = useElapsedLabel(interaction.assignedAt);

  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.customerCount}>
            {interaction.customerCount}{' '}
            {interaction.customerCount === 1 ? 'customer' : 'customers'}
          </Text>
        </View>
        <Text style={styles.elapsed}>{elapsed}</Text>
      </View>

      {!isWalkPending ? (
        <View style={styles.actions}>
          <Pressable
            onPress={onSale}
            disabled={isSaving}
            style={({ pressed, hovered }) => [
              styles.action,
              (hovered || pressed) && styles.actionActive,
            ]}
          >
            {({ pressed, hovered }) => (
              <Text
                style={[
                  buttonStyles.label,
                  (hovered || pressed) && buttonStyles.labelActive,
                ]}
              >
                Sale
              </Text>
            )}
          </Pressable>
          <Pressable
            onPress={onWalkStart}
            disabled={isSaving}
            style={({ pressed, hovered }) => [
              styles.action,
              (hovered || pressed) && styles.actionActive,
            ]}
          >
            {({ pressed, hovered }) => (
              <Text
                style={[
                  buttonStyles.label,
                  (hovered || pressed) && buttonStyles.labelActive,
                ]}
              >
                Walk
              </Text>
            )}
          </Pressable>
        </View>
      ) : (
        <View style={styles.walkPicker}>
          <Text style={styles.walkLabel}>Walk reason</Text>
          {WALK_REASONS.map((reason) => (
            <Pressable
              key={reason}
              onPress={() => onWalkReason(reason)}
              style={({ pressed, hovered }) => [
                styles.reason,
                (hovered || pressed) && styles.reasonActive,
              ]}
            >
              <Text style={buttonStyles.labelAccent}>{reason}</Text>
            </Pressable>
          ))}
          <Pressable onPress={onWalkCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/** Associates currently with customers — complete via Sale or Walk. */
export function ActiveInteractionsList({
  interactions,
  getName,
  onSale,
  onWalk,
  isSaving,
}: ActiveInteractionsListProps) {
  const [pendingWalkId, setPendingWalkId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.rule} />
      <Text style={styles.sectionLabel}>With customers</Text>

      {interactions.length === 0 ? (
        <Text style={styles.empty}>No active customers on the floor.</Text>
      ) : (
        interactions.map((interaction) => (
          <ActiveRow
            key={interaction.id}
            interaction={interaction}
            name={getName(interaction.associateId)}
            onSale={() => onSale(interaction.id)}
            onWalkStart={() => setPendingWalkId(interaction.id)}
            isSaving={isSaving}
            isWalkPending={pendingWalkId === interaction.id}
            onWalkReason={(reason) => {
              onWalk(interaction.id, reason);
              setPendingWalkId(null);
            }}
            onWalkCancel={() => setPendingWalkId(null)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  rule: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    ...sectionLabelSpacing,
    marginBottom: spacing.lg,
  },
  empty: {
    ...typography.bodyMuted,
    lineHeight: 24,
  },
  row: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  nameBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    ...typography.displaySmall,
  },
  customerCount: {
    ...typography.bodyMuted,
    marginTop: spacing.xs,
  },
  elapsed: {
    ...typography.bodyMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  actionActive: {
    backgroundColor: colors.brandBlue,
    borderColor: colors.brandBlue,
  },
  walkPicker: {
    gap: spacing.sm,
  },
  walkLabel: {
    ...typography.sectionLabel,
    marginBottom: spacing.xs,
  },
  reason: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  reasonActive: {},
  cancel: {
    ...buttonStyles.labelAccent,
    marginTop: spacing.sm,
    textDecorationLine: 'underline',
  },
});
