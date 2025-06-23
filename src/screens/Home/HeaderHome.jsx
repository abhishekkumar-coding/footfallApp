import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NotificationIcon from '../../utils/icons/NotificationIcon'
import { wp } from '../../utils/dimensions'

const HeaderHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logoText}>FootFall</Text>
      <NotificationIcon/>
    </SafeAreaView>
  )
}

export default HeaderHome

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        // paddingHorizontal:20,

    },
    logoText:{
        color:"white",
        fontFamily:"Poppins-SemiBold",
        fontSize:wp(6),

    }

})