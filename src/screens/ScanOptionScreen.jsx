import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';

const ScanOptionScreen = ({ navigation }) => {
    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Choose an option</Text>

                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate('RewardScanner')}
                >
                    <Text style={styles.optionText}>Scan QR for Reward</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate('RedeemScanner')}
                >
                    <Text style={styles.optionText}>Redeem</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default ScanOptionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: 'orange',
        fontSize: RFValue(20),
        marginBottom: 40,
        fontFamily:"Poppins-Bold"
    },
    optionButton: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingVertical: hp(2.5),
        paddingHorizontal: 40,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: RFValue(14),
        fontWeight: '600',
    },
});
