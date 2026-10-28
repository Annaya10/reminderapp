import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

export interface Segment<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>(
  props: SegmentedControlProps<T>,
) => {
  const { segments, value, onChange } = props;

  return (
    <View style={styles.main} accessibilityRole="tablist">
      {segments.map(segment => {
        const isSelected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(segment.value)}
            style={[styles.segment, isSelected && styles.segmentSelected]}
          >
            <Text
              size="subtitle"
              weight="semiBold"
              color={isSelected ? 'primary' : 'subtext'}
              numberOfLines={1}
            >
              {segment.label}
            </Text>
            {segment.count !== undefined && (
              <View style={styles.count}>
                <Text
                  size="caption"
                  weight="semiBold"
                  color={isSelected ? 'primary' : 'subtext'}
                >
                  {segment.count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    padding: Spacing.xs,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primarySoft,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 42,
    borderRadius: Radius.lg - Spacing.xs,
  },
  segmentSelected: {
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  count: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryMuted,
  },
});
