import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { colors, fonts, spacing } from '@/constants/theme';

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

  function handleAdd() {
    const trimmed = draftName.trim();
    if (!trimmed) {
      return;
    }
    setNames((prev) => [...prev, trimmed]);
    setDraftName('');
  }

  function handleRemove(index: number) {
    setNames((prev) => prev.filter((_, i) => i !== index));
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

      <Pressable style={styles.addLink} onPress={handleAdd}>
        <Text style={styles.addLinkText}>Add to rotation</Text>
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
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.xl,
    maxWidth: 480,
  },
  addLink: {
    alignSelf: 'flex-start',
    marginTop: -spacing.sm,
    marginBottom: spacing.xl,
  },
  addLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    textDecorationLine: 'underline',
  },
  list: {
    marginBottom: spacing.xl,
  },
  listLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: colors.text,
  },
  remove: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  startButton: {
    alignSelf: 'flex-start',
  },
});
