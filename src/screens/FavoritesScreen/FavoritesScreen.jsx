// FavoritesScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { RFValue } from 'react-native-responsive-fontsize';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import FilledFavIcon from '../../utils/icons/FilledFavIcon';
import PageHeader from '../../components/PageHeader';
import LinearGradient from 'react-native-linear-gradient';
import { loadWishlist, removeFromWishlist } from '../../features/wishlistSlice';
import { navigate } from '../../navigations/NavigationUtil';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../../layout/AppLayout';
import { Colors } from '../../utils/Colors';
import { Fonts } from '../../utils/typography';

const FavoritesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items);
  const favoriteShops = wishlist.shops || [];

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  const handleRemoveFavorite = shopId => {
    dispatch(removeFromWishlist({ removeId: shopId, type: 'shops' }));
  };

  const renderShopItem = ({ item }) => {
    let galleryImages = [];
    try {
      galleryImages = JSON.parse(item.gallery?.[0] || '[]');
    } catch (error) {
      console.warn('Failed to parse gallery JSON:', error);
    }
    const mainImage = galleryImages[0] || item.cover || item.logo;

    return (

      <TouchableOpacity  // Changed from View to TouchableOpacity
        style={styles.card}
        onPress={() => navigate('Home', {
          screen: 'ShopDetails',
          params: { shop: item, image: mainImage }
        })}
      >
        <Image style={styles.cardImage} source={{ uri: mainImage }} />

        <View style={styles.cardContent}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          <Text style={styles.location}>{item.city}</Text>
          <View style={styles.favTimeContainer}>
            <Text style={styles.timings}>
              {item.startTime} - {item.endTime}
            </Text>
            <TouchableOpacity onPress={() => handleRemoveFavorite(item._id)}>
              <FilledFavIcon />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>  // Closing tag changed to match
    );
  };

  return (
    <AppLayout>
      <PageHeader lable={t('favorites')} />
      <View style={styles.container}>
        {favoriteShops.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={require('../../../assets/emptyfavorite.png')} style={{
              width: wp(30),
              height: hp(20),
              opacity: 0.5,
              marginBottom: hp(2)
            }} />
            {/* <Text style={styles.emptyText}>No favorites yet</Text> */}
            {t('favorites_empty_subtext')}
          </View>
        ) : (
          <FlatList
            data={favoriteShops}
            renderItem={renderShopItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#121212',
    paddingHorizontal: wp(3),
    paddingTop: hp(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: RFValue(18),
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: hp(1),
  },
  emptySubText: {
    fontSize: RFValue(14),
    color: '#d3d3d3',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    paddingHorizontal: wp(10),
  },
  card: {
    backgroundColor: Colors.white_light,
    borderRadius: 12,
    marginBottom: hp(2),
    flexDirection: 'row',
  },
  cardImage: {
    width: wp(25),
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: wp(3),
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:5
  },
  name: {
    fontSize: RFValue(14, SCREEN_HEIGHT),
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: RFValue(15, SCREEN_HEIGHT),
    textTransform: 'capitalize',
  },
  location: {
    color: '#d3d3d3',
    fontSize: RFValue(13, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_Regular,
    lineHeight: RFValue(15, SCREEN_HEIGHT),
  },
  category: {
    color: '#fff',
    fontSize: RFValue(10, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: RFValue(15, SCREEN_HEIGHT),
    textTransform: 'uppercase',
    backgroundColor: Colors.white_light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  favTimeContainer: {
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
  listContent: {
    paddingBottom: hp(10),
  },
});

export default FavoritesScreen;
