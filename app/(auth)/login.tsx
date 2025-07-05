import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Heart } from 'lucide-react-native';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { authService } from '../../services/authService';
import { phoneValidationSchema } from '../../utils/validation';
import { COLORS, SIZES } from '../../utils/constants';

interface LoginForm {
  phoneNumber: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: yupResolver(phoneValidationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      //await authService.sendOTP(data.phoneNumber);
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phoneNumber: data.phoneNumber },
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Heart size={SIZES.icon.xl} color={COLORS.background.primary} />
            </View>
            <Text style={styles.title}>Saanjog</Text>
            <Text style={styles.subtitle}>Find your perfect match</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>
              Enter your phone number to continue
            </Text>

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phoneNumber?.message}
                  touched={!!errors.phoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  containerStyle={styles.inputContainer}
                  leftIcon={
                    <Text style={styles.countryCode}>+91</Text>
                  }
                />
              )}
            />

            <CustomButton
              title="Send OTP"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={!isValid}
              variant="primary"
              size="large"
              style={styles.submitButton}
            />

            <Text style={styles.terms}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.display,
    fontWeight: 'bold',
    color: COLORS.background.primary,
    fontFamily: 'Poppins-Bold',
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.subheading,
    color: COLORS.background.primary,
    opacity: 0.9,
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.lg,
    marginTop: SIZES.xl,
  },
  formTitle: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SIZES.xs,
    fontFamily: 'Poppins-Bold',
  },
  formSubtitle: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    marginBottom: SIZES.lg,
  },
  countryCode: {
    fontSize: SIZES.subheading,
    color: COLORS.text.primary,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    marginTop: SIZES.md,
    marginBottom: SIZES.lg,
  },
  terms: {
    fontSize: SIZES.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
});