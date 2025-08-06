import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllShopsQuery, useGetNearbyShopsQuery } from '../../features/shops/shopApi';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';
import ShopSkeletonCard from "./ShopSkeletonCard"
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fonts } from '../../utils/typography';
import ViewAllButton from '../../components/ViewAllButton';

const ShopList = forwardRef((props, ref) => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t } = useTranslation();
  const savedAddress = useSelector((state) => state.user.savedAddress);

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  useEffect(() => {
    const fetchLatLng = async () => {
      try {
        let lat = null;
        let lng = null;

        if (savedAddress?.location?.coordinates?.length === 2) {
          lat = savedAddress.location.coordinates[1];
          lng = savedAddress.location.coordinates[0];
          console.log('Using savedAddress coordinates from Redux:', lat, lng);
        } else {
          const selectedAddress = await AsyncStorage.getItem('selectedAddress');
          const parsed = selectedAddress ? JSON.parse(selectedAddress) : null;

          if (parsed?.location?.coordinates?.length === 2) {
            lat = parsed.location.coordinates[1];
            lng = parsed.location.coordinates[0];
            console.log('Using selectedAddress coordinates from AsyncStorage:', lat, lng);
          } else if (user?.location?.coordinates?.length === 2) {
            lat = user.location.coordinates[1];
            lng = user.location.coordinates[0];
            console.log('Using user coordinates:', lat, lng);
          } else {
            // Fallback to default coordinates (India Gate)
            lat = 28.6129;
            lng = 77.2295;
            console.log('Using default coordinates (India Gate):', lat, lng);
          }
        }

        setCoordinates({ lat, lng });
      } catch (err) {
        console.error('Error fetching coordinates:', err);
      }
    };

    fetchLatLng();
  }, [user, savedAddress]);
  ;

  const { data, refetch, error, isLoading } = useGetNearbyShopsQuery({
    lat: coordinates.lat,
    lng: coordinates.lng,
  });

  const shopData = data?.data || [];

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  useImperativeHandle(
    ref,
    () => ({
      refetch: () => refetch(),
      loading: isLoading,
    }),
    [refetch, isLoading]
  );
  // console.log("ShopData on ShopList: ", shopData)


  const handleViewAll = () => {
    navigation.navigate('AllShops', { shopsData: shopData });
  };

  const handleUpdateProfile = () => {
    navigation.navigate('EditProfile');
  };

  const renderItem = ({ item }) => (
    <ShopCard
      shop={item}
      onPress={() => navigation.navigate('ShopDetails', {
        id: item._id,
      })}
    />
  );
  const EmptyComponent = () => {
    return (
      <View style={{ minHeight: SCREEN_HEIGHT * 0.45, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{
          fontFamily: Fonts.primary_Bold, textAlign: "center",
          fontSize: RFValue(16, SCREEN_HEIGHT), color: "#fff", opacity: 0.5
        }}>
          {t('noShopsAvailable')}
        </Text>
        <Text style={{
          fontFamily: Fonts.primary_Regular, textAlign: "center",
          fontSize: RFValue(12, SCREEN_HEIGHT), color: "#fff", opacity: 0.4
        }}>
          {t('pleaseTryAgainLater')}
        </Text>
        <Image
          source={require('../../../assets/noShop.png')}
          style={{ width: 160, height: 160, alignSelf: "center", resizeMode: "cover", opacity: 0.5 }}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile} activeOpacity={0.9}>
          <Text style={styles.updateButtonText}>{t('update_location')}</Text>
        </TouchableOpacity>

      </View>
    )
  }


  return (
    <>
      <View style={styles.header}>
        <Text style={styles.heading}>{t('nearby_shops')}</Text>
        <ViewAllButton onPress={handleViewAll} />
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <ShopSkeletonCard key={index} />
          ))}
        </View>
      ) : (
        <FlatList
          data={shopData.slice(0, 6)}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          ListEmptyComponent={EmptyComponent}
        />
      )}
    </>
  );

});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(1),
  },
  heading: {
    fontSize: RFValue(16, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    color: '#fff',
  },
  viewAll: {
    fontFamily: 'Poppins-Regular',
    color: '#00BFFF',
    fontSize: RFValue(11),
  },
  listContent: {
    paddingBottom: hp(10.5),
    paddingHorizontal: wp(3),
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
  },
  updateButton: {
    width: wp(60),
    height: 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
  },
  updateButtonText: {
    fontFamily: Fonts.primary_SemiBold,
    color: '#fff',
    fontSize: RFValue(14, SCREEN_HEIGHT),
    textAlign: 'center',
    letterSpacing: 0.5,
  },


});

export default ShopList;