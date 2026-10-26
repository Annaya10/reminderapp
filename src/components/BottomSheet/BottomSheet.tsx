import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { useResponsive } from '@src/hooks/useResponsive';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const BottomSheet = ({
  visible,
  onClose,
  children,
}: BottomSheetProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { height, contentMaxWidth } = useResponsive();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Close"
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            {
              paddingBottom: bottom + Spacing.lg,
              maxWidth: contentMaxWidth,
              maxHeight: height - top - Spacing.lg,
            },
          ]}
        >
          <View style={styles.handle} />
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
  },
  sheet: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: Colors.cardBg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
});
