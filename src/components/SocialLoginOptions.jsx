import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';

const SocialLoginOptions = ({ onGooglePress, onApplePress }) => {
  return (
    <>
      <View style={styles.orContainer}>
        <Text style={styles.line}></Text>
        <Text style={styles.orText}>or</Text>
        <Text style={styles.line}></Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
          <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SocialLoginOptions;

const styles = StyleSheet.create({
  orContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: '40%',
    height: 0.5,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  orText: {
    color: '#fff',
    fontSize: RFValue(13), // approx wp(5)
    fontFamily: 'Poppins-Regular',
    marginHorizontal: wp(2),
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    marginBottom: hp(2),
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    borderRadius: 15,
    paddingVertical: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    gap: wp(4),
    width: "100%",
  },
  googleIcon: {
    width: wp(7),
    height: hp(3.5),
  },
  socialText: {
    fontSize: RFValue(12.5), 
    fontFamily: 'Poppins-Regular',
    color: '#FFF',
    textAlign: 'center',
  },
});
