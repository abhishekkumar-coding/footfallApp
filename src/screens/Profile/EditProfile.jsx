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
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import { setUser } from '../../features/auth/userSlice';
import { useUpdateUserMutation } from '../../features/auth/authApi';
import { useDeleteFileMutation, useUploadFileMutation } from '../../features/shops/shopApi';
import { UploadIcon } from '../../utils/icons/icons';
import AppLayout from '../../layout/AppLayout';
import PageHeader from '../../components/PageHeader';
import AppButton from '../../components/AppButton';
import Spacer from '../../components/Spacer';
import { Fonts } from '../../utils/typography';
import { Colors } from '../../utils/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';


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

const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    const androidVersion = parseInt(DeviceInfo.getSystemVersion(), 10);

    if (androidVersion >= 13) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true; // iOS handled by image picker
};

const EditProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);
  const userPhoto = useSelector(state => state.user.user.photo || '');
  console.log("User data: ", user)

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
    console.log("[handleAutoDetect] Start detecting location...");
    setIsLocLoading(true);

    const hasPermission = await requestLocationPermission();
    console.log("[handleAutoDetect] Permission granted:", hasPermission);

    if (!hasPermission) {
      Toast.show({ type: 'error', text1: t('locationPermissionDenied') });
      setIsLocLoading(false);
      console.log("[handleAutoDetect] Permission denied. Exiting.");
      return;
    }

    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        console.log("[handleAutoDetect] Coordinates received:", coords);
        setLat(coords.latitude);
        setLng(coords.longitude);

        try {
          await fetchAddressFromCoordinates(coords.latitude, coords.longitude);
          console.log("[handleAutoDetect] Address fetched successfully");
        } catch (err) {
          console.error("[handleAutoDetect] Error fetching address:", err);
        }

        setIsLocLoading(false);

        Toast.show({
          type: 'success',
          text1: t('locationDetected'),
          text2: `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`,
        });
      },
      error => {
        console.error("[handleAutoDetect] Error detecting location:", error);
        Toast.show({ type: 'error', text1: t('failedToDetectLocation') });
        setIsLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleImagePick = async () => {
    console.log("[handleImagePick] Opening gallery...");
    const hasPermission = await requestGalleryPermission();
    console.log("[handleImagePick] Gallery permission:", hasPermission);

    if (!hasPermission) {
      Toast.show({ type: 'error', text1: 'Permission denied' });
      console.log("[handleImagePick] Permission denied. Exiting.");
      return;
    }

    launchImageLibrary({ mediaType: 'photo' }, async response => {
      console.log("[handleImagePick] Gallery response:", response);

      const asset = response?.assets?.[0];
      if (!asset) {
        console.log("[handleImagePick] No asset selected.");
        return;
      }

      try {
        if (profileImage) {
          console.log("[handleImagePick] Deleting old profile image...");
          await handleDeleteImage();
        }

        const file = {
          uri: asset.uri,
          name: asset.fileName || 'profile.jpg',
          type: asset.type || 'image/jpeg',
        };
        console.log("[handleImagePick] File prepared for upload:", file);

        setProfileImage(asset.uri);

        const formData = new FormData();
        formData.append('file', file);

        console.log("[handleImagePick] Uploading image...");
        const res = await uploadFile(formData).unwrap();
        console.log("[handleImagePick] Image upload response:", res);

        setImage(res.data);
      } catch (error) {
        console.error("[handleImagePick] Upload failed:", error);
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: error?.data?.message || 'Error uploading file',
        });
      }
    });
  };

  const handleDeleteImage = async () => {
    console.log("[handleDeleteImage] Attempting to delete image:", profileImage);

    try {
      const res = await deleteFile({
        fileUrl: profileImage,
        id: user._id,
        model: 'User',
        fieldPath: 'image',
      }).unwrap();

      console.log("[handleDeleteImage] Delete response:", res);
      setProfileImage('');
      return res;
    } catch (error) {
      console.error("[handleDeleteImage] Delete failed:", error);
    }
  };

  const handleSave = async () => {
    console.log("[handleSave] Saving user profile...");
    if (!lat || !lng) {
      console.warn("[handleSave] Missing location:", { lat, lng });
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

      console.log("[handleSave] Payload to update user:", payload);
      const res = await updateUser({ id: user._id, body: payload }).unwrap();

      console.log("[handleSave] User update response:", res);
      dispatch(setUser(res.data));

      Toast.show({ type: 'success', text1: t('profileUpdated') });
      navigation.goBack();
    } catch (error) {
      console.error("[handleSave] Update failed:", error);
      Toast.show({
        type: 'error',
        text1: t('updateFailed'),
        text2: error?.data?.message || t('somethingWentWrong'),
      });
    } finally {
      console.log("[handleSave] Done saving.");
      setIsSaving(false);
    }
  };


  useEffect(() => {
    if (lat && lng) fetchAddressFromCoordinates(lat, lng);
  }, [lat, lng]);

  if (isAddressLoading) {
    return (
      <AppLayout >
        <View style={styles.loaderScreen}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader lable={t('editProfile')} back />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
        bottomOffset={25}
        automaticallyAdjustKeyboardInsets={true}
        automaticallyAdjustContentInsets={true}
        contentContainerStyle={{ paddingBottom: 20 }}
        shouldRasterizeIOS={false}
      >
        <View style={styles.imageWrapper}>
          {profileImage || userPhoto ? (
            <>
              <Image source={{ uri: profileImage || image || userPhoto }} style={styles.profileImage} />
              <TouchableOpacity onPress={handleImagePick} style={styles.uploadIcon} activeOpacity={0.9}>
                <MaterialIcons name="camera-alt" size={20} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={handleImagePick} style={styles.fallbackAvatar} activeOpacity={0.9}>
              <Text style={styles.fallbackInitial}>{name ? name[0].toUpperCase() : '?'}</Text>
              <TouchableOpacity onPress={handleImagePick} style={styles.uploadIcon}>
                <MaterialIcons name="camera-alt" size={20} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>

          )}
        </View>
        <View style={{ paddingHorizontal: wp(5) }}>
          <CustomInput lable={t('name')} value={name} onChangeText={setName} placeholder={t('name')} />
          <CustomInput lable={t('email')} value={email} onChangeText={setEmail} placeholder={t('email')} editable={false} selectTextOnFocus={false} caretHidden={true} />
          <CustomInput lable={t('phone')} value={phone} onChangeText={setPhone} placeholder={t('phone')} />
          <Spacer height={hp(2)} />
          <View style={styles.addressContainer}>
            <TouchableOpacity onPress={handleAutoDetect} style={styles.autoDetectBtn}>
              <Text style={styles.addressLable}>
                {isLocLoading ? (
                  <ActivityIndicator size="small" color={Colors.activeTabBar} />
                ) : t('autoDetectLocation')}
              </Text>
            </TouchableOpacity>

            <CustomInput
              lable={t('address')}
              value={addressDetails.address}
              editable={false}
              selectTextOnFocus={false}
              caretHidden={true}
            />
          </View>

          <CustomInput lable={t('city')} value={addressDetails.city} editable={false} selectTextOnFocus={false} caretHidden={true} />
          <CustomInput lable={t('state')} value={addressDetails.state} editable={false} selectTextOnFocus={false} caretHidden={true} />
          <CustomInput lable={t('country')} value={addressDetails.country} editable={false} selectTextOnFocus={false} caretHidden={true} />
          <CustomInput lable={t('pincode')} value={addressDetails.postcode} editable={false} selectTextOnFocus={false} caretHidden={true} />

          <Spacer height={hp(4)} />
          <AppButton title={isSaving ? t('saving') : t('saveChanges')} isLoading={isSaving} onPress={handleSave} />
        </View>
      </KeyboardAwareScrollView>
    </AppLayout>
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
    backgroundColor: "#6300d3",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fallbackInitial: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.quaternary,
    padding: 4,
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
  addressContainer: {

  },
  autoDetectBtn: {
    position: 'absolute',
    right: 0,
    zIndex: 99

  },
  addressLable: {
    fontSize: RFValue(14, SCREEN_HEIGHT),
    fontFamily: Fonts.primary_SemiBold,
    color: Colors.activeTabBar,
  }
});
