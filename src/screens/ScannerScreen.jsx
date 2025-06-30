import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Animated, Easing } from 'react-native';
import { useRef } from 'react';

import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useLazyGetShopByIdQuery } from '../features/shops/shopApi';
import { useDispatch } from 'react-redux';
import { triggerWalletRefresh } from '../features/wallet/walletSlice'; // ✅ use correct path


const ScannerScreen = ({ navigation }) => {


  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [latestScannedData, setLatestScannedData] = useState(null);
  const [hasScanned, setHasScanned] = useState(false)
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [showScanError, setShowScanError] = useState(false);
  const [isLoadingShop, setIsLoadingShop] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const dispatch = useDispatch();

  const scanLineAnim = useRef(new Animated.Value(0)).current;

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
    ])
  );
  animation.start();

  return () => animation.stop(); // cleanup on unmount
}, []);


  const handleScanSuccess = (scannedData) => {
    setLatestScannedData(scannedData);
    setShowScanSuccess(true);

    setTimeout(() => {
      setShowScanSuccess(false);
    }, 2000); // hide after 2 seconds
  };
  const handleScanError = () => {
    setShowScanError(true);
    setTimeout(() => setShowScanError(false), 2000);
  };



  const [fetchShopById, { data: shopData, isLoading, isError, error }] = useLazyGetShopByIdQuery();

  useEffect(() => {
    requestPermission();
  }, []);
  //   console.log("useLazyGetById", useLazyGetShopByIdQuery())

  useEffect(() => {
    console.log("This is shop data", shopData)
    if (shopData) {
      //   navigation.navigate('ShopDetails', { shop: shopData });
    }
  }, [shopData]);
  let err = ''

  const handleShopFetch = async (id) => {
    try {
      setIsLoadingShop(true);
      const result = await fetchShopById(id).unwrap();
      console.log("Fetched shop data directly from unwrap:", result.data.shop);
      navigation.navigate('ShopDetails', { shop: result.data.shop });
      dispatch(triggerWalletRefresh());
      setTimeout(() => {
        navigation.navigate('ShopDetails', { shop: result.data.shop });
        setIsLoadingShop(false);
      }, 1000);
    } catch (fetchError) {
      console.log("Error fetching shop by ID:", err);
      setIsLoadingShop(false);
      const message = fetchError?.data?.message || 'Something went wrong';
      setErrorMessage(message);
      setShowScanError(true);
      setTimeout(() => setShowScanError(false), 2000);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (hasScanned) return;
      const scannedValue = codes[0].value
      console.log("Raw scanned data:", scannedValue);

      const params = new URLSearchParams(scannedValue)
      const shop_id = params.get('shop_id')

      if (shop_id) {
        console.log("Extracted shop_id:", shop_id);
        setHasScanned(true);
        handleShopFetch(shop_id);
        handleScanSuccess(shop_id);
      } else {
        console.log("shop_id not found in QR code");
        handleScanError();
      }

    },
  });

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Device Not Found</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      <View style={styles.frame}>
        {/* <View style={styles.centerView}></View> */}
        <View style={styles.frame}>
  <Animated.View
    style={[
      styles.scanLine,
      {
        transform: [
          {
            translateY: scanLineAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // adjust frameHeight as needed
            }),
          },
        ],
      },
    ]}
  />

        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
      </View>

      {showScanError && (
        <View style={[styles.resultContainer, { backgroundColor: '#B00020' }]}>
          <Text style={styles.resultTitle}>❌ {errorMessage}</Text>
        </View>
      )}
      {isLoadingShop && (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>Loading shop details...</Text>
        </View>
      )}


    </View>
  );
};

export default ScannerScreen;

// const frameHeight = 300;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerView:{
    width:"60%",
    height:"60%",
    backgroundColor:"white"
  },
 frame: {
    width: 200,
    height: 200,
    borderColor: 'orange',
    position: 'absolute',
    alignSelf: 'center',
  },
  scanLine: {
    position: 'absolute',
    width: '85%',
    height: 2,
    alignSelf:"center",
    backgroundColor: 'orange',
  },
  corner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderColor: 'orange',
    borderRadius:5
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 20,
    borderTopWidth: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 20,
    borderTopWidth: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 20,
    borderBottomWidth: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 20,
    borderBottomWidth: 20,
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

});
