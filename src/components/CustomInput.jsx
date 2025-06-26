import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import EmailIcon from '../utils/icons/EmailIcon';
import CloseEyeIcon from '../utils/icons/CloseEyeIcon';
import EyeIcon from '../utils/icons/EyeIcon';
import { hp, wp } from '../utils/dimensions';

const CustomInput = ({
  iconComponent,
  placeholder,
  lable,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  isPassword = false,
}) => {
  const [isPassVisible, setIsPassVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPassVisible(!isPassVisible);
  };

  return (
    <View>
      <Text style={styles.label}>{lable} <Text style={{color:"red", paddingHorizontal:20, fontSize:RFValue(10)}}>*</Text></Text>
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
          {isPassword && (
            <View onTouchEnd={togglePasswordVisibility}>
              {isPassVisible ? <CloseEyeIcon /> : <EyeIcon />}
            </View>
          )}
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
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    marginBottom: hp(1),
    borderWidth: 1.2,
    borderColor: 'gray',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: '#d3d3d3',
    fontSize: RFValue(11), // approx wp(3.5)
    fontFamily: 'Poppins-SemiBold',
    marginBottom: hp(0),
  },
  icon: {
    marginRight: wp(3),
    color: '#EAEAEA',
  },
  input: {
    flex: 1,
    fontSize: RFValue(10), // approx wp(3.4)
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    paddingVertical: 0,
  },
});
