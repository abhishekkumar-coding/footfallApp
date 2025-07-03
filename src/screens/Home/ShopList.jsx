import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllShopsQuery } from '../../features/shops/shopApi';
import { loadWishlist } from '../../features/wishlistSlice';
import ShopCard from '../../components/ShopCard';


const ShopList = forwardRef((props, ref) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { data, refetch, isLoading } = useGetAllShopsQuery();
  const shopData = data?.data?.shops || [];

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

  const handleViewAll = () => {
    navigation.navigate('AllShops', { shopsData: shopData });
  };

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
    <FlatList
      data={shopData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>Nearby Shops</Text>
          <TouchableOpacity onPress={handleViewAll}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
      }
      contentContainerStyle={styles.listContent}
      numColumns={2}
    />
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
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
    color: '#fff',
  },
  listContent: {
    paddingBottom: hp(10.5),
    paddingHorizontal: wp(3),
  },
});

export default ShopList;