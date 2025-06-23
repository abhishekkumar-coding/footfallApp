import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from '../utils/icons/EmailIcon';
import CloseEyeIcon from '../utils/icons/CloseEyeIcon';
import EyeIcon from '../utils/icons/EyeIcon';
// import OpenEyeIcon from '../utils/icons/openEyeIcon';
// import OpenEyeIcon from '../utils/icons/openEyeIcon';
// import OpenEyeIcon from '../utils/icons/openEyeIcon';

const CustomInput = ({ iconComponent, placeholder, lable, value, onChangeText, secureTextEntry = false, keyboardType = 'default' , isPassword=false}) => {
  
  const [isPassVisible, setIsPassVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPassVisible(!isPassVisible);
  };

  return (
    <View>
      <Text style={styles.lable}>{lable}</Text>
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {iconComponent && <View style={styles.icon}>{iconComponent}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#e0e0e0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword ? isPassVisible : false}
          keyboardType={keyboardType}
        />
        {isPassword && <View onTouchEnd={togglePasswordVisibility}>
          {isPassVisible ? <CloseEyeIcon /> : <EyeIcon />}
          
          </View>}
        </View>
    </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    borderWidth: 1.2,
    borderColor: 'gray',
  },
  inputContainer:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lable:{
    color: '#d3d3d3',
    fontSize: 18,
    // fontWeight: '500',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  icon: {
    marginRight: 12,
    color: '#EAEAEA', // darker, more premium
  },
  input: {
    flex: 1,
    fontSize: 17,
    // fontWeight: '500',
    fontFamily: 'Poppins-Regular',
    color: '#fff', // input text color
    paddingVertical: 0,
  },
});

