import * as yup from 'yup';

export const phoneValidationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
});

export const otpValidationSchema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required')
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d{6}$/, 'OTP must contain only numbers'),
});

export const profileValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .optional(),
  dateOfBirth: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old'),
  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Please select a gender')
    .required('Gender is required'),
  religion: yup
    .string()
    .required('Religion is required'),
  caste: yup
    .string()
    .required('Caste is required'),
  education: yup
    .string()
    .required('Education is required'),
  profession: yup
    .string()
    .required('Profession is required'),
  height: yup
    .string()
    .required('Height is required'),
  maritalStatus: yup
    .string()
    .oneOf(['never_married', 'divorced', 'widowed'], 'Please select marital status')
    .required('Marital status is required'),
  city: yup
    .string()
    .required('City is required'),
  state: yup
    .string()
    .required('State is required'),
});