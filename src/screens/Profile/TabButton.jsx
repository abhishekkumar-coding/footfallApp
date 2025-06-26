import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import NotificationIcon from '../../utils/icons/NotificationIcon';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';

const TabButton = ({ Icon, label = 'Notification', onPress }) => {
    return (
        <TouchableOpacity style={{ width:"100%"}} onPress={onPress}>
            <View style={styles.container}>
                {Icon && <Icon />}
                <Text style={styles.heading}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default TabButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255, 0.13)',
        padding: wp(4),
        marginTop: hp(2),
        borderRadius: 20,
        gap: wp(5),
        width:"100%"
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: RFValue(12),
        color: '#fff',
    },
});
