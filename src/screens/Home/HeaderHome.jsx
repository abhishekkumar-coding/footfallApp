import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import NotificationIcon from '../../utils/icons/NotificationIcon';
import { wp, hp } from '../../utils/dimensions';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useGetNotificationsQuery } from '../../features/shops/shopApi';
import { useUpdateUserMutation } from '../../features/auth/authApi';

const HeaderHome = () => {
  const navigation = useNavigation();
  const notifications = useSelector(state => state.notification.notifications);
  const { data } = useGetNotificationsQuery();
  const user = useSelector(state => state.user.user);
  const badgeCount = data?.data?.length || 0;
  const [updateUser] = useUpdateUserMutation();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'User-Agent': 'FootfallApp' } }
      );
      const data = await res.json();
      const address = data.address;

      return {
        city: address?.city || address?.county || address?.town || address?.village || '',
        state: address?.state || '',
        country: address?.country || '',
        pincode: address?.postcode || '',
      };
    } catch (err) {
      console.error('Geocoding error:', err);
      return {};
    }
  };

  useEffect(() => {
    const getLocationAndUpdate = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;

          const addressDetails = await fetchAddressFromCoordinates(latitude, longitude);
          try {
            const res = await updateUser({
              id: user._id,
              body: {
                lat: latitude,
                lng: longitude,
                city: addressDetails.city,
                state: addressDetails.state,
                country: addressDetails.country,
                pincode: addressDetails.pincode,
              },
            }).unwrap();
            console.log('User updated with address:', res);
          } catch (error) {
            console.error('Error updating user:', error);
          }
        },
        error => {
          console.error('Location error:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getLocationAndUpdate();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen', { notifications })}>
        <View style={styles.iconContainer}>
          <NotificationIcon />
          {badgeCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: '#000337',
  },
  logoImage: {
    width: wp(30),
    height: hp(5),
  },
  iconContainer: {
    position: 'relative',
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
