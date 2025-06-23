import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { hp, wp } from '../utils/dimensions';

const CustomButton = ({ title, onPress, backgroundColor = '#FF4D00', borderWidth = 0 }) => {
  return (
    <Pressable style={[styles.button, { backgroundColor , borderWidth: borderWidth }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: wp(2),
    paddingVertical: hp(1),
    alignItems: 'center',
    marginBottom: hp(2),
    marginTop:10,
    width:'100%',
    alignSelf:"center",
    borderColor: '#FF4D00',
  },
  text: {
    color: '#fff',
    fontSize: wp(4),
    // fontWeight: '400',
    fontFamily:'Poppins-Regular'
  },
});

// #4068F6
