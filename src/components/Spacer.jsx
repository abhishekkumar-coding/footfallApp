import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Spacer = ({height = 10}) => {
  return (
    <View style={{height: height}}/>
  )
}

export default Spacer

const styles = StyleSheet.create({})