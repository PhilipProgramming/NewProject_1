import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenBackground } from '@/components/ScreenBackground';
import { colors, fonts, spacing } from '@/constants/theme';

/**
 * Floor — future home for team standings, rankings, and floor analytics.
 */
export default function FloorScreen() {
  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.title}>Floor</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Team standings, rankings, and operational analytics will appear here.
          </Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xxl,
    letterSpacing: -0.3,
  },
  placeholder: {
    paddingTop: spacing.lg,
  },
  placeholderText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 24,
    maxWidth: 420,
  },
});
