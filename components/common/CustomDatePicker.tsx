import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar } from 'lucide-react-native';
import { COLORS, SIZES } from '../../utils/constants';
import moment from 'moment';

interface CustomDatePickerProps {
  label?: string;
  error?: string;
  touched?: boolean;
  containerStyle?: ViewStyle;
  value?: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function CustomDatePicker({
  label,
  error,
  touched,
  containerStyle,
  value,
  onChange,
  minimumDate,
  maximumDate,
}: CustomDatePickerProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const hasError = touched && error;

  const handleConfirm = (date: Date) => {
    onChange(date);
    setDatePickerVisibility(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          hasError && styles.error,
        ]}
        onPress={() => {
          setDatePickerVisibility(true);
          setIsFocused(true);
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.inputText}>
          {value ? moment(value).format('DD MMM YYYY') : 'Select date'}
        </Text>
        <Calendar size={SIZES.icon.sm} color={COLORS.text.secondary} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={value || new Date()}
        onConfirm={handleConfirm}
        onCancel={() => {
          setDatePickerVisibility(false);
          setIsFocused(false);
        }}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: SIZES.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.background.primary,
    paddingHorizontal: SIZES.md,
    minHeight: 50,
    justifyContent: 'space-between',
  },
  focused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  inputText: {
    fontSize: SIZES.subheading,
    color: COLORS.text.primary,
  },
  errorText: {
    fontSize: SIZES.caption,
    color: COLORS.error,
    marginTop: SIZES.xs,
    marginLeft: SIZES.xs,
  },
});
