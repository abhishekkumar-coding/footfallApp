import React, { useState, useEffect } from 'react';
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
  useGoogleAuthUserMutation,
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
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/auth/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [showError, setShowError] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);


  const [signup, { isLoading }] = useSignupMutation();
  // const [googleAuthUser] = useGoogleAuthUserMutation();
  const [googleSignUp] = useGoogleSignUpMutation();
  const dispatch = useDispatch();

  const signupSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .max(15, { message: 'Phone number too long' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  });

  const handleSignup = async () => {
    const formData = { name, email, phone, password, referredBy };
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setShowError(true);
      return;
    }

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid input';
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: firstError,
      });
      return;
    }

    try {
      const response = await signup(formData).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Signup Successful',
        text2: 'You can now log in.',
      });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error?.data?.message || 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    const handleDeepLink = url => {
      if (!url) return;

      const query = url.split('?')[1];
      if (!query) return;

      const params = new URLSearchParams(query);
      const referral = params.get('referralCode');

      if (referral) {
        setReferredBy(referral);
      }
    };

    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);
  4;

  // const onGooglePress = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices({
  //       showPlayServicesUpdateDialog: true,
  //     });
  //     const userInfo = await GoogleSignin.signIn();

  //     console.log('Google userInfo:', userInfo);

  //     const idToken = userInfo.data?.idToken || userInfo.idToken;
  //     const userName = userInfo.data?.user?.name || 'User';

  //     if (!idToken) {
  //       throw new Error('No ID token received from Google');
  //     }

  //     Toast.show({
  //       type: 'success',
  //       text1: 'Google Sign-In Success',
  //       text2: `Welcome ${userName}`,
  //     });

  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Main' }],
  //     });

  //   } catch (error) {
  //     console.error('Google Sign-In Error:', error);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       Toast.show({ type: 'info', text1: 'Sign-In Cancelled' });
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       Toast.show({ type: 'info', text1: 'Sign-In In Progress' });
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       Toast.show({ type: 'error', text1: 'Play Services Not Available' });
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Google Sign-In Error',
  //         text2: error?.message || 'Something went wrong',
  //       });
  //     }
  //   }
  // };

  // const onGooglePress = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices({
  //       showPlayServicesUpdateDialog: true,
  //     });

  //     // ✅ Always sign out first to force account selection
  //     await GoogleSignin.signOut();

  //     const userInfo = await GoogleSignin.signIn();
  //     console.log('Google userInfo:', userInfo);

  //     const idToken = userInfo.idToken || userInfo.data?.idToken;
  //     const photo = userInfo.user?.photo;

  //     if (!idToken) throw new Error('No ID token received from Google');

  //     // ✅ Send to backend to convert to your app token
  //     // const response = await googleAuthUser({ token: idToken }).unwrap();
  //     const response = await googleSignUp({ token: idToken, photo }).unwrap();
  //     console.log('Backend Response:', response);

  //     const appToken = response?.data?.token;
  //     // const user = response?.data?.user;
  //     const user = { ...response?.data?.user, photo };

  //     if (!appToken) throw new Error('App token missing in response');

  //     // ✅ Save app token and user info
  //     await AsyncStorage.setItem('token', appToken);
  //     await AsyncStorage.setItem('user', JSON.stringify(user));
  //     dispatch(setUser(user));

  //     Toast.show({
  //       type: 'success',
  //       text1: 'Google Sign-Up Success',
  //       text2: `Welcome ${user?.name || 'User'}`,
  //     });

  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'Main' }],
  //     });
  //   } catch (error) {
  //     console.error('Google Sign-Up Error:', error);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       Toast.show({ type: 'info', text1: 'Sign-Up Cancelled' });
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       Toast.show({ type: 'info', text1: 'Sign-Up In Progress' });
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       Toast.show({ type: 'error', text1: 'Play Services Not Available' });
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Google Sign-Up Failed',
  //         text2: error?.data?.message || 'Something went wrong',
  //       });
  //     }
  //   }
  // };

const onGooglePress = async () => {
  try {
    setGoogleLoading(true);
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    await GoogleSignin.signOut();

    const userInfo = await GoogleSignin.signIn();
    console.log('Google userInfo:', userInfo);

    const idToken = userInfo.idToken || userInfo.data?.idToken;
    if (!idToken) throw new Error('No ID token received from Google');

    // Send token to backend
    const response = await googleSignUp({ token: idToken }).unwrap();
    console.log('Backend Response:', response);

    // ✅ Fix here: use "newUser" instead of "user"
    const backendUser = response?.data?.newUser || {};

    const user = {
      ...backendUser,
      photo: backendUser.photo || userInfo.user?.photo,
      name: backendUser.name || userInfo.user?.name,
      email: backendUser.email || userInfo.user?.email,
    };

    const appToken = response?.data?.token;
    if (!appToken) throw new Error('App token missing in response');

    await AsyncStorage.setItem('token', appToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch(setUser(user));

    Toast.show({
      type: 'success',
      text1: 'Google Sign-Up Success',
      text2: `Welcome ${user?.name || 'User'}`,
    });

    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  } catch (error) {
    console.error('Google Sign-Up Error:', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Toast.show({ type: 'info', text1: 'Sign-Up Cancelled' });
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Toast.show({ type: 'info', text1: 'Sign-Up In Progress' });
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Toast.show({ type: 'error', text1: 'Play Services Not Available' });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Google Sign-Up Failed',
        text2: error?.data?.message || 'Something went wrong',
      });
    }
  }finally {
    setGoogleLoading(false); 
  }
};



  return (
    <>
      <BackButton lable={'Sign Up'} back />
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
              <Text style={styles.heading}>Create an account ✨</Text>
              <Text style={styles.subText}>
                Join us today! It only takes a moment
              </Text>

              <View style={styles.formContainer}>
                <CustomInput
                  placeholder={'Enter Name'}
                  lable={'Name'}
                  iconComponent={<UserIcon />}
                  value={name}
                  showError={showError}
                  onChangeText={setName}
                />
                <CustomInput
                  placeholder={'Enter Email'}
                  lable={'Email'}
                  iconComponent={<EmailIcon />}
                  value={email}
                  showError={showError}
                  onChangeText={setEmail}
                />
                <CustomInput
                  placeholder={'Enter Phone'}
                  lable={'Phone'}
                  iconComponent={<PhoneIcon />}
                  value={phone}
                  showError={showError}
                  onChangeText={setPhone}
                />
                <CustomInput
                  placeholder={'Enter Password'}
                  lable={'Password'}
                  iconComponent={<LockIcon />}
                  value={password}
                  onChangeText={setPassword}
                  showError={showError}
                  isPassword={true}
                />
                <CustomInput
                  lable="Referral code"
                  placeholder="Enter Referral code (Optional)"
                  required={false}
                  value={referredBy}
                  onChangeText={setReferredBy}
                />

                <View style={styles.buttonContainer}>
                  <CustomButton title={'Sign Up'} onPress={handleSignup} />
                </View>

                <SocialLoginOptions onGooglePress={onGooglePress} />

                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={styles.loginTextContainer}
                >
                  <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text style={styles.loginLink}>Login</Text>
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
    fontSize: RFValue(22),
    fontFamily: 'Poppins-SemiBold',
    marginTop: hp(4),
    color: '#fff',
    textAlign: 'left',
    marginBottom: hp(1),
  },
  subText: {
    fontSize: RFValue(14),
    color: '#d3d3d3',
    marginBottom: hp(3),
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
    fontSize: RFValue(14),
    color: '#d3d3d3',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  loginLink: {
    color: '#4068F6',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SignupScreen;