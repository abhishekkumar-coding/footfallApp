import React from 'react';
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

// const fallbackImage = require('../../assets/fallback.jpg'); // fallback image in assets

const FeaturedShopsSection = () => {
  const navigation = useNavigation();
  const { data, isLoading } = useGetAllShopsQuery();
  const { t } = useTranslation();

  const featuredShops =  data?.data?.shops?.filter(shop => shop.featured === true) || [];


  const handleViewAll = () => {
    navigation.navigate('AllFeaturedShops'); // Ensure this route exists
  };

  const renderShopCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('ShopDetails', { id: item._id })}>
      <Image
        source={ { uri: item.cover }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.shopName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSkeletonCard = () => (
    <View style={[styles.card, { backgroundColor: '#f0f0f0' }]}>
      <View style={{ width: '100%', height: hp(15), backgroundColor: '#ccc' }} />
      <View style={{ height: 16, backgroundColor: '#ddd', margin: 10, borderRadius: 4 }} />
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
          contentContainerStyle={{ paddingLeft: wp(4) }}
        />
      )}
    </View>
  );
};

export default FeaturedShopsSection;

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    marginBottom: hp(2),
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
    marginBottom: hp(1),
  },
  viewAll: {
    fontSize: 14,
    color: '#007BFF',
  },
  card: {
    marginRight: wp(3),
    width: wp(40),
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: hp(15),
  },
  shopName: {
    padding: hp(1),
    fontSize: 14,
    fontWeight: '600',
  },
});
