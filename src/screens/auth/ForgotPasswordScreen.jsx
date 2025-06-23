import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import EmailIcon from '../../utils/icons/EmailIcon';
import { hp, wp } from '../../utils/dimensions';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleSendOtp = () => {
    navigation.navigate('OtpVerification');
  };


  return (
    <LinearGradient colors={['#000337', '#000']} style={{ flex: 1 }}>
      <BackButton />
      <View style={styles.container}>
        <Text style={styles.heading}>Forgot Password 🔑</Text>
        <Text style={styles.subText}>
            Enter your email to receive an OTP
        </Text>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', '#000']}
          style={styles.formGradient}
        >


              <CustomInput
                placeholder={'Email'}
                lable={'Email'}
                iconComponent={<EmailIcon />}
                value={email}
                onChangeText={setEmail}
              />
              <CustomButton title={'Send OTP'} onPress={handleSendOtp} />

          

          {/* <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backText}>
              Remember your password?{' '}
              <Text style={{ color: '#4068F6', fontWeight: 'bold' }}>Login here</Text>
            </Text>
          </TouchableOpacity> */}
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start', // corrected 'start' to 'flex-start'
    paddingHorizontal: 0,
    marginTop: hp(10)
  },
  heading: {
    fontSize: wp(6),
    // fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    paddingHorizontal: wp(5),
    // fontFamily: 'Poppins-Bold',
  },
  subText: {
    fontSize: wp(4),
    paddingHorizontal: wp(5),
    color: '#d3d3d3',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  formGradient: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 0.2,
    borderColor: 'gray',
    gap: 10,
    borderRadius: 12,
  },
  backText: {
    marginTop: 20,
    fontSize: 16,
    color: '#d3d3d3',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
