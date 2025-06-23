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
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import EmailIcon from '../../utils/icons/EmailIcon';
import LockIcon from "../../utils/icons/LockIcon"
import { hp, wp } from '../../utils/dimensions';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = () => {

    navigation.navigate('Main')
  };

  return (
    <LinearGradient
      colors={['#000337', '#000000']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <BackButton />
        <Text style={styles.heading}>Log in 🔐</Text>
        <Text style={styles.subText}>Glad to see you! Please log in</Text>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', '#000']} // 💡 You can use your own color combo
          style={styles.formGradient}
        >
          <CustomInput placeholder={"Enter Email"} lable={"Email"} iconComponent={<EmailIcon />} value={email} onChangeText={setEmail} />
          <CustomInput placeholder={"Enter Password"} lable={"Password"} isPassword={true} iconComponent={<LockIcon />} value={password} onChangeText={setPassword} secureTextEntry={true} />

          <View style={styles.optionsContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe}
                tintColors={{ true: '#fff', false: '#ccc' }}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton title={"Log in"} onPress={handleLogin} />

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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  heading: {
    fontSize: wp(6),
    // fontWeight: '500',
    fontFamily: "Poppins-SemiBold",
    color: '#fff',
    textAlign: "left",
    width: "100%",
    paddingHorizontal: wp(5),
    // fontFamily:"Poppins-Regular"
  },
  subText: {
    fontSize: wp(4),
    fontFamily: "Poppins-Regular",
    color: '#D3D3D3',
    textAlign: "left",
    width: "100%",
    paddingHorizontal: wp(5),
    marginTop: hp(0),
    marginBottom: hp(4),
  },
  formGradient: {
    width: '100%',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderTopWidth: 0.2,
    borderColor: "gray",
  },
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   borderRadius: 15,
  //   paddingHorizontal: 15,
  //   marginBottom: 15,
  //   height: 55,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.06,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 8,
  //   elevation: 4,
  // },
  // icon: {
  //   marginRight: 10,
  // },
  // input: {
  //   flex: 1,
  //   fontSize: 16,
  //   color: '#333',
  // },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: hp(2),
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
    fontSize: wp(3),
    // fontWeight: '500',
    fontFamily: "Poppins-Regular"
  },
  forgotText: {
    color: '#4068F6',
    marginLeft: wp(2),
    fontSize: wp(3),
    // fontWeight: '500',
    fontFamily: "Poppins-Regular"
  },
  button: {
    backgroundColor: '#4068F6',
    borderRadius: wp(4),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginBottom: hp(3),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    fontSize: wp(3),
    color: '#fff',
  },
  signupLink: {
    color: '#4068F6',
    fontWeight: 'bold',
  },
  // orContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 20,
  // },
  // line: {
  //   width: '40%',
  //   height: 0.5,
  //   backgroundColor: '#000',
  //   marginHorizontal: 10,
  // },
  // orText: {
  //   color: '#000',
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginHorizontal: 10,
  // },
  // buttonGroup: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 20,
  //   marginBottom:20,
  // },
  // socialButton: {
  //   flexDirection:"row",
  //   justifyContent:"space-between",
  //   alignItems:"center",
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   borderRadius: 16,
  //   paddingVertical: 14,
  //   paddingHorizontal: 15,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.12,
  //   shadowRadius: 6,
  //   elevation: 5,
  //   width: 150,
  // },
  // socialIcon: {
  //   width: 36,
  //   height: 36,
  //   // marginBottom: 8,
  //   resizeMode: 'contain',
  // },
  // socialText: {
  //   fontSize: 24,
  //   fontWeight: '600',
  //   color: '#333',
  //   textAlign: 'center',
  // },
});
