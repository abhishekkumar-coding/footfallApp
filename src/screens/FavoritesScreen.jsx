import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'

const FavoritesScreen = () => {
  return (
   
   <LinearGradient
         colors={['#000337', '#000000']}
         style={{ flex: 1 }}
       >
         <Text>FavoritesScreen</Text>
       </LinearGradient>
  )
}

export default FavoritesScreen

const styles = StyleSheet.create({})