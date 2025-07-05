import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SIZES, COLORS } from '../../utils/constants';
import CustomInput from './CustomInput';

interface HeightPickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  touched?: boolean;
}

const heights = Array.from({ length: 60 }, (_, i) => {
  const feet = Math.floor((i + 48) / 12);
  const inches = (i + 48) % 12;
  return `${feet}'${inches}"`;
});

export default function CustomHeightPicker({
  label,
  value,
  onChange,
  error,
  touched,
}: HeightPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (height: string) => {
    onChange(height);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <CustomInput
          label={label}
          value={value}
          placeholder="Select your height"
          editable={false}
          error={error}
          touched={touched}
        />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Height</Text>
            <FlatList
              data={heights}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.heightItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.heightText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
  },
  modalContent: {
    marginHorizontal: 30,
    backgroundColor: 'white',
    borderRadius: SIZES.radius.lg,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    //fontSize: SIZES.heading,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  heightItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heightText: {
    fontSize: SIZES.body,
  },
  cancelBtn: {
    textAlign: 'center',
    color: COLORS.error,
    fontWeight: '500',
    marginTop: SIZES.md,
  },
});
