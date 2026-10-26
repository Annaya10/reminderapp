import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Spacing } from '@src/constants/layout';
import { BrandMark } from '@src/modules/auth/components/BrandMark';

interface SplashScreenProps {
  error?: string | null;
}

/** Shown while the database opens and the saved session is restored. */
export const SplashScreen = ({ error }: SplashScreenProps) => (
  <View style={styles.main}>
    <BrandMark size={72} />
    {error ? (
      <Text color="danger" alignCenter style={styles.status}>
        {error}
      </Text>
    ) : (
      <ActivityIndicator color={Colors.primary} style={styles.status} />
    )}
  </View>
);

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.screenBg,
  },
  status: {
    marginTop: Spacing.xl,
  },
});
