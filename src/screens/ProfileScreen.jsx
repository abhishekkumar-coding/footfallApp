import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';
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

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('');

  const user = useSelector(state => state.user.user);
  const { data: userPoints } = useGetWalletSummaryQuery();
  const rewards = userPoints?.data?.rewards?.points ?? 0;

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      console.log('Logout is working');
      await AsyncStorage.multiRemove(['token', 'user']);
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
    <>
      <BackButton lable={'Profile'} rightComponent={<TouchableOpacity style={styles.logOut} onPress={handleLogout}>
          <LogOutIcon />
        </TouchableOpacity>}/>
      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        
        <SafeAreaView style={styles.container}>
          <ProfileHeader navigation={navigation} user={user} />
          <Rewards rewardPoints={rewards} />
          <TabButton
            Icon={ProfileEditIcon}
            label="Update Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <TabButton
            Icon={ScannerIcon}
            label="Referral & Earn"
            onPress={() => navigation.navigate('Referral')}
          />
          <TabButton
            Icon={NotificationIcon}
            label="Notifications"
            onPress={() => setActiveTab('Notifications')}
          />

          {/* <TabButton
            Icon={WalletIcon}
            label="Wallet"
            onPress={() => setActiveTab('Notifications')}
          /> */}
          <TabButton
            Icon={History}
            label="Redeem History"
            onPress={() => navigation.navigate('RedeemHistoryScreen')}
          />
          {/* <TouchableOpacity >
                <View style={styles.container2}>
                    <Text style={styles.heading2}>Log out</Text>
                    <LogOutIcon />
                </View>
            </TouchableOpacity> */}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    alignItems: 'flex-start',
    justifyContent: '',
    paddingHorizontal: wp(4),
    position: 'relative',
    width: '100%',
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
});
