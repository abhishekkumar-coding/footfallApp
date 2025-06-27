import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import LinearGradient from 'react-native-linear-gradient';
import UserIcon from '../../utils/icons/UserIcon';
import EmailIcon from '../../utils/icons/EmailIcon';
import LockIcon from "../../utils/icons/LockIcon";
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import PhoneIcon from '../../utils/icons/PhoneIcon';
import { useSignupMutation } from '../../features/auth/authApi';
import { z } from 'zod';
import Toast from 'react-native-toast-message';


const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('');

  const [signup, { isLoading }] = useSignupMutation();

  const signupSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(15, { message: "Phone number too long" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  const handleSignup = async () => {
    const formData = { name, email, phone, password };

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: firstError,
      }); return;
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
      console.log(response);
      console.log(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error?.data?.message || 'Something went wrong',
      });
    }
  };

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <BackButton />
          <Text style={styles.heading}>Create an account ✨</Text>
          <Text style={styles.subText}>Join us today! It only takes a moment</Text>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', '#000']}
            style={styles.formGradient}
          >
            <CustomInput
              placeholder={'Enter Name'}
              lable={"Name"}
              iconComponent={<UserIcon />}
              value={name}
              onChangeText={setName}
            />
            <CustomInput
              placeholder={'Enter Email'}
              lable={"Email"}
              iconComponent={<EmailIcon />}
              value={email}
              onChangeText={setEmail}
            />
            <CustomInput
              placeholder={'Enter Phone'}
              lable={"Phone"}
              iconComponent={<PhoneIcon />}
              value={phone}
              onChangeText={setPhone}
            />
            <CustomInput
              placeholder={'Enter Password'}
              lable={"Password"}
              iconComponent={<LockIcon />}
              value={password}
              onChangeText={setPassword}
              isPassword={true}
            />

            <CustomButton title={'Sign Up'} onPress={handleSignup} />
            <SocialLoginOptions />
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={{ color: '#4068F6', fontWeight: 'bold' }}>Login</Text>
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  heading: {
    width: "100%",
    paddingHorizontal: wp(5),
    fontSize: RFValue(17),
    fontFamily: "Poppins-SemiBold",
    marginTop: hp(7),
    color: '#fff',
    textAlign: "left",
  },
  subText: {
    width: "100%",
    paddingHorizontal: wp(5),
    fontSize: RFValue(11),
    color: '#d3d3d3',
    marginBottom: hp(1),
    textAlign: "left",
    fontFamily: "Poppins-Regular",
  },
  formGradient: {
    width: '100%',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderTopWidth: 0.2,
    borderColor: "gray",
    gap: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    paddingHorizontal: wp(1.5),
    marginVertical: hp(0),
  },
  input: {
    flex: 1,
    fontSize: RFValue(14),
    color: '#333',
  },
  button: {
    marginTop: hp(2),
    borderRadius: 12,
    paddingVertical: 0,
    alignItems: 'center',
  },
  loginText: {
    marginTop: 0,
    fontSize: RFValue(10),
    color: '#d3d3d3',
    fontFamily: "Poppins-Regular",
    textAlign: 'center',
  },
});
