import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import PageHeader from '../../components/PageHeader';
import { useDispatch } from 'react-redux';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';
import ShopSkeletonCard from './ShopSkeletonCard';
import { useGetAllShopsQuery, useGetFilteredShopsQuery } from '../../features/shops/shopApi';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../../layout/AppLayout';

const AllShops = ({ route }) => {
  const { t } = useTranslation();
  // const { shopsData } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
    const { data:shops, refetch, isLoading:shopsDataIsLoading } = useGetAllShopsQuery();
  const shopsData = shops?.data?.shops || []
  console.log("Shops : ", shopsData)

  const { data } = useGetFilteredShopsQuery(selectedCategory);


  const categories = [
    { key: 'ALL', label: t('all') },
    { key: 'New Delhi', label: 'New Delhi' },
    { key: 'Noida', label: 'Noida' },
    { key: 'Gurugram', label: 'Gurugram' },
    { key: 'Patna', label: 'Patna' },
    ...Array.from(new Set(shopsData.map(shop => shop.city))).map(city => ({ key: city, label: city })),
  ];

  const filteredShops =
    selectedCategory === 'ALL'
      ? shopsData
      : data?.data?.shops;

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000); // simulate 1s loading
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const renderItem = ({ item }) => (
    <ShopCard
      shop={item}
      onPress={() => navigation.navigate('ShopDetails', {
        id: item._id,
      })}
    />
  );

  return (
    <AppLayout style={{ flex: 1 }}>

      <PageHeader lable={t('shops')} back />
      
        {/* Filter Section */}
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            ListEmptyComponent={
              <View style={{ marginTop: hp(10) }}>
                <Text style={{ fontFamily: "Poppins-SemiBold", textAlign: "center", fontSize: RFValue(20), color: "#fff" }}>
                  {t('noShopsAvailable')}
                </Text>
                <Text style={{ fontFamily: "Poppins-Regular", textAlign: "center", fontSize: RFValue(15), color: "#999" }}>
                  {t('pleaseTryAgainLater')}
                </Text>
                <Image
                  source={require('../../../assets/noShop.png')}
                  style={{ width: wp(40), height: hp(30), alignSelf: "center" }}
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
    justifyContent:"center",
    // paddingTop: hp(1),
    paddingBottom: hp(4),
    // paddingHorizontal: wp(4),
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
    paddingTop:hp(2),
    justifyContent:"center",
    alignItems:"center",
    paddingHorizontal:wp(1)
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

