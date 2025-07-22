import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { hp, wp } from '../../utils/dimensions';
import { RFValue } from 'react-native-responsive-fontsize';
import { useUpdateUserMutation } from '../../features/auth/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setUser } from '../../features/auth/userSlice';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import { useTranslation } from 'react-i18next';

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const EditProfile = () => {
  const { t } = useTranslation();
  const user = useSelector(state => state.user.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [updateUser] = useUpdateUserMutation();

  if (!user) return null;

  const {
    _id: userId,
    name: userName,
    email: userEmail,
    phone: userPhone,
    location,
  } = user;

  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState(userPhone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const userLng = location?.coordinates?.[0];
  const userLat = location?.coordinates?.[1];

  const [lat, setLat] = useState(userLat || null);
  const [lng, setLng] = useState(userLng || null);

  const [addressDetails, setAddressDetails] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
  });

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    setIsAddressLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'User-Agent': 'FootfallApp' } }
      );
      const data = await res.json();
      const { address, display_name } = data;

      setAddressDetails({
        address: display_name || '',
        city: address?.county || address?.city || address?.town || address?.village || '',
        state: address?.state || '',
        country: address?.country || '',
        postcode: address?.postcode || '',
      });
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    setIsLocLoading(true);
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      Toast.show({ type: 'error', text1: t('locationPermissionDenied') });
      setIsLocLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
        await fetchAddressFromCoordinates(latitude, longitude);
        setIsLocLoading(false);

        Toast.show({
          type: 'success',
          text1: t('locationDetected'),
          text2: t('latLng', {
            lat: latitude.toFixed(5),
            lng: longitude.toFixed(5),
          }),
        });
      },
      error => {
        console.error('Location error:', error);
        Toast.show({ type: 'error', text1: t('failedToDetectLocation') });
        setIsLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSave = async () => {
    if (lat == null || lng == null) {
      Toast.show({
        type: 'error',
        text1: t('locationRequired'),
        text2: t('pleaseProvideLocation'),
      });
      return;
    }

    setIsSaving(true);
    try {
      const body = { name, email, phone, lat, lng };
      const res = await updateUser({ id: userId, body }).unwrap();

      dispatch(setUser(res.data));
      Toast.show({ type: 'success', text1: t('profileUpdated') });
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error);
      Toast.show({
        type: 'error',
        text1: t('updateFailed'),
        text2: error?.data?.message || t('somethingWentWrong'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (lat && lng) fetchAddressFromCoordinates(lat, lng);
  }, [lat, lng]);

  if (isAddressLoading) {
    return (
      <LinearGradient colors={['#000337', '#000000']} style={styles.loaderScreen}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <BackButton lable={t('editProfile')} back />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: wp(5) }}>
            <CustomInput lable={t('name')} placeholder={t('name')} onChangeText={setName} value={name} />
            <CustomInput lable={t('email')} placeholder={t('email')} onChangeText={setEmail} value={email} />
            <CustomInput lable={t('phone')} placeholder={t('phone')} onChangeText={setPhone} value={phone} />

            <CustomInput
              lable={t('address')}
              placeholder={t('address')}
              onChangeText={(text) => setAddressDetails(prev => ({ ...prev, address: text }))}
              value={addressDetails.address}
            />
            <CustomInput
              lable={t('city')}
              placeholder={t('city')}
              onChangeText={(text) => setAddressDetails(prev => ({ ...prev, city: text }))}
              value={addressDetails.city}
            />
            <CustomInput
              lable={t('state')}
              placeholder={t('state')}
              onChangeText={(text) => setAddressDetails(prev => ({ ...prev, state: text }))}
              value={addressDetails.state}
            />
            <CustomInput
              lable={t('pincode')}
              placeholder={t('pincode')}
              onChangeText={(text) => setAddressDetails(prev => ({ ...prev, postcode: text }))}
              value={addressDetails.postcode}
            />

            <TouchableOpacity style={styles.locanBtn} onPress={handleAutoDetect}>
              {isLocLoading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <Text style={styles.locanBtnText}>{t('autoDetectLocation')}</Text>
              )}
            </TouchableOpacity>

            <CustomButton
              title={isSaving ? t('saving') : t('saveChanges')}
              disabled={isSaving}
              onPress={handleSave}
            />
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {},
  scrollContainer: {
    paddingBottom: hp(10),
  },
  locanBtn: {
    backgroundColor: '#3B63EF',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  locanBtnText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Medium',
  },
  loaderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
