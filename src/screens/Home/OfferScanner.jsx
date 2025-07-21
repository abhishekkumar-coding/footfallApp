import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Animated, Easing } from 'react-native';
import { useRef } from 'react';

import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useScanOfferMutation } from '../../features/shops/shopApi';
import LinearGradient from 'react-native-linear-gradient';
import PageHeader from '../../components/BackButton';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const OfferScanner = ({ navigation }) => {
  const { t } = useTranslation();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [hasScanned, setHasScanned] = useState(false);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [showScanError, setShowScanError] = useState(false);
  const [isLoadingShop, setIsLoadingShop] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [id, setId] = useState(null);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [scanOffer] = useScanOfferMutation();

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [scanLineAnim]);

  //   const handleShopFetch = async (shop) => {
  //     const hasPermission = await requestLocationPermission();

  //     if (!hasPermission) {
  //       Toast.show({ type: 'error', text1: 'Location permission denied' });
  //       return;
  //     }

  //     setIsLoadingShop(true);

  //     Geolocation.getCurrentPosition(
  //       async position => {
  //         const userLat = position.coords.latitude;
  //         const userLng = position.coords.longitude;
  //         console.log('📍 Your Current Location:', {
  //           latitude: userLat,
  //           longitude: userLng,
  //         });

  //         // Extract shop lat/lng
  //         const [shopLng, shopLat] = shop?.location?.coordinates || [];
  //         console.log('🏪 Shop Location:', {
  //           latitude: shopLat,
  //           longitude: shopLng,
  //         });

  //         const scanRadius = 50;
  //         const bufferDistance = 100;
  //         const effectiveRadius = scanRadius + bufferDistance;

  //         const distance = getDistanceInMeters(
  //           userLat,
  //           userLng,
  //           shopLat,
  //           shopLng,
  //         );
  //         console.log(`🧭 Distance to shop: ${Math.round(distance)}m`);

  //         if (distance > effectiveRadius) {
  //           Toast.show({
  //             type: 'error',
  //             text1: `You're ${Math.round(distance)}m away.`,
  //             text2: `Move closer to within ${effectiveRadius}m to scan.`,
  //           });
  //           setIsLoadingShop(false);
  //           return;
  //         }

  //         try {
  //           const result = await scanShop({
  //             shopId: shop._id,
  //             latitude: userLat,
  //             longitude: userLng,
  //           }).unwrap();

  //           if (result?.success) {
  //             Toast.show({
  //               type: 'success',
  //               text1: 'Scan successful!',
  //             });

  //             if (result.data?.scanRewardType === 'percentage') {
  //               navigation.navigate('CashbackScreen', {
  //                 shopId: shop._id,
  //                 returnPercent: result.data?.rewardPoints,
  //               });

  //             } else {
  //               navigation.goBack();
  //             }
  //           } else {
  //             Toast.show({ type: 'error', text1: 'Scan failed. Try again.' });
  //           }
  //         } catch (err) {
  //           Toast.show({ type: 'error', text1: err?.data?.message || 'Error' });
  //           console.log('❌ Scan error:', err);
  //         } finally {
  //           setIsLoadingShop(false);
  //         }
  //       },
  //       error => {
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Location error',
  //           text2: error.message,
  //         });
  //         setIsLoadingShop(false);
  //       },
  //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
  //     );
  //   };

  const handleOfferScan = async offerId => {
    if (hasScanned) return;

    setIsLoadingShop(true);
    try {
      const result = await scanOffer(offerId).unwrap();
      console.log('Scaned Offer Details: ', result);

      if (result?.success) {
        Toast.show({
          type: 'success',
          text1: t('offerScanned'),
        });

        setHasScanned(true);

        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message || t('scanFailed'),
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('somethingWentWrong'),
        text2: error?.data?.message || t('pleaseTryAgain'),
      });
      console.error('❌ Scan error:', error);
    } finally {
      setIsLoadingShop(false);
    }
  };

  const handleScanError = () => {
    setShowScanError(true);
    setTimeout(() => setShowScanError(false), 2000);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (hasScanned || !codes.length) return;

      const scannedValue = codes[0].value;
      console.log('Scanned QR data:', scannedValue);

      const params = new URLSearchParams(scannedValue);
      const extractedIdFromQr = params.get('offer_id');

      if (extractedIdFromQr) {
        setId(extractedIdFromQr);
        console.log('Extracted offer_id:', extractedIdFromQr);
        setHasScanned(true);
        handleOfferScan(extractedIdFromQr);
      } else {
        console.log('shop_id not found in QR code');
        handleScanError();
      }
    },
  });

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>{t('deviceNotFound')}</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>{t('requestingCameraPermission')}</Text>
      </View>
    );
  }

  return (
    <>
      <PageHeader lable={t('scanQR')} back />
      <View style={styles.container}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          codeScanner={codeScanner}
        />

        <View style={styles.frame}>
          <Animated.View
            style={[
              styles.scanLineContainer,
              {
                transform: [
                  {
                    translateY: scanLineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 240],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#00f6ff', '#00ffe0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scanLine}
            />
          </Animated.View>

          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {showScanSuccess && (
          <View
            style={[styles.resultContainer, { backgroundColor: '#00C853' }]}
          >
            <Text style={styles.resultTitle}>✅ {t('scanSuccessful')}</Text>
          </View>
        )}

        {showScanError && (
          <View
            style={[styles.resultContainer, { backgroundColor: '#B00020' }]}
          >
            <Text style={styles.resultTitle}>{t('scanFailed')}</Text>
          </View>
        )}

        {isLoadingShop && (
          <View style={styles.loaderContainer}>
            <Text style={styles.loaderText}>{t('scanning')}</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default OfferScanner;

// const frameHeight = 300;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerView: {
    width: '60%',
    height: '60%',
    backgroundColor: 'white',
  },
  frame: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderColor: '#FF4D00',
    // borderWidth:10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  scanLineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
  },

  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 3,
    leftL: 0,
    backgroundColor: 'linear-gradient(90deg, #00f6ff, #00ffe0)',
    shadowColor: '#00ffe0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 20,
  },
  corner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderColor: '#FF4D00',
    borderRadius: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 5,
    borderTopWidth: 5,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 5,
    borderTopWidth: 5,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 5,
    borderBottomWidth: 5,
  },
  resultContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: '#333',
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

  resultText: {
    fontSize: 14,
    color: 'white',
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

  tabBar: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabButtonsContainer: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-around',
    backgroundColor: '#111',
    borderWidth: 0.5,
    borderColor: '#fff',
    paddingVertical: 5,
    borderRadius: 35,
    alignItems: 'center',
  },

  tabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTabButton: {
    backgroundColor: '#FF4D00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabText: {
    color: '#ccc',
    fontSize: 20,
    textAlign: 'center',
  },

  activeTabText: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  historyTitle: {
    fontSize: 24,
    color: '#FF4D00',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  historyEmpty: {
    color: '#999',
    fontSize: 16,
  },
  historyItem: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  historyText: {
    color: '#fff',
    fontSize: 14,
  },
  historyDate: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
});
