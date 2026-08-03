import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EditorialNav } from '@/components/EditorialNav';
import { colors } from '@/constants/theme';

export default function MainLayout() {
  return (
    <View style={styles.root}>
      <EditorialNav />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="history" />
        <Stack.Screen name="floor" />
        <Stack.Screen name="settings" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
