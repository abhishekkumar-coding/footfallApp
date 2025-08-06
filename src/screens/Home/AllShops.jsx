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
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
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
import { Colors } from '../../utils/Colors';
import { Fonts } from '../../utils/typography';

const AllShops = () => {
  const { t } = useTranslation();
 

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: shops, refetch, isLoading: shopsDataIsLoading } = useGetAllShopsQuery();
 
  console.log("Shops : ", shopsData)

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

      {/* Filter Section */}
      <FlatList
        data={categories}

        contentContainerStyle={styles.filterContainer}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.key;
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={item.key}
              style={[
                styles.filterButton,
                isSelected && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.selectedFilterText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

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
              <Text style={styles.emptyText}>
                {t('noShopsAvailable')}
              </Text>
              <Text style={styles.emptySubText}>
                {t('pleaseTryAgainLater')}
              </Text>
              <Image
                source={require('../../../assets/noShop.png')}
                style={{ width: wp(35), height: hp(20), alignSelf: "center", resizeMode: "contain", opacity:0.5 }}
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
    justifyContent: "center",
    paddingBottom: hp(4),
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15
  },
  filterScrollContent: {
    paddingHorizontal: wp(1),
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1),
    borderRadius: 30,
    marginHorizontal: wp(1),
    backgroundColor: "rgba(255,255,255,0.2)",
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  selectedFilterButton: {
    backgroundColor: Colors.purple,
  },
  filterText: {
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: RFValue(15, SCREEN_HEIGHT),
  },
  selectedFilterText: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: hp(10.5),
    paddingTop: hp(2),
    // justifyContent:"center",
    // alignItems:"center",
    paddingHorizontal: wp(3)
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyText: {
    fontFamily: Fonts.primary_SemiBold,
    textAlign: "center",
    fontSize: RFValue(20, SCREEN_HEIGHT),
    color: "#fff",
    opacity:0.5
  },
  emptySubText: {
    fontFamily: Fonts.primary_Regular,
    textAlign: "center",
    fontSize: RFValue(15, SCREEN_HEIGHT),
    color: "#fff",
    opacity: 0.4
  }
});
