
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, SCREEN_HEIGHT, wp } from '../../utils/dimensions';
import ShopQRCode from './ShopQRCode';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  useGetShopOffersByIdQuery,
  useGetShopByScanMutation,
  useGetTotalPointsByVendorQuery,
  useGetShopByIdQuery,
} from '../../features/shops/shopApi';
import { useDispatch, useSelector } from 'react-redux';
import { triggerWalletRefresh } from '../../features/auth/walletSlice';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../components/PageHeader';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AppLayout from '../../layout/AppLayout';
import { Fonts } from '../../utils/typography';
import { Colors } from '../../utils/Colors';

// let hasAskedForPermission = false;

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    console.log('iOS Location Permission Status:', status);
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  }

  // if (hasAskedForPermission) {
  //   return false;
  // }

  // hasAskedForPermission = true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};



const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth’s radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// const handleManualScan = async () => {
//   const hasPermission = await requestLocationPermission();
//   if (!hasPermission) {
//     Toast.show({ type: 'error', text1: t('location_denied') });
//     return;
//   }

//   setIsLoadingShop(true);

//   Geolocation.getCurrentPosition(
//     async position => {
//       const userLat = position.coords.latitude;
//       const userLng = position.coords.longitude;

//       const shopLat = shop?.latitude;
//       const shopLng = shop?.longitude;

//       if (!shopLat || !shopLng) {
//         Toast.show({
//           type: 'error',
//           text1: 'Shop location not available',
//         });
//         setIsLoadingShop(false);
//         return;
//       }

//       const distance = getDistanceInMeters(userLat, userLng, shopLat, shopLng);
//       console.log(`📏 Distance: ${distance} meters`);

//       // Show toast if user is too far
//       if (distance > 200) {
//         Toast.show({
//           type: 'error',
//           text1: 'Too far from the shop',
//           text2: `Distance: ${Math.floor(distance)}m\nYour Location: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}\nShop Location: ${shopLat.toFixed(4)}, ${shopLng.toFixed(4)}`
//         });
//         setIsLoadingShop(false);
//         return;
//       }

//       try {
//         const result = await scanShop({
//           shopId: _id,
//           latitude: userLat,
//           longitude: userLng,
//         }).unwrap();

//         if (result?.success) {
//           Toast.show({
//             type: 'success',
//             text1: t('scanSuccessful'),
//           });

//           if (result.data?.scanRewardType === 'percentage') {
//             navigation.navigate('CashbackScreen', {
//               shopId: _id,
//               returnPercent: result.data?.rewardPoints,
//             });
//           } else {
//             navigation.goBack();
//           }
//         } else {
//           Toast.show({ type: 'error', text1: t('scan_failed_try') });
//         }
//       } catch (err) {
//         Toast.show({ type: 'error', text1: err?.data?.message || 'Error' });
//         console.log('❌ Scan error:', err);
//       } finally {
//         setIsLoadingShop(false);
//       }
//     },
//     error => {
//       Toast.show({
//         type: 'error',
//         text1: t('locationError'),
//         text2: error.message,
//       });
//       setIsLoadingShop(false);
//     },
//     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
//   );
// };

