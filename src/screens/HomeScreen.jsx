import React, { useCallback, useState, useMemo, useRef } from 'react';
import { View, StyleSheet, RefreshControl, ImageBackground, } from 'react-native';
import { useSelector } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import HeaderHome from './Home/HeaderHome';
import ShopList from './Home/ShopList';
import Coins from './Home/Coins';
import RemainingTime from './Home/RemainingTime';
import SpinWheelCard from './Home/SpinWheelCard';
import AutoSlider from './Home/AutoSlider';
import Spacer from '../components/Spacer';
import { useGetAllOffersQuery, useGetFeaturedShopsQuery } from '../features/shops/shopApi';
import { FlatList, Animated } from 'react-native';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const useDynamicRefs = () => {
  const refs = useRef({});
  const getRef = key => {
    if (!refs.current[key]) refs.current[key] = React.createRef();
    return refs.current[key];
  };
  return getRef;
};

const HomeScreen = ({ navigation }) => {
  const referralCode = useSelector(state => state.user.pendingReferral);
  const savedAddress = useSelector(state => state.user.savedAddress);

  const refs = useDynamicRefs();
  const [translateY] = useState(new Animated.Value(0));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: offersData } = useGetAllOffersQuery();
  const offers = offersData?.data?.offers || [];

  const { refetch } = useGetFeaturedShopsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      refetch();
      await refs('featuredShopsRef')?.current?.refetch?.();
      await refs('shopListRef')?.current?.refetch?.();
      await refs('points')?.current?.refetch?.();
      await refs('redeem')?.current?.refetch?.();
    } catch (err) {
      console.log('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />,
    [isRefreshing]
  );

  const _translateY = translateY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
  });

  // Render everything above the shop list as header
  const ListHeader = () => (
    <>
      <HeaderHome />
      <Spacer height={10} />
      <View style={styles.scrollContainer}>
        <Coins ref={refs('points')} />
        <RemainingTime />
        <SpinWheelCard />
        {offers.length > 0 && <AutoSlider />}
      </View>
    </>
  );

  return (
    <AppLayout>
      <Animated.View
        style={[
          styles.backgroundContainer,
          { transform: [{ translateY: _translateY }] },
        ]}
      >
        <ImageBackground
          source={require('../../assets/home-bg-1.png')}
          imageStyle={{ opacity: 0.2 }}
          style={styles.imageBackground}
        />
      </Animated.View>

      <AnimatedFlatList
        data={[]} // ShopList handles its own data
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<ListHeader />}
        renderItem={null}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: translateY } } }],
          { useNativeDriver: true }
        )}
        ListFooterComponent={<View style={{ alignItems: 'center', width: '100%' }}>
          <ShopList ref={refs('shopListRef')} navigation={navigation} />
        </View>}
      />

    </AppLayout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 6,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  imageBackground: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});
