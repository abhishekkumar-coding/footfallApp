import React, { useState } from 'react';
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
import BackButton from '../../components/BackButton';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import EmailIcon from '../../utils/icons/EmailIcon';
import LockIcon from "../../utils/icons/LockIcon";
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLoginMutation } from '../../features/auth/authApi';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../features/auth/userSlice';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState(false);

  // const user = useSelector((state)=>state.user.user)
  // console.log("User from Redux Store", user)

  const dispatch = useDispatch();


  const [login, { isLoading }] = useLoginMutation()

  const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  });

  const handleLogin = async () => {
    const formData = { email, password };

    if (!email.trim() || !password.trim()) {
      setShowError(true)
      return;
    }


    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Validation failed';
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMessage,
      });
      return;
    }

    try {
      const res = await login(formData).unwrap();
      await AsyncStorage.setItem('token', res.data.token)
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      console.log("user info", res.data.user)
      dispatch(setUser(res.data.user))
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
      setTimeout(() => {
        navigation.navigate('Main');
      }, 500);
      // console.log(` Response : ${JSON.stringify(res.data.user)}`);
      // checkToken()
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.data?.message || 'Invalid credentials',
      });
      console.log(error)
    }
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      console.log("Token Found : ", token)
    }
    else {
      console.log("token not found",)
    }

  }



  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <BackButton />
      <View style={styles.container}>
        <Text style={styles.heading}>Log in 🔐</Text>
        <Text style={styles.subText}>Glad to see you! Please log in</Text>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', '#000']}
          style={styles.formGradient}
        >
          <CustomInput
            placeholder="Enter Email"
            lable="Email"
            iconComponent={<EmailIcon />}
            value={email}
            onChangeText={setEmail}
            showError={showError}
          />
          <CustomInput
            placeholder="Enter Password"
            lable="Password"
            isPassword={true}
            iconComponent={<LockIcon />}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            showError={showError}
          />

          <View style={styles.optionsContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe}
                tintColors={{ true: '#fff', false: '#ccc' }}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton title="Log in" onPress={handleLogin} />

          <SocialLoginOptions />

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  heading: {
    fontSize: RFValue(20),
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: wp(5),
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
    width: '100%',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderTopWidth: 0.2,
    borderColor: 'gray',
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
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Regular',
  },
  forgotText: {
    color: '#4068F6',
    marginLeft: wp(2),
    fontSize: RFValue(10),
    fontFamily: 'Poppins-Regular',
  },
  signupText: {
    textAlign: 'center',
    fontSize: RFValue(10),
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  signupLink: {
    color: '#4068F6',
    fontFamily: 'Poppins-Regular',
    fontSize:RFValue(10)
  },
});
