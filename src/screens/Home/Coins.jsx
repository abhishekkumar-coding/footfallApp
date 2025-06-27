import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { hp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';

const Coins = () => (
    <View style={styles.container}>
        <ImageBackground
            source={require('../../../assets/icons_bg.png')}
            style={styles.background}
            resizeMode="stretch"
        >
            <View style={styles.details}>
                <Text style={styles.coinsText}>Coins</Text>
                <Text style={styles.coinsCount}>520</Text>
            </View>
        </ImageBackground>
    </View>
);

export default Coins;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: hp(12),
        overflow: 'hidden',
    },
    background: {
        flex: 1,
        width: '100%',
    },
    details: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical:hp(1),
        justifyContent: 'space-between',
    },
    coinsText: {
        fontSize: RFValue(20),
        fontFamily: 'Poppins-Bold',
        color: '#fff',
    },
    coinsCount: {
        fontSize: RFValue(20),
        fontFamily: 'Poppins-SemiBold',
        color: '#390099',
    },
});
