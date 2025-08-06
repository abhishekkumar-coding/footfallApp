import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import { launchImageLibrary } from 'react-native-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { hp, wp } from '../../utils/dimensions';
import { setUser } from '../../features/auth/userSlice';
import { useUpdateUserMutation } from '../../features/auth/authApi';
import { useDeleteFileMutation, useUploadFileMutation } from '../../features/shops/shopApi';
import { UploadIcon } from '../../utils/icons/icons';

// import BackButton from '../../components/PageHeader';
// import CustomButton from '../../components/CustomButton';
// import CustomInput from '../../components/CustomInput';
// import { wp, hp } from '../../utils/dimensions';
// import { setUser } from '../../features/auth/userSlice';
// import { useUpdateUserMutation } from '../../features/auth/authApi';
// import { useUploadFileMutation, useDeleteFileMutation } from '../../features/shops/shopApi';
// import { UploadIcon } from '../../utils/icons/icons';

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    const permission = Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const EditProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);

  const [updateUser] = useUpdateUserMutation();
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.image || '');
  const [image, setImage] = useState(null);

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
      console.error('Reverse geocoding failed:', error);
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
        await fetchAddressFromCoordinates(coords.latitude, coords.longitude);
        setIsLocLoading(false);

        Toast.show({
          type: 'success',
          text1: t('locationDetected'),
          text2: `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`,
        });
      },
      error => {
        console.error(error);
        Toast.show({ type: 'error', text1: t('failedToDetectLocation') });
        setIsLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleImagePick = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Toast.show({ type: 'error', text1: 'Permission denied' });
      return;
    }

    launchImageLibrary({ mediaType: 'photo' }, async response => {
      const asset = response?.assets?.[0];
      if (!asset) return;

      try {
        if (profileImage) await handleDeleteImage();

        const file = {
          uri: asset.uri,
          name: asset.fileName || 'profile.jpg',
          type: asset.type || 'image/jpeg',
        };
        setProfileImage(asset.uri);

        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadFile(formData).unwrap();
        setImage(res.data);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: error?.data?.message || 'Error uploading file',
        });
      }
    });
  };


  const handleDeleteImage = async () => {
    try {
      const res = await deleteFile({
        fileUrl: profileImage,
        id: user._id,
        model: 'User',
        fieldPath: 'image',
      }).unwrap();

      setProfileImage('');
      // Toast.show({ type: 'success', text1: 'Image deleted successfully' });
      return res;
    } catch (error) {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Delete Failed',
      //   text2: error?.data?.message || 'Error deleting image',
      // });
    }
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
      const payload = {
        image,
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

      const res = await updateUser({ id: user._id, body: payload }).unwrap();
      dispatch(setUser(res.data));
      Toast.show({ type: 'success', text1: t('profileUpdated') });
      navigation.goBack();
    } catch (error) {
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
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
        <BackButton label={t('editProfile')} back />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.imageWrapper}>
            {profileImage ? (
              <>
                <Image source={{ uri: profileImage || image }} style={styles.profileImage} />
                <TouchableOpacity onPress={handleImagePick} style={styles.uploadIcon} activeOpacity={0.7}>
                  <View pointerEvents="box-none">
                    <UploadIcon />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleImagePick} style={styles.fallbackAvatar}>
                <Text style={styles.fallbackInitial}>{name ? name[0].toUpperCase() : '?'}</Text>
                <View onPress={handleImagePick} style={styles.uploadIconOverlay}><UploadIcon /></View>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ paddingHorizontal: wp(5) }}>
            <CustomInput lable={t('name')} value={name} onChangeText={setName} placeholder={t('name')} />
            <CustomInput lable={t('email')} value={email} onChangeText={setEmail} placeholder={t('email')} />
            <CustomInput lable={t('phone')} value={phone} onChangeText={setPhone} placeholder={t('phone')} />
            <CustomInput lable={t('address')} value={addressDetails.address} onChangeText={(text) => setAddressDetails(prev => ({ ...prev, address: text }))} />
            <CustomInput lable={t('city')} value={addressDetails.city} onChangeText={(text) => setAddressDetails(prev => ({ ...prev, city: text }))} />
            <CustomInput lable={t('state')} value={addressDetails.state} onChangeText={(text) => setAddressDetails(prev => ({ ...prev, state: text }))} />
            <CustomInput lable={t('country')} value={addressDetails.country} onChangeText={(text) => setAddressDetails(prev => ({ ...prev, country: text }))} />
            <CustomInput lable={t('pincode')} value={addressDetails.postcode} onChangeText={(text) => setAddressDetails(prev => ({ ...prev, postcode: text }))} />

            <TouchableOpacity style={styles.locanBtn} onPress={handleAutoDetect}>
              {isLocLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.locanBtnText}>{t('autoDetectLocation')}</Text>}
            </TouchableOpacity>

            <CustomButton title={isSaving ? t('saving') : t('saveChanges')} disabled={isSaving} onPress={handleSave} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: hp(10),
  },
  loaderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    alignSelf: 'center',
    marginVertical: 16,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fallbackAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fallbackInitial: {
    fontSize: 36,
    color: '#555',
    fontWeight: 'bold',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(117, 255, 143, 0.9)',
    padding: 5,
    borderRadius: 50,
  },
  uploadIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(117, 255, 143, 0.9)',
    padding: 5,
    borderRadius: 50,
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
});
