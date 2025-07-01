// src/screens/Home/ShopDetails.jsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import { hp, wp } from '../../utils/dimensions';
import ShopQRCode from './ShopQRCode';
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetShopByIdQuery, useGetShopByScanMutation, useGetShopOffersByIdQuery} from '../../features/shops/shopApi';

import { useDispatch } from 'react-redux';
import { triggerWalletRefresh } from "../../features/auth/walletSlice"
import { useNavigation } from '@react-navigation/native';

const ShopDetails = ({ route }) => {
    const { shop, image } = route.params;
    console.log(image)
    const [sortBy, setSortBy] = useState('Latest');
    const dispatch = useDispatch();
    const [isLoadingShop, setIsLoadingShop] = useState(false);
    const [showScanSuccess, setShowScanSuccess] = useState(false);
    const [showScanError, setShowScanError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const {fetchShopById} = useGetShopByIdQuery();
     const {
        contact,
        _id,
        category,
        name,
        startTime,
        endTime,
        logo,
        cover,
        address,
        city,
        state,
        country,
        pinCode
    } = shop;

    console.log(_id)

   
    const navigation = useNavigation()
  const [scanShop] = useGetShopByScanMutation();

console.log(scanShop)
    const {data} = useGetShopOffersByIdQuery(_id)
    console.log(data)


    const sampleOffers = [
        {
            id: '1',
            title: 'Flat 20% Off on All Items',
            details: 'Valid till: 2025-06-25',
            expiryDate: '2025-06-25',
            distance: 1.5, // in km
        },
        {
            id: '2',
            title: 'Buy 1 Get 1 Free (Selected Products)',
            details: 'Valid till: 2025-06-30',
            expiryDate: '2025-06-30',
            distance: 0.8,
        },
        {
            id: '3',
            title: 'Free Delivery on Orders Above ₹499',
            details: 'Valid till: 2025-07-05',
            expiryDate: '2025-07-05',
            distance: 2.2,
        },
        {
            id: '4',
            title: '30% Off for First-Time Customers',
            details: 'Valid till: 2025-07-15',
            expiryDate: '2025-07-15',
            distance: 1.0,
        },
    ];

    const getSortedOffers = () => {
        const sortedOffers = [...sampleOffers];

        if (sortBy === "Ending Soon") {
            return sortedOffers.sort((a, b) =>
                new Date(a.expiryDate || 0) - new Date(b.expiryDate || 0)
            );
        } else if (sortBy === "Distance") {
            return sortedOffers.sort((a, b) => a.distance - b.distance);
        } else {
            return [...sortedOffers].reverse(); // safe reverse
        }
    };


    const handleManualScan = async () => {
        try {
            setIsLoadingShop(true);
            const result = await scanShop(_id).unwrap();
            console.log("Fetched shop data directly from unwrap:", result.data.shop);

            setShowScanSuccess(true);
            navigation.goBack()
            dispatch(triggerWalletRefresh());
            setTimeout(() => setShowScanSuccess(false), 1000);
        } catch (fetchError) {
            console.log("Error fetching shop by ID:", fetchError);
            const message = fetchError?.data?.message || 'Something went wrong';
            setErrorMessage(message);
            setShowScanError(true);
            setTimeout(() => setShowScanError(false), 2000);
        } finally {
            setIsLoadingShop(false);
        }
    };



   

    if (!shop) {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#fff' }}>Shop data not available. Please try scanning again.</Text>
            </View>
        );
    }


    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={{ flex: 1 }}
        >
            {isLoadingShop && (
                <View style={styles.loaderContainer}>
                    <Text style={styles.loaderText}>Scanning...</Text>
                </View>
            )}
            {showScanSuccess && (
                <View style={[styles.resultContainer, { backgroundColor: '#28A745' }]}>
                    <Text style={styles.resultTitle}>✅ Shop scanned successfully!</Text>
                </View>
            )}
            {showScanError && (
                <View style={[styles.resultContainer, { backgroundColor: '#B00020' }]}>
                    <Text style={styles.resultTitle}>❌ {errorMessage}</Text>
                </View>
            )}

            <BackButton />
            <ScrollView style={styles.container}>
                <View style={styles.qrContainer}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <ShopQRCode shopId={_id} email={contact?.email ?? 'no-email'} logo={logo} />
                        <Text style={styles.scanMe} onPress={handleManualScan}>
                            Scan me
                        </Text>
                    </View>
                    <View style={styles.verticleLine}></View>
                    <Text style={styles.qrContainerText}>Scan more, earn more points, and unlock more opportunities</Text>
                </View>
                {/* <Image source={{ uri: image }} style={styles.image} /> */}
                <View style={styles.shopDetails}>
                    <Text style={styles.category}>{category}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.title}>{name}</Text>
                        {/* <Text style={styles.rating}>⭐ {shop.rating}</Text> */}
                    </View>
                    <Text style={styles.location}>📍 {address}</Text>
                    <Text style={styles.address}>🏠 {city}, {state}, {pinCode}</Text>
                    <Text style={styles.timings}>🕒 {startTime} - {endTime}</Text>
                    <Text style={styles.contact}>📞 {contact?.phone}</Text>
                    <View style={styles.offerSection}>
                        <Text style={styles.offerHeader}>🎁 Offers & Deals</Text>
                        <Text style={styles.offerSubtext}>View all active offers of a shop</Text>

                        <View style={styles.sortContainer}>
                            {['Latest', 'Ending Soon', 'Distance'].map((option) => (
                                <TouchableOpacity onPress={() => setSortBy(option)}>
                                    <Text style={[styles.sortOption, sortBy === option && styles.activeSortOption]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Placeholder for actual offers list */}
                        {getSortedOffers().map((offer) => (
                            <View key={offer.id} style={styles.offerCard}>
                                <Text style={styles.offerTitle}>{offer.title}</Text>
                                <Text style={styles.offerDetails}>{offer.details}</Text>
                            </View>
                        ))}

                    </View>
                </View>



            </ScrollView>
        </LinearGradient>
    );
};

export default ShopDetails;

const styles = StyleSheet.create({

    loaderContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loaderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        zIndex: 999,
        elevation: 10,
    },
    resultTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    container: {
        // marginTop: 0,
        // flex: 1,
    },
    scanMe: {
        backgroundColor: '#4A00E0',
        color: '#ffffff',
        width: wp(40),
        marginTop: hp(2),
        textAlign: 'center',
        paddingVertical: hp(1.2),
        fontSize: RFValue(16),
        fontWeight: '600',
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    qrContainer: {
        height: hp(35),
        marginTop: hp(3),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp(2),
        marginBottom: hp(4)
    },
    verticleLine: {
        height: hp(22),
        width: 1,
        backgroundColor: "#fff"
    },
    qrContainerText: {
        fontFamily: "Poppins-Regular",
        fontSize: RFValue(10),
        color: "#fff",
        width: wp(47)
    },
    shopDetails: {
        backgroundColor: "#fff",
        flex: 1,
        gap: wp(2),
        paddingVertical: hp(3),
        paddingHorizontal: wp(5),
        position: "relative",
        bottom: hp(7),
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    title: {
        fontSize: wp(7),
        color: '#000',
        // fontWeight: 'bold',
        fontFamily: "Poppins-Bold"
    },
    rating: {
        fontSize: wp(4),
        color: '#000',
        marginVertical: 4,
        fontFamily: "Poppins-SemiBold"
    },
    category: {
        color: '#3B63EF',
        fontSize: wp(4),
        marginBottom: hp(0),
        fontFamily: "Poppins-SemiBold"
    },
    location: {
        color: '#000',
        fontSize: wp(4),
        fontFamily: "Poppins-Regular"
    },
    address: {
        color: '#000',
        fontSize: wp(4),
        fontFamily: "Poppins-Regular"
    },
    timings: {
        color: '#000',
        fontSize: wp(4),
        fontFamily: "Poppins-Regular"
    },
    contact: {
        color: '#3B63EF',
        fontSize: wp(4),
        fontFamily: "Poppins-SemiBold"
    },
    reviewConatiner: {
        marginTop: hp(2)
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    // headerText1: {
    //     color: "#fff",
    //     fontSize: wp(7),
    //     fontFamily: "Poppins-SemiBold"
    // },
    // headerText2: {
    //     color: "#000",
    //     fontSize: 20,
    //     fontFamily: "Poppins-Regular"
    // },
    offerSection: {
        marginTop: hp(3),
    },
    offerHeader: {
        fontSize: wp(6),
        fontFamily: "Poppins-SemiBold",
        color: "#000"
    },
    offerSubtext: {
        fontSize: wp(4),
        color: "#555",
        marginBottom: hp(1),
        fontFamily: "Poppins-Regular"
    },
    sortContainer: {
        flexDirection: "row",
        gap: wp(4),
        marginBottom: hp(1.5)
    },
    sortOption: {
        fontSize: wp(3.5),
        color: "#3B63EF",
        fontFamily: "Poppins-Regular"
    },
    activeSortOption: {
        fontFamily: "Poppins-SemiBold",
        textDecorationLine: "underline"
    },
    offerCard: {
        backgroundColor: "#F2F3F5",
        borderRadius: 10,
        padding: wp(4),
        marginTop: hp(1)
    },
    offerTitle: {
        fontSize: wp(4),
        color: "#000",
        fontFamily: "Poppins-SemiBold"
    },
    offerDetails: {
        fontSize: wp(3.5),
        color: "#555",
        fontFamily: "Poppins-Regular"
    }

});
