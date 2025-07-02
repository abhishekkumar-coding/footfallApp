import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
} from 'react-native-vision-camera';
import LinearGradient from 'react-native-linear-gradient';
import { useGetTotalPointsByVendorQuery } from '../features/shops/shopApi';

const RedeemScanner = ({ navigation }) => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    const [hasScanned, setHasScanned] = useState(false);
    const [vendorId, setVendorId] = useState(null);
    const [showScanSuccess, setShowScanSuccess] = useState(false);
    const [showScanError, setShowScanError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const scanLineAnim = useRef(new Animated.Value(0)).current;

    const { data, isLoading, error } = useGetTotalPointsByVendorQuery(vendorId, {
        skip: !vendorId,
    });

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
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [scanLineAnim]);

    useEffect(() => {
        if (data) {
            console.log("Fetched vendor points:", data);
            setShowScanSuccess(true);
            setTimeout(() => {
                setShowScanSuccess(false);
                navigation.navigate("RedeemSummaryScreen", { vendorDetails: data.data });
            }, 1000);
        } else if (error) {
            console.log("Error fetching vendor points:", error);
            setErrorMessage(error?.data?.message || 'Something went wrong');
            setShowScanError(true);
            setTimeout(() => {
                setShowScanError(false);
                navigation.goBack();
            }, 1000);
        }
    }, [data, error, navigation]);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (hasScanned || !codes.length) return;
            const scannedValue = codes[0].value;
            console.log("Scanned QR data:", scannedValue);

            const params = new URLSearchParams(scannedValue);
            const extractedVendorId = params.get('owner');
            console.log("Extracted Vendor ID:", extractedVendorId);

            if (extractedVendorId) {
                setHasScanned(true);
                setVendorId(extractedVendorId);
            } else {
                setErrorMessage("Vendor ID not found in QR");
                setShowScanError(true);
                setTimeout(() => setShowScanError(false), 2000);
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
                    <Text style={styles.loaderText}>Fetching Vendor Data...</Text>
                </View>
            )}
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
        position: "absolute",
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
    topLeft: { top: 0, left: 0, borderLeftWidth: 20, borderTopWidth: 20 },
    topRight: { top: 0, right: 0, borderRightWidth: 20, borderTopWidth: 20 },
    bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 20, borderBottomWidth: 20 },
    bottomRight: { bottom: 0, right: 0, borderRightWidth: 20, borderBottomWidth: 20 },
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
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
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
