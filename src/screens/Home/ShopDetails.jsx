import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import { hp, wp } from '../../utils/dimensions';
import ShopQRCode from './ShopQRCode';
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetShopOffersByIdQuery, useGetShopByScanMutation, useGetTotalPointsByVendorQuery } from '../../features/shops/shopApi';
import { useDispatch } from 'react-redux';
import { triggerWalletRefresh } from "../../features/auth/walletSlice";
import { useNavigation } from '@react-navigation/native';

const ShopDetails = ({ route }) => {
    const navigation = useNavigation();
    const { shop } = route.params;

    const [sortBy, setSortBy] = useState('Latest');
    const dispatch = useDispatch();
    const [isLoadingShop, setIsLoadingShop] = useState(false);
    const [showScanSuccess, setShowScanSuccess] = useState(false);
    const [showScanError, setShowScanError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [vendorId, setVendorId] = useState(null);
    const [redeemTrigger, setRedeemTrigger] = useState(0)

    const { data, isLoading: isLoadingVendor, error } = useGetTotalPointsByVendorQuery(
        { vendorId, redeemTrigger },
        { skip: !vendorId }
    ); 
    const [scanShop] = useGetShopByScanMutation();
    const { data: offersData, isLoading: isLoadingOffers, error: offersError } = useGetShopOffersByIdQuery(shop?._id);

    const { contact, _id, category, name, startTime, endTime, logo, address, city, state, pinCode, owner } = shop || {};

    useEffect(() => {
        if (data) {
            console.log("Fetched vendor points:", data);
            setShowScanSuccess(true);

            setTimeout(() => {
                setShowScanSuccess(false);
                navigation.navigate("RedeemSummaryScreen", { vendorDetails: data.data });
            }, 1000);
        } else if (error) {
            console.log("Error fetching vendor points:", error);
            setErrorMessage(error?.data?.message || 'Something went wrong');
            setShowScanError(true);
            setTimeout(() => {
                setShowScanError(false);
                navigation.goBack();
            }, 1000);
        }
    }, [data, error, navigation]);

    useEffect(() => {
        if (offersData) {
            console.log("Shop offers:", offersData);
        }
    }, [offersData]);

    const handleRedeem = (ownerId) => {
        console.log("Setting vendor ID for redeem:", ownerId);
        setVendorId(ownerId);
        setRedeemTrigger((prev) => prev + 1)
    };

    useEffect(() => {
        if (offersData) {
            console.log("Shop offers:", offersData);
        }
    }, [offersData]);

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
        if (!offersData || !Array.isArray(offersData)) return [];

        const sortedOffers = [...offersData];

        if (sortBy === "Ending Soon") {
            return sortedOffers.sort(
                (a, b) => new Date(a.endTime) - new Date(b.endTime)
            );
        } else {
            // Latest: reverse order by startTime
            return sortedOffers.sort(
                (a, b) => new Date(b.startTime) - new Date(a.startTime)
            );
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
            {(isLoadingShop || isLoadingVendor) && (
                <View style={styles.loaderContainer}>
                    <Text style={styles.loaderText}>
                        {isLoadingShop ? "Scanning..." : "Fetching vendor points..."}
                    </Text>
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
                    <ShopQRCode shopId={_id} email={contact?.email ?? 'no-email'} ownerId={owner} logo={logo} />

                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity style={[styles.scanMe, { marginRight: 20 }]} onPress={handleManualScan}>
                            <Text style={styles.buttonText}>Scan me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.redeem} onPress={() => handleRedeem(owner)}>
                            <Text style={styles.buttonText}>Redeem</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={styles.verticleLine}></View> */}
                    {/* <Text style={styles.qrContainerText}>Scan more, earn more points, and unlock more opportunities</Text> */}
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

                        {getSortedOffers().map((offer) => (
                            <View key={offer._id || offer.shopId} style={styles.offerCard}>
                                <Text style={styles.offerTitle}>{offer.title}</Text>
                                <Text style={styles.offerDetails}>{offer.description}</Text>
                                <Text style={styles.offerDetails}>
                                    🗓️ Valid: {new Date(offer.startTime).toLocaleDateString()} - {new Date(offer.endTime).toLocaleDateString()}
                                </Text>
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
        marginVertical: 5
    },
    // scanMe: {
    //     backgroundColor: 'rgba(255,255,255,0.12)',
    //     paddingVertical: hp(1.8),
    //     paddingHorizontal: 40,
    //     borderRadius: 10,
    //     marginVertical: 10,
    //     // width: '80%',
    //     alignItems: 'center',
    //     color: '#fff',
    //     fontSize: RFValue(14),
    //     fontWeight: '600',
    // },

    // redeem: {
    //     backgroundColor: 'rgba(255,255,255,0.12)',
    //     paddingVertical: hp(1.8),
    //     paddingHorizontal: 40,
    //     borderRadius: 10,
    //     marginVertical: 10,
    //     // width: '80%',
    //     alignItems: 'center',
    //     color: '#fff',
    //     fontSize: RFValue(14),
    //     fontWeight: '600',
    // },

    scanMe: {
        backgroundColor: '#1E88E5',
        paddingVertical: hp(1.4),
        paddingHorizontal: 40,
        borderRadius: 50,
        marginVertical: 10,
        color: '#fff',
        fontSize: RFValue(14),
        fontWeight: '600',
        textAlign: 'center',
    },

    redeem: {
        backgroundColor: '#FF7043',
        paddingVertical: hp(1.4),
        paddingHorizontal: 40,
        borderRadius: 50,
        marginVertical: 10,
        color: '#000',
        fontSize: RFValue(14),
        fontWeight: '600',
        textAlign: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: RFValue(14),
        fontWeight: '600',
        textAlign: 'center',
    },


    qrContainer: {
        height: hp(35),
        marginTop: hp(3),
        justifyContent: "center",
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
        marginTop: hp(2),
        gap: wp(2),
        paddingTop: hp(3),
        paddingBottom: hp(15),
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
