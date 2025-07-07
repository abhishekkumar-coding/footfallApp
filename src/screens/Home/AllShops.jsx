import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import PageHeader from '../../components/BackButton';
import { useDispatch } from 'react-redux';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';
import ShopSkeletonCard from './ShopSkeletonCard';

const AllShops = ({ route }) => {
  const { shopsData } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const categories = [
    'ALL',
    'New Delhi',
    'Noida',
    'Gurugram',
    ...new Set(shopsData.map(shop => shop.city)),
  ];

  const filteredShops =
    selectedCategory === 'ALL'
      ? shopsData
      : shopsData.filter(shop => shop.city === selectedCategory);

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
      onPress={() =>
        navigation.navigate('ShopDetails', {
          shop: item,
          image: item.cover || item.logo,
        })
      }
    />
  );

  return (
    <>
      <PageHeader lable={'Shops'} back />
      <LinearGradient colors={['#000337', '#000000']} style={styles.container}>
        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  selectedCategory === category && styles.selectedFilterButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedCategory === category && styles.selectedFilterText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
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
          />
        )}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(1),
    paddingBottom: hp(12),
    paddingHorizontal: wp(4),
  },
  filterContainer: {
    marginBottom: hp(2),
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
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default AllShops;
