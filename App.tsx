import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native"
import AppNavigator from './src/AppNavigator'
// import MainTabNavigator from './src/navigations/MainTabNavigator'

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})