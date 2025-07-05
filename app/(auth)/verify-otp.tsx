import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Shield, ArrowLeft } from 'lucide-react-native';
import CustomButton from '../../components/common/CustomButton';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { otpValidationSchema } from '../../utils/validation';
import { COLORS, SIZES } from '../../utils/constants';

interface OTPForm {
  otp: string;
}

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const { login } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const otpInputs = useRef<TextInput[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<OTPForm>({
    resolver: yupResolver(otpValidationSchema),
    mode: 'onChange',
  });

  const otpValue = watch('otp') || '';

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: OTPForm) => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(phoneNumber, data.otp);
      await login(response.token, response.user);
      
      if (response.user.firstName) {
        router.replace('/(tabs)/');
      } else {
        router.replace('/(auth)/onboarding');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Invalid OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phoneNumber || !canResend) return;
    
    try {
      await authService.sendOTP(phoneNumber);
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('Success', 'OTP sent successfully!');
    } catch (error: any) {onboarding
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to resend OTP. Please try again.'
      );
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const newOTP = otpValue.split('');
    newOTP[index] = text;
    const fullOTP = newOTP.join('').substring(0, 6);
    setValue('otp', fullOTP);

    // Auto-focus next input
    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpValue[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
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
              <Shield size={SIZES.icon.xl} color={COLORS.background.primary} />
            </View>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {phoneNumber}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange } }) => (
                <View style={styles.otpContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (ref) otpInputs.current[index] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        otpValue[index] && styles.otpInputFilled,
                        errors.otp && styles.otpInputError,
                      ]}
                      value={otpValue[index] || ''}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={({ nativeEvent }) => 
                        handleKeyPress(nativeEvent.key, index)
                      }
                      keyboardType="numeric"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>
              )}
            />

            {errors.otp && (
              <Text style={styles.errorText}>{errors.otp.message}</Text>
            )}

            <CustomButton
              title="Verify OTP"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              //disabled={!isValid}
              variant="primary"
              size="large"
              style={styles.submitButton}
            />

            <View style={styles.resendContainer}>
              {canResend ? (
                <CustomButton
                  title="Resend OTP"
                  onPress={handleResendOTP}
                  variant="outline"
                  size="medium"
                />
              ) : (
                <Text style={styles.resendTimer}>
                  Resend OTP in {resendTimer}s
                </Text>
              )}
            </View>
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
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    paddingHorizontal: SIZES.md,
  },
  formContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.lg,
    marginTop: SIZES.xl,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius.md,
    textAlign: 'center',
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.tertiary,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background.primary,
  },
  otpInputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: SIZES.caption,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  submitButton: {
    marginBottom: SIZES.lg,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendTimer: {
    fontSize: SIZES.body,
    color: COLORS.text.secondary,
    fontFamily: 'Inter-Regular',
  },
});