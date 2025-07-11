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
            <BackButton lable="Claim Cashback" back />

            <LinearGradient 
            colors={['#7209b7', '#000']}
             style={styles.container}>
                <View style={styles.card}>
                    <LinearGradient
                        colors={['#000337', '#000']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientCard}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: hp(2) }}>
                            <Text style={styles.title}>Purchase Amount</Text>
                            <Text style={styles.rate}>(₹)</Text>
                        </View>
                        <Text style={styles.description}>
                            Enter the amount you spent at this shop to receive cashback
                        </Text>
                    </LinearGradient>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter amount"
                        placeholderTextColor="#000"
                        keyboardType="numeric"
                        value={purchaseAmount}
                        onChangeText={setPurchaseAmount}
                    />

                    <Text style={styles.returnPercent}>
                        Cashback Rate: <Text style={{ color: '#2b9348', fontFamily: "Poppins-Bold" }}>{returnPercent}%</Text>
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, isLoading && { opacity: 0.6 }]}
                        onPress={handleCalculate}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Calculating...' : 'Claim Cashback'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {message && (
                <View
                    style={[
                        styles.popupContainer,
                        {
                            backgroundColor:
                                messageType === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)',
                        },
                    ]}
                >
                    <Text style={styles.popupText}>{message}</Text>
                </View>
            )}
        </LinearGradient>
    );
};

export default CashbackScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        // backgroundColor: "#480ca8",
        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginTop: hp(15),
        borderRadius: (20)
    },
    card: {
        position: "absolute",
        top: -100,
        left: 0,
        right: 0,
        paddingHorizontal: wp(5)
    },
    gradientCard: {
        width: '100%',
        height: hp(20),
        borderRadius: 16,
        padding: wp(8),
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },


    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10, // If RN version <0.71, use marginLeft on second item
    },

    title: {
        fontSize: RFValue(20),
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
    },

    rate: {
        color: "#fff",
        backgroundColor: "#007200",
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(4),
        fontFamily: "Poppins-Bold",
        fontSize: RFValue(16),
        borderRadius: 30,
        overflow: 'hidden',
    },

    description: {
        color: '#fff',
        fontSize: RFValue(13),
        fontFamily: 'Poppins-Regular',
        // marginTop: hp(1),
        opacity: 0.85,
    },

    input: {
        backgroundColor: 'rgba(255,255,255,1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: hp(1.5),
        fontSize: RFValue(16),
        color: '#000',
        fontFamily: 'Poppins-Regular',
        marginVertical: hp(2.5),
        borderWidth:5,
        borderColor: '#7b2cbf',
    },
    returnPercent: {
        fontSize: RFValue(15),
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: hp(1),
    },
    button: {
        backgroundColor: '#000337',
        paddingVertical: hp(1.5),
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: RFValue(16),
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
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