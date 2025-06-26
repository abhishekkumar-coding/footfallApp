import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import BackButton from '../components/BackButton'
import ProfileHeader from './Profile/ProfileHeader'
import Rewards from './Profile/Rewards'
import NotificationIcon from '../utils/icons/NotificationIcon'
import TabButton from './Profile/TabButton'
import PencilIcon from '../utils/icons/PencilIcon'
import WalletIcon from '../utils/icons/WalletIcon'
import ScannerIcon from '../utils/icons/ScannerIcon'
import ProfileEditIcon from '../utils/icons/ProfileEditIcon'
import LogOutIcon from '../utils/icons/LogOutIcon'
import { hp, wp } from '../utils/dimensions'
import { RFValue } from 'react-native-responsive-fontsize'
import LeftArrowIcon from '../utils/icons/LeftArrowIcon'

const ProfileScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState("")
    console.log(`profileScreen = ${JSON.stringify(navigation.getState())}`)
    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={styles.container}
        >
            <View style={styles.topBar}>
                <View style={styles.backContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowIcon />
                    </TouchableOpacity>
                </View>
                <Text style={styles.heading}>More</Text>
                <View style={styles.logOut}><LogOutIcon />
                </View>
            </View>
            <ProfileHeader navigation={navigation} />
            <Rewards />
            <TabButton
                Icon={ProfileEditIcon}
                label="Update Profile"
                onPress={() => navigation.navigate("EditProfile")}
            />
            <TabButton
                Icon={NotificationIcon}
                label="Notifications"
                onPress={() => setActiveTab('Notifications')}
            />

            <TabButton
                Icon={WalletIcon}
                label="Wallet"
                onPress={() => setActiveTab('Notifications')}
            />
            <TabButton
                Icon={ScannerIcon}
                label="Scan & Earn"
                onPress={() => setActiveTab('Notifications')}
            />
            {/* <TouchableOpacity >
                <View style={styles.container2}>
                    <Text style={styles.heading2}>Log out</Text>
                    <LogOutIcon />
                </View>
            </TouchableOpacity> */}
        </LinearGradient>

    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(6),
        alignItems: "flex-start",
        justifyContent: "",
        paddingHorizontal: wp(4),
        position: "relative",
        width: "100%"
    },
    topBar: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between"
    },
    heading: {
        fontFamily: "Poppins-Bold",
        fontSize: RFValue(20),
        color: "#fff",
        textAlign: "center",
    },
    logOut: {
        // position: "absolute",
        // right: wp(5),
        // top: hp(5)
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: 'rgba(255,255,255, 0.13)',
        padding: wp(4),
        marginTop: hp(3),
        borderRadius: 20,
        gap: wp(4),
        borderWidth: 0.5,
        borderColor: "#FF0400"
    },
    heading2: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: wp(3.5),
        color: '#FF0400',
    },

})