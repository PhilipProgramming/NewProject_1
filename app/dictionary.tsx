import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DictionaryEntry } from '@/components/DictionaryEntry';
import { EditorialNav } from '@/components/EditorialNav';
import { PageTitle } from '@/components/PageTitle';
import { ScreenBackground } from '@/components/ScreenBackground';
import { PAGE_CONTENT_GAP } from '@/constants/pageLayout';
import {
  DICTIONARY_INTRO,
  getMetricsByCategory,
  METRIC_CATEGORY_LABELS,
  type MetricCategory,
} from '@/constants/metricsDictionary';
import { colors, fonts, spacing } from '@/constants/theme';

const CATEGORY_ORDER: MetricCategory[] = ['inputs', 'sales', 'earnings'];

/**
 * Data dictionary — reference screen explaining every metric.
 */
export default function DictionaryScreen() {
  const grouped = getMetricsByCategory();

  return (
    <View style={styles.page}>
      <EditorialNav />
      <ScreenBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <PageTitle title={DICTIONARY_INTRO.title} />

          <View style={styles.content}>
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                {DICTIONARY_INTRO.disclaimer}
              </Text>
            </View>
            <Text style={styles.subtitle}>{DICTIONARY_INTRO.subtitle}</Text>

            {CATEGORY_ORDER.map((category) => (
              <View key={category} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {METRIC_CATEGORY_LABELS[category]}
                </Text>
                {grouped[category].map((metric) => (
                  <DictionaryEntry key={metric.id} metric={metric} />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },
  content: {
    marginTop: PAGE_CONTENT_GAP,
  },
  disclaimer: {
    backgroundColor: colors.brandBlue,
    borderWidth: 1,
    borderColor: colors.brandBlue,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  disclaimerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textOnBrand,
    lineHeight: 21,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
});
