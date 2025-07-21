import React from 'react';
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

const AllFeaturedShops = () => {
    const navigation = useNavigation();
    const { data, isLoading } = useGetAllShopsQuery();
    // console.log("Featured Shops: ", data.data.shop)

    const featuredShops = data?.data?.shops?.filter(shop => shop.featured === true) || [];
    console.log("Featured Shops: ", featuredShops)

    const renderShopCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ShopDetails', { id: item._id })}
        >
            <Image
                source={{ uri: item.cover }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.shopInfo}>
                <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
                {/* <Text style={styles.shopLocation}>{item.location || "Unknown"}</Text> */}
            </View>
        </TouchableOpacity>
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
        <LinearGradient colors={['#000337', '#000000']} style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fefefe" />
            <PageHeader lable={"All Feattured Shop"} back />
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
    );
};


export default AllFeaturedShops;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefefe',
        // paddingTop: hp(2),
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        paddingHorizontal: wp(4),
        marginBottom: hp(2),
        color: '#111',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: hp(2.5),
        width: wp(44),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    image: {
        width: '100%',
        height: hp(16),
    },
    shopInfo: {
        padding: hp(1.2),
    },
    shopName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    shopLocation: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: hp(5),
        fontSize: 16,
        color: '#888',
    },
});
