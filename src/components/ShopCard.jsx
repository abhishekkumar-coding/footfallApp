import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';



import { useDispatch, useSelector } from 'react-redux';

import FilledFavIcon from '../utils/icons/FilledFavIcon';
import EmptyHeart from '../utils/icons/EmptyHeart';
import { addToWishlist, removeFromWishlist } from '../features/wishlistSlice';
import { hp, wp } from '../utils/dimensions';

const ShopCard = ({ shop, onPress }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items);
  const favoriteShops = wishlist.shops || [];

  // Parse gallery images
  let galleryImages = [];
  try {
    galleryImages = JSON.parse(shop.gallery?.[0] || '[]');
  } catch (error) {
    console.warn('Failed to parse gallery JSON:', error);
  }
  const mainImage = galleryImages[0] || shop.cover || shop.logo;
  const isFavorite = favoriteShops.some(fav => fav._id === shop._id);

  const toggleFavShop = () => {
    const isFav = favoriteShops.some(item => item._id === shop._id);
    if (isFav) {
      dispatch(removeFromWishlist({ removeId: shop._id, type: 'shops' }));
    } else {
      dispatch(addToWishlist({ data: shop, type: 'shops' }));
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <Image 
        style={styles.cardImage} 
        source={{ uri: mainImage }} 
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.category}>{shop.category}</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{shop.name}</Text>
        </View>
        <Text style={styles.location}>{shop.city}</Text>
        <View style={styles.favTimeContainer}>
          <Text style={styles.timings}>
            {shop.startTime} - {shop.endTime}
          </Text>
          <TouchableOpacity onPress={toggleFavShop}>
            {isFavorite ? <FilledFavIcon /> : <EmptyHeart />}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    marginBottom: hp(2),
    marginHorizontal: wp(1),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: hp(14),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: wp(3),
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  location: {
    color: '#d3d3d3',
    fontSize: wp(3),
    fontFamily: 'Poppins-Regular',
  },
  category: {
    color: '#A9CEFF',
    fontSize: wp(2.5),
    fontFamily: 'Poppins-Regular',
  },
  favTimeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timings: {
    fontSize: wp(2.2),
    color: '#bbb',
    fontFamily: 'Poppins-Regular',
  },
});

export default ShopCard;