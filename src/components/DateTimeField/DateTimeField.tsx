import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { formatRelativeDateTime, withDate, withTime } from '@src/helpers/date';

interface DateTimeFieldProps {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
  minimumDate?: Date;
}

/**
 * A row showing the chosen date and time. Android opens the system date
 * dialog followed by the time dialog; iOS expands an inline picker.
 */
export const DateTimeField = (props: DateTimeFieldProps) => {
  const { label, value, onChange, minimumDate } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const openAndroidPickers = () =>
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      minimumDate,
      onChange: (dateEvent, date) => {
        if (dateEvent.type !== 'set' || !date) {
          return;
        }
        const withNewDay = withDate(value, date);
        onChange(withNewDay);
        DateTimePickerAndroid.open({
          value: withNewDay,
          mode: 'time',
          onChange: (timeEvent, time) =>
            timeEvent.type === 'set' &&
            time &&
            onChange(withTime(withNewDay, time)),
        });
      },
    });

  const handlePress = () =>
    Platform.OS === 'ios'
      ? setIsExpanded(expanded => !expanded)
      : openAndroidPickers();

  return (
    <View style={styles.main}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${formatRelativeDateTime(value)}`}
        accessibilityState={{ expanded: isExpanded }}
        onPress={handlePress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={styles.iconBox}>
          <Icon name="time-outline" size={22} color="primary" />
        </View>
        <View style={styles.texts}>
          <Text size="caption" weight="medium" color="subtext">
            {label}
          </Text>
          <Text size="large" weight="bold" numberOfLines={1}>
            {formatRelativeDateTime(value)}
          </Text>
        </View>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-forward'}
          size={20}
          color="subtext"
        />
      </Pressable>
      {Platform.OS === 'ios' && isExpanded && (
        <DateTimePicker
          value={value}
          mode="datetime"
          display="spinner"
          minimumDate={minimumDate}
          accentColor={Colors.primary}
          textColor={Colors.text}
          onChange={(_event: DateTimePickerEvent, date?: Date) =>
            date && onChange(date)
          }
        />
      )}
    </View>
  );
};

const ICON_BOX_SIZE = 44;

const styles = StyleSheet.create({
  main: {
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
  },
  texts: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
