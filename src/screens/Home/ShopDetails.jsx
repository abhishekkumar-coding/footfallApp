import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

  const {
    contact,
    _id,
    category,
    name,
    startTime,
    endTime,
    logo,
    address,
    city,
    state,
    pinCode,
    owner,
  } = shop || {};

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

  const sampleOffers = [
    {
      id: '1',
      title: 'Flat 20% Off on All Items',
      details: 'Valid till: 2025-06-25',
      expiryDate: '2025-06-25',
      distance: 1.5, // in km
    },
    {
      id: '2',
      title: 'Buy 1 Get 1 Free (Selected Products)',
      details: 'Valid till: 2025-06-30',
      expiryDate: '2025-06-30',
      distance: 0.8,
    },
    {
      id: '3',
      title: 'Free Delivery on Orders Above ₹499',
      details: 'Valid till: 2025-07-05',
      expiryDate: '2025-07-05',
      distance: 2.2,
    },
    {
      id: '4',
      title: '30% Off for First-Time Customers',
      details: 'Valid till: 2025-07-15',
      expiryDate: '2025-07-15',
      distance: 1.0,
    },
  ];

  const getSortedOffers = () => {
    if (!offersData || !Array.isArray(offersData)) return [];

    const sortedOffers = [...offersData];

    if (sortBy === 'Ending Soon') {
      return sortedOffers.sort(
        (a, b) => new Date(a.endTime) - new Date(b.endTime),
      );
    } else {
      // Latest: reverse order by startTime
      return sortedOffers.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime),
      );
    }
  };

  const handleManualScan = async () => {
    try {
      setIsLoadingShop(true);
      const result = await scanShop(_id).unwrap();
      console.log(result?.status === 400)
      console.log('Fetched shop data directly from unwrap:', result);
        if (result?.success) {
            
            Toast.show({
              type: 'success',
              text1: 'Scan Successfully!',
          
            });
            // setShowScanSuccess(true);
            dispatch(triggerWalletRefresh());
        }
       
        else{
              Toast.show({
              type: 'error',
              text1: 'Scan Error Try Again',
          
            });
        }
    //   navigation.goBack();
      setTimeout(() => setShowScanSuccess(false), 1000);
    } catch (fetchError) {
         if(fetchError?.status === 400){
              Toast.show({
              type: 'error',
              text1: fetchError?.data?.message,
          
            });
        }
      console.log('Error fetching shop by ID:', fetchError);
    //   const message = fetchError?.data?.message || 'Something went wrong';
    //   setErrorMessage(message);
    //   setShowScanError(true);
      setTimeout(() => setShowScanError(false), 2000);
    } finally {
      setIsLoadingShop(false);
    }
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
    <>
      <PageHeader lable={'Shop Details'} back />
      <LinearGradient
        colors={['#000337', '#000000']}
        style={styles.gradientContainer}
      >
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

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* QR Code Section */}
          <View style={styles.qrContainer}>
            <ShopQRCode
              shopId={_id}
              email={contact?.email ?? 'no-email'}
              ownerId={owner}
              logo={logo}
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
            <Text style={styles.category}>{category}</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{name}</Text>
            </View>
            <Text style={styles.location}>📍 {address}</Text>
            <Text style={styles.address}>
              🏠 {city}, {state}, {pinCode}
            </Text>
            <Text style={styles.timings}>
              🕒 {startTime} - {endTime}
            </Text>
            <Text style={styles.contact}>📞 {contact?.phone}</Text>

            {/* Offers Section */}
            <View style={styles.offerSection}>
              <Text style={styles.offerHeader}>🎁 Offers & Deals</Text>
              <Text style={styles.offerSubtext}>
                View all active offers of a shop
              </Text>

              <View style={styles.sortContainer}>
                {['Latest', 'Ending Soon', 'Distance'].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSortBy(option)}
                  >
                    <Text
                      style={[
                        styles.sortOption,
                        sortBy === option && styles.activeSortOption,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {getSortedOffers().map(offer => (
                <View key={offer._id || offer.shopId} style={styles.offerCard}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDetails}>{offer.description}</Text>
                  <Text style={styles.offerDetails}>
                    🗓️ Valid: {new Date(offer.startTime).toLocaleDateString()} -{' '}
                    {new Date(offer.endTime).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
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
    paddingTop: hp(2),
    paddingBottom: hp(2),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
    gap: wp(4),
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
    backgroundColor: '#fff',
    marginTop: hp(2),
    paddingTop: hp(3),
    paddingBottom: hp(5),
    paddingHorizontal: wp(5),
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  title: {
    fontSize: wp(6),
    color: '#000',
    fontFamily: 'Poppins-Bold',
    marginBottom: hp(0.5),
  },
  category: {
    color: '#3B63EF',
    fontSize: wp(4),
    marginBottom: hp(0.5),
    fontFamily: 'Poppins-SemiBold',
  },
  location: {
    color: '#000',
    fontSize: wp(4),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp(0.5),
  },
  address: {
    color: '#000',
    fontSize: wp(4),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp(0.5),
  },
  timings: {
    color: '#000',
    fontSize: wp(4),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp(0.5),
  },
  contact: {
    color: '#3B63EF',
    fontSize: wp(4),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: hp(1),
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
