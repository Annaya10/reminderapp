import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { FontSizes, Fonts } from '@src/constants/fonts';
import { Radius, Spacing } from '@src/constants/layout';

interface TextFieldProps extends TextInputProps {
  label: string;
  icon?: IconName;
  error?: string;
}

/**
 * Labelled text input. Passing `secureTextEntry` adds a show/hide toggle.
 */
export const TextField = (props: TextFieldProps) => {
  const {
    label,
    icon,
    error,
    multiline,
    secureTextEntry,
    style,
    onFocus,
    onBlur,
    ...rest
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  return (
    <View>
      <Text weight="medium" style={styles.label}>
        {label}
      </Text>
      <View
        style={[
          styles.inputBox,
          multiline && styles.multilineBox,
          isFocused && styles.inputBoxFocused,
          !!error && styles.inputBoxError,
        ]}
      >
        {!!icon && (
          <View style={styles.leftIcon}>
            <Icon
              name={icon}
              size={20}
              color={isFocused ? 'primary' : 'placeholder'}
            />
          </View>
        )}
        <TextInput
          placeholderTextColor={Colors.placeholder}
          selectionColor={Colors.primary}
          multiline={multiline}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          accessibilityLabel={label}
          {...rest}
          onFocus={event => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, multiline && styles.multiline, style]}
        />
        {secureTextEntry && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isSecureVisible ? 'Hide password' : 'Show password'
            }
            hitSlop={Spacing.sm}
            onPress={() => setIsSecureVisible(visible => !visible)}
            style={styles.rightIcon}
          >
            <Icon
              name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="subtext"
            />
          </Pressable>
        )}
      </View>
      {!!error && (
        <Text size="caption" color="danger" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: Spacing.sm,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
  },
  multilineBox: {
    alignItems: 'flex-start',
  },
  inputBoxFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardBg,
  },
  inputBoxError: {
    borderColor: Colors.danger,
  },
  leftIcon: {
    paddingLeft: Spacing.md,
  },
  input: {
    ...Fonts.regular,
    flex: 1,
    minHeight: 46,
    paddingHorizontal: Spacing.md,
    color: Colors.text,
    fontSize: FontSizes.subtitle,
  },
  multiline: {
    minHeight: 88,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    textAlignVertical: 'top',
  },
  rightIcon: {
    paddingHorizontal: Spacing.md,
  },
  error: {
    marginTop: Spacing.xs,
  },
});
