import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { VALIDATION_LIMITS } from '@/constants/validationLimits';
import {
  buttonStyles,
  sectionLabelSpacing,
  typography,
} from '@/constants/typography';
import { colors, spacing } from '@/constants/theme';
import { sanitizePersonName } from '@/lib/validation';

type FloorRosterSetupProps = {
  onStart: (names: string[]) => void;
  isSaving?: boolean;
};

/**
 * First-run roster editor — add associates in rotation order for today.
 */
export function FloorRosterSetup({ onStart, isSaving }: FloorRosterSetupProps) {
  const [draftName, setDraftName] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [rosterError, setRosterError] = useState<string | undefined>();

  function handleAdd() {
    const trimmed = sanitizePersonName(draftName.trim());
    if (!trimmed) {
      return;
    }

    if (names.length >= VALIDATION_LIMITS.rosterMaxSize) {
      setRosterError(
        `Rotation supports up to ${VALIDATION_LIMITS.rosterMaxSize} associates.`,
      );
      return;
    }

    setNames((prev) => [...prev, trimmed]);
    setDraftName('');
    setRosterError(undefined);
  }

  function handleRemove(index: number) {
    setNames((prev) => prev.filter((_, i) => i !== index));
    setRosterError(undefined);
  }

  return (
    <View>
      <Text style={styles.intro}>
        Add everyone working the floor today, in rotation order. The first
        associate listed will be up when you begin.
      </Text>

      <TextField
        label="Associate name"
        value={draftName}
        onChangeText={setDraftName}
        placeholder="Camille"
      />

      {rosterError ? <Text style={styles.rosterError}>{rosterError}</Text> : null}

      <Pressable style={styles.addLink} onPress={handleAdd}>
        <Text style={buttonStyles.labelAccent}>Add to rotation</Text>
      </Pressable>

      {names.length > 0 ? (
        <View style={styles.list}>
          <Text style={styles.listLabel}>Today&apos;s rotation</Text>
          {names.map((name, index) => (
            <View key={`${name}-${index}`} style={styles.listRow}>
              <Text style={styles.listName}>
                {index === 0 ? '▶ ' : '   '}
                {name}
              </Text>
              <Pressable onPress={() => handleRemove(index)}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <PrimaryButton
        label={isSaving ? 'Starting…' : 'Begin floor'}
        onPress={() => onStart(names)}
        disabled={names.length === 0 || isSaving}
        style={styles.startButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.bodyMuted,
    lineHeight: 24,
    marginBottom: spacing.xl,
    maxWidth: 480,
  },
  rosterError: {
    ...typography.error,
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
  addLink: {
    alignSelf: 'flex-start',
    marginTop: -spacing.sm,
    marginBottom: spacing.xl,
  },
  list: {
    marginBottom: spacing.xl,
  },
  listLabel: {
    ...typography.sectionLabel,
    ...sectionLabelSpacing,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listName: {
    ...typography.observation,
  },
  remove: {
    ...buttonStyles.labelAccent,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  startButton: {
    alignSelf: 'flex-start',
  },
});
