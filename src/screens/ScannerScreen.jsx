import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  
const dispatch = useDispatch();


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

  const handleShopFetch = async (id) => {
    try {
      const result = await fetchShopById(id).unwrap();
      console.log("Fetched shop data directly from unwrap:", result.data.shop);
      navigation.navigate('ShopDetails', { shop: result.data.shop });
      dispatch(triggerWalletRefresh());
    } catch (err) {
      console.log("Error fetching shop by ID:", err);
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

      {showScanSuccess && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>✅ Scanned Data Successfully!</Text>
        </View>
      )}
      {showScanError && (
        <View style={[styles.resultContainer, { backgroundColor: '#B00020' }]}>
          <Text style={styles.resultTitle}>❌ Invalid QR Code or Shop Not Found</Text>
        </View>
      )}

    </View>
  );
};

export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
