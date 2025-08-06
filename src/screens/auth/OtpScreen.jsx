import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import PencilIcon from '../../utils/icons/PencilIcon';
import CustomButton from '../../components/CustomButton';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRequestOtpMutation, useVerifyOtpMutation, } from '../../features/auth/authApi';
import Toast from 'react-native-toast-message';
import AppLayout from '../../layout/AppLayout';
import AppButton from '../../components/AppButton';
import { ProfileEditIcon } from '../../utils/icons/icons';
import { Colors } from '../../utils/Colors';
import { Fonts } from '../../utils/typography';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60); // Timer in seconds
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();
  const [requestOtp, { isLoading: isRequestLoading }] = useRequestOtpMutation();
  const isDisabled = useMemo(() => {
    return otp.some(digit => !digit);
  }, [otp, isVerifyLoading, isRequestLoading]);
  // Start & manage timer
  useEffect(() => {
    if (timer === 0) return; 
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const updatedOtp = [...otp];
        updatedOtp[index] = '';
        setOtp(updatedOtp);
      }
    }
  };

  const handleOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter the complete 4-digit OTP' });
      return;
    }
    try {
      const data = { email, otp: fullOtp };
      await verifyOtp(data).unwrap();
      Toast.show({ type: 'success', text1: 'Success', text2: 'OTP verified successfully!' });
      navigation.navigate('NewPassword', { email, otp: fullOtp });
    } catch (error) {
      const message = error?.data?.message || 'Failed to verify OTP';
      Toast.show({ type: 'error', text1: 'Verification Failed', text2: message });
    }
  };

  const handleResend = async () => {
    try {
      console.log("Fetched Gmail: ", email)
       const res = await requestOtp({ email }).unwrap();
       console.log("Fetched Data: ", res)
      setTimer(60);
      Toast.show({ type: 'success', text1: 'OTP Sent', text2: 'A new OTP has been sent to your email.' });
    } catch (error) {
      const message = error?.data?.message || 'Failed to resend OTP';
      Toast.show({ type: 'error', text1: 'Error', text2: message });
    }
  };

  return (
    <AppLayout>
      <BackButton lable={'Verify OTP'} back />
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textContainerText1}>We just sent an SMS</Text>
          <Text style={styles.textContainerText2}>Enter The One Time Password we sent to</Text>
          <View style={styles.textContainerText3}>
            <Text style={styles.userEmail}>{email}</Text>
            <ProfileEditIcon width={18} height={18} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={value => handleChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <AppButton title="Verify" onPress={handleOtp} isLoading={isVerifyLoading} disabled={isDisabled} />
          <Text style={styles.buttonContainerText}>Request code again {timer === 0 ? <Text onPress={handleResend} style={[styles.resend,styles.resendLink]}>Click here</Text> : <Text  style={styles.resend}>00:{timer < 10 ? `0${timer}` : timer} seconds</Text>}</Text>
          
        </View>
      </View>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp(6), paddingTop: hp(6), marginTop: hp(5), gap: wp(7) },
  textContainer: { alignItems: 'flex-start', gap: wp(1) },
  textContainerText1: { color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: RFValue(20) },
  textContainerText2: { color: '#fff', fontFamily: 'Poppins-Regular', fontSize: RFValue(12) },
  textContainerText3: { flexDirection: 'row', gap: wp(4), alignItems: 'center', justifyContent: 'center' },
  userEmail: { color: '#fff', fontFamily: 'Poppins-Regular', fontSize: RFValue(12) },
  inputContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: wp(3), marginTop: hp(1), paddingHorizontal: wp(5) },
  input: { width: wp(14), height: hp(7), borderRadius: 12, borderWidth: 1.2, borderColor: '#FF4D00', backgroundColor: 'transparent', textAlign: 'center', fontSize: RFValue(22), color: '#fff', fontFamily: 'Poppins-SemiBold' },
  buttonContainer: { marginTop: hp(1), alignItems: 'center', gap: 12 },
  buttonContainerText: { color: '#fff', fontFamily: 'Poppins-Regular', fontSize: RFValue(14) },
  resendContainer: { flexDirection: 'row', alignItems: 'center', gap: wp(3) },
  resend: { color: Colors.primary, fontFamily: Fonts.primary_SemiBold, fontSize: RFValue(14) },
  timer: { color: '#fff', fontFamily: 'Poppins-Regular', fontSize: RFValue(14) },
  resendLink: { textDecorationLine: 'underline' },
});
