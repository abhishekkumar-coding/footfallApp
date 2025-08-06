import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import ProfileHeader from './Profile/ProfileHeader';
import Rewards from './Profile/Rewards';
import TabButton from './Profile/TabButton';
import ScannerIcon from '../utils/icons/ScannerIcon';
import ProfileEditIcon from '../utils/icons/ProfileEditIcon';
import { hp, SCREEN_HEIGHT, wp } from '../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { clearUser } from '../features/auth/userSlice';
import { shopApi, useGetWalletSummaryQuery } from '../features/shops/shopApi';
import History from '../utils/icons/History';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '../utils/icons/LanguageIcon';
import VersionCheck from 'react-native-version-check';
import PageHeader from '../components/PageHeader';
import { LocatioIcon, SettingIcon } from '../utils/icons/icons';
import AppLayout from '../layout/AppLayout';
import Spacer from '../components/Spacer';
import { Colors } from '../utils/Colors';

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

 
  return (
    <AppLayout>
      <PageHeader lable={t('profile')}
        rightComponent={
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')} >
            <ProfileEditIcon color={Colors.splash}/>
            <Text style={styles.editText}>{t('edit')}</Text>
          </TouchableOpacity>
        } />
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHeader navigation={navigation} user={user} />
        <Spacer height={hp(2)} />
        <View style={styles.rewardsContainer}>
          <Rewards rewardPoints={rewards} title={t('total_rewards')} color={[Colors.secondary, Colors.quinary]}/>       
          <Rewards rewardPoints={rewards} title={t('cash_back')} color={[Colors.splash, Colors.splash_light]}/>       
        </View>
        
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
          Icon={LocatioIcon}
          label={t('Address')}
          onPress={() =>
            navigation.navigate('Address', { isInitialSetup: false })
          }
        />
        <TabButton
          Icon={SettingIcon}
          label={t('Settings')}
          onPress={() =>
            navigation.navigate('Settings', { isInitialSetup: false })
          }
        />
        {/* Version above tab bar */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version: {appVersion}</Text>
        </View>
      </ScrollView>
    </AppLayout>

  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
 
    paddingHorizontal: wp(4),
    position: 'relative',
    width: '100%'    
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
    color: '#fff',
    fontSize: RFValue(16, SCREEN_HEIGHT),
    fontFamily: 'Poppins-Regular',
    opacity: 0.3,
 
  
  },
  editButton: {
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    borderWidth: 1,
    borderColor: Colors.splash_light,
  },
  editText: {
    color: Colors.splash,
    fontSize: RFValue(14, SCREEN_HEIGHT),
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
  },
  versionContainer: {
    alignSelf: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
    paddingTop: hp(1),
    marginTop: hp(5),
    paddingHorizontal:10
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: wp(4),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(1),
  }
});