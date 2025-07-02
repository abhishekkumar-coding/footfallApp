import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import FilledFavIcon from '../../utils/icons/FilledFavIcon';
import FavIcon from '../../utils/icons/FavIcon';

const AllShops = ({ route }) => {
    const { shopsData } = route.params;
    const [favoriteShops, setFavoriteShops] = useState([]);

    const navigation = useNavigation()
    console.log("View all shops : ", shopsData)

    // const renderItem = ({ item }) => (
    //     // console.log(item)
    //     // <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ShopDetails', { shop: item })}>
    //     //     <Image
    //     //         style={styles.cardImage}
    //     //         source={{ uri: item.image }}
    //     //     />
    //     //     <View style={{ padding: 10, alignItems: "flex-start", flex: 1, justifyContent: "space-between" }}>
    //     //         <Text style={styles.category}>{item.category}</Text>
    //     //         <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
    //     //             <Text style={styles.name}>{item.name}</Text>
    //     //             <Text style={styles.details}>⭐ {item.rating}</Text>
    //     //         </View>
    //     //         <Text style={styles.location}>{item.location}</Text>
    //     //         <Text style={styles.timings}>{item.timings}</Text>
    //     //         {/* <TouchableOpacity style={styles.contactButton} ><View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}><PhoneIcon/> <Text style={styles.contact}> {item.contact}</Text></View></TouchableOpacity> */}
    //     //     </View>
    //     // </TouchableOpacity>
    //     <Text></Text>
    // );

    const isFavorite = (shopId) => {
        // console.log(shopId);
        return favoriteShops.includes(shopId);
    };

    const toggleFavorite = (shopId) => {
        if (isFavorite(shopId)) {
            setFavoriteShops((prev) => prev.filter((id) => id !== shopId));
        } else {
            setFavoriteShops((prev) => [...prev, shopId]);
        }
    };


     const renderItem = ({ item }) => {

       let galleryImages = [];
    try {
        // item.gallery[0] is like: "[\"url1\",\"url2\"]"
        galleryImages = JSON.parse(item.gallery?.[0] || '[]');
        // console.log(galleryImages)
    } catch (error) {
        console.warn("Failed to parse gallery JSON:", error);
    }
        const mainImage = galleryImages[0] || item.cover || item.logo;

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
        } = item;

        // console.log("Destructured fields:", {
        //     contact,
        //     shop_id,
        //     mainImage,
        //     category,
        //     name,
        //     startTime,
        //     endTime,
        //     logo,
        //     cover,
        //     address,
        //     city,
        //     state,
        //     country,
        //     pinCode,
        // });
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ShopDetails', { shop: item, image:mainImage })}
            >
                <Image style={styles.cardImage} source={{ uri: mainImage }} />
                <View style={{ padding: 10, alignItems: 'flex-start', flex: 1, justifyContent: 'space-between' }}>
                    <Text style={styles.category}>{category}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <Text style={styles.name}>{name}</Text>
                        {/* <Text style={styles.details}>⭐ {item.rating}</Text> */}
                    </View>
                    <Text style={styles.location}>{city}</Text>
                    <View style={styles.favTimeContainer}>
                        <Text style={styles.timings}>{startTime} - {endTime}</Text>
                        <TouchableOpacity onPress={() => toggleFavorite(shop_id)}>
                            {isFavorite(item._id) ? <FilledFavIcon /> : <FavIcon />}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

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
    paddingTop: hp(6),
    paddingBottom: hp(12),
    paddingHorizontal: wp(4),
  },
  title: {
    fontSize: RFValue(14),
    color: '#3B63EF',
    fontFamily: 'Poppins-SemiBold',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: wp(6),
    paddingVertical: hp(0.5),
  },
  titleContainer: {
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  card: {
        width: '47%',
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        // padding: 12,
        marginBottom: hp(2),
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
        fontSize: wp(2),
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
    favTimeContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
    },
    timings: {
        fontSize: wp(2.2),
        color: '#bbb',
        fontFamily: 'Poppins-Regular',
    },
    // contact: {
    //     fontSize: 16,
    //     color: '#fff',
    //     fontFamily: 'Poppins-SemiBold',
    //     alignSelf: "center"
    // },
    location: {
        color: "#d3d3d3",
        fontFamily: "Poppins-Regular",
        fontSize: wp(3),
    },
    // contactButton: {
    //     backgroundColor: "#3B63EF",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     paddingVertical: 10,
    //     paddingHorizontal: 10,
    //     borderRadius: 10,
    //     alignSelf: "center"
    // }
    listContent: {
        paddingBottom: hp(10.5),
        paddingHorizontal: wp(3),
    },
});

