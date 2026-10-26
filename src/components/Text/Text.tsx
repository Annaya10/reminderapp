import React from 'react';
import { StyleSheet, Text as CoreText, TextProps } from 'react-native';

import { ColorName, Colors } from '@src/constants/colors';
import { FontSize, FontSizes, FontWeight, Fonts } from '@src/constants/fonts';

export interface MyTextProps extends TextProps {
  size?: FontSize;
  weight?: FontWeight;
  color?: ColorName;
  alignCenter?: boolean;
}

export const Text = (props: MyTextProps) => {
  const {
    children,
    size = 'body',
    weight = 'regular',
    color = 'text',
    alignCenter = false,
    style,
    ...rest
  } = props;

  return (
    <CoreText
      {...rest}
      style={[
        Fonts[weight],
        { fontSize: FontSizes[size], color: Colors[color] },
        alignCenter && styles.alignCenter,
        style,
      ]}
    >
      {children}
    </CoreText>
  );
};

const styles = StyleSheet.create({
  alignCenter: {
    textAlign: 'center',
  },
});
