import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import PencilIcon from '../../utils/icons/PencilIcon';
import CustomButton from '../../components/CustomButton';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVerifyOtpMutation } from '../../features/auth/authApi';


const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const [verifyOtp] = useVerifyOtpMutation()

  const handleChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  };


  const handleOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      return Alert.alert('Error', 'Please enter the complete 4-digit OTP');
    }

    // console.log(`FormData : ${formData}`)

    try {
      const data = { email, otp: fullOtp };
      console.log(data)
      const res = await verifyOtp(data).unwrap();

      console.log('Verified:', res);
      navigation.navigate('NewPassword', { email, otp: fullOtp });
    } catch (error) {
      const message = error?.data?.message || 'Failed to verify OTP';
      console.log('OTP Verification Error:', error);
      Alert.alert('Verification Failed', message);
    }
  };



  return (
    <LinearGradient colors={['#000337', '#000']} style={{ flex: 1 }}>
      <BackButton />

      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textContainerText1}>We just sent an SMS</Text>
          <Text style={styles.textContainerText2}>Enter The One Time Password we sent to</Text>
          <View style={styles.textContainerText3}>
            <Text style={styles.userEmail}>{email}</Text>
            <PencilIcon />
          </View>
        </View>

        <View style={styles.inputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Verify" onPress={handleOtp} />
          <Text style={styles.buttonContainerText}>Didn't receive code?</Text>
          <TouchableOpacity style={styles.resendContainer}>
            <Text style={styles.resend}>Resend</Text>
            <Text style={styles.timer}>- 00 : 30</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};


export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingTop: hp(6),
    marginTop: hp(5),
    gap: wp(7),
  },
  textContainer: {
    alignItems: "flex-start",
    gap: wp(1),
  },
  textContainerText1: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(20),
  },
  textContainerText2: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(12), // ~ wp(4)
  },
  textContainerText3: {
    flexDirection: 'row',
    gap: wp(4),
    alignItems: 'center',
    justifyContent: "center",
  },
  userEmail: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(12),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
    marginTop: hp(1),
    paddingHorizontal: wp(5),
  },
  input: {
    width: wp(14),
    height: hp(7),
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#FF4D00',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: RFValue(22),
    color: '#fff',
    fontFamily: "Poppins-SemiBold",
  },
  buttonContainer: {
    marginTop: hp(1),
    alignItems: 'center',
    gap: 12,
  },
  buttonContainerText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14),
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  resend: {
    color: '#4068F6',
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(14),
  },
  timer: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14),
  },
});
