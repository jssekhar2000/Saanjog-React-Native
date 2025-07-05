// components/common/CustomDropdown.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { COLORS, SIZES } from '../../utils/constants';
import CustomInput from './CustomInput';

interface CustomDropdownProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  touched?: boolean;
  containerStyle?: ViewStyle;
}

export default function CustomDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  touched,
  containerStyle,
}: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const hasError = touched && error;

  const handleSelect = (item: string) => {
    onChange(item);
    setModalVisible(false);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <CustomInput
          editable={false}
          value={value}
          placeholder={placeholder}
          error={error}
          touched={touched}
          rightIcon={<ChevronDown size={SIZES.icon.sm} color={COLORS.text.secondary} />}
          containerStyle={[
            styles.inputContainer,
            hasError && styles.errorContainer,
          ]}
        />
      </TouchableOpacity>

      <Modal transparent animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: SIZES.xs,
  },
  inputContainer: {
    // override border on CustomInput
    borderColor: COLORS.border,
  },
  errorContainer: {
    borderColor: COLORS.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
  },
  modalContent: {
    marginHorizontal: 24,
    backgroundColor: COLORS.background.primary,
    borderRadius: SIZES.radius.lg,
    maxHeight: '70%',
    padding: SIZES.md,
  },
  option: {
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    fontSize: SIZES.body,
    color: COLORS.text.primary,
  },
  cancel: {
    marginTop: SIZES.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: SIZES.body,
    color: COLORS.error,
    fontWeight: '500',
  },
  errorText: {
    fontSize: SIZES.caption,
    color: COLORS.error,
    marginTop: SIZES.xs,
  },
});
