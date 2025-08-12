import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message'; // Make sure Toast is properly configured in your app
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../utils/typography';
import { useTranslation } from 'react-i18next';

const FeaturedShopCard = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);
  const isValidCover = item.cover && item.cover.trim() !== '';
  const isDisabled = item?.vendor?.rechargePoints < 100;
  const {t} = useTranslation()

  const handlePress = () => {
    if (isDisabled) {
      Toast.show({
        type: 'error',
        text1: t('shopSetupIncomplete'),
        text2: t('shopNotFullySetup'),
      });
    } else {
      onPress();
    }
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.cardWrapper, isDisabled && styles.disabledCardWrapper]}>
        <View style={styles.card}>
          <Image
            source={
              !isValidCover || imageError
                ? require('../../assets/emptyFeaturedImage.png')
                : { uri: item.cover }
            }
            style={styles.image}
          />
        </View>
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.shopName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>

  )

};

export default FeaturedShopCard;

const styles = StyleSheet.create({
  cardWrapper: {
    width: wp(44),
    height: hp(30),
    marginBottom: hp(2.5),
    borderRadius: 16,
    marginHorizontal: wp(1),
    overflow: 'hidden',
  },
  disabledCardWrapper: {
    opacity: 0.5,
  },
  categoryBadge: {
    color: '#fff',
    fontSize: RFValue(11, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  card: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  shopName: {
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: 20,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff30',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    position: 'absolute',
    top: 10,
    left: 10,
  },
});
