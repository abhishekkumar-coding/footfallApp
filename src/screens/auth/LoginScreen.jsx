import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/PageHeader';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import EmailIcon from '../../utils/icons/EmailIcon';
import LockIcon from '../../utils/icons/LockIcon';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  useGoogleAuthMutation,
  useGoogleLoginMutation,
  useLoginMutation,
} from '../../features/auth/authApi';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { clearPendingReferral, setUser } from '../../features/auth/userSlice';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../../layout/AppLayout';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AppButton from '../../components/AppButton';
import AppCheckBox from '../../components/AppCheckBox';
import Spacer from '../../components/Spacer';
import { Colors } from '../../utils/Colors';

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loginType, setLoginType] = useState('user');

  const [googleLoading, setGoogleLoading] = useState(false);

  const fcmToken = useSelector(state => state.user.fcmToken);
  const referralCode = useSelector(state => state.user.pendingReferral);
  console.log("Extracted referral code {In login screen} from REDUX: ", referralCode)
  console.log('FCM Token from Redux Store', fcmToken);
// const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isDisabled = !email.trim() || !password.trim();
  const [login, {isLoading}] = useLoginMutation();
  // const [googleLogin] = useGoogleLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();

  const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  });

  useEffect(() => {
    if (referralCode) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Signup', params: { referralCode } }],
      });
    }
  }, []);


  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        const savedPassword = await AsyncStorage.getItem('rememberedPassword');
        const remember = await AsyncStorage.getItem('rememberMe');

        if (remember === 'true' && savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Failed to load saved credentials', error);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    const formData = { email, password, fcmToken };

    if (!email.trim() || !password.trim()) {
      setShowError(true);
      return;
    }
    
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const errorMessage =
        result.error.errors[0]?.message || 'Validation failed';
      Toast.show({
        type: 'error',
        text1: t('validation_error'),
        text2: errorMessage,
      });
      return;
    }

    try {
      // setIsLoading(true);
      const res = await login(formData).unwrap();
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch(setUser(res.data.user));
      console.log('Login Response: ', res.data);
      dispatch(clearPendingReferral())

      // 🔐 Save credentials if "Remember Me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberedPassword', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
        await AsyncStorage.setItem('rememberMe', 'false');
      }

      Toast.show({
        type: 'success',
        text1: t('login_success_title'),
        text2: t('login_success_message'),
      });

      setTimeout(() => {
        navigation.navigate('Main');
      }, 500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('login_failed_title'),
        text2: t('login_failed_message'),
      });
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      console.log('Token Found : ', token);
    } else {
      console.log('token not found');
    }
  };

  const handleVendorClick = () => {
    setLoginType('vendor');
    navigation.navigate('VendorWebView');
    setTimeout(() => setLoginType('user'), 1000);
  };

  const handleGoogleLogin = async () => {
    console.log('[GOOGLE LOGIN] Triggered');

    try {
      setGoogleLoading(true);
      console.log('[GOOGLE LOGIN] Checking Play Services...');

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log('[GOOGLE LOGIN] Play Services available');

      console.log('[GOOGLE LOGIN] Signing out to force account picker...');
      await GoogleSignin.signOut();

      console.log('[GOOGLE LOGIN] Starting sign-in...');
      const userInfo = await GoogleSignin.signIn();
      console.log('[GOOGLE LOGIN] User Info:', userInfo);

      const idToken = userInfo.idToken || userInfo.data?.idToken;
      console.log('[GOOGLE LOGIN] ID Token:', idToken);

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      console.log('[GOOGLE LOGIN] Sending ID token to backend...');
      const response = await googleAuth({ token: idToken, fcmToken }).unwrap();
      console.log('[GOOGLE LOGIN] Backend Response:', response);
      dispatch(clearPendingReferral())
      const appToken = response?.data?.token;
      const backendUser = response?.data?.user;

      if (!appToken) {
        console.error('[GOOGLE LOGIN] App token missing in response');
        throw new Error('App token missing in response');
      }

      const googlePhoto = userInfo.user?.photo || userInfo.data?.user?.photo;
      const fullUser = {
        ...backendUser,
        photo: backendUser?.photo || googlePhoto,
      };

      console.log('[GOOGLE LOGIN] Final user object:', fullUser);

      console.log('[GOOGLE LOGIN] Saving token and user to AsyncStorage...');
      await AsyncStorage.setItem('token', appToken);
      await AsyncStorage.setItem('user', JSON.stringify(fullUser));
      dispatch(setUser(fullUser));

      Toast.show({
        type: 'success',
        text1: t('google_success'),
        text2: t('google_welcome', { name: fullUser?.name || 'User' }),
      });

      console.log('[GOOGLE LOGIN] Navigating to Main screen...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

    } catch (error) {
      console.log('[GOOGLE LOGIN] Error occurred:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({ type: 'info', text1: t('google_cancelled') });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({ type: 'info', text1: t('google_progress') });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({ type: 'error', text1: t('google_play_services_error') });
      } else {
        Toast.show({
          type: 'error',
          text1: t('google_failed'),
          text2: t('google_default_error'),
        });
      }
    } finally {
      setGoogleLoading(false);
      console.log('[GOOGLE LOGIN] Loading state set to false');
    }
  };

  return (
    <AppLayout>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={20}
        style={styles.container}
      >

        <Text style={styles.heading}>{t('login_title')}</Text>
        {/* <Text style={styles.subText}>Glad to see you! Please log in</Text> */}
        <View style={styles.loginTypeContainer}>
          <TouchableOpacity onPress={() => setLoginType('user')}>
            <Text
              style={[
                styles.loginTypeText,
                loginType === 'user' && styles.activeLoginType,
              ]}
            >
              {t('login_user')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleVendorClick}>
            <Text
              style={[
                styles.loginTypeText,
                loginType === 'vendor' && styles.activeLoginType,
              ]}
            >
              {t('login_vendor')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <CustomInput
            placeholder={t('login_email_placeholder')}
            lable={t('login_email_label')}
            iconComponent={<EmailIcon />}
            value={email}
            onChangeText={setEmail}
            showError={showError}
            keyboardType='email-address'
          />
          <CustomInput
            placeholder={t('login_password_placeholder')}
            lable={t('login_password_label')}
            isPassword={true}
            iconComponent={<LockIcon />}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            showError={showError}
          />
        </View>
        <View style={styles.optionsContainer}>
          <View style={styles.checkboxContainer}>
            <AppCheckBox value={rememberMe} onValueChange={setRememberMe} />
            <Text style={styles.rememberText}>{t('remember_me')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>{t('forgot_password')}</Text>
          </TouchableOpacity>
        </View>
        <AppButton disabled={isDisabled} title={t('login_button')} onPress={handleLogin} isLoading={isLoading}/>
        <Spacer height={10}/>
        <SocialLoginOptions onGooglePress={handleGoogleLogin} />
        <Spacer height={20} />
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>
            {t('no_account')}{' '}
            <Text style={styles.signupLink}>{t('signup_link')}</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

export default LoginScreen;

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

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  heading: {
    fontSize: RFValue(18),
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textAlign: 'left',
    width: '100%',
    marginBottom: 20,
  },
  loginTypeContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 25
  },

  loginTypeText: {
    color: '#ccc',
    fontSize: 16,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  activeLoginType: {
    color: '#fff',
    fontWeight: 'bold',
    borderBottomColor: '#fff',
  },
  inputContainer: {
    gap: 10,
  },
  subText: {
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Regular',
    color: '#D3D3D3',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: wp(5),
    marginBottom: hp(4),
  },
  formGradient: {
    borderTopWidth: 0.2,
    borderColor: 'gray',
    width: '100%',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
    marginTop: hp(1),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#d3d3d3',
    marginLeft: wp(2),
    fontSize: RFValue(14, SCREEN_HEIGHT),
    fontFamily: 'Poppins-Regular',
  },
  forgotText: {
    color: Colors.primary,
    marginLeft: wp(2),
    fontSize: RFValue(14, SCREEN_HEIGHT),
    fontFamily: 'Poppins-Regular',
  },
  signupText: {
    textAlign: 'center',
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  signupLink: {
    color: Colors.primary,
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14, SCREEN_HEIGHT),
  },
  avoidSoftInputView: {
    flex: 1
  }
});
