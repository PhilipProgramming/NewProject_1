import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  PAGE_TITLE_ROW_MIN_HEIGHT,
  pageTitleStyles,
} from '@/constants/pageLayout';

type PageTitleProps = {
  title: string;
  /** Optional trailing element, e.g. today's date on the Today page. */
  trailing?: ReactNode;
};

/** Fixed-position page title row — same typography and baseline on every page. */
export function PageTitle({ title, trailing }: PageTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={pageTitleStyles.title}>{title}</Text>
      {trailing ?? <View style={styles.trailingSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    minHeight: PAGE_TITLE_ROW_MIN_HEIGHT,
  },
  trailingSpacer: {
    flexShrink: 0,
  },
});
