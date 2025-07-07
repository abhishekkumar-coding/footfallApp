import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import HeaderHome from './Home/HeaderHome';
import ShopList from './Home/ShopList';
import { hp, wp } from '../utils/dimensions';
import AutoSlider from './Home/AutoSlider';
import { useSelector } from 'react-redux';
import Coins from './Home/Coins';
import QuickActions from './Home/QuickActions';

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

  const handleRefreshControl = useCallback(() => {
    const refsToFetch = ['points', 'redeem', 'shopListRef'];
    refsToFetch.forEach(refKey => refs(refKey)?.current?.refetch?.());
    const anyLoading = refsToFetch.some(refKey => refs(refKey)?.current?.loading);
    setLoading(anyLoading);
  }, []);

  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={isLoading} onRefresh={handleRefreshControl} />
  ), [isLoading, handleRefreshControl]);

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Fixed header outside ScrollView */}
      <HeaderHome />

      <ScrollView
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50, paddingTop: hp(14) }} // ⬅️ Add padding for header
      >
        <View style={styles.scrollContainer}>
          <Coins ref={refs('points')} />
          <QuickActions />
          <View style={{ paddingHorizontal: 6 }}>
            <AutoSlider />
          </View>
          <ShopList navigation={navigation} ref={refs('shopListRef')} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: wp(0),
  },
});
