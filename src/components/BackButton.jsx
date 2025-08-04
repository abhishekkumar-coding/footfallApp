import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '../utils/Colors'

const BackButton = () => {
    const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
       <MaterialIcons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    backButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        width: 40,
        height: 40,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginLeft: 10,
        marginTop: 10
    }
})