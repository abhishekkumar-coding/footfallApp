import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { hp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
// import ScannerIcon from '../../utils/icons/ScannerIcon';

const QuickActions = () => {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonContainer} onPress={()=>navigation.navigate('ScanOptions')}>
                <View style={[styles.iconContainerBase, styles.iconContainer1]}>
                    <Image source={require('../../../assets/scanner.png')} style={styles.icon} />
                </View>
                <Text style={styles.iconText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}>
                <View style={[styles.iconContainerBase, styles.iconContainer2]}>
                    <Image source={require('../../../assets/offer.png')} style={styles.icon} />
                </View>
                <Text style={styles.iconText}>Offers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={()=>navigation.navigate('EditProfile')}>
                <View style={[styles.iconContainerBase, styles.iconContainer3]}>
                    <Image source={require('../../../assets/account.png')} style={styles.icon} />
                </View>
                <Text style={styles.iconText}>Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default QuickActions;
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        marginTop: hp(2)
    },
    buttonContainer: {
        alignItems: 'center',
    },
    iconContainerBase: {
        width: 60,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer1: {
        backgroundColor: '#fff8f0',
        shadowColor: '#95d5b2',
    },
    iconContainer2: {
        backgroundColor: '#7b2cbf',
        shadowColor: '#c77dff',
    },
    iconContainer3: {
        backgroundColor: '#ffff3f',
        shadowColor: '#ffd60a',
    },
    icon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    iconText: {
        marginTop: 6,
        fontSize: RFValue(10),
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
    },
});
