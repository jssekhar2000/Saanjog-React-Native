import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../../utils/constants';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: CustomButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    variant === 'outline' && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? COLORS.primary : COLORS.background.primary} 
          size="small" 
        />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        style={buttonStyles} 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled ? [COLORS.text.disabled, COLORS.text.disabled] : [COLORS.primary, COLORS.secondary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const containerStyle = [
    buttonStyles,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
  ];

  return (
    <TouchableOpacity 
      style={containerStyle} 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius.md,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SIZES.sm,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Sizes
  small: {
    minHeight: 36,
  },
  medium: {
    minHeight: 48,
  },
  large: {
    minHeight: 56,
  },
  
  // Text sizes
  smallText: {
    fontSize: SIZES.body,
  },
  mediumText: {
    fontSize: SIZES.subheading,
  },
  largeText: {
    fontSize: SIZES.title,
  },
  
  // Variants
  secondary: {
    backgroundColor: COLORS.background.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SIZES.md - 2,
    paddingHorizontal: SIZES.lg,
  },
  outlineText: {
    color: COLORS.primary,
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: COLORS.text.disabled,
  },
});