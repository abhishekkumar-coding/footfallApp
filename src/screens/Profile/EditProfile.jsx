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
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [lat, setLat] = useState(user?.location?.coordinates?.[1] || null);
  const [lng, setLng] = useState(user?.location?.coordinates?.[0] || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

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
        city: address?.city || address?.county || address?.town || address?.village || '',
        state: address?.state || '',
        country: address?.country || '',
        postcode: address?.postcode || '',
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
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
      async ({ coords }) => {
        setLat(coords.latitude);
        setLng(coords.longitude);
        // console.log("Fetched Coords: ", coords)
        await fetchAddressFromCoordinates(coords.latitude, coords.longitude);
        setIsLocLoading(false);

        Toast.show({
          type: 'success',
          text1: t('locationDetected'),
          text2: t('latLng', {
            lat: coords.latitude.toFixed(5),
            lng: coords.longitude.toFixed(5),
          }),
        });
      },
      error => {
        console.error('Geolocation error:', error);
        Toast.show({ type: 'error', text1: t('failedToDetectLocation') });
        setIsLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSave = async () => {
    if (!lat || !lng) {
      Toast.show({
        type: 'error',
        text1: t('locationRequired'),
        text2: t('pleaseProvideLocation'),
      });
      return;
    }

    setIsSaving(true);
    try {
      const body = {
        name,
        email,
        phone,
        lat,
        lng,
        address: addressDetails.address,
        city: addressDetails.city,
        state: addressDetails.state,
        pincode: addressDetails.postcode,
      };
      const res = await updateUser({ id: user._id, body }).unwrap();
      console.log(res)
      dispatch(setUser(res.data));
      Toast.show({ type: 'success', text1: t('profileUpdated') });
      navigation.goBack();
    } catch (error) {
      console.error('Profile update error:', error);
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
    if (lat && lng) {
      fetchAddressFromCoordinates(lat, lng);
    }
  }, [lat, lng]);

  if (isAddressLoading) {
    return (
      <LinearGradient colors={['#000337', '#000000']} style={styles.loaderScreen}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>

      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        <BackButton lable={t('editProfile')} back />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: wp(5) }}>
              <CustomInput lable={t('name')} value={name} onChangeText={setName} placeholder={t('name')} />
              <CustomInput lable={t('email')} value={email} onChangeText={setEmail} placeholder={t('email')} />
              <CustomInput lable={t('phone')} value={phone} onChangeText={setPhone} placeholder={t('phone')} />
              <CustomInput
                lable={t('address')}
                value={addressDetails.address}
                onChangeText={(text) => setAddressDetails(prev => ({ ...prev, address: text }))}
                placeholder={t('address')}
              />
              <CustomInput
                lable={t('city')}
                value={addressDetails.city}
                onChangeText={(text) => setAddressDetails(prev => ({ ...prev, city: text }))}
                placeholder={t('city')}
              />
              <CustomInput
                lable={t('state')}
                value={addressDetails.state}
                onChangeText={(text) => setAddressDetails(prev => ({ ...prev, state: text }))}
                placeholder={t('state')}
              />
              <CustomInput
                lable={t('country')}
                value={addressDetails.country}
                onChangeText={(text) => setAddressDetails(prev => ({ ...prev, country: text }))}
                placeholder={t('country')}
              />
              <CustomInput
                lable={t('pincode')}
                value={addressDetails.postcode}
                onChangeText={(text) => setAddressDetails(prev => ({ ...prev, postcode: text }))}
                placeholder={t('pincode')}
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
    </SafeAreaView>
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
