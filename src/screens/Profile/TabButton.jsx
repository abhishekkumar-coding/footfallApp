import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import NotificationIcon from '../../utils/icons/NotificationIcon';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/typography';

const TabButton = ({ Icon, label = 'Notification', onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.iconContainer}>
                {Icon && <Icon  />}
            </View>
                <Text style={styles.heading}>{label}</Text>             
        </TouchableOpacity>
    );
};

export default TabButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 18,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        gap: 10,
    },
    heading: {
        fontFamily: Fonts.primary_SemiBold,
        fontSize: RFValue(15, SCREEN_HEIGHT),
        color: '#fff',
        textTransform: 'capitalize',
    },
    iconContainer: {
        width: 25,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
