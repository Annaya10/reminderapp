import React, { ReactNode, useState } from 'react';
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
  /** Shown in capitals above the input; also the input's accessibility label. */
  label: string;
  /** Extra content on the right of the label row, e.g. a character count. */
  labelAccessory?: ReactNode;
  icon?: IconName;
  /** Decorative icon inside the input, on the right. */
  trailingIcon?: IconName;
  /** Helper text shown under the input while there is no error. */
  hint?: string;
  error?: string;
}

/**
 * Labelled text input. Passing `secureTextEntry` adds a show/hide toggle.
 */
export const TextField = (props: TextFieldProps) => {
  const {
    label,
    labelAccessory,
    icon,
    trailingIcon,
    hint,
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
      <View style={styles.labelRow}>
        <Text weight="semiBold" size="caption" style={styles.label}>
          {label}
        </Text>
        {labelAccessory}
      </View>
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
              color={isFocused ? 'primary' : 'subtext'}
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
          style={[
            styles.input,
            !!icon && styles.inputWithIcon,
            multiline && styles.multiline,
            style,
          ]}
        />
        {secureTextEntry ? (
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
        ) : (
          !!trailingIcon && (
            <View style={styles.rightIcon}>
              <Icon name={trailingIcon} size={20} color="primary" />
            </View>
          )
        )}
      </View>
      {error ? (
        <Text size="caption" color="danger" style={styles.helper}>
          {error}
        </Text>
      ) : (
        !!hint && (
          <View style={styles.hintRow}>
            <Icon name="information-circle" size={14} color="primary" />
            <Text size="caption" color="subtext">
              {hint}
            </Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  label: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
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
    paddingLeft: Spacing.lg,
  },
  input: {
    ...Fonts.regular,
    flex: 1,
    minHeight: 49,
    paddingHorizontal: Spacing.lg,
    color: Colors.text,
    fontSize: FontSizes.subtitle,
  },
  inputWithIcon: {
    paddingLeft: Spacing.md,
  },
  multiline: {
    minHeight: 84,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    textAlignVertical: 'top',
  },
  rightIcon: {
    paddingHorizontal: Spacing.lg,
    alignSelf: 'center',
  },
  helper: {
    marginTop: Spacing.xs,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
});
