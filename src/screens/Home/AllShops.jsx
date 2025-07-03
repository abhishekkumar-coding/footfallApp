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
import { useDispatch, useSelector } from 'react-redux';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';


const AllShops = ({ route }) => {
  const { shopsData } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Extract unique categories from shopsData
  const categories = [
    'ALL',
    'New Delhi',
    'Noida',
    'Gurugram',
    ...new Set(shopsData.map(shop => shop.city)),
  ];

  // Filter shops based on selected category
  const filteredShops =
    selectedCategory === 'ALL'
      ? shopsData
      : shopsData.filter(shop => shop.city === selectedCategory);

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <ShopCard
      shop={item}
      onPress={() => navigation.navigate('ShopDetails', { 
        shop: item, 
        image: item.cover || item.logo 
      })}
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

        {/* Shops Grid */}
        <FlatList
          data={filteredShops}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          numColumns={2}
        />
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
});

export default AllShops;