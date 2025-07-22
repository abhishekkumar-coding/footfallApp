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
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllShopsQuery, useGetNearbyShopsQuery } from '../../features/shops/shopApi';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';
import ShopSkeletonCard from "./ShopSkeletonCard"
import { useTranslation } from 'react-i18next';

const ShopList = forwardRef((props, ref) => {
  const user = useSelector(state => state.user.user);

  const lat = user?.location?.coordinates?.[1] || null
  const lng = user?.location?.coordinates?.[0] || null
  console.log("User lat and long: ", lat, lng)

  const { navigation } = props;
  const dispatch = useDispatch();
  // const { data, refetch, isLoading } = useGetAllShopsQuery();
  const { t } = useTranslation();
  const { data, refetch, error, isLoading } = useGetNearbyShopsQuery({ lat, lng });
  const shopData = data?.data || [];
  console.log("NearBy Shops: ", data)

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
    fontFamily: 'Poppins-SemiBold',
    color: '#00BFFF',
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

});

export default ShopList;