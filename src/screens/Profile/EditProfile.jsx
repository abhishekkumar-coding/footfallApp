import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
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
import { Platform, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const EditProfile = () => {
  const { t } = useTranslation();
  const user = useSelector(state => state.user.user);

  if (!user) return null;

  const {
    _id: userId,
    name: userName,
    email: userEmail,
    phone: userPhone,
  } = user;
  console.log('Current user data:', user);

  const userLat = user?.location?.coordinates?.[0];
  const userLng = user?.location?.coordinates?.[1];

  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState(userPhone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lat, setLat] = useState(userLat || null);
  const [lng, setLng] = useState(userLng || null);
  const [isLocLoading, setIsLocLoading] = useState(false);

  console.log(`user lat : ${lat} and long : ${lng}`);

  //   const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();

  const handleSave = async () => {
    setIsSaving(true);

    if (lat == null && lng == null) {
      Toast.show({
        type: 'error',
        text1: t('locationRequired'),
        text2: t('pleaseProvideLocation'),
        visibilityTime: 2000,
      });
      setIsSaving(false);
      return;
    }

    try {
      const body = { name, email, phone, lat, lng };
      console.log('Updating user with:', body);
      const res = await updateUser({ id: userId, body }).unwrap();
      console.log('Update success:', res);
      dispatch(setUser(res.data));
      Toast.show({
        type: 'success',
        text1: t('profileUpdated'),
        visibilityTime: 2000,
      });

      navigation.goBack();
    } catch (error) {
      console.log('Update failed:', error);
      Toast.show({
        type: 'error',
        text1: t('updateFailed'),
        text2: error?.data?.message || t('somethingWentWrong'),
        visibilityTime: 3000,
      });
    } finally {
      setIsSaving(false);
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
      position => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <LinearGradient colors={['#000337', '#000000']} style={{ flex: 1 }}>
      <BackButton lable={t('editProfile')} back />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* <Text style={styles.heading}>Edit Profile</Text> */}
          <View style={{ paddingHorizontal: wp(5) }}>
            {/* <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.changePhoto}>Change Photo</Text>
                    </View> */}

            <CustomInput lable={t('name')} placeholder={name} onChangeText={setName} value={name} />
            <CustomInput lable={t('email')} placeholder={email} onChangeText={setEmail} value={email} />
            <CustomInput lable={t('phone')} placeholder={phone} onChangeText={setPhone} value={phone} />
            {/* <CustomInput lable="Password" placeholder={"Enter New Password"} onChangeText={setPassword} value={password}/> */}
            {/* <CustomInput lable="Address" placeholder={address} />
                    <CustomInput lable="Country" placeholder={country} />
                    <CustomInput lable="State" placeholder={state} />
                    <CustomInput lable="Pincode" placeholder={pincode} /> */}
            <TouchableOpacity
              style={styles.locanBtn}
              onPress={handleAutoDetect}
            >
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
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: RFValue(18),
    color: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: hp(10),
    // paddingTop: hp(6),
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: hp(3),
  },
  changePhoto: {
    color: '#3B63EF',
    marginTop: hp(1),
    fontSize: RFValue(14),
    fontFamily: 'Poppins-Medium',
  },
  saveButton: {
    backgroundColor: '#3B63EF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-SemiBold',
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
