import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import LinearGradient from 'react-native-linear-gradient';
import UserIcon from '../../utils/icons/UserIcon';
import EmailIcon from '../../utils/icons/EmailIcon';
import LockIcon from "../../utils/icons/LockIcon"
import { hp, wp } from '../../utils/dimensions';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Signup logic
    Alert.alert(`Name: ${name}, Email: ${email}, Password: ${password}`);
  };

  return (
    <LinearGradient
      colors={['#000337', '#000000']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <BackButton />
        <Text style={styles.heading}>Create an account ✨</Text>
          <Text style={styles.subText}>Join us today! It only takes a moment</Text>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', '#000']} 
          style={styles.formGradient}
        >


          <CustomInput placeholder={'Enter Name'} lable={"Name"} iconComponent={<UserIcon/>} value={name} onChangeText={setName} />
          <CustomInput placeholder={'Enter Email'} lable={"Email"} iconComponent={<EmailIcon/>} value={email} onChangeText={setEmail} />
          <CustomInput placeholder={'Enter Password'} lable={"Password"} iconComponent={<LockIcon/>} value={password} onChangeText={setPassword} isPassword={true} />

          <CustomButton title={'Sign Up'} onPress={handleSignup} />
          <SocialLoginOptions />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={{ color: '#4068F6', fontWeight: 'bold' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View >
    </LinearGradient >
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    width:"100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  heading: {
    width:"100%",
    paddingHorizontal:wp(5),
    fontSize: wp(6),
    // fontWeight: '500',
    fontFamily:"Poppins-SemiBold",
    marginTop:hp(5),
    color: '#fff',
    textAlign:"left",
  },
  subText: {
    width:"100%",
    paddingHorizontal:wp(5),
    fontSize: wp(4),
    color: '#d3d3d3',
    marginBottom: hp(2),
    textAlign:"left",
    fontFamily:"Poppins-Regular",
  },
  formGradient: {
    width: '100%',
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    borderTopWidth: 0.2,
    borderColor: "gray",
    gap:5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    paddingHorizontal: wp(1.5),
    marginVertical: hp(1),
    // height: 55,
  },
  icon: {
    // marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    // backgroundColor: '#007bff',
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 0,
    fontSize: wp(3),
    color: '#d3d3d3',
    fontFamily:"Poppins-Regular",
    textAlign: 'center',
  },
});
