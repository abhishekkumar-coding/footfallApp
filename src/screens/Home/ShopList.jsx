import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllShopsQuery, useGetNearbyShopsQuery } from '../../features/shops/shopApi';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';
import ShopSkeletonCard from "./ShopSkeletonCard"
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShopList = forwardRef((props, ref) => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t } = useTranslation();

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  useEffect(() => {
    const fetchLatLng = async () => {
      let lat = null;
      let lng = null;

      try {
        const selectedAddress = await AsyncStorage.getItem('selectedAddress');
        const parsed = selectedAddress ? JSON.parse(selectedAddress) : null;
          // console.log('Using selectedAddress coordinates:', parsed.location.coordinates);

        if (parsed) {
          lat = parsed.location.coordinates[1]
          lng = parsed.location.coordinates[0]
          console.log('Using selectedAddress coordinates:', lat, lng);
        } else if (user?.location?.coordinates?.length === 2) {
          lat = user.location.coordinates[1];
          lng = user.location.coordinates[0];
          console.log('Using user coordinates:', lat, lng);
        } else {
          // Default coordinates (India Gate)
          lat = 28.6129;
          lng = 77.2295;
          console.log('Using default coordinates (India Gate):', lat, lng);
        }

        setCoordinates({ lat, lng });
      } catch (err) {
        console.error('Error fetching coordinates:', err);
      }
    };

    fetchLatLng();
  }, [user]);

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
  console.log("ShopData on ShopList: ", shopData)


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



  return (
    <>
      <View style={styles.header}>
        <Text style={styles.heading}>{t('nearby_shops')}</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>{t('view_all')}</Text>
        </TouchableOpacity>
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
          ListEmptyComponent={
            <View style={{ marginTop: hp(10) }}>
              <Text style={{ fontFamily: "Poppins-SemiBold", textAlign: "center", fontSize: RFValue(20), color: "#fff" }}>
                {t('noShopsAvailable')}
              </Text>
              <Text style={{ fontFamily: "Poppins-Regular", textAlign: "center", fontSize: RFValue(15), color: "#999" }}>
                {t('pleaseTryAgainLater')}
              </Text>
              <Image
                source={require('../../../assets/noShop.png')}
                style={{ width: wp(40), height: hp(30), alignSelf: "center" }}
              />
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile} activeOpacity={0.8}>
                <Text style={styles.updateButtonText}>{t('update_location')}</Text>
              </TouchableOpacity>

            </View>
          }
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
    fontSize: RFValue(16),
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: hp(1),
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
    paddingVertical: hp(1.5),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignSelf: 'center',
  },
  updateButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: RFValue(14),
    textAlign: 'center',
    letterSpacing: 0.5,
  },


});

export default ShopList;