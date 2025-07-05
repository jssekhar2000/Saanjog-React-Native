import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SIZES } from '../../utils/constants';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export default function CustomInput({
  label,
  error,
  touched,
  containerStyle,
  inputStyle,
  rightIcon,
  leftIcon,
  secureTextEntry,
  ...props
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = touched && error;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        hasError && styles.error,
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[styles.input, inputStyle]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={COLORS.text.hint}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            {isPasswordVisible ? (
              <EyeOff size={SIZES.icon.sm} color={COLORS.text.secondary} />
            ) : (
              <Eye size={SIZES.icon.sm} color={COLORS.text.secondary} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
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
  },
  focused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: SIZES.subheading,
    color: COLORS.text.primary,
    paddingVertical: SIZES.md,
  },
  leftIcon: {
    marginRight: SIZES.sm,
  },
  rightIcon: {
    marginLeft: SIZES.sm,
  },
  eyeIcon: {
    padding: SIZES.xs,
    marginLeft: SIZES.sm,
  },
  errorText: {
    fontSize: SIZES.caption,
    color: COLORS.error,
    marginTop: SIZES.xs,
    marginLeft: SIZES.xs,
  },
});