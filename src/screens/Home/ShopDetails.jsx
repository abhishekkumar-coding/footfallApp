// src/screens/Home/ShopDetails.jsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import { hp, wp } from '../../utils/dimensions';
import ShopQRCode from './ShopQRCode';
import { email } from 'zod/v4';

const ShopDetails = ({ route }) => {
    const { shop, image } = route.params;
    console.log(image)
    const [sortBy, setSortBy] = useState('Latest');

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

     const {
            contact,
            shop_id,
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

        console.log(logo)


    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={{ flex: 1 }}
        >
            <BackButton />
            <ScrollView style={styles.container}>
                    <View style={styles.qrContainer}>
                        {/* <ShopQRCode  shopId={shop_id} email={email} logo={logo}/> */}
                        <ShopQRCode shopId={shop_id} email={contact.email} logo={logo}/>
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
                    <Text style={styles.contact}>📞 {contact.phone}</Text>
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
    container: {
        // marginTop: 0,
        // flex: 1,
    },
    qrContainer: {
        height: hp(35),
        marginTop:hp(3)
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
