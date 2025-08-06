import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import FilledFavIcon from '../utils/icons/FilledFavIcon';
import EmptyHeart from '../utils/icons/EmptyHeart';
import { addToWishlist, removeFromWishlist } from '../features/wishlistSlice';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/Colors';
import { Fonts } from '../utils/typography';

const ShopCard = ({ shop, onPress }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items);
  const favoriteShops = wishlist.shops || [];
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  const isDisabled = shop?.vendor?.rechargePoints < 100;

  let galleryImages = [];
  try {
    galleryImages = JSON.parse(shop.gallery[0] || '[]');
  } catch (error) {
    console.warn('Failed to parse gallery JSON:', error);
  }

  const mainImage = galleryImages[0] || shop.cover;

  const isFavorite = favoriteShops.some(fav => fav._id === shop._id);

  const toggleFavShop = () => {
    if (isFavorite) {
      dispatch(removeFromWishlist({ removeId: shop._id, type: 'shops' }));
    } else {
      dispatch(addToWishlist({ data: shop, type: 'shops' }));
    }
  };

  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });

  const rippleGesture = Gesture.Tap()
    .onStart(e => {
      runOnJS(setRipplePos)({ x: e.x, y: e.y });
      rippleScale.value = 0;
      rippleOpacity.value = 1;
      rippleScale.value = withTiming(2, { duration: 300 }, () => {
        rippleOpacity.value = withTiming(0, { duration: 200 });
      });
    })
    .onEnd(() => {
      runOnJS(toggleFavShop)();
    });

  const rippleStyle = useAnimatedStyle(() => {
    const rippleSize = 40;
    return {
      position: 'absolute',
      width: rippleSize,
      height: rippleSize,
      borderRadius: rippleSize / 2,
      top: ripplePos.y - rippleSize / 2,
      left: ripplePos.x - rippleSize / 2,
      backgroundColor: 'rgba(255,255,255,0.3)',
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
      zIndex: 0,
    };
  });

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
    <TouchableOpacity
      style={[styles.card, isDisabled && styles.disabledCard]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={
          imageError || !mainImage
            ? require('../../assets/emptyShop.png')
            : { uri: mainImage }
        }
        style={styles.cardImage}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
      <Text style={styles.category}>{shop.category}</Text>
      <View style={styles.cardContent}>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{shop.name}</Text>
        </View>
        <Text style={styles.location}>{shop.city}</Text>
        <View style={styles.favTimeContainer}>
          <Text style={styles.timings}>
            {t('timings', { start: shop.startTime, end: shop.endTime })}
          </Text>
          <Pressable onPress={() => { }} android_disableSound hitSlop={10}>
            <GestureDetector gesture={rippleGesture}>
              <View style={styles.rippleWrapper}>
                <Animated.View style={rippleStyle} />
                {isFavorite ? <FilledFavIcon /> : <EmptyHeart />}
              </View>
            </GestureDetector>
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ShopCard;

const styles = StyleSheet.create({
  card: {
    width: wp(45),
    backgroundColor: Colors.white_light,
    borderRadius: 12,
    marginBottom: hp(1),
    marginHorizontal: wp(1),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.4,
  },
  cardImage: {
    width: wp(45),
    height: hp(20),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: RFValue(15, SCREEN_HEIGHT),
    textTransform: 'capitalize',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom:5
  },
  location: {
    color: '#d3d3d3',
    fontSize: RFValue(12, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_Regular,
    lineHeight: RFValue(15, SCREEN_HEIGHT),
  },
  category: {
    color: '#fff',
    fontSize:   RFValue(10, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    textTransform: 'uppercase',
    lineHeight: RFValue(15, SCREEN_HEIGHT),

  },
  favTimeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timings: {
    fontSize: RFValue(10, SCREEN_HEIGHT),
    color: '#bbb',
    fontFamily: Fonts.primary_Regular,
    lineHeight: RFValue(15, SCREEN_HEIGHT),
  },
  rippleWrapper: {
    position: 'relative',
    overflow: 'hidden',
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
