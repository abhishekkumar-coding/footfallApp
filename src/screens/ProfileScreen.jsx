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

const ProfileScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState("")
    console.log(`profileScreen = ${JSON.stringify(navigation.getState())}`)
    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={styles.container}
        >
            <BackButton />
            <Text style={styles.heading}>More</Text>
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
            <TouchableOpacity >
                <View style={styles.container2}>
                    <Text style={styles.heading2}>Log out</Text>
                    <LogOutIcon />
                </View>
            </TouchableOpacity>
        </LinearGradient>

    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(1.7),
        paddingHorizontal: wp(4),
    },
    heading: {
        fontFamily: "Poppins-Bold",
        fontSize: wp(6),
        color: "#fff",
        textAlign: "center",
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