import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';

const AllShops = ({ route }) => {
    const { shopsData } = route.params;

    const navigation = useNavigation()


    const renderItem = ({ item }) => (
        // console.log(item)
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ShopDetails', { shop: item })}>
            <Image
                style={styles.cardImage}
                source={{ uri: item.image }}
            />
            <View style={{ padding: 10, alignItems: "flex-start", flex: 1, justifyContent: "space-between" }}>
                <Text style={styles.category}>{item.category}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.details}>⭐ {item.rating}</Text>
                </View>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.timings}>{item.timings}</Text>
                {/* <TouchableOpacity style={styles.contactButton} ><View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}><PhoneIcon/> <Text style={styles.contact}> {item.contact}</Text></View></TouchableOpacity> */}
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#000337', '#000000']}
            style={styles.container}
        >
            <FlatList
                data={shopsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                // ListHeaderComponent={<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={styles.heading}>Nearby Shops</Text><TouchableOpacity onPress={handleViewAll}><Text style={[styles.heading, { fontSize: 18 }]}>View All</Text></TouchableOpacity></View>}
                contentContainerStyle={{ gap: 15 }}
                numColumns={2}
                ListHeaderComponent={() => (
                    <TouchableOpacity style={styles.titleContainer}>
                        <Text style={styles.title}>Filter shops</Text>
                    </TouchableOpacity>)}
            />
        </LinearGradient>
    );
};

export default AllShops;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(3),
        paddingBottom: hp(12),
        paddingHorizontal: wp(4),
    },
    title: {
        fontSize: wp(5),
        color: '#3B63EF',
        fontFamily: 'Poppins-SemiBold',
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: "center",
        borderRadius: 30,
        paddingHorizontal: wp(6),
        paddingVertical: hp(0.5)
    },
    titleContainer: {
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 30
    },
    card: {
            width: '47%',
            backgroundColor: '#1f1f1f',
            borderRadius: 12,
            // padding: 12,
            marginBottom: hp(0),
            marginHorizontal: wp(1),
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            position: "relative"
        },
        cardImage: {
            width: '100%',
            height: hp(14),
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginBottom: hp(0),
        },
        name: {
            fontSize: wp(3),
            color: '#fff',
            fontFamily: 'Poppins-SemiBold',
        },
        location: {
            color: '#d3d3d3',
            fontSize: wp(3),
            marginBottom: 4,
            fontFamily: 'Poppins-Regular',
        },
        category: {
            color: '#A9CEFF',
            fontSize: wp(2.5),
            fontFamily: 'Poppins-Regular',
        },
        details: {
            fontSize: wp(1.9),
            color: '#FFD700',
            marginBottom: 2,
            fontFamily: 'Poppins-Medium',
        },
        timings: {
            fontSize: wp(3),
            color: '#bbb',
            fontFamily: 'Poppins-Regular',
        },
        contact: {
            fontSize: 16,
            color: '#fff',
            fontFamily: 'Poppins-SemiBold',
            alignSelf: "center"
        },
        location: {
            color: "#d3d3d3",
            fontFamily: "Poppins-Regular",
            fontSize: wp(3.5),
        },
});
