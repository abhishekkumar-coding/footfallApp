
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hp, wp } from '../../utils/dimensions';
import ShopQRCode from './ShopQRCode';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  useGetShopOffersByIdQuery,
  useGetShopByScanMutation,
  useGetTotalPointsByVendorQuery,
} from '../../features/shops/shopApi';
import { useDispatch } from 'react-redux';
import { triggerWalletRefresh } from '../../features/auth/walletSlice';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../components/BackButton';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
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
}

const ShopDetails = ({ route }) => {
  const navigation = useNavigation();
  const { shop } = route.params;

  const [sortBy, setSortBy] = useState('Latest');
  const dispatch = useDispatch();
  const [isLoadingShop, setIsLoadingShop] = useState(false);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [showScanError, setShowScanError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [vendorId, setVendorId] = useState(null);
  const [redeemTrigger, setRedeemTrigger] = useState(0);

  const {
    data,
    isLoading: isLoadingVendor,
    error,
  } = useGetTotalPointsByVendorQuery(
    { vendorId, redeemTrigger },
    { skip: !vendorId },
  );
  const [scanShop] = useGetShopByScanMutation();
  const {
    data: offersData,
    isLoading: isLoadingOffers,
    error: offersError,
  } = useGetShopOffersByIdQuery(shop?._id);

  console.log('Shop Data : ', shop.cover);
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
    owner,
  } = shop || {};

  console.log('Shop Details', shop);

  useEffect(() => {
    if (data) {
      console.log('Fetched vendor points:', data);
      setShowScanSuccess(true);

      setTimeout(() => {
        setShowScanSuccess(false);
        navigation.navigate('RedeemSummaryScreen', {
          vendorDetails: data.data,
        });
      }, 1000);
    } else if (error) {
      console.log('Error fetching vendor points:', error);
      setErrorMessage(error?.data?.message || 'Something went wrong');
      setShowScanError(true);
      setTimeout(() => {
        setShowScanError(false);
        navigation.goBack();
      }, 1000);
    }
  }, [data, error, navigation]);

  useEffect(() => {
    if (offersData) {
      console.log('Shop offers:', offersData);
    }
  }, [offersData]);

  const handleRedeem = ownerId => {
    console.log('Setting vendor ID for redeem:', ownerId);
    setVendorId(ownerId);
    setRedeemTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (offersData) {
      console.log('Shop offers:', offersData);
    }
  }, [offersData]);


  const handleManualScan = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Toast.show({ type: 'error', text1: 'Location permission denied' });
      return;
    }

    setIsLoadingShop(true);

    Geolocation.getCurrentPosition(
      async position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        console.log('📍 Your Current Location:', {
          latitude: userLat,
          longitude: userLng,
        });

        // Extract shop lat/lng
        const [shopLng, shopLat] = shop?.location?.coordinates || [];
        console.log('🏪 Shop Location:', {
          latitude: shopLat,
          longitude: shopLng,
        });

        const scanRadius = 50;
        const bufferDistance = 100;
        const effectiveRadius = scanRadius + bufferDistance;

        const distance = getDistanceInMeters(
          userLat,
          userLng,
          shopLat,
          shopLng,
        );
        console.log(`🧭 Distance to shop: ${Math.round(distance)}m`);

        if (distance > effectiveRadius) {
          Toast.show({
            type: 'error',
            text1: `You're ${Math.round(distance)}m away.`,
            text2: `Move closer to within ${effectiveRadius}m to scan.`,
          });
          setIsLoadingShop(false);
          return;
        }

        try {
          const result = await scanShop({
            shopId: _id,
            latitude: userLat,
            longitude: userLng,
          }).unwrap();

          if (result?.success) {
            Toast.show({
              type: 'success',
              text1: 'Scan successful!',
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
            Toast.show({ type: 'error', text1: 'Scan failed. Try again.' });
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
          text1: 'Location error',
          text2: error.message,
        });
        setIsLoadingShop(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  if (!shop) {

    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>
          Shop data not available. Please try scanning again.
        </Text>
      </View>
    );
  }

  return (

    <LinearGradient
      colors={['#000337', '#000000']}
      style={{ flex: 1 }}
    >
      <PageHeader  back bg/>
      {/* Loading and status indicators */}
      {(isLoadingShop || isLoadingVendor) && (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>
            {isLoadingShop ? 'Scanning...' : 'Fetching vendor points...'}
          </Text>
        </View>
      )}

      {showScanSuccess && (
        <View
          style={[styles.resultContainer, { backgroundColor: '#28A745' }]}
        >
          <Text style={styles.resultTitle}>
            ✅ Shop scanned successfully!
          </Text>
        </View>
      )}
      {showScanError && (
        <View
          style={[styles.resultContainer, { backgroundColor: '#B00020' }]}
        >
          <Text style={styles.resultTitle}>❌ {errorMessage}</Text>
        </View>
      )}

      <View style={styles.gradientContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
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
              source={{ uri: cover }}
              style={{ width: '100%', height: 350 }}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleManualScan}
              >
                <Text style={styles.buttonText}>Scan me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.redeemButton}
                onPress={() => handleRedeem(owner)}
              >
                <Text style={styles.buttonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Shop Details Section */}
          <View style={styles.shopDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{category}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shop Name</Text>
              <Text style={styles.detailValue}>{name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{address}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>City</Text>
              <Text style={styles.detailValue}>
                {city}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pincode</Text>
              <Text style={styles.detailValue}>
                {pinCode}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Timings</Text>
              <Text style={styles.detailValue}>
                {startTime} - {endTime}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{contact?.phone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{contact?.email}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    position:"absolute",
    top:0,
    right:0,
    left:0
  },
  scrollContainer: {
    paddingBottom: hp(5),
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
    alignItems: 'center',
    // paddingTop: hp(2),
    // paddingBottom: hp(2),
  },
  buttonRow: {
    position: 'absolute',
    bottom: 90,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: hp(2),
    gap: wp(10),
  },
  scanButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(10),
    borderRadius: 50,
  },
  redeemButton: {
    backgroundColor: '#FF7043',
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(10),
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  shopDetails: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: wp(3),
    paddingTop: hp(5),
    paddingBottom: hp(40),
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -70,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
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
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp(3.4),
    textAlign: 'right',
    maxWidth: '50%',
  },

  offerSection: {
    marginTop: hp(2),
  },
  offerHeader: {
    fontSize: wp(5.5),
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    marginBottom: hp(0.5),
  },
  offerSubtext: {
    fontSize: wp(3.8),
    color: '#555',
    marginBottom: hp(1.5),
    fontFamily: 'Poppins-Regular',
  },
  sortContainer: {
    flexDirection: 'row',
    gap: wp(4),
    marginBottom: hp(2),
  },
  sortOption: {
    fontSize: wp(3.8),
    color: '#3B63EF',
    fontFamily: 'Poppins-Regular',
  },
  activeSortOption: {
    fontFamily: 'Poppins-SemiBold',
    textDecorationLine: 'underline',
  },
  offerCard: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  offerTitle: {
    fontSize: wp(4.2),
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: hp(0.5),
  },
  offerDetails: {
    fontSize: wp(3.8),
    color: '#555',
    fontFamily: 'Poppins-Regular',
    marginBottom: hp(0.3),
  },
});

export default ShopDetails;