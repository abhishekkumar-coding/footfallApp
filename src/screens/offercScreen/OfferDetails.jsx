import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from "../../components/BackButton";
import { hp, wp } from '../../utils/dimensions';
import ShopQRCode from '../Home/ShopQRCode';
import { RFValue } from 'react-native-responsive-fontsize';

const OfferDetails = ({ route, navigation }) => {
    const { title, description, endDate, qrCodeData } = route.params;

    return (
        <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
            <BackButton label={"Offer Details"} back={true} />

            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.card}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>FootFall</Text>
                    </View>

                    <Text style={styles.scanText}>Scan this code in bar code scanner</Text>
                    <Text style={styles.validityText}>Valid {endDate}</Text>

                    <View style={styles.horizontalLine}></View>
                    <View style={styles.qrContainer}>
                        <ShopQRCode />
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        marginTop: hp(4),
    },
    title: {
        color: "#fff",
        fontSize: RFValue(20),
        fontFamily: "Poppins-SemiBold",
        marginBottom: hp(1),
        textAlign: "left",
    },
    description: {
        color: "#fff",
        fontSize: RFValue(14),
        fontFamily: "Poppins-Regular",
        marginBottom: hp(3),
        textAlign: "left",
    },
    card: {
        width: "90%",
        alignSelf: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        // paddingVertical: hp(3),
        // paddingHorizontal: wp(5),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        overflow: "hidden",
    },
    logoContainer: {
        marginBottom: hp(2),
        backgroundColor: "#000337",
        width: "100%",
        paddingVertical: hp(3),
        paddingHorizontal: wp(5),
    },
    logoText: {
        fontSize: RFValue(22),
        color: "#fff",
        textAlign:"center",
        fontFamily: "Poppins-SemiBold",
    },
    scanText: {
        fontSize: RFValue(14),
        color: "#333",
        fontFamily: "Poppins-Regular",
        textAlign: "center",
        paddingHorizontal: wp(5),
        marginBottom: hp(0.5),
    },
    validityText: {
        fontSize: RFValue(12),
        color: "#555",
        fontFamily: "Poppins-Light",
        textAlign: "center",
        marginBottom: hp(2),
    },
    horizontalLine: {
        width: "100%",
        borderBottomWidth: 1,
        borderStyle: "dashed",
        borderColor: "#ccc",
        marginVertical: hp(3),
    },
    middleLine: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    leftCircle: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    line: {
        height: 1,
        width: "88%",
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "dashed",
        marginHorizontal: wp(1),
    },
    image: {
        resizeMode: "contain",
        width: "100%",
        height: "100%",
    },
    rightCircle: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    qrContainer:{
        paddingBottom:hp(4)
    },
});

export default OfferDetails;
