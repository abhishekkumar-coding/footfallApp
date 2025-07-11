import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from "../../components/BackButton";
import { hp, wp } from '../../utils/dimensions';
import ShopQRCode from '../Home/ShopQRCode';
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetVendorByIdQuery, useScanOfferMutation } from '../../features/shops/shopApi';
import Toast from 'react-native-toast-message';


const OfferDetails = ({ route }) => {

    const { title, description, endDate, bannerImage, shopName, vendorId, offerId } = route.params;

    const { data: vendordata, isLoading, error } = useGetVendorByIdQuery({ id: vendorId });

    const [triggerScanOffer, { data: offerData, isLoading:isOfferResult }] = useScanOfferMutation();


 const handleClick = async (value) => {
  try {
    const result = await triggerScanOffer({ id: value }).unwrap();
    console.log("Offer data after scanning:", result);

    Toast.show({
      type: 'success',
      text1: 'Offer Scanned',
      text2: result.message,
    });
  } catch (err) {
    console.error("Error scanning offer:", err);

    Toast.show({
      type: 'error',
      text1: 'Scan Failed',
      text2: err.data.message,
    });
  }
};



    const vendorName = vendordata?.data?.name || "";

    if (isLoading) {
        return (
            <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 99 }}>
                <ActivityIndicator size="large" color="#ff5f6d" />
            </LinearGradient>
        )
    }


    return (
        <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1, paddingBottom: hp(5) }}>
            <BackButton lable={"Offer Details"} back={true} />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                {/* <Text style={styles.slogan}>CLAIM AND EARN</Text> */}

                <Image
                    source={{ uri: bannerImage }}
                    style={styles.banner}
                />



                <View style={styles.card}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Shop Name:</Text>
                            <Text style={styles.value}>{shopName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Owner Name:</Text>
                            <Text style={styles.value}>{vendorName}</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderColor: '#999',
                            borderStyle: 'dashed',
                            width: '100%',
                            marginVertical: 0,
                        }}
                    />

                    <View style={styles.qrWrapper}>
                        <Text style={styles.scanText}>Scan this code in the scanner to get rewards</Text>
                        <Text style={styles.validityText}>Valid till {endDate}</Text>
                        {/* <View style={styles.qrContainer}>
                            <ShopQRCode vendorId={vendorId} />
                        </View> */}
                        <TouchableOpacity disabled={isOfferResult} onPress={() => handleClick(offerId)}>
                            <Text style={styles.scanButton}  >{isOfferResult ? "Scanning..." : "Scan Now"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>

        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(5),
        marginTop: hp(0),
        // paddingBottom:hp(20)
    },
    banner: {
        width: '100%',
        height: hp(22),
        borderRadius: 12,
        marginBottom: hp(2),
        resizeMode: 'cover',
    },
    title: {
        color: "#fff",
        fontSize: RFValue(22),
        fontFamily: "Poppins-SemiBold",
        textAlign: "center",
        // marginBottom: hp(2),
    },
    description: {
        fontFamily: "Poppins-Regular",
        color: "#fff",
        fontSize: RFValue(13),
        textAlign: "center",
        marginBottom: hp(1)
    },
    slogan: {
        color: "#fff",
        fontSize: RFValue(12),
        fontFamily: "Poppins-Regular",
        textAlign: "center",
        marginBottom: hp(2),
    },
    infoCard: {
        // backgroundColor: "#1c1c1e",
        // borderRadius: 12,
        padding: hp(2),
        marginBottom: hp(0.5),
        // shadowColor: '#000',
        // shadowOpacity: 0.2,
        // shadowRadius: 5,
        // elevation: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(1),
    },
    label: {
        fontSize: RFValue(12),
        color: '#EBEAED',
        fontFamily: "Poppins-Regular",
    },
    value: {
        fontSize: RFValue(12),
        color: '#fff',
        fontFamily: "Poppins-SemiBold",
    },
    card: {
        backgroundColor: "#7926E4",
        borderWidth: 4,
        borderColor: "#9335E5",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
        marginBottom: hp(5),
    },
    qrWrapper: {
        paddingHorizontal: wp(5),
        paddingVertical: hp(3),
        alignItems: 'center',
    },
    scanText: {
        width: "100%",
        // borderWidth:1,
        // borderColor:"#fff",
        fontSize: RFValue(12),
        color: "#EBEAED",
        fontFamily: "Poppins-SemiBold",
        textAlign: "center",
        marginBottom: hp(0.5),
    },
    validityText: {
        fontSize: RFValue(12),
        color: "#fff",
        fontFamily: "Poppins-Light",
        marginBottom: hp(1),
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        color: "#FFF",
        backgroundColor: '#000337',
        paddingHorizontal: wp(5),
        paddingVertical: hp(1),
        borderRadius: 30,
        fontSize: RFValue(15),
        marginTop: hp(2),
        fontFamily: "Poppins-Regular",

    }
});

export default OfferDetails;

