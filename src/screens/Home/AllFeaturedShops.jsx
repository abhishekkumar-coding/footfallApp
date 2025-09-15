import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';
import { useGetAllShopsQuery, useGetFeaturedShopsQuery } from '../../features/shops/shopApi';
import PageHeader from '../../components/PageHeader';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import FeaturedShopCard from '../../components/FeaturedShopCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../../layout/AppLayout';

const AllFeaturedShops = () => {
    const navigation = useNavigation();
    const { data, isLoading, refetch } = useGetFeaturedShopsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    const [imageError, setImageError] = useState(false);
    console.log("Featured Shops: ", data)

    const { t } = useTranslation()
    // console.log("Featured Shops: ", data.data.shop)

    const featuredShops = data?.data || [];
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
        <AppLayout showCircle={false} style={{ flex: 1 }}>


            <PageHeader lable={t("all_featured_shop")} back />
            <FlatList
                data={featuredShops}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(5) }}
                renderItem={renderShopCard}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: hp(10) }}>
                        <Image
                            source={require('../../../assets/noFeaturedShop.png')}
                            style={{ width: wp(50), height: wp(50), resizeMode: 'contain' }}
                        />
                        <Text style={styles.title}>{t('no_featured_shop')}</Text>

                        <Text style={styles.subtitle}>{t('check_back_later')}</Text>
                    </View>

                }
            />

        </AppLayout>
    );
};


export default AllFeaturedShops;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    title: {
        fontSize: 20,
        color: '#ccc',
        fontFamily: "Poppins-Bold"
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
        textAlign: 'center',
    },
});