import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/constants/theme';

type EditorialNavLinkProps = {
  href: '/(tabs)' | '/(tabs)/history' | '/(tabs)/floor' | '/(tabs)/settings';
  label: string;
  active: boolean;
};

/** Text-only navigation item — underline when active, no icons or fills. */
export function EditorialNavLink({
  href,
  label,
  active,
}: EditorialNavLinkProps) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link">
        <Text style={[styles.label, active && styles.labelActive]}>
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.text,
    letterSpacing: 0.4,
  },
  labelActive: {
    fontFamily: fonts.bodyMedium,
    color: colors.text,
    textDecorationLine: 'underline',
    textDecorationColor: colors.text,
  },
});
