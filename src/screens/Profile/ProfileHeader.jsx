import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PencilIcon from '../../utils/icons/PencilIcon'
import ProfileEditIcon from '../../utils/icons/ProfileEditIcon'

const ProfileHeader = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.profileDetails}>
                <View style={styles.profileIcon}>
                    <Image style={styles.profileImage} source={require("../../../assets/profile_image.png")}/>
                </View>
                <View style={styles.details}>
                    <Text style={styles.userName}>Abhishek Kumar</Text>
                    <Text style={styles.userGmail}>abhiwebdev2.0@gmail.com</Text>
                </View>
            </View>
            <ProfileEditIcon onPress={() => navigation.navigate('EditProfile')}/>
        </View>
    )
}

export default ProfileHeader

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginTop:40
    },
    profileDetails:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        gap:20
    },

    profileIcon:{
        backgroundColor:"#FF6F00",
        justifyContent:"center",
        alignItems:"center",
        width:60,
        height:60,
        borderRadius:50,
        overflow:"hidden"
    },
    profileImage:{
        width:50,
        height:50,
        resizeMode:"cover",
        marginTop:10
    },
    details:{},
    userName:{
        fontFamily:"Poppins-SemiBold",
        fontSize:20,
        color:"#fff"
    },
    userGmail:{
        fontFamily:"Poppins-Regular",
        fontSize:16,
        color:"#d3d3d3"
    }

    
})