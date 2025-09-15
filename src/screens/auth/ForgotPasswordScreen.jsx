import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import LinearGradient from 'react-native-linear-gradient';
import EmailIcon from '../../utils/icons/EmailIcon';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useRequestOtpMutation } from '../../features/auth/authApi';
import Toast from 'react-native-toast-message';
import AppLayout from '../../layout/AppLayout';
import BackButton from '../../components/BackButton';
import AppButton from '../../components/AppButton';
import Spacer from '../../components/Spacer';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const [requestOtp, { isLoading }] = useRequestOtpMutation()
  const isDisabled = useMemo(() => {
    return !email
  }, [email]);
  const handleSendOtp = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email',
      });
      return;
    }

    try {
      const res = await requestOtp({ email }).unwrap();
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Check your email for the OTP',
        onHide: () => navigation.navigate('OtpVerification', { email }),
      });
      console.log(res);
    } catch (error) {
      const message = error?.data?.message || 'Failed to send OTP';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  };

  return (
    <AppLayout>
      <BackButton />
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <View style={styles.container}>
          <Text style={styles.heading}>Forgot Password 🔑</Text>
          <Text style={styles.subText}>
            Enter your email to receive an OTP
          </Text>

          <View style={{ width: "100%" }}>
            <CustomInput
              placeholder={'Email'}
              lable={'Email'}
              iconComponent={<EmailIcon />}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <Spacer />
          <AppButton title={'Send OTP'} onPress={handleSendOtp} isLoading={isLoading} disabled={isDisabled} />


        </View>
      </KeyboardAvoidingView>
    </AppLayout>

  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: hp(10),
  },
  heading: {
    fontSize: RFValue(20),
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  subText: {
    fontSize: RFValue(12),
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
    fontSize: RFValue(13),
    color: '#d3d3d3',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});
