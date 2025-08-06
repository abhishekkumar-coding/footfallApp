import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { useGetFeaturedShopsQuery } from '../../features/shops/shopApi'; // ✅ Corrected this import
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import FeaturedShopCard from '../../components/FeaturedShopCard';
import ViewAllButton from '../../components/ViewAllButton';
import { Fonts } from '../../utils/typography';

const FeaturedShopsSection = () => {
    const navigation = useNavigation();
    const { data, isLoading } = useGetFeaturedShopsQuery(); // ✅ Corrected hook name
    const [imageError, setImageError] = useState(false);
    const { t } = useTranslation();

    const featuredShops = data?.data || [];

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
        <View style={[styles.container]}>
            <View style={styles.headerRow}>
                <Text style={styles.heading}>{t('Featured_shops')}</Text>
                <ViewAllButton onPress={handleViewAll} />
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
                    contentContainerStyle={{
                        paddingLeft: wp(4),
                        paddingRight: wp(2),
                    }}
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
        fontSize: RFValue(16, SCREEN_HEIGHT),
        fontFamily: Fonts.primary_SemiBold,
        color: '#fff',
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: hp(3),
    },
    emptyImage: {
        width: wp(20),
        height: wp(20),
        resizeMode: 'contain',
        opacity: 0.5,
    },
    title: {
        fontSize: RFValue(16, SCREEN_HEIGHT),
        color: '#fff',
        fontFamily: Fonts.primary_Bold,
        textAlign: 'center',
        opacity: 0.5,
    },
    subtitle: {
        fontSize: RFValue(12, SCREEN_HEIGHT),
        color: '#fff',
        marginTop: 4,
        textAlign: 'center',
        fontFamily: Fonts.primary_Regular,
        opacity: 0.4,
    },
});
