import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../utils/typography';

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
          <Text style={styles.socialText}>Continue with Google</Text>
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
    marginVertical: 12,
  },
  line: {
    width: '40%',
    height: 0.5,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    opacity: 0.5,
  },
  orText: {
    color: '#fff',
    opacity: 0.5,
    fontSize: RFValue(15, SCREEN_HEIGHT), // approx wp(5)
    fontFamily: 'Poppins-Regular',
    marginHorizontal: wp(2),
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',    
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 100,
    gap: wp(4),
    width: "100%",
    height: 45,
  },
  googleIcon: {
    width: wp(7),
    height: hp(3.5),
    position: 'absolute',
    left: 10,
  },
  socialText: {
    fontSize: RFValue(14, SCREEN_HEIGHT), 
    fontFamily: Fonts.primary_Medium,
      color: '#000',
    textAlign: 'center',
  },
});
