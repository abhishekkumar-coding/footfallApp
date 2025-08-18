import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import CloseEyeIcon from '../utils/icons/CloseEyeIcon';
import EyeIcon from '../utils/icons/EyeIcon';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import { Fonts } from '../utils/typography';

const CustomInput = ({
  iconComponent,
  placeholder,
  lable,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  isPassword = false,
  required = true,
  showError = false,  // default value false for safety
  editable = true,    // <-- added this to control read-only
}) => {
  const [isPassVisible, setIsPassVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPassVisible(!isPassVisible);
  };

  const shouldShowError = required && showError && !value?.trim();

  return (
    <View style={{ marginBottom: hp(1.5) }}>
      {/* Label */}
      <Text style={styles.label}>
        {lable} {required && <Text style={styles.requiredAsterisk}>*</Text>}
      </Text>

      {/* Input Field */}
      <View style={styles.container}>
        {iconComponent && <View style={styles.icon}>{iconComponent}</View>}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#cbcbcb"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword ? isPassVisible : secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          selectTextOnFocus={false}
          caretHidden={!editable} // hide blinking cursor if not editable
          cursorColor={'#fff'}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} activeOpacity={0.7}>
            {isPassVisible ? <CloseEyeIcon /> : <EyeIcon />}
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {shouldShowError && (
        <Text style={styles.errorText}>‼️ Please enter a valid {lable}</Text>
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    paddingHorizontal: wp(3),
    height: hp(6),
    borderWidth: 1.2,
    borderColor: 'gray',
  },
  label: {
    color: '#fff',
    fontSize: RFValue(14, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    marginBottom: hp(0.5),
  },
  requiredAsterisk: {
    color: 'red',
    fontSize: RFValue(10, SCREEN_HEIGHT),
  },
  icon: {
    marginRight: wp(3),
  },
  input: {
    flex: 1,
    fontSize: RFValue(12, SCREEN_HEIGHT),
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlignVertical: 'center',
    paddingVertical: 0, // fixes vertical misalignment
  },
  errorText: {
    color: 'red',
    fontFamily: 'Poppins-Regular',
    marginTop: hp(0.3),
    fontSize: RFValue(10, SCREEN_HEIGHT),
  },
});
