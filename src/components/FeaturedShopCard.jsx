import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { hp, wp } from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message'; // Make sure Toast is properly configured in your app

const FeaturedShopCard = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);
  const isValidCover = item.cover && item.cover.trim() !== '';
  const isDisabled = item?.vendor?.rechargePoints < 100;

  const handlePress = () => {
    if (isDisabled) {
      Toast.show({
        type: 'error',
        text1: 'Shop Setup Incomplete',
        text2: 'This shop is not fully set up yet.',
      });
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.cardWrapper, isDisabled && styles.disabledCardWrapper]}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.card}>
        <Image
          source={
            !isValidCover || imageError
              ? require('../../assets/emptyFeaturedImage.png')
              : { uri: item.cover }
          }
          style={[styles.image, isDisabled && { opacity: 0.4 }]}
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
    marginHorizontal: wp(1),
  },
  disabledCardWrapper: {
    opacity: 0.5,
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
  shopName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
