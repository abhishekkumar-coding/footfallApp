import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PencilIcon from '../../utils/icons/PencilIcon'
import ProfileEditIcon from '../../utils/icons/ProfileEditIcon'
import { hp, wp } from '../../utils/dimensions'

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
        marginTop:hp(2)
    },
    profileDetails:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        gap:wp(6)
    },

    profileIcon:{
        backgroundColor:"#FF6F00",
        justifyContent:"center",
        alignItems:"center",
        width:wp(15),
        height:hp(7),
        borderRadius:50,
        overflow:"hidden"
    },
    profileImage:{
        width:wp(15),
        height:hp(7),
        resizeMode:"cover",
        marginTop:hp(1)
    },
    details:{},
    userName:{
        fontFamily:"Poppins-SemiBold",
        fontSize:wp(4),
        color:"#fff"
    },
    userGmail:{
        fontFamily:"Poppins-Regular",
        fontSize:wp(3),
        color:"#d3d3d3"
    }

    
})