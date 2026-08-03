import { StyleSheet, Text, View } from 'react-native';

import { ActiveInteractionsList } from '@/components/floor/ActiveInteractionsList';
import { FloorRosterSetup } from '@/components/floor/FloorRosterSetup';
import { RotationList } from '@/components/floor/RotationList';
import { UpNextBlock } from '@/components/floor/UpNextBlock';
import { EditorialPage } from '@/components/EditorialPage';
import { useFloorState } from '@/context/FloorContext';
import { colors, fonts, spacing } from '@/constants/theme';

/**
 * Floor — live Up Sheet: rotation queue and active customer interactions.
 */
export default function FloorScreen() {
  const {
    session,
    isLoading,
    isSaving,
    error,
    upAssociateId,
    getName,
    startRoster,
    assignCustomer,
    completeInteraction,
  } = useFloorState();

  const hasRoster = session.roster.length > 0;
  const upName = upAssociateId ? getName(upAssociateId) : null;
  const availableNames = session.rotation
    .slice(1)
    .map((id) => getName(id));

  if (!hasRoster) {
    return (
      <EditorialPage title="Floor" loading={isLoading}>
        <FloorRosterSetup
          onStart={(names) => {
            void startRoster(names);
          }}
          isSaving={isSaving}
        />
      </EditorialPage>
    );
  }

  return (
    <EditorialPage title="Floor" loading={isLoading}>
      <UpNextBlock
        upName={upName}
        onAssign={() => {
          void assignCustomer();
        }}
        isSaving={isSaving}
      />

      <RotationList names={availableNames} />

      <ActiveInteractionsList
        interactions={session.active}
        getName={getName}
        onSale={(id) => {
          void completeInteraction(id, 'sale');
        }}
        onWalk={(id, reason) => {
          void completeInteraction(id, 'walk', reason);
        }}
        isSaving={isSaving}
      />

      {session.completed.length > 0 ? (
        <View style={styles.completed}>
          <Text style={styles.completedLabel}>Completed today</Text>
          <Text style={styles.completedCount}>
            {session.completed.length}{' '}
            {session.completed.length === 1 ? 'interaction' : 'interactions'}
          </Text>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </EditorialPage>
  );
}

const styles = StyleSheet.create({
  completed: {
    marginTop: spacing.md,
  },
  completedLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  completedCount: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.md,
  },
});
