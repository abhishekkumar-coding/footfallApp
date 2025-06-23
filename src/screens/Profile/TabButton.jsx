import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import NotificationIcon from '../../utils/icons/NotificationIcon';
import { hp, wp } from '../../utils/dimensions';

const TabButton = ({ Icon, label = 'Notification', onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
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
    },
    heading: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: wp(3.5),
        color: '#fff',
    },
});
