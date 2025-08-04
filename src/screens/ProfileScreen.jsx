import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/PageHeader';
import ProfileHeader from './Profile/ProfileHeader';
import Rewards from './Profile/Rewards';
import NotificationIcon from '../utils/icons/NotificationIcon';
import TabButton from './Profile/TabButton';
import PencilIcon from '../utils/icons/PencilIcon';
import WalletIcon from '../utils/icons/WalletIcon';
import ScannerIcon from '../utils/icons/ScannerIcon';
import ProfileEditIcon from '../utils/icons/ProfileEditIcon';
import LogOutIcon from '../utils/icons/LogOutIcon';
import { hp, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import LeftArrowIcon from '../utils/icons/LeftArrowIcon';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { clearUser } from '../features/auth/userSlice';
import { shopApi, useGetWalletSummaryQuery } from '../features/shops/shopApi';
import History from '../utils/icons/History';
// import LanguageIcon  from '../utils/icons/LanguageIcon ';
import { store } from '../store';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '../utils/icons/LanguageIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import VersionCheck from 'react-native-version-check';
import PageHeader from '../components/PageHeader';
import { LocatioIcon } from '../utils/icons/icons';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('');
  const [appVersion, setAppVersion] = useState('');

  const user = useSelector(state => state.user.user);
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
      console.log('Logout is working');
      await AsyncStorage.multiRemove(['token', 'user', 'wishlist']);
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
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <PageHeader lable={t('profile')}
        rightComponent={
          <TouchableOpacity style={styles.logOut} onPress={handleLogout}>
            <LogOutIcon />
          </TouchableOpacity>
        } />
      <SafeAreaView style={styles.container}>
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
          Icon={LocatioIcon}
          label={t('Address')}
          onPress={() =>
            navigation.navigate('Address', { isInitialSetup: false })
          }
        />
        {/* Version above tab bar */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version: {appVersion}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>

  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: '',
    paddingHorizontal: wp(4),
    position: 'relative',
    width: '100%',
    marginTop:hp(2)
  },
  topBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: RFValue(20),
    color: '#fff',
    textAlign: 'center',
  },

  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255, 0.13)',
    padding: wp(4),
    marginTop: hp(3),
    borderRadius: 20,
    gap: wp(4),
    borderWidth: 0.5,
    borderColor: '#FF0400',
  },
  heading2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp(3.5),
    color: '#FF0400',
  },
  versionWrapper: {
  alignSelf: 'center', // Only take the width needed
  borderTopWidth: 0.5,
  borderTopColor: 'rgba(255,255,255,1)',
  paddingTop: hp(2),
  marginTop: hp(2),
},
versionText: {
  color: '#ccc',
  fontSize: RFValue(12),
  fontFamily: 'Poppins-Regular',
  opacity: 0.3,
  textAlign: 'left',
  marginTop:hp(8)
},

});
