import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react' // ✅ FIX 1: useState imported properly
import LinearGradient from 'react-native-linear-gradient'
import BackButton from '../../components/BackButton'
import PencilIcon from '../../utils/icons/PencilIcon'
import CustomButton from '../../components/CustomButton'
import { hp, wp } from '../../utils/dimensions'

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('')

  const verifyOtp = () => {
    // verify otp
    navigation.navigate('NewPassword')
  }

  return (
    <LinearGradient colors={['#000337', '#000']} style={{ flex: 1 }}>
      <BackButton />

      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textContainerText1}>We just sent an SMS</Text>
          <Text style={styles.textContainerText2}>Enter The One Time Password we sent to </Text>
          <View style={styles.textContainerText3}>
            <Text style={styles.userEmail}>s******5@gmail.com</Text>
            <PencilIcon />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} keyboardType="numeric" maxLength={1} />
          <TextInput style={styles.input} keyboardType="numeric" maxLength={1} />
          <TextInput style={styles.input} keyboardType="numeric" maxLength={1} />
          <TextInput style={styles.input} keyboardType="numeric" maxLength={1} />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title={"Verify"} onPress={verifyOtp} />
          <Text style={styles.buttonContainerText}>Didn't receive code?</Text>

          {/* ✅ FIX 2: Used separate container style for TouchableOpacity */}
          <TouchableOpacity style={styles.resendContainer}>
            <Text style={styles.resend}>Resend</Text>
            <Text style={styles.timer}>- 00 : 30</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

export default OtpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingTop: hp(2),
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
    fontSize: wp(6),
  },
  textContainerText2: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: wp(4),
  },
  textContainerText3: {
    flexDirection: 'row',
    gap: wp(4),
    alignItems: 'center',
    justifyContent:"center"
  },
  userEmail: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: wp(4),
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
    fontSize: 22,
    color: '#fff',
    fontFamily: "Poppins-SemiBold",
  },
  buttonContainer: {
    marginTop: hp(1),
    alignItems: 'center',
    gap: 12, // ✅ minor update: added spacing
  },
  buttonContainerText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: wp(4),
  },
  // ✅ FIX 2: new container style for resend row
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  resend: {
    color: '#4068F6',
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp(4),
  },
  timer: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: wp(4),
  },
});
