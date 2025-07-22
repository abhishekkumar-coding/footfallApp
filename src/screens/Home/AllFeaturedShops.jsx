import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';
import { useGetAllShopsQuery } from '../../features/shops/shopApi';
import PageHeader from '../../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import FeaturedShopCard from '../../components/FeaturedShopCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const AllFeaturedShops = () => {
    const navigation = useNavigation();
    const { data, isLoading } = useGetAllShopsQuery();
    const [imageError, setImageError] = useState(false);

    const { t } = useTranslation()
    // console.log("Featured Shops: ", data.data.shop)

    const featuredShops = data?.data?.shops?.filter(shop => shop.featured === true) || [];
    console.log("Featured Shops: ", featuredShops)

    // const renderShopCard = ({ item }) => (
    //     <TouchableOpacity
    //         style={styles.card}
    //         activeOpacity={0.8}
    //         onPress={() => navigation.navigate('ShopDetails', { id: item._id })}
    //     >
    //         <Image
    //             source={{ uri: item.cover }}
    //             style={styles.image}
    //             resizeMode="cover"
    //         />
    //         <View style={styles.shopInfo}>
    //             <Text style={styles.category}>{item.category}</Text>
    //             <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
    //             {/* <Text style={styles.shopLocation}>{item.location || "Unknown"}</Text> */}
    //         </View>
    //     </TouchableOpacity>
    // );

    const renderShopCard = ({ item }) => (
        <FeaturedShopCard
            item={item}
            onPress={() => navigation.navigate('ShopDetails', { id: item._id })}
        />
    );

    if (isLoading) {
        return (
            <LinearGradient colors={['#000337', '#000000']} style={{
                flex: 1, justifyContent: "center",
                alignItems: "center"
            }}>
                {/* <Text style={styles.header}>All Featured Shops</Text> */}
                <ActivityIndicator size={"large"} color={"#fff"} />
            </LinearGradient>
        );
    }


    return (
                <SafeAreaView style={{ flex: 1 }}>
        
        <LinearGradient colors={['#000337', '#000000']} style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fefefe" />
            <PageHeader lable={t("all_featured_shop")} back />
            <FlatList
                data={featuredShops}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(5) }}
                renderItem={renderShopCard}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No featured shops available.</Text>
                }
            />
        </LinearGradient>
        </SafeAreaView>
    );
};


export default AllFeaturedShops;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fefefe',
//         // paddingTop: hp(2),
//     },
//     header: {
//         fontSize: 22,
//         fontWeight: '700',
//         paddingHorizontal: wp(4),
//         marginBottom: hp(2),
//         color: '#111',
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         overflow: 'hidden',
//         marginBottom: hp(2.5),
//         width: wp(44),
//         elevation: 4,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//     },
//     image: {
//         width: '100%',
//         height: hp(16),
//     },
//     shopInfo: {
//         padding: hp(0),
//     },
//     category: {
//         paddingHorizontal: wp(2),
//         paddingTop: hp(1),
//         fontFamily: "Poppins-Regular"
//     },
//     shopName: {
//         paddingHorizontal: wp(2),
//         paddingVertical: hp(0.2),
//         fontSize: 14,
//         fontFamily: "Poppins-SemiBold"
//     },
//     shopLocation: {
//         fontSize: 13,
//         color: '#777',
//         marginTop: 2,
//     },
//     emptyText: {
//         textAlign: 'center',
//         marginTop: hp(5),
//         fontSize: 16,
//         color: '#888',
//     },
// });

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardWrapper: {
        width: wp(44),
        marginBottom: hp(2.5),
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    card: {
        position: 'relative',
        width: '100%',
        height: hp(22),
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
    },
    textContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffffcc',
        color: '#333',
        fontSize: 11,
        fontWeight: '500',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: 5,
    },
    shopName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(5),
        fontSize: 16,
        color: '#ccc',
    },
});