const ShopDetails = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id } = route.params

  const [sortBy, setSortBy] = useState('Latest');
  const dispatch = useDispatch();
  const [isLoadingShop, setIsLoadingShop] = useState(false);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [showScanError, setShowScanError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [vendorId, setVendorId] = useState(null);
  const [redeemTrigger, setRedeemTrigger] = useState(0);
  const [imageError, setImageError] = useState(false);

  const { data: shopData, isLoading: isShopLoading, error: shopError } = useGetShopByIdQuery(id);

  const shop = shopData?.data;
  // console.log("ShopDetails  Data: ", data)


  const {
    data,
    isLoading: isLoadingVendor,
    error,
  } = useGetTotalPointsByVendorQuery(
    { vendorId, redeemTrigger },
    { skip: !vendorId },
  );
  console.log("Vendor Data: ", data)
  const [scanShop] = useGetShopByScanMutation();

  const userPoints = useSelector(state => state.user.user)
  console.log("User points: ", userPoints)


  // console.log('Shop Data : ', shop.cover);
  const {
    contact,
    _id,
    category,
    name,
    startTime,
    endTime,
    cover,
    logo,
    address,
    city,
    state,
    pinCode,
  } = shop || {};
  const owner = shop?.owner?._id

  console.log('Shop Details', shop);

  useEffect(() => {
    if (data) {
      console.log('Fetched vendor points:', data);

      Toast.show({
        type: 'success',
        text1: t('scanSuccessful'),
      });

      setTimeout(() => {
        navigation.navigate('RedeemSummaryScreen', {
          vendorDetails: data.data,
        });
      }, 1000);

    } else if (error) {
      const message = error?.data?.message || 'Something went wrong';

      Toast.show({
        type: 'error',
        text1: t('scan_failed'),
        text2: message,
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  }, [data, error, navigation, t]);

  const handleRedeem = ownerId => {
    const points = userPoints?.rewards?.points || 0;

    if (points < 100) {
      Toast.show({
        type: 'error',
        text1: 'Not enough points',
        text2: 'You need at least 100 points to redeem.',
      });
      return;
    }

    console.log('Setting vendor ID for redeem:', ownerId);
    setVendorId(ownerId);
    setRedeemTrigger(prev => prev + 1);
  };



  const handleManualScan = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Toast.show({ type: 'error', text1: t('location_denied') });
      return;
    }

    setIsLoadingShop(true);

    Geolocation.getCurrentPosition(
      async position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        console.log('📍 User Location:', {
          latitude: userLat,
          longitude: userLng,
        });

        try {
          const result = await scanShop({
            shopId: _id,
            latitude: userLat,
            longitude: userLng,
          }).unwrap();

          if (result?.success) {
            Toast.show({
              type: 'success',
              text1: t('scanSuccessful'),
            });

            if (result.data?.scanRewardType === 'percentage') {
              navigation.navigate('CashbackScreen', {
                shopId: _id,
                returnPercent: result.data?.rewardPoints,
              });
            } else {
              navigation.goBack();
            }
          } else {
            Toast.show({ type: 'error', text1: t('scan_failed_try') });
          }
        } catch (err) {
          Toast.show({ type: 'error', text1: err?.data?.message || 'Error' });
          console.log('❌ Scan error:', err);
        } finally {
          setIsLoadingShop(false);
        }
      },
      error => {
        Toast.show({
          type: 'error',
          text1: t('locationError'),
          text2: error.message,
        });
        setIsLoadingShop(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };


  if (isShopLoading) {
    return (
      <AppLayout>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </AppLayout>
    );
  }

  if (!shop) {
    return (
      <AppLayout>
        <Text style={{ color: '#fff', fontSize: 16 }}>
          {t('shop_data_missing')}
        </Text>
      </AppLayout>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: '#080042' }}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <PageHeader back bg />
      </View>
      {(isLoadingShop || isLoadingVendor) && (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>
            {isLoadingShop ? t('scanning') : t('fetching_points')}
          </Text>
        </View>
      )}

      {showScanSuccess && (
        <View
          style={[styles.resultContainer, { backgroundColor: '#28A745' }]}
        >
          <Text style={styles.resultTitle}>
            {t('scanSuccessful')}
          </Text>
        </View>
      )}
      {showScanError && (
        <View
          style={[styles.resultContainer, { backgroundColor: '#B00020' }]}
        >
          <Text style={styles.resultTitle}>{t('scan_failed', { message: errorMessage })}</Text>
        </View>
      )}


      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        style={{
          backgroundColor: '#080042',
        }}
      >
        {/* QR Code Section */}
        <View style={styles.qrContainer}>
          {/* <ShopQRCode
              shopId={_id}
              email={contact?.email ?? 'no-email'}
              ownerId={owner}
              logo={logo}
            /> */}

          <Image
            source={
              imageError || !cover
                ? require('../../../assets/emptyShop.png')
                : { uri: cover }}
            style={{ width: '100%', height: 350 }}
            onError={(e) => {
              console.warn("Image load error for shop:", shop.name, e.nativeEvent.error);
              setImageError(true);
            }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.8)',]}
            style={styles.textWrapper}
          >
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>{name}</Text>
              <Text style={styles.subtitleText}>{category}</Text>
            </View>
          </LinearGradient>
        </View>
        {/* Shop Details Section */}
        <View style={styles.shopDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('address')}</Text>
            <Text style={styles.detailValue}>{address}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('city')}</Text>
            <Text style={styles.detailValue}>
              {city}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('pincode')}</Text>
            <Text style={styles.detailValue}>
              {pinCode}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('timing')}</Text>
            <Text style={styles.detailValue}>
              {startTime} - {endTime}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('phone')}</Text>
            <Text style={styles.detailValue}>{contact?.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('email')}</Text>
            <Text style={styles.detailValue}>{contact?.email}</Text>
          </View>

        </View>

      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleManualScan}
        >
          <Text style={styles.buttonText}>{t('scan_me')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.redeemButton}
          onPress={() => handleRedeem(owner)}
        >
          <Text style={styles.buttonText}>{t('redeem')}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollContainer: {
    zIndex: 1000,
    flexGrow: 1,
    backgroundColor: '#080042',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

  },
  textWrapper: {
    position: "absolute",
    borderRadius: 8,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  textContainer: {
    paddingBottom: RFValue(90, SCREEN_HEIGHT),
    paddingHorizontal: wp(5),
  },
  titleText: {
    fontSize: RFValue(25),
    fontFamily: "Poppins-SemiBold",
    color: '#fff',               // White for better visibility
  },
  subtitleText: {
    fontSize: RFValue(16),
    color: '#f5f5f5',
    marginTop: 4,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrContainer: {

  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: Colors.tertiary,
    flex: 1,
    padding: wp(5),
  },
  redeemButton: {
    backgroundColor: Colors.quinary,
    flex: 1,
    padding: wp(5),
  },
  buttonText: {
    color: '#fff',
    fontSize: RFValue(16, SCREEN_HEIGHT),
    textAlign: 'center',
    fontFamily: Fonts.primary_SemiBold,
    lineHeight: RFValue(24, SCREEN_HEIGHT),
  },
  shopDetails: {
    flex: 1,
    backgroundColor: '#080042',
    paddingHorizontal: wp(3),
    marginTop: -70,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: hp(5),
    zIndex: 1000,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
    flexWrap: 'wrap',
  },
  detailLabel: {
    color: '#999', // light gray
    fontFamily: 'Poppins-Regular',
    fontSize: wp(4),
    maxWidth: '45%',
  },
  detailValue: {
    color: '#fff',
    fontFamily: Fonts.primary_Regular,
    fontSize: RFValue(14, SCREEN_HEIGHT),
    textAlign: 'right',
    maxWidth: '50%',
  },

});

export default ShopDetails;