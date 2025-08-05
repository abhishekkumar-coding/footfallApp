import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ProfileHeader from './Profile/ProfileHeader';
import Rewards from './Profile/Rewards';
import TabButton from './Profile/TabButton';
import ProfileEditIcon from '../utils/icons/ProfileEditIcon';
import ScannerIcon from '../utils/icons/ScannerIcon';
import History from '../utils/icons/History';
import LanguageIcon from '../utils/icons/LanguageIcon';
import LogOutIcon from '../utils/icons/LogOutIcon';
import { Address } from '../utils/icons/icons';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { clearUser } from '../features/auth/userSlice';
import { shopApi, useGetWalletSummaryQuery } from '../features/shops/shopApi';
import { useTranslation } from 'react-i18next';
import VersionCheck from 'react-native-version-check';
import PageHeader from '../components/BackButton'; // PageHeader must be a header component

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [appVersion, setAppVersion] = useState('');
  const user = useSelector(state => state.user.user);
  console.log("Saved User in Local: ", user )
  const { data: userPoints } = useGetWalletSummaryQuery();
  const rewards = userPoints?.data?.rewards?.points ?? 0;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVersion = async () => {
      const version = VersionCheck.getCurrentVersion();
      const build = VersionCheck.getCurrentBuildNumber();
      setAppVersion(`${version} (${build})`);
    };
    fetchVersion();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user', 'wishlist', 'selectedAddress']);
      dispatch(clearUser());
      dispatch(shopApi.util.resetApiState());

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <LinearGradient colors={['#000337', '#000000']} style={styles.gradient}>
      <View style={styles.pageWrapper}>
        {/* Fixed header */}
        <PageHeader
          lable={t('profile')}
          rightComponent={
            <TouchableOpacity style={styles.logOut} onPress={handleLogout}>
              <LogOutIcon />
            </TouchableOpacity>
          }
        />

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader navigation={navigation} user={user} />
          <Rewards rewardPoints={rewards} />

          <TabButton
            Icon={ProfileEditIcon}
            label={t('update_profile')}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <TabButton
            Icon={ScannerIcon}
            label={t('referral_earn')}
            onPress={() => navigation.navigate('Referral')}
          />
          <TabButton
            Icon={History}
            label={t('redeem_history')}
            onPress={() => navigation.navigate('RedeemHistoryScreen')}
          />
          <TabButton
            Icon={LanguageIcon}
            label={t('change_language')}
            onPress={() =>
              navigation.navigate('Language', { isInitialSetup: false })
            }
          />
          <TabButton
            Icon={Address}
            label={t('Address')}
            onPress={() =>
              navigation.navigate('Address', { isInitialSetup: false })
            }
          />

          {/* App version at the bottom */}
          <View style={styles.versionWrapper}>
            <Text style={styles.versionText}>Version: {appVersion}</Text>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  pageWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop:10
  },
  scrollContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  logOut: {
    padding: 8,
  },
  versionWrapper: {
    alignSelf: 'center', // Only take the width needed
    borderTopWidth: 0.5,
    paddingTop: hp(0),
    marginTop: hp(0),
  },
  versionText: {
    color: '#fff',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
    opacity: 0.3,
    textAlign: 'left',
    marginBottom:hp(4),
    marginTop:hp(2)
  },

});