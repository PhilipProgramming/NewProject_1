import { Text } from 'react-native';

import { pageTitleStyles } from '@/constants/pageLayout';
import { formatDisplayDate, getTodayKey } from '@/lib/dates';

/** Today's date — trailing element on the Today page title row. */
export function TodayPageDate() {
  return (
    <Text style={pageTitleStyles.date}>
      {formatDisplayDate(getTodayKey())}
    </Text>
  );
}
