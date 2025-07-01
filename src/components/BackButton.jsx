import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import LeftArrowIcon from '../utils/icons/LeftArrowIcon';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';

const BackButton = ({ lable }) => {
  const navigation = useNavigation();

  return (
    <>
      {/* Arrow fixed at top-left */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrow}>
        <LeftArrowIcon />
      </TouchableOpacity>

      {/* Label centered below the camera */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{lable}</Text>
      </View>
    </>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    top: hp(5),
    left: wp(4),
    zIndex: 10,
  },
  labelContainer: {
    position: 'absolute',
    top: hp(4), // adjust based on your camera's height
    left: 0,
    right: 0,
    // alignItems: 'center',
    zIndex: 9,
    
  },
  label: {
    fontSize: RFValue(20),
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
});
