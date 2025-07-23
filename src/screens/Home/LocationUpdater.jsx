import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../features/auth/authApi';

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

const LocationUpdater = () => {
  const user = useSelector(state => state.user.user);
  const [updateUser] = useUpdateUserMutation();

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
                long: longitude,
                city: addressDetails.city,
                state: addressDetails.state,
                country: addressDetails.country,
                pincode: addressDetails.pincode,
              },
            }).unwrap();
            console.log('User location updated:', res);
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

    if (user?._id) getLocationAndUpdate();
  }, [user?._id]);

  return null; // No UI to render
};

export default LocationUpdater;
