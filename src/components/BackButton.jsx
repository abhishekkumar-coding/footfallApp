import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import LeftArrowIcon from '../utils/icons/LeftArrowIcon';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import LogOutIcon from '../utils/icons/LogOutIcon';

const BackButton = ({ lable, logout = false }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Arrow fixed at left */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrow}>
                <LeftArrowIcon />
            </TouchableOpacity>

            {/* Centered label + logout */}
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{lable}</Text>
                {logout && <LogOutIcon style={styles.logout} />}
            </View>
        </View>
    )
}

export default BackButton;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: hp(5),
        left: 0,
        right: 0,
        alignItems: 'flex-end',
        justifyContent:"center",
        zIndex: 10,
    },
    arrow: {
        position: 'absolute',
        left: wp(4),
        top: 0,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:"space-between",
        // borderWidth:1,
        // borderColor:"#fff",
        width:"50%",
        marginRight:wp(10)
        // marginTop: hp(5), 
    },
    label: {
        fontSize: RFValue(20),
        color: '#fff',
        fontFamily: "Poppins-Bold",
        textAlign: 'center',
    },
    logout: {
        marginLeft: wp(2),
    },
});
