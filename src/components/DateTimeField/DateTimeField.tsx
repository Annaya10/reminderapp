import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import {
  formatShortDate,
  formatTime,
  withDate,
  withTime,
} from '@src/helpers/date';

interface DateTimeFieldProps {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
  minimumDate?: Date;
}

/**
 * Date and time selection. iOS shows the native compact pickers inline;
 * Android opens the system dialogs.
 */
export const DateTimeField = (props: DateTimeFieldProps) => {
  const { label, value, onChange, minimumDate } = props;

  return (
    <View>
      <Text weight="medium" style={styles.label}>
        {label}
      </Text>
      {Platform.OS === 'ios' ? (
        <View style={styles.iosRow}>
          <Icon name="calendar-outline" size={20} color="primary" />
          <DateTimePicker
            value={value}
            mode="date"
            display="compact"
            minimumDate={minimumDate}
            accentColor={Colors.primary}
            onChange={(_event: DateTimePickerEvent, date?: Date) =>
              date && onChange(withDate(value, date))
            }
          />
          <DateTimePicker
            value={value}
            mode="time"
            display="compact"
            accentColor={Colors.primary}
            onChange={(_event: DateTimePickerEvent, date?: Date) =>
              date && onChange(withTime(value, date))
            }
          />
        </View>
      ) : (
        <View style={styles.androidRow}>
          <PickerButton
            icon="calendar-outline"
            label={formatShortDate(value)}
            accessibilityLabel={`${label} date`}
            onPress={() =>
              DateTimePickerAndroid.open({
                value,
                mode: 'date',
                minimumDate,
                onChange: (event, date) =>
                  event.type === 'set' &&
                  date &&
                  onChange(withDate(value, date)),
              })
            }
          />
          <PickerButton
            icon="time-outline"
            label={formatTime(value)}
            accessibilityLabel={`${label} time`}
            onPress={() =>
              DateTimePickerAndroid.open({
                value,
                mode: 'time',
                onChange: (event, date) =>
                  event.type === 'set' &&
                  date &&
                  onChange(withTime(value, date)),
              })
            }
          />
        </View>
      )}
    </View>
  );
};

interface PickerButtonProps {
  icon: IconName;
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}

const PickerButton = (props: PickerButtonProps) => {
  const { icon, label, accessibilityLabel, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.pickerButton, pressed && styles.pressed]}
    >
      <Icon name={icon} size={18} color="primary" />
      <Text weight="medium" style={styles.pickerLabel}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: Spacing.sm,
  },
  iosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
  },
  androidRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
  },
  pickerLabel: {
    marginLeft: Spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
});
