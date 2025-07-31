import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './features/auth/userSlice';
import { View, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import { requestNotificationPermission, getAndStoreFcmToken, setupNotificationListeners } from './features/notificationHelper';
import Geolocation from 'react-native-geolocation-service';
import { useUpdateUserMutation } from './features/auth/authApi';
import Toast from 'react-native-toast-message'; // make sure you’ve imported this
import i18n from './i18n';
// import i18n from './utils/i18n'; // replace with your i18n path if different

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [updateUser] = useUpdateUserMutation();
  const [userData, setUserData] = useState(null); // local state to store user object

  useEffect(() => {
    let unsubscribeNotification = null;

    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userDataStr = await AsyncStorage.getItem('user');

        if (token && userDataStr) {
          const user = JSON.parse(userDataStr);
          setUserData(user); // store for later use
          dispatch(setUser(user));
        }

        await requestNotificationPermission();
        await getAndStoreFcmToken(dispatch);
        unsubscribeNotification = setupNotificationListeners();

        await detectAndSendLocation();
      } catch (e) {
        console.error('Failed to bootstrap app:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();

    return () => {
      if (unsubscribeNotification) {
        unsubscribeNotification();
      }
    };
  }, [dispatch]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const detectAndSendLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Toast.show({
        type: 'error',
        text1: i18n.t('locationPermissionDenied'),
      });
      return;
    }

    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        Toast.show({
          type: 'success',
          text1: i18n.t('locationDetected'),
          text2: i18n.t('latLng', {
            lat: latitude.toFixed(5),
            lng: longitude.toFixed(5),
          }),
        });
        // console.log("Looging Location : ", latitude, loading)

        try {
          if (!userData?._id) return;
          const res = await updateUser({
            id: userData._id,
            body: { lat: latitude, lng: longitude },
          }).unwrap();
          console.log("✅ User location auto updated:", res);
        } catch (err) {
          console.log('❌ Failed to update user auto location:', err);
        }
      },
      (error) => {
        console.error('Location error:', error);
        Toast.show({
          type: 'error',
          text1: i18n.t('failedToDetectLocation'),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return children;
};

export default AppInitializer;
