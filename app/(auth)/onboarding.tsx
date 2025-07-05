import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User, Calendar, MapPin } from 'lucide-react-native';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { profileValidationSchema } from '../../utils/validation';
import { COLORS, SIZES, RELIGIONS, CASTES, EDUCATION_LEVELS, PROFESSIONS, HEIGHTS, MARITAL_STATUS, INDIAN_STATES } from '../../utils/constants';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import moment from 'moment';
import CustomHeightPicker from '@/components/common/CustomHeightPicker';
import CustomDropdown from '@/components/common/CustomDropdown';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  religion: string;
  caste: string;
  education: string;
  profession: string;
  height: string;
  maritalStatus: 'never_married' | 'divorced' | 'widowed';
  city: string;
  state: string;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const totalSteps = 4;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<ProfileForm>({
    resolver: yupResolver(profileValidationSchema),
    mode: 'onChange',
  });

  const selectedReligion = watch('religion');
console.log(errors);
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],   // ← use MediaType instead of MediaTypeOptions
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    console.log(data);
    setIsLoading(true);
    try {
      let photoUrl = '';
      
      if (profileImage) {
        const uploadResponse = await authService.uploadPhoto(profileImage);
        photoUrl = uploadResponse.url;
      }

      const profileData = {
        ...data,
        profilePicture: photoUrl,
        photos: photoUrl ? [photoUrl] : [],
        country: 'India',
      };

      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      
      router.replace('/(tabs)/');
    } catch (error: any) {
      console.log(error.response);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    // const isStepValid = await trigger();
    const isStepValid = true;
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Camera size={SIZES.icon.lg} color={COLORS.text.hint} />
            <Text style={styles.imageText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="First Name"
            placeholder="Enter your first name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.firstName?.message}
            touched={!!errors.firstName}
            leftIcon={<User size={SIZES.icon.sm} color={COLORS.text.hint} />}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Last Name"
            placeholder="Enter your last name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.lastName?.message}
            touched={!!errors.lastName}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Email (Optional)"
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            touched={!!errors.email}
            keyboardType="email-address"
          />
        )}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Details</Text>
      
      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, onBlur, value } }) => (
          // <CustomInput
          //   label="Date of Birth"
          //   placeholder="DD/MM/YYYY"
          //   value={value}
          //   onChangeText={onChange}
          //   onBlur={onBlur}
          //   error={errors.dateOfBirth?.message}
          //   touched={!!errors.dateOfBirth}
          //   leftIcon={<Calendar size={SIZES.icon.sm} color={COLORS.text.hint} />}
          // />
          <CustomDatePicker
            label="Date of Birth"
            value={moment(value).toDate()}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.dateOfBirth?.message}
            touched={!!errors.dateOfBirth}
          />
        )}
      />

      <Text style={styles.label}>Gender</Text>
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderButton, value === 'male' && styles.genderButtonActive]}
              onPress={() => onChange('male')}
            >
              <Text style={[styles.genderText, value === 'male' && styles.genderTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, value === 'female' && styles.genderButtonActive]}
              onPress={() => onChange('female')}
            >
              <Text style={[styles.genderText, value === 'female' && styles.genderTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Controller
        control={control}
        name="height"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomHeightPicker
            label="Height"
            value={value}
            onChange={onChange}
            error={errors?.height?.message}
            touched={!!errors.height}
          />
        )}
      />
    </View>
  );

  // const renderStep3 = () => (
  //   <View style={styles.stepContainer}>
  //     <Text style={styles.stepTitle}>Religious & Social</Text>
      
  //     <Controller
  //       control={control}
  //       name="religion"
  //       render={({ field: { onChange, onBlur, value } }) => (
  //         <CustomInput
  //           label="Religion"
  //           placeholder="Select your religion"
  //           value={value}
  //           onChangeText={onChange}
  //           onBlur={onBlur}
  //           error={errors.religion?.message}
  //           touched={!!errors.religion}
  //         />
  //       )}
  //     />

  //     <Controller
  //       control={control}
  //       name="caste"
  //       render={({ field: { onChange, onBlur, value } }) => (
  //         <CustomInput
  //           label="Caste"
  //           placeholder="Select your caste"
  //           value={value}
  //           onChangeText={onChange}
  //           onBlur={onBlur}
  //           error={errors.caste?.message}
  //           touched={!!errors.caste}
  //         />
  //       )}
  //     />

  //     <Controller
  //       control={control}
  //       name="maritalStatus"
  //       render={({ field: { onChange, onBlur, value } }) => (
  //         <CustomInput
  //           label="Marital Status"
  //           placeholder="Select marital status"
  //           value={value}
  //           onChangeText={onChange}
  //           onBlur={onBlur}
  //           error={errors.maritalStatus?.message}
  //           touched={!!errors.maritalStatus}
  //         />
  //       )}
  //     />
  //   </View>
  // );
  const renderStep3 = () => {
    // watch the religion field so we can update caste options
    const selectedReligion = watch('religion');
  
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Religious & Social</Text>
        
        {/* Religion */}
        <Controller
          control={control}
          name="religion"
          render={({ field: { value, onChange }, fieldState: { error, isTouched } }) => (
            <CustomDropdown
              label="Religion"
              options={RELIGIONS}
              value={value}
              onChange={(val) => {
                onChange(val);
                // also clear caste when religion changes
                //setValue('caste', '');
              }}
              error={error?.message}
              touched={isTouched}
            />
          )}
        />
  
        {/* Caste (options depend on selectedReligion) */}
        <Controller
          control={control}
          name="caste"
          render={({ field: { value, onChange }, fieldState: { error, isTouched } }) => (
            <CustomDropdown
              label="Caste"
              options={selectedReligion && CASTES[selectedReligion] 
                        ? CASTES[selectedReligion] 
                        : ['Select religion first']}
              value={value}
              onChange={onChange}
              error={error?.message}
              touched={isTouched}
            />
          )}
        />
  
        {/* Marital Status (static list) */}
        <Controller
          control={control}
          name="maritalStatus"
          render={({ field: { value, onChange }, fieldState: { error, isTouched } }) => (
            <CustomDropdown
              label="Marital Status"
              options={['never_married', 'divorced', 'widowed']}
              value={value}
              onChange={onChange}
              error={error?.message}
              touched={isTouched}
            />
          )}
        />
      </View>
    );
  };
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Professional & Location</Text>
      
      <Controller
        control={control}
        name="education"
        render={({ field: { onChange, onBlur, value } }) => (
          // <CustomInput
          //   label="Education"
          //   placeholder="Select your education level"
          //   value={value}
          //   onChangeText={onChange}
          //   onBlur={onBlur}
          //   error={errors.education?.message}
          //   touched={!!errors.education}
          // />

          <CustomDropdown
            label="Education"
            options={EDUCATION_LEVELS}
            value={value}
            onChange={onChange}
            error={errors.education?.message}
            touched={!!errors.education}
          />
        )}
      />

      <Controller
        control={control}
        name="profession"
        render={({ field: { onChange, onBlur, value } }) => (
          // <CustomInput
          //   label="Profession"
          //   placeholder="Select your profession"
          //   value={value}
          //   onChangeText={onChange}
          //   onBlur={onBlur}
          //   error={errors.profession?.message}
          //   touched={!!errors.profession}
          // />

          <CustomDropdown
            label="Profession"
            options={PROFESSIONS}
            value={value}
            onChange={onChange}
            error={errors.profession?.message}
            touched={!!errors.profession}
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="City"
            placeholder="Enter your city"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.city?.message}
            touched={!!errors.city}
            leftIcon={<MapPin size={SIZES.icon.sm} color={COLORS.text.hint} />}
          />
        )}
      />

      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          // <CustomInput
          //   label="State"
          //   placeholder="Select your state"
          //   value={value}
          //   onChangeText={onChange}
          //   onBlur={onBlur}
          //   error={errors.state?.message}
          //   touched={!!errors.state}
          // />

          <CustomDropdown
            label="State"
            options={INDIAN_STATES}
            value={value}
            onChange={onChange}
            error={errors.state?.message}
            touched={!!errors.state}
          />
        )}
      />
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
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
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Step {currentStep} of {totalSteps}
            </Text>
            
            <View style={styles.progressBar}>
              {Array.from({ length: totalSteps }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index < currentStep && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.formContainer}>
            {renderCurrentStep()}

            <View style={styles.buttonContainer}>
              {currentStep > 1 && (
                <CustomButton
                  title="Previous"
                  onPress={prevStep}
                  variant="outline"
                  size="medium"
                  style={styles.button}
                />
              )}
              
              {currentStep < totalSteps ? (
                <CustomButton
                  title="Next"
                  onPress={nextStep}
                  variant="primary"
                  size="medium"
                  style={styles.button}
                />
              ) : (
                <CustomButton
                  title="Complete Profile"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  //disabled={!isValid}
                  variant="primary"
                  size="medium"
                  style={styles.button}
                />
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
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.background.primary,
    fontFamily: 'Poppins-Bold',
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.body,
    color: COLORS.background.primary,
    opacity: 0.9,
    fontFamily: 'Inter-Regular',
    marginBottom: SIZES.md,
  },
  progressBar: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: COLORS.background.primary,
  },
  formContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  stepContainer: {
    marginBottom: SIZES.lg,
  },
  stepTitle: {
    fontSize: SIZES.subheading,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SIZES.xl,
    fontFamily: 'Poppins-SemiBold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  imageText: {
    fontSize: SIZES.caption,
    color: COLORS.text.hint,
    marginTop: SIZES.xs,
    fontFamily: 'Inter-Regular',
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: SIZES.xs,
    fontFamily: 'Inter-Medium',
  },
  genderRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  genderButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    fontSize: SIZES.subheading,
    color: COLORS.text.primary,
    fontFamily: 'Inter-Medium',
  },
  genderTextActive: {
    color: COLORS.background.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.lg,
  },
  button: {
    flex: 1,
  },
});