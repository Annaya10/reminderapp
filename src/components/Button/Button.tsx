import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  icon?: IconName;
  /** Icon shown after the label, e.g. an arrow. */
  trailingIcon?: IconName;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const contentColors: Record<ButtonVariant, ColorName> = {
  primary: 'white',
  secondary: 'primary',
  danger: 'danger',
};

export const Button = (props: ButtonProps) => {
  const {
    label,
    icon,
    trailingIcon,
    variant = 'primary',
    loading = false,
    disabled,
    style,
    ...rest
  } = props;
  const contentColor = contentColors[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      {...rest}
      style={({ pressed }) => [
        styles.main,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors[contentColor]} />
      ) : (
        <>
          {!!icon && <Icon name={icon} size={20} color={contentColor} />}
          <Text
            weight="semiBold"
            size="subtitle"
            color={contentColor}
            numberOfLines={1}
          >
            {label}
          </Text>
          {!!trailingIcon && (
            <Icon name={trailingIcon} size={18} color={contentColor} />
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
  secondary: {
    backgroundColor: Colors.primarySoft,
  },
  danger: {
    backgroundColor: Colors.dangerBg,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
