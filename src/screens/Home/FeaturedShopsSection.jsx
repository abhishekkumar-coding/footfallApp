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
        <View style={styles.container}>
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
            ) : (
                <FlatList
                    data={featuredShops}
                    renderItem={renderShopCard}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: wp(4), paddingRight: wp(2) }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>{t('No featured shops available.')}</Text>
                    }
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
        fontSize: 14,
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
    emptyText: {
        paddingHorizontal: wp(4),
        fontSize: 14,
        color: '#999',
        marginTop: hp(1),
    },
});
