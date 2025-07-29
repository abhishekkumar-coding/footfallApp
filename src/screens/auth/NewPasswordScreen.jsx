import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../../components/CustomInput';
import LockIcon from '../../utils/icons/LockIcon';
import BackButton from '../../components/BackButton';
import CustomButton from '../../components/CustomButton';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useResetPasswordMutation } from '../../features/auth/authApi';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const NewPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const route = useRoute();
  const { email, otp } = route.params;

  const [resetPassword] = useResetPasswordMutation();

  const newPasswordSubmit = async () => {
    if (!newPassword) {
      return Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a new password',
      });
    }

    const data = { email, otp, newPassword };

    try {
      const res = await resetPassword(data).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your password has been reset successfully',
        onHide: () => navigation.navigate('Login'), // Navigate after toast hides
      });
    } catch (error) {
      const message = error?.data?.message || 'Password reset failed';
      console.log('Reset Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  };

  return (
    <LinearGradient colors={['#000337', '#000']} style={{ flex: 1 }}>
      <BackButton lable={'Set New Password'} back />

      <View style={styles.container}>
        <Text style={styles.title}>Set your new password</Text>
        <View style={styles.inputContainer}>
          {/* <CustomInput placeholder="Enter your new password" lable={'New Password'} secureTextEntry={true} isPassword={true} iconComponent={<LockIcon />} /> */}
          <CustomInput
            placeholder="Confirm your password"
            lable={'Confirm Password'}
            secureTextEntry={true}
            isPassword={true}
            iconComponent={<LockIcon />}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>
        <CustomButton title={'Continue'} onPress={newPasswordSubmit} />
      </View>
    </LinearGradient>
  );
};

export default NewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingTop: hp(6),
    marginTop: hp(5),
    gap: 0,
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    gap: hp(1),
    marginVertical: hp(2),
  },
});
