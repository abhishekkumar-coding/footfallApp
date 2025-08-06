// utils/locationHelper.js
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

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


const user = useSelector(state => state.user.user);
console.log("User Data from Redux-store: ", user)

// Detect and send location
export const detectAndSendLocation = async (updateUser, userData) => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    Toast.show({
      type: 'error',
      text1: 'Location permission denied', // i18n.t('locationPermissionDenied')
    });
    return;
  }

  Geolocation.getCurrentPosition(
    async ({ coords }) => {
      const { latitude, longitude } = coords;

      Toast.show({
        type: 'success',
        text1: 'Location detected', // i18n.t('locationDetected')
        text2: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`, // i18n.t('latLng', ...)
      });

      try {
        if (!userData?._id) return;
        const res = await updateUser({
          id: userData._id,
          body: { lat: latitude, lng: longitude },
        }).unwrap();
        console.log("✅ User location updated:", res);
      } catch (err) {
        console.log('❌ Failed to update user location:', err);
      }
    },
    (error) => {
      console.error('Location error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to detect location', // i18n.t('failedToDetectLocation')
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    }
  );
};
