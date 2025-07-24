import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';
import { useGetAllShopsQuery } from '../../features/shops/shopApi';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import FeaturedShopCard from '../../components/FeaturedShopCard';

const FeaturedShopsSection = () => {
    const navigation = useNavigation();
    const { data, isLoading, isError } = useGetAllShopsQuery();
    const [imageError, setImageError] = useState(false);
    const { t } = useTranslation();

    const featuredShops = data?.data?.shops?.filter(shop => shop.featured === true) || [];

    const handleViewAll = () => {
        navigation.navigate('AllFeaturedShops');
    };

    const renderShopCard = ({ item }) => (
        <FeaturedShopCard
            item={item}
            onPress={() => navigation.navigate('ShopDetails', { id: item._id })}
        />
    );

    const renderSkeletonCard = () => (
        <View style={[styles.cardWrapper, { backgroundColor: '#1a1a1a' }]}>
            <View style={styles.card}>
                <View style={{ flex: 1, backgroundColor: '#333' }} />
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { flex: 1 }]}>
            <View style={styles.headerRow}>
                <Text style={styles.heading}>{t('Featured_shops')}</Text>
                <TouchableOpacity onPress={handleViewAll}>
                    <Text style={styles.viewAll}>{t('view_all')}</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <FlatList
                    data={[1, 2, 3]}
                    renderItem={renderSkeletonCard}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: wp(4) }}
                />
            ) : featuredShops.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../assets/noFeaturedShop.png')}
                        style={styles.emptyImage}
                    />
                    <Text style={styles.title}>No Featured Shop</Text>
                    <Text style={styles.subtitle}>Please check back later for updates!</Text>
                </View>
            ) : (
                <FlatList
                    data={featuredShops}
                    renderItem={renderShopCard}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: wp(4), paddingRight: wp(2) }}
                />
            )}
        </View>
    );

};

export default FeaturedShopsSection;


const styles = StyleSheet.create({
    container: {
        marginVertical: hp(2),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        marginBottom: hp(1),
        alignItems: 'center',
    },
    heading: {
        fontSize: RFValue(16),
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
    },
    viewAll: {
        fontSize: RFValue(11),
        color: '#00BFFF',
        fontFamily: 'Poppins-Regular',
    },
    cardWrapper: {
        width: wp(44),
        marginRight: wp(3),
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
        width: '100%',
        height: hp(22),
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
    },
    emptyImage: {
        width: wp(40),
        height: wp(40),
        resizeMode: 'contain',
        // marginBottom: hp(2),
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
        fontFamily:"Poppins-Regular"
    },
});
