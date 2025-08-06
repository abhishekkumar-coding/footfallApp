import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo';

const AppCheckBox = ({value, onValueChange}) => {
  return (
    <Pressable onPress={() => onValueChange(!value)}>
          <View style={[styles.checkboxContainer, {
              backgroundColor: value ? '#ff2696' : 'transparent',
            }]}>
              {value && <Icon name='check' size={17} color='#fff' />}
        </View>
    </Pressable>
  )
}

export default AppCheckBox

const styles = StyleSheet.create({
    checkboxContainer:{
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ff2696',
    }
})