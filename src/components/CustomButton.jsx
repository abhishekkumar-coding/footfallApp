import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

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
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 25,
    marginTop:10,
    width:'100%',
    alignSelf:"center",
    borderColor: '#FF4D00',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    // fontWeight: '400',
    fontFamily:'Poppins-Regular'
  },
});

// #4068F6
