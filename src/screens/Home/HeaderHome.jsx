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
import { wp, hp, SCREEN_HEIGHT } from '../../utils/dimensions';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useGetNotificationsQuery } from '../../features/shops/shopApi';
import { useUpdateUserMutation } from '../../features/auth/authApi';
import Toast from 'react-native-toast-message';
import { setUser } from '../../features/auth/userSlice';
import { RFValue } from 'react-native-responsive-fontsize';
import { LocatioIcon } from '../../utils/icons/icons';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { Fonts } from '../../utils/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const HeaderHome = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const notifications = useSelector(state => state.notification.notifications);
  const { data } = useGetNotificationsQuery();
  console.log("Notificatios: ", data)
  const user = useSelector(state => state.user.user);
  const badgeCount = data?.data?.length || 0;
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch()
  const [fullAddress, setFullAddress] = useState('');
  const [loadingCity, setLoadingCity] = useState(true);
  const savedAddress = useSelector((state) => state.user.savedAddress);

  let hasAskedForPermission = false;

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('iOS Location Permission Status:', status);
      return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
    }

    if (hasAskedForPermission) {
      return false;
    }

    hasAskedForPermission = true;

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
        fullAddress: data.display_name || '',
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
      try {
        const saved = await AsyncStorage.getItem('selectedAddress');
        const parsedSaved = saved ? JSON.parse(saved) : null;


        // if (savedAddress?.address) {
        //   console.log("Saved Address in Redux Storage: ", savedAddress)
        //   setFullAddress(savedAddress.address);
        //   setLoadingCity(false);
        //   return;
        // }


        // if (parsedSaved?.address) {
        //   console.log("Saved Address in AsyncStorage: ", parsedSaved)
        //   setFullAddress(parsedSaved.address);
        //   setLoadingCity(false);
        //   return;
        // }

        const hasPermission = await requestLocationPermission();
        if (!hasPermission) throw new Error('Location permission denied');

        Geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;

            const addressDetails = await fetchAddressFromCoordinates(latitude, longitude);
            if (addressDetails.fullAddress) {
              setFullAddress(addressDetails.fullAddress);
              console.log("Fetched Address fromAPI: ", addressDetails.fullAddress)
              // ✅ Save to AsyncStorage
              await AsyncStorage.setItem('selectedAddress', JSON.stringify(addressDetails));
            } else {
              const defaultAddress = "India Gate, Shahjahan Road, नई दिल्ली, India";
              setFullAddress(defaultAddress);
              await AsyncStorage.setItem('selectedAddress', JSON.stringify({ fullAddress: defaultAddress }));
            }

            setLoadingCity(false);

            // ✅ Update Redux store
            try {
              const res = await updateUser({
                id: user._id,
                body: {
                  lat: latitude,
                  lng: longitude,
                },
              }).unwrap();
              dispatch(setUser(res.data));
            } catch (error) {
              console.error('Error updating user:', error);
              // Toast.show({
              //   type: 'error',
              //   text1: 'Update Failed',
              //   text2: 'Unable to update your location.',
              // });
            }
          },
          error => {
            console.error('Location error:', error);
            const fallback = "India Gate, Shahjahan Road, नई दिल्ली, India";
            setFullAddress(fallback);
            AsyncStorage.setItem('selectedAddress', JSON.stringify({ fullAddress: fallback }));
            setLoadingCity(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.error('Fallback error:', err);
        const fallback = "India Gate, Shahjahan Road, नई दिल्ली, India";
        setFullAddress(fallback);
        AsyncStorage.setItem('selectedAddress', JSON.stringify({ fullAddress: fallback }));
        setLoadingCity(false);
      }
    };

    getLocationAndUpdate();
  }, [isFocused]);





  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={{ flexDirection: "row", justifyContent: "", gap: 5, marginLeft: 0, }}>
          <MaterialIcons name="location-on" size={20} color="white" style={{ marginTop: 2 }} />
          <Text   style={styles.logoText}>{loadingCity ? '..........' : fullAddress || 'Unknown'}</Text>
        </View>
      </View>

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
    </View>
  );
};

export default HeaderHome;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  logoImage: {
    aspectRatio: 428 / 116,
    height: hp(3),
  },
  logoContainer: {
    flex: 1
  },
  logoText: {
    fontSize: RFValue(11, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_Regular,
    color: '#fff',
    textAlign: 'left',
    letterSpacing: 1,
    paddingRight: 20
  },
  iconContainer: {
    position: 'relative',
    padding: 5,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
