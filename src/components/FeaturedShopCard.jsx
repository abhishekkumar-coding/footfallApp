// components/FeaturedShopCard.js

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { hp, wp } from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';

const FeaturedShopCard = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);

  const isValidCover = item.cover && item.cover.trim() !== '';

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.card}>
        <Image
          source={
            !isValidCover || imageError
              ? require('../../assets/emptyFeaturedImage.png')
              : { uri: item.cover }
          }
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.overlay}
        />
        <View style={styles.textContainer}>
          <Text style={styles.categoryBadge}>{item.category}</Text>
          <Text style={styles.shopName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedShopCard;

const styles = StyleSheet.create({
  cardWrapper: {
    width: wp(44),
    marginBottom: hp(2.5),
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginHorizontal:wp(1)
  },
  card: {
    position: 'relative',
    width: '100%',
    height: hp(22),
    borderRadius: 16,
    overflow: 'hidden',
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
});
