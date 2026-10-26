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

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  icon?: IconName;
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
          {!!icon && <Icon name={icon} size={18} color={contentColor} />}
          <Text
            weight="semiBold"
            color={contentColor}
            numberOfLines={1}
            style={!!icon && styles.labelWithIcon}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
  labelWithIcon: {
    marginLeft: Spacing.xs,
  },
});
