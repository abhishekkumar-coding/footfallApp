import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import LinearGradient from 'react-native-linear-gradient';
import UserIcon from '../../utils/icons/UserIcon';
import EmailIcon from '../../utils/icons/EmailIcon';
import LockIcon from '../../utils/icons/LockIcon';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import PhoneIcon from '../../utils/icons/PhoneIcon';
import {
  useGoogleAuthMutation,
  useGoogleSignUpMutation,
  useSignupMutation,
} from '../../features/auth/authApi';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import SendIntentAndroid from 'react-native-send-intent';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { clearPendingReferral, setUser } from '../../features/auth/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const SignupScreen = ({ route }) => {

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');

        if (storedUser && token) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }], // Use your home screen name
          });
        }
      } catch (err) {
        console.log('Error checking login:', err);
      }
    };

    checkIfLoggedIn();
  }, []);


  const { t } = useTranslation();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [showError, setShowError] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);
  const fcmToken = useSelector(state => state.user.fcmToken);


  const [signup, { isLoading }] = useSignupMutation();
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleDeepLink = (url) => {
      if (!url) return;
      const query = url.split('?')[1];
      if (!query) return;
      const params = new URLSearchParams(query);
      const referral = params.get('referral') || params.get('referralCode');
      if (referral) {
        console.log('Referral from deep link:', referral);
        setReferredBy(referral);
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);




  const signupSchema = z.object({
    name: z.string().min(3, { message: t('signup.validation.name_min') }),
    email: z.string().email({ message: t('signup.validation.email_invalid') }),
    phone: z
      .string()
      .min(10, { message: t('signup.validation.phone_min') })
      .max(15, { message: t('signup.validation.phone_max') }),
    password: z
      .string()
      .min(6, { message: t('signup.validation.password_min') }),
  });

  const handleSignup = async () => {
    const formData = { name, email, phone, password, referredBy };
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setShowError(true);
      return;
    }

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const firstError =
        result.error.errors[0]?.message || t('validation_failed');
      Toast.show({
        type: 'error',
        text1: t('signup.validation_error') || t('validation_error'),
        text2: firstError,
      });
      return;
    }

    try {
      const response = await signup(formData).unwrap();
      Toast.show({
        type: 'success',
        text1: t('signup.messages.success_title'),
        text2: t('signup.messages.success_message'),
      });
      dispatch(clearPendingReferral());
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('signup.messages.failed_title'),
        text2: error?.data?.message || t('signup.messages.failed_message'),
      });
    }
  };


  const onGooglePress = async () => {
    try {
      setGoogleLoading(true);

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();
      console.log('Google userInfo:', userInfo);

      const idToken = userInfo.idToken || userInfo?.data?.idToken;
      if (!idToken) throw new Error('No ID token received from Google');

      const payload = {
        token: idToken,
        referredBy: referredBy || null,
        fcmToken: fcmToken || null,
      };

      const response = await googleAuth(payload).unwrap();
      console.log('Backend Google Signup Response:', response);

      const isExistingUser = response?.data?.user && !response?.data?.newUser;
      if (isExistingUser && referredBy) {
        Toast.show({
          type: 'info',
          text1: 'Already Registered',
          text2: 'You are already registered and cannot sign up again with a referral code.',
        });
        return;
      }

      const appToken = response?.data?.token;
      if (!appToken) throw new Error('App token missing in response');

      const backendUser = response?.data?.newUser || response?.data?.user || {};

      const user = {
        ...backendUser,
        photo: backendUser.photo || userInfo.user?.photo,
        name: backendUser.name || userInfo.user?.name,
        email: backendUser.email || userInfo.user?.email,
      };

      await AsyncStorage.setItem('token', appToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch(setUser(user));
      dispatch(clearPendingReferral());

      Toast.show({
        type: 'success',
        text1: t('signup.google.success'),
        text2: t('signup.google.welcome', {
          name: user?.name || t('signup.google.default_name', 'User'),
        }),
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

    } catch (error) {
      console.error('Google Sign-Up Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({ type: 'info', text1: t('signup.google.cancelled') });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({ type: 'info', text1: t('signup.google.progress') });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: 'error',
          text1: t('signup.google.play_services_error'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('signup.google.failed'),
          text2: error?.data?.message || t('signup.google.default_error'),
        });
      }

    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <>
      {/* <BackButton lable={t('signup.title')} back /> */}
      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        {(isLoading || googleLoading) && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.heading}>{t('signup.heading')}</Text>
              <Text style={styles.subText}>{t('signup.subheading')}</Text>

              <View style={styles.formContainer}>
                <CustomInput
                  placeholder={t('signup.placeholders.name')}
                  lable={t('signup.labels.name')}
                  iconComponent={<UserIcon />}
                  value={name}
                  showError={showError}
                  onChangeText={setName}
                />
                <CustomInput
                  placeholder={t('signup.placeholders.email')}
                  lable={t('signup.labels.email')}
                  iconComponent={<EmailIcon />}
                  value={email}
                  showError={showError}
                  onChangeText={setEmail}
                />
                <CustomInput
                  placeholder={t('signup.placeholders.phone')}
                  lable={t('signup.labels.phone')}
                  iconComponent={<PhoneIcon />}
                  value={phone}
                  showError={showError}
                  onChangeText={setPhone}
                />
                <CustomInput
                  placeholder={t('signup.placeholders.password')}
                  lable={t('signup.labels.password')}
                  iconComponent={<LockIcon />}
                  value={password}
                  onChangeText={setPassword}
                  showError={showError}
                  isPassword={true}
                />
                <CustomInput
                  lable={t('signup.labels.referral')}
                  placeholder={t('signup.placeholders.referral')}
                  required={false}
                  value={referredBy}
                  onChangeText={setReferredBy}
                />

                <View style={styles.buttonContainer}>
                  <CustomButton
                    title={t('signup.button')}
                    onPress={handleSignup}
                  />
                </View>

                <SocialLoginOptions onGooglePress={onGooglePress} />

                <TouchableOpacity
                  onPress={() => {
                    dispatch(clearPendingReferral());
                    navigation.navigate('Login');
                  }}
                  style={styles.loginTextContainer}
                >
                  <Text style={styles.loginText}>
                    {t('signup.links.already_account')}{' '}
                    <Text style={styles.loginLink}>
                      {t('signup.links.login')}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  heading: {
    fontSize: RFValue(18),
    fontFamily: 'Poppins-SemiBold',
    marginTop: hp(4),
    color: '#fff',
    textAlign: 'left',
    marginBottom: hp(1),
  },
  subText: {
    fontSize: RFValue(10),
    color: '#d3d3d3',
    marginBottom: hp(2),
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
  },
  formContainer: {
    width: '100%',
    padding: wp(0),
    borderRadius: 12,
    marginBottom: hp(2),
  },
  buttonContainer: {
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  loginTextContainer: {
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  loginText: {
    fontSize: RFValue(10),
    color: '#d3d3d3',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  loginLink: {
    color: '#4068F6',
    fontFamily: 'Poppins-Regular',
  },
});

export default SignupScreen;

