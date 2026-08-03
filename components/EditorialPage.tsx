import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { PageTitle } from '@/components/PageTitle';
import { ScreenBackground } from '@/components/ScreenBackground';
import { PAGE_CONTENT_GAP } from '@/constants/pageLayout';
import { colors, spacing } from '@/constants/theme';

type EditorialPageProps = {
  title: string;
  children: ReactNode;
  /** Shown on the title row, right-aligned — used for Today's date. */
  headerTrailing?: ReactNode;
  footer?: ReactNode;
  keyboardAvoiding?: boolean;
  loading?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Shared editorial page shell — fixed title placement, identical margins,
 * and consistent gap before content on every main tab screen.
 */
export function EditorialPage({
  title,
  children,
  headerTrailing,
  footer,
  keyboardAvoiding = false,
  loading = false,
  contentContainerStyle,
}: EditorialPageProps) {
  const body = loading ? (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.textMuted} size="large" />
    </View>
  ) : (
    children
  );

  const scroll = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scroll, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
    >
      <PageTitle title={title} trailing={headerTrailing} />
      <View style={styles.content}>{body}</View>
      {footer}
    </ScrollView>
  );

  return (
    <ScreenBackground>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {scroll}
        </KeyboardAvoidingView>
      ) : (
        scroll
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },
  content: {
    marginTop: PAGE_CONTENT_GAP,
  },
  loading: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
