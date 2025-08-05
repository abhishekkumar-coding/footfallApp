import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import HeaderHome from './Home/HeaderHome';
import ShopList from './Home/ShopList';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import AutoSlider from './Home/AutoSlider';
import { useSelector } from 'react-redux';
import Coins from './Home/Coins';
import QuickActions from './Home/QuickActions';
import FeaturedShopsSection from './Home/FeaturedShopsSection';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLayout from '../layout/AppLayout';
import Spacer from '../components/Spacer';
import RemainingTime from './Home/RemainingTime';


const useDynamicRefs = () => {
  const refs = useRef({});
  const getRef = key => {
    if (!refs.current[key]) refs.current[key] = React.createRef();
    return refs.current[key];
  };
  return getRef;
};

const HomeScreen = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const refs = useDynamicRefs();
  const [isLoading, setLoading] = useState(false);
  const referralCode = useSelector(state => state.user.pendingReferral);
  const [translateY, setTranslateY] = useState(new Animated.Value(0));
  console.log("Extracted referral code {In Home screen} from REDUX: ", referralCode)


  const handleRefreshControl = useCallback(() => {
    const refsToFetch = ['points', 'redeem', 'shopListRef'];
    refsToFetch.forEach(refKey => refs(refKey)?.current?.refetch?.());
    const anyLoading = refsToFetch.some(refKey => refs(refKey)?.current?.loading);
    setLoading(anyLoading);
  }, []);


  if (referralCode) {
    console.log("Referral detected in HomeScreen, navigating to Signup...");
    navigation.navigate('Signup', { referralCode })
  }


  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={isLoading} onRefresh={handleRefreshControl} />
  ), [isLoading, handleRefreshControl]);
  const _translateY = translateY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],    
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  });
  return (

    <AppLayout>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, transform: [{ translateY: _translateY }] }}>
        <ImageBackground source={require('../../assets/home-bg-1.png')}
          imageStyle={{ opacity: 0.2,  }}
          style={styles.imageBackground} />
      </Animated.View>
      <Animated.ScrollView refreshControl={refreshControl} showsVerticalScrollIndicator={false}
        scrollEventThrottle={5}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: translateY } } }], { useNativeDriver: true })}
      >
        <HeaderHome />
        <Spacer height={10} />
        <View style={styles.scrollContainer}>
          <Coins ref={refs('points')} />
          <RemainingTime />
          {/* <QuickActions /> */}
          <View style={{ paddingHorizontal: 6 }}>
            <AutoSlider />
            <FeaturedShopsSection />
          </View>
          <ShopList navigation={navigation} ref={refs('shopListRef')} />
        </View>
      </Animated.ScrollView>
    </AppLayout>


  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: wp(0),
  },
  imageBackground: {
    resizeMode: 'cover',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  }
});
