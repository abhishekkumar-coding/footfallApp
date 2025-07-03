import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';
import { useGetTotalPointsByVendorQuery } from '../features/shops/shopApi';
import Toast from 'react-native-toast-message';

const RedeemScanner = ({ navigation }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [hasScanned, setHasScanned] = useState(false);
  const [vendorId, setVendorId] = useState(null);
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  const [showScanError, setShowScanError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const { data, isLoading, error, refetch } = useGetTotalPointsByVendorQuery(
    vendorId,
    {
      skip: !vendorId,
    },
  );
 
  
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

  useEffect(() => {
    if (data) {
      console.log('Fetched vendor points:', data);
      // setShowScanSuccess(true);
      Toast.show({
        type: 'success',
        text1: 'Vendor Found',
        text2: 'Successfully retrieved vendor information',
      });
      setTimeout(() => {
        setShowScanSuccess(false);
        navigation.navigate('RedeemSummaryScreen', {
          vendorDetails: data.data,
        });
      }, 1000);
    } else if (error) {
       
      console.log('Error fetching vendor points:', error);
      const message = error?.data?.message || 'Something went wrong';
      setErrorMessage(message);
      setShowScanError(true);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
        visibilityTime: 2000,
      });
      setTimeout(() => {
        setShowScanError(false);
        navigation.goBack();
      }, 1000);
    }
  }, [data, error, navigation,vendorId]);

  const handleScanError = (message = 'Vendor ID not found in QR') => {
    setErrorMessage(message);
    setShowScanError(true);
    Toast.show({
      type: 'error',
      text1: 'Scan Error',
      text2: message,
      visibilityTime: 2000,
    });
    setTimeout(() => setShowScanError(false), 2000);
  };

const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
        if (hasScanned || !codes.length || !codes[0].value) return;
        const scannedValue = codes[0].value;
        console.log("Scanned QR data:", scannedValue);

        try {
            let extractedVendorId = null;
            
            // Try to parse as URL first
            if (scannedValue.startsWith('http')) {
                const url = new URL(scannedValue);
                extractedVendorId = url.searchParams.get('owner');
            } 
            // Try to parse as JSON
            else if (scannedValue.startsWith('{') || scannedValue.startsWith('[')) {
                try {
                    const jsonData = JSON.parse(scannedValue);
                    extractedVendorId = jsonData.owner || jsonData.vendorId || jsonData.id;
                } catch (jsonError) {
                    console.log("Not a valid JSON format");
                }
            }
            // Fallback to query string parsing
            else {
                // Handle cases where the QR might be "owner=123" or "vendor_id=123"
                const params = new URLSearchParams(scannedValue.includes('?') 
                    ? scannedValue.split('?')[1] 
                    : scannedValue);
                
                extractedVendorId = params.get('owner') || params.get('vendor_id') || params.get('vendorId');
            }

            console.log("Extracted Vendor ID:", extractedVendorId);

            if (extractedVendorId) {
                setHasScanned(true);
                setVendorId(extractedVendorId);
                console.log("Vendor ID set:", extractedVendorId);
                
                Toast.show({
                    type: 'info',
                    text1: 'Scanning',
                    text2: 'Fetching vendor information...',
                    visibilityTime: 1000,
                });
            } else {
                handleScanError("No valid vendor ID found in QR code");
            }
        } catch (e) {
            console.log("Error parsing QR code:", e);
            handleScanError("Invalid QR code format");
        }
    },
});

  if (!device) {
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
        <View style={[styles.resultContainer, { backgroundColor: '#00C853' }]}>
          <Text style={styles.resultTitle}>✅ Scan Successful!</Text>
        </View>
      )}

      {showScanError && (
        <View style={[styles.resultContainer, { backgroundColor: '#B00020' }]}>
          <Text style={styles.resultTitle}>❌ {errorMessage}</Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF4D00" />
          <Text style={styles.loaderText}>Fetching Vendor Data...</Text>
        </View>
      )}

      <Toast />
    </View>
  );
};

export default RedeemScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderColor: '#FF4D00',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scanLineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
  },
  scanLine: {
    width: '100%',
    height: 3,
  },
  corner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderColor: '#FF4D00',
  },
  topLeft: { top: 0, left: 0, borderLeftWidth: 5, borderTopWidth: 5 },
  topRight: { top: 0, right: 0, borderRightWidth: 5, borderTopWidth: 5 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 5, borderBottomWidth: 5 },
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 999,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
