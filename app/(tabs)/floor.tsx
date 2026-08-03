import { StyleSheet, Text, View } from 'react-native';

import { EditorialPage } from '@/components/EditorialPage';
import { colors, fonts } from '@/constants/theme';

/**
 * Floor — future home for team standings, rankings, and floor analytics.
 */
export default function FloorScreen() {
  return (
    <EditorialPage title="Floor">
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Team standings, rankings, and operational analytics will appear here.
        </Text>
      </View>
    </EditorialPage>
  );
}

const styles = StyleSheet.create({
  placeholder: {},
  placeholderText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 24,
    maxWidth: 420,
  },
});
