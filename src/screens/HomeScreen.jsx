import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import React, { use, useCallback, useMemo, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import HeaderHome from './Home/HeaderHome';
import SearchBar from './Home/SearchBar';
import Banner from './Home/Banner';
import ShopList from './Home/ShopList';
import { hp, wp } from '../utils/dimensions';
import AutoSlider from './Home/AutoSlider';
import { useSelector } from 'react-redux';
import Coins from './Home/Coins';
import QuickActions from './Home/QuickActions';
const useDynamicRefs = () => {
  const refs = useRef({});

  const getRef = key => {
    if (!refs.current[key]) {
      refs.current[key] = React.createRef();
    }
    return refs.current[key];
  };

  return getRef;
};
const HomeScreen = ({ navigation }) => {
  // console.log(navigation.getState());

  const user = useSelector(state => state.user.user);
  const refs = useDynamicRefs();
  const [isLoading, setLoading] = useState(false);

  const handleRefreshControl = useCallback(() => {
    const refsToFetch = ['points', 'redeem','shopListRef'];
    refsToFetch.forEach(refKey => {
      if (refs(refKey)?.current?.refetch) {
        refs(refKey)?.current?.refetch();
      }
    });
    const isLoading = refsToFetch.some(
      refKey => refs(refKey)?.current?.loading,
    );
    setLoading(isLoading);
  }, [isLoading]);

  const refreshControl = useMemo(() => {
    return (
      <RefreshControl refreshing={isLoading} onRefresh={handleRefreshControl} />
    );
  }, [isLoading, handleRefreshControl]);

  console.log(user);
  return (
    <ScrollView
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
    >
      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <HeaderHome />

        <View style={style.scrollContainer}>
          {/* <SearchBar /> */}
          {/* <Banner /> */}
          {/* <AutoSlider/> */}
          <Coins ref={refs('points')} />
          <QuickActions />
          <View style={{paddingHorizontal:6}}>

          <AutoSlider />
          </View>
          <ShopList navigation={navigation} ref={refs('shopListRef')} />
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default HomeScreen;

const style = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginTop: hp(14),
    paddingHorizontal: wp(0),
  },
});
