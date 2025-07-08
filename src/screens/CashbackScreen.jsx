import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton'
import { hp, wp } from '../utils/dimensions';
import { useScanWithPurchaseAmountMutation } from '../features/shops/shopApi';

const CashbackScreen = ({ navigation, route }) => {
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');

    const [scanWithPurchaseAmount, { isLoading }] = useScanWithPurchaseAmountMutation()

    const { shopId, returnPercent } = route.params;

    console.log("Shop Id in the cashbackScreen : ", returnPercent)


    const handleCalculate = async () => {

        if (!purchaseAmount || isNaN(Number(purchaseAmount)) || Number(purchaseAmount) <= 0) {
            setMessageType('error');
            setMessage('Please enter a valid purchase amount.');
            setTimeout(() => setMessage(null), 1000);
            return;
        }
        try {
            const response = await scanWithPurchaseAmount({ id: shopId, purchaseAmount: Number(purchaseAmount) }).unwrap();
            console.log('Claim cashback Response: ', response);
            setMessageType('success');
            setMessage('Points awarded successfully!');
            setTimeout(() => {
                setMessage(null)
                navigation.navigate("HomeMain")
            }, 1000);


        } catch (error) {
            console.error('Error:', error);
            setMessageType('error');
            setMessage(
                error?.data?.message || 'Failed to award points. Please try again.',
            );
            setTimeout(() => setMessage(null), 1000);

        }
    };

    return (
        <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
            <BackButton lable={"Claim Cashback"} back={true} />

            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Enter Purchase Amount</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={purchaseAmount}
                        onChangeText={setPurchaseAmount}
                    />

                    <Text style={styles.returnPercent}>
                        Cashback Return: {returnPercent}%
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, isLoading && { opacity: 0.6 }]}
                        onPress={handleCalculate}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? "Calculating..." : "Claim Cashback"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {message && (
                <View
                    style={[
                        styles.popupContainer,
                        {
                            backgroundColor:
                                messageType === 'success' ? '#28a745' : '#dc3545',
                        },
                    ]}
                >
                    <Text style={styles.popupText}>{message}</Text>
                </View>
            )}
        </LinearGradient>
    )
};
export default CashbackScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        // backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        // alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        color: '#FFF',
        fontSize: RFValue(25),
        fontFamily: 'Poppins-Regular',
        marginBottom: 30,
        textAlign: 'left',
    },
    input: {
        width: '100%',
        height: 55,
        borderColor: '#FF6B00',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: RFValue(16),
        fontFamily: 'Poppins-Regular',
        color: '#fff',
        marginBottom: 25,
    },
    returnPercent: {
        fontFamily: "Poppins-Regular",
        fontSize: RFValue(15),
        color: "#fff",
        textAlign: "left",
        paddingBottom:hp(2)
    },
    button: {
        backgroundColor: '#FF6B00',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: RFValue(16),
        fontFamily: "Poppins-SemiBold",
        textAlign: "center",
    },
    popupContainer: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 20,
        zIndex: 1000,
    },
    popupText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: RFValue(14),
        textAlign: 'center',
    },
});
