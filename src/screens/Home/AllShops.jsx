import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import PageHeader from '../../components/PageHeader';
import { useDispatch } from 'react-redux';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';
import ShopSkeletonCard from './ShopSkeletonCard';
import {
  useGetAllShopsQuery,
  useGetFilteredShopsQuery,
} from '../../features/shops/shopApi';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layout/AppLayout';

const AllShops = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const { data: allShopsData } = useGetAllShopsQuery();
  const { data: filteredData } = useGetFilteredShopsQuery(selectedCategory);

  const shopsData = allShopsData?.data?.shops || [];

  const categories = useMemo(() => {
    const uniqueCities = Array.from(new Set(shopsData.map(shop => shop.city))).filter(Boolean);
    return [
      { key: 'ALL', label: t('all') },
      ...uniqueCities.map(city => ({ key: city, label: city })),
    ];
  }, [shopsData, t]);

  const filteredShops =
    selectedCategory === 'ALL'
      ? shopsData
      : filteredData?.data?.shops || [];

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const renderItem = ({ item }) => (
    <ShopCard
      shop={item}
      onPress={() =>
        navigation.navigate('ShopDetails', {
          id: item._id,
        })
      }
    />
  );

  return (
    <AppLayout style={styles.container}>
      <PageHeader lable={t('shops')} back />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {categories.map(category => {
            const isSelected = selectedCategory === category.key;
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.filterButton,
                  isSelected && styles.selectedFilterButton,
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.selectedFilterText,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Shop List */}
      {isLoading ? (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <ShopSkeletonCard />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={filteredShops}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>{t('noShopsAvailable')}</Text>
              <Text style={styles.emptySubtitle}>{t('pleaseTryAgainLater')}</Text>
              <Image
                source={require('../../../assets/noShop.png')}
                style={styles.emptyImage}
              />
            </View>
          }
        />
      )}
    </AppLayout>
  );
};

export default AllShops;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp(4),
  },
  filterContainer: {
    marginVertical: hp(2),
  },
  filterScrollContent: {
    paddingHorizontal: wp(1),
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(0.5),
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FF4D00',
    marginHorizontal: wp(1),
  },
  selectedFilterButton: {
    backgroundColor: '#FF4D00',
  },
  filterText: {
    fontSize: RFValue(10),
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  selectedFilterText: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: hp(10.5),
    paddingTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(1),
  },
  emptyContainer: {
    marginTop: hp(10),
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: RFValue(20),
    color: '#fff',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(15),
    color: '#999',
    textAlign: 'center',
  },
  emptyImage: {
    width: wp(40),
    height: hp(30),
    marginTop: hp(2),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
